/**
 * Example: Creating MERN Course via API
 * 
 * This script demonstrates how to create the MERN Stack course
 * and batches using the REST API endpoints.
 */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE_URL = process.env.API_URL || 'http://localhost:8000/api';

/**
 * Step 1: Create or login as instructor
 */
async function loginAsInstructor() {
  console.log('Step 1: Logging in as instructor...');
  
  const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'instructor@rassacademy.com',
      password: 'instructor123'
    })
  });

  if (!loginResponse.ok) {
    // If login fails, try to register
    console.log('Login failed, attempting to register...');
    
    const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'RASS Academy Instructor',
        email: 'instructor@rassacademy.com',
        password: 'instructor123',
        role: 'instructor'
      })
    });

    if (!registerResponse.ok) {
      throw new Error('Failed to register instructor');
    }

    const registerData = await registerResponse.json();
    return registerData;
  }

  const loginData = await loginResponse.json();
  return loginData;
}

/**
 * Step 2: Create the MERN Stack course
 */
async function createCourse(instructorId) {
  console.log('Step 2: Creating MERN Stack course...');
  
  // Read course data from JSON file
  const dataPath = path.join(__dirname, 'mernCourseData.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  
  // Add instructor ID to course data
  const courseData = {
    ...data.course,
    instructor: instructorId
  };

  const response = await fetch(`${API_BASE_URL}/courses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(courseData)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create course: ${error}`);
  }

  const course = await response.json();
  console.log('✓ Course created:', course.title);
  console.log('  Course ID:', course._id);
  
  return course;
}

/**
 * Step 3: Create batches for the course
 */
async function createBatches(courseId, authToken) {
  console.log('Step 3: Creating batches...');
  
  // Read batch data from JSON file
  const dataPath = path.join(__dirname, 'mernCourseData.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  const createdBatches = [];

  for (const batchData of data.batches) {
    const batchPayload = {
      courseId: courseId,
      ...batchData
    };

    const response = await fetch(`${API_BASE_URL}/batches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(batchPayload)
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`Failed to create batch: ${batchData.name}`, error);
      continue;
    }

    const batch = await response.json();
    console.log('✓ Batch created:', batch.name);
    createdBatches.push(batch);
  }

  return createdBatches;
}

/**
 * Step 4: Verify the course and batches
 */
async function verifyCourseAndBatches(courseId) {
  console.log('\nStep 4: Verifying course and batches...');
  
  // Get course details
  const courseResponse = await fetch(`${API_BASE_URL}/courses/${courseId}`);
  if (!courseResponse.ok) {
    throw new Error('Failed to fetch course details');
  }
  const course = await courseResponse.json();
  
  // Get batches
  const batchesResponse = await fetch(`${API_BASE_URL}/batches/course/${courseId}`);
  if (!batchesResponse.ok) {
    throw new Error('Failed to fetch batches');
  }
  const batches = await batchesResponse.json();

  console.log('\n=== Verification Results ===');
  console.log('Course Title:', course.title);
  console.log('Number of Modules:', course.modules.length);
  console.log('Tech Stack Items:', course.techStack.length);
  console.log('Number of Batches:', batches.length);
  console.log('\nBatches:');
  batches.forEach((batch, idx) => {
    console.log(`  ${idx + 1}. ${batch.name} (${batch.capacity} students)`);
  });
  console.log('\n✓ All verifications passed!');
}

/**
 * Main function to orchestrate the process
 */
async function main() {
  try {
    console.log('=== Creating MERN Stack Course via API ===\n');

    // Step 1: Login or register instructor
    const authData = await loginAsInstructor();
    const instructorId = authData.user?._id || authData._id;
    const authToken = authData.token;
    
    if (!instructorId || !authToken) {
      throw new Error('Failed to get instructor credentials');
    }
    
    console.log('✓ Instructor authenticated');
    console.log('  Instructor ID:', instructorId);

    // Step 2: Create course
    const course = await createCourse(instructorId);

    // Step 3: Create batches
    const batches = await createBatches(course._id, authToken);
    console.log(`✓ Created ${batches.length} batches`);

    // Step 4: Verify everything
    await verifyCourseAndBatches(course._id);

    console.log('\n=== SUCCESS ===');
    console.log('MERN Stack Development course has been created successfully!');
    console.log(`Course ID: ${course._id}`);
    console.log(`Number of Batches: ${batches.length}`);
    
  } catch (error) {
    console.error('\n=== ERROR ===');
    console.error(error.message);
    console.error('\nMake sure the backend server is running on', API_BASE_URL);
    process.exit(1);
  }
}

// Run the script if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { loginAsInstructor, createCourse, createBatches, verifyCourseAndBatches };
