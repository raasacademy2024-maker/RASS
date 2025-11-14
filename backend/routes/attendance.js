import express from 'express';
import Attendance from '../models/Attendance.js';
import Batch from '../models/Batch.js';
import Enrollment from '../models/Enrollment.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get attendance for a batch
router.get('/batch/:batchId', authenticate, async (req, res) => {
  try {
    const { batchId } = req.params;
    const { startDate, endDate } = req.query;

    const query = { batch: batchId };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const attendanceRecords = await Attendance.find(query)
      .populate('course', 'title')
      .populate('batch', 'name')
      .populate('session', 'title')
      .populate('records.student', 'name email')
      .populate('records.markedBy', 'name')
      .sort({ date: -1 });

    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get attendance for a student
router.get('/student/:studentId', authenticate, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { courseId, batchId } = req.query;

    // Authorization: students can only view their own, instructors/admins can view any
    if (req.user.role === 'student' && req.user._id.toString() !== studentId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const query = { 'records.student': studentId };
    if (courseId) query.course = courseId;
    if (batchId) query.batch = batchId;

    const attendanceRecords = await Attendance.find(query)
      .populate('course', 'title')
      .populate('batch', 'name')
      .populate('session', 'title')
      .sort({ date: -1 });

    // Filter to only include this student's records
    const studentRecords = attendanceRecords.map(att => {
      const studentRecord = att.records.find(r => r.student.toString() === studentId);
      return {
        _id: att._id,
        course: att.course,
        batch: att.batch,
        session: att.session,
        date: att.date,
        title: att.title,
        description: att.description,
        record: studentRecord
      };
    });

    res.json(studentRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create attendance record (instructor/admin only)
router.post('/', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const { courseId, batchId, sessionId, moduleId, date, title, description, records } = req.body;

    if (!courseId || !batchId || !title) {
      return res.status(400).json({ message: 'Course ID, batch ID, and title are required' });
    }

    // Verify batch exists
    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    const attendance = new Attendance({
      course: courseId,
      batch: batchId,
      session: sessionId,
      module: moduleId,
      date: date || Date.now(),
      title,
      description,
      records: records || [],
      createdBy: req.user._id
    });

    await attendance.save();
    await attendance.populate([
      { path: 'course', select: 'title' },
      { path: 'batch', select: 'name' },
      { path: 'session', select: 'title' },
      { path: 'records.student', select: 'name email' }
    ]);

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark attendance for students (instructor/admin only)
router.put('/:id/mark', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const { records } = req.body; // Array of { studentId, status, remarks }

    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance not found' });
    }

    // Update or add records
    for (const record of records) {
      const existingIndex = attendance.records.findIndex(
        r => r.student.toString() === record.studentId
      );

      const attendanceRecord = {
        student: record.studentId,
        status: record.status,
        markedAt: Date.now(),
        markedBy: req.user._id,
        remarks: record.remarks,
        autoTracked: false
      };

      if (existingIndex >= 0) {
        attendance.records[existingIndex] = attendanceRecord;
      } else {
        attendance.records.push(attendanceRecord);
      }
    }

    await attendance.save();
    await attendance.populate([
      { path: 'records.student', select: 'name email' },
      { path: 'records.markedBy', select: 'name' }
    ]);

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Auto-track attendance from video watching
router.post('/auto-track', authenticate, async (req, res) => {
  try {
    const { courseId, batchId, moduleId, watchDuration, totalDuration } = req.body;

    if (!courseId || !batchId || !moduleId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if student is enrolled in this batch
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
      batch: batchId
    });

    if (!enrollment) {
      return res.status(403).json({ message: 'Not enrolled in this batch' });
    }

    const watchPercentage = totalDuration > 0 
      ? Math.round((watchDuration / totalDuration) * 100) 
      : 0;

    // Find or create attendance record for this module
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({
      course: courseId,
      batch: batchId,
      module: moduleId,
      date: date
    });

    if (!attendance) {
      attendance = new Attendance({
        course: courseId,
        batch: batchId,
        module: moduleId,
        date: date,
        title: `Auto-tracked - Module ${moduleId}`,
        description: 'Automatically tracked from video watching',
        createdBy: req.user._id,
        records: []
      });
    }

    // Update or add student's record
    const existingIndex = attendance.records.findIndex(
      r => r.student.toString() === req.user._id.toString()
    );

    const status = watchPercentage >= 75 ? 'present' : 'absent';
    const attendanceRecord = {
      student: req.user._id,
      status: status,
      markedAt: Date.now(),
      autoTracked: true,
      watchDuration: watchDuration,
      watchPercentage: watchPercentage
    };

    if (existingIndex >= 0) {
      // Update only if new watch percentage is higher
      if (watchPercentage > (attendance.records[existingIndex].watchPercentage || 0)) {
        attendance.records[existingIndex] = attendanceRecord;
      }
    } else {
      attendance.records.push(attendanceRecord);
    }

    await attendance.save();
    res.json({ message: 'Attendance tracked', status, watchPercentage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get attendance statistics for a batch
router.get('/batch/:batchId/stats', authenticate, async (req, res) => {
  try {
    const { batchId } = req.params;
    const { startDate, endDate } = req.query;

    const query = { batch: batchId };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const attendanceRecords = await Attendance.find(query);

    // Calculate overall statistics
    const stats = {
      totalSessions: attendanceRecords.length,
      studentStats: {}
    };

    attendanceRecords.forEach(attendance => {
      attendance.records.forEach(record => {
        const studentId = record.student.toString();
        if (!stats.studentStats[studentId]) {
          stats.studentStats[studentId] = {
            present: 0,
            absent: 0,
            late: 0,
            excused: 0,
            total: 0
          };
        }
        stats.studentStats[studentId][record.status]++;
        stats.studentStats[studentId].total++;
      });
    });

    // Calculate percentages
    Object.keys(stats.studentStats).forEach(studentId => {
      const student = stats.studentStats[studentId];
      student.attendancePercentage = student.total > 0 
        ? Math.round((student.present / student.total) * 100) 
        : 0;
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete attendance record (admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance not found' });
    }

    await attendance.deleteOne();
    res.json({ message: 'Attendance deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
