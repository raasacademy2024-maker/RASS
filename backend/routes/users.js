import express from 'express';
import User from '../models/User.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all users (Admin only)
router.get('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { role, search } = req.query;
    let query = {};

    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, profile } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        ...(name && { name }),
        ...(profile && { profile: { ...req.user.profile, ...profile } })
      },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user status (Admin only)
router.put('/:id/status', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get student's enrolled courses with batch info (Admin only)
router.get('/:id/courses', authenticate, authorize('admin'), async (req, res) => {
  try {
    const Enrollment = (await import('../models/Enrollment.js')).default;
    
    const enrollments = await Enrollment.find({ student: req.params.id })
      .populate('course', 'title instructor')
      .populate('batch', 'name startDate endDate')
      .populate({
        path: 'course',
        populate: {
          path: 'instructor',
          select: 'name'
        }
      });

    const courses = enrollments.map(e => ({
      _id: e.course._id,
      title: e.course.title,
      instructor: e.course.instructor?.name || 'Unknown',
      progress: e.completionPercentage || 0,
      status: e.completed ? 'Completed' : 'In Progress',
      batch: e.batch ? {
        _id: e.batch._id,
        name: e.batch.name,
        startDate: e.batch.startDate,
        endDate: e.batch.endDate
      } : null
    }));

    res.json({ courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get enrollment statistics (Admin only)
router.get('/stats/enrollment', authenticate, authorize('admin'), async (req, res) => {
  try {
    const students = await User.find({ role: 'student' });
    const instructors = await User.find({ role: 'instructor' });
    
    const Enrollment = (await import('../models/Enrollment.js')).default;
    const enrolledStudentIds = await Enrollment.distinct('student');
    
    res.json({
      totalStudents: students.length,
      totalInstructors: instructors.length,
      enrolledStudents: enrolledStudentIds.length,
      unenrolledStudents: students.length - enrolledStudentIds.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new user (Admin only)
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      name,
      email,
      password, // Password will be hashed by the User model pre-save hook
      role: role || 'student'
    });

    await user.save();
    
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;