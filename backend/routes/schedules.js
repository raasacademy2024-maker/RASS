import express from 'express';
import Schedule from '../models/Schedule.js';
import Batch from '../models/Batch.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get schedule for a batch
router.get('/batch/:batchId', authenticate, async (req, res) => {
  try {
    const { batchId } = req.params;

    const schedules = await Schedule.find({ 
      batch: batchId,
      isActive: true 
    })
      .populate('course', 'title')
      .populate('batch', 'name startDate endDate')
      .populate('entries.instructor', 'name email')
      .sort({ effectiveFrom: -1 });

    // Get the most recent active schedule
    const activeSchedule = schedules.find(s => {
      const now = new Date();
      if (s.effectiveTo && s.effectiveTo < now) return false;
      return true;
    });

    res.json(activeSchedule || null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get schedule for a specific date
router.get('/batch/:batchId/date/:date', authenticate, async (req, res) => {
  try {
    const { batchId, date } = req.params;
    const targetDate = new Date(date);

    const schedule = await Schedule.findOne({
      batch: batchId,
      isActive: true,
      effectiveFrom: { $lte: targetDate },
      $or: [
        { effectiveTo: { $exists: false } },
        { effectiveTo: { $gte: targetDate } }
      ]
    })
      .populate('entries.instructor', 'name email');

    if (!schedule) {
      return res.json({ entries: [] });
    }

    const dayEntries = schedule.getScheduleForDate(targetDate);
    res.json({ entries: dayEntries, date: targetDate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create or update schedule (instructor/admin only)
router.post('/', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const { batchId, courseId, entries, effectiveFrom, effectiveTo } = req.body;

    if (!batchId || !courseId || !entries || entries.length === 0) {
      return res.status(400).json({ 
        message: 'Batch ID, course ID, and entries are required' 
      });
    }

    // Verify batch exists
    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    // Validate time format for each entry
    for (const entry of entries) {
      if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(entry.startTime) ||
          !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(entry.endTime)) {
        return res.status(400).json({ 
          message: 'Invalid time format. Use HH:MM (24-hour format)' 
        });
      }
    }

    // Deactivate existing schedules for this batch
    await Schedule.updateMany(
      { batch: batchId, isActive: true },
      { isActive: false }
    );

    const schedule = new Schedule({
      batch: batchId,
      course: courseId,
      entries,
      effectiveFrom: effectiveFrom || Date.now(),
      effectiveTo,
      createdBy: req.user._id
    });

    await schedule.save();
    await schedule.populate([
      { path: 'course', select: 'title' },
      { path: 'batch', select: 'name startDate endDate' },
      { path: 'entries.instructor', select: 'name email' }
    ]);

    res.status(201).json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update schedule (instructor/admin only)
router.put('/:id', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    const { entries, effectiveFrom, effectiveTo, isActive } = req.body;

    if (entries !== undefined) {
      // Validate time format
      for (const entry of entries) {
        if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(entry.startTime) ||
            !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(entry.endTime)) {
          return res.status(400).json({ 
            message: 'Invalid time format. Use HH:MM (24-hour format)' 
          });
        }
      }
      schedule.entries = entries;
    }

    if (effectiveFrom !== undefined) schedule.effectiveFrom = effectiveFrom;
    if (effectiveTo !== undefined) schedule.effectiveTo = effectiveTo;
    if (isActive !== undefined) schedule.isActive = isActive;

    await schedule.save();
    await schedule.populate([
      { path: 'course', select: 'title' },
      { path: 'batch', select: 'name startDate endDate' },
      { path: 'entries.instructor', select: 'name email' }
    ]);

    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete schedule (admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    await schedule.deleteOne();
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all schedules for a course (instructor/admin only)
router.get('/course/:courseId', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const { courseId } = req.params;

    const schedules = await Schedule.find({ course: courseId })
      .populate('batch', 'name startDate endDate')
      .populate('entries.instructor', 'name email')
      .sort({ effectiveFrom: -1 });

    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
