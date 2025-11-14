import React, { useState, useEffect } from "react";
import { userAPI } from "../../services/api";
import {
  Users,
  Search,
  Shield,
  UserPlus,
  Mail,
  Loader2,
  BookOpen,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { User } from "../../types";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

interface Course {
  _id: string;
  title: string;
  instructor: string;
  progress: number;
  status: string;
}

interface ExtendedUser extends User {
  enrolledCourses?: Course[];
  hasEnrollments?: boolean;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [enrollmentFilter, setEnrollmentFilter] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [courseLoading, setCourseLoading] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalInstructors: 0,
    enrolledStudents: 0,
    unenrolledStudents: 0,
  });

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "student",
    password: "password123",
  });

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [searchTerm, roleFilter, enrollmentFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (roleFilter) params.role = roleFilter;
      
      let response;
      if (enrollmentFilter && roleFilter === "student") {
        // Use the dedicated method for enrollment filtering
        response = await userAPI.getStudentsByEnrollment(
          enrollmentFilter as 'enrolled' | 'unenrolled' | 'all',
          params
        );
      } else {
        // Use the general getAllUsers method
        if (enrollmentFilter) {
          params.hasEnrollments = enrollmentFilter === 'enrolled';
        }
        response = await userAPI.getAllUsers(params);
      }
      
      setUsers(response.data || []);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      setError(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await userAPI.getEnrollmentStats();
      setStats(statsData.data || {
        totalStudents: 0,
        totalInstructors: 0,
        enrolledStudents: 0,
        unenrolledStudents: 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchUserCourses = async (userId: string) => {
    try {
      setCourseLoading(prev => [...prev, userId]);
      const response = await userAPI.getStudentCourses(userId);
      
      setUsers(prev => prev.map(user => 
        user._id === userId 
          ? { ...user, enrolledCourses: response.data.courses || [] }
          : user
      ));
    } catch (error: any) {
      console.error("Error fetching courses:", error);
      setError(error.response?.data?.message || "Failed to fetch courses");
    } finally {
      setCourseLoading(prev => prev.filter(id => id !== userId));
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userAPI.createUser(newUser);
      setShowCreateModal(false);
      setNewUser({ name: "", email: "", role: "student", password: "password123" });
      fetchUsers();
      fetchStats();
    } catch (error: any) {
      console.error("Error creating user:", error);
      setError(error.response?.data?.message || "Failed to create user");
    }
  };

  const handleEnrollmentAction = async (studentId: string, courseId: string, action: 'enroll' | 'unenroll') => {
    try {
      if (action === 'enroll') {
        await userAPI.enrollStudent(studentId, courseId);
      } else {
        await userAPI.unenrollStudent(studentId, courseId);
      }
      fetchUserCourses(studentId);
      fetchStats();
    } catch (error: any) {
      console.error(`Error ${action}ing student:`, error);
      setError(error.response?.data?.message || `Failed to ${action} student`);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "instructor":
        return "bg-blue-100 text-blue-800";
      case "student":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const toggleRowExpansion = (userId: string) => {
    const isExpanded = expandedRows.includes(userId);
    setExpandedRows(prev => 
      isExpanded 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
    
    // Fetch courses only when expanding
    if (!isExpanded) {
      const user = users.find(u => u._id === userId);
      if (user && (!user.enrolledCourses || user.enrolledCourses.length === 0)) {
        fetchUserCourses(userId);
      }
    }
  };

  const getEnrollmentStatus = (user: ExtendedUser) => {
    if (user.role !== "student") return null;
    return user.hasEnrollments || (user.enrolledCourses && user.enrolledCourses.length > 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3"
          >
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-800">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </motion.div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">
              Manage platform users and their permissions
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 sm:mt-0 px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg flex items-center gap-2 shadow hover:shadow-lg transition"
          >
            <UserPlus className="h-5 w-5" /> Add User
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center"
          >
            <Users className="h-8 w-8 text-blue-600 mb-2" />
            <h3 className="text-sm text-gray-600">Total Students</h3>
            <p className="text-2xl font-bold text-blue-700">
              {stats.totalStudents || users.filter((u) => u.role === "student").length}
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center"
          >
            <Shield className="h-8 w-8 text-green-600 mb-2" />
            <h3 className="text-sm text-gray-600">Instructors</h3>
            <p className="text-2xl font-bold text-green-700">
              {stats.totalInstructors || users.filter((u) => u.role === "instructor").length}
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center"
          >
            <CheckCircle className="h-8 w-8 text-purple-600 mb-2" />
            <h3 className="text-sm text-gray-600">Enrolled Students</h3>
            <p className="text-2xl font-bold text-purple-700">
              {stats.enrolledStudents || users.filter((u) => u.role === "student" && getEnrollmentStatus(u)).length}
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center"
          >
            <XCircle className="h-8 w-8 text-orange-600 mb-2" />
            <h3 className="text-sm text-gray-600">Unenrolled Students</h3>
            <p className="text-2xl font-bold text-orange-700">
              {stats.unenrolledStudents || users.filter((u) => u.role === "student" && !getEnrollmentStatus(u)).length}
            </p>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="h-5 w-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Roles</option>
            <option value="student">Students</option>
            <option value="instructor">Instructors</option>
            <option value="admin">Admins</option>
          </select>
          <select
            value={enrollmentFilter}
            onChange={(e) => setEnrollmentFilter(e.target.value)}
            disabled={roleFilter && roleFilter !== "student"}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">All Students</option>
            <option value="enrolled">Enrolled Students</option>
            <option value="unenrolled">Unenrolled Students</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  User
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Role
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {users.map((user) => (
                  <React.Fragment key={user._id}>
                    <motion.tr
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.role === "student" && (
                          <div className="flex items-center gap-1">
                            {getEnrollmentStatus(user) ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm text-green-600">Enrolled</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 text-orange-500" />
                                <span className="text-sm text-orange-600">Not Enrolled</span>
                              </>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{user._id}</td>
                      <td className="px-6 py-4">
                        {user.role === "student" && (
                          <button
                            onClick={() => toggleRowExpansion(user._id)}
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1"
                          >
                            <BookOpen className="h-4 w-4" />
                            {expandedRows.includes(user._id) ? "Hide" : "Show"} Courses
                          </button>
                        )}
                      </td>
                    </motion.tr>
                    {user.role === "student" && expandedRows.includes(user._id) && (
                      <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gray-50"
                      >
                        <td colSpan={5} className="px-6 py-4">
                          <div className="bg-white rounded-lg p-4 shadow-sm">
                            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                              <BookOpen className="h-5 w-5 text-indigo-600" />
                              Enrolled Courses
                            </h4>
                            {courseLoading.includes(user._id) ? (
                              <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 text-indigo-600 animate-spin" />
                              </div>
                            ) : user.enrolledCourses && user.enrolledCourses.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {user.enrolledCourses.map((course) => (
                                  <div key={course._id} className="flex flex-col p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex-1">
                                        <p className="font-medium text-gray-900">{course.title}</p>
                                        <p className="text-sm text-gray-500">Instructor: {course.instructor}</p>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-sm text-gray-500">Progress</p>
                                        <p className="font-medium text-indigo-600">{course.progress || 0}%</p>
                                      </div>
                                    </div>
                                    {(course as any).batch && (
                                      <div className="pt-2 mt-2 border-t border-gray-200">
                                        <p className="text-xs text-gray-600 flex items-center">
                                          <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                                          Batch: {(course as any).batch.name}
                                        </p>
                                        <p className="text-xs text-gray-500 ml-4">
                                          {new Date((course as any).batch.startDate).toLocaleDateString()} - {new Date((course as any).batch.endDate).toLocaleDateString()}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 italic">No courses enrolled yet</p>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </React.Fragment>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Create User Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md"
              >
                <h3 className="text-lg font-semibold mb-4">Add New User</h3>
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    required
                  />
                  <select
                    className="w-full px-4 py-2 border rounded-lg"
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                  >
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                    <option value="admin">Admin</option>
                  </select>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2 border rounded-lg text-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:shadow-md"
                    >
                      Create User
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
};

export default UserManagement;