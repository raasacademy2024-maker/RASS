import express from 'express';
import Assignment from '../models/Assignment.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { submissionLimiter } from '../middleware/rateLimiter.js';
import Notification from "../models/Notification.js";
import Enrollment from "../models/Enrollment.js";

const router = express.Router();

// 🔹 Get assignments for a course (with optional batch filter)
router.get('/course/:courseId', authenticate, async (req, res) => {
  try {
    const { batchId } = req.query;
    const query = { course: req.params.courseId };
    
    // Filter by batch if provided
    if (batchId) {
      query.batch = batchId;
    }
    
    const assignments = await Assignment.find(query)
      .populate('submissions.student', '_id name email')
      .populate('batch', 'name startDate endDate');

    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔹 Create assignment
router.post('/', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const assignment = new Assignment(req.body);
    await assignment.save();

    // Notify students enrolled in this course
    // If batch is specified, only notify students in that batch
    const query = { course: assignment.course };
    if (assignment.batch) {
      query.batch = assignment.batch;
    }
    
    const enrollments = await Enrollment.find(query);
    for (const e of enrollments) {
      await Notification.create({
        recipient: e.student,
        title: "New Assignment Posted",
        message: `Assignment "${assignment.title}" has been posted in your course.`,
        type: "assignment",
        relatedId: assignment._id
      });
    }

    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔹 Update assignment
router.put('/:id', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedAssignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.json(updatedAssignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔹 Delete assignment
router.delete('/:id', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔹 Submit assignment
router.post('/:id/submit', authenticate, submissionLimiter, async (req, res) => {
  try {
    const { content, fileUrl } = req.body;

    let assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Verify student is enrolled in the course (and batch if specified)
    const enrollmentQuery = {
      student: req.user._id,
      course: assignment.course
    };
    if (assignment.batch) {
      enrollmentQuery.batch = assignment.batch;
    }
    
    const enrollment = await Enrollment.findOne(enrollmentQuery);
    if (!enrollment) {
      return res.status(403).json({ message: 'Not enrolled in this course/batch' });
    }

    // Check if student already submitted
    const existingSubmission = assignment.submissions.find(
      (sub) => sub.student.toString() === req.user._id.toString()
    );

    if (existingSubmission) {
      existingSubmission.content = content;
      existingSubmission.fileUrl = fileUrl;
      existingSubmission.submittedAt = new Date();
    } else {
      assignment.submissions.push({
        student: req.user._id,
        content,
        fileUrl,
        submittedAt: new Date(),
      });
    }

    await assignment.save();

    const updatedAssignment = await Assignment.findById(req.params.id)
      .populate('submissions.student', '_id name email role');

    res.json(updatedAssignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔹 Grade assignment
router.post('/:id/grade', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const { studentId, grade, feedback } = req.body;

    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    const submission = assignment.submissions.find(sub => sub.student.toString() === studentId);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    submission.grade = grade;
    submission.feedback = feedback;
    submission.gradedAt = new Date();
    submission.gradedBy = req.user._id;

    await assignment.save();

    // Notify student
    await Notification.create({
      recipient: studentId,
      title: "Assignment Graded",
      message: `Your submission for "${assignment.title}" has been graded.`,
      type: "assignment",
      relatedId: assignment._id
    });

    const updatedAssignment = await Assignment.findById(req.params.id)
      .populate('submissions.student', 'name email role')
      .populate('submissions.gradedBy', 'name email role');

    res.json(updatedAssignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
