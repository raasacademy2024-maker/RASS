import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
const StudentDashboard = lazy(() => import('./pages/student/Dashboard'));
const InstructorDashboard = lazy(() => import('./pages/instructor/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
import CourseCatalog from './pages/courses/CourseCatalog';
import CourseDetail from './pages/courses/CourseDetail';
const CoursePlayer = lazy(() => import('./pages/courses/CoursePlayer'));
import Profile from './pages/Profile';
const LiveSessions = lazy(() => import('./pages/student/LiveSessions'));
const Assignments = lazy(() => import('./pages/student/Assignments'));
const Certificates = lazy(() => import('./pages/student/Certificates'));
const Support = lazy(() => import('./pages/student/Support'));
const CourseManagement = lazy(() => import('./pages/instructor/CourseManagement'));
const Students = lazy(() => import('./pages/instructor/Students'));
const BatchManagement = lazy(() => import('./pages/instructor/BatchManagement'));
const AdminBatchManagement = lazy(() => import('./pages/admin/BatchManagement'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
import { NotificationProvider } from "./context/NotificationContext";
const DiscussionForum = lazy(() => import('./pages/student/DiscussionForum'));
const Notifications = lazy(() => import('./pages/student/Notifications'));
const Chat = lazy(() => import('./pages/student/Chat'));
const AddUserPage = lazy(() => import('./pages/admin/AddUserPage'));
const AddCoursePage = lazy(() => import('./pages/admin/AddCoursePage'));
const InstructorDiscussions = lazy(() => import('./pages/instructor/InstructorDiscussions'));
const InstructorChats = lazy(() => import('./pages/instructor/InstructorChats'));
import HelpCenter from './pages/publicpages/Help';
import BlogPage from './pages/publicpages/Blog';
import About from './pages/publicpages/About';
import ContactUs from './pages/publicpages/Contact';
import Terms from './pages/publicpages/Terms';
import PrivacyPolicy from './pages/publicpages/PrivacyPolicy'; // Added import for Privacy Policy
import Companies from './pages/Companies';
import UniversitiesPage from './pages/UniversitiesPage';
const AdminTicketsPage = lazy(() => import('./pages/admin/SupportManagement'));
const MediaPresenceManagement = lazy(() => import('./pages/admin/MediaPresenceManagement'));
const ManageEventsPage = lazy(() => import('./pages/admin/ManageEventsPage')); // Added import for event management
import EventDetailPage from './pages/events/EventDetailPage'; // Added import for event detail page
import AllEventsPage from './pages/events/AllEventsPage'; // Added import for all events page
import ScrollToTop from "./pages/ScrollToTop";
import StudentAmbassadorForm from './pages/StudentAmbassadorForm';
const StudentAmbassadorList = lazy(() => import('./pages/admin/StudentAmbassadorList'));
import CompanyPartnershipForm from './pages/CompanyPartnershipForm';
const CompanyPartnershipList = lazy(() => import('./pages/admin/CompanyPartnershipForm'));
import UniversityPartnershipForm from './pages/UniversityPartnershipForm';
const UniversityPartnershipList = lazy(() => import('./pages/admin/UniversityPartnershipList'));
const EnrollmentManagement = lazy(() => import('./pages/admin/EnrollmentManagement'));
const AdminBatchAnalytics = lazy(() => import('./pages/admin/BatchAnalytics'));
const InstructorBatchAnalytics = lazy(() => import('./pages/instructor/BatchAnalytics'));
const AdminCertificateManagement = lazy(() => import('./pages/admin/CertificateManagement'));
const InstructorCertificates = lazy(() => import('./pages/instructor/Certificates'));
const NotificationManagement = lazy(() => import('./pages/admin/NotificationManagement'));
import NotFound from './pages/NotFound';

const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({ 
  children, 
  roles 
}) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  const getDashboardRoute = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'instructor':
        return '/instructor/dashboard';
      case 'student':
        return '/student/dashboard';
      default:
        return '/';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Dashboard/admin routes are code-split, so a fallback is required while
          their chunk loads. Public pages stay eagerly bundled for fast first paint. */}
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
          </div>
        }
      >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/StudentAmbassadorForm" element={<StudentAmbassadorForm />} />
        <Route path="/university-partnership" element={<UniversityPartnershipForm />} />
        <Route path="/company-partnership" element={<CompanyPartnershipForm />} />
        <Route path="/admin/company-partnership-list" element={<CompanyPartnershipList />} />
        <Route path="/admin/student-ambassador-list" element={<StudentAmbassadorList />} />
        <Route path="/admin/university-partnership-list" element={<UniversityPartnershipList />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/universities" element={<UniversitiesPage />} />
        <Route path="/events" element={<AllEventsPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/blog" element={<BlogPage/>} />
        <Route path="/about" element={<About />} />
        <Route path="/support-tickets" element={<Support />} />
        <Route path="/contact" element={<ContactUs/>}/>
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<PrivacyPolicy />} /> {/* Added route for Privacy Policy */}
        <Route path="/faq" element={<HelpCenter/>}/>
        <Route path="/courses" element={<CourseCatalog />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        {/* Auth Routes */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to={getDashboardRoute()} /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to={getDashboardRoute()} /> : <Register />} 
        />

        {/* Profile */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/help-center" element={<HelpCenter/>} />
        {/* Student Routes */}
        <Route path="/student/dashboard" element={
          <ProtectedRoute roles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/learn/:courseId" element={
          <ProtectedRoute roles={['student']}>
            <CoursePlayer />
          </ProtectedRoute>
        } />
        <Route path="/student/certificates" element={
          <ProtectedRoute roles={['student']}>
            <Certificates />
          </ProtectedRoute>
        } />
        <Route path="/student/support" element={
          <ProtectedRoute roles={['student']}>
            <Support />
          </ProtectedRoute>
        } />
        <Route path="/student/live-sessions" element={
          <ProtectedRoute roles={['student']}>
            <LiveSessions />
          </ProtectedRoute>
        } />
        <Route path="/student/assignments" element={
          <ProtectedRoute roles={['student']}>
            <Assignments />
          </ProtectedRoute>
        } />
        <Route path="/student/assignments/:courseId" element={
          <ProtectedRoute roles={['student']}>
            <Assignments />
          </ProtectedRoute>
        } />
        <Route path="/student/discussion-forum" element={
          <ProtectedRoute roles={['student']}>
            <DiscussionForum />
          </ProtectedRoute>
        } />
        <Route path="/student/notifications" element={
          <ProtectedRoute roles={['student']}>
            <Notifications />
          </ProtectedRoute>
        } />
        <Route path="/student/chat" element={
          <ProtectedRoute roles={['student']}>
            <Chat />
          </ProtectedRoute>
        } />

        {/* Instructor Routes */}
        <Route path="/instructor/dashboard" element={
          <ProtectedRoute roles={['instructor', 'admin']}>
            <InstructorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/instructor/courses" element={
          <ProtectedRoute roles={['instructor', 'admin']}>
            <CourseManagement />
          </ProtectedRoute>
        } />
        <Route path="/instructor/students" element={
          <ProtectedRoute roles={['instructor', 'admin']}>
            <Students />
          </ProtectedRoute>
        } />
        <Route path="/instructor/batches" element={
          <ProtectedRoute roles={['instructor', 'admin']}>
            <BatchManagement />
          </ProtectedRoute>
        } />
        <Route path="/instructor/chats" element={<InstructorChats />} />
        <Route path="/instructor/discussions" element={<InstructorDiscussions />} />
        <Route path="/instructor/analytics" element={
          <ProtectedRoute roles={['instructor', 'admin']}>
            <InstructorBatchAnalytics />
          </ProtectedRoute>
        } />
        <Route path="/instructor/certificates" element={
          <ProtectedRoute roles={['instructor', 'admin']}>
            <InstructorCertificates />
          </ProtectedRoute>
        } />


        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute roles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/add-user" element={
          <ProtectedRoute roles={['admin']}>
            <AddUserPage  />
          </ProtectedRoute>
        } />


        <Route path="/admin/add-course" element={<AddCoursePage />} />

        <Route path="/admin/users" element={
          <ProtectedRoute roles={['admin']}>
            <UserManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/batches" element={
          <ProtectedRoute roles={['admin']}>
            <AdminBatchManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/support" element={<AdminTicketsPage />} />
        <Route path="/admin/media-presence" element={<MediaPresenceManagement />} />
        <Route path="/admin/manage-events" element={<ManageEventsPage />} /> {/* Added route for event management */}
        <Route path="/admin/enrollments" element={<EnrollmentManagement />} />
        <Route path="/admin/analytics" element={
          <ProtectedRoute roles={['admin']}>
            <AdminBatchAnalytics />
          </ProtectedRoute>
        } />
        <Route path="/admin/certificates" element={
          <ProtectedRoute roles={['admin']}>
            <AdminCertificateManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/notifications" element={
          <ProtectedRoute roles={['admin']}>
            <NotificationManagement />
          </ProtectedRoute>
        } />
        
        {/* 404 Not Found - Must be last route */}
        <Route path="*" element={<NotFound />} />
    
      </Routes>
      </Suspense>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <ScrollToTop />
          <AppRoutes />
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;