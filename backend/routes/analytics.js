import express from 'express';
import Enrollment from '../models/Enrollment.js';
import Assignment from '../models/Assignment.js';
import Quiz from '../models/Quiz.js';
import Attendance from '../models/Attendance.js';
import LiveSession from '../models/LiveSession.js';
import Batch from '../models/Batch.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get instructor analytics for a course
router.get('/course/:courseId', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const { courseId } = req.params;
    const { batchId } = req.query;

    // Build enrollment query
    const enrollmentQuery = { course: courseId };
    if (batchId) enrollmentQuery.batch = batchId;

    // Get enrollments
    const enrollments = await Enrollment.find(enrollmentQuery)
      .populate('student', 'name email')
      .populate('batch', 'name');

    // Calculate overall statistics
    const totalStudents = enrollments.length;
    const completedStudents = enrollments.filter(e => e.completed).length;
    const averageProgress = totalStudents > 0
      ? Math.round(enrollments.reduce((sum, e) => {
          const completed = e.progress.filter(p => p.completed).length;
          const total = e.progress.length || 1;
          return sum + (completed / total * 100);
        }, 0) / totalStudents)
      : 0;

    // Get top performing students (by completion percentage)
    const topStudents = enrollments
      .map(e => {
        const completed = e.progress.filter(p => p.completed).length;
        const total = e.progress.length || 1;
        const completionPercentage = Math.round((completed / total) * 100);
        
        return {
          student: e.student,
          batch: e.batch,
          completionPercentage,
          enrolledAt: e.enrolledAt,
          lastAccessed: e.lastAccessed
        };
      })
      .sort((a, b) => b.completionPercentage - a.completionPercentage)
      .slice(0, 10);

    // Get students at risk (low progress + no recent activity)
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const studentsAtRisk = enrollments
      .map(e => {
        const completed = e.progress.filter(p => p.completed).length;
        const total = e.progress.length || 1;
        const completionPercentage = Math.round((completed / total) * 100);
        const daysSinceLastAccess = e.lastAccessed 
          ? Math.floor((now - new Date(e.lastAccessed)) / (1000 * 60 * 60 * 24))
          : 999;
        
        return {
          student: e.student,
          batch: e.batch,
          completionPercentage,
          daysSinceLastAccess,
          isAtRisk: completionPercentage < 30 || !e.lastAccessed || new Date(e.lastAccessed) < sevenDaysAgo
        };
      })
      .filter(s => s.isAtRisk)
      .sort((a, b) => a.completionPercentage - b.completionPercentage);

    // Calculate batch engagement score (if batch-specific)
    let batchEngagementScore = 0;
    if (batchId) {
      const attendanceRecords = await Attendance.find({ 
        course: courseId,
        batch: batchId 
      });
      
      const assignmentQuery = { course: courseId, batch: batchId };
      const assignments = await Assignment.find(assignmentQuery);
      
      const totalAttendanceSessions = attendanceRecords.length;
      const totalAssignments = assignments.length;
      
      // Calculate attendance rate
      let attendanceRate = 0;
      if (totalAttendanceSessions > 0) {
        const totalPresent = attendanceRecords.reduce((sum, att) => {
          const presentCount = att.records.filter(r => r.status === 'present').length;
          return sum + presentCount;
        }, 0);
        const totalPossible = totalAttendanceSessions * totalStudents;
        attendanceRate = totalPossible > 0 ? (totalPresent / totalPossible * 100) : 0;
      }

      // Calculate assignment submission rate
      let assignmentRate = 0;
      if (totalAssignments > 0) {
        const totalSubmissions = assignments.reduce((sum, assign) => 
          sum + assign.submissions.length, 0
        );
        const totalPossible = totalAssignments * totalStudents;
        assignmentRate = totalPossible > 0 ? (totalSubmissions / totalPossible * 100) : 0;
      }

      // Engagement score is weighted average
      batchEngagementScore = Math.round(
        (averageProgress * 0.5) + (attendanceRate * 0.3) + (assignmentRate * 0.2)
      );
    }

    // Get assignment statistics
    const assignmentQuery = { course: courseId };
    if (batchId) assignmentQuery.batch = batchId;
    const assignments = await Assignment.find(assignmentQuery);
    
    const assignmentStats = {
      total: assignments.length,
      totalSubmissions: assignments.reduce((sum, a) => sum + a.submissions.length, 0),
      averageGrade: 0
    };

    const gradedSubmissions = assignments.flatMap(a => 
      a.submissions.filter(s => s.grade !== undefined && s.grade !== null)
    );
    
    if (gradedSubmissions.length > 0) {
      assignmentStats.averageGrade = Math.round(
        gradedSubmissions.reduce((sum, s) => sum + s.grade, 0) / gradedSubmissions.length
      );
    }

    // Get quiz statistics
    const quizQuery = { course: courseId };
    if (batchId) quizQuery.batch = batchId;
    const quizzes = await Quiz.find(quizQuery);
    
    const quizStats = {
      total: quizzes.length,
      totalAttempts: quizzes.reduce((sum, q) => sum + q.attempts.length, 0),
      averageScore: 0
    };

    const allAttempts = quizzes.flatMap(q => q.attempts);
    if (allAttempts.length > 0) {
      quizStats.averageScore = Math.round(
        allAttempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / allAttempts.length
      );
    }

    const analytics = {
      overview: {
        totalStudents,
        completedStudents,
        averageProgress,
        batchEngagementScore
      },
      topPerformers: topStudents,
      studentsAtRisk: studentsAtRisk,
      assignments: assignmentStats,
      quizzes: quizStats
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get batch engagement details
router.get('/batch/:batchId/engagement', authenticate, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const { batchId } = req.params;

    const batch = await Batch.findById(batchId).populate('course', 'title');
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    // Get enrollments
    const enrollments = await Enrollment.find({ batch: batchId })
      .populate('student', 'name email lastLogin');

    // Get attendance
    const attendanceRecords = await Attendance.find({ batch: batchId });
    
    // Get assignments
    const assignments = await Assignment.find({ batch: batchId });
    
    // Get quizzes
    const quizzes = await Quiz.find({ batch: batchId });
    
    // Get live sessions
    const sessions = await LiveSession.find({ batch: batchId });

    // Calculate per-student engagement
    const studentEngagement = enrollments.map(enrollment => {
      const studentId = enrollment.student._id.toString();
      
      // Progress
      const completed = enrollment.progress.filter(p => p.completed).length;
      const total = enrollment.progress.length || 1;
      const progressPercentage = Math.round((completed / total) * 100);
      
      // Attendance
      const studentAttendance = attendanceRecords.reduce((count, att) => {
        const record = att.records.find(r => r.student.toString() === studentId);
        return count + (record && record.status === 'present' ? 1 : 0);
      }, 0);
      const attendanceRate = attendanceRecords.length > 0 
        ? Math.round((studentAttendance / attendanceRecords.length) * 100)
        : 0;
      
      // Assignments
      const studentSubmissions = assignments.reduce((count, assign) => {
        return count + (assign.submissions.some(s => s.student.toString() === studentId) ? 1 : 0);
      }, 0);
      const assignmentRate = assignments.length > 0 
        ? Math.round((studentSubmissions / assignments.length) * 100)
        : 0;
      
      // Quizzes
      const studentQuizAttempts = quizzes.reduce((count, quiz) => {
        return count + quiz.attempts.filter(a => a.student.toString() === studentId).length;
      }, 0);
      
      // Overall engagement score
      const engagementScore = Math.round(
        (progressPercentage * 0.4) + (attendanceRate * 0.3) + (assignmentRate * 0.3)
      );
      
      return {
        student: enrollment.student,
        progressPercentage,
        attendanceRate,
        assignmentRate,
        quizAttempts: studentQuizAttempts,
        engagementScore,
        lastAccessed: enrollment.lastAccessed
      };
    });

    // Sort by engagement score
    studentEngagement.sort((a, b) => b.engagementScore - a.engagementScore);

    const engagement = {
      batch: {
        _id: batch._id,
        name: batch.name,
        course: batch.course
      },
      summary: {
        totalStudents: enrollments.length,
        averageEngagement: studentEngagement.length > 0
          ? Math.round(studentEngagement.reduce((sum, s) => sum + s.engagementScore, 0) / studentEngagement.length)
          : 0,
        totalAttendanceSessions: attendanceRecords.length,
        totalAssignments: assignments.length,
        totalQuizzes: quizzes.length,
        totalSessions: sessions.length
      },
      students: studentEngagement
    };

    res.json(engagement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get student performance details (instructor/admin can view any, students can view own)
router.get('/student/:studentId', authenticate, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { courseId } = req.query;

    // Authorization check
    if (req.user.role === 'student' && req.user._id.toString() !== studentId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const query = { student: studentId };
    if (courseId) query.course = courseId;

    const enrollments = await Enrollment.find(query)
      .populate('course', 'title')
      .populate('batch', 'name');

    const performanceData = await Promise.all(enrollments.map(async (enrollment) => {
      // Get assignments for this course
      const assignmentQuery = { 
        course: enrollment.course._id,
        ...(enrollment.batch && { batch: enrollment.batch._id })
      };
      const assignments = await Assignment.find(assignmentQuery);
      
      // Get student's submissions
      const submissions = assignments.map(assign => {
        const submission = assign.submissions.find(
          s => s.student.toString() === studentId
        );
        return {
          assignment: {
            _id: assign._id,
            title: assign.title,
            maxPoints: assign.maxPoints
          },
          submission: submission || null
        };
      });

      // Get quizzes
      const quizQuery = {
        course: enrollment.course._id,
        ...(enrollment.batch && { batch: enrollment.batch._id })
      };
      const quizzes = await Quiz.find(quizQuery);
      
      // Get student's quiz attempts
      const quizResults = quizzes.map(quiz => {
        const attempts = quiz.attempts.filter(
          a => a.student.toString() === studentId
        );
        const bestAttempt = attempts.length > 0
          ? attempts.reduce((best, current) => 
              (current.percentage || 0) > (best.percentage || 0) ? current : best
            )
          : null;
        
        return {
          quiz: {
            _id: quiz._id,
            title: quiz.title
          },
          attempts: attempts.length,
          bestScore: bestAttempt ? bestAttempt.percentage : null
        };
      });

      // Get attendance
      const attendanceRecords = await Attendance.find({
        course: enrollment.course._id,
        ...(enrollment.batch && { batch: enrollment.batch._id }),
        'records.student': studentId
      });

      const attendanceData = attendanceRecords.map(att => {
        const record = att.records.find(r => r.student.toString() === studentId);
        return {
          date: att.date,
          title: att.title,
          status: record?.status,
          watchPercentage: record?.watchPercentage
        };
      });

      return {
        course: enrollment.course,
        batch: enrollment.batch,
        progress: {
          completed: enrollment.progress.filter(p => p.completed).length,
          total: enrollment.progress.length,
          percentage: enrollment.progress.length > 0
            ? Math.round((enrollment.progress.filter(p => p.completed).length / enrollment.progress.length) * 100)
            : 0
        },
        assignments: submissions,
        quizzes: quizResults,
        attendance: attendanceData,
        enrolledAt: enrollment.enrolledAt,
        lastAccessed: enrollment.lastAccessed
      };
    }));

    res.json(performanceData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get leaderboard for a batch
router.get('/batch/:batchId/leaderboard', authenticate, async (req, res) => {
  try {
    const { batchId } = req.params;

    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    const enrollments = await Enrollment.find({ batch: batchId })
      .populate('student', 'name email profile.avatar');

    const leaderboard = enrollments.map(enrollment => {
      const completed = enrollment.progress.filter(p => p.completed).length;
      const total = enrollment.progress.length || 1;
      const progressPercentage = Math.round((completed / total) * 100);
      
      return {
        student: enrollment.student,
        progressPercentage,
        modulesCompleted: completed,
        totalModules: enrollment.progress.length,
        enrolledAt: enrollment.enrolledAt
      };
    });

    // Sort by progress percentage, then by modules completed
    leaderboard.sort((a, b) => {
      if (b.progressPercentage !== a.progressPercentage) {
        return b.progressPercentage - a.progressPercentage;
      }
      return b.modulesCompleted - a.modulesCompleted;
    });

    // Add rank
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));

    res.json({
      batch: {
        _id: batch._id,
        name: batch.name
      },
      leaderboard: rankedLeaderboard
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
