import express from 'express';
import Doubt from '../models/Doubt.js';
import Enrollment from '../models/Enrollment.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Get doubts for a course
router.get('/course/:courseId', authenticate, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { batchId, status, tags } = req.query;

    const query = { course: courseId };
    
    if (batchId) {
      query.$or = [
        { batch: batchId },
        { batch: { $exists: false } }
      ];
    }

    if (status) {
      query.status = status;
    }

    if (tags) {
      query.tags = { $in: tags.split(',') };
    }

    // Students only see their own doubts unless they're helping
    if (req.user.role === 'student') {
      query.$or = [
        { student: req.user._id },
        { status: { $in: ['ai-answered', 'instructor-answered'] } } // Public resolved doubts
      ];
    }

    const doubts = await Doubt.find(query)
      .populate('student', 'name email')
      .populate('course', 'title')
      .populate('batch', 'name')
      .populate('instructorResponse.respondedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(doubts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get my doubts
router.get('/my-doubts', authenticate, async (req, res) => {
  try {
    const { courseId, status } = req.query;

    const query = { student: req.user._id };
    
    if (courseId) query.course = courseId;
    if (status) query.status = status;

    const doubts = await Doubt.find(query)
      .populate('course', 'title')
      .populate('batch', 'name')
      .populate('instructorResponse.respondedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(doubts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single doubt
router.get('/:id', authenticate, async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id)
      .populate('student', 'name email')
      .populate('course', 'title')
      .populate('batch', 'name')
      .populate('instructorResponse.respondedBy', 'name email')
      .populate('relatedDoubts');

    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found' });
    }

    res.json(doubt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a doubt
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      courseId,
      batchId,
      moduleId,
      title,
      question,
      codeSnippet,
      language,
      tags
    } = req.body;

    if (!courseId || !title || !question) {
      return res.status(400).json({ 
        message: 'Course ID, title, and question are required' 
      });
    }

    // Verify student is enrolled
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId
    });

    if (!enrollment && req.user.role === 'student') {
      return res.status(403).json({ message: 'Not enrolled in this course' });
    }

    const doubt = new Doubt({
      student: req.user._id,
      course: courseId,
      batch: batchId,
      module: moduleId,
      title,
      question,
      codeSnippet,
      language,
      tags: tags || []
    });

    await doubt.save();
    await doubt.populate([
      { path: 'student', select: 'name email' },
      { path: 'course', select: 'title' },
      { path: 'batch', select: 'name' }
    ]);

    // Optionally trigger AI response here
    // This would be an async process that generates AI response
    // For now, we'll leave it as a placeholder

    res.status(201).json(doubt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate AI response for a doubt
router.post('/:id/ai-solve', authenticate, aiLimiter, async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found' });
    }

    // Verify ownership or instructor/admin
    if (req.user.role === 'student' && 
        doubt.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // TODO: Integrate with AI API (OpenAI, Anthropic, etc.)
    // For now, return a placeholder response
    const aiResponse = {
      answer: `This is a placeholder AI response for: "${doubt.title}". 
      
To properly solve this doubt, we would integrate with an AI service that can:
1. Analyze the question and any code snippets
2. Provide detailed explanations
3. Generate code examples if needed
4. Suggest related resources

Integration with AI services (like OpenAI GPT-4) would be added here.`,
      generatedAt: Date.now(),
      confidence: 0.85,
      codeExamples: doubt.codeSnippet ? [
        `// Example solution\n${doubt.codeSnippet}\n// Add your implementation here`
      ] : []
    };

    doubt.aiResponse = aiResponse;
    doubt.status = 'ai-answered';
    await doubt.save();

    res.json({
      message: 'AI response generated',
      aiResponse
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add instructor response (instructor/admin only)
router.post('/:id/instructor-response', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const { answer } = req.body;

    if (!answer) {
      return res.status(400).json({ message: 'Answer is required' });
    }

    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found' });
    }

    doubt.instructorResponse = {
      answer,
      respondedBy: req.user._id,
      respondedAt: Date.now()
    };
    doubt.status = 'instructor-answered';

    await doubt.save();
    await doubt.populate('instructorResponse.respondedBy', 'name email');

    res.json(doubt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update doubt status
router.patch('/:id/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found' });
    }

    // Only doubt owner can close/resolve
    if (req.user.role === 'student' && 
        doubt.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    doubt.status = status;
    await doubt.save();

    res.json(doubt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark doubt as helpful/not helpful
router.post('/:id/helpful', authenticate, async (req, res) => {
  try {
    const { isHelpful } = req.body;

    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found' });
    }

    // Only doubt owner can mark as helpful
    if (doubt.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    doubt.isHelpful = isHelpful;
    await doubt.save();

    res.json({ message: 'Feedback recorded' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upvote a doubt
router.post('/:id/upvote', authenticate, async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found' });
    }

    const hasUpvoted = doubt.upvotes.some(
      id => id.toString() === req.user._id.toString()
    );

    if (hasUpvoted) {
      // Remove upvote
      doubt.upvotes = doubt.upvotes.filter(
        id => id.toString() !== req.user._id.toString()
      );
    } else {
      // Add upvote
      doubt.upvotes.push(req.user._id);
    }

    await doubt.save();
    res.json({ upvotes: doubt.upvotes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete doubt
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found' });
    }

    // Only owner or admin can delete
    if (req.user.role !== 'admin' && 
        doubt.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await doubt.deleteOne();
    res.json({ message: 'Doubt deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search doubts
router.get('/search', authenticate, async (req, res) => {
  try {
    const { q, courseId, language } = req.query;

    const query = {};
    
    if (courseId) query.course = courseId;
    if (language) query.language = language;
    
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { question: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } }
      ];
    }

    const doubts = await Doubt.find(query)
      .populate('student', 'name')
      .populate('course', 'title')
      .sort({ upvotes: -1, createdAt: -1 })
      .limit(50);

    res.json(doubts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
