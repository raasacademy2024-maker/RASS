import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { userAPI, courseAPI } from "../../services/api";
import {
  Users,
  BookOpen,
  TrendingUp,
  DollarSign,
  UserPlus,
  Settings,
  ChevronRight,
  Search,
  MoreHorizontal,
  Activity,
  Newspaper,
  Calendar,
  FileText,
  ForkKnife,
  SheetIcon,
  Bell,
} from "lucide-react";
import { User, Course } from "../../types";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import AdminCourses from "./AdminCourse";
import ManageCourses from "./AdminCourse";
// Removed direct import of ManageEventsPage since it will be a separate route

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, coursesRes] = await Promise.all([
        userAPI.getAllUsers(),
        courseAPI.getAllCourses(),
      ]);
      setUsers(usersRes.data);
      setCourses(coursesRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const totalStudents = users.filter((u) => u.role === "student").length;
  const totalInstructors = users.filter((u) => u.role === "instructor").length;
  const totalEnrollments = courses.reduce(
    (total, c) => total + c.enrollmentCount,
    0
  );
  const totalRevenue = courses.reduce(
    (total, c) => total + c.price * c.enrollmentCount,
    0
  );

  return (
    <div>
      <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">Welcome back, {user?.name}</p>
          </div>
          <div className="relative hidden sm:block">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: "Total Students",
              value: totalStudents,
              icon: <Users className="h-6 w-6 text-indigo-600" />,
              color: "from-indigo-100 to-indigo-200",
              growth: "+12.5%",
            },
            {
              label: "Instructors",
              value: totalInstructors,
              icon: <UserPlus className="h-6 w-6 text-green-600" />,
              color: "from-green-100 to-green-200",
              growth: "+2.1%",
            },
            {
              label: "Total Courses",
              value: courses.length,
              icon: <BookOpen className="h-6 w-6 text-blue-600" />,
              color: "from-blue-100 to-blue-200",
              growth: "+5.7%",
            },
            {
              label: "Revenue",
              value: `₹${totalRevenue.toLocaleString()}`,
              icon: <DollarSign className="h-6 w-6 text-amber-600" />,
              color: "from-amber-100 to-amber-200",
              growth: "+8.3%",
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 flex items-start justify-between"
            >
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
                <p className="text-sm text-green-600 mt-2 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {stat.growth}
                </p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                {stat.icon}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Users & Courses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Recent Users</h2>
              <button
                className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                onClick={() => navigate("/admin/users")}
              >
                View all <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            <div className="space-y-4">
              {users.slice(0, 5).map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-medium">
                        {u.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">{u.name}</p>
                      <p className="text-sm text-gray-600">{u.email}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      u.role === "admin"
                        ? "bg-red-100 text-red-800"
                        : u.role === "instructor"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Popular Courses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Popular Courses</h2>
              <button
                className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                onClick={() => navigate("/admin/courses")}
              >
                View all <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            <div className="space-y-4">
              {courses
                .sort((a, b) => b.enrollmentCount - a.enrollmentCount)
                .slice(0, 5)
                .map((c) => (
                  <div
                    key={c._id}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{c.title}</p>
                      <p className="text-sm text-gray-600">
                        by {c.instructor.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {c.enrollmentCount} students
                      </p>
                      <p className="text-sm text-gray-600">₹{c.price}</p>
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[
            {
              title: "Add Instructor",
              desc: "Invite new instructors to the platform",
              icon: <UserPlus className="h-6 w-6 text-indigo-600" />,
              color: "bg-indigo-100",
              action: () => navigate("/admin/add-user"),
            },
            {
              title: "Course Management",
              desc: "Review and approve course content",
              icon: <BookOpen className="h-6 w-6 text-blue-600" />,
              color: "bg-blue-100",
              action: () => navigate("/admin/add-course"),
            },
            {
              title: "Support Tickets",
              desc: "Manage user inquiries and issues",
              icon: <Settings className="h-6 w-6 text-gray-600" />,
              color: "bg-gray-100",
              action: () => navigate("/admin/support"),
            },
            {
              title: "Media Presence",
              desc: "Manage media mentions and press coverage",
              icon: <Newspaper className="h-6 w-6 text-purple-600" />,
              color: "bg-purple-100",
              action: () => navigate("/admin/media-presence"),
            },
            {
              title: "Event Management",
              desc: "Create and manage events",
              icon: <Calendar className="h-6 w-6 text-green-600" />,
              color: "bg-green-100",
              action: () => navigate("/admin/manage-events"),
            },
            {
              title: "Student Ambassador List",
              desc: "View and manage student ambassadors",
              icon: <FileText className="h-6 w-6 text-red-600" />,
              color: "bg-green-100",
              action: () => navigate("/admin/student-ambassador-list"),
            },
            
            {
              title: "Company Partnership List",
              desc: "View and manage company partnerships",
              icon: <ForkKnife className="h-6 w-6 text-red-600" />,
              color: "bg-green-100",
              action: () => navigate("/admin/company-partnership-list"),
            },
            {
              title: "University Partnership List",
              desc: "View and manage university partnerships",
              icon: <SheetIcon className="h-6 w-6 text-blue-600" />,
              color: "bg-green-100",
              action: () => navigate("/admin/university-partnership-list"),
            },
            {
              title: "Enrollment Management",
              desc: "Manage course enrollment forms and payments",
              icon: <UserPlus className="h-6 w-6 text-indigo-600" />,
              color: "bg-indigo-100",
              action: () => navigate("/admin/enrollments"),
            },
            {
              title: "Batch Management",
              desc: "Create and manage course batches",
              icon: <Users className="h-6 w-6 text-teal-600" />,
              color: "bg-teal-100",
              action: () => navigate("/admin/batches"),
            },
            {
              title: "Notification Management",
              desc: "Send notifications and emails to users",
              icon: <Bell className="h-6 w-6 text-orange-600" />,
              color: "bg-orange-100",
              action: () => navigate("/admin/notifications"),
            },
          ].map((action, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 text-left flex flex-col hover:shadow-lg transition"
              onClick={action.action}
            >
              <div className="flex items-center mb-3">
                <div className={`${action.color} p-3 rounded-xl`}>
                  {action.icon}
                </div>
                <h3 className="text-md font-semibold text-gray-900 ml-3">
                  {action.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600">{action.desc}</p>
            </motion.button>
          ))}
        </div>
        <ManageCourses />
        {/* Removed ManageEventsPage component since it will be accessed via navigation */}
      </main>
    </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;