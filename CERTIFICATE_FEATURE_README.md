# Certificate Generation Feature

## Overview
This feature allows Admins and Instructors to generate certificates for students who have successfully completed courses. Students receive certificates with their registered names.

## Features

### For Admin
- View all courses and their completed students
- Filter students by course and batch
- Generate certificates individually or in bulk
- See certificate statistics (total completed, issued, pending)
- Assign grades to certificates (A+, A, B+, B, C+, C)

### For Instructors
- View students who completed their courses
- Generate certificates for their course students
- Filter by batch
- Bulk certificate generation
- Track certificate issuance status

## API Endpoints

### GET /api/certificates/eligible-students/:courseId
Get list of students eligible for certificate generation.
- **Auth Required**: Yes (Admin/Instructor)
- **Query Parameters**: `batchId` (optional)
- **Response**: Array of eligible students with completion details

### POST /api/certificates/generate-for-student
Generate certificate for a specific student.
- **Auth Required**: Yes (Admin/Instructor)
- **Body**: 
  ```json
  {
    "studentId": "string",
    "courseId": "string",
    "batchId": "string (optional)",
    "grade": "A+|A|B+|B|C+|C (optional, default: B)"
  }
  ```

### POST /api/certificates/bulk-generate
Generate certificates for multiple students at once.
- **Auth Required**: Yes (Admin/Instructor)
- **Body**:
  ```json
  {
    "studentIds": ["string"],
    "courseId": "string",
    "batchId": "string (optional)",
    "grade": "A+|A|B+|B|C+|C (optional, default: B)"
  }
  ```

### GET /api/certificates/course/:courseId
Get all certificates issued for a course.
- **Auth Required**: Yes (Admin/Instructor)
- **Query Parameters**: `batchId` (optional)

## Frontend Pages

### Admin Certificate Management
**Path**: `/admin/certificates`
- Full control over all course certificates
- Can generate for any course
- Bulk operations support

### Instructor Certificates
**Path**: `/instructor/certificates`
- Limited to instructor's own courses
- Same functionality as admin but scoped to their courses

## Usage Guide

### For Admins

1. **Navigate to Certificate Management**
   - Go to `/admin/certificates`

2. **Select a Course**
   - Choose the course from the dropdown
   - Optionally filter by batch

3. **View Eligible Students**
   - See list of students who completed the course
   - Check which students already have certificates

4. **Generate Certificates**
   - **Single**: Click "Generate" button next to student name
   - **Bulk**: Select multiple students and click "Generate X Certificate(s)"

5. **Set Grade** (Optional)
   - Select default grade from dropdown before generating
   - Default is "B"

### For Instructors

1. **Navigate to Certificates**
   - Go to `/instructor/certificates`

2. **Select Your Course**
   - Choose from courses you teach

3. **Follow same steps as Admin**
   - Filter, select, and generate certificates

## Mock Data

The `mockData.ts` file includes comprehensive sample data:
- 5 sample students
- 2 instructors
- 1 admin
- 1 course with modules
- 4 enrollments (3 completed, 1 in progress)
- 1 existing certificate

Use this data for testing and development.

## Certificate Details

Each certificate includes:
- Student's registered name
- Course title
- Instructor name
- Certificate ID (unique)
- Issue date
- Grade
- Completion date
- Batch information (if applicable)
- Verification status

## Security

- Only Admins and Instructors can generate certificates
- Instructors can only generate for their own courses
- Students must have completed the course (100% progress)
- Duplicate certificates are prevented
- All operations are logged

## Future Enhancements

- PDF certificate generation with templates
- Email delivery of certificates
- Certificate templates customization
- Digital signatures
- Blockchain verification
- Student self-service certificate download
