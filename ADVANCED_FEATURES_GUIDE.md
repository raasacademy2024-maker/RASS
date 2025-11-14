# Advanced LMS Features Implementation Guide

## Overview

This implementation adds comprehensive batch-wise features, learning tools, and instructor analytics to the RASS Academy LMS platform. The features are designed to work seamlessly across three user roles: Students, Instructors, and Admins.

## Features Implemented

### 1. Batch-Wise Features

#### Attendance Tracking (Manual + Auto from Videos)
**Backend:**
- Model: `Attendance.js`
- Routes: `attendance.js` (7 endpoints)
- Features:
  - Manual attendance marking by instructors
  - Auto-tracking based on video watch percentage (≥75% = present)
  - Batch-wise statistics and reports
  - Student-specific attendance history

**API Endpoints:**
```javascript
GET    /api/attendance/batch/:batchId              // Get batch attendance
GET    /api/attendance/student/:studentId          // Get student attendance
POST   /api/attendance                             // Create attendance session
PUT    /api/attendance/:id/mark                    // Mark attendance
POST   /api/attendance/auto-track                  // Auto-track from video
GET    /api/attendance/batch/:batchId/stats        // Get statistics
DELETE /api/attendance/:id                         // Delete (admin only)
```

#### Batch-Specific Announcements
**Backend:**
- Model: `Announcement.js`
- Routes: `announcements.js` (7 endpoints)
- Features:
  - Target specific batches or all students
  - Priority levels (low, medium, high, urgent)
  - Pinned announcements
  - Expiration dates
  - Read tracking

**Frontend:**
- `InstructorAnnouncements.tsx` - Create and manage announcements
- `StudentAnnouncements.tsx` - View announcements with smart filtering

**API Endpoints:**
```javascript
GET    /api/announcements/course/:courseId         // Get announcements
GET    /api/announcements/:id                      // Get single announcement
POST   /api/announcements                          // Create announcement
PUT    /api/announcements/:id                      // Update announcement
DELETE /api/announcements/:id                      // Delete (admin only)
GET    /api/announcements/course/:courseId/unread-count
```

#### Batch Timetable (Class Schedule)
**Backend:**
- Model: `Schedule.js`
- Routes: `schedules.js` (6 endpoints)
- Features:
  - Weekly recurring schedules
  - Day-wise class timings
  - Multiple schedules with effective dates
  - Per-batch customization

**API Endpoints:**
```javascript
GET    /api/schedules/batch/:batchId               // Get batch schedule
GET    /api/schedules/batch/:batchId/date/:date    // Get schedule for date
POST   /api/schedules                              // Create schedule
PUT    /api/schedules/:id                          // Update schedule
DELETE /api/schedules/:id                          // Delete (admin only)
GET    /api/schedules/course/:courseId             // Get all schedules
```

#### Batch-Wise Progress Leaderboard
**Backend:**
- Routes: `analytics.js` includes leaderboard endpoint
- Features:
  - Ranked by progress percentage
  - Module completion tracking
  - Visual rankings with icons

**Frontend:**
- `Leaderboard.tsx` - Student leaderboard with visual rankings
- Features:
  - Top 3 with special badges (trophy, medals)
  - Circular progress indicators
  - Personal rank display

**API Endpoint:**
```javascript
GET    /api/analytics/batch/:batchId/leaderboard   // Get leaderboard
```

### 2. Learning Features

#### Weekly Quizzes + Auto Grading
**Backend:**
- Model: `Quiz.js`
- Routes: `quizzes.js` (10 endpoints)
- Features:
  - Multiple question types (MCQ, true/false, short answer, coding)
  - Automatic grading
  - Time limits
  - Multiple attempts with tracking
  - Immediate or delayed results
  - Question shuffling

**Frontend:**
- `StudentQuizzes.tsx` - Take quizzes with timer and instant results
- Features:
  - Real-time countdown timer
  - Auto-submit on time expiry
  - Detailed answer review
  - Score tracking and best attempt

**API Endpoints:**
```javascript
GET    /api/quizzes/course/:courseId               // Get course quizzes
GET    /api/quizzes/:id                            // Get quiz
POST   /api/quizzes                                // Create quiz
PUT    /api/quizzes/:id                            // Update quiz
DELETE /api/quizzes/:id                            // Delete (admin only)
POST   /api/quizzes/:id/submit                     // Submit quiz
GET    /api/quizzes/:id/my-attempts                // Get my attempts
GET    /api/quizzes/:id/stats                      // Get statistics
```

#### AI Doubt Solver
**Backend:**
- Model: `Doubt.js`
- Routes: `doubts.js` (11 endpoints)
- Features:
  - AI-generated solutions (placeholder for API integration)
  - Instructor responses
  - Code snippet support
  - Upvoting system
  - Tags and categorization
  - Status tracking (open, ai-answered, instructor-answered, resolved)

**Frontend:**
- `StudentDoubts.tsx` - Ask doubts and get AI/instructor solutions
- Features:
  - Code snippet input
  - Tag-based organization
  - AI solution generation
  - Instructor responses
  - Helpful/not helpful feedback
  - Search and filter

**API Endpoints:**
```javascript
GET    /api/doubts/course/:courseId                // Get course doubts
GET    /api/doubts/my-doubts                       // Get my doubts
GET    /api/doubts/:id                             // Get doubt
POST   /api/doubts                                 // Create doubt
POST   /api/doubts/:id/ai-solve                    // Generate AI solution
POST   /api/doubts/:id/instructor-response         // Add instructor response
PATCH  /api/doubts/:id/status                      // Update status
POST   /api/doubts/:id/helpful                     // Mark helpful
POST   /api/doubts/:id/upvote                      // Upvote doubt
DELETE /api/doubts/:id                             // Delete doubt
GET    /api/doubts/search                          // Search doubts
```

#### Video Timestamped Notes
**Backend:**
- Model: `VideoNote.js`
- Routes: `videoNotes.js` (7 endpoints)
- Features:
  - Timestamp-based notes
  - Color coding
  - Tags for organization
  - Search functionality
  - Course and module filtering

**API Endpoints:**
```javascript
GET    /api/video-notes/course/:courseId           // Get course notes
GET    /api/video-notes/module/:moduleId           // Get module notes
POST   /api/video-notes                            // Create note
PUT    /api/video-notes/:id                        // Update note
DELETE /api/video-notes/:id                        // Delete note
GET    /api/video-notes/search                     // Search notes
```

### 3. Instructor Tools

#### Instructor Analytics Dashboard
**Backend:**
- Routes: `analytics.js` (4 endpoints)
- Features:
  - Top performing students
  - Students at risk identification
  - Batch engagement score
  - Assignment and quiz statistics
  - Progress tracking

**Frontend:**
- `InstructorAnalytics.tsx` - Comprehensive analytics dashboard
- Features:
  - Course and batch filtering
  - Overview cards with key metrics
  - Top performers list
  - At-risk students identification
  - Assignment and quiz statistics
  - Batch engagement scoring

**API Endpoints:**
```javascript
GET    /api/analytics/course/:courseId             // Get course analytics
GET    /api/analytics/batch/:batchId/engagement    // Get engagement metrics
GET    /api/analytics/student/:studentId           // Get student performance
GET    /api/analytics/batch/:batchId/leaderboard   // Get leaderboard
```

**Engagement Score Calculation:**
- 50% - Average course progress
- 30% - Attendance rate
- 20% - Assignment submission rate

**At-Risk Criteria:**
- Progress < 30% OR
- No activity in last 7 days

## Database Models

### New Models Created

1. **Attendance** - Tracks student attendance (manual + auto)
2. **VideoNote** - Timestamped notes on video content
3. **Quiz** - Quiz questions and student attempts
4. **Schedule** - Batch-wise class schedules
5. **Announcement** - Batch-targeted announcements
6. **Doubt** - Student questions with AI/instructor responses

## Frontend Components

### Instructor Components
- `Analytics.tsx` - Comprehensive analytics dashboard
- `Announcements.tsx` - Create and manage announcements

### Student Components
- `Leaderboard.tsx` - Batch-wise progress leaderboard
- `Quizzes.tsx` - Take quizzes with timer
- `Doubts.tsx` - AI doubt solver interface
- `Announcements.tsx` - View announcements

### API Services
Enhanced `api.ts` with 7 new API modules:
- `attendanceAPI`
- `videoNoteAPI`
- `quizAPI`
- `scheduleAPI`
- `announcementAPI`
- `doubtAPI`
- `analyticsAPI`

## Integration Guide

### For AI Doubt Solver
To integrate with AI services (OpenAI, Anthropic, etc.):

1. Add environment variable:
```
AI_API_KEY=your_api_key
AI_API_URL=https://api.openai.com/v1/chat/completions
```

2. Update `doubts.js` route (POST /:id/ai-solve):
```javascript
const response = await fetch(process.env.AI_API_URL, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.AI_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'gpt-4',
    messages: [{
      role: 'user',
      content: `Solve this coding doubt: ${doubt.question}\n\nCode: ${doubt.codeSnippet}`
    }]
  })
});
```

### For Video Notes Integration
To integrate with video player:

1. Add notes sidebar to video player component
2. Call `videoNoteAPI.createNote()` when user saves a note
3. Display notes timeline below video
4. Make notes clickable to jump to timestamp

Example:
```javascript
const handleSaveNote = async (timestamp, content) => {
  await videoNoteAPI.createNote({
    courseId,
    moduleId,
    timestamp: Math.floor(videoRef.current.currentTime),
    content,
    color: selectedColor
  });
};
```

### For Auto-Attendance Tracking
In video player component:

```javascript
useEffect(() => {
  const trackInterval = setInterval(() => {
    const watchDuration = videoRef.current.currentTime;
    const totalDuration = videoRef.current.duration;
    
    attendanceAPI.autoTrackAttendance({
      courseId,
      batchId,
      moduleId,
      watchDuration,
      totalDuration
    });
  }, 60000); // Every minute

  return () => clearInterval(trackInterval);
}, []);
```

## Security Considerations

### Authentication & Authorization
- All endpoints require authentication via JWT token
- Role-based access control (student, instructor, admin)
- Students can only access their own data
- Instructors can access their course data
- Admins have full access

### Input Validation
- All inputs are validated on the backend
- Enrollment verification before data access
- Batch membership validation

### Rate Limiting (Recommended)
Add rate limiting to prevent abuse:
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## Usage Examples

### Creating a Quiz
```javascript
await quizAPI.createQuiz({
  title: 'Week 3 Quiz',
  description: 'Test your knowledge',
  courseId: 'course_id',
  batchId: 'batch_id',
  duration: 30, // minutes
  passingScore: 60,
  maxAttempts: 3,
  questions: [
    {
      question: 'What is React?',
      type: 'multiple-choice',
      options: ['Library', 'Framework', 'Language', 'Tool'],
      correctAnswer: 'Library',
      points: 10
    }
  ]
});
```

### Marking Attendance
```javascript
await attendanceAPI.markAttendance(attendanceId, [
  { studentId: 'student1', status: 'present', remarks: '' },
  { studentId: 'student2', status: 'absent', remarks: 'Sick' }
]);
```

### Creating an Announcement
```javascript
await announcementAPI.createAnnouncement({
  courseId: 'course_id',
  title: 'Class Cancelled',
  content: 'Tomorrow\'s class is cancelled due to holiday',
  priority: 'high',
  type: 'schedule-change',
  batchIds: ['batch1', 'batch2'],
  isPinned: true
});
```

## Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### Manual Testing Checklist
- [ ] Create and submit quiz
- [ ] Mark attendance manually
- [ ] Auto-track attendance from video
- [ ] Create announcement
- [ ] Ask doubt and get AI solution
- [ ] View analytics dashboard
- [ ] Check leaderboard
- [ ] Create and view video notes
- [ ] Check batch schedule

## Performance Optimization

### Database Indexing
The following indexes are created for optimal performance:

```javascript
// VideoNote
{ student: 1, course: 1, moduleId: 1 }
{ student: 1, moduleId: 1, timestamp: 1 }

// Doubt
{ student: 1, course: 1 }
{ course: 1, batch: 1, status: 1 }
{ tags: 1 }

// Announcement
{ course: 1, batches: 1, isActive: 1 }
{ createdAt: -1 }
```

### Caching Recommendations
Consider caching:
- Leaderboard data (refresh every 5 minutes)
- Analytics data (refresh every 10 minutes)
- Announcements (refresh when new announcement created)

## Future Enhancements

1. **Coding Editor Integration**
   - Monaco Editor for in-browser coding
   - Judge0 API for code execution
   - Multiple language support

2. **Video Conferencing**
   - Zoom SDK integration
   - Google Meet integration
   - In-platform video calls

3. **WhatsApp/Telegram Integration**
   - Auto-create batch groups
   - Send notifications via messaging apps

4. **Advanced Analytics**
   - Predictive analytics for student performance
   - Batch comparison reports
   - Export to PDF/Excel

5. **Gamification**
   - Badges and achievements
   - Points system
   - Streak tracking

## Support

For issues or questions:
- Check the API documentation in `BATCH_MANAGEMENT_API.md`
- Review the implementation summary in `IMPLEMENTATION_SUMMARY.md`
- Contact the development team

## License

This implementation is part of the RASS Academy LMS platform.
