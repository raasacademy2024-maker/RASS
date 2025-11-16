import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { enrollmentAPI, assignmentAPI } from "../../services/api";
import { 
  FileText, Calendar, Upload, CheckCircle, 
  Clock, Award, BookOpen, Filter, 
  Search, Zap, TrendingUp, Star,
  Download, Eye, Bookmark, Users
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Assignment, Enrollment } from "../../types";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";

type ExtendedAssignment = Assignment & {
  courseTitle?: string;
  courseId?: string;
  batchName?: string;
  submissionStatus?: "pending" | "submitted" | "graded";
  grade?: number;
};

const Assignments: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<ExtendedAssignment[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [courses, setCourses] = useState<{ _id: string; title: string }[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [submissionData, setSubmissionData] = useState<{ [key: string]: string }>({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "submitted" | "graded">("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAssignments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      if (courseId) {
        // If viewing a specific course, get user's batch from enrollment
        const enrollmentsRes = await enrollmentAPI.getMyEnrollments();
        const enrollment = enrollmentsRes.data.find((e: Enrollment) => 
          (typeof e.course === 'object' ? e.course._id : e.course) === courseId
        );
        const batchId = enrollment?.batch?._id;
        
        // Fetch assignments with batch filter
        const response = await assignmentAPI.getCourseAssignments(courseId, batchId);
        const assignmentsWithBatch = response.data.map((a: Assignment) => ({
          ...a,
          batchName: enrollment?.batch?.name,
        }));
        setAssignments(assignmentsWithBatch);
      } else {
        // Fetch all enrollments
        const enrollmentsRes = await enrollmentAPI.getMyEnrollments();
        const enrollmentsList = enrollmentsRes.data;
        setEnrollments(enrollmentsList);

        setCourses(enrollmentsList.map((e: Enrollment) => e.course));

        // Fetch assignments for each enrolled course, filtered by batch
        let allAssignments: ExtendedAssignment[] = [];
        for (const e of enrollmentsList) {
          const courseIdStr = typeof e.course === 'object' ? e.course._id : e.course;
          const batchId = e.batch?._id;
          
          const res = await assignmentAPI.getCourseAssignments(courseIdStr, batchId);
          const courseAssignments = res.data.map((a: Assignment) => ({
            ...a,
            courseTitle: typeof e.course === 'object' ? e.course.title : 'Unknown Course',
            courseId: courseIdStr,
            batchName: e.batch?.name,
            // TODO: Get actual submission status from assignment submissions
            submissionStatus: "pending" as const,
            grade: undefined,
          }));
          allAssignments = [...allAssignments, ...courseAssignments];
        }
        setAssignments(allAssignments);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (assignmentId: string) => {
    try {
      const content = submissionData[assignmentId];
      if (!content) return;

      await assignmentAPI.submitAssignment(assignmentId, { content });

      setShowSuccessPopup(true);
      setSubmissionData({ ...submissionData, [assignmentId]: "" });

      await fetchAssignments();

      setTimeout(() => setShowSuccessPopup(false), 3000);
    } catch (error) {
      console.error("Error submitting assignment:", error);
    }
  };

  const filteredAssignments = assignments
    .filter(assignment => 
      selectedCourseId === "all" || assignment.courseId === selectedCourseId
    )
    .filter(assignment =>
      filterStatus === "all" || assignment.submissionStatus === filterStatus
    )
    .filter(assignment =>
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-amber-100 text-amber-800 border-amber-200";
      case "submitted": return "bg-blue-100 text-blue-800 border-blue-200";
      case "graded": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return Clock;
      case "submitted": return Upload;
      case "graded": return Award;
      default: return FileText;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center"
        >
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <FileText className="h-16 w-16 text-indigo-600" />
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-indigo-200 rounded-full blur-xl"
            ></motion.div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-lg font-medium text-gray-600"
          >
            Loading your assignments...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      {/* Animated background */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-r from-blue-400/5 to-purple-400/5 pointer-events-none"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Success Popup */}
        <AnimatePresence>
          {showSuccessPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="bg-green-100 p-4 rounded-full inline-flex mb-4"
                >
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Assignment Submitted!
                </h3>
                <p className="text-gray-600 mb-6">
                  Your work has been submitted successfully and is under review.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSuccessPopup(false)}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Continue Learning
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm mb-6"
          >
            <Zap className="h-5 w-5 text-amber-500" />
            <span className="text-sm font-semibold text-gray-700">
              {assignments.length} Assignments Total
            </span>
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 to-indigo-700 bg-clip-text text-transparent pb-3 leading-tight">
            Your Assignments
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Track, submit, and monitor your academic progress across all courses
          </p>
        </motion.div>

        {/* Stats & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Total", value: assignments.length, icon: FileText, color: "blue" },
                { label: "Pending", value: assignments.filter(a => a.submissionStatus === "pending").length, icon: Clock, color: "amber" },
                { label: "Submitted", value: assignments.filter(a => a.submissionStatus === "submitted").length, icon: Upload, color: "green" },
                { label: "Graded", value: assignments.filter(a => a.submissionStatus === "graded").length, icon: Award, color: "purple" },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    whileHover={{ scale: 1.05 }}
                    className={`bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 rounded-xl p-4 text-center border border-${stat.color}-200`}
                  >
                    <Icon className={`h-8 w-8 text-${stat.color}-600 mx-auto mb-2`} />
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search assignments..."
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Course Filter */}
              {courses.length > 0 && (
                <select
                  className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                >
                  <option value="all">All Courses</option>
                  {courses.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              )}

              {/* Status Filter */}
              <select
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="submitted">Submitted</option>
                <option value="graded">Graded</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Assignment List */}
        <motion.div
          layout
          className="space-y-6"
        >
          <AnimatePresence mode="wait">
            {filteredAssignments.length > 0 ? (
              <motion.div
                key="assignments-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {filteredAssignments.map((assignment, idx) => {
                  const StatusIcon = getStatusIcon(assignment.submissionStatus || "pending");
                  const isGraded = assignment.submissionStatus === "graded";
                  
                  return (
                    <motion.div
                      key={assignment._id}
                      layout
                      initial={{ opacity: 0, y: 30, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: idx * 0.1, type: "spring" }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl border border-white/20 overflow-hidden transition-all duration-500"
                    >
                      {/* Header */}
                      <div className={`p-6 bg-gradient-to-r ${
                        isGraded ? "from-emerald-600 to-green-500" : 
                        assignment.submissionStatus === "submitted" ? "from-blue-600 to-indigo-500" : 
                        "from-amber-600 to-orange-500"
                      } text-white`}>
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <BookOpen className="h-5 w-5 opacity-90" />
                              <span className="text-sm opacity-90">
                                {assignment.courseTitle || "Unknown Course"}
                              </span>
                            </div>
                            <h3 className="text-xl font-bold">{assignment.title}</h3>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold border-2 ${getStatusColor(assignment.submissionStatus || "pending")}`}>
                              <StatusIcon className="h-3 w-3 inline mr-1" />
                              {assignment.submissionStatus?.toUpperCase() || "PENDING"}
                            </span>
                            {isGraded && assignment.grade && (
                              <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
                                {assignment.grade} pts
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-6">
                        <p className="text-gray-700 leading-relaxed">{assignment.description}</p>
                        
                        {/* Metadata */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          {assignment.batchName && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Users className="h-4 w-4 text-purple-600" />
                              <span>Batch: {assignment.batchName}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="h-4 w-4 text-indigo-600" />
                            <span>Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No deadline'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Award className="h-4 w-4 text-amber-600" />
                            <span>Max Points: {assignment.maxPoints}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <span>Created: {new Date(assignment.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Submission Section */}
                        {!isGraded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="pt-6 border-t border-gray-200"
                          >
                            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                              <Upload className="h-5 w-5 text-indigo-600" />
                              Submit Your Work
                            </h4>
                            <textarea
                              rows={4}
                              className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                              placeholder="Paste your submission link, write your answer, or describe your project..."
                              value={submissionData[assignment._id] || ""}
                              onChange={(e) =>
                                setSubmissionData({
                                  ...submissionData,
                                  [assignment._id]: e.target.value,
                                })
                              }
                            />
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleSubmit(assignment._id)}
                              disabled={!submissionData[assignment._id]}
                              className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 
                                bg-gradient-to-r from-indigo-600 to-purple-600 
                                text-white font-semibold rounded-xl shadow-lg 
                                hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Upload className="h-5 w-5" />
                              Submit Assignment
                            </motion.button>
                          </motion.div>
                        )}

                        {/* Graded Results */}
                        {isGraded && assignment.grade && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-200"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="font-semibold text-emerald-900">Assignment Graded</h5>
                                <p className="text-emerald-700 text-sm">Your work has been evaluated</p>
                              </div>
                              <div className="text-2xl font-bold text-emerald-600">
                                {assignment.grade}/{assignment.maxPoints}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* Hover Effect */}
                      <div className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-500/20 rounded-3xl pointer-events-none transition-all duration-500"></div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="no-assignments"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <FileText className="h-24 w-24 text-gray-300 mx-auto mb-6" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No assignments found
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  {searchTerm || filterStatus !== "all" || selectedCourseId !== "all" 
                    ? "Try adjusting your filters or search terms."
                    : "You're all caught up! New assignments will appear here."}
                </p>
                {(searchTerm || filterStatus !== "all" || selectedCourseId !== "all") && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSearchTerm("");
                      setFilterStatus("all");
                      setSelectedCourseId("all");
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    Show All Assignments
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Assignments;