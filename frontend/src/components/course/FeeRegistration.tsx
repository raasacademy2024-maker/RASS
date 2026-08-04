import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Award, BookOpen } from "lucide-react";
import { Course, Enrollment } from "../../types";

interface Props {
  course: Course;
  enrollment?: Enrollment | null;
  onEnroll?: () => Promise<void>;
  requestPending?: boolean;
}

const FeeRegistration: React.FC<Props> = ({ course, enrollment, onEnroll, requestPending }) => {
  const [enrolling, setEnrolling] = useState(false);

  const handleEnrollClick = async () => {
    // Do NOT bail out when logged out - onEnroll redirects to login.
    // Returning early here made the button silently do nothing.
    if (!onEnroll) return;
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

      <p className="text-indigo-100 mb-6">
        {course.price === 0
          ? "Free access to content, projects, and placement support."
          : "Lifetime access to content, projects, and placement support. Share your details and our team will contact you with the fee details."}
      </p>

      {/* Perks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-left mb-8">
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
          {enrolling
            ? "Please wait..."
            : requestPending
              ? "View Request Status"
              : course.price === 0
                ? "Enroll Now"
                : "Request Enrollment"}
        </button>
      )}

      {/* Guarantee */}
      
    </section>
  );
};

export default FeeRegistration;
