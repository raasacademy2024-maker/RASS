import mongoose from 'mongoose';
import slugify from "slugify";

/* -------------------- Module Schema -------------------- */
const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  videoUrl: String,
  duration: Number,
  order: { type: Number, required: true },
  resources: [
    {
      title: String,
      url: String,
      type: { type: String, enum: ['pdf', 'doc', 'link', 'other'] }
    }
  ]
});

/* -------------------- Tech Stack Schema -------------------- */
const techStackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true }
});

/* -------------------- Testimonial Schema -------------------- */
const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: String,
  description: { type: String, required: true }
});

/* -------------------- FAQ Schema -------------------- */
const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true }
});

/* -------------------- Main Course Schema -------------------- */
const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    about: { type: String },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    category: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    thumbnail: String,

    curriculum: [
      {
        order: { type: Number, required: true },
        logoUrl: String,
        title: { type: String, required: true },
        sections: [
          {
            order: { type: Number, required: true },
            subtitle: { type: String, required: true },
            description: { type: String }
          }
        ]
      }
    ],

    features: [String],

    techStack: [techStackSchema],

    skillsGained: [String],

    jobRoles: [String],


    testimonials: [testimonialSchema],

    faqs: [faqSchema],

    modules: [moduleSchema],
    totalDuration: Number,

    enrollmentCount: { type: Number, default: 0 },
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 }
    },

    slug: { type: String, unique: true, trim: true },
    isPublished: { type: Boolean, default: true },
    tags: [String],
    requirements: [String],
    learningOutcomes: [String]
  },
  { timestamps: true }
);

courseSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  this.totalDuration = this.modules.reduce(
    (total, module) => total + (module.duration || 0),
    0
  );
  next();
});

export default mongoose.model('Course', courseSchema);
