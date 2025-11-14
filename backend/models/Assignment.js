import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  fileUrl: String,
  content: String,
  grade: {
    type: Number,
    min: 0,
    max: 100
  },
  feedback: String,
  gradedAt: Date,
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
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
  module: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
  },
  dueDate: Date,
  maxPoints: {
    type: Number,
    default: 100
  },
  instructions: String,
  attachments: [{
    filename: String,
    url: String
  }],
  submissions: [submissionSchema],
  autoGrade: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Assignment', assignmentSchema);