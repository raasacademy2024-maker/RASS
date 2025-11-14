import mongoose from 'mongoose';

/**
 * Mock MongoDB connection for testing
 * Uses environment variable TEST_MONGO_URI if available, otherwise mocks
 */
export const connectDB = async () => {
  // Use test database or skip connection for unit tests
  const mongoUri = process.env.TEST_MONGO_URI || process.env.MONGO_URI;
  
  if (!mongoUri) {
    // If no MongoDB URI is available, we'll rely on mocked models
    console.log('No MongoDB URI available, using mocked database');
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to test database');
  } catch (error) {
    console.log('Could not connect to test database, using mocked models');
  }
};

/**
 * Drop database and close the connection
 */
export const closeDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    try {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    } catch (error) {
      // Ignore errors if connection was never established
    }
  }
};

/**
 * Remove all the data for all db collections
 */
export const clearDB = async () => {
  if (mongoose.connection.readyState === 0) {
    return; // Skip if not connected
  }
  
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

/**
 * Create a test user with authentication token
 */
export const createTestUser = async (User, role = 'student') => {
  const bcrypt = await import('bcryptjs');
  const jwt = await import('jsonwebtoken');

  const hashedPassword = await bcrypt.default.hash('testpass123', 10);
  
  const user = await User.create({
    name: `Test ${role}`,
    email: `test-${role}@example.com`,
    password: hashedPassword,
    role: role,
  });

  const token = jwt.default.sign(
    { _id: user._id, role: user.role },
    process.env.JWT_SECRET || 'test-secret-key',
    { expiresIn: '1h' }
  );

  return { user, token };
};

/**
 * Create a test course
 */
export const createTestCourse = async (Course, instructor) => {
  const course = await Course.create({
    title: 'Test Course',
    description: 'A test course for testing',
    instructor: instructor._id,
    price: 999,
    duration: 10,
    level: 'beginner',
    category: 'technology',
    thumbnail: 'https://example.com/thumbnail.jpg',
    curriculum: [
      {
        moduleTitle: 'Module 1',
        lessons: [
          {
            title: 'Lesson 1',
            videoUrl: 'https://example.com/video1.mp4',
            duration: 30,
          },
        ],
      },
    ],
  });

  return course;
};
