import mongoose from 'mongoose';

const doubtSchema = new mongoose.Schema({
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
  module: {
    type: mongoose.Schema.Types.ObjectId
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  question: {
    type: String,
    required: true
  },
  codeSnippet: String,
  language: String, // programming language if code-related
  tags: [String],
  status: {
    type: String,
    enum: ['open', 'ai-answered', 'instructor-answered', 'resolved', 'closed'],
    default: 'open'
  },
  aiResponse: {
    answer: String,
    generatedAt: Date,
    confidence: Number,
    codeExamples: [String]
  },
  instructorResponse: {
    answer: String,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    respondedAt: Date
  },
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isHelpful: {
    type: Boolean,
    default: null
  },
  relatedDoubts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doubt'
  }]
}, {
  timestamps: true
});

// Index for efficient searching
doubtSchema.index({ student: 1, course: 1 });
doubtSchema.index({ course: 1, batch: 1, status: 1 });
doubtSchema.index({ tags: 1 });

export default mongoose.model('Doubt', doubtSchema);
