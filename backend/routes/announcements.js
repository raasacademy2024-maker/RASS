import express from 'express';
import Announcement from '../models/Announcement.js';
import Enrollment from '../models/Enrollment.js';
import Notification from '../models/Notification.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get announcements for a course
router.get('/course/:courseId', authenticate, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { batchId } = req.query;

    // Check if user is enrolled or is instructor/admin
    if (req.user.role === 'student') {
      const enrollment = await Enrollment.findOne({
        student: req.user._id,
        course: courseId
      });

      if (!enrollment) {
        return res.status(403).json({ message: 'Not enrolled in this course' });
      }

      // Students only see announcements for their batch or general announcements
      const query = {
        course: courseId,
        isActive: true,
        $or: [
          { batches: { $size: 0 } }, // General announcements
          { batches: enrollment.batch }
        ]
      };

      // Filter by expiration
      const now = new Date();
      query.$or.push({ expiresAt: { $exists: false } });
      query.$or.push({ expiresAt: { $gte: now } });

      const announcements = await Announcement.find(query)
        .populate('createdBy', 'name')
        .populate('batches', 'name')
        .sort({ isPinned: -1, createdAt: -1 });

      return res.json(announcements);
    }

    // For instructors/admins
    const query = { course: courseId };
    if (batchId) {
      query.$or = [
        { batches: batchId },
        { batches: { $size: 0 } }
      ];
    }

    const announcements = await Announcement.find(query)
      .populate('createdBy', 'name')
      .populate('batches', 'name')
      .sort({ isPinned: -1, createdAt: -1 });

    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single announcement
router.get('/:id', authenticate, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('course', 'title')
      .populate('createdBy', 'name email')
      .populate('batches', 'name');

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    // Mark as read for student
    if (req.user.role === 'student') {
      const alreadyRead = announcement.readBy.some(
        r => r.student.toString() === req.user._id.toString()
      );

      if (!alreadyRead) {
        announcement.readBy.push({
          student: req.user._id,
          readAt: Date.now()
        });
        await announcement.save();
      }
    }

    res.json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create announcement (instructor/admin only)
router.post('/', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const {
      title,
      content,
      courseId,
      batchIds,
      priority,
      type,
      attachments,
      expiresAt,
      isPinned
    } = req.body;

    if (!title || !content || !courseId) {
      return res.status(400).json({ 
        message: 'Title, content, and course ID are required' 
      });
    }

    const announcement = new Announcement({
      title,
      content,
      course: courseId,
      batches: batchIds || [],
      priority: priority || 'medium',
      type: type || 'general',
      attachments: attachments || [],
      expiresAt,
      isPinned: isPinned || false,
      createdBy: req.user._id
    });

    await announcement.save();
    await announcement.populate([
      { path: 'course', select: 'title' },
      { path: 'batches', select: 'name' },
      { path: 'createdBy', select: 'name' }
    ]);

    // Create notifications for enrolled students
    const query = { course: courseId };
    if (batchIds && batchIds.length > 0) {
      query.batch = { $in: batchIds };
    }

    const enrollments = await Enrollment.find(query).select('student');
    const studentIds = enrollments.map(e => e.student);

    // Create notifications
    const notifications = studentIds.map(studentId => ({
      user: studentId,
      title: `New Announcement: ${title}`,
      message: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
      type: 'announcement',
      relatedId: announcement._id,
      priority: priority
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update announcement (instructor/admin only)
router.put('/:id', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    const allowedUpdates = [
      'title', 'content', 'batches', 'priority', 'type', 
      'attachments', 'expiresAt', 'isPinned', 'isActive'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        announcement[field] = req.body[field];
      }
    });

    await announcement.save();
    await announcement.populate([
      { path: 'course', select: 'title' },
      { path: 'batches', select: 'name' },
      { path: 'createdBy', select: 'name' }
    ]);

    res.json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete announcement (admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    await announcement.deleteOne();
    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get unread announcements count
router.get('/course/:courseId/unread-count', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.json({ count: 0 });
    }

    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId
    });

    if (!enrollment) {
      return res.json({ count: 0 });
    }

    const query = {
      course: courseId,
      isActive: true,
      $or: [
        { batches: { $size: 0 } },
        { batches: enrollment.batch }
      ],
      'readBy.student': { $ne: req.user._id }
    };

    const count = await Announcement.countDocuments(query);
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
