import express from 'express';
import Batch from '../models/Batch.js';
import Course from '../models/Course.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all batches for a course (admin can see all, others see only active)
router.get('/course/:courseId', async (req, res) => {
  try {
    const query = { course: req.params.courseId };
    
    // Check if request is authenticated and if user is admin
    // Non-admin users and unauthenticated requests only see active batches
    const token = req.headers.authorization?.split(' ')[1];
    let isAdmin = false;
    
    if (token) {
      try {
        const jwt = await import('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const User = (await import('../models/User.js')).default;
        const user = await User.findById(decoded.userId);
        isAdmin = user?.role === 'admin';
      } catch (err) {
        // Token invalid or expired, treat as non-admin
        isAdmin = false;
      }
    }
    
    // Non-admin users only see active batches
    if (!isAdmin) {
      query.isActive = true;
    }
    
    const batches = await Batch.find(query)
      .populate('course', 'title instructor')
      .populate('instructors', 'name email')
      .sort({ startDate: 1 });

    res.json(batches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single batch by ID
router.get('/:id', async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id)
      .populate('course', 'title instructor')
      .populate('instructors', 'name email');

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    res.json(batch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a batch (instructor/admin only)
router.post('/', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const { courseId, name, startDate, endDate, capacity, description, instructors, fees, syllabus, schedule } = req.body;

    // Validate required fields
    if (!courseId || !name || !startDate || !endDate || !capacity) {
      return res.status(400).json({ 
        message: 'Course ID, name, start date, end date, and capacity are required' 
      });
    }

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if instructor owns the course (unless admin)
    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to create batches for this course' });
    }

    // Validate instructors if provided
    if (instructors && instructors.length > 0) {
      const User = (await import('../models/User.js')).default;
      const validInstructors = await User.find({
        _id: { $in: instructors },
        role: { $in: ['instructor', 'admin'] }
      });
      if (validInstructors.length !== instructors.length) {
        return res.status(400).json({ message: 'One or more instructor IDs are invalid' });
      }
    }

    const batch = new Batch({
      course: courseId,
      name,
      startDate,
      endDate,
      capacity,
      description,
      instructors: instructors || [],
      fees: fees || {},
      syllabus: syllabus || [],
      schedule: schedule || {}
    });

    await batch.save();
    res.status(201).json(batch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a batch (instructor/admin only)
router.put('/:id', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id).populate('course');
    
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    // Check if instructor owns the course (unless admin)
    if (req.user.role !== 'admin' && batch.course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this batch' });
    }

    const { name, startDate, endDate, capacity, description, isActive, instructors, fees, syllabus, schedule } = req.body;

    if (name) batch.name = name;
    if (startDate) batch.startDate = startDate;
    if (endDate) batch.endDate = endDate;
    if (capacity !== undefined) {
      // Don't allow reducing capacity below current enrollment
      if (capacity < batch.enrolledCount) {
        return res.status(400).json({ 
          message: `Cannot reduce capacity below current enrollment count (${batch.enrolledCount})` 
        });
      }
      batch.capacity = capacity;
    }
    if (description !== undefined) batch.description = description;
    if (isActive !== undefined) batch.isActive = isActive;
    
    // Handle new fields
    if (instructors !== undefined) {
      // Validate instructors if provided
      if (instructors.length > 0) {
        const User = (await import('../models/User.js')).default;
        const validInstructors = await User.find({
          _id: { $in: instructors },
          role: { $in: ['instructor', 'admin'] }
        });
        if (validInstructors.length !== instructors.length) {
          return res.status(400).json({ message: 'One or more instructor IDs are invalid' });
        }
      }
      batch.instructors = instructors;
    }
    if (fees !== undefined) batch.fees = fees;
    if (syllabus !== undefined) batch.syllabus = syllabus;
    if (schedule !== undefined) batch.schedule = schedule;

    await batch.save();
    res.json(batch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a batch (instructor/admin only)
router.delete('/:id', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id).populate('course');
    
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    // Check if instructor owns the course (unless admin)
    if (req.user.role !== 'admin' && batch.course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this batch' });
    }

    // Check if batch has enrollments
    if (batch.enrolledCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete batch with active enrollments. Deactivate it instead.' 
      });
    }

    await Batch.findByIdAndDelete(req.params.id);
    res.json({ message: 'Batch deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get batch statistics (instructor/admin only)
router.get('/:id/stats', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id).populate('course');
    
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    // Check if instructor owns the course (unless admin)
    if (req.user.role !== 'admin' && batch.course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this batch' });
    }

    const Enrollment = (await import('../models/Enrollment.js')).default;
    const Assignment = (await import('../models/Assignment.js')).default;
    const LiveSession = (await import('../models/LiveSession.js')).default;
    const Forum = (await import('../models/Forum.js')).default;

    // Get enrollments for this batch
    const enrollments = await Enrollment.find({ batch: req.params.id })
      .populate('student', 'name email');

    // Calculate completion stats
    const completedCount = enrollments.filter(e => e.completed).length;
    const averageProgress = enrollments.length > 0
      ? enrollments.reduce((sum, e) => sum + (e.completionPercentage || 0), 0) / enrollments.length
      : 0;

    // Get batch-specific content counts
    const assignmentsCount = await Assignment.countDocuments({ 
      course: batch.course._id, 
      batch: req.params.id 
    });

    const liveSessionsCount = await LiveSession.countDocuments({ 
      course: batch.course._id, 
      batch: req.params.id 
    });

    const forumPostsCount = await Forum.countDocuments({ 
      course: batch.course._id, 
      batch: req.params.id 
    });

    res.json({
      batch: {
        _id: batch._id,
        name: batch.name,
        startDate: batch.startDate,
        endDate: batch.endDate,
        capacity: batch.capacity,
        enrolledCount: batch.enrolledCount,
        isActive: batch.isActive
      },
      stats: {
        totalEnrolled: enrollments.length,
        completedCount,
        inProgressCount: enrollments.length - completedCount,
        averageProgress: Math.round(averageProgress),
        availableSlots: batch.capacity - batch.enrolledCount,
        assignmentsCount,
        liveSessionsCount,
        forumPostsCount
      },
      students: enrollments.map(e => ({
        _id: e.student._id,
        name: e.student.name,
        email: e.student.email,
        enrolledAt: e.enrolledAt,
        progress: e.completionPercentage || 0,
        completed: e.completed,
        completedAt: e.completedAt
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all batches with statistics (instructor/admin only)
router.get('/course/:courseId/stats', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if instructor owns the course (unless admin)
    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const batches = await Batch.find({ course: req.params.courseId })
      .sort({ startDate: 1 });

    const Enrollment = (await import('../models/Enrollment.js')).default;

    const batchStats = await Promise.all(batches.map(async (batch) => {
      const enrollments = await Enrollment.find({ batch: batch._id });
      const completedCount = enrollments.filter(e => e.completed).length;
      const averageProgress = enrollments.length > 0
        ? enrollments.reduce((sum, e) => sum + (e.completionPercentage || 0), 0) / enrollments.length
        : 0;

      return {
        _id: batch._id,
        name: batch.name,
        startDate: batch.startDate,
        endDate: batch.endDate,
        capacity: batch.capacity,
        enrolledCount: batch.enrolledCount,
        isActive: batch.isActive,
        stats: {
          totalEnrolled: enrollments.length,
          completedCount,
          inProgressCount: enrollments.length - completedCount,
          averageProgress: Math.round(averageProgress),
          availableSlots: batch.capacity - batch.enrolledCount
        }
      };
    }));

    res.json(batchStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Transfer students from one batch to another (admin/instructor only)
router.post('/:id/transfer-students', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const { studentIds, targetBatchId } = req.body;

    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ message: 'Student IDs array is required' });
    }

    if (!targetBatchId) {
      return res.status(400).json({ message: 'Target batch ID is required' });
    }

    // Get source and target batches
    const sourceBatch = await Batch.findById(req.params.id).populate('course');
    const targetBatch = await Batch.findById(targetBatchId).populate('course');

    if (!sourceBatch) {
      return res.status(404).json({ message: 'Source batch not found' });
    }

    if (!targetBatch) {
      return res.status(404).json({ message: 'Target batch not found' });
    }

    // Verify both batches belong to the same course
    if (sourceBatch.course._id.toString() !== targetBatch.course._id.toString()) {
      return res.status(400).json({ message: 'Batches must belong to the same course' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && sourceBatch.course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to transfer students' });
    }

    // Check target batch has capacity
    const availableSlots = targetBatch.capacity - targetBatch.enrolledCount;
    if (availableSlots < studentIds.length) {
      return res.status(400).json({ 
        message: `Target batch has only ${availableSlots} available slots, but ${studentIds.length} students need to be transferred` 
      });
    }

    // Check if target batch is active
    if (!targetBatch.isActive) {
      return res.status(400).json({ message: 'Target batch is not active' });
    }

    const Enrollment = (await import('../models/Enrollment.js')).default;

    // Transfer enrollments
    const result = await Enrollment.updateMany(
      {
        student: { $in: studentIds },
        batch: req.params.id,
        course: sourceBatch.course._id
      },
      {
        $set: { batch: targetBatchId }
      }
    );

    // Update batch enrollment counts
    sourceBatch.enrolledCount -= result.modifiedCount;
    targetBatch.enrolledCount += result.modifiedCount;

    await sourceBatch.save();
    await targetBatch.save();

    res.json({
      message: `Successfully transferred ${result.modifiedCount} students`,
      transferredCount: result.modifiedCount,
      sourceBatch: {
        _id: sourceBatch._id,
        name: sourceBatch.name,
        enrolledCount: sourceBatch.enrolledCount
      },
      targetBatch: {
        _id: targetBatch._id,
        name: targetBatch.name,
        enrolledCount: targetBatch.enrolledCount
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Merge two batches (admin only)
router.post('/:id/merge', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { targetBatchId } = req.body;

    if (!targetBatchId) {
      return res.status(400).json({ message: 'Target batch ID is required' });
    }

    const sourceBatch = await Batch.findById(req.params.id).populate('course');
    const targetBatch = await Batch.findById(targetBatchId).populate('course');

    if (!sourceBatch || !targetBatch) {
      return res.status(404).json({ message: 'One or both batches not found' });
    }

    // Verify both batches belong to the same course
    if (sourceBatch.course._id.toString() !== targetBatch.course._id.toString()) {
      return res.status(400).json({ message: 'Batches must belong to the same course' });
    }

    // Check if merge would exceed target batch capacity
    const totalEnrollments = sourceBatch.enrolledCount + targetBatch.enrolledCount;
    if (totalEnrollments > targetBatch.capacity) {
      return res.status(400).json({ 
        message: `Merge would exceed target batch capacity. Total: ${totalEnrollments}, Capacity: ${targetBatch.capacity}. Please increase target batch capacity first.` 
      });
    }

    const Enrollment = (await import('../models/Enrollment.js')).default;
    const Assignment = (await import('../models/Assignment.js')).default;
    const Attendance = (await import('../models/Attendance.js')).default;
    const Announcement = (await import('../models/Announcement.js')).default;

    // Move all enrollments to target batch
    const enrollmentResult = await Enrollment.updateMany(
      { batch: req.params.id },
      { $set: { batch: targetBatchId } }
    );

    // Update batch-specific content
    await Assignment.updateMany(
      { batch: req.params.id },
      { $set: { batch: targetBatchId } }
    );

    await Attendance.updateMany(
      { batch: req.params.id },
      { $set: { batch: targetBatchId } }
    );

    // Update announcements (replace batch reference)
    await Announcement.updateMany(
      { batches: req.params.id },
      { 
        $pull: { batches: req.params.id },
        $addToSet: { batches: targetBatchId }
      }
    );

    // Update target batch enrollment count
    targetBatch.enrolledCount = totalEnrollments;
    await targetBatch.save();

    // Delete source batch
    await Batch.findByIdAndDelete(req.params.id);

    res.json({
      message: `Successfully merged batches. ${enrollmentResult.modifiedCount} students moved.`,
      mergedStudents: enrollmentResult.modifiedCount,
      targetBatch: {
        _id: targetBatch._id,
        name: targetBatch.name,
        enrolledCount: targetBatch.enrolledCount,
        capacity: targetBatch.capacity
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Archive a batch (admin/instructor only)
router.post('/:id/archive', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id).populate('course');
    
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    // Check if instructor owns the course (unless admin)
    if (req.user.role !== 'admin' && batch.course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to archive this batch' });
    }

    batch.isActive = false;
    await batch.save();

    res.json({
      message: 'Batch archived successfully',
      batch: {
        _id: batch._id,
        name: batch.name,
        isActive: batch.isActive
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Restore (unarchive) a batch (admin/instructor only)
router.post('/:id/restore', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id).populate('course');
    
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    // Check if instructor owns the course (unless admin)
    if (req.user.role !== 'admin' && batch.course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to restore this batch' });
    }

    batch.isActive = true;
    await batch.save();

    res.json({
      message: 'Batch restored successfully',
      batch: {
        _id: batch._id,
        name: batch.name,
        isActive: batch.isActive
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get comprehensive batch analytics (admin/instructor only)
router.get('/:id/analytics', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id)
      .populate('course')
      .populate('instructors', 'name email');
    
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    // Check if instructor owns the course OR is assigned to this batch (unless admin)
    const isAssignedInstructor = batch.instructors && batch.instructors.some(
      instructor => instructor._id.toString() === req.user._id.toString()
    );
    
    if (req.user.role !== 'admin' && 
        batch.course.instructor.toString() !== req.user._id.toString() &&
        !isAssignedInstructor) {
      return res.status(403).json({ message: 'Not authorized to view this batch' });
    }

    const Enrollment = (await import('../models/Enrollment.js')).default;
    const Assignment = (await import('../models/Assignment.js')).default;
    const Attendance = (await import('../models/Attendance.js')).default;
    const Quiz = (await import('../models/Quiz.js')).default;
    const LiveSession = (await import('../models/LiveSession.js')).default;

    // Get enrollments with student details
    const enrollments = await Enrollment.find({ batch: req.params.id })
      .populate('student', 'name email')
      .populate('course', 'title modules');

    // Calculate progress statistics
    const progressStats = enrollments.map(e => e.completionPercentage || 0);
    const averageProgress = progressStats.length > 0
      ? progressStats.reduce((sum, p) => sum + p, 0) / progressStats.length
      : 0;

    const completedStudents = enrollments.filter(e => e.completed).length;
    const inProgressStudents = enrollments.length - completedStudents;

    // Get assignment statistics
    const assignments = await Assignment.find({ 
      course: batch.course._id, 
      batch: req.params.id 
    });

    const totalAssignments = assignments.length;
    const assignmentSubmissions = assignments.reduce((sum, a) => sum + a.submissions.length, 0);
    const assignmentGraded = assignments.reduce((sum, a) => {
      return sum + a.submissions.filter(s => s.grade !== undefined).length;
    }, 0);

    // Get attendance statistics
    const attendanceRecords = await Attendance.find({ 
      batch: req.params.id 
    });

    const totalAttendanceSessions = attendanceRecords.length;
    const attendanceStats = attendanceRecords.reduce((acc, record) => {
      const stats = record.getStatistics();
      return {
        totalRecords: acc.totalRecords + stats.total,
        present: acc.present + stats.present,
        absent: acc.absent + stats.absent,
        late: acc.late + stats.late
      };
    }, { totalRecords: 0, present: 0, absent: 0, late: 0 });

    const attendancePercentage = attendanceStats.totalRecords > 0
      ? Math.round((attendanceStats.present / attendanceStats.totalRecords) * 100)
      : 0;

    // Get quiz statistics
    const quizzes = await Quiz.find({ 
      course: batch.course._id, 
      batch: req.params.id 
    });

    const totalQuizzes = quizzes.length;
    const quizAttempts = quizzes.reduce((sum, q) => sum + q.attempts.length, 0);
    const averageQuizScore = quizzes.reduce((sum, q) => {
      const scores = q.attempts.map(a => a.score || 0);
      const avg = scores.length > 0 ? scores.reduce((s, sc) => s + sc, 0) / scores.length : 0;
      return sum + avg;
    }, 0) / (totalQuizzes || 1);

    // Get live session statistics
    const liveSessions = await LiveSession.find({ 
      course: batch.course._id, 
      batch: req.params.id 
    });

    const totalSessions = liveSessions.length;
    const upcomingSessions = liveSessions.filter(s => new Date(s.scheduledAt) > new Date()).length;
    const completedSessions = liveSessions.filter(s => s.status === 'completed').length;

    // Top performers (by progress)
    const topPerformers = enrollments
      .filter(e => e.student)
      .sort((a, b) => (b.completionPercentage || 0) - (a.completionPercentage || 0))
      .slice(0, 10)
      .map(e => ({
        studentId: e.student._id,
        name: e.student.name,
        email: e.student.email,
        progress: e.completionPercentage || 0,
        completed: e.completed,
        enrolledAt: e.enrolledAt
      }));

    // At-risk students (progress < 30%)
    const atRiskStudents = enrollments
      .filter(e => e.student && (e.completionPercentage || 0) < 30)
      .map(e => ({
        studentId: e.student._id,
        name: e.student.name,
        email: e.student.email,
        progress: e.completionPercentage || 0,
        enrolledAt: e.enrolledAt
      }));

    // Calculate revenue if fees are defined
    let revenue = {
      totalPotential: 0,
      collected: 0,
      pending: 0
    };

    if (batch.fees && batch.fees.amount) {
      revenue.totalPotential = batch.fees.amount * enrollments.length;
      // Count completed payments
      const completedPayments = enrollments.filter(e => e.paymentStatus === 'completed').length;
      revenue.collected = batch.fees.amount * completedPayments;
      revenue.pending = revenue.totalPotential - revenue.collected;
    }

    res.json({
      batch: {
        _id: batch._id,
        name: batch.name,
        startDate: batch.startDate,
        endDate: batch.endDate,
        capacity: batch.capacity,
        enrolledCount: batch.enrolledCount,
        isActive: batch.isActive,
        description: batch.description,
        instructors: batch.instructors,
        fees: batch.fees,
        schedule: batch.schedule
      },
      course: {
        _id: batch.course._id,
        title: batch.course.title
      },
      enrollment: {
        total: enrollments.length,
        completed: completedStudents,
        inProgress: inProgressStudents,
        averageProgress: Math.round(averageProgress),
        availableSlots: batch.capacity - batch.enrolledCount
      },
      assignments: {
        total: totalAssignments,
        submissions: assignmentSubmissions,
        graded: assignmentGraded,
        pending: assignmentSubmissions - assignmentGraded
      },
      attendance: {
        totalSessions: totalAttendanceSessions,
        totalRecords: attendanceStats.totalRecords,
        present: attendanceStats.present,
        absent: attendanceStats.absent,
        late: attendanceStats.late,
        attendancePercentage
      },
      quizzes: {
        total: totalQuizzes,
        attempts: quizAttempts,
        averageScore: Math.round(averageQuizScore)
      },
      liveSessions: {
        total: totalSessions,
        upcoming: upcomingSessions,
        completed: completedSessions
      },
      revenue,
      topPerformers,
      atRiskStudents
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all batches assigned to an instructor (instructor only)
router.get('/instructor/my-batches', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const batches = await Batch.find({ 
      instructors: req.user._id 
    })
      .populate('course', 'title')
      .populate('instructors', 'name email')
      .sort({ startDate: -1 });

    res.json(batches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add or remove instructors from a batch (admin only)
router.post('/:id/instructors', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { instructorIds, action } = req.body; // action: 'add' or 'remove'

    if (!instructorIds || !Array.isArray(instructorIds) || instructorIds.length === 0) {
      return res.status(400).json({ message: 'Instructor IDs array is required' });
    }

    if (!action || !['add', 'remove'].includes(action)) {
      return res.status(400).json({ message: 'Action must be either "add" or "remove"' });
    }

    const batch = await Batch.findById(req.params.id);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    // Validate instructors
    const User = (await import('../models/User.js')).default;
    const validInstructors = await User.find({
      _id: { $in: instructorIds },
      role: { $in: ['instructor', 'admin'] }
    });

    if (validInstructors.length !== instructorIds.length) {
      return res.status(400).json({ message: 'One or more instructor IDs are invalid' });
    }

    if (action === 'add') {
      // Add instructors (avoid duplicates)
      instructorIds.forEach(id => {
        if (!batch.instructors.includes(id)) {
          batch.instructors.push(id);
        }
      });
    } else {
      // Remove instructors
      batch.instructors = batch.instructors.filter(
        id => !instructorIds.includes(id.toString())
      );
    }

    await batch.save();
    await batch.populate('instructors', 'name email');

    res.json({
      message: `Successfully ${action === 'add' ? 'added' : 'removed'} ${instructorIds.length} instructor(s)`,
      batch
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
