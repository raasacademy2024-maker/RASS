import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  enrollmentAPI,
  notificationAPI,
  assignmentAPI,
} from "../../services/api";
import {
  BookOpen,
  Calendar,
  Award,
  Bell,
  Play,
  Clock,
  ChevronRight,
  Users,
  MessageSquare,
  Video,
  FileText,
  ChevronUp,
  Sparkles,
  TrendingUp,
  Bookmark,
  Zap,
} from "lucide-react";
import { Enrollment, Notification, Assignment } from "../../types";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../../components/layout/Footer";
import Navbar from "../../components/layout/Navbar";

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsOpen, setStatsOpen] = useState(true);

  const handleNavigate = (path: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(path);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [enrollmentsRes, notificationsRes] = await Promise.all([
        enrollmentAPI.getMyEnrollments(),
        notificationAPI.getNotifications(),
      ]);

      setEnrollments(enrollmentsRes.data);
      setNotifications(notificationsRes.data.slice(0, 5));

      const assignmentsAll: Assignment[] = [];
      for (const e of enrollmentsRes.data) {
        const courseId =
          typeof e.course === "string" ? e.course : e.course._id;
        const res = await assignmentAPI.getCourseAssignments(courseId);
        assignmentsAll.push(...res.data);
      }
      setAssignments(assignmentsAll);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="flex flex-col items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"
          ></motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-gray-600 font-medium"
          >
            Preparing your learning journey...
          </motion.p>
        </div>
      </div>
    );
  }

  const completedCourses = enrollments.filter((e) => e.completed);
  const inProgressCourses = enrollments.filter((e) => !e.completed);
  const totalWatchTime = enrollments.reduce(
    (total, e) =>
      total + e.progress.reduce((sum, p) => sum + (p.watchTime || 0), 0),
    0
  );
  const achievementScore = Math.round(
    (completedCourses.length / Math.max(enrollments.length, 1)) * 100
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />

      {/* Background gradient */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-r from-blue-400/5 to-indigo-400/5 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm mb-4">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium text-gray-600">
              Welcome back, {user?.name}!
            </span>
          </div>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-indigo-700 bg-clip-text text-transparent pb-3 leading-tight">
            Your Learning Dashboard
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Continue your journey towards mastery. You're doing amazing!
          </p>

          <div className="flex items-center justify-center gap-4 mt-6 text-gray-500">
            <Calendar className="h-5 w-5" />
            <span className="font-medium">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </motion.header>

        {/* Quick Access */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <Zap className="h-6 w-6 text-amber-500" />
            <h2 className="text-2xl font-bold text-gray-900">Quick Access</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "Courses", icon: BookOpen, path: "/courses", color: "blue" },
              { name: "Profile", icon: Users, path: "/profile", color: "emerald" },
              { name: "Assignments", icon: FileText, path: "/student/assignments", color: "orange" },
              { name: "Support", icon: MessageSquare, path: "/support-tickets", color: "red" },
              { name: "Discussions", icon: MessageSquare, path: "/student/discussion-forum", color: "purple" },
              { name: "Chat", icon: MessageSquare, path: "/student/chat", color: "green" },
            ].map((item, idx) => {
              const Icon = item.icon;
              const colorClasses = {
                blue: "from-blue-500 to-blue-600",
                emerald: "from-emerald-500 to-emerald-600",
                orange: "from-orange-500 to-orange-600",
                red: "from-red-500 to-red-600",
                purple: "from-purple-500 to-purple-600",
                green: "from-green-500 to-green-600",
                pink: "from-pink-500 to-pink-600",
              }[item.color];
              return (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button
                    onClick={() => handleNavigate(item.path)}
                    className={`block w-full p-4 bg-gradient-to-br ${colorClasses} text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center`}
                  >
                    <Icon className="h-6 w-6 mb-2 mx-auto" />
                    <span className="text-xs font-semibold">{item.name}</span>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ✅ My Enrolled Courses Section (NEW) */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mb-12"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-indigo-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  My Enrolled Courses
                </h2>
              </div>
              <Link
                to="/courses"
                className="group flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
              >
                View All
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {enrollments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrollments.map((e, index) => {
                  const course =
                    typeof e.course === "string" ? { _id: e.course } : e.course;
                  return (
                     <motion.div
                      key={e._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.03, y: -3 }}
                      className="group bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex flex-col justify-between h-full">
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
                            {(course as any).title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            by {(course as any).instructor?.name}
                          </p>
                          {e.batch && typeof e.batch === 'object' && (
                            <div className="mb-3 px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-lg">
                              <p className="text-xs font-medium text-indigo-700">
                                📅 Batch: {(e.batch as any).name}
                              </p>
                              <p className="text-xs text-indigo-600 mt-1">
                                {new Date((e.batch as any).startDate).toLocaleDateString()} - {new Date((e.batch as any).endDate).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-semibold text-indigo-600">
                                {e.completionPercentage || 0}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{
                                  width: `${e.completionPercentage || 0}%`,
                                }}
                                transition={{ duration: 1 }}
                                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                              ></motion.div>
                            </div>
                          </div>
                        </div>
                        <Link
                          to={`/learn/${course._id}`}
                          className="mt-4 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-center"
                        >
                          Continue
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No enrolled courses yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Enroll in a course to start your learning journey!
                </p>
                <Link
                  to="/courses"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <BookOpen className="h-4 w-4" />
                  Browse Courses
                </Link>
              </div>
            )}
          </div>
        </motion.section>

        {/* Stats & Progress Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
            <motion.div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setStatsOpen(!statsOpen)}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-indigo-600" />
                <h3 className="text-xl font-bold text-gray-900">Learning Analytics</h3>
              </div>
              <motion.div
                animate={{ rotate: statsOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronUp className="h-5 w-5 text-gray-500" />
              </motion.div>
            </motion.div>
            
            <AnimatePresence>
              {statsOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mt-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                      {
                        icon: <BookOpen className="h-8 w-8 text-blue-600" />,
                        label: "Enrolled Courses",
                        value: enrollments.length,
                        gradient: "from-blue-50 to-blue-100",
                      },
                      {
                        icon: <Play className="h-8 w-8 text-green-600" />,
                        label: "In Progress",
                        value: inProgressCourses.length,
                        gradient: "from-green-50 to-green-100",
                      },
                      {
                        icon: <Award className="h-8 w-8 text-amber-600" />,
                        label: "Completed",
                        value: completedCourses.length,
                        gradient: "from-amber-50 to-amber-100",
                      },
                      {
                        icon: <Clock className="h-8 w-8 text-indigo-600" />,
                        label: "Total Watch Time",
                        value: `${Math.round(totalWatchTime / 3600)}h`,
                        gradient: "from-indigo-50 to-indigo-100",
                      },
                    ].map((stat, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-6 shadow-lg border border-white/50`}
                      >
                        <div className="flex items-center justify-between">
                          {stat.icon}
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="text-3xl font-bold text-gray-900"
                          >
                            {stat.value}
                          </motion.div>
                        </div>
                        <p className="text-sm font-medium text-gray-600 mt-3">
                          {stat.label}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Achievement Score */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-gray-900">Achievement Score</h4>
                        <p className="text-sm text-gray-600">Based on your learning progress</p>
                      </div>
                      <div className="text-right">
                        <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          {achievementScore}%
                        </span>
                        <div className="w-24 bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${achievementScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Continue Learning Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Bookmark className="h-6 w-6 text-indigo-600" />
                <h2 className="text-2xl font-bold text-gray-900">Continue Learning</h2>
              </div>
              <Link
                to="/courses"
                className="group flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
              >
                Browse All Courses
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {inProgressCourses.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {inProgressCourses.slice(0, 2).map((e, index) => {
                  const course =
                    typeof e.course === "string" ? { _id: e.course } : e.course;

                  return (
                    <motion.div
                      key={e._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="group relative bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
                            {(course as any).title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4">
                            by {(course as any).instructor?.name}
                          </p>

                          {/* Progress bar */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-semibold text-indigo-600">
                                {e.completionPercentage}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${e.completionPercentage}%` }}
                                transition={{ duration: 1, delay: index * 0.3 }}
                                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full shadow-inner"
                              ></motion.div>
                            </div>
                          </div>
                        </div>
                        
                        <Link
                          to={`/learn/${course._id}`}
                          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group-hover:from-indigo-700 group-hover:to-purple-700"
                        >
                          Continue
                        </Link>
                      </div>
                      
                      {/* Decorative element */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-bl-2xl rounded-tr-2xl"></div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No active courses
                </h3>
                <p className="text-gray-500 mb-6">
                  Start your learning journey by enrolling in a course
                </p>
                <Link
                  to="/courses"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <BookOpen className="h-4 w-4" />
                  Browse Courses
                </Link>
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Notifications Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-12"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Bell className="h-6 w-6 text-amber-500" />
                <h3 className="text-xl font-bold text-gray-900">
                  Recent Notifications
                </h3>
              </div>
              <div className="flex items-center gap-2 text-amber-500">
                <span className="text-sm font-semibold">
                  {notifications.filter(n => !n.read).length} unread
                </span>
              </div>
            </div>
            
            {notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map((n, index) => (
                  <motion.div
                    key={n._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.01, x: 5 }}
                    className={`p-4 rounded-xl border-l-4 ${
                      n.read 
                        ? 'border-gray-300 bg-gray-50' 
                        : 'border-amber-500 bg-amber-50/50 shadow-sm'
                    } transition-all duration-300`}
                  >
                    <div className="flex items-start gap-3">
                      {!n.read && (
                        <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                      )}
                      <div className="flex-1">
                        <p className={`font-semibold ${
                          n.read ? 'text-gray-700' : 'text-gray-900'
                        }`}>
                          {n.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                          {n.message}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">
                  No new notifications. You're all caught up!
                </p>
              </motion.div>
            )}
          </div>
        </motion.section>
      </div>
      
      <Footer />
    </div>
  );
};

export default StudentDashboard;