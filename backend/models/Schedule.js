import mongoose from 'mongoose';

const scheduleEntrySchema = new mongoose.Schema({
  dayOfWeek: {
    type: Number,
    required: true,
    min: 0, // Sunday
    max: 6  // Saturday
  },
  startTime: {
    type: String,
    required: true // Format: "HH:MM" (24-hour format)
  },
  endTime: {
    type: String,
    required: true // Format: "HH:MM" (24-hour format)
  },
  topic: {
    type: String,
    required: true
  },
  description: String,
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  location: String, // Physical location or meeting link
  isRecurring: {
    type: Boolean,
    default: true
  }
});

const scheduleSchema = new mongoose.Schema({
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  entries: [scheduleEntrySchema],
  effectiveFrom: {
    type: Date,
    required: true,
    default: Date.now
  },
  effectiveTo: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Get schedule for a specific date
scheduleSchema.methods.getScheduleForDate = function(date) {
  const dayOfWeek = date.getDay();
  return this.entries.filter(entry => entry.dayOfWeek === dayOfWeek);
};

export default mongoose.model('Schedule', scheduleSchema);
