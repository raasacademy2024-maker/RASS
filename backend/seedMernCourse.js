import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from './models/Course.js';
import Batch from './models/Batch.js';
import User from './models/User.js';

dotenv.config();

const seedMernCourse = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find or create an instructor user
    let instructor = await User.findOne({ role: 'instructor' });
    if (!instructor) {
      instructor = await User.create({
        name: 'RASS Academy Instructor',
        email: 'instructor@rassacademy.com',
        password: 'instructor123',
        role: 'instructor',
        profile: {
          bio: 'Expert MERN Stack Developer with 10+ years of experience',
          phone: '+1234567890'
        },
        emailVerified: true
      });
      console.log('Instructor user created');
    }

    // Check if MERN course already exists
    const existingCourse = await Course.findOne({ title: 'MERN Stack Development' });
    if (existingCourse) {
      console.log('MERN Stack Development course already exists');
      
      // Check and create batches if they don't exist
      const existingBatches = await Batch.find({ course: existingCourse._id });
      if (existingBatches.length === 0) {
        await createBatches(existingCourse._id);
      } else {
        console.log(`Course already has ${existingBatches.length} batch(es)`);
      }
      
      return;
    }

    // Create MERN Stack Development Course
    const mernCourse = await Course.create({
      title: 'MERN Stack Development',
      description: 'Master full-stack web development with MongoDB, Express.js, React, and Node.js. Build modern, scalable web applications from scratch.',
      about: 'This comprehensive MERN Stack Development course is designed to transform you into a full-stack JavaScript developer. Learn to build production-ready web applications using the most popular JavaScript technologies: MongoDB for databases, Express.js for backend, React for frontend, and Node.js as the runtime environment. Through hands-on projects and real-world examples, you\'ll master the entire development lifecycle from database design to deployment.',
      
      instructor: instructor._id,
      category: 'Web Development',
      level: 'intermediate',
      price: 4999,
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
      
      // Curriculum structure
      curriculum: [
        {
          order: 1,
          logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
          title: 'MongoDB Fundamentals',
          sections: [
            { subtitle: 'Introduction to NoSQL Databases', description: 'Understanding NoSQL vs SQL databases' },
            { subtitle: 'MongoDB CRUD Operations', description: 'Create, Read, Update, and Delete operations' },
            { subtitle: 'Data Modeling', description: 'Schema design and relationships' },
            { subtitle: 'Indexing and Aggregation', description: 'Performance optimization techniques' }
          ]
        },
        {
          order: 2,
          logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
          title: 'Node.js & Express.js',
          sections: [
            { subtitle: 'Node.js Fundamentals', description: 'Understanding the event loop and asynchronous programming' },
            { subtitle: 'Express.js Framework', description: 'Building RESTful APIs' },
            { subtitle: 'Authentication & Authorization', description: 'JWT and session management' },
            { subtitle: 'Error Handling & Validation', description: 'Best practices for robust APIs' }
          ]
        },
        {
          order: 3,
          logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
          title: 'React.js Development',
          sections: [
            { subtitle: 'React Fundamentals', description: 'Components, props, and state management' },
            { subtitle: 'React Hooks', description: 'useState, useEffect, useContext, and custom hooks' },
            { subtitle: 'React Router', description: 'Client-side routing and navigation' },
            { subtitle: 'State Management', description: 'Context API and Redux fundamentals' }
          ]
        },
        {
          order: 4,
          logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
          title: 'Full-Stack Integration & Deployment',
          sections: [
            { subtitle: 'Connecting Frontend & Backend', description: 'API integration and data flow' },
            { subtitle: 'File Upload & Storage', description: 'Handling media with Multer and cloud storage' },
            { subtitle: 'Deployment', description: 'Deploying to Heroku, Vercel, and AWS' },
            { subtitle: 'Best Practices', description: 'Security, testing, and performance optimization' }
          ]
        }
      ],

      // Course features
      features: [
        'Hands-on coding exercises and projects',
        'Build 3 real-world full-stack applications',
        'Live coding sessions and Q&A',
        'Access to private Discord community',
        'Resume and portfolio guidance',
        'Lifetime access to course materials',
        'Certificate of completion',
        'Job interview preparation'
      ],

      // Tech Stack
      techStack: [
        { name: 'MongoDB', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
        { name: 'Express.js', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
        { name: 'React', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
        { name: 'Node.js', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
        { name: 'JavaScript', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
        { name: 'Git', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' }
      ],

      // Skills Gained
      skillsGained: [
        'Full-Stack JavaScript Development',
        'RESTful API Design and Development',
        'React Application Development',
        'Database Design with MongoDB',
        'User Authentication & Authorization',
        'Deployment and DevOps Basics',
        'Git Version Control',
        'Debugging and Testing'
      ],

      // Job Roles
      jobRoles: [
        'Full-Stack Developer',
        'MERN Stack Developer',
        'JavaScript Developer',
        'React Developer',
        'Node.js Developer',
        'Backend Developer',
        'Frontend Developer'
      ],

      // Testimonials
      testimonials: [
        {
          name: 'Rahul Sharma',
          imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
          description: 'This course completely transformed my career! I landed a full-stack developer job within 2 months of completion. The hands-on projects were incredibly valuable.'
        },
        {
          name: 'Priya Patel',
          imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
          description: 'Best MERN stack course available! The instructor explains complex concepts in a very simple way. The live sessions and community support are amazing.'
        },
        {
          name: 'Amit Kumar',
          imageUrl: 'https://randomuser.me/api/portraits/men/67.jpg',
          description: 'I had zero backend experience before this course. Now I\'m confidently building full-stack applications. Highly recommended for anyone serious about web development.'
        }
      ],

      // FAQs
      faqs: [
        {
          question: 'What are the prerequisites for this course?',
          answer: 'Basic knowledge of HTML, CSS, and JavaScript is required. Familiarity with ES6+ JavaScript features is helpful but not mandatory.'
        },
        {
          question: 'How long will it take to complete this course?',
          answer: 'The course is designed to be completed in 12-16 weeks with 10-15 hours of study per week. However, you have lifetime access and can learn at your own pace.'
        },
        {
          question: 'Will I get a certificate after completion?',
          answer: 'Yes! You will receive a certificate of completion after finishing all modules and projects. The certificate can be shared on LinkedIn and other professional networks.'
        },
        {
          question: 'Do you provide job placement assistance?',
          answer: 'Yes, we provide resume review, portfolio guidance, mock interviews, and job referrals to our hiring partners.'
        },
        {
          question: 'Can I access course content after the batch ends?',
          answer: 'Absolutely! You get lifetime access to all course materials, including future updates and additions.'
        }
      ],

      // Modules with video URLs (using publicly available demo/test videos)
      modules: [
        {
          title: 'Course Introduction and Setup',
          description: 'Get started with the MERN stack and set up your development environment',
          videoUrl: 'https://www.youtube.com/watch?v=7CqJlxBYj-M',
          duration: 45,
          order: 1,
          resources: [
            { title: 'VS Code Setup Guide', url: 'https://code.visualstudio.com/docs', type: 'link' },
            { title: 'Node.js Installation', url: 'https://nodejs.org', type: 'link' }
          ]
        },
        {
          title: 'JavaScript ES6+ Essentials',
          description: 'Master modern JavaScript features essential for MERN development',
          videoUrl: 'https://www.youtube.com/watch?v=NCwa_xi0Uuc',
          duration: 90,
          order: 2,
          resources: [
            { title: 'ES6 Cheatsheet', url: 'https://devhints.io/es6', type: 'link' }
          ]
        },
        {
          title: 'MongoDB Database Fundamentals',
          description: 'Learn to work with MongoDB and design NoSQL databases',
          videoUrl: 'https://www.youtube.com/watch?v=ExcRbA7fy_A',
          duration: 120,
          order: 3,
          resources: [
            { title: 'MongoDB Documentation', url: 'https://docs.mongodb.com', type: 'link' },
            { title: 'Mongoose Guide', url: 'https://mongoosejs.com/docs/guide.html', type: 'link' }
          ]
        },
        {
          title: 'Building RESTful APIs with Node.js & Express',
          description: 'Create robust backend APIs with Express.js',
          videoUrl: 'https://www.youtube.com/watch?v=pKd0Rpw7O48',
          duration: 150,
          order: 4,
          resources: [
            { title: 'Express Documentation', url: 'https://expressjs.com', type: 'link' },
            { title: 'REST API Best Practices', url: 'https://restfulapi.net', type: 'link' }
          ]
        },
        {
          title: 'Authentication & Authorization with JWT',
          description: 'Implement secure user authentication using JSON Web Tokens',
          videoUrl: 'https://www.youtube.com/watch?v=mbsmsi7l3r4',
          duration: 135,
          order: 5,
          resources: [
            { title: 'JWT Documentation', url: 'https://jwt.io/introduction', type: 'link' }
          ]
        },
        {
          title: 'React Fundamentals & Components',
          description: 'Build dynamic UIs with React components and props',
          videoUrl: 'https://www.youtube.com/watch?v=SqcY0GlETPk',
          duration: 140,
          order: 6,
          resources: [
            { title: 'React Documentation', url: 'https://react.dev', type: 'link' }
          ]
        },
        {
          title: 'React Hooks Deep Dive',
          description: 'Master useState, useEffect, useContext, and custom hooks',
          videoUrl: 'https://www.youtube.com/watch?v=O6P86uwfdR0',
          duration: 130,
          order: 7,
          resources: [
            { title: 'React Hooks API Reference', url: 'https://react.dev/reference/react', type: 'link' }
          ]
        },
        {
          title: 'State Management with Context API',
          description: 'Manage global state in React applications',
          videoUrl: 'https://www.youtube.com/watch?v=5LrDIWkK_Bc',
          duration: 110,
          order: 8,
          resources: [
            { title: 'Context API Guide', url: 'https://react.dev/learn/passing-data-deeply-with-context', type: 'link' }
          ]
        },
        {
          title: 'React Router & Navigation',
          description: 'Implement client-side routing in React applications',
          videoUrl: 'https://www.youtube.com/watch?v=Law7wfdg_ls',
          duration: 95,
          order: 9,
          resources: [
            { title: 'React Router Documentation', url: 'https://reactrouter.com', type: 'link' }
          ]
        },
        {
          title: 'Connecting React Frontend with Express Backend',
          description: 'Integrate frontend and backend for a complete full-stack application',
          videoUrl: 'https://www.youtube.com/watch?v=w3vs4a03y3I',
          duration: 160,
          order: 10,
          resources: [
            { title: 'Axios Documentation', url: 'https://axios-http.com/docs/intro', type: 'link' }
          ]
        },
        {
          title: 'File Upload & Image Handling',
          description: 'Handle file uploads with Multer and cloud storage',
          videoUrl: 'https://www.youtube.com/watch?v=srPXMt1Q0nY',
          duration: 100,
          order: 11,
          resources: [
            { title: 'Multer Documentation', url: 'https://github.com/expressjs/multer', type: 'link' }
          ]
        },
        {
          title: 'Deployment to Production',
          description: 'Deploy your MERN application to Heroku and Vercel',
          videoUrl: 'https://www.youtube.com/watch?v=l134cBAJCuc',
          duration: 125,
          order: 12,
          resources: [
            { title: 'Heroku Documentation', url: 'https://devcenter.heroku.com', type: 'link' },
            { title: 'Vercel Documentation', url: 'https://vercel.com/docs', type: 'link' }
          ]
        },
        {
          title: 'Project 1: Task Management Application',
          description: 'Build a complete CRUD application with authentication',
          videoUrl: 'https://www.youtube.com/watch?v=qn3Z3jqKhKU',
          duration: 180,
          order: 13,
          resources: [
            { title: 'Project Starter Code', url: 'https://github.com/example/task-manager', type: 'link' }
          ]
        },
        {
          title: 'Project 2: E-Commerce Platform',
          description: 'Build a full-featured online store with cart and payment integration',
          videoUrl: 'https://www.youtube.com/watch?v=1WmNXEVia8I',
          duration: 240,
          order: 14,
          resources: [
            { title: 'Project Starter Code', url: 'https://github.com/example/ecommerce', type: 'link' }
          ]
        },
        {
          title: 'Project 3: Social Media Dashboard',
          description: 'Create a social media platform with real-time features',
          videoUrl: 'https://www.youtube.com/watch?v=K4TOrB7at0Y',
          duration: 220,
          order: 15,
          resources: [
            { title: 'Project Starter Code', url: 'https://github.com/example/social-dashboard', type: 'link' }
          ]
        }
      ],

      // Requirements
      requirements: [
        'Computer with Windows, Mac, or Linux',
        'Basic understanding of HTML and CSS',
        'Fundamental knowledge of JavaScript',
        'Willingness to learn and practice coding daily',
        'At least 10-15 hours per week for coursework'
      ],

      // Learning Outcomes
      learningOutcomes: [
        'Build complete full-stack web applications using MERN stack',
        'Design and implement RESTful APIs with Node.js and Express',
        'Create responsive and interactive UIs with React',
        'Work with MongoDB for data storage and retrieval',
        'Implement user authentication and authorization',
        'Deploy applications to cloud platforms',
        'Follow industry best practices for code quality and security',
        'Debug and troubleshoot full-stack applications'
      ],

      tags: ['MERN', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'Express', 'Full-Stack', 'Web Development'],
      isPublished: true
    });

    console.log('MERN Stack Development course created successfully!');
    console.log('Course ID:', mernCourse._id);

    // Create batches for the MERN course
    await createBatches(mernCourse._id);

    // Update instructor's createdCourses
    await User.findByIdAndUpdate(instructor._id, {
      $push: { createdCourses: mernCourse._id }
    });

    console.log('\nSeed process completed successfully!');
    console.log('Course and batches have been created.');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

async function createBatches(courseId) {
  // Create multiple batches for the course
  const batches = [
    {
      course: courseId,
      name: 'MERN Stack - Weekend Batch (January 2026)',
      startDate: new Date('2026-01-10'),
      endDate: new Date('2026-04-30'),
      capacity: 30,
      enrolledCount: 0,
      isActive: true,
      description: 'Weekend batch perfect for working professionals. Classes on Saturday and Sunday from 10 AM to 2 PM IST.'
    },
    {
      course: courseId,
      name: 'MERN Stack - Weekday Evening Batch (January 2026)',
      startDate: new Date('2026-01-15'),
      endDate: new Date('2026-04-15'),
      capacity: 25,
      enrolledCount: 0,
      isActive: true,
      description: 'Evening batch for students and professionals. Classes Monday to Friday from 7 PM to 9 PM IST.'
    },
    {
      course: courseId,
      name: 'MERN Stack - Intensive Bootcamp (February 2026)',
      startDate: new Date('2026-02-01'),
      endDate: new Date('2026-03-31'),
      capacity: 20,
      enrolledCount: 0,
      isActive: true,
      description: 'Intensive 8-week bootcamp with daily classes. Monday to Friday from 2 PM to 6 PM IST. Best for career switchers and full-time learners.'
    }
  ];

  for (const batchData of batches) {
    const batch = await Batch.create(batchData);
    console.log(`Batch created: ${batch.name} (ID: ${batch._id})`);
  }
}

// Run the seed function
seedMernCourse();
