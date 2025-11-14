import express from 'express';
import Quiz from '../models/Quiz.js';
import Enrollment from '../models/Enrollment.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { submissionLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Get all quizzes for a course
router.get('/course/:courseId', authenticate, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { batchId } = req.query;

    const query = { course: courseId };
    
    if (batchId) {
      query.$or = [
        { batch: batchId },
        { batch: { $exists: false } }
      ];
    }

    const quizzes = await Quiz.find(query)
      .populate('course', 'title')
      .populate('batch', 'name')
      .populate('createdBy', 'name')
      .select('-attempts.answers.correctAnswer') // Hide correct answers
      .sort({ createdAt: -1 });

    // For students, filter out quizzes not yet available
    if (req.user.role === 'student') {
      const now = new Date();
      const availableQuizzes = quizzes.filter(quiz => {
        if (quiz.availableFrom && quiz.availableFrom > now) return false;
        if (quiz.availableTo && quiz.availableTo < now) return false;
        return true;
      });
      
      // Add student's attempt info
      const quizzesWithAttempts = availableQuizzes.map(quiz => {
        const studentAttempts = quiz.attempts.filter(
          a => a.student.toString() === req.user._id.toString()
        );
        return {
          ...quiz.toObject(),
          attempts: undefined, // Remove all attempts from response
          myAttempts: studentAttempts.length,
          maxAttempts: quiz.maxAttempts,
          canAttempt: studentAttempts.length < quiz.maxAttempts,
          bestScore: studentAttempts.length > 0 
            ? Math.max(...studentAttempts.map(a => a.percentage || 0))
            : null
        };
      });
      
      return res.json(quizzesWithAttempts);
    }

    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single quiz
router.get('/:id', authenticate, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('course', 'title')
      .populate('batch', 'name')
      .populate('createdBy', 'name');

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // For students, check availability and hide answers
    if (req.user.role === 'student') {
      const now = new Date();
      if (quiz.availableFrom && quiz.availableFrom > now) {
        return res.status(403).json({ message: 'Quiz not yet available' });
      }
      if (quiz.availableTo && quiz.availableTo < now) {
        return res.status(403).json({ message: 'Quiz no longer available' });
      }

      // Check if student can attempt
      const studentAttempts = quiz.attempts.filter(
        a => a.student.toString() === req.user._id.toString()
      );

      if (studentAttempts.length >= quiz.maxAttempts) {
        return res.status(403).json({ 
          message: 'Maximum attempts reached',
          attempts: studentAttempts.length,
          maxAttempts: quiz.maxAttempts
        });
      }

      // Remove correct answers from questions
      const quizData = quiz.toObject();
      quizData.questions = quizData.questions.map(q => ({
        ...q,
        correctAnswer: undefined,
        explanation: undefined
      }));
      quizData.attempts = undefined;

      return res.json(quizData);
    }

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a quiz (instructor/admin only)
router.post('/', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const {
      title,
      description,
      courseId,
      batchId,
      moduleId,
      questions,
      duration,
      passingScore,
      availableFrom,
      availableTo,
      maxAttempts,
      shuffleQuestions,
      showResults
    } = req.body;

    if (!title || !courseId || !questions || questions.length === 0) {
      return res.status(400).json({ 
        message: 'Title, course ID, and at least one question are required' 
      });
    }

    const quiz = new Quiz({
      title,
      description,
      course: courseId,
      batch: batchId,
      module: moduleId,
      questions,
      duration,
      passingScore,
      availableFrom,
      availableTo,
      maxAttempts,
      shuffleQuestions,
      showResults,
      createdBy: req.user._id
    });

    await quiz.save();
    await quiz.populate([
      { path: 'course', select: 'title' },
      { path: 'batch', select: 'name' }
    ]);

    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit quiz attempt
router.post('/:id/submit', authenticate, submissionLimiter, async (req, res) => {
  try {
    const { answers, timeSpent } = req.body; // answers: [{ questionIndex, answer }]

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check if student is enrolled
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: quiz.course,
      ...(quiz.batch && { batch: quiz.batch })
    });

    if (!enrollment) {
      return res.status(403).json({ message: 'Not enrolled in this course/batch' });
    }

    // Check availability
    const now = new Date();
    if (quiz.availableFrom && quiz.availableFrom > now) {
      return res.status(403).json({ message: 'Quiz not yet available' });
    }
    if (quiz.availableTo && quiz.availableTo < now) {
      return res.status(403).json({ message: 'Quiz no longer available' });
    }

    // Check attempts
    const studentAttempts = quiz.attempts.filter(
      a => a.student.toString() === req.user._id.toString()
    );

    if (studentAttempts.length >= quiz.maxAttempts) {
      return res.status(403).json({ message: 'Maximum attempts reached' });
    }

    // Grade the answers
    const gradedAnswers = answers.map(ans => {
      const question = quiz.questions[ans.questionIndex];
      if (!question) {
        return {
          questionIndex: ans.questionIndex,
          answer: ans.answer,
          isCorrect: false,
          pointsEarned: 0
        };
      }

      const isCorrect = ans.answer.trim().toLowerCase() === 
                       question.correctAnswer.trim().toLowerCase();
      
      return {
        questionIndex: ans.questionIndex,
        answer: ans.answer,
        isCorrect,
        pointsEarned: isCorrect ? question.points : 0
      };
    });

    const score = gradedAnswers.reduce((sum, ans) => sum + ans.pointsEarned, 0);
    const maxScore = quiz.calculateMaxScore();
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

    const attempt = {
      student: req.user._id,
      submittedAt: Date.now(),
      answers: gradedAnswers,
      score,
      maxScore,
      percentage,
      timeSpent
    };

    quiz.attempts.push(attempt);
    await quiz.save();

    // Return results based on showResults setting
    if (quiz.showResults) {
      // Include correct answers and explanations
      const detailedResults = gradedAnswers.map(ans => ({
        ...ans,
        correctAnswer: quiz.questions[ans.questionIndex]?.correctAnswer,
        explanation: quiz.questions[ans.questionIndex]?.explanation
      }));

      return res.json({
        score,
        maxScore,
        percentage,
        passed: percentage >= quiz.passingScore,
        answers: detailedResults
      });
    } else {
      // Only return basic score info
      return res.json({
        score,
        maxScore,
        percentage,
        passed: percentage >= quiz.passingScore,
        message: 'Quiz submitted successfully'
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get student's quiz attempts
router.get('/:id/my-attempts', authenticate, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const studentAttempts = quiz.attempts.filter(
      a => a.student.toString() === req.user._id.toString()
    );

    // If showResults is false, hide detailed answers
    if (!quiz.showResults) {
      const sanitizedAttempts = studentAttempts.map(attempt => ({
        _id: attempt._id,
        submittedAt: attempt.submittedAt,
        score: attempt.score,
        maxScore: attempt.maxScore,
        percentage: attempt.percentage,
        timeSpent: attempt.timeSpent
      }));
      return res.json(sanitizedAttempts);
    }

    res.json(studentAttempts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get quiz statistics (instructor/admin only)
router.get('/:id/stats', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const totalAttempts = quiz.attempts.length;
    const uniqueStudents = [...new Set(quiz.attempts.map(a => a.student.toString()))];
    
    const scores = quiz.attempts.map(a => a.percentage || 0);
    const averageScore = scores.length > 0 
      ? scores.reduce((sum, s) => sum + s, 0) / scores.length 
      : 0;
    
    const passedAttempts = quiz.attempts.filter(
      a => (a.percentage || 0) >= quiz.passingScore
    ).length;

    const stats = {
      totalAttempts,
      uniqueStudents: uniqueStudents.length,
      averageScore: Math.round(averageScore),
      passRate: totalAttempts > 0 
        ? Math.round((passedAttempts / totalAttempts) * 100) 
        : 0,
      highestScore: scores.length > 0 ? Math.max(...scores) : 0,
      lowestScore: scores.length > 0 ? Math.min(...scores) : 0
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update quiz (instructor/admin only)
router.put('/:id', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Don't allow updating if there are already attempts
    if (quiz.attempts.length > 0) {
      return res.status(403).json({ 
        message: 'Cannot update quiz that already has attempts' 
      });
    }

    const allowedUpdates = [
      'title', 'description', 'questions', 'duration', 'passingScore',
      'availableFrom', 'availableTo', 'maxAttempts', 'shuffleQuestions', 'showResults'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        quiz[field] = req.body[field];
      }
    });

    await quiz.save();
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete quiz (admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    await quiz.deleteOne();
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
