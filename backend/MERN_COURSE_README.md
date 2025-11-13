# MERN Stack Development Course Setup

This document explains how to create the MERN Stack Development course with batches in the RASS Academy platform.

## Overview

A comprehensive MERN Stack Development course has been created with:
- Complete course curriculum covering MongoDB, Express.js, React, and Node.js
- 15 detailed modules with video links
- Tech stack information and logos
- Course features, requirements, and learning outcomes
- Testimonials and FAQs
- 3 different batches for different learning schedules

## Setup Instructions

### Method 1: Using the Seed Script (Recommended)

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies (if not already done):**
   ```bash
   npm install
   ```

3. **Ensure your .env file has the correct MONGO_URI:**
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. **Run the seed script:**
   ```bash
   node seedMernCourse.js
   ```

   This will:
   - Create an instructor user (if one doesn't exist)
   - Create the MERN Stack Development course
   - Create 3 batches for the course

### Method 2: Using the API Endpoint

You can also create the course using the POST endpoint:

```bash
POST http://localhost:8000/api/courses
```

Use the course data from `mernCourseData.json` file.

### Method 3: Manual Database Import

Import the `mernCourseData.json` file directly into your MongoDB database using MongoDB Compass or mongoimport CLI tool.

## Course Details

### Basic Information
- **Title:** MERN Stack Development
- **Category:** Web Development
- **Level:** Intermediate
- **Price:** ₹4999
- **Duration:** 15 modules (approximately 1975 minutes of video content)

### Tech Stack Covered
1. MongoDB - NoSQL Database
2. Express.js - Backend Framework
3. React - Frontend Library
4. Node.js - JavaScript Runtime
5. JavaScript (ES6+)
6. Git - Version Control

### Modules Include
1. Course Introduction and Setup
2. JavaScript ES6+ Essentials
3. MongoDB Database Fundamentals
4. Building RESTful APIs with Node.js & Express
5. Authentication & Authorization with JWT
6. React Fundamentals & Components
7. React Hooks Deep Dive
8. State Management with Context API
9. React Router & Navigation
10. Connecting React Frontend with Express Backend
11. File Upload & Image Handling
12. Deployment to Production
13. Project 1: Task Management Application
14. Project 2: E-Commerce Platform
15. Project 3: Social Media Dashboard

### Batches Created

1. **MERN Stack - Weekend Batch (January 2026)**
   - Start Date: January 10, 2026
   - End Date: April 30, 2026
   - Capacity: 30 students
   - Schedule: Saturday and Sunday, 10 AM - 2 PM IST
   - Perfect for working professionals

2. **MERN Stack - Weekday Evening Batch (January 2026)**
   - Start Date: January 15, 2026
   - End Date: April 15, 2026
   - Capacity: 25 students
   - Schedule: Monday to Friday, 7 PM - 9 PM IST
   - Ideal for students and working professionals

3. **MERN Stack - Intensive Bootcamp (February 2026)**
   - Start Date: February 1, 2026
   - End Date: March 31, 2026
   - Capacity: 20 students
   - Schedule: Monday to Friday, 2 PM - 6 PM IST
   - Best for career switchers and full-time learners

## Video Links

All modules include links to educational video content on YouTube. These are publicly available tutorial videos that demonstrate the concepts being taught.

## Features Included

- Hands-on coding exercises and projects
- Build 3 real-world full-stack applications
- Live coding sessions and Q&A
- Access to private Discord community
- Resume and portfolio guidance
- Lifetime access to course materials
- Certificate of completion
- Job interview preparation

## Skills Students Will Gain

- Full-Stack JavaScript Development
- RESTful API Design and Development
- React Application Development
- Database Design with MongoDB
- User Authentication & Authorization
- Deployment and DevOps Basics
- Git Version Control
- Debugging and Testing

## Target Job Roles

- Full-Stack Developer
- MERN Stack Developer
- JavaScript Developer
- React Developer
- Node.js Developer
- Backend Developer
- Frontend Developer

## Verification

After running the seed script, you can verify the course was created by:

1. **Using the API:**
   ```bash
   GET http://localhost:8000/api/courses
   ```

2. **Checking a specific course:**
   ```bash
   GET http://localhost:8000/api/courses/{courseId}
   ```

3. **Viewing batches for the course:**
   ```bash
   GET http://localhost:8000/api/batches/course/{courseId}
   ```

## Notes

- The seed script will check if the course already exists before creating it to avoid duplicates
- If an instructor user doesn't exist, one will be created automatically
- All batches are set to active by default
- Video URLs point to actual educational content on YouTube for testing purposes
- The course can be further customized through the API endpoints

## Troubleshooting

If you encounter issues:

1. **Database connection error:** Verify your MONGO_URI in the .env file
2. **Course already exists:** The script will skip creation and only create batches if needed
3. **Module errors:** Ensure all dependencies are installed with `npm install`

## Support

For any issues or questions regarding the course setup, please contact the RASS Academy technical team.
