import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { courseAPI } from "../../services/api";
import { 
  BookOpen, Clock, Users, Star, Search, Filter, 
  X, Zap, Bookmark, Eye, Award,
  PlayCircle, Shield, Globe, Rocket,
  Phone,
  BrainCog,
  TrendingUp
} from "lucide-react";
import { Course } from "../../types";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { FaMobile } from "react-icons/fa";
import SEO, { pageSEOConfig } from "../../components/common/SEO";

const CourseCatalog: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ 
    category: "", 
    level: "", 
    search: "",
    sortBy: "popular"
  });
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<Array<{ name: string; icon: any; color: string }>>([]);

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, allCourses]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseAPI.getAllCourses();
      setAllCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch categories from the API and map them to icons/colors.
   * Falls back to default categories if the API call fails.
   */
  const fetchCategories = async () => {
    try {
      const response = await courseAPI.getCategories();
      const fetchedCategories = response.data;
      
      // Map categories to icons and colors with predefined mappings
      const categoryIconMap: Record<string, { icon: any; color: string }> = {
        "Web Development": { icon: Globe, color: "blue" },
        "Data Science": { icon: TrendingUp, color: "green" },
        "Mobile Development": { icon: FaMobile, color: "purple" },
        "DevOps": { icon: Rocket, color: "orange" },
        "AI/ML": { icon: BrainCog, color: "pink" },
        "Cyber Security": { icon: Shield, color: "red" },
      };
      
      // Create dynamic categories array with fallback icons for unknown categories
      const dynamicCategories = fetchedCategories.map((categoryName: string) => {
        const mapping = categoryIconMap[categoryName];
        return {
          name: categoryName,
          icon: mapping?.icon || BookOpen, // Fallback icon for unknown categories
          color: mapping?.color || "indigo", // Fallback color for unknown categories
        };
      });
      
      setCategories(dynamicCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Fallback to default categories if API fails to ensure UI still works
      setCategories([
        { name: "Web Development", icon: Globe, color: "blue" },
        { name: "Data Science", icon: TrendingUp, color: "green" },
        { name: "Mobile Development", icon: FaMobile, color: "purple" },
        { name: "DevOps", icon: Rocket, color: "orange" },
        { name: "AI/ML", icon: BrainCog, color: "pink" },
        { name: "Cyber Security", icon: Shield, color: "red" }
      ]);
    }
  };

  const applyFilters = () => {
    let filtered = [...allCourses];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter((c) =>
        c.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        c.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter((c) => c.category === filters.category);
    }

    // Level filter
    if (filters.level) {
      filtered = filtered.filter((c) => c.level === filters.level);
    }

    // Sort courses
    switch (filters.sortBy) {
      case "rating":
        filtered.sort((a, b) => b.rating.average - a.rating.average);
        break;
      case "duration":
        filtered.sort((a, b) => b.totalDuration - a.totalDuration);
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      default: // popular
        filtered.sort((a, b) => b.enrollmentCount - a.enrollmentCount);
    }

    setCourses(filtered);
  };

  const levels = [
    { name: "beginner", label: "Beginner", color: "emerald" },
    { name: "intermediate", label: "Intermediate", color: "amber" },
    { name: "advanced", label: "Advanced", color: "rose" }
  ];

  const sortOptions = [
    { value: "popular", label: "Most Popular" },
    { value: "rating", label: "Highest Rated" },
    { value: "duration", label: "Longest Duration" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" }
  ];

  // Mock Smartphone and Brain icons since they're not in Lucide
  const Smartphone = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );

  const Brain = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center"
        >
          <motion.div
            animate={{ 
              y: [-20, 0, -20]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <img 
              src="/logo.webp" 
              alt="RAAS Academy" 
              className="h-24 w-24 object-contain"
            />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-lg font-medium text-gray-600"
          >
            Discovering amazing courses...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <SEO {...pageSEOConfig.courses} />
      <Navbar />
      
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-r from-blue-400/5 to-purple-400/5 pointer-events-none"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm mb-6"
          >
            <Zap className="h-5 w-5 text-amber-500" />
            <span className="text-sm font-semibold text-gray-700">
              {allCourses.length}+ Courses Available
            </span>
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 to-indigo-700 bg-clip-text text-transparent mb-4">
            Master New Skills
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover courses designed by industry experts to advance your career and unlock new opportunities
          </p>
          
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 max-w-2xl mx-auto relative"
          >
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses, topics, or instructors..."
              className="w-full pl-12 pr-6 py-4 bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </motion.div>
        </motion.div>

        {/* Filters & Sort Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Filter className="h-6 w-6 text-indigo-600" />
                <h2 className="text-2xl font-bold text-gray-900">Filter Courses</h2>
                <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
                  {courses.length} courses
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </button>
              </div>
            </div>

            {/* Category Filters */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isActive = filters.category === category.name;
                  return (
                    <motion.button
                      key={category.name}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFilters({ ...filters, category: isActive ? "" : category.name, level: "" })}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        isActive
                          ? `border-${category.color}-500 bg-${category.color}-50 shadow-lg`
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <Icon className={`h-6 w-6 mb-2 mx-auto ${
                        isActive ? `text-${category.color}-600` : "text-gray-400"
                      }`} />
                      <span className={`text-sm font-medium ${
                        isActive ? `text-${category.color}-700` : "text-gray-600"
                      }`}>
                        {category.name}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Level Filters - Only show when category is selected */}
            <AnimatePresence>
              {filters.category && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Difficulty Level</h3>
                  <div className="flex flex-wrap gap-3">
                    {levels.map((level) => {
                      const isActive = filters.level === level.name;
                      return (
                        <motion.button
                          key={level.name}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setFilters({ ...filters, level: isActive ? "" : level.name })}
                          className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                            isActive
                              ? `bg-${level.color}-500 text-white shadow-lg`
                              : `bg-${level.color}-100 text-${level.color}-700 hover:bg-${level.color}-200`
                          }`}
                        >
                          {level.label}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Active Filters */}
            {(filters.category || filters.level || filters.search) && (
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <span className="text-sm font-medium text-gray-600">Active filters:</span>
                <div className="flex flex-wrap gap-2">
                  {filters.search && (
                    <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      Search: "{filters.search}"
                      <button onClick={() => setFilters({ ...filters, search: "" })}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {filters.category && (
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      {filters.category}
                      <button onClick={() => setFilters({ ...filters, category: "", level: "" })}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {filters.level && (
                    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
                      {filters.level}
                      <button onClick={() => setFilters({ ...filters, level: "" })}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={() => setFilters({ category: "", level: "", search: "", sortBy: "popular" })}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Clear all
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Courses Grid */}
        <motion.div
          layout
          className="mb-16"
        >
          <AnimatePresence mode="wait">
            {courses.length > 0 ? (
              <motion.div
                key="courses-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {courses.map((course, idx) => (
                  <motion.div
                    key={course._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, type: "spring" }}
                    whileHover={{ scale: 1.03, y: -8 }}
                    className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
                  >
                    {/* Course Image/Thumbnail */}
                    <div className="relative h-48 overflow-hidden">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gradient-to-br from-indigo-500 to-purple-600">
                          <BookOpen className="h-16 w-16 text-white opacity-80" />
                        </div>
                      )}
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                      
                      {/* Level Badge */}
                      <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white ${
                        course.level === "beginner" ? "bg-emerald-500" :
                        course.level === "intermediate" ? "bg-amber-500" : "bg-rose-500"
                      }`}>
                        {course.level}
                      </span>
                      
                      {/* Enrollment Count */}
                      <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded-full text-xs font-medium">
                        👥 {course.enrollmentCount}+ enrolled
                      </div>
                    </div>

                    {/* Course Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 flex-1">
                          {course.title}
                        </h3>
                        <Bookmark className="h-5 w-5 text-gray-400 hover:text-amber-500 cursor-pointer transition-colors" />
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {course.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {Math.round(course.totalDuration / 60)}h
                          </span>
                          <span className="flex items-center gap-1">
                            <PlayCircle className="h-4 w-4" />
                            {course.modules?.length || 12} modules
                          </span>
                        </div>
                        <span className="flex items-center gap-1 font-semibold">
                          <Star className="h-4 w-4 text-amber-400" />
                          {course.rating.average.toFixed(1)}
                        </span>
                      </div>

                      {/* Instructor & Price */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs text-gray-500">
                          By {course.instructor?.name || "Industry Expert"}
                        </span>
                        <span className="text-2xl font-bold text-indigo-600">
                          ₹{course.price}
                        </span>
                      </div>

                      {/* Action Button */}
                      <Link
                        to={`/courses/${course._id}`}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 group-hover:scale-105"
                      >
                        <Eye className="h-4 w-4" />
                        View Course Details
                      </Link>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-500/30 rounded-3xl pointer-events-none transition-all duration-500"></div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="no-courses"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center py-20"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Search className="h-24 w-24 text-gray-300 mx-auto mb-6" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No courses found
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  We couldn't find any courses matching your criteria. Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={() => setFilters({ category: "", level: "", search: "", sortBy: "popular" })}
                  className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition-colors"
                >
                  Show All Courses
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CourseCatalog;