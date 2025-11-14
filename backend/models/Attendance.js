import mongoose from 'mongoose';

const attendanceRecordSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'excused'],
    default: 'absent'
  },
  markedAt: {
    type: Date,
    default: Date.now
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  remarks: String,
  // Auto-tracking from video
  autoTracked: {
    type: Boolean,
    default: false
  },
  watchDuration: {
    type: Number,
    default: 0 // in seconds
  },
  watchPercentage: {
    type: Number,
    default: 0
  }
});

const attendanceSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
    required: true
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LiveSession'
  },
  module: {
    type: mongoose.Schema.Types.ObjectId
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  records: [attendanceRecordSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Calculate attendance statistics
attendanceSchema.methods.getStatistics = function() {
  const total = this.records.length;
  const present = this.records.filter(r => r.status === 'present').length;
  const absent = this.records.filter(r => r.status === 'absent').length;
  const late = this.records.filter(r => r.status === 'late').length;
  const excused = this.records.filter(r => r.status === 'excused').length;

  return {
    total,
    present,
    absent,
    late,
    excused,
    presentPercentage: total > 0 ? Math.round((present / total) * 100) : 0
  };
};

export default mongoose.model('Attendance', attendanceSchema);
