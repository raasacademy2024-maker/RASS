import express from 'express';
import Certificate from '../models/Certificate.js';
import Enrollment from '../models/Enrollment.js';
import { authenticate } from '../middleware/auth.js';

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

export default router;