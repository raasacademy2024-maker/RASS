import express from 'express';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { sendNotificationEmail, sendBulkNotificationEmails } from '../services/emailService.js';

const router = express.Router();

// Get all users enrolled in a specific course
router.get('/courses/:courseId/users', authenticate, authorize('admin', 'instructor'), async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Find all enrollments for this course
    const enrollments = await Enrollment.find({ course: courseId })
      .populate('student', 'name email')
      .select('student');
    
    const users = enrollments.map(enrollment => ({
      _id: enrollment.student._id,
      name: enrollment.student.name,
      email: enrollment.student.email
    }));
    
    res.json({
      courseId,
      users,
      count: users.length
    });
  } catch (error) {
    console.error('Error fetching course users:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all users with filters
router.get('/users', authenticate, authorize('admin', 'instructor'), async (req, res) => {
  try {
    const { role, search } = req.query;
    
    let query = {};
    
    if (role) {
      query.role = role;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const users = await User.find(query)
      .select('name email role')
      .sort({ name: 1 });
    
    res.json({
      users,
      count: users.length
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: error.message });
  }
});

// Send notification to users by course
router.post('/send-by-course', authenticate, authorize('admin', 'instructor'), async (req, res) => {
  try {
    const { courseId, title, message, type, sendEmail } = req.body;
    
    if (!courseId || !title || !message) {
      return res.status(400).json({ 
        message: 'Course ID, title, and message are required' 
      });
    }
    
    // Get course details
    const course = await Course.findById(courseId).select('title');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Find all enrollments for this course
    const enrollments = await Enrollment.find({ course: courseId })
      .populate('student', 'name email');
    
    if (enrollments.length === 0) {
      return res.status(404).json({ 
        message: 'No users enrolled in this course' 
      });
    }
    
    const notificationType = type || 'course-update';
    const notifications = [];
    const emailResults = {
      successful: [],
      failed: []
    };
    
    // Create notifications for each enrolled user
    for (const enrollment of enrollments) {
      const notification = new Notification({
        recipient: enrollment.student._id,
        title,
        message,
        type: notificationType,
        relatedId: courseId,
        sentBy: req.user._id,
        emailSent: false,
        emailStatus: sendEmail ? 'pending' : 'not-required'
      });
      
      await notification.save();
      notifications.push(notification);
      
      // Send email if requested
      if (sendEmail) {
        const emailResult = await sendNotificationEmail({
          to: enrollment.student.email,
          userName: enrollment.student.name,
          type: notificationType,
          title,
          message,
          data: {
            courseTitle: course.title,
            updateDetails: `New update for ${course.title}`
          }
        });
        
        if (emailResult.success) {
          notification.emailSent = true;
          notification.emailSentAt = new Date();
          notification.emailStatus = 'sent';
          await notification.save();
          
          emailResults.successful.push({
            email: enrollment.student.email,
            messageId: emailResult.messageId
          });
        } else {
          notification.emailStatus = 'failed';
          notification.emailError = emailResult.error;
          await notification.save();
          
          emailResults.failed.push({
            email: enrollment.student.email,
            error: emailResult.error
          });
        }
      }
    }
    
    res.status(201).json({
      message: 'Notifications sent successfully',
      count: notifications.length,
      course: course.title,
      emailResults: sendEmail ? emailResults : undefined
    });
  } catch (error) {
    console.error('Error sending course notifications:', error);
    res.status(500).json({ message: error.message });
  }
});

// Send notification to manually selected users
router.post('/send-to-users', authenticate, authorize('admin', 'instructor'), async (req, res) => {
  try {
    const { userIds, title, message, type, sendEmail } = req.body;
    
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ 
        message: 'User IDs array is required' 
      });
    }
    
    if (!title || !message) {
      return res.status(400).json({ 
        message: 'Title and message are required' 
      });
    }
    
    // Fetch users
    const users = await User.find({ _id: { $in: userIds } })
      .select('name email');
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }
    
    const notificationType = type || 'bulk';
    const notifications = [];
    const emailResults = {
      successful: [],
      failed: []
    };
    
    // Create notifications for each user
    for (const user of users) {
      const notification = new Notification({
        recipient: user._id,
        title,
        message,
        type: notificationType,
        sentBy: req.user._id,
        emailSent: false,
        emailStatus: sendEmail ? 'pending' : 'not-required'
      });
      
      await notification.save();
      notifications.push(notification);
      
      // Send email if requested
      if (sendEmail) {
        const emailResult = await sendNotificationEmail({
          to: user.email,
          userName: user.name,
          type: notificationType,
          title,
          message,
          data: {}
        });
        
        if (emailResult.success) {
          notification.emailSent = true;
          notification.emailSentAt = new Date();
          notification.emailStatus = 'sent';
          await notification.save();
          
          emailResults.successful.push({
            email: user.email,
            messageId: emailResult.messageId
          });
        } else {
          notification.emailStatus = 'failed';
          notification.emailError = emailResult.error;
          await notification.save();
          
          emailResults.failed.push({
            email: user.email,
            error: emailResult.error
          });
        }
      }
    }
    
    res.status(201).json({
      message: 'Notifications sent successfully',
      count: notifications.length,
      emailResults: sendEmail ? emailResults : undefined
    });
  } catch (error) {
    console.error('Error sending notifications to users:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get notification history (sent notifications)
router.get('/history', authenticate, authorize('admin', 'instructor'), async (req, res) => {
  try {
    const { page = 1, limit = 20, type, emailStatus } = req.query;
    
    let query = {};
    
    // Filter by sentBy to only show notifications sent by admins/instructors
    if (req.user.role !== 'admin') {
      query.sentBy = req.user._id;
    }
    
    if (type) {
      query.type = type;
    }
    
    if (emailStatus) {
      query.emailStatus = emailStatus;
    }
    
    const notifications = await Notification.find(query)
      .populate('recipient', 'name email')
      .populate('sentBy', 'name email')
      .populate('relatedId')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Notification.countDocuments(query);
    
    res.json({
      notifications,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Error fetching notification history:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get notification statistics
router.get('/stats', authenticate, authorize('admin', 'instructor'), async (req, res) => {
  try {
    let query = {};
    
    // Filter by sentBy if not admin
    if (req.user.role !== 'admin') {
      query.sentBy = req.user._id;
    }
    
    const totalNotifications = await Notification.countDocuments(query);
    const emailsSent = await Notification.countDocuments({ ...query, emailSent: true });
    const emailsFailed = await Notification.countDocuments({ ...query, emailStatus: 'failed' });
    
    // Get notifications by type
    const byType = await Notification.aggregate([
      { $match: query },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Recent notifications
    const recentNotifications = await Notification.find(query)
      .populate('recipient', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.json({
      totalNotifications,
      emailsSent,
      emailsFailed,
      emailsPending: totalNotifications - emailsSent - emailsFailed,
      byType,
      recentNotifications
    });
  } catch (error) {
    console.error('Error fetching notification stats:', error);
    res.status(500).json({ message: error.message });
  }
});

// Test email sending
router.post('/test-email', authenticate, authorize('admin', 'instructor'), async (req, res) => {
  try {
    const { email, title, message } = req.body;
    
    if (!email || !title || !message) {
      return res.status(400).json({ 
        message: 'Email, title, and message are required' 
      });
    }
    
    const result = await sendNotificationEmail({
      to: email,
      userName: 'Test User',
      type: 'system',
      title,
      message,
      data: {}
    });
    
    if (result.success) {
      res.json({ 
        message: 'Test email sent successfully',
        messageId: result.messageId
      });
    } else {
      res.status(500).json({ 
        message: 'Failed to send test email',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
