# Batch-wise Student Management API Guide

This guide explains how to use the batch-wise management features in the RASS Academy platform. All course features now support batch-level filtering and management.

## Overview

The platform now supports comprehensive batch-wise management for:
- **Assignments** - Create and manage assignments for specific batches
- **Live Sessions** - Schedule sessions for specific batches
- **Forum Discussions** - Batch-specific discussion forums
- **Certificates** - Certificates linked to batch completion
- **Enrollments** - Filter and manage students by batch
- **Analytics** - Batch-level statistics and reporting

## Core Concepts

### Backward Compatibility
All batch features are **optional**. Courses can still operate without batches, and all existing functionality is preserved.

- If no batch is specified, features apply to the entire course
- Batch filtering is available via query parameters
- Students enrolled without a batch see course-wide content
- Students enrolled in a batch see batch-specific + course-wide content

## Batch Management

### 1. Get Batches for a Course

**Endpoint:** `GET /api/batches/course/:courseId`

**Query Parameters:**
- None required

**Response:**
```json
[
  {
    "_id": "batch123",
    "name": "Weekend Batch - Jan 2025",
    "course": "course123",
    "startDate": "2025-01-15T00:00:00.000Z",
    "endDate": "2025-04-15T00:00:00.000Z",
    "capacity": 30,
    "enrolledCount": 15,
    "isActive": true
  }
]
```

**Notes:**
- Unauthenticated users see only active batches
- Admins see all batches (active and inactive)

### 2. Get Batch Statistics

**Endpoint:** `GET /api/batches/:id/stats`

**Auth Required:** Instructor or Admin

**Response:**
```json
{
  "batch": {
    "_id": "batch123",
    "name": "Weekend Batch - Jan 2025",
    "startDate": "2025-01-15T00:00:00.000Z",
    "endDate": "2025-04-15T00:00:00.000Z",
    "capacity": 30,
    "enrolledCount": 15,
    "isActive": true
  },
  "stats": {
    "totalEnrolled": 15,
    "completedCount": 3,
    "inProgressCount": 12,
    "averageProgress": 45,
    "availableSlots": 15,
    "assignmentsCount": 8,
    "liveSessionsCount": 12,
    "forumPostsCount": 24
  },
  "students": [
    {
      "_id": "student123",
      "name": "John Doe",
      "email": "john@example.com",
      "enrolledAt": "2025-01-10T00:00:00.000Z",
      "progress": 45,
      "completed": false,
      "completedAt": null
    }
  ]
}
```

### 3. Get All Batches with Statistics

**Endpoint:** `GET /api/batches/course/:courseId/stats`

**Auth Required:** Instructor or Admin

**Response:** Array of batch objects with statistics

## Assignment Management

### 1. Create Batch-Specific Assignment

**Endpoint:** `POST /api/assignments`

**Auth Required:** Instructor or Admin

**Request Body:**
```json
{
  "title": "Week 3 Project",
  "description": "Build a REST API",
  "course": "course123",
  "batch": "batch123",  // Optional - omit for course-wide assignment
  "dueDate": "2025-02-01T23:59:59.000Z",
  "maxPoints": 100,
  "instructions": "Follow the project guidelines..."
}
```

**Notes:**
- If `batch` is provided, only students in that batch are notified
- Batch-specific assignments are only visible to students in that batch

### 2. Get Assignments (with Batch Filter)

**Endpoint:** `GET /api/assignments/course/:courseId?batchId=batch123`

**Auth Required:** Yes

**Query Parameters:**
- `batchId` (optional) - Filter assignments for specific batch

**Response:**
```json
[
  {
    "_id": "assignment123",
    "title": "Week 3 Project",
    "description": "Build a REST API",
    "course": "course123",
    "batch": {
      "_id": "batch123",
      "name": "Weekend Batch - Jan 2025",
      "startDate": "2025-01-15T00:00:00.000Z",
      "endDate": "2025-04-15T00:00:00.000Z"
    },
    "dueDate": "2025-02-01T23:59:59.000Z",
    "submissions": []
  }
]
```

### 3. Submit Assignment

**Endpoint:** `POST /api/assignments/:id/submit`

**Auth Required:** Student

**Request Body:**
```json
{
  "content": "Assignment submission text...",
  "fileUrl": "https://storage.example.com/submission.pdf"
}
```

**Notes:**
- System validates student is enrolled in the course/batch
- Students not in the batch cannot submit

## Live Session Management

### 1. Create Batch-Specific Live Session

**Endpoint:** `POST /api/live-sessions/course/:courseId`

**Auth Required:** Instructor or Admin

**Request Body:**
```json
{
  "title": "Week 4 Live Coding Session",
  "description": "Building a full-stack app",
  "batch": "batch123",  // Optional
  "scheduledAt": "2025-02-05T14:00:00.000Z",
  "duration": 120,
  "meetingLink": "https://meet.example.com/session123"
}
```

**Notes:**
- If `batch` is specified, only students in that batch are notified
- Only batch students can join the session

### 2. Get Live Sessions (with Batch Filter)

**Endpoint:** `GET /api/live-sessions/course/:courseId?batchId=batch123`

**Auth Required:** Yes

**Query Parameters:**
- `batchId` (optional) - Filter sessions for specific batch

### 3. Get Student's Live Sessions

**Endpoint:** `GET /api/live-sessions/my`

**Auth Required:** Student

**Notes:**
- Returns sessions for all batches the student is enrolled in
- Includes course-wide sessions (without batch)
- Excludes sessions from batches the student is not in

### 4. Join Live Session

**Endpoint:** `POST /api/live-sessions/:id/join`

**Auth Required:** Student

**Notes:**
- Validates student enrollment in the session's batch
- Returns meeting link only if authorized

## Forum Management

### 1. Get Forum Posts (with Batch Filter)

**Endpoint:** `GET /api/forums/course/:courseId?batchId=batch123&category=general`

**Auth Required:** Yes

**Query Parameters:**
- `batchId` (optional) - Filter posts for specific batch
- `category` (optional) - Filter by category

**Response:**
```json
[
  {
    "_id": "post123",
    "title": "Question about Week 3 Assignment",
    "content": "How do we handle authentication?",
    "author": {
      "_id": "user123",
      "name": "Jane Doe"
    },
    "course": "course123",
    "batch": {
      "_id": "batch123",
      "name": "Weekend Batch - Jan 2025"
    },
    "category": "assignment",
    "replies": [],
    "createdAt": "2025-01-20T10:00:00.000Z"
  }
]
```

### 2. Create Forum Post

**Endpoint:** `POST /api/forums`

**Auth Required:** Yes

**Request Body:**
```json
{
  "title": "Question about Week 3 Assignment",
  "content": "How do we handle authentication?",
  "course": "course123",
  "batch": "batch123",  // Optional
  "category": "assignment"
}
```

**Notes:**
- Students can only create posts in batches they're enrolled in
- Instructors/admins can create posts in any batch

## Certificate Management

### 1. Generate Certificate

**Endpoint:** `POST /api/certificates/generate`

**Auth Required:** Student

**Request Body:**
```json
{
  "courseId": "course123"
}
```

**Notes:**
- Certificate automatically includes batch information from enrollment
- If student completed course in a batch, certificate shows batch details
- Each batch completion gets a separate certificate

### 2. Get My Certificates

**Endpoint:** `GET /api/certificates/my-certificates`

**Auth Required:** Student

**Response:**
```json
[
  {
    "_id": "cert123",
    "certificateId": "RASS-1234567890-ABC",
    "student": "student123",
    "course": {
      "_id": "course123",
      "title": "MERN Stack Development"
    },
    "batch": {
      "_id": "batch123",
      "name": "Weekend Batch - Jan 2025",
      "startDate": "2025-01-15T00:00:00.000Z",
      "endDate": "2025-04-15T00:00:00.000Z"
    },
    "issuedAt": "2025-04-20T00:00:00.000Z",
    "grade": "A"
  }
]
```

## Enrollment Management

### 1. Get Course Enrollments (with Batch Filter)

**Endpoint:** `GET /api/enrollments/course/:courseId?batchId=batch123`

**Auth Required:** Instructor or Admin

**Query Parameters:**
- `batchId` (optional) - Filter enrollments for specific batch

**Response:**
```json
[
  {
    "_id": "enrollment123",
    "student": {
      "_id": "student123",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "course": {
      "_id": "course123",
      "title": "MERN Stack Development"
    },
    "batch": {
      "_id": "batch123",
      "name": "Weekend Batch - Jan 2025",
      "startDate": "2025-01-15T00:00:00.000Z",
      "endDate": "2025-04-15T00:00:00.000Z"
    },
    "enrolledAt": "2025-01-10T00:00:00.000Z",
    "completed": false
  }
]
```

**Use Cases:**
- View all students in a specific batch
- Export batch-specific student lists
- Track batch enrollment status

## Common Use Cases

### 1. Create a Complete Batch Setup

```javascript
// 1. Create the batch
POST /api/batches
{
  "courseId": "course123",
  "name": "Evening Batch - Feb 2025",
  "startDate": "2025-02-01",
  "endDate": "2025-05-01",
  "capacity": 25
}

// 2. Create batch-specific assignments
POST /api/assignments
{
  "title": "Week 1 Assignment",
  "course": "course123",
  "batch": "newBatchId",
  ...
}

// 3. Schedule batch-specific live sessions
POST /api/live-sessions/course/course123
{
  "title": "Week 1 Session",
  "batch": "newBatchId",
  ...
}
```

### 2. View All Batch Activities

```javascript
// Get batch details with statistics
GET /api/batches/batch123/stats

// Get batch assignments
GET /api/assignments/course/course123?batchId=batch123

// Get batch live sessions
GET /api/live-sessions/course/course123?batchId=batch123

// Get batch forum posts
GET /api/forums/course/course123?batchId=batch123

// Get batch enrollments
GET /api/enrollments/course/course123?batchId=batch123
```

### 3. Student Experience

When a student is enrolled in a batch, they see:
- Batch-specific assignments
- Batch-specific live sessions
- Batch-specific forum discussions
- Course-wide content (without batch restriction)

Students enrolled without a batch see only course-wide content.

## Best Practices

### 1. Batch Organization
- Use clear, descriptive batch names (e.g., "Weekend Batch - Jan 2025")
- Set realistic capacity limits
- Plan start/end dates carefully

### 2. Content Distribution
- Use batches for time-sensitive content (assignments with deadlines)
- Use course-wide for general resources and permanent content
- Consider batch schedules when scheduling live sessions

### 3. Communication
- Use batch-specific forum categories for batch discussions
- General course topics can remain course-wide
- Announcements can target specific batches

### 4. Analytics
- Regularly check batch statistics to monitor progress
- Compare performance across different batches
- Use batch completion rates to improve future batches

## Migration from Non-Batch to Batch System

Existing courses without batches continue to work normally:
1. All existing data remains accessible
2. Enrollments without batch see all course content
3. New batches can be added gradually
4. Content can be made batch-specific over time

No migration scripts are required - the system handles both scenarios seamlessly.

## Error Handling

### Common Error Responses

**403 Forbidden:**
```json
{
  "message": "Not enrolled in this course/batch"
}
```
- Student trying to access batch content they're not enrolled in

**400 Bad Request:**
```json
{
  "message": "Batch is full"
}
```
- Attempting to enroll in a batch at capacity

**404 Not Found:**
```json
{
  "message": "Batch not found"
}
```
- Invalid batch ID provided

## Support

For questions or issues:
1. Check this documentation
2. Review the API examples
3. Contact the development team

## API Summary Table

| Feature | Create | List/Filter | View Details | Update | Delete |
|---------|--------|-------------|--------------|--------|--------|
| Batches | ✅ | ✅ | ✅ | ✅ | ✅ |
| Batch Stats | - | ✅ | ✅ | - | - |
| Assignments | ✅ (with batch) | ✅ (by batch) | ✅ | ✅ | ✅ |
| Live Sessions | ✅ (with batch) | ✅ (by batch) | ✅ | ✅ | ✅ |
| Forums | ✅ (with batch) | ✅ (by batch) | ✅ | - | - |
| Certificates | ✅ (auto batch) | ✅ | ✅ | - | - |
| Enrollments | ✅ (with batch) | ✅ (by batch) | ✅ | ✅ | - |

✅ = Supported
- = Not applicable
