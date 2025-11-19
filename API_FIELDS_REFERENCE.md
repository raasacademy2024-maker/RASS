# API Fields Summary for External Development

This document provides a quick reference of all API fields needed for integrating with the Notification Management system in external applications.

---

## Authentication Header

**Required for all requests:**
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 1. Send Notification by Course

**Endpoint:** `POST /api/notification-management/send-by-course`

### Request Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `courseId` | String | Yes | MongoDB ObjectId of the course | "64a1b2c3d4e5f6789abc1234" |
| `title` | String | Yes | Notification title/subject | "New Module Available" |
| `message` | String | Yes | Notification message body | "We've added Module 5..." |
| `type` | String | No | Notification type (default: 'course-update') | "course-update" |
| `sendEmail` | Boolean | No | Send email notification (default: false) | true |

### Valid Notification Types
- `course-update`
- `announcement`
- `system`
- `bulk`
- `assignment`
- `payment`
- `live-session`
- `chat`
- `discussion`
- `support`

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `message` | String | Success message |
| `count` | Number | Number of notifications sent |
| `course` | String | Course title |
| `emailResults` | Object | Email sending results (if sendEmail=true) |
| `emailResults.successful` | Array | Successfully sent emails |
| `emailResults.failed` | Array | Failed emails with error messages |

---

## 2. Send Notification to Selected Users

**Endpoint:** `POST /api/notification-management/send-to-users`

### Request Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `userIds` | Array[String] | Yes | Array of user MongoDB ObjectIds | ["64a1...", "64a2..."] |
| `title` | String | Yes | Notification title/subject | "Important Announcement" |
| `message` | String | Yes | Notification message body | "Platform maintenance..." |
| `type` | String | No | Notification type (default: 'bulk') | "announcement" |
| `sendEmail` | Boolean | No | Send email notification (default: false) | true |

### Response Fields

Same as "Send by Course" endpoint, except without the `course` field.

---

## 3. Get Users by Course

**Endpoint:** `GET /api/notification-management/courses/:courseId/users`

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `courseId` | String | MongoDB ObjectId of the course |

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `courseId` | String | The course ID |
| `users` | Array | Array of user objects |
| `users[].\_id` | String | User MongoDB ObjectId |
| `users[].name` | String | User's full name |
| `users[].email` | String | User's email address |
| `count` | Number | Total number of users |

---

## 4. Get All Users with Filters

**Endpoint:** `GET /api/notification-management/users`

### Query Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `role` | String | No | Filter by user role | "student" |
| `search` | String | No | Search by name or email | "john" |

### Valid Role Values
- `student`
- `instructor`
- `admin`

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `users` | Array | Array of user objects |
| `users[].\_id` | String | User MongoDB ObjectId |
| `users[].name` | String | User's full name |
| `users[].email` | String | User's email address |
| `users[].role` | String | User's role |
| `count` | Number | Total number of users |

---

## 5. Get Notification History

**Endpoint:** `GET /api/notification-management/history`

### Query Parameters

| Parameter | Type | Required | Description | Default | Example |
|-----------|------|----------|-------------|---------|---------|
| `page` | Number | No | Page number | 1 | 2 |
| `limit` | Number | No | Results per page | 20 | 50 |
| `type` | String | No | Filter by notification type | - | "course-update" |
| `emailStatus` | String | No | Filter by email status | - | "sent" |

### Valid Email Status Values
- `pending`
- `sent`
- `failed`

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `notifications` | Array | Array of notification objects |
| `notifications[].\_id` | String | Notification MongoDB ObjectId |
| `notifications[].recipient` | Object | Recipient user info |
| `notifications[].recipient.name` | String | Recipient's name |
| `notifications[].recipient.email` | String | Recipient's email |
| `notifications[].sentBy` | Object | Sender info (optional) |
| `notifications[].title` | String | Notification title |
| `notifications[].message` | String | Notification message |
| `notifications[].type` | String | Notification type |
| `notifications[].emailSent` | Boolean | Whether email was sent |
| `notifications[].emailStatus` | String | Email delivery status |
| `notifications[].emailSentAt` | String | ISO date of email sending |
| `notifications[].createdAt` | String | ISO date of creation |
| `notifications[].relatedId` | String | Related entity ID (optional) |
| `totalPages` | Number | Total number of pages |
| `currentPage` | Number | Current page number |
| `total` | Number | Total notification count |

---

## 6. Get Notification Statistics

**Endpoint:** `GET /api/notification-management/stats`

### No Parameters Required

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `totalNotifications` | Number | Total notifications sent |
| `emailsSent` | Number | Successfully sent emails |
| `emailsFailed` | Number | Failed email deliveries |
| `emailsPending` | Number | Pending email deliveries |
| `byType` | Array | Breakdown by notification type |
| `byType[].\_id` | String | Notification type |
| `byType[].count` | Number | Count for this type |
| `recentNotifications` | Array | Last 5 notifications (same structure as history) |

---

## 7. Test Email Sending

**Endpoint:** `POST /api/notification-management/test-email`

### Request Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `email` | String | Yes | Test recipient email | "admin@example.com" |
| `title` | String | Yes | Test email subject | "Test Email" |
| `message` | String | Yes | Test email message | "Testing..." |

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `message` | String | Success message |
| `messageId` | String | Email provider's message ID |

---

## Error Responses

All endpoints may return these error structures:

### 400 Bad Request
```json
{
  "message": "Descriptive error message"
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

## Environment Variables Needed

Set these in your environment or `.env` file:

| Variable | Description | Example |
|----------|-------------|---------|
| `NODEMAILER_USER_EMAIL` | Gmail address for sending | "your-email@gmail.com" |
| `NODEMAILER_USER_PASSWORD` | Gmail app-specific password | "abcd efgh ijkl mnop" |
| `FRONTEND_URL` | Frontend URL for email links | "http://localhost:5173" |

---

## Example Integration Code

### JavaScript/Node.js Example

```javascript
const axios = require('axios');

const API_BASE = 'https://your-api.com/api/notification-management';
const TOKEN = 'your-jwt-token';

// Send notification by course
async function sendCourseNotification(courseId, title, message) {
  try {
    const response = await axios.post(
      `${API_BASE}/send-by-course`,
      {
        courseId,
        title,
        message,
        type: 'course-update',
        sendEmail: true
      },
      {
        headers: { Authorization: `Bearer ${TOKEN}` }
      }
    );
    
    console.log('Sent to', response.data.count, 'users');
    console.log('Email results:', response.data.emailResults);
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}

// Get course users
async function getCourseUsers(courseId) {
  try {
    const response = await axios.get(
      `${API_BASE}/courses/${courseId}/users`,
      {
        headers: { Authorization: `Bearer ${TOKEN}` }
      }
    );
    
    console.log('Found', response.data.count, 'users');
    return response.data.users;
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}

// Get notification history
async function getHistory(page = 1, type = null) {
  try {
    const params = { page };
    if (type) params.type = type;
    
    const response = await axios.get(
      `${API_BASE}/history`,
      {
        params,
        headers: { Authorization: `Bearer ${TOKEN}` }
      }
    );
    
    console.log('Page', response.data.currentPage, 'of', response.data.totalPages);
    return response.data.notifications;
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}
```

### Python Example

```python
import requests

API_BASE = 'https://your-api.com/api/notification-management'
TOKEN = 'your-jwt-token'
HEADERS = {'Authorization': f'Bearer {TOKEN}'}

# Send notification by course
def send_course_notification(course_id, title, message):
    response = requests.post(
        f'{API_BASE}/send-by-course',
        json={
            'courseId': course_id,
            'title': title,
            'message': message,
            'type': 'course-update',
            'sendEmail': True
        },
        headers=HEADERS
    )
    
    if response.status_code == 201:
        data = response.json()
        print(f"Sent to {data['count']} users")
        print(f"Email results: {data.get('emailResults')}")
    else:
        print(f"Error: {response.json()['message']}")

# Get statistics
def get_stats():
    response = requests.get(
        f'{API_BASE}/stats',
        headers=HEADERS
    )
    
    if response.status_code == 200:
        stats = response.json()
        print(f"Total: {stats['totalNotifications']}")
        print(f"Sent: {stats['emailsSent']}")
        print(f"Failed: {stats['emailsFailed']}")
        return stats
    else:
        print(f"Error: {response.json()['message']}")
```

---

## Quick Reference Table

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/send-by-course` | POST | Required | Send to course students |
| `/send-to-users` | POST | Required | Send to selected users |
| `/courses/:id/users` | GET | Required | Get course enrollees |
| `/users` | GET | Required | Get all users (filtered) |
| `/history` | GET | Required | View notification history |
| `/stats` | GET | Required | Get statistics |
| `/test-email` | POST | Required | Test email config |

---

## Support

For detailed documentation, see:
- **Full API Docs**: `NOTIFICATION_MANAGEMENT_API.md`
- **Implementation Guide**: `NOTIFICATION_MANAGEMENT_SUMMARY.md`
- **Quick Start**: `NOTIFICATION_MANAGEMENT_QUICKSTART.md`
