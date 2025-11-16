import React from "react";
import { motion } from "framer-motion";
import {
  Clock,
} from "lucide-react";
import { Enrollment } from "../../types"; // Import the Enrollment type

interface CourseHeroProps {
  course: {
    _id?: string;
    title: string;
    description: string;
    thumbnail?: string;
    category?: string;
    level?: string;
    price?: number;
    enrollmentCount?: number;
    rating?: { average: number; count: number };
    totalDuration?: number;
    tags?: string[];
  };
  enrollment?: Enrollment | null; // Use proper type instead of 'any'
  onEnroll?: () => void;
}

const CourseHero: React.FC<CourseHeroProps> = ({
  course,
  enrollment,
  onEnroll,
}) => {
  return (
    <section className="relative w-full bg-gray-50 py-16 px-6 lg:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
        {/* Left Content */}
        <motion.div
          className="col-span-2 space-y-6"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-4xl font-bold text-gray-900 leading-tight">
            {course.title}
          </h1>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {course.tags?.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className="text-gray-600 text-lg leading-relaxed">
            {course.description}
          </p>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Clock size={18} /> {course.totalDuration || 0} mins
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={onEnroll}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
            >
              {enrollment && enrollment.paymentStatus === "completed" ? "Continue Learning" : "Enroll Now"}
            </button>
          </div>
        </motion.div>

        {/* Right Card with Thumbnail Image - Filled to whole card */}
        <motion.div
          className="bg-white shadow-md rounded-2xl overflow-hidden border border-gray-100"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Thumbnail Image - Filled to whole card */}
          <div className="h-[400px] overflow-hidden">
            <img 
              src={course.thumbnail || "https://via.placeholder.com/400x400?text=Course+Thumbnail"} 
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CourseHero;