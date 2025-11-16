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

// Check if course access is allowed based on batch dates
enrollmentSchema.methods.isCourseAccessible = async function() {
  // If no batch assigned, allow access (open enrollment)
  if (!this.batch) {
    return { accessible: true, reason: null };
  }

  // Populate batch if it's just an ID
  if (this.batch && !this.batch.startDate) {
    await this.populate('batch');
  }

  const now = new Date();
  const batch = this.batch;

  // Check if batch has started
  if (now < batch.startDate) {
    return {
      accessible: false,
      reason: 'batch_not_started',
      message: `Course access will be available from ${batch.startDate.toLocaleDateString()}`,
      startDate: batch.startDate,
      endDate: batch.endDate
    };
  }

  // Check if batch has ended
  if (now > batch.endDate) {
    return {
      accessible: false,
      reason: 'batch_ended',
      message: `Course access ended on ${batch.endDate.toLocaleDateString()}`,
      startDate: batch.startDate,
      endDate: batch.endDate
    };
  }

  // Access is allowed
  return {
    accessible: true,
    reason: null,
    startDate: batch.startDate,
    endDate: batch.endDate
  };
};

export default mongoose.model('Enrollment', enrollmentSchema);