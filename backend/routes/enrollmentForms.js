import express from 'express';
import EnrollmentForm from '../models/EnrollmentForm.js';
import Course from '../models/Course.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Submit enrollment form
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      courseId,
      batchId,
      fullName,
      email,
      mobileNumber,
      whatsappNumber,
      city,
      preferredContactMode,
      preferredContactTime,
      highestQualification,
      collegeOrCompany,
      heardAboutUs,
      message,
      hasPriorExperience,
      experienceDetails,
      isStudent
    } = req.body;

    // Check if form already submitted
    const existingForm = await EnrollmentForm.findOne({
      student: req.user._id,
      course: courseId
    });

    if (existingForm) {
      return res.status(400).json({ message: 'Enrollment form already submitted for this course' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Create enrollment form
    const enrollmentForm = new EnrollmentForm({
      student: req.user._id,
      course: courseId,
      batch: batchId || null,
      fullName,
      email,
      mobileNumber,
      // Fall back to the mobile number so there is always a WhatsApp contact
      whatsappNumber: whatsappNumber || mobileNumber,
      city: city || '',
      preferredContactMode: preferredContactMode || 'call',
      preferredContactTime: preferredContactTime || 'anytime',
      highestQualification: highestQualification || '',
      collegeOrCompany: collegeOrCompany || '',
      heardAboutUs: heardAboutUs || '',
      message: message || '',
      hasPriorExperience,
      experienceDetails: hasPriorExperience === 'yes' ? experienceDetails : '',
      isStudent
    });

    await enrollmentForm.save();

    res.status(201).json(enrollmentForm);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's enrollment forms
router.get('/my-forms', authenticate, async (req, res) => {
  try {
    const forms = await EnrollmentForm.find({ student: req.user._id })
      .populate('course', 'title thumbnail instructor price')
      .populate('student', 'name email')
      .sort({ createdAt: -1 });

    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get enrollment forms for a specific course (Instructor/Admin only)
router.get('/course/:courseId', authenticate, async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Check if user is instructor of the course or admin
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    let forms;
    if (req.user.role === 'admin') {
      // Admin can see all forms
      forms = await EnrollmentForm.find({ course: courseId })
        .populate('student', 'name email')
        .populate('batch', 'name startDate endDate')
        .sort({ createdAt: -1 });
    } else if (req.user.role === 'instructor' && course.instructor.toString() === req.user._id.toString()) {
      // Instructor can see forms for their own courses
      forms = await EnrollmentForm.find({ course: courseId })
        .populate('student', 'name email')
        .populate('batch', 'name startDate endDate')
        .sort({ createdAt: -1 });
    } else {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update enrollment form payment status
router.put('/:id/payment-status', authenticate, async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    
    const form = await EnrollmentForm.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Enrollment form not found' });
    }

    // Check if user is authorized to update
    const course = await Course.findById(form.course);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (req.user.role !== 'admin' && 
        !(req.user.role === 'instructor' && course.instructor.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    form.paymentStatus = paymentStatus;
    await form.save();

    // Payment is collected offline (we call the student). Marking the request
    // "completed" is therefore the ONLY thing that grants course access, so it
    // has to create the enrollment - not just flip this flag.
    let enrollment = null;
    if (paymentStatus === 'completed') {
      try {
        enrollment = await grantCourseAccess({
          studentId: form.student,
          course,
          batchId: form.batch,
        });
      } catch (grantError) {
        console.error('Failed granting course access:', grantError);
        return res.status(500).json({
          message: `Request marked completed, but granting course access failed: ${grantError.message}`,
          form,
        });
      }
    }

    res.json({ ...form.toObject(), enrollment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Record follow-up progress on a request (admin/instructor only).
// Separate from payment status: this tracks whether we've reached the person yet.
router.put('/:id/contact-status', authenticate, async (req, res) => {
  try {
    const { contactStatus, adminNotes } = req.body;

    const form = await EnrollmentForm.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Enrollment request not found' });
    }

    const course = await Course.findById(form.course);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (req.user.role !== 'admin' &&
        !(req.user.role === 'instructor' && course.instructor.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (contactStatus !== undefined) {
      const allowed = ['not_contacted', 'contacted', 'follow_up', 'not_interested'];
      if (!allowed.includes(contactStatus)) {
        return res.status(400).json({ message: `contactStatus must be one of: ${allowed.join(', ')}` });
      }
      form.contactStatus = contactStatus;
    }
    if (adminNotes !== undefined) form.adminNotes = adminNotes;

    await form.save();
    res.json(form);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Creates the Enrollment that actually unlocks the course for a student.
 * Idempotent: if an enrollment already exists it is upgraded to paid rather
 * than duplicated. Mirrors the progress/count bookkeeping in routes/enrollments.js.
 */
async function grantCourseAccess({ studentId, course, batchId }) {
  const Enrollment = (await import('../models/Enrollment.js')).default;
  const User = (await import('../models/User.js')).default;

  const existing = await Enrollment.findOne({ student: studentId, course: course._id });
  if (existing) {
    existing.paymentStatus = 'completed';
    if (batchId && !existing.batch) existing.batch = batchId;
    await existing.save();
    return existing;
  }

  // Build the per-module progress rows, falling back to curriculum entries
  // when the course has no modules.
  let progressData = [];
  if (Array.isArray(course.modules) && course.modules.length > 0) {
    progressData = course.modules
      .filter((m) => m && m._id)
      .map((m) => ({ moduleId: m._id, completed: false, watchTime: 0 }));
  }
  if (progressData.length === 0 && Array.isArray(course.curriculum)) {
    progressData = course.curriculum
      .filter((c) => c && c._id)
      .map((c) => ({ moduleId: c._id, completed: false, watchTime: 0 }));
  }

  const enrollment = new Enrollment({
    student: studentId,
    course: course._id,
    batch: batchId || null,
    progress: progressData,
    paymentStatus: 'completed',
  });
  await enrollment.save();

  course.enrollmentCount = (course.enrollmentCount || 0) + 1;
  await course.save();

  if (batchId) {
    const Batch = (await import('../models/Batch.js')).default;
    const batch = await Batch.findById(batchId);
    if (batch) {
      batch.enrolledCount = (batch.enrolledCount || 0) + 1;
      await batch.save();
    }
  }

  await User.updateOne({ _id: studentId }, { $addToSet: { enrolledCourses: course._id } });

  return enrollment;
}

export default router;