import { useState, useEffect } from "react";
import { Star, Clock, Users, BookOpen, Search, Filter, X, ChevronDown, Play } from "lucide-react";

const CourseShowcase = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [sortBy, setSortBy] = useState("popularity");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://rass1.onrender.com/api/courses");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setCourses(data.courses || data);
      setFilteredCourses(data.courses || data);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let results = courses;
    
    // Filter by search term
    if (searchTerm) {
      results = results.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filter by category
    if (selectedCategory !== "All") {
      results = results.filter(course => course.category === selectedCategory);
    }
    
    // Filter by level
    if (selectedLevel !== "All") {
      results = results.filter(course => course.level === selectedLevel);
    }
    
    // Sort results
    switch(sortBy) {
      case "price-low":
        results = [...results].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        results = [...results].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        results = [...results].sort((a, b) => b.rating.average - a.rating.average);
        break;
      case "popularity":
        results = [...results].sort((a, b) => b.enrollmentCount - a.enrollmentCount);
        break;
      default:
        break;
    }
    
    setFilteredCourses(results);
  }, [courses, searchTerm, selectedCategory, selectedLevel, sortBy]);

  // Extract unique categories and levels
  const categories = ["All", ...new Set(courses.map(course => course.category))];
  const levels = ["All", ...new Set(courses.map(course => course.level))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Certification Courses</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Courses</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={fetchCourses}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Certification Courses</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master in-demand tech skills with our comprehensive courses taught by industry experts
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search courses, topics, or keywords..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* Filter Toggle for Mobile */}
            <button 
              className="md:hidden flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 rounded-lg font-medium"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-5 w-5" />
              Filters
              {showFilters ? <X className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>

            {/* Sort */}
            <div className="flex-shrink-0">
              <select
                className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popularity">Sort by: Popularity</option>
                <option value="rating">Sort by: Highest Rating</option>
                <option value="price-low">Sort by: Price: Low to High</option>
                <option value="price-high">Sort by: Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Filters */}
          <div className={`mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${showFilters ? 'block' : 'hidden md:grid'}`}>
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Level Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                {levels.map(level => (
                  <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                  setSelectedLevel("All");
                }}
              >
                Clear all filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredCourses.length} of {courses.length} courses
          </p>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <h3 className="text-2xl font-medium text-gray-900 mb-4">No courses found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filter criteria to find more courses.
            </p>
            <button
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
                setSelectedLevel("All");
              }}
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map(course => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CourseCard = ({ course }) => {
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Course Image */}
      <div className="relative">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
          }}
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            course.level === "beginner" ? "bg-green-100 text-green-800" :
            course.level === "intermediate" ? "bg-yellow-100 text-yellow-800" :
            "bg-red-100 text-red-800"
          }`}>
            {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
          </span>
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white rounded-full p-3">
            <Play className="h-6 w-6 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-indigo-600">{course.category}</span>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-600 ml-1">
              {course.rating.average > 0 ? course.rating.average.toFixed(1) : "New"}
            </span>
            <span className="text-sm text-gray-500 ml-1">
              ({course.rating.count > 0 ? course.rating.count : "No"} ratings)
            </span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>

        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span className="flex items-center mr-4">
            <Clock className="h-4 w-4 mr-1" />
            {formatDuration(course.totalDuration)}
          </span>
          <span className="flex items-center mr-4">
            <BookOpen className="h-4 w-4 mr-1" />
            {course.modules.length} modules
          </span>
          <span className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {course.enrollmentCount} students
          </span>
        </div>

        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {course.tags.slice(0, 3).map(tag => (
              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-900">
            {formatPrice(course.price)}
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseShowcase;