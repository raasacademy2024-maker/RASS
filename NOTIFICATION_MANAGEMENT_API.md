# Notification Management API Documentation

This document describes the API endpoints and fields needed for the Notification Management feature that can be used in external development.

## Base URL
All endpoints are relative to: `/api/notification-management`

## Authentication
All endpoints require authentication with a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

Required roles: `admin` or `instructor`

---

## Endpoints

### 1. Get Users Enrolled in a Course

**Endpoint:** `GET /courses/:courseId/users`

**Description:** Retrieves all users enrolled in a specific course.

**Path Parameters:**
- `courseId` (string, required): The MongoDB ObjectId of the course

**Response:**
```json
{
  "courseId": "string",
  "users": [
    {
      "_id": "string",
      "name": "string",
      "email": "string"
    }
  ],
  "count": "number"
}
```

**Example:**
```bash
GET /api/notification-management/courses/64a1b2c3d4e5f6789abc1234/users
```

---

### 2. Get All Users with Filters

**Endpoint:** `GET /users`

**Description:** Retrieves all users with optional filtering by role and search term.

**Query Parameters:**
- `role` (string, optional): Filter by user role (`student`, `instructor`, `admin`)
- `search` (string, optional): Search by name or email (case-insensitive)

**Response:**
```json
{
  "users": [
    {
      "_id": "string",
      "name": "string",
      "email": "string",
      "role": "string"
    }
  ],
  "count": "number"
}
```

**Example:**
```bash
GET /api/notification-management/users?role=student&search=john
```

---

### 3. Send Notification by Course

**Endpoint:** `POST /send-by-course`

**Description:** Send notifications to all users enrolled in a specific course.

**Request Body:**
```json
{
  "courseId": "string (required)",
  "title": "string (required)",
  "message": "string (required)",
  "type": "string (optional, default: 'course-update')",
  "sendEmail": "boolean (optional, default: false)"
}
```

**Field Descriptions:**
- `courseId`: MongoDB ObjectId of the course
- `title`: Notification title/subject
- `message`: Notification message body
- `type`: Notification type - one of: `course-update`, `announcement`, `system`, `bulk`
- `sendEmail`: Whether to send email notifications in addition to in-app notifications

**Response:**
```json
{
  "message": "Notifications sent successfully",
  "count": "number",
  "course": "string",
  "emailResults": {
    "successful": [
      {
        "email": "string",
        "messageId": "string"
      }
    ],
    "failed": [
      {
        "email": "string",
        "error": "string"
      }
    ]
  }
}
```

**Example:**
```bash
POST /api/notification-management/send-by-course
Content-Type: application/json

{
  "courseId": "64a1b2c3d4e5f6789abc1234",
  "title": "New Module Added",
  "message": "We've added a new module on Advanced React Hooks. Check it out!",
  "type": "course-update",
  "sendEmail": true
}
```

---

### 4. Send Notification to Selected Users

**Endpoint:** `POST /send-to-users`

**Description:** Send notifications to manually selected users.

**Request Body:**
```json
{
  "userIds": ["string"] (required),
  "title": "string (required)",
  "message": "string (required)",
  "type": "string (optional, default: 'bulk')",
  "sendEmail": "boolean (optional, default: false)"
}
```

**Field Descriptions:**
- `userIds`: Array of MongoDB ObjectIds of users to send notifications to
- `title`: Notification title/subject
- `message`: Notification message body
- `type`: Notification type - one of: `course-update`, `announcement`, `system`, `bulk`
- `sendEmail`: Whether to send email notifications in addition to in-app notifications

**Response:**
```json
{
  "message": "Notifications sent successfully",
  "count": "number",
  "emailResults": {
    "successful": [
      {
        "email": "string",
        "messageId": "string"
      }
    ],
    "failed": [
      {
        "email": "string",
        "error": "string"
      }
    ]
  }
}
```

**Example:**
```bash
POST /api/notification-management/send-to-users
Content-Type: application/json

{
  "userIds": [
    "64a1b2c3d4e5f6789abc1234",
    "64a1b2c3d4e5f6789abc5678"
  ],
  "title": "Important Announcement",
  "message": "The platform will be under maintenance on Sunday from 2 AM to 4 AM.",
  "type": "announcement",
  "sendEmail": true
}
```

---

### 5. Get Notification History

**Endpoint:** `GET /history`

**Description:** Retrieves notification history with pagination and filters.

**Query Parameters:**
- `page` (number, optional, default: 1): Page number for pagination
- `limit` (number, optional, default: 20): Number of results per page
- `type` (string, optional): Filter by notification type
- `emailStatus` (string, optional): Filter by email status (`pending`, `sent`, `failed`)

**Response:**
```json
{
  "notifications": [
    {
      "_id": "string",
      "recipient": {
        "name": "string",
        "email": "string"
      },
      "sentBy": {
        "name": "string",
        "email": "string"
      },
      "title": "string",
      "message": "string",
      "type": "string",
      "emailSent": "boolean",
      "emailStatus": "string",
      "emailSentAt": "string (ISO date)",
      "createdAt": "string (ISO date)",
      "relatedId": "string (ObjectId, optional)"
    }
  ],
  "totalPages": "number",
  "currentPage": "number",
  "total": "number"
}
```

**Example:**
```bash
GET /api/notification-management/history?page=1&limit=20&type=course-update&emailStatus=sent
```

---

### 6. Get Notification Statistics

**Endpoint:** `GET /stats`

**Description:** Retrieves statistics about sent notifications.

**Response:**
```json
{
  "totalNotifications": "number",
  "emailsSent": "number",
  "emailsFailed": "number",
  "emailsPending": "number",
  "byType": [
    {
      "_id": "string",
      "count": "number"
    }
  ],
  "recentNotifications": [
    {
      "_id": "string",
      "recipient": {
        "name": "string",
        "email": "string"
      },
      "title": "string",
      "message": "string",
      "type": "string",
      "createdAt": "string (ISO date)"
    }
  ]
}
```

**Example:**
```bash
GET /api/notification-management/stats
```

---

### 7. Test Email Sending

**Endpoint:** `POST /test-email`

**Description:** Send a test email to verify email configuration.

**Request Body:**
```json
{
  "email": "string (required)",
  "title": "string (required)",
  "message": "string (required)"
}
```

**Field Descriptions:**
- `email`: Email address to send test email to
- `title`: Test email subject
- `message`: Test email message body

**Response:**
```json
{
  "message": "Test email sent successfully",
  "messageId": "string"
}
```

**Example:**
```bash
POST /api/notification-management/test-email
Content-Type: application/json

{
  "email": "admin@example.com",
  "title": "Test Email",
  "message": "This is a test email to verify email configuration."
}
```

---

## Notification Types

The following notification types are supported:

1. **`course-update`**: For course-related updates (new modules, content changes)
2. **`announcement`**: For general announcements
3. **`system`**: For system-level notifications
4. **`bulk`**: For bulk notifications to multiple users
5. **`assignment`**: For assignment-related notifications
6. **`payment`**: For payment-related notifications
7. **`live-session`**: For live session notifications
8. **`chat`**: For chat notifications
9. **`discussion`**: For forum discussion notifications
10. **`support`**: For support ticket notifications

---

## Email Templates

The system includes pre-built email templates for different notification types:

### Course Update Template
- Professional layout with course information
- Includes call-to-action button to view course
- RASS Academy branding

### Bulk Notification Template
- Clean, professional design
- Supports multi-line messages
- Branded footer with timestamp

### Announcement Template
- Eye-catching orange/red gradient header
- Highlighted message box
- Professional formatting

### System Notification Template
- Green gradient header for system messages
- Clear message presentation
- Professional branding

All templates are:
- Mobile-responsive
- Include RASS Academy branding
- Display timestamps in IST (Indian Standard Time)
- Support HTML content in messages

---

## Environment Variables Required

For email functionality to work, the following environment variables must be set:

```env
NODEMAILER_USER_EMAIL=your-gmail@gmail.com
NODEMAILER_USER_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:5173  # or your production URL
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "message": "Error description"
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "message": "Forbidden - Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Error description"
}
```

---

## Rate Limiting

All API endpoints are subject to rate limiting as configured in the application's rate limiter middleware.

---

## Notes for External Development

1. **Authentication**: Always include the JWT token in the Authorization header
2. **Role-based Access**: Only users with `admin` or `instructor` roles can access these endpoints
3. **Email Configuration**: Ensure environment variables are properly set for email functionality
4. **Notification Storage**: All notifications are stored in the database regardless of email sending status
5. **Bulk Operations**: When sending to many users, consider the email rate limits of your provider
6. **Email Templates**: The system automatically selects the appropriate email template based on notification type
7. **Error Handling**: Always check the `emailResults` object when `sendEmail` is true to see which emails succeeded or failed
8. **Pagination**: Use pagination parameters for the history endpoint to avoid loading too much data at once

---

## Database Schema

### Notification Model

```javascript
{
  recipient: ObjectId (ref: 'User', required),
  title: String (required),
  message: String (required),
  type: String (enum, required),
  relatedId: ObjectId (optional),
  read: Boolean (default: false),
  readAt: Date (optional),
  emailSent: Boolean (default: false),
  emailSentAt: Date (optional),
  emailStatus: String (enum: 'pending', 'sent', 'failed', default: 'pending'),
  emailError: String (optional),
  sentBy: ObjectId (ref: 'User', optional),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## Support

For issues or questions regarding the Notification Management API, please contact the RASS Academy development team.
