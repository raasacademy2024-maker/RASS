import express from 'express';
import Certificate from '../models/Certificate.js';
import Enrollment from '../models/Enrollment.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get user certificates
router.get('/my-certificates', authenticate, async (req, res) => {
  try {
    const certificates = await Certificate.find({ student: req.user._id })
      .populate('course', 'title instructor')
      .populate('course.instructor', 'name')
      .populate('batch', 'name startDate endDate')
      .sort({ issuedAt: -1 });

    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate certificate
router.post('/generate', authenticate, async (req, res) => {
  try {
    const { courseId } = req.body;

    // Check if course is completed
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
      completed: true
    });

    if (!enrollment) {
      return res.status(400).json({ message: 'Course not completed yet' });
    }

    // Check if certificate already exists
    const existingCertificate = await Certificate.findOne({
      student: req.user._id,
      course: courseId,
      batch: enrollment.batch || null
    });

    if (existingCertificate) {
      return res.status(400).json({ message: 'Certificate already issued' });
    }

    // Create certificate (include batch if enrollment has one)
    const certificate = new Certificate({
      student: req.user._id,
      course: courseId,
      batch: enrollment.batch,
      completionDate: enrollment.completedAt,
      certificateUrl: `https://certificates.rassacademy.com/${req.user._id}/${courseId}`
    });

    await certificate.save();

    // Update enrollment
    enrollment.certificateIssued = true;
    enrollment.certificateUrl = certificate.certificateUrl;
    await enrollment.save();

    res.status(201).json(certificate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify certificate
router.get('/verify/:certificateId', async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ certificateId: req.params.certificateId })
      .populate('student', 'name email')
      .populate('course', 'title instructor')
      .populate('course.instructor', 'name')
      .populate('batch', 'name startDate endDate');

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    res.json(certificate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin/Instructor - Get eligible students for certificate generation
router.get('/eligible-students/:courseId', authenticate, authorize('admin', 'instructor'), async (req, res) => {
  try {
    const { courseId } = req.params;
    const { batchId } = req.query;

    // For instructor, verify they own the course
    if (req.user.role === 'instructor') {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      if (course.instructor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You can only generate certificates for your own courses' });
      }
    }

    // Build query
    const query = {
      course: courseId,
      completed: true
    };

    if (batchId) {
      query.batch = batchId;
    }

    // Get completed enrollments
    const enrollments = await Enrollment.find(query)
      .populate('student', 'name email')
      .populate('batch', 'name startDate endDate');

    // Get existing certificates for these students
    const studentIds = enrollments.map(e => e.student._id);
    const existingCertificates = await Certificate.find({
      student: { $in: studentIds },
      course: courseId,
      ...(batchId ? { batch: batchId } : {})
    });

    const certificateMap = new Map(
      existingCertificates.map(cert => [cert.student.toString(), cert])
    );

    // Combine enrollment and certificate data
    const eligibleStudents = enrollments.map(enrollment => ({
      _id: enrollment.student._id,
      name: enrollment.student.name,
      email: enrollment.student.email,
      enrollmentId: enrollment._id,
      completedAt: enrollment.completedAt,
      batch: enrollment.batch,
      hasCertificate: certificateMap.has(enrollment.student._id.toString()),
      certificate: certificateMap.get(enrollment.student._id.toString()) || null
    }));

    res.json(eligibleStudents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin/Instructor - Generate certificate for a student
router.post('/generate-for-student', authenticate, authorize('admin', 'instructor'), async (req, res) => {
  try {
    const { studentId, courseId, batchId, grade } = req.body;

    // Validate inputs
    if (!studentId || !courseId) {
      return res.status(400).json({ message: 'Student ID and Course ID are required' });
    }

    // For instructor, verify they own the course
    if (req.user.role === 'instructor') {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      if (course.instructor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You can only generate certificates for your own courses' });
      }
    }

    // Check if enrollment exists and is completed
    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
      ...(batchId ? { batch: batchId } : {}),
      completed: true
    });

    if (!enrollment) {
      return res.status(400).json({ message: 'Student has not completed this course' });
    }

    // Check if certificate already exists
    const existingCertificate = await Certificate.findOne({
      student: studentId,
      course: courseId,
      batch: enrollment.batch || null
    });

    if (existingCertificate) {
      return res.status(400).json({ message: 'Certificate already issued for this student' });
    }

    // Get student details to include name
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Create certificate
    const certificate = new Certificate({
      student: studentId,
      course: courseId,
      batch: enrollment.batch,
      completionDate: enrollment.completedAt,
      grade: grade || 'B',
      certificateUrl: `https://certificates.rassacademy.com/${studentId}/${courseId}`
    });

    await certificate.save();

    // Update enrollment
    enrollment.certificateIssued = true;
    enrollment.certificateUrl = certificate.certificateUrl;
    await enrollment.save();

    // Populate certificate before returning
    await certificate.populate('student', 'name email');
    await certificate.populate('course', 'title instructor');
    await certificate.populate('batch', 'name startDate endDate');

    res.status(201).json({
      message: `Certificate generated successfully for ${student.name}`,
      certificate
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin/Instructor - Bulk generate certificates
router.post('/bulk-generate', authenticate, authorize('admin', 'instructor'), async (req, res) => {
  try {
    const { studentIds, courseId, batchId, grade } = req.body;

    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ message: 'Student IDs array is required' });
    }

    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required' });
    }

    // For instructor, verify they own the course
    if (req.user.role === 'instructor') {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      if (course.instructor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You can only generate certificates for your own courses' });
      }
    }

    const results = {
      success: [],
      failed: [],
      skipped: []
    };

    for (const studentId of studentIds) {
      try {
        // Check enrollment
        const enrollment = await Enrollment.findOne({
          student: studentId,
          course: courseId,
          ...(batchId ? { batch: batchId } : {}),
          completed: true
        });

        if (!enrollment) {
          results.failed.push({
            studentId,
            reason: 'Course not completed'
          });
          continue;
        }

        // Check for existing certificate
        const existingCertificate = await Certificate.findOne({
          student: studentId,
          course: courseId,
          batch: enrollment.batch || null
        });

        if (existingCertificate) {
          results.skipped.push({
            studentId,
            reason: 'Certificate already exists'
          });
          continue;
        }

        // Get student name
        const student = await User.findById(studentId);
        if (!student) {
          results.failed.push({
            studentId,
            reason: 'Student not found'
          });
          continue;
        }

        // Create certificate
        const certificate = new Certificate({
          student: studentId,
          course: courseId,
          batch: enrollment.batch,
          completionDate: enrollment.completedAt,
          grade: grade || 'B',
          certificateUrl: `https://certificates.rassacademy.com/${studentId}/${courseId}`
        });

        await certificate.save();

        // Update enrollment
        enrollment.certificateIssued = true;
        enrollment.certificateUrl = certificate.certificateUrl;
        await enrollment.save();

        results.success.push({
          studentId,
          studentName: student.name,
          certificateId: certificate.certificateId
        });
      } catch (error) {
        results.failed.push({
          studentId,
          reason: error.message
        });
      }
    }

    res.status(200).json({
      message: `Bulk certificate generation completed`,
      summary: {
        total: studentIds.length,
        successful: results.success.length,
        failed: results.failed.length,
        skipped: results.skipped.length
      },
      results
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin/Instructor - Get all certificates for a course
router.get('/course/:courseId', authenticate, authorize('admin', 'instructor'), async (req, res) => {
  try {
    const { courseId } = req.params;
    const { batchId } = req.query;

    // For instructor, verify they own the course
    if (req.user.role === 'instructor') {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      if (course.instructor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You can only view certificates for your own courses' });
      }
    }

    const query = { course: courseId };
    if (batchId) {
      query.batch = batchId;
    }

    const certificates = await Certificate.find(query)
      .populate('student', 'name email')
      .populate('course', 'title')
      .populate('batch', 'name startDate endDate')
      .sort({ issuedAt: -1 });

    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;