import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: Date,
  watchTime: {
    type: Number,
    default: 0
  } // in seconds
});

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch'
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  progress: [progressSchema],
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: Date,
  certificateIssued: {
    type: Boolean,
    default: false
  },
  certificateUrl: String,
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentId: String,
  lastAccessed: Date
}, {
  timestamps: true
});

// Calculate completion percentage
enrollmentSchema.virtual('completionPercentage').get(function() {
  if (!this.progress || this.progress.length === 0) return 0;
  const completedModules = this.progress.filter(p => p.completed).length;
  return Math.round((completedModules / this.progress.length) * 100);
});

export default mongoose.model('Enrollment', enrollmentSchema);