import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  enrolledCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    trim: true
  },
  instructors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  fees: {
    amount: {
      type: Number,
      min: 0
    },
    currency: {
      type: String,
      default: 'INR'
    },
    installments: [{
      amount: Number,
      dueDate: Date,
      description: String
    }]
  },
  syllabus: [{
    moduleId: {
      type: mongoose.Schema.Types.ObjectId
    },
    moduleName: String,
    topics: [String],
    duration: String,
    order: Number
  }],
  schedule: {
    days: [{
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }],
    startTime: String,
    endTime: String,
    timezone: {
      type: String,
      default: 'Asia/Kolkata'
    }
  }
}, {
  timestamps: true
});

// Validate end date is after start date
batchSchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    next(new Error('End date must be after start date'));
  }
  next();
});

// Check if batch has available slots
batchSchema.methods.hasAvailableSlots = function() {
  return this.enrolledCount < this.capacity;
};

// Check if current date is within batch duration
batchSchema.methods.isAccessible = function() {
  const now = new Date();
  return now >= this.startDate && now <= this.endDate;
};

// Check if batch has started
batchSchema.methods.hasStarted = function() {
  const now = new Date();
  return now >= this.startDate;
};

// Check if batch has ended
batchSchema.methods.hasEnded = function() {
  const now = new Date();
  return now > this.endDate;
};

export default mongoose.model('Batch', batchSchema);
