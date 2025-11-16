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

// Get enrollment statistics (Admin only) - must come before /:id routes
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

// Get all instructors (for dropdown in course creation) - must come before /:id routes
router.get('/role/instructors', authenticate, async (req, res) => {
  try {
    const instructors = await User.find({ role: 'instructor' })
      .select('name email')
      .sort({ name: 1 });
    
    res.json(instructors);
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

// Admin change user password
router.put('/:id/password', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update password (will be hashed by pre-save hook)
    user.password = password;
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
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

// Get user by ID (Admin only)
router.get('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user (Admin only)
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { name, email, role, profile, isActive } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (profile) updateData.profile = profile;
    if (typeof isActive !== 'undefined') updateData.isActive = isActive;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user (Admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;