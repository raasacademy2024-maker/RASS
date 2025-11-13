# MERN Stack Course - API Testing Guide

This guide provides step-by-step instructions to test the MERN Stack Development course creation using the API.

## Prerequisites

1. Backend server should be running on `http://localhost:8000`
2. MongoDB connection should be active
3. You need an instructor user account

## Step 1: Create or Use an Instructor Account

First, ensure you have an instructor user. You can create one via the registration endpoint:

```bash
POST http://localhost:8000/api/auth/register
Content-Type: application/json

{
  "name": "RASS Academy Instructor",
  "email": "instructor@rassacademy.com",
  "password": "instructor123",
  "role": "instructor"
}
```

Or login if the account already exists:

```bash
POST http://localhost:8000/api/auth/login
Content-Type: application/json

{
  "email": "instructor@rassacademy.com",
  "password": "instructor123"
}
```

Save the returned `token` and `userId` from the response.

## Step 2: Create the MERN Stack Course

Use the course data from `mernCourseData.json`. You'll need to add the `instructor` field with the instructor's user ID.

```bash
POST http://localhost:8000/api/courses
Content-Type: application/json

{
  "title": "MERN Stack Development",
  "description": "Master full-stack web development with MongoDB, Express.js, React, and Node.js...",
  "instructor": "YOUR_INSTRUCTOR_USER_ID",
  ... (rest of the course data from mernCourseData.json)
}
```

The response will include the created course with its `_id`. Save this course ID.

## Step 3: Create Batches for the Course

Create each batch using the batch data. You'll need the course ID from Step 2.

### Batch 1: Weekend Batch

```bash
POST http://localhost:8000/api/batches
Authorization: Bearer YOUR_AUTH_TOKEN
Content-Type: application/json

{
  "courseId": "YOUR_COURSE_ID",
  "name": "MERN Stack - Weekend Batch (January 2026)",
  "startDate": "2026-01-10T00:00:00.000Z",
  "endDate": "2026-04-30T00:00:00.000Z",
  "capacity": 30,
  "description": "Weekend batch perfect for working professionals. Classes on Saturday and Sunday from 10 AM to 2 PM IST."
}
```

### Batch 2: Weekday Evening Batch

```bash
POST http://localhost:8000/api/batches
Authorization: Bearer YOUR_AUTH_TOKEN
Content-Type: application/json

{
  "courseId": "YOUR_COURSE_ID",
  "name": "MERN Stack - Weekday Evening Batch (January 2026)",
  "startDate": "2026-01-15T00:00:00.000Z",
  "endDate": "2026-04-15T00:00:00.000Z",
  "capacity": 25,
  "description": "Evening batch for students and professionals. Classes Monday to Friday from 7 PM to 9 PM IST."
}
```

### Batch 3: Intensive Bootcamp

```bash
POST http://localhost:8000/api/batches
Authorization: Bearer YOUR_AUTH_TOKEN
Content-Type: application/json

{
  "courseId": "YOUR_COURSE_ID",
  "name": "MERN Stack - Intensive Bootcamp (February 2026)",
  "startDate": "2026-02-01T00:00:00.000Z",
  "endDate": "2026-03-31T00:00:00.000Z",
  "capacity": 20,
  "description": "Intensive 8-week bootcamp with daily classes. Monday to Friday from 2 PM to 6 PM IST. Best for career switchers and full-time learners."
}
```

## Step 4: Verify the Course and Batches

### Get All Courses

```bash
GET http://localhost:8000/api/courses
```

This should return a list including your MERN Stack Development course.

### Get Specific Course

```bash
GET http://localhost:8000/api/courses/YOUR_COURSE_ID
```

This returns detailed information about the course including all modules, tech stack, testimonials, etc.

### Get Batches for the Course

```bash
GET http://localhost:8000/api/batches/course/YOUR_COURSE_ID
```

This returns all three batches created for the MERN course.

## Using cURL

Here are example cURL commands:

### Create Course

```bash
curl -X POST http://localhost:8000/api/courses \
  -H "Content-Type: application/json" \
  -d @mernCourseData.json
```

### Create Batch

```bash
curl -X POST http://localhost:8000/api/batches \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "courseId": "YOUR_COURSE_ID",
    "name": "MERN Stack - Weekend Batch (January 2026)",
    "startDate": "2026-01-10",
    "endDate": "2026-04-30",
    "capacity": 30,
    "description": "Weekend batch for working professionals"
  }'
```

### Get Course

```bash
curl http://localhost:8000/api/courses/YOUR_COURSE_ID
```

### Get Batches

```bash
curl http://localhost:8000/api/batches/course/YOUR_COURSE_ID
```

## Using the Seed Script (Recommended)

The easiest way is to use the automated seed script:

```bash
cd backend
node seedMernCourse.js
```

This will:
1. Connect to the database
2. Create an instructor user if one doesn't exist
3. Create the MERN Stack Development course
4. Create all 3 batches
5. Link everything together

## Expected Results

After successful creation, you should have:

- ✓ 1 MERN Stack Development course with:
  - Complete course description and details
  - 15 modules with video URLs
  - 6 tech stack items
  - 4 curriculum sections
  - 8 features
  - 3 testimonials
  - 5 FAQs
  - Learning outcomes and requirements

- ✓ 3 Batches:
  1. Weekend Batch (30 capacity)
  2. Weekday Evening Batch (25 capacity)
  3. Intensive Bootcamp (20 capacity)

## Troubleshooting

### Issue: "Course not found"
- Verify the course ID is correct
- Check if the course was created successfully

### Issue: "Not authorized to create batches"
- Make sure you're using a valid authentication token
- Ensure the token is for an instructor or admin user
- Check that the instructor owns the course

### Issue: "Database connection error"
- Verify MONGO_URI in .env file
- Check if MongoDB is accessible
- Ensure network connectivity

### Issue: "Course already exists"
- The seed script checks for existing courses
- To recreate, delete the existing course first
- Or modify the course title slightly

## Next Steps

After creating the course and batches:

1. Test enrollment functionality
2. Add assignments and live sessions
3. Configure payment integration
4. Set up notification system for batch updates
5. Test the frontend course listing and detail pages

## Support

For issues or questions, refer to the main README or contact the development team.
