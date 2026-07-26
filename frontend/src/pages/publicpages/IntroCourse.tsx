import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { courseAPI } from "../../services/api";
import { BookOpen, Search } from "lucide-react";
import { Course } from "../../types";
import { resolveImageUrl } from "../../utils/imageUrl";


const IntroCourse: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: "", level: "", search: "" });

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const fetchCourses = async () => {
    try {
      const response = await courseAPI.getAllCourses(); // ✅ no args
      let allCourses: Course[] = response.data;

      // Apply frontend filters
      if (filters.search) {
        allCourses = allCourses.filter((c) =>
          c.title.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      if (filters.category) {
        allCourses = allCourses.filter((c) => c.category === filters.category);
      }
      if (filters.level) {
        allCourses = allCourses.filter((c) => c.level === filters.level);
      }

      setCourses(allCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["Web Development", "Data Science", "Mobile Development", "DevOps", "AI/ML"];
  const levels = ["beginner", "intermediate", "advanced"];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>

    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Hero Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Explore Our Courses
        </h1>
        <p className="mt-3 text-gray-600">
          Upskill with industry-aligned programs and real-world projects.
        </p>
        <div className="mt-6 max-w-xl mx-auto flex items-center border rounded-full shadow-sm overflow-hidden">
          <Search className="ml-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for a course..."
            className="flex-1 px-4 py-3 focus:outline-none"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
      </div>

      {/* Filters */}
<div className="mb-10 text-center">
  {/* Category Selection */}
  <h3 className="text-lg font-semibold text-gray-900 mb-3">Choose Category</h3>
  <div className="flex flex-wrap gap-3 justify-center mb-6">
    {categories.map((cat) => (
      <button
        key={cat}
        onClick={() =>
          setFilters({ ...filters, category: cat, level: "" }) // reset level on new category
        }
        className={`px-4 py-2 rounded-full text-sm font-medium transition ${
          filters.category === cat
            ? "bg-indigo-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        {cat}
      </button>
    ))}
    <button
      onClick={() => setFilters({ category: "", level: "", search: "" })}
      className="px-4 py-2 rounded-full text-sm bg-red-100 text-red-700 hover:bg-red-200"
    >
      Clear
    </button>
  </div>

  {/* Level Filter → only show after selecting a category */}
  {filters.category && (
    <>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        Select Level
      </h3>
      <div className="flex flex-wrap gap-3 justify-center">
        {levels.map((lvl) => (
          <button
            key={lvl}
            onClick={() => setFilters({ ...filters, level: lvl })}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filters.level === lvl
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
          </button>
        ))}
      </div>
    </>
  )}
</div>

      {/* Courses Grid */}
      {courses.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {courses.map((course, idx) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white shadow-md rounded-2xl overflow-hidden relative"
            >
              {/* Thumbnail */}
              <div className="aspect-video relative">
                {course.thumbnail ? (
                  <img
                    src={resolveImageUrl(course.thumbnail, 800)}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100">
                    <BookOpen className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      course.level === "beginner"
                        ? "bg-green-100 text-green-700"
                        : course.level === "intermediate"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {course.level}
                  </span>
                  <span className="font-bold text-indigo-600">₹{course.price}</span>
                </div>

                {/* Always-visible View Details Button */}
                <Link
                  to={`/courses/${course._id}`}
                  className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow hover:bg-indigo-700 transition"
                >
                  View Details →
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-16">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No courses found
          </h3>
          <p className="text-gray-600">Try adjusting your filters or search</p>
        </div>
      )}
    </div>
    </div>
  );
};

export default IntroCourse;
