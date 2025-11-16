import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Award, Play, BookOpen } from "lucide-react";
import { Course, Enrollment } from "../../types";
import { useAuth } from "../../context/AuthContext";

interface Props {
  course: Course;
  enrollment?: Enrollment | null;
  onEnroll?: () => Promise<void>;
}

const FeeRegistration: React.FC<Props> = ({ course, enrollment, onEnroll }) => {
  const { isAuthenticated } = useAuth();
  const [enrolling, setEnrolling] = useState(false);

  const handleEnrollClick = async () => {
    if (!isAuthenticated || !onEnroll) return;
    setEnrolling(true);
    try {
      await onEnroll();
    } catch (err) {
      console.error("Enroll error:", err);
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <section className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl shadow-lg text-white p-10 text-center">
      <h2 className="text-3xl font-bold mb-6">Course Fee & Registration</h2>

      <div className="text-5xl font-extrabold mb-4">
        {course.price === 0 ? "Free" : `₹${course.price}`}
      </div>
      <p className="text-indigo-100 mb-6">
        One-time payment. Lifetime access to content, projects, and placement
        support.
      </p>

      {/* Perks */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-left mb-8">
        <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center gap-2">
          <Play className="h-5 w-5" /> {course.modules?.length ?? 0} modules
        </div>
        <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5" /> Downloadable resources
        </div>
        <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center gap-2">
          <Award className="h-5 w-5" /> Certificate of completion
        </div>
      </div>

      {enrollment && enrollment.paymentStatus === "completed" ? (
        <Link
          to={`/learn/${course._id}`}
          className="inline-block px-8 py-3 bg-white text-indigo-700 rounded-lg font-semibold shadow hover:bg-gray-100 transition"
        >
          Go to Course
        </Link>
      ) : (
        <button
          onClick={handleEnrollClick}
          disabled={enrolling}
          className="px-8 py-3 bg-white text-indigo-700 rounded-lg font-semibold shadow hover:bg-gray-100 transition disabled:opacity-60"
        >
          {enrolling ? "Enrolling..." : "Enroll Now"}
        </button>
      )}

      {/* Guarantee */}
      
    </section>
  );
};

export default FeeRegistration;
