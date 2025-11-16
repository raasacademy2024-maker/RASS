import React from 'react';

export interface User {
  enrolledCourses: boolean;
  createdAt: string;
  _id: string;
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  profile?: {
    bio?: string;
    phone?: string;
    avatar?: string;
    dateOfBirth?: string;
    education?: string;
    experience?: string;
  };
}

export interface Course {
  lessonsCount: any;
  originalPrice: React.ReactNode;
  learningJourney: any[];
  highlights: any[];
  students: any[];
  _id: string;
  title: string;
  description: string;
  instructor: {
    _id: string;
    name: string;
    profile?: {
      avatar?: string;
    };
  };
  category: string;
  price: number;
  thumbnail?: string;
  modules: Module[];
  totalDuration: number;
  enrollmentCount: number;
  rating: {
    average: number;
    count: number;
  };
  isPublished: boolean;
  tags: string[];
  requirements: string[];
  learningOutcomes: string[];
  createdAt: string;
  updatedAt: string;

  // Curriculum data created by admin
  curriculum?: {
    order: number;
    title: string;
    sections: {
      subtitle: string;
      description?: string;
    }[];
  }[];

  // Tech Stack/Tools data
  techStack?: { 
    name: string; 
    imageUrl: string;
  }[];

  // Job Roles data
  jobRoles?: string[];

  // 🔹 Extra fields for new CourseDetail sections
  tools?: { name: string; logo: string }[];
  testimonials?: { name: string; title: string; quote: string; avatar?: string }[];
  companies?: { name: string; logo: string }[];
  faqs?: { question: string; answer: string }[];
}


export interface Module {
  _id: string;
  title: string;
  description?: string;
  videoUrl?: string;
  duration: number;
  order: number;
  resources: Resource[];
}

export interface Resource {
  _id: string;
  title: string;
  url: string;
  type: 'pdf' | 'doc' | 'link' | 'video' | 'other';
}

export interface Enrollment {
  _id: string;
  student: {
    _id: string;
    name: string;
    email: string;
    role?: string;
  }; // ✅ always an object now
  course: Course;
  enrolledAt: string;
  progress: ModuleProgress[];
  completed: boolean;
  completedAt?: string;
  certificateIssued: boolean;
  certificateUrl?: string;
  paymentStatus: "pending" | "completed" | "failed" | "refunded";
  completionPercentage: number;
}


export interface ModuleProgress {
  moduleId: string;
  completed: boolean;
  completedAt?: string;
  watchTime: number;
}

export interface Assignment {
  _id: string;
  title: string;
  description: string;
  course: string;
  module: string;
  dueDate?: string;
  maxPoints: number;
  instructions?: string;
  attachments: {
    filename: string;
    url: string;
  }[];
  submissions: Submission[];
  autoGrade: boolean;
  createdAt: string;
}

export interface Submission {
  _id: string;
  student: User;
  submittedAt: string;
  fileUrl?: string;
  content?: string;
  grade?: number;
  feedback?: string;
  gradedAt?: string;
  gradedBy?: User;
}

export interface ForumPost {
  _id: string;
  title: string;
  content: string;
  author: User;
  course: string;
  category: 'general' | 'assignment' | 'technical' | 'announcement';
  replies: Reply[];
  likes: string[];
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Reply {
  _id: string;
  author: User;
  content: string;
  createdAt: string;
  likes: string[];
}

export interface Notification {
  _id: string;
  recipient: string;
  title: string;
  message: string;
  type: 'course' | 'assignment' | 'announcement' | 'payment' | 'system' | 'chat' | 'support' | 'discussion' | 'live-session';
  relatedId?: string;
  read: boolean;
  readAt?: string;
  createdAt: string;
}

export interface LiveSession {
  materials: boolean;
  _id: string;
  title: string;
  description?: string;
  course: string;
  instructor: {
    _id: string;
    name: string;
    email: string;
  };
  scheduledAt: string;
  duration: number;
  meetingLink?: string;
  meetingId?: string;
  password?: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  attendees: {
    student: string;
    joinedAt?: string;
    leftAt?: string;
  }[];
  recording?: {
    url?: string;
    available: boolean;
  };
  maxAttendees: number;
  createdAt: string;
  updatedAt: string;
}

export interface Certificate {
  _id: string;
  student: string;
  course: {
    _id: string;
    title: string;
    instructor: {
      name: string;
    };
  };
  certificateId: string;
  issuedAt: string;
  certificateUrl?: string;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C';
  completionDate: string;
  verified: boolean;
}

export interface SupportTicket {
  _id: string;
  ticketId: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  subject: string;
  description: string;
  category: 'technical' | 'billing' | 'course' | 'account' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  messages: {
    _id: string;
    sender: {
      _id: string;
      name: string;
      email: string;
      role: string;
    };
    message: string;
    timestamp: string;
    isStaff: boolean;
  }[];
  attachments: {
    filename: string;
    url: string;
    uploadedAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
// Add this interface to the existing types file
export interface MediaPresence {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  journalLink: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}