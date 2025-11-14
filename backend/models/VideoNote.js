import mongoose from 'mongoose';

const videoNoteSchema = new mongoose.Schema({
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
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  timestamp: {
    type: Number,
    required: true, // in seconds
    min: 0
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  tags: [String],
  color: {
    type: String,
    default: '#fbbf24' // yellow as default
  }
}, {
  timestamps: true
});

// Index for efficient querying
videoNoteSchema.index({ student: 1, course: 1, moduleId: 1 });
videoNoteSchema.index({ student: 1, moduleId: 1, timestamp: 1 });

export default mongoose.model('VideoNote', videoNoteSchema);
