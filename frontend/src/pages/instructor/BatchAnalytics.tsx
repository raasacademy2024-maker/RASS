// frontend/src/pages/instructor/BatchAnalytics.tsx
import React, { useState, useEffect } from "react";
import {
  Users,
  TrendingUp,
  CheckCircle,
  BookOpen,
  FileText,
  Calendar,
  Award,
  AlertTriangle,
  BarChart3,
} from "lucide-react";
import { courseAPI, batchAPI } from "../../services/api";
import { Course } from "../../types";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

interface BatchAnalytics {
  batch: {
    _id: string;
    name: string;
    startDate: string;
    endDate: string;
    capacity: number;
    enrolledCount: number;
    isActive: boolean;
    description?: string;
  };
  course: {
    _id: string;
    title: string;
  };
  enrollment: {
    total: number;
    completed: number;
    inProgress: number;
    averageProgress: number;
    availableSlots: number;
  };
  assignments: {
    total: number;
    submissions: number;
    graded: number;
    pending: number;
  };
  attendance: {
    totalSessions: number;
    totalRecords: number;
    present: number;
    absent: number;
    late: number;
    attendancePercentage: number;
  };
  quizzes: {
    total: number;
    attempts: number;
    averageScore: number;
  };
  liveSessions: {
    total: number;
    upcoming: number;
    completed: number;
  };
  topPerformers: Array<{
    studentId: string;
    name: string;
    email: string;
    progress: number;
    completed: boolean;
    enrolledAt: string;
  }>;
  atRiskStudents: Array<{
    studentId: string;
    name: string;
    email: string;
    progress: number;
    enrolledAt: string;
  }>;
}

interface Batch {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  capacity: number;
  enrolledCount: number;
  isActive: boolean;
}

const InstructorBatchAnalytics: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [analytics, setAnalytics] = useState<BatchAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchBatches(selectedCourse._id);
    }
  }, [selectedCourse]);

  useEffect(() => {
    if (selectedBatch) {
      fetchBatchAnalytics(selectedBatch._id);
    }
  }, [selectedBatch]);

  const fetchCourses = async () => {
    try {
      const response = await courseAPI.getInstructorCourses();
      setCourses(response.data);
      if (response.data.length > 0) {
        setSelectedCourse(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBatches = async (courseId: string) => {
    try {
      const response = await batchAPI.getCourseBatches(courseId);
      setBatches(response.data);
      if (response.data.length > 0) {
        setSelectedBatch(response.data[0]);
      } else {
        setSelectedBatch(null);
        setAnalytics(null);
      }
    } catch (error) {
      console.error("Error fetching batches:", error);
      setBatches([]);
      setSelectedBatch(null);
      setAnalytics(null);
    }
  };

  const fetchBatchAnalytics = async (batchId: string) => {
    setAnalyticsLoading(true);
    try {
      const response = await batchAPI.getBatchAnalytics(batchId);
      setAnalytics(response.data);
    } catch (error) {
      console.error("Error fetching batch analytics:", error);
      setAnalytics(null);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    subtitle?: string;
  }> = ({ title, value, icon, color, subtitle }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border-l-4" style={{ borderColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
          {icon}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Batch Analytics</h1>
          <p className="text-gray-600">Track your batch performance and student progress</p>
        </div>

        {/* Course and Batch Selectors */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BookOpen className="w-4 h-4 inline mr-2" />
                Select Course
              </label>
              <select
                value={selectedCourse?._id || ""}
                onChange={(e) => {
                  const course = courses.find((c) => c._id === e.target.value);
                  setSelectedCourse(course || null);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-2" />
                Select Batch
              </label>
              <select
                value={selectedBatch?._id || ""}
                onChange={(e) => {
                  const batch = batches.find((b) => b._id === e.target.value);
                  setSelectedBatch(batch || null);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                disabled={batches.length === 0}
              >
                {batches.length === 0 ? (
                  <option>No batches available</option>
                ) : (
                  batches.map((batch) => (
                    <option key={batch._id} value={batch._id}>
                      {batch.name} ({batch.enrolledCount}/{batch.capacity})
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Analytics Content */}
        {analyticsLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading analytics...</p>
          </div>
        ) : analytics ? (
          <div className="space-y-6">
            {/* Batch Info Card */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{analytics.batch.name}</h2>
                  <p className="text-indigo-100 mb-1">{analytics.course.title}</p>
                  <p className="text-sm text-indigo-200">
                    {formatDate(analytics.batch.startDate)} - {formatDate(analytics.batch.endDate)}
                  </p>
                  {analytics.batch.description && (
                    <p className="text-sm text-indigo-100 mt-2">{analytics.batch.description}</p>
                  )}
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    analytics.batch.isActive ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {analytics.batch.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Students"
                value={analytics.enrollment.total}
                icon={<Users className="w-6 h-6" style={{ color: '#3B82F6' }} />}
                color="#3B82F6"
                subtitle={`${analytics.enrollment.availableSlots} slots available`}
              />
              <StatCard
                title="Average Progress"
                value={`${analytics.enrollment.averageProgress}%`}
                icon={<TrendingUp className="w-6 h-6" style={{ color: '#10B981' }} />}
                color="#10B981"
                subtitle={`${analytics.enrollment.completed} completed`}
              />
              <StatCard
                title="Attendance Rate"
                value={`${analytics.attendance.attendancePercentage}%`}
                icon={<CheckCircle className="w-6 h-6" style={{ color: '#8B5CF6' }} />}
                color="#8B5CF6"
                subtitle={`${analytics.attendance.totalSessions} sessions`}
              />
              <StatCard
                title="Quiz Average"
                value={`${analytics.quizzes.averageScore}%`}
                icon={<Award className="w-6 h-6" style={{ color: '#F59E0B' }} />}
                color="#F59E0B"
                subtitle={`${analytics.quizzes.attempts} total attempts`}
              />
            </div>

            {/* Assignments & Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Assignments</h3>
                  <FileText className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total</span>
                    <span className="font-semibold text-gray-900">{analytics.assignments.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Submissions</span>
                    <span className="font-semibold text-blue-600">{analytics.assignments.submissions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Graded</span>
                    <span className="font-semibold text-green-600">{analytics.assignments.graded}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pending Review</span>
                    <span className="font-semibold text-orange-600">{analytics.assignments.pending}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Attendance</h3>
                  <Calendar className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Present</span>
                    <span className="font-semibold text-green-600">{analytics.attendance.present}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Absent</span>
                    <span className="font-semibold text-red-600">{analytics.attendance.absent}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Late</span>
                    <span className="font-semibold text-yellow-600">{analytics.attendance.late}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Sessions</span>
                    <span className="font-semibold text-gray-900">{analytics.attendance.totalSessions}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Live Sessions</h3>
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total</span>
                    <span className="font-semibold text-gray-900">{analytics.liveSessions.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Completed</span>
                    <span className="font-semibold text-green-600">{analytics.liveSessions.completed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Upcoming</span>
                    <span className="font-semibold text-blue-600">{analytics.liveSessions.upcoming}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Quizzes</span>
                    <span className="font-semibold text-purple-600">{analytics.quizzes.total}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Performers */}
            {analytics.topPerformers.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Top Performers</h3>
                  <Award className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rank
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Progress
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {analytics.topPerformers.map((student, index) => (
                        <tr key={student.studentId}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                              index === 0 ? 'bg-yellow-100 text-yellow-800' :
                              index === 1 ? 'bg-gray-100 text-gray-800' :
                              index === 2 ? 'bg-orange-100 text-orange-800' :
                              'bg-blue-100 text-blue-800'
                            } font-semibold`}>
                              {index + 1}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{student.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                                <div
                                  className="bg-green-600 h-2 rounded-full"
                                  style={{ width: `${student.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-900">{student.progress}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {student.completed ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Completed
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                In Progress
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* At-Risk Students */}
            {analytics.atRiskStudents.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Students Needing Attention</h3>
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  These students have less than 30% course completion and may need additional support.
                </p>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Progress
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Enrolled
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {analytics.atRiskStudents.map((student) => (
                        <tr key={student.studentId}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{student.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                                <div
                                  className="bg-red-600 h-2 rounded-full"
                                  style={{ width: `${student.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-red-600">{student.progress}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(student.enrolledAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* No Students Message */}
            {analytics.enrollment.total === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                <p className="text-gray-700 font-medium">No students enrolled in this batch yet.</p>
                <p className="text-gray-600 text-sm mt-1">Students will appear here once they enroll.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Select a course and batch to view analytics</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default InstructorBatchAnalytics;
