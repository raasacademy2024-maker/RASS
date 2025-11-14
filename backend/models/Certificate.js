import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
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
  certificateId: {
    type: String,
    unique: true,
    required: true
  },
  issuedAt: {
    type: Date,
    default: Date.now
  },
  certificateUrl: String,
  grade: {
    type: String,
    enum: ['A+', 'A', 'B+', 'B', 'C+', 'C'],
    default: 'B'
  },
  completionDate: Date,
  verified: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Generate unique certificate ID
certificateSchema.pre('save', function(next) {
  if (!this.certificateId) {
    this.certificateId = `RASS-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  next();
});

export default mongoose.model('Certificate', certificateSchema);