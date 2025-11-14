import mongoose from 'mongoose';

const liveSessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch'
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scheduledAt: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true // in minutes
  },
  meetingLink: String,
  meetingId: String,
  password: String,
  status: {
    type: String,
    enum: ['scheduled', 'live', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  attendees: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: Date,
    leftAt: Date
  }],
  recording: {
    url: String,
    available: {
      type: Boolean,
      default: false
    }
  },
  maxAttendees: {
    type: Number,
    default: 100
  }
}, {
  timestamps: true
});

export default mongoose.model('LiveSession', liveSessionSchema);