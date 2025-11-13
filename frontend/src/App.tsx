import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import StudentDashboard from './pages/student/Dashboard';
import InstructorDashboard from './pages/instructor/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import CourseCatalog from './pages/courses/CourseCatalog';
import CourseDetail from './pages/courses/CourseDetail';
import CoursePlayer from './pages/courses/CoursePlayer';
import Profile from './pages/Profile';
import LiveSessions from './pages/student/LiveSessions';
import Assignments from './pages/student/Assignments';
import Certificates from './pages/student/Certificates';
import Support from './pages/student/Support';
import CourseManagement from './pages/instructor/CourseManagement';
import Students from './pages/instructor/Students';
import BatchManagement from './pages/instructor/BatchManagement';
import AdminBatchManagement from './pages/admin/BatchManagement';
import UserManagement from './pages/admin/UserManagement';
import SupportManagement from './pages/admin/SupportManagement';
import SupportTicketsPage from './pages/student/SupportTicketsPage';
import { NotificationProvider } from "./context/NotificationContext";
import DiscussionForum from './pages/student/DiscussionForum';
import Notifications from './pages/student/Notifications';
import Chat from './pages/student/Chat';
import AddUserPage from './pages/admin/AddUserPage';
import AddCoursePage from "./pages/admin/AddCoursePage";
import InstructorDiscussions from './pages/instructor/InstructorDiscussions';
import InstructorChats from './pages/instructor/InstructorChats';
import HelpCenter from './pages/publicpages/Help';
import BlogPage from './pages/publicpages/Blog';
import About from './pages/publicpages/About';
import ContactUs from './pages/publicpages/Contact';
import Terms from './pages/publicpages/Terms';
import PrivacyPolicy from './pages/publicpages/PrivacyPolicy'; // Added import for Privacy Policy
import Companies from './pages/Companies';
import UniversitiesPage from './pages/UniversitiesPage';
import AdminTicketsPage from './pages/admin/SupportManagement';
import MediaPresenceManagement from './pages/admin/MediaPresenceManagement';
import ManageEventsPage from './pages/admin/ManageEventsPage'; // Added import for event management
import EventDetailPage from './pages/events/EventDetailPage'; // Added import for event detail page
import AllEventsPage from './pages/events/AllEventsPage'; // Added import for all events page
import ScrollToTop from "./pages/ScrollToTop";
import StudentAmbassadorForm from './pages/StudentAmbassadorForm';
import StudentAmbassadorList from './pages/admin/StudentAmbassadorList';
import CompanyPartnershipForm from './pages/CompanyPartnershipForm';
import CompanyPartnershipList from './pages/admin/CompanyPartnershipForm';
import UniversityPartnershipForm from './pages/UniversityPartnershipForm';
import UniversityPartnershipList from './pages/admin/UniversityPartnershipList';
import EnrollmentManagement from './pages/admin/EnrollmentManagement';

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
    
      </Routes>
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