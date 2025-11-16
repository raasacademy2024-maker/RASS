/**
 * Comprehensive Mock Data for RASS Academy LMS
 * 
 * This file contains all mock data used across the entire application.
 * Use this for development, testing, and preview purposes.
 */

// ==================== USERS ====================

export const mockUsers = {
  admins: [
    {
      _id: 'admin001',
      name: 'Admin User',
      email: 'admin@rassacademy.com',
      role: 'admin',
      profile: {
        bio: 'System Administrator',
        phone: '+91-9876543210',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      },
      isActive: true,
      emailVerified: true,
      createdAt: '2024-01-01T00:00:00.000Z',
    },
  ],
  instructors: [
    {
      _id: 'instructor001',
      name: 'Dr. Rajesh Kumar',
      email: 'rajesh@rassacademy.com',
      role: 'instructor',
      profile: {
        bio: 'Expert MERN Stack Developer with 10+ years of experience in full-stack development',
        phone: '+91-9876543211',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        education: 'Ph.D. in Computer Science',
        experience: '10+ years in Software Development',
      },
      isActive: true,
      emailVerified: true,
      createdAt: '2024-01-15T00:00:00.000Z',
    },
    {
      _id: 'instructor002',
      name: 'Prof. Priya Sharma',
      email: 'priya@rassacademy.com',
      role: 'instructor',
      profile: {
        bio: 'Data Science and AI expert, former Google engineer',
        phone: '+91-9876543212',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        education: 'M.Tech in Artificial Intelligence',
        experience: '8 years in AI/ML',
      },
      isActive: true,
      emailVerified: true,
      createdAt: '2024-01-20T00:00:00.000Z',
    },
  ],
  students: [
    {
      _id: 'student001',
      name: 'Amit Patel',
      email: 'amit@example.com',
      role: 'student',
      profile: {
        bio: 'Aspiring full-stack developer',
        phone: '+91-9876543213',
        avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
        dateOfBirth: '2000-05-15',
      },
      enrolledCourses: ['course001'],
      isActive: true,
      emailVerified: true,
      createdAt: '2024-02-01T00:00:00.000Z',
    },
    {
      _id: 'student002',
      name: 'Sneha Reddy',
      email: 'sneha@example.com',
      role: 'student',
      profile: {
        bio: 'Computer Science student passionate about web development',
        phone: '+91-9876543214',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
        dateOfBirth: '1999-08-22',
      },
      enrolledCourses: ['course001'],
      isActive: true,
      emailVerified: true,
      createdAt: '2024-02-05T00:00:00.000Z',
    },
    {
      _id: 'student003',
      name: 'Karthik Singh',
      email: 'karthik@example.com',
      role: 'student',
      profile: {
        bio: 'Career switcher from mechanical engineering to software',
        phone: '+91-9876543215',
        avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
        dateOfBirth: '1998-11-10',
      },
      enrolledCourses: ['course001'],
      isActive: true,
      emailVerified: true,
      createdAt: '2024-02-10T00:00:00.000Z',
    },
    {
      _id: 'student004',
      name: 'Divya Krishnan',
      email: 'divya@example.com',
      role: 'student',
      profile: {
        bio: 'Final year engineering student',
        phone: '+91-9876543216',
        avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
        dateOfBirth: '2001-03-05',
      },
      enrolledCourses: ['course001'],
      isActive: true,
      emailVerified: true,
      createdAt: '2024-02-12T00:00:00.000Z',
    },
    {
      _id: 'student005',
      name: 'Rohan Verma',
      email: 'rohan@example.com',
      role: 'student',
      profile: {
        bio: 'Working professional upskilling',
        phone: '+91-9876543217',
        avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
        dateOfBirth: '1997-07-18',
      },
      enrolledCourses: ['course001'],
      isActive: true,
      emailVerified: true,
      createdAt: '2024-02-15T00:00:00.000Z',
    },
  ],
};

// ==================== COURSES ====================

export const mockCourses = [
  {
    _id: 'course001',
    title: 'MERN Stack Development',
    description: 'Master full-stack web development with MongoDB, Express.js, React, and Node.js',
    about: 'This comprehensive MERN Stack Development course is designed to transform you into a full-stack JavaScript developer...',
    instructor: mockUsers.instructors[0],
    category: 'Web Development',
    level: 'intermediate',
    price: 4999,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    isPublished: true,
    enrollmentCount: 5,
    rating: {
      average: 4.8,
      count: 12,
    },
    tags: ['MERN', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'Express', 'Full-Stack'],
    curriculum: [
      {
        order: 1,
        logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
        title: 'MongoDB Fundamentals',
        sections: [
          { subtitle: 'Introduction to NoSQL Databases', description: 'Understanding NoSQL vs SQL' },
          { subtitle: 'MongoDB CRUD Operations', description: 'Create, Read, Update, Delete' },
        ],
      },
      {
        order: 2,
        logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
        title: 'Node.js & Express.js',
        sections: [
          { subtitle: 'Node.js Fundamentals', description: 'Event loop and async programming' },
          { subtitle: 'Express.js Framework', description: 'Building RESTful APIs' },
        ],
      },
    ],
    techStack: [
      { name: 'MongoDB', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
      { name: 'Express.js', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
      { name: 'React', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
      { name: 'Node.js', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
    ],
    features: [
      'Hands-on coding exercises',
      'Build 3 real-world applications',
      'Live coding sessions',
      'Certificate of completion',
    ],
    requirements: [
      'Basic HTML, CSS, JavaScript knowledge',
      'Computer with internet connection',
      '10-15 hours per week for coursework',
    ],
    learningOutcomes: [
      'Build full-stack applications',
      'Design RESTful APIs',
      'Work with MongoDB databases',
      'Deploy applications to cloud',
    ],
    jobRoles: ['Full-Stack Developer', 'MERN Stack Developer', 'JavaScript Developer'],
    modules: [
      {
        _id: 'module001',
        title: 'Course Introduction and Setup',
        description: 'Get started with MERN stack',
        videoUrl: 'https://www.youtube.com/watch?v=7CqJlxBYj-M',
        duration: 45,
        order: 1,
        resources: [
          { _id: 'res001', title: 'Setup Guide', url: 'https://code.visualstudio.com/docs', type: 'link' },
        ],
      },
      {
        _id: 'module002',
        title: 'JavaScript ES6+ Essentials',
        description: 'Modern JavaScript features',
        videoUrl: 'https://www.youtube.com/watch?v=NCwa_xi0Uuc',
        duration: 90,
        order: 2,
        resources: [],
      },
    ],
    totalDuration: 135,
    testimonials: [
      {
        name: 'Rahul Sharma',
        imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
        description: 'This course transformed my career!',
      },
    ],
    faqs: [
      {
        question: 'What are the prerequisites?',
        answer: 'Basic HTML, CSS, and JavaScript knowledge is required.',
      },
    ],
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
  },
];

// ==================== BATCHES ====================

export const mockBatches = [
  {
    _id: 'batch001',
    course: 'course001',
    name: 'MERN Stack - Weekend Batch (January 2026)',
    startDate: '2026-01-10T00:00:00.000Z',
    endDate: '2026-04-30T00:00:00.000Z',
    capacity: 30,
    enrolledCount: 5,
    isActive: true,
    description: 'Weekend batch perfect for working professionals',
  },
];

// ==================== ENROLLMENTS ====================

export const mockEnrollments = [
  {
    _id: 'enroll001',
    student: mockUsers.students[0],
    course: mockCourses[0],
    batch: mockBatches[0],
    enrolledAt: '2024-02-01T00:00:00.000Z',
    progress: [
      { moduleId: 'module001', completed: true, completedAt: '2024-02-05T00:00:00.000Z', watchTime: 2700 },
      { moduleId: 'module002', completed: true, completedAt: '2024-02-10T00:00:00.000Z', watchTime: 5400 },
    ],
    completed: true,
    completedAt: '2024-03-15T00:00:00.000Z',
    certificateIssued: false,
    paymentStatus: 'completed',
    completionPercentage: 100,
  },
  {
    _id: 'enroll002',
    student: mockUsers.students[1],
    course: mockCourses[0],
    batch: mockBatches[0],
    enrolledAt: '2024-02-05T00:00:00.000Z',
    progress: [
      { moduleId: 'module001', completed: true, completedAt: '2024-02-08T00:00:00.000Z', watchTime: 2700 },
      { moduleId: 'module002', completed: true, completedAt: '2024-02-12T00:00:00.000Z', watchTime: 5400 },
    ],
    completed: true,
    completedAt: '2024-03-20T00:00:00.000Z',
    certificateIssued: true,
    certificateUrl: 'https://certificates.rassacademy.com/student002/course001',
    paymentStatus: 'completed',
    completionPercentage: 100,
  },
  {
    _id: 'enroll003',
    student: mockUsers.students[2],
    course: mockCourses[0],
    batch: mockBatches[0],
    enrolledAt: '2024-02-10T00:00:00.000Z',
    progress: [
      { moduleId: 'module001', completed: true, completedAt: '2024-02-15T00:00:00.000Z', watchTime: 2700 },
      { moduleId: 'module002', completed: true, completedAt: '2024-02-20T00:00:00.000Z', watchTime: 5400 },
    ],
    completed: true,
    completedAt: '2024-03-25T00:00:00.000Z',
    certificateIssued: false,
    paymentStatus: 'completed',
    completionPercentage: 100,
  },
  {
    _id: 'enroll004',
    student: mockUsers.students[3],
    course: mockCourses[0],
    batch: mockBatches[0],
    enrolledAt: '2024-02-12T00:00:00.000Z',
    progress: [
      { moduleId: 'module001', completed: true, completedAt: '2024-02-18T00:00:00.000Z', watchTime: 2700 },
    ],
    completed: false,
    paymentStatus: 'completed',
    completionPercentage: 50,
  },
];

// ==================== CERTIFICATES ====================

export const mockCertificates = [
  {
    _id: 'cert001',
    student: 'student002',
    course: {
      _id: 'course001',
      title: 'MERN Stack Development',
      instructor: {
        name: 'Dr. Rajesh Kumar',
      },
    },
    batch: mockBatches[0],
    certificateId: 'RASS-2024-ABC123XYZ',
    issuedAt: '2024-03-21T00:00:00.000Z',
    certificateUrl: 'https://certificates.rassacademy.com/student002/course001',
    grade: 'A+',
    completionDate: '2024-03-20T00:00:00.000Z',
    verified: true,
  },
];

// ==================== ASSIGNMENTS ====================

export const mockAssignments = [
  {
    _id: 'assign001',
    title: 'Build a REST API',
    description: 'Create a complete REST API with Express.js',
    course: 'course001',
    batch: 'batch001',
    module: 'module002',
    dueDate: '2024-03-01T00:00:00.000Z',
    maxPoints: 100,
    instructions: 'Build a RESTful API with CRUD operations',
    attachments: [],
    submissions: [],
    autoGrade: false,
    createdAt: '2024-02-15T00:00:00.000Z',
  },
];

// ==================== LIVE SESSIONS ====================

export const mockLiveSessions = [
  {
    _id: 'session001',
    title: 'MERN Stack Overview',
    description: 'Introduction to the MERN stack',
    course: 'course001',
    batch: 'batch001',
    instructor: mockUsers.instructors[0],
    scheduledAt: '2026-01-12T10:00:00.000Z',
    duration: 120,
    meetingLink: 'https://meet.example.com/session001',
    status: 'scheduled',
    attendees: [],
    maxAttendees: 30,
    createdAt: '2024-01-20T00:00:00.000Z',
  },
];

// ==================== NOTIFICATIONS ====================

export const mockNotifications = [
  {
    _id: 'notif001',
    recipient: 'student001',
    title: 'New Assignment Posted',
    message: 'A new assignment has been posted in MERN Stack Development',
    type: 'assignment',
    relatedId: 'assign001',
    read: false,
    createdAt: '2024-02-15T00:00:00.000Z',
  },
];

// ==================== EVENTS ====================

export const mockEvents = [
  {
    _id: 'event001',
    title: 'Web Development Bootcamp',
    description: 'Intensive 2-day bootcamp on modern web development',
    date: '2026-02-15T00:00:00.000Z',
    location: 'Online',
    type: 'Free',
    price: 0,
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    attendees: [],
    createdAt: '2024-01-25T00:00:00.000Z',
  },
];

// ==================== SUPPORT TICKETS ====================

export const mockSupportTickets = [
  {
    _id: 'ticket001',
    ticketId: 'TICKET-001',
    user: mockUsers.students[0],
    subject: 'Cannot access course videos',
    description: 'I am unable to play videos in module 2',
    category: 'technical',
    priority: 'medium',
    status: 'open',
    messages: [],
    attachments: [],
    createdAt: '2024-02-20T00:00:00.000Z',
  },
];

// ==================== QUIZZES ====================

export const mockQuizzes = [
  {
    _id: 'quiz001',
    title: 'JavaScript Fundamentals Quiz',
    description: 'Test your knowledge of JavaScript basics',
    course: 'course001',
    module: 'module002',
    duration: 30,
    totalPoints: 100,
    passingScore: 70,
    questions: [
      {
        _id: 'q001',
        question: 'What is a closure in JavaScript?',
        type: 'multiple-choice',
        options: [
          'A function inside another function',
          'A way to close the browser',
          'A loop structure',
          'None of the above',
        ],
        correctAnswer: 0,
        points: 10,
      },
    ],
    createdAt: '2024-02-10T00:00:00.000Z',
  },
];

// ==================== ANNOUNCEMENTS ====================

export const mockAnnouncements = [
  {
    _id: 'announce001',
    title: 'Welcome to MERN Stack Course',
    content: 'Welcome everyone! We are excited to have you in this course.',
    course: 'course001',
    batch: 'batch001',
    author: mockUsers.instructors[0],
    priority: 'normal',
    createdAt: '2024-02-01T00:00:00.000Z',
  },
];

// ==================== FORUM POSTS ====================

export const mockForumPosts = [
  {
    _id: 'forum001',
    title: 'How to connect MongoDB with Express?',
    content: 'I am having trouble connecting MongoDB with my Express app. Can someone help?',
    author: mockUsers.students[0],
    course: 'course001',
    category: 'technical',
    replies: [
      {
        _id: 'reply001',
        author: mockUsers.instructors[0],
        content: 'You need to use mongoose. Here is an example...',
        createdAt: '2024-02-16T10:00:00.000Z',
        likes: [],
      },
    ],
    likes: [],
    isPinned: false,
    isLocked: false,
    createdAt: '2024-02-15T15:30:00.000Z',
  },
];

// ==================== EXPORT ALL ====================

export const mockData = {
  users: mockUsers,
  courses: mockCourses,
  batches: mockBatches,
  enrollments: mockEnrollments,
  certificates: mockCertificates,
  assignments: mockAssignments,
  liveSessions: mockLiveSessions,
  notifications: mockNotifications,
  events: mockEvents,
  supportTickets: mockSupportTickets,
  quizzes: mockQuizzes,
  announcements: mockAnnouncements,
  forumPosts: mockForumPosts,
};

export default mockData;
