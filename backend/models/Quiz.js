import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'short-answer', 'coding'],
    required: true
  },
  options: [String], // For multiple-choice
  correctAnswer: {
    type: String,
    required: true
  },
  explanation: String,
  points: {
    type: Number,
    default: 1,
    min: 0
  },
  order: Number
});

const quizAttemptSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  submittedAt: Date,
  answers: [{
    questionIndex: Number,
    answer: String,
    isCorrect: Boolean,
    pointsEarned: Number
  }],
  score: {
    type: Number,
    default: 0
  },
  maxScore: Number,
  percentage: Number,
  timeSpent: Number // in seconds
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
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
  module: {
    type: mongoose.Schema.Types.ObjectId
  },
  questions: [questionSchema],
  duration: {
    type: Number, // in minutes
    default: 30
  },
  passingScore: {
    type: Number,
    default: 60,
    min: 0,
    max: 100
  },
  availableFrom: Date,
  availableTo: Date,
  attempts: [quizAttemptSchema],
  maxAttempts: {
    type: Number,
    default: 3,
    min: 1
  },
  shuffleQuestions: {
    type: Boolean,
    default: false
  },
  showResults: {
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

// Calculate max score for the quiz
quizSchema.methods.calculateMaxScore = function() {
  return this.questions.reduce((sum, q) => sum + q.points, 0);
};

// Get student's best attempt
quizSchema.methods.getStudentBestAttempt = function(studentId) {
  const studentAttempts = this.attempts.filter(
    a => a.student.toString() === studentId.toString()
  );
  
  if (studentAttempts.length === 0) return null;
  
  return studentAttempts.reduce((best, current) => 
    (current.percentage || 0) > (best.percentage || 0) ? current : best
  );
};

export default mongoose.model('Quiz', quizSchema);
