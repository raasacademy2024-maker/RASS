import mongoose from 'mongoose';

const enrollmentFormSchema = new mongoose.Schema({
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
  // The batch the student asked for, so the team knows what they signed up
  // for when they call to collect payment.
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
    default: null
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true
  },
  // --- Contact details, so the team can actually reach this lead ---
  whatsappNumber: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: ''
  },
  preferredContactMode: {
    type: String,
    enum: ['call', 'whatsapp', 'email'],
    default: 'call'
  },
  preferredContactTime: {
    type: String,
    enum: ['morning', 'afternoon', 'evening', 'anytime'],
    default: 'anytime'
  },
  // --- Context for the sales conversation ---
  highestQualification: {
    type: String,
    default: ''
  },
  collegeOrCompany: {
    type: String,
    default: ''
  },
  heardAboutUs: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  // --- Follow-up tracking, owned by the admin side ---
  contactStatus: {
    type: String,
    enum: ['not_contacted', 'contacted', 'follow_up', 'not_interested'],
    default: 'not_contacted'
  },
  adminNotes: {
    type: String,
    default: ''
  },
  hasPriorExperience: {
    type: String,
    enum: ['yes', 'no'],
    required: true
  },
  experienceDetails: {
    type: String,
    default: ''
  },
  isStudent: {
    type: String,
    enum: ['yes', 'no'],
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Index for better query performance
enrollmentFormSchema.index({ student: 1, course: 1 });
enrollmentFormSchema.index({ course: 1, submittedAt: -1 });

export default mongoose.model('EnrollmentForm', enrollmentFormSchema);