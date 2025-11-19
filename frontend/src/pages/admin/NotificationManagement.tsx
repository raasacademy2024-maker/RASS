import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Mail,
  Users,
  Send,
  History,
  BookOpen,
  UserCheck,
  AlertCircle,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  ArrowLeft,
  Eye,
  TestTube,
} from 'lucide-react';
import { notificationManagementAPI, courseAPI } from '../../services/api';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { toast } from 'sonner';

interface Course {
  _id: string;
  title: string;
  enrollmentCount: number;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
}

interface NotificationHistory {
  _id: string;
  recipient: {
    name: string;
    email: string;
  };
  title: string;
  message: string;
  type: string;
  emailSent: boolean;
  emailStatus: string;
  createdAt: string;
}

interface Stats {
  totalNotifications: number;
  emailsSent: number;
  emailsFailed: number;
  emailsPending: number;
}

const NotificationManagement: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'send' | 'history' | 'stats'>('send');
  const [sendMode, setSendMode] = useState<'course' | 'manual'>('course');
  
  // Form state
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sendEmail, setSendEmail] = useState(true);
  const [notificationType, setNotificationType] = useState('course-update');
  
  // Data state
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [courseUsers, setCourseUsers] = useState<User[]>([]);
  const [history, setHistory] = useState<NotificationHistory[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCourses();
    if (activeTab === 'history') {
      fetchHistory();
    } else if (activeTab === 'stats') {
      fetchStats();
    }
  }, [activeTab, currentPage]);

  useEffect(() => {
    if (sendMode === 'manual') {
      fetchUsers();
    }
  }, [sendMode, searchTerm, userFilter]);

  useEffect(() => {
    if (selectedCourse && sendMode === 'course') {
      fetchCourseUsers(selectedCourse);
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);
      const response = await courseAPI.getAllCourses();
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoadingCourses(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const params: any = {};
      if (userFilter !== 'all') {
        params.role = userFilter;
      }
      if (searchTerm) {
        params.search = searchTerm;
      }
      const response = await notificationManagementAPI.getUsers(params);
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchCourseUsers = async (courseId: string) => {
    try {
      setLoadingUsers(true);
      const response = await notificationManagementAPI.getCourseUsers(courseId);
      setCourseUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching course users:', error);
      toast.error('Failed to load course users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await notificationManagementAPI.getHistory({
        page: currentPage,
        limit: 20,
      });
      setHistory(response.data.notifications || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to load notification history');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await notificationManagementAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async () => {
    if (!title || !message) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (sendMode === 'course' && !selectedCourse) {
      toast.error('Please select a course');
      return;
    }

    if (sendMode === 'manual' && selectedUsers.length === 0) {
      toast.error('Please select at least one user');
      return;
    }

    try {
      setLoading(true);
      
      let response;
      if (sendMode === 'course') {
        response = await notificationManagementAPI.sendByCourse({
          courseId: selectedCourse,
          title,
          message,
          type: notificationType,
          sendEmail,
        });
      } else {
        response = await notificationManagementAPI.sendToUsers({
          userIds: selectedUsers,
          title,
          message,
          type: notificationType,
          sendEmail,
        });
      }

      toast.success(`Notification sent to ${response.data.count} users`);
      
      // Reset form
      setTitle('');
      setMessage('');
      setSelectedCourse('');
      setSelectedUsers([]);
      
      // Show email results if emails were sent
      if (sendEmail && response.data.emailResults) {
        const { successful, failed } = response.data.emailResults;
        if (successful.length > 0) {
          toast.success(`${successful.length} emails sent successfully`);
        }
        if (failed.length > 0) {
          toast.error(`${failed.length} emails failed to send`);
        }
      }
    } catch (error: any) {
      console.error('Error sending notification:', error);
      toast.error(error.response?.data?.message || 'Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = async () => {
    const testEmail = prompt('Enter email address for test:');
    if (!testEmail) return;

    try {
      setLoading(true);
      await notificationManagementAPI.testEmail({
        email: testEmail,
        title: 'Test Email from RASS Academy',
        message: 'This is a test email to verify your email configuration.',
      });
      toast.success('Test email sent successfully!');
    } catch (error) {
      console.error('Error sending test email:', error);
      toast.error('Failed to send test email');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(u => u._id));
    }
  };

  const renderSendTab = () => (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Send Notification</h3>
        
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setSendMode('course')}
            className={`flex-1 py-3 px-4 rounded-lg border-2 transition ${
              sendMode === 'course'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <BookOpen className="h-5 w-5 mx-auto mb-1" />
            <span className="block text-sm font-medium">By Course</span>
          </button>
          
          <button
            onClick={() => setSendMode('manual')}
            className={`flex-1 py-3 px-4 rounded-lg border-2 transition ${
              sendMode === 'manual'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <UserCheck className="h-5 w-5 mx-auto mb-1" />
            <span className="block text-sm font-medium">Manual Selection</span>
          </button>
        </div>

        {/* Course Selection */}
        {sendMode === 'course' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Course
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Choose a course...</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title} ({course.enrollmentCount} students)
                </option>
              ))}
            </select>
            
            {selectedCourse && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <Users className="h-4 w-4 inline mr-1" />
                  {courseUsers.length} users will receive this notification
                </p>
              </div>
            )}
          </div>
        )}

        {/* Manual User Selection */}
        {sendMode === 'manual' && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Select Users
              </label>
              <button
                onClick={selectAllUsers}
                className="text-sm text-indigo-600 hover:text-indigo-700"
              >
                {selectedUsers.length === users.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            
            <div className="flex gap-2 mb-3">
              <div className="flex-1 relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <select
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Users</option>
                <option value="student">Students</option>
                <option value="instructor">Instructors</option>
              </select>
            </div>

            <div className="border border-gray-300 rounded-lg max-h-64 overflow-y-auto">
              {loadingUsers ? (
                <div className="p-4 text-center text-gray-500">Loading users...</div>
              ) : users.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No users found</div>
              ) : (
                users.map((user) => (
                  <label
                    key={user._id}
                    className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => toggleUserSelection(user._id)}
                      className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    {user.role && (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                        {user.role}
                      </span>
                    )}
                  </label>
                ))
              )}
            </div>
            
            {selectedUsers.length > 0 && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <Users className="h-4 w-4 inline mr-1" />
                  {selectedUsers.length} users selected
                </p>
              </div>
            )}
          </div>
        )}

        {/* Notification Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notification Type
          </label>
          <select
            value={notificationType}
            onChange={(e) => setNotificationType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="course-update">Course Update</option>
            <option value="announcement">Announcement</option>
            <option value="system">System Notification</option>
            <option value="bulk">Bulk Notification</option>
          </select>
        </div>

        {/* Title */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter notification title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Message */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message *
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter notification message"
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Send Email Toggle */}
        <div className="mb-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={sendEmail}
              onChange={(e) => setSendEmail(e.target.checked)}
              className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              Send email notification
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSendNotification}
            disabled={loading}
            className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Send className="h-5 w-5" />
            {loading ? 'Sending...' : 'Send Notification'}
          </button>
          
          <button
            onClick={handleTestEmail}
            disabled={loading}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
          >
            <TestTube className="h-5 w-5" />
            Test Email
          </button>
        </div>
      </div>
    </div>
  );

  const renderHistoryTab = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold">Notification History</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Recipient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : history.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No notifications found
                </td>
              </tr>
            ) : (
              history.map((notification) => (
                <tr key={notification._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {notification.recipient.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {notification.recipient.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {notification.title}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {notification.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {notification.emailStatus === 'sent' && (
                      <span className="flex items-center gap-1 text-sm text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        Sent
                      </span>
                    )}
                    {notification.emailStatus === 'failed' && (
                      <span className="flex items-center gap-1 text-sm text-red-600">
                        <XCircle className="h-4 w-4" />
                        Failed
                      </span>
                    )}
                    {notification.emailStatus === 'pending' && (
                      <span className="flex items-center gap-1 text-sm text-yellow-600">
                        <AlertCircle className="h-4 w-4" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t flex items-center justify-between">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );

  const renderStatsTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Notifications</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.totalNotifications}
                </p>
              </div>
              <Bell className="h-10 w-10 text-indigo-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Emails Sent</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {stats.emailsSent}
                </p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Emails Failed</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {stats.emailsFailed}
                </p>
              </div>
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {stats.emailsPending}
                </p>
              </div>
              <AlertCircle className="h-10 w-10 text-yellow-600" />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Dashboard
            </button>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Bell className="h-8 w-8 text-indigo-600" />
                  Notification Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Send notifications and emails to students and instructors
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="flex gap-8">
              <button
                onClick={() => setActiveTab('send')}
                className={`pb-4 px-1 border-b-2 transition ${
                  activeTab === 'send'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Send className="h-5 w-5 inline mr-2" />
                Send Notification
              </button>
              
              <button
                onClick={() => setActiveTab('history')}
                className={`pb-4 px-1 border-b-2 transition ${
                  activeTab === 'history'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <History className="h-5 w-5 inline mr-2" />
                History
              </button>
              
              <button
                onClick={() => setActiveTab('stats')}
                className={`pb-4 px-1 border-b-2 transition ${
                  activeTab === 'stats'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Eye className="h-5 w-5 inline mr-2" />
                Statistics
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'send' && renderSendTab()}
          {activeTab === 'history' && renderHistoryTab()}
          {activeTab === 'stats' && renderStatsTab()}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotificationManagement;
