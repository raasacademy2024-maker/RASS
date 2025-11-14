import express from 'express';
import VideoNote from '../models/VideoNote.js';
import Enrollment from '../models/Enrollment.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all notes for a student in a course
router.get('/course/:courseId', authenticate, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { moduleId } = req.query;

    // Verify student is enrolled
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId
    });

    if (!enrollment) {
      return res.status(403).json({ message: 'Not enrolled in this course' });
    }

    const query = {
      student: req.user._id,
      course: courseId
    };

    if (moduleId) {
      query.moduleId = moduleId;
    }

    const notes = await VideoNote.find(query)
      .sort({ moduleId: 1, timestamp: 1 });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get notes for a specific module
router.get('/module/:moduleId', authenticate, async (req, res) => {
  try {
    const { moduleId } = req.params;

    const notes = await VideoNote.find({
      student: req.user._id,
      moduleId: moduleId
    }).sort({ timestamp: 1 });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new note
router.post('/', authenticate, async (req, res) => {
  try {
    const { courseId, moduleId, timestamp, content, tags, color } = req.body;

    if (!courseId || !moduleId || timestamp === undefined || !content) {
      return res.status(400).json({ 
        message: 'Course ID, module ID, timestamp, and content are required' 
      });
    }

    // Verify student is enrolled
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId
    });

    if (!enrollment) {
      return res.status(403).json({ message: 'Not enrolled in this course' });
    }

    const note = new VideoNote({
      student: req.user._id,
      course: courseId,
      moduleId: moduleId,
      timestamp: timestamp,
      content: content.trim(),
      tags: tags || [],
      color: color || '#fbbf24'
    });

    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a note
router.put('/:id', authenticate, async (req, res) => {
  try {
    const note = await VideoNote.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Verify ownership
    if (note.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { content, tags, color, timestamp } = req.body;

    if (content !== undefined) note.content = content.trim();
    if (tags !== undefined) note.tags = tags;
    if (color !== undefined) note.color = color;
    if (timestamp !== undefined) note.timestamp = timestamp;

    await note.save();
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a note
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const note = await VideoNote.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Verify ownership
    if (note.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await note.deleteOne();
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search notes by tags or content
router.get('/search', authenticate, async (req, res) => {
  try {
    const { q, courseId, tags } = req.query;

    const query = { student: req.user._id };
    
    if (courseId) {
      query.course = courseId;
    }

    if (tags) {
      query.tags = { $in: tags.split(',') };
    }

    if (q) {
      query.content = { $regex: q, $options: 'i' };
    }

    const notes = await VideoNote.find(query)
      .populate('course', 'title')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
