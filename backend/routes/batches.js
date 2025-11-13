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
      .populate('course', 'title instructor');

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
    const { courseId, name, startDate, endDate, capacity, description } = req.body;

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

    const batch = new Batch({
      course: courseId,
      name,
      startDate,
      endDate,
      capacity,
      description
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

    const { name, startDate, endDate, capacity, description, isActive } = req.body;

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

export default router;
