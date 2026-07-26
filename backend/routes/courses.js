import express from 'express';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import User from '../models/User.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

/* -------------------- Courses -------------------- */

/**
 * Get unique categories from published courses
 * This endpoint returns a list of distinct category names from all published courses.
 * Used by the frontend to display dynamic category filters.
 */
router.get('/metadata/categories', async (req, res) => {
  try {
    const categories = await Course.distinct('category', { isPublished: true });
    res.json(categories.filter(cat => cat)); // Filter out null/undefined values
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all courses
router.get('/', async (req, res) => {
  try {
    const { category, search, instructor } = req.query;
    let query = { isPublished: true };

    if (category) query.category = category;
    if (instructor) query.instructor = instructor;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(query)
      .populate('instructor', 'name profile.avatar')
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email profile')
      .populate('modules'); // include modules

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create course
router.post('/', async (req, res) => {
  try {
    const { instructor, ...rest } = req.body;
    if (!instructor) {
      return res.status(400).json({ message: "Instructor ID is required" });
    }

    const courseData = {
      ...rest,
      instructor,
    };

    const course = new Course(courseData);
    await course.save();

    await User.findByIdAndUpdate(instructor, { $push: { createdCourses: course._id } });

    res.status(201).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});






// Update course
router.put('/:id', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Check ownership
    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('instructor', 'name email');

    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete course (and all data that references it)
router.delete('/:id', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Check ownership
    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    const courseId = course._id;

    // Every collection that holds a reference to this course. Without this cleanup
    // the documents survive with a dangling course id and break any page that
    // populates them.
    const dependents = [
      ['Announcement', '../models/Announcement.js'],
      ['Assignment', '../models/Assignment.js'],
      ['Attendance', '../models/Attendance.js'],
      ['Batch', '../models/Batch.js'],
      ['Certificate', '../models/Certificate.js'],
      ['Chat', '../models/Chat.js'],
      ['Doubt', '../models/Doubt.js'],
      ['Enrollment', '../models/Enrollment.js'],
      ['EnrollmentForm', '../models/EnrollmentForm.js'],
      ['Forum', '../models/Forum.js'],
      ['LiveSession', '../models/LiveSession.js'],
      ['Quiz', '../models/Quiz.js'],
      ['Schedule', '../models/Schedule.js'],
      ['VideoNote', '../models/VideoNote.js'],
    ];

    const deleted = {};
    for (const [name, path] of dependents) {
      try {
        const Model = (await import(path)).default;
        const result = await Model.deleteMany({ course: courseId });
        if (result.deletedCount) deleted[name] = result.deletedCount;
      } catch (depError) {
        // A single dependent collection failing must not abort the whole delete,
        // otherwise the course is left half-cleaned.
        console.error(`Failed clearing ${name} for course ${courseId}:`, depError.message);
      }
    }

    // Drop the course from every user's enrolled/created lists
    await User.updateMany(
      { $or: [{ enrolledCourses: courseId }, { createdCourses: courseId }] },
      { $pull: { enrolledCourses: courseId, createdCourses: courseId } }
    );

    await Course.findByIdAndDelete(courseId);

    res.json({
      message: 'Course deleted successfully',
      courseId,
      deletedRelated: deleted,
    });
  } catch (error) {
    console.error('Course deletion error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get instructor's courses
router.get('/instructor/my-courses', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .populate('instructor', 'name email')
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* -------------------- Modules -------------------- */

// ---- Module Management ---- //

// Add a module
router.post('/:courseId/modules', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.modules.push(req.body);
    await course.save();

    res.status(201).json(course.modules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a module
router.put('/:courseId/modules/:moduleId', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const module = course.modules.id(req.params.moduleId);
    if (!module) return res.status(404).json({ message: 'Module not found' });

    Object.assign(module, req.body);
    await course.save();

    res.json(module);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a module
router.delete('/:courseId/modules/:moduleId', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.modules = course.modules.filter((m) => m._id.toString() !== req.params.moduleId);
    await course.save();

    res.json({ message: 'Module deleted successfully', modules: course.modules });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export default router;
