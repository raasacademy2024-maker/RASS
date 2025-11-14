// frontend/src/pages/instructor/Students.tsx
import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Users,
  Award,
  Clock,
  MessageCircle,
  Search,
  Filter,
} from "lucide-react";
import {
  courseAPI,
  enrollmentAPI,
  assignmentAPI,
  batchAPI,
} from "../../services/api";
import { Course, Enrollment, Assignment } from "../../types";
import { motion } from "framer-motion";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const Students: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchCourseStudents();
      fetchCourseBatches();
    }
  }, [selectedCourse]);

  const fetchCourseBatches = async () => {
    if (!selectedCourse) return;
    try {
      const response = await batchAPI.getCourseBatches(selectedCourse._id);
      setBatches(response.data || []);
    } catch (error) {
      console.error("Error fetching batches:", error);
      setBatches([]);
    }
  };

  const getStudentName = (student: any) =>
    typeof student === "string" ? "Unknown Student" : student.name;

  const getStudentEmail = (student: any) =>
    typeof student === "string" ? "" : student.email || "";

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

  const fetchCourseStudents = async () => {
    if (!selectedCourse) return;

    try {
      const [enrollmentsRes, assignmentsRes] = await Promise.all([
        enrollmentAPI.getCourseEnrollments(selectedCourse._id),
        assignmentAPI.getCourseAssignments(selectedCourse._id),
      ]);

      const onlyStudents = (enrollmentsRes.data || []).filter((enr: any) => {
        const student = enr.student;
        if (!student) return false;
        if (typeof student === "string") return true;
        return !student.role || student.role === "student";
      });

      setEnrollments(onlyStudents);
      setAssignments(assignmentsRes.data || []);
    } catch (error) {
      console.error("Error fetching course students:", error);
    }
  };

  const filteredEnrollments = enrollments.filter((enr) => {
    const studentName =
      typeof enr.student === "object" ? enr.student?.name || "" : enr.student;

    const matchesSearch = studentName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "completed" && enr.completed) ||
      (filterStatus === "in-progress" && !enr.completed);

    const matchesBatch =
      selectedBatch === "all" ||
      (selectedBatch === "no-batch" && !enr.batch) ||
      (typeof enr.batch === "object" && enr.batch?._id === selectedBatch) ||
      (typeof enr.batch === "string" && enr.batch === selectedBatch);

    return matchesSearch && matchesStatus && matchesBatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center sm:text-left"
      >
        <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
        <p className="text-gray-600 mt-1">
          Track and manage your students&apos; progress
        </p>
      </motion.div>

      {/* Course Selector */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white shadow-md rounded-2xl p-4 mb-6 flex items-center space-x-4"
      >
        <BookOpen className="h-5 w-5 text-indigo-600" />
        <select
          className="flex-1 border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          value={selectedCourse?._id || ""}
          onChange={(e) => {
            const course = courses.find((c) => c._id === e.target.value);
            setSelectedCourse(course || null);
          }}
        >
          <option value="">Select a course</option>
          {courses.map((c) => {
            const studentCount = enrollments.filter((enr) => {
              const s = enr.student;
              if (!s) return false;
              if (typeof s === "string") return true;
              return !s.role || s.role === "student";
            }).length;
            return (
              <option key={c._id} value={c._id}>
                {c.title} 
              </option>
            );
          })}
        </select>
      </motion.div>

      {selectedCourse && (
        <>
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white shadow-md rounded-2xl p-4 mb-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between"
          >
            <div className="relative flex-1">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search students..."
                className="w-full border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Students</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              {batches.length > 0 && (
                <select
                  className="border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 min-w-[150px]"
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                >
                  <option value="all">All Batches</option>
                  <option value="no-batch">No Batch</option>
                  {batches.map((batch) => (
                    <option key={batch._id} value={batch._id}>
                      {batch.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </motion.div>

          {/* Students List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white shadow-md rounded-2xl p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Students in {selectedCourse.title}
              </h3>
              {selectedBatch !== "all" && (
                <div className="flex items-center gap-2 text-sm">
                  <Filter className="h-4 w-4 text-indigo-600" />
                  <span className="text-gray-600">
                    Filtered by:{" "}
                    <span className="font-semibold text-indigo-600">
                      {selectedBatch === "no-batch"
                        ? "No Batch"
                        : batches.find((b) => b._id === selectedBatch)?.name}
                    </span>
                  </span>
                </div>
              )}
            </div>

            {filteredEnrollments.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredEnrollments.map((enr, idx) => {
                  const student =
                    typeof enr.student === "object"
                      ? enr.student
                      : { _id: enr.student, name: "Unknown Student" };

                  return (
                    <motion.div
                      key={enr._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition bg-gray-50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                            <Users className="h-6 w-6 text-indigo-600" />
                          </div>
                          <div className="ml-4">
                            <h4 className="font-semibold text-gray-900">
                              {getStudentName(enr.student)}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {getStudentEmail(enr.student)}
                            </p>
                            {enr.batch && typeof enr.batch === 'object' && (
                              <p className="text-xs text-indigo-600 mt-1">
                                📅 Batch: {(enr.batch as any).name}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              enr.completed
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {enr.completed ? "Completed" : "In Progress"}
                          </span>
                          <p className="text-sm text-gray-600 mt-2">
                            {enr.completionPercentage}% Progress
                          </p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4 text-center text-sm">
                        <div>
                          <Clock className="h-4 w-4 text-gray-600 mx-auto mb-1" />
                          <p className="text-gray-700">
                            {Math.floor(
                              enr.progress.reduce(
                                (total, p) => total + p.watchTime,
                                0
                              ) / 3600
                            )}
                            h
                          </p>
                        </div>
                        <div>
                          <Award className="h-4 w-4 text-gray-600 mx-auto mb-1" />
                          <p className="text-gray-700">
                            {
                              assignments.filter((a) =>
                                a.submissions?.some((s) =>
                                  typeof s.student === "string"
                                    ? s.student === student._id
                                    : s.student?._id === student._id
                                )
                              ).length
                            }
                            /{assignments.length}
                          </p>
                        </div>
                        <div>
                          <MessageCircle className="h-4 w-4 text-gray-600 mx-auto mb-1" />
                          <p className="text-gray-700">2 days ago</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No students found
                </h3>
                <p className="text-gray-600">
                  No students match your current filters.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </div>
      <Footer />
    </div>
  );
};

export default Students;
