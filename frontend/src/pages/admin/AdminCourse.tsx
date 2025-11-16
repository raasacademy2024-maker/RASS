// src/pages/admin/ManageCourses.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { courseAPI } from "../../services/api";

interface Module {
  _id?: string;
  title: string;
  description?: string;
  videoUrl?: string;
  duration?: number;
  order: number;
  resources?: Array<{
    title: string;
    url: string;
    type: string;
  }>;
}

interface Section {
  subtitle: string;
  description: string;
}

interface CurriculumItem {
  _id?: string;
  order: number;
  logoUrl?: string;
  title: string;
  sections: Section[];
}

interface Course {
  _id?: string;
  title: string;
  description: string;
  about?: string;
  instructor?: string;
  category: string;
  price: number;
  thumbnail?: string;
  modules: Module[];
  curriculum: CurriculumItem[];
  features?: string[];
  techStack?: Array<{
    name: string;
    imageUrl: string;
  }>;
  skillsGained?: string[];
  jobRoles?: string[];
  testimonials?: Array<{
    name: string;
    imageUrl: string;
    description: string;
  }>;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  totalDuration?: number;
  enrollmentCount?: number;
  rating?: {
    average: number;
    count: number;
  };
  slug?: string;
  isPublished?: boolean;
  tags?: string[];
  requirements?: string[];
  learningOutcomes?: string[];
  createdAt?: string;
}

const ManageCourses: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [formData, setFormData] = useState<Partial<Course>>({
    title: "",
    description: "",
    about: "",
    category: "",
    price: 0,
    thumbnail: "",
    isPublished: true,
    tags: [],
    requirements: [""],
    learningOutcomes: [""],
    curriculum: [],
    features: [],
    techStack: [],
    skillsGained: [],
    jobRoles: [],
    testimonials: [],
    faqs: [],
  });

  const [moduleData, setModuleData] = useState<Partial<Module>>({
    title: "",
    description: "",
    duration: 0,
    order: 1,
    videoUrl: "",
  });

  /* -------------------- Fetch Courses -------------------- */
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res =
        user?.role === "admin"
          ? await courseAPI.getAllCourses(searchTerm)
          : await courseAPI.getInstructorCourses?.();
      setCourses(res.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [searchTerm]);

  /* -------------------- Course CRUD -------------------- */
  const handleCreateOrUpdateCourse = async () => {
    try {
      if (selectedCourse?._id) {
        // Update existing course with all fields
        await courseAPI.updateCourse(selectedCourse._id, formData);
      } else {
        // Create new course
        await courseAPI.createCourse({ ...formData, instructor: user?._id });
      }
      setShowModal(false);
      fetchCourses();
      resetForm();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      await courseAPI.deleteCourse(id);
      fetchCourses();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleTogglePublish = async (course: Course) => {
    try {
      await courseAPI.updateCourse(course._id!, { 
        isPublished: !course.isPublished 
      });
      fetchCourses();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const resetForm = () => {
    setSelectedCourse(null);
    setFormData({
      title: "",
      description: "",
      about: "",
      category: "",
      price: 0,
      thumbnail: "",
      isPublished: true,
      tags: [],
      requirements: [""],
      learningOutcomes: [""],
      curriculum: [],
      // Reset all fields
      features: [],
      techStack: [],
      skillsGained: [],
      jobRoles: [],
      testimonials: [],
      faqs: [],
    });
  };

  /* -------------------- Module CRUD -------------------- */
  const handleAddOrUpdateModule = async () => {
    if (!selectedCourse?._id) return;
    try {
      if (editingModule?._id) {
        await courseAPI.updateModule(selectedCourse._id, editingModule._id, moduleData);
      } else {
        await courseAPI.createModule(selectedCourse._id, moduleData);
      }
      fetchCourses();
      setShowModuleModal(false);
      setModuleData({ title: "", order: 1, duration: 0 });
      setEditingModule(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteModule = async (courseId: string, moduleId: string) => {
    if (!confirm("Delete this module?")) return;
    try {
      await courseAPI.deleteModule(courseId, moduleId);
      fetchCourses();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const openModuleModal = (course: Course, module?: Module) => {
    setSelectedCourse(course);
    if (module) {
      setEditingModule(module);
      setModuleData(module);
    } else {
      setEditingModule(null);
      setModuleData({ 
        title: "", 
        description: "", 
        duration: 0, 
        order: (course.modules?.length || 0) + 1,
        videoUrl: ""
      });
    }
    setShowModuleModal(true);
  };

  const handleArrayInput = (field: keyof Course, value: string, index: number) => {
    const currentArray = [...(formData[field] as string[] || [])];
    currentArray[index] = value;
    setFormData({ ...formData, [field]: currentArray });
  };

  const addArrayField = (field: keyof Course) => {
    const currentArray = [...(formData[field] as string[] || [])];
    setFormData({ ...formData, [field]: [...currentArray, ""] });
  };

  const removeArrayField = (field: keyof Course, index: number) => {
    const currentArray = [...(formData[field] as string[] || [])];
    currentArray.splice(index, 1);
    setFormData({ ...formData, [field]: currentArray });
  };

  // Helper functions for managing complex array fields
  const handleComplexArrayInput = (field: keyof Course, index: number, property: string, value: any) => {
    const currentArray = [...(formData[field] as any[] || [])];
    currentArray[index] = { ...currentArray[index], [property]: value };
    setFormData({ ...formData, [field]: currentArray });
  };

  const addComplexArrayField = (field: keyof Course, defaultValue: any) => {
    const currentArray = [...(formData[field] as any[] || [])];
    setFormData({ ...formData, [field]: [...currentArray, defaultValue] });
  };

  const removeComplexArrayField = (field: keyof Course, index: number) => {
    const currentArray = [...(formData[field] as any[] || [])];
    currentArray.splice(index, 1);
    setFormData({ ...formData, [field]: currentArray });
  };

  // Helper functions for managing curriculum
  const handleCurriculumInput = (index: number, field: keyof CurriculumItem, value: any) => {
    const currentArray = [...(formData.curriculum as CurriculumItem[] || [])];
    currentArray[index] = { ...currentArray[index], [field]: value };
    setFormData({ ...formData, curriculum: currentArray });
  };

  const handleSectionInput = (curriculumIndex: number, sectionIndex: number, field: keyof Section, value: string) => {
    const currentArray = [...(formData.curriculum as CurriculumItem[] || [])];
    const sections = [...(currentArray[curriculumIndex].sections || [])];
    sections[sectionIndex] = { ...sections[sectionIndex], [field]: value };
    currentArray[curriculumIndex] = { ...currentArray[curriculumIndex], sections };
    setFormData({ ...formData, curriculum: currentArray });
  };

  const addCurriculumItem = () => {
    const currentArray = [...(formData.curriculum as CurriculumItem[] || [])];
    setFormData({ 
      ...formData, 
      curriculum: [
        ...currentArray, 
        { order: currentArray.length + 1, title: "", sections: [{ subtitle: "", description: "" }] }
      ] 
    });
  };

  const removeCurriculumItem = (index: number) => {
    const currentArray = [...(formData.curriculum as CurriculumItem[] || [])];
    currentArray.splice(index, 1);
    setFormData({ ...formData, curriculum: currentArray });
  };

  const addSection = (curriculumIndex: number) => {
    const currentArray = [...(formData.curriculum as CurriculumItem[] || [])];
    const sections = [...(currentArray[curriculumIndex].sections || [])];
    sections.push({ subtitle: "", description: "" });
    currentArray[curriculumIndex] = { ...currentArray[curriculumIndex], sections };
    setFormData({ ...formData, curriculum: currentArray });
  };

  const removeSection = (curriculumIndex: number, sectionIndex: number) => {
    const currentArray = [...(formData.curriculum as CurriculumItem[] || [])];
    const sections = [...(currentArray[curriculumIndex].sections || [])];
    sections.splice(sectionIndex, 1);
    currentArray[curriculumIndex] = { ...currentArray[curriculumIndex], sections };
    setFormData({ ...formData, curriculum: currentArray });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Manage Courses
              </h1>
              <p className="text-gray-600">
                {user?.role === "admin" 
                  ? "Manage all courses in the platform" 
                  : "Manage your created courses"
                }
              </p>
            </div>
            <button
              onClick={() => window.location.href = "/admin/add-course"}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Course
            </button>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 max-w-md">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent border-none focus:outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 text-red-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden group"
            >
              {/* Course Image */}
              <div className="relative overflow-hidden">
                <img
                  src={course.thumbnail || "https://via.placeholder.com/400x200?text=Course+Thumbnail"}
                  alt={course.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    course.isPublished 
                      ? "bg-green-100 text-green-800" 
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {course.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-2 flex-1">
                    {course.title}
                  </h3>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span>{course.category}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span>₹{course.price}</span>
                  </div>

                  {course.rating && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span>{course.rating.average.toFixed(1)} ({course.rating.count} reviews)</span>
                    </div>
                  )}

                  {course.enrollmentCount && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span>{course.enrollmentCount} enrolled</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={() => handleTogglePublish(course)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      course.isPublished
                        ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    {course.isPublished ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCourse(course);
                      // Populate all fields for editing
                      setFormData({
                        title: course.title,
                        description: course.description,
                        about: course.about,
                        category: course.category,
                        price: course.price,
                        thumbnail: course.thumbnail,
                        isPublished: course.isPublished,
                        tags: course.tags || [],
                        requirements: course.requirements || [""],
                        learningOutcomes: course.learningOutcomes || [""],
                        features: course.features || [],
                        techStack: course.techStack || [],
                        skillsGained: course.skillsGained || [],
                        jobRoles: course.jobRoles || [],
                        testimonials: course.testimonials || [],
                        faqs: course.faqs || [],
                        curriculum: course.curriculum || [],
                      });
                      setShowModal(true);
                    }}
                    className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course._id!)}
                    className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>

                {/* Modules Section */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">Modules ({course.modules?.length || 0})</h4>
                    <button
                      onClick={() => openModuleModal(course)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Module
                    </button>
                  </div>

                  {course.modules && course.modules.length > 0 ? (
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {course.modules
                        .sort((a, b) => a.order - b.order)
                        .map((module) => (
                        <div
                          key={module._id}
                          className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors group/module"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded">
                                {module.order}
                              </span>
                              <span className="text-sm font-medium text-gray-900 truncate">
                                {module.title}
                              </span>
                            </div>
                            {module.duration && (
                              <span className="text-xs text-gray-500">
                                {module.duration} min
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover/module:opacity-100 transition-opacity">
                            <button
                              onClick={() => openModuleModal(course, module)}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteModule(course._id!, module._id!)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm text-center py-2">
                      No modules added yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {courses.length === 0 && !loading && (
          <div className="text-center py-12">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first course</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Course
            </button>
          </div>
        )}
      </div>

      {/* Course Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCourse ? "Edit Course" : "Create New Course"}
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information Section */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Title *
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter course title"
                      value={formData.title || ""}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Web Development"
                      value={formData.category || ""}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                      value={formData.price || 0}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thumbnail URL
                    </label>
                    <input
                      type="url"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/thumbnail.jpg"
                      value={formData.thumbnail || ""}
                      onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.isPublished ? "published" : "draft"}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.value === "published" })}
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                    placeholder="Describe your course..."
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    About
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                    placeholder="About this course..."
                    value={formData.about || ""}
                    onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  />
                </div>
              </div>

              {/* Features Section */}
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Course Features</h2>
                  <button
                    type="button"
                    onClick={() => addArrayField("features")}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Feature
                  </button>
                </div>
                <div className="space-y-2">
                  {(formData.features || [""]).map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Lifetime access"
                        value={feature}
                        onChange={(e) => handleArrayInput("features", e.target.value, index)}
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayField("features", index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements Section */}
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Requirements</h2>
                  <button
                    type="button"
                    onClick={() => addArrayField("requirements")}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Requirement
                  </button>
                </div>
                <div className="space-y-2">
                  {(formData.requirements || [""]).map((requirement, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Basic HTML knowledge"
                        value={requirement}
                        onChange={(e) => handleArrayInput("requirements", e.target.value, index)}
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayField("requirements", index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Learning Outcomes */}
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Learning Outcomes</h2>
                  <button
                    type="button"
                    onClick={() => addArrayField("learningOutcomes")}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Learning Outcome
                  </button>
                </div>
                <div className="space-y-2">
                  {(formData.learningOutcomes || [""]).map((outcome, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="What will students learn?"
                        value={outcome}
                        onChange={(e) => handleArrayInput("learningOutcomes", e.target.value, index)}
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayField("learningOutcomes", index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Gained */}
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Skills Gained</h2>
                  <button
                    type="button"
                    onClick={() => addArrayField("skillsGained")}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Skill
                  </button>
                </div>
                <div className="space-y-2">
                  {(formData.skillsGained || [""]).map((skill, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., React Hooks"
                        value={skill}
                        onChange={(e) => handleArrayInput("skillsGained", e.target.value, index)}
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayField("skillsGained", index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Job Roles */}
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Job Roles</h2>
                  <button
                    type="button"
                    onClick={() => addArrayField("jobRoles")}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Job Role
                  </button>
                </div>
                <div className="space-y-2">
                  {(formData.jobRoles || []).map((role, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Add a job role..."
                        value={role || ""}
                        onChange={(e) => handleArrayInput("jobRoles", e.target.value, index)}
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayField("jobRoles", index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Tags</h2>
                  <button
                    type="button"
                    onClick={() => addArrayField("tags")}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Tag
                  </button>
                </div>
                <div className="space-y-2">
                  {(formData.tags || []).map((tag, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Add a tag..."
                        value={tag || ""}
                        onChange={(e) => handleArrayInput("tags", e.target.value, index)}
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayField("tags", index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Tech Stack</h2>
                  <button
                    type="button"
                    onClick={() => addComplexArrayField("techStack", { name: "", imageUrl: "" })}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Tech
                  </button>
                </div>
                <div className="space-y-3">
                  {(formData.techStack || []).map((tech, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                      <input
                        type="text"
                        className="col-span-2 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Technology name"
                        value={tech?.name || ""}
                        onChange={(e) => handleComplexArrayInput("techStack", index, "name", e.target.value)}
                      />
                      <input
                        type="url"
                        className="col-span-2 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Image URL"
                        value={tech?.imageUrl || ""}
                        onChange={(e) => handleComplexArrayInput("techStack", index, "imageUrl", e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => removeComplexArrayField("techStack", index)}
                        className="md:col-span-4 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Testimonials */}
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Testimonials</h2>
                  <button
                    type="button"
                    onClick={() => addComplexArrayField("testimonials", { name: "", imageUrl: "", description: "" })}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Testimonial
                  </button>
                </div>
                <div className="space-y-3">
                  {(formData.testimonials || []).map((testimonial, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                      <input
                        type="text"
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Name"
                        value={testimonial?.name || ""}
                        onChange={(e) => handleComplexArrayInput("testimonials", index, "name", e.target.value)}
                      />
                      <input
                        type="url"
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Image URL"
                        value={testimonial?.imageUrl || ""}
                        onChange={(e) => handleComplexArrayInput("testimonials", index, "imageUrl", e.target.value)}
                      />
                      <input
                        type="text"
                        className="md:col-span-2 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Description"
                        value={testimonial?.description || ""}
                        onChange={(e) => handleComplexArrayInput("testimonials", index, "description", e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => removeComplexArrayField("testimonials", index)}
                        className="md:col-span-4 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQs */}
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">FAQs</h2>
                  <button
                    type="button"
                    onClick={() => addComplexArrayField("faqs", { question: "", answer: "" })}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add FAQ
                  </button>
                </div>
                <div className="space-y-3">
                  {(formData.faqs || []).map((faq, index) => (
                    <div key={index} className="space-y-2">
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Question"
                        value={faq?.question || ""}
                        onChange={(e) => handleComplexArrayInput("faqs", index, "question", e.target.value)}
                      />
                      <textarea
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Answer"
                        value={faq?.answer || ""}
                        onChange={(e) => handleComplexArrayInput("faqs", index, "answer", e.target.value)}
                        rows={2}
                      />
                      <button
                        type="button"
                        onClick={() => removeComplexArrayField("faqs", index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Remove FAQ
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Curriculum */}
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Curriculum</h2>
                  <button
                    type="button"
                    onClick={addCurriculumItem}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Curriculum Item
                  </button>
                </div>
                <div className="space-y-4">
                  {(formData.curriculum || []).map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium text-gray-900">Curriculum Item {index + 1}</h3>
                        <button
                          type="button"
                          onClick={() => removeCurriculumItem(index)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <input
                          type="number"
                          placeholder="Order"
                          value={item.order || ''}
                          onChange={(e) => handleCurriculumInput(index, 'order', parseInt(e.target.value) || 0)}
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Title"
                          value={item.title || ''}
                          onChange={(e) => handleCurriculumInput(index, 'title', e.target.value)}
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <input
                          type="url"
                          placeholder="Logo URL (optional)"
                          value={item.logoUrl || ''}
                          onChange={(e) => handleCurriculumInput(index, 'logoUrl', e.target.value)}
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-700">Sections</h4>
                        {item.sections?.map((section, sectionIndex) => (
                          <div key={sectionIndex} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                            <input
                              type="text"
                              placeholder="Subtitle"
                              value={section.subtitle || ''}
                              onChange={(e) => handleSectionInput(index, sectionIndex, 'subtitle', e.target.value)}
                              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm"
                            />
                            <textarea
                              placeholder="Description"
                              value={section.description || ''}
                              onChange={(e) => handleSectionInput(index, sectionIndex, 'description', e.target.value)}
                              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm"
                              rows={2}
                            />
                            <button
                              type="button"
                              onClick={() => removeSection(index, sectionIndex)}
                              className="text-red-600 hover:text-red-800 self-start"
                            >
                              Remove Section
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addSection(index)}
                          className="text-indigo-600 hover:text-indigo-800 text-sm"
                        >
                          + Add Section
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOrUpdateCourse}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {selectedCourse ? "Update Course" : "Create Course"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Module Modal */}
      {showModuleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingModule ? "Edit Module" : "Add Module"}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {selectedCourse?.title}
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Module Title *
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter module title"
                  value={moduleData.title || ""}
                  onChange={(e) => setModuleData({ ...moduleData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20"
                  placeholder="Module description..."
                  value={moduleData.description || ""}
                  onChange={(e) => setModuleData({ ...moduleData, description: e.target.value })}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                    value={moduleData.duration || ""}
                    onChange={(e) => setModuleData({ ...moduleData, duration: parseFloat(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order
                  </label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1"
                    value={moduleData.order || 1}
                    onChange={(e) => setModuleData({ ...moduleData, order: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video URL
                </label>
                <input
                  type="url"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/video.mp4"
                  value={moduleData.videoUrl || ""}
                  onChange={(e) => setModuleData({ ...moduleData, videoUrl: e.target.value })}
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModuleModal(false);
                  setEditingModule(null);
                  setModuleData({ title: "", order: 1, duration: 0 });
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrUpdateModule}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                {editingModule ? "Update Module" : "Add Module"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCourses;