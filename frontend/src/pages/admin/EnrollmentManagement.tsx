import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { enrollmentFormAPI, courseAPI, batchAPI, enrollmentAPI } from "../../services/api";
import { Course } from "../../types";
import { 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  IndianRupee,
  Download,
  Ban
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const EnrollmentManagement: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [batches, setBatches] = useState<any[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string>("all");
  const [forms, setForms] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedForm, setSelectedForm] = useState<any>(null);
  const [showFormDetails, setShowFormDetails] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (courses.length > 0) {
      if (selectedCourse) {
        fetchEnrollmentForms(selectedCourse);
        fetchCourseBatches(selectedCourse);
        fetchCourseEnrollments(selectedCourse);
      } else {
        fetchAllEnrollmentForms();
        setBatches([]);
        setSelectedBatch("all");
        setEnrollments([]);
      }
    }
  }, [selectedCourse, courses]);

  const fetchCourseBatches = async (courseId: string) => {
    try {
      const res = await batchAPI.getCourseBatches(courseId);
      setBatches(res.data || []);
    } catch (error) {
      console.error("Error fetching batches:", error);
      setBatches([]);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await courseAPI.getAllCourses();
      setCourses(res.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchAllEnrollmentForms = async () => {
    setLoading(true);
    try {
      // Fetch forms for all courses
      const allForms: any[] = [];
      for (const course of courses) {
        try {
          const res = await enrollmentFormAPI.getCourseForms(course._id);
          allForms.push(...res.data.map((form: any) => ({ ...form, courseTitle: course.title })));
        } catch (error) {
          console.error(`Error fetching forms for course ${course._id}:`, error);
        }
      }
      setForms(allForms);
    } catch (error) {
      console.error("Error fetching all enrollment forms:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollmentForms = async (courseId: string) => {
    setLoading(true);
    try {
      const res = await enrollmentFormAPI.getCourseForms(courseId);
      const course = courses.find(c => c._id === courseId);
      setForms(res.data.map((form: any) => ({ ...form, courseTitle: course?.title || "Unknown Course" })));
    } catch (error) {
      console.error("Error fetching enrollment forms:", error);
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (formId: string, status: string) => {
    try {
      await enrollmentFormAPI.updatePaymentStatus(formId, status);
      // Refresh the forms
      if (selectedCourse) {
        fetchEnrollmentForms(selectedCourse);
        fetchCourseEnrollments(selectedCourse);
      } else {
        fetchAllEnrollmentForms();
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  const fetchCourseEnrollments = async (courseId: string) => {
    try {
      const res = await enrollmentAPI.getCourseEnrollments(courseId, selectedBatch !== "all" ? selectedBatch : undefined);
      setEnrollments(res.data || []);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      setEnrollments([]);
    }
  };

  const cancelEnrollment = async (enrollmentId: string, studentName: string) => {
    if (!confirm(`Are you sure you want to cancel enrollment for ${studentName}? This will immediately block their course access.`)) {
      return;
    }
    
    try {
      await enrollmentAPI.cancelEnrollment(enrollmentId);
      alert('Enrollment cancelled successfully');
      // Refresh enrollments
      if (selectedCourse) {
        fetchCourseEnrollments(selectedCourse);
      }
    } catch (error: any) {
      console.error("Error cancelling enrollment:", error);
      alert(error.response?.data?.message || "Failed to cancel enrollment");
    }
  };

  const viewFormDetails = (form: any) => {
    console.log('Viewing form details:', form);
    setSelectedForm(form);
    setShowFormDetails(true);
  };

  const exportToCSV = () => {
    if (filteredForms.length === 0) return;
    
    // Create CSV content
    const headers = [
      "Student Name",
      "Email",
      "Mobile Number",
      "Student Status",
      "Prior Experience",
      "Experience Details",
      "Course",
      "Payment Status",
      "Submitted Date"
    ];
    
    const csvContent = [
      headers.join(","),
      ...filteredForms.map(form => [
        `"${form.fullName || form.name || 'Unknown Student'}"`,
        `"${form.email || ''}"`,
        `"${form.mobileNumber || ''}"`,
        `"${form.isStudent === 'yes' ? 'Student' : 'Non-student'}"`,
        `"${form.hasPriorExperience === 'yes' ? 'Yes' : 'No'}"`,
        `"${form.experienceDetails || ''}"`,
        `"${form.courseTitle || courses.find(c => c._id === form.course)?.title || 'Unknown Course'}"`,
        `"${form.paymentStatus || 'pending'}"`,
        `"${form.submittedAt ? new Date(form.submittedAt).toLocaleDateString() : ''}"`
      ].join(","))
    ].join("\n");
    
    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `enrollment_forms_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredForms = forms.filter(form => {
    if (!searchTerm && selectedBatch === "all") return true;
    
    // Search term filter
    const term = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || (
      (form.fullName && form.fullName.toLowerCase().includes(term)) ||
      (form.email && form.email.toLowerCase().includes(term)) ||
      (form.mobileNumber && form.mobileNumber.includes(term)) ||
      (form.courseTitle && form.courseTitle.toLowerCase().includes(term))
    );

    // Batch filter
    const matchesBatch =
      selectedBatch === "all" ||
      (selectedBatch === "no-batch" && !form.batch) ||
      (typeof form.batch === "object" && form.batch?._id === selectedBatch) ||
      (typeof form.batch === "string" && form.batch === selectedBatch);

    return matchesSearch && matchesBatch;
  });

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" /> Completed
        </span>;
      case "failed":
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="h-3 w-3 mr-1" /> Failed
        </span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="h-3 w-3 mr-1" /> Pending
        </span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Enrollment Management</h1>
          <p className="mt-2 text-gray-600">Manage course enrollment forms and payment status</p>
        </div>

        {/* Course Selection */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Course
              </label>
              <div className="relative">
                <select
                  id="course"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">All Courses</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>
                      {course.title.length > 30 ? `${course.title.substring(0, 30)}...` : course.title}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {selectedCourse && batches.length > 0 && (
              <div>
                <label htmlFor="batch" className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Batch
                </label>
                <div className="relative">
                  <select
                    id="batch"
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="all">All Batches</option>
                    <option value="no-batch">No Batch</option>
                    {batches.map(batch => (
                      <option key={batch._id} value={batch._id}>
                        {batch.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Enrollments
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="search"
                  placeholder="Search by name, email, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-xs text-gray-400">{filteredForms.length} results</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Forms Table */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-medium text-gray-900">
              Enrollment Forms ({filteredForms.length})
            </h2>
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              {(selectedCourse || forms.length > 0) && (
                <div className="text-sm">
                  {selectedCourse 
                    ? <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-indigo-600 text-white shadow-lg">
                        Showing forms for: <span className="font-bold ml-2">{courses.find(c => c._id === selectedCourse)?.title || "Selected Course"}</span>
                      </span>
                    : <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-green-600 text-white shadow-lg">
                        Showing forms for: <span className="font-bold ml-2">All Courses</span>
                      </span>}
                </div>
              )}
              {filteredForms.length > 0 && (
                <button
                  onClick={exportToCSV}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredForms.length === 0 ? (
            <div className="text-center py-12">
              <Filter className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No enrollment forms</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm 
                  ? "No forms match your search." 
                  : selectedCourse 
                    ? "No one has enrolled in this course yet." 
                    : "No enrollment forms found."}
              </p>
            </div>
          ) : (
            <>
              {/* Mobile view - Card layout */}
              <div className="md:hidden">
                <div className="px-4 py-4 space-y-4">
                  {filteredForms.map((form) => (
                    <div key={form._id} className="border border-gray-200 rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{form.fullName || form.name || 'Unknown Student'}</div>
                            <div className="text-xs text-gray-500">
                              {form.isStudent === "yes" ? "Student" : "Non-student"}
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {getPaymentStatusBadge(form.paymentStatus)}
                        </div>
                      </div>
                      
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <div className="text-xs">
                          <div className="text-gray-500">Email</div>
                          <div className="text-gray-900 truncate">{form.email || 'No email'}</div>
                        </div>
                        <div className="text-xs">
                          <div className="text-gray-500">Phone</div>
                          <div className="text-gray-900 truncate">{form.mobileNumber || 'No phone'}</div>
                        </div>
                        <div className="text-xs">
                          <div className="text-gray-500">Course</div>
                          <div className="text-gray-900 truncate" title={form.courseTitle || courses.find(c => c._id === form.course)?.title || "Unknown Course"}>
                            {form.courseTitle || courses.find(c => c._id === form.course)?.title || "Unknown Course"}
                          </div>
                        </div>
                        <div className="text-xs">
                          <div className="text-gray-500">Experience</div>
                          <div className="text-gray-900">
                            {form.hasPriorExperience === "yes" ? "Yes" : "No"}
                          </div>
                        </div>
                        {form.hasPriorExperience === "yes" && (
                          <div className="text-xs col-span-2">
                            <div className="text-gray-500">Experience Details</div>
                            <div className="text-gray-900 truncate" title={form.experienceDetails}>
                              {form.experienceDetails || 'No details provided'}
                            </div>
                          </div>
                        )}
                        <div className="text-xs col-span-2">
                          <div className="text-gray-500">Submitted</div>
                          <div className="text-gray-900 flex items-center">
                            <Calendar className="flex-shrink-0 mr-1 h-4 w-4 text-gray-400" />
                            {new Date(form.submittedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex justify-between">
                        <button
                          onClick={() => viewFormDetails(form)}
                          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium flex items-center"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </button>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => updatePaymentStatus(form._id, "completed")}
                            className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50"
                            title="Mark as completed"
                            disabled={form.paymentStatus === "completed"}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => updatePaymentStatus(form._id, "failed")}
                            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                            title="Mark as failed"
                            disabled={form.paymentStatus === "failed"}
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Desktop view - Table layout */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Experience
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredForms.map((form) => (
                      <tr key={form._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-indigo-600" />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{form.fullName || form.name || 'Unknown Student'}</div>
                              <div className="text-xs text-gray-500">
                                {form.isStudent === "yes" ? "Student" : "Non-student"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <div className="flex items-center text-sm text-gray-900">
                              <Mail className="flex-shrink-0 mr-1 h-4 w-4 text-gray-400" />
                              <span className="truncate max-w-[100px]">{form.email || 'No email'}</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <Phone className="flex-shrink-0 mr-1 h-4 w-4 text-gray-400" />
                              <span className="truncate max-w-[100px]">{form.mobileNumber || 'No phone'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900 max-w-[120px] truncate" title={form.courseTitle || courses.find(c => c._id === form.course)?.title || "Unknown Course"}>
                            {form.courseTitle || courses.find(c => c._id === form.course)?.title || "Unknown Course"}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900">
                            {form.hasPriorExperience === "yes" ? "Yes" : "No"}
                          </div>
                          {form.hasPriorExperience === "yes" && (
                            <div className="text-xs text-gray-500 truncate max-w-[80px]" title={form.experienceDetails}>
                              {form.experienceDetails}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {getPaymentStatusBadge(form.paymentStatus)}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="flex-shrink-0 mr-1 h-4 w-4 text-gray-400" />
                            <span className="truncate max-w-[70px]">{new Date(form.submittedAt).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">
                          <div className="flex space-x-1">
                            <button
                              onClick={() => viewFormDetails(form)}
                              className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => updatePaymentStatus(form._id, "completed")}
                              className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50"
                              title="Mark as completed"
                              disabled={form.paymentStatus === "completed"}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => updatePaymentStatus(form._id, "failed")}
                              className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                              title="Mark as failed"
                              disabled={form.paymentStatus === "failed"}
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Active Enrollments Section */}
      {selectedCourse && enrollments.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Active Enrollments ({enrollments.length})
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Students currently enrolled in this course
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Batch
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Enrolled Date
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enrollments.map((enrollment) => (
                    <tr key={enrollment._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-indigo-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {enrollment.student?.name || 'Unknown Student'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {enrollment.student?.email || 'No email'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {enrollment.batch?.name || 'No batch'}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="flex-shrink-0 mr-1 h-4 w-4 text-gray-400" />
                          {new Date(enrollment.enrolledAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-indigo-600 h-2 rounded-full" 
                              style={{ width: `${enrollment.completionPercentage || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600">{enrollment.completionPercentage || 0}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {enrollment.paymentStatus === 'completed' ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" /> Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Clock className="h-3 w-3 mr-1" /> Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">
                        <button
                          onClick={() => cancelEnrollment(enrollment._id, enrollment.student?.name || 'this student')}
                          className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-xs font-medium"
                          title="Cancel enrollment and block access"
                        >
                          <Ban className="h-3.5 w-3.5 mr-1" />
                          Cancel Enrollment
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Form Details Modal */}
      {showFormDetails && selectedForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Enrollment Form Details</h2>
              <button 
                onClick={() => setShowFormDetails(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Student Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Full Name</p>
                      <p className="text-sm text-gray-900">{selectedForm.fullName || 'Unknown Student'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-sm text-gray-900">{selectedForm.email || 'No email provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Mobile Number</p>
                      <p className="text-sm text-gray-900">{selectedForm.mobileNumber || 'No phone provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Current Student</p>
                      <p className="text-sm text-gray-900">
                        {selectedForm.isStudent === "yes" ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Enrollment Details</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Payment Status</p>
                      <div className="mt-1">
                        {getPaymentStatusBadge(selectedForm.paymentStatus)}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Submitted Date</p>
                      <p className="text-sm text-gray-900">
                        {new Date(selectedForm.submittedAt).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Course</p>
                      <p className="text-sm text-gray-900">
                        {selectedForm.courseTitle || courses.find(c => c._id === selectedForm.course)?.title || "Unknown Course"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Experience Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Prior Experience</p>
                      <p className="text-sm text-gray-900">
                        {selectedForm.hasPriorExperience === "yes" ? "Yes" : "No"}
                      </p>
                    </div>
                    {selectedForm.hasPriorExperience === "yes" && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Experience Details</p>
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">
                          {selectedForm.experienceDetails}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowFormDetails(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Close
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => updatePaymentStatus(selectedForm._id, "completed")}
                    disabled={selectedForm.paymentStatus === "completed"}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedForm.paymentStatus === "completed"
                        ? "bg-green-100 text-green-700 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    <CheckCircle className="h-4 w-4 inline mr-1" />
                    Mark as Completed
                  </button>
                  <button
                    onClick={() => updatePaymentStatus(selectedForm._id, "failed")}
                    disabled={selectedForm.paymentStatus === "failed"}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedForm.paymentStatus === "failed"
                        ? "bg-red-100 text-red-700 cursor-not-allowed"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  >
                    <XCircle className="h-4 w-4 inline mr-1" />
                    Mark as Failed
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default EnrollmentManagement;