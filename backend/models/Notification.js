import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['course', 'assignment', 'announcement', 'payment', 'system', 'chat', 'discussion', 'support', 'live-session', 'course-update', 'bulk'],
    required: true
  },
  relatedId: mongoose.Schema.Types.ObjectId,
  read: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  emailSent: {
    type: Boolean,
    default: false
  },
  emailSentAt: Date,
  emailStatus: {
    type: String,
    enum: ['pending', 'sent', 'failed'],
    default: 'pending'
  },
  emailError: String,
  sentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

export default mongoose.model('Notification', notificationSchema);