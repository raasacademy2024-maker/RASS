import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { courseAPI, enrollmentAPI, enrollmentFormAPI } from "../../services/api";
import { Course, Enrollment } from "../../types";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import SEO, { generateCourseSchema, generateBreadcrumbSchema } from "../../components/common/SEO";

// Components
import CourseHero from "../../components/course/CourseHero";
import CourseDetails from "../../components/course/CourseDetails";
import LearningOutcomes from "../../components/course/LearningOutcomes";
import CourseHighlights from "../../components/course/CourseHighlights";
import AdminCurriculum from "../../components/course/AdminCurriculum";
import ToolsTechnologies from "../../components/course/ToolsTechnologies";
import JobRoles from "../../components/course/JobRoles";
import AlumniSpeaks from "../../components/course/AlumniSpeaks";
import LearningJourney from "../../components/course/LearningJourney";
import CourseDescription from "../../components/course/CourseDescription";
import DreamCompanies from "../../components/course/DreamCompanies";
import FeeRegistration from "../../components/course/FeeRegistration";
import FAQSection from "../../components/course/FAQSection";
import EnrollmentForm from "../../components/course/EnrollmentForm";

// ✅ Import local assets
import googleLogo from "../../assets/companies/google.png";
import microsoftLogo from "../../assets/companies/microsoft.png";
import amazonLogo from "../../assets/companies/amazon.png";
import wiproLogo from "../../assets/companies/wipro.png";
import { ClientsSection } from "../publicpages/ClientSection";
import { resolveImageUrl } from "../../utils/imageUrl";

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  // Set once a paid-course request is recorded - our team then contacts the student.
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  // ✅ Section Refs
  const sectionRefs: Record<string, React.RefObject<HTMLDivElement>> = {
    hero: useRef(null),
    details: useRef(null),
    outcomes: useRef(null),
    highlights: useRef(null),
    curriculum: useRef(null),
    tools: useRef(null),
    jobs: useRef(null),
    instructor: useRef(null),
    alumni: useRef(null),
    journey: useRef(null),
    description: useRef(null),
    companies: useRef(null),
    fee: useRef(null),
    faq: useRef(null),
  };

  useEffect(() => {
    if (id) fetchCourseData();
  }, [id, isAuthenticated]);

  const fetchCourseData = async () => {
    try {
      const courseRes = await courseAPI.getCourse(id!);
      setCourse(courseRes.data);

      if (isAuthenticated) {
        try {
          const enrollmentsRes = await enrollmentAPI.getMyEnrollments();
          const userEnrollment = enrollmentsRes.data.find(
            (e: Enrollment) => e.course._id === id
          );
          setEnrollment(userEnrollment || null);
        } catch {
          setEnrollment(null);
        }
      }
    } catch (error) {
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated || !course) return;

    // If user is already enrolled and payment is completed, go directly to course
    if (enrollment && enrollment.paymentStatus === "completed") {
      navigate(`/learn/${course._id}`);
      return;
    }

    // Show enrollment form first
    setShowEnrollmentForm(true);
  };

  const handleEnrollmentFormSubmit = async (formData: any) => {
    if (!course) return;

    try {
      // Record the request. This is the lead our team follows up on.
      await enrollmentFormAPI.submitForm(formData);
      setShowEnrollmentForm(false);

      // Free courses still grant access immediately - there is nothing to collect.
      if (course.price === 0) {
        try {
          await enrollmentAPI.enrollInCourse(course._id, formData?.batchId || undefined);
          await fetchCourseData();
          navigate(`/learn/${course._id}`);
        } catch (error: any) {
          alert(
            "Failed to enroll in this free course: " +
              (error.response?.data?.message || error.message)
          );
        }
        return;
      }

      // Paid courses: payment is collected offline, so confirm and stop here.
      setRequestSubmitted(true);
    } catch (error: any) {
      console.error("Error submitting enrollment request:", error);
      alert(error.response?.data?.message || "Failed to submit your request. Please try again.");
      // Keep the form open so the details aren't lost
    }
  };

  const scrollToSection = (key: string) => {
  const ref = sectionRefs[key]?.current;
  if (ref) {
    const topOffset = 100; // height of sticky nav
    const elementPosition = ref.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - topOffset;
    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
  }
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Course not found.</p>
      </div>
    );
  }

  // 🔹 Fallbacks for missing fields
  const highlights = (course as any).highlights || [
    { title: "Hands-on Projects", desc: "Work on portfolio-ready projects." },
    { title: "Mentorship", desc: "Learn directly from industry experts." },
    { title: "Job Readiness", desc: "Resume building & mock interviews." },
  ];

  // Use the actual curriculum from the course or fallback to mapping from modules
  const curriculum = course.curriculum || course.modules?.map((module, index) => ({
    _id: module._id,
    order: index + 1,
    title: module.title,
    sections: [
      {
        subtitle: "Description",
        description: module.description || "No description available"
      },
      // Add more sections as needed
    ]
  })) || [];

  // Use the actual techStack from the course or fallback to default tools
  const tools = course.techStack || (course as any).tools || [
    { name: "React" },
    { name: "Node.js" },
    { name: "MongoDB" },
  ];

  // Use the actual jobRoles from the course
  const jobRoles = (course.jobRoles || [])
    .filter((role): role is string => role !== null && role !== undefined && typeof role === 'string' && role.trim() !== '')
    .map(role => ({ name: role })) || [];

  const testimonials =
    (course as any).testimonials?.map((t: any) => ({
      name: t.name,
      role: t.role || t.title || "Student",
      quote: t.quote || t.description || "",
      avatar: t.avatar || t.imageUrl || "",
    })) || [];

  const learningJourney = (course as any).learningJourney || [];

  const companies = (course as any).companies || [
    { name: "Google", logo: googleLogo },
    { name: "Microsoft", logo: microsoftLogo },
    { name: "Amazon", logo: amazonLogo },
    { name: "Wipro", logo: wiproLogo },
  ];

  const faqs = (course as any).faqs || [];

  // Generate dynamic SEO data for the course
  const META_DESCRIPTION_MAX_LENGTH = 155;
  const courseSEO = {
    title: `${course.title} - RAAS Academy | Online Course & Certification`,
    description: course.description ? course.description.slice(0, META_DESCRIPTION_MAX_LENGTH) + '...' : `Learn ${course.title} with RAAS Academy. Expert-led online course with certification. Enroll today!`,
    keywords: `${course.title}, ${course.category || 'online course'}, RAAS Academy, certification, professional training, ${course.level || 'all levels'}`,
    canonical: `https://www.raasacademy.com/courses/${course._id}`,
    ogImage: resolveImageUrl(course.thumbnail) || 'https://www.raasacademy.com/logo.webp',
    structuredData: generateCourseSchema({
      name: course.title,
      description: course.description || '',
      instructor: course.instructor?.name || 'RAAS Academy Expert',
      provider: 'RAAS Academy',
      imageUrl: resolveImageUrl(course.thumbnail),
      price: course.price,
      currency: 'INR',
      duration: `PT${Math.round(course.totalDuration / 60)}H`,
      level: course.level,
    }),
  };

 return (
    <div className="flex flex-col min-h-screen">
      <SEO {...courseSEO} />
      <Navbar />

      {/* ✅ Sticky Navigation */}
      <div className="sticky top-16 bg-white shadow z-40 border-b">
        <div className="max-w-8xl mx-auto flex items-center px-6 py-3 overflow-x-auto space-x-3 text-sm font-medium">
          {[
            { key: "description", label: "About Course" },
            { key: "curriculum", label: "Curriculum" },
            { key: "tools", label: "Tools & Tech" },
            { key: "jobs", label: "Job Roles" },
            { key: "details", label: "Course Overview" },
            { key: "outcomes", label: "Learning Outcomes" },
            { key: "highlights", label: "Highlights" },
            { key: "alumni", label: "Alumni Speaks" },
            { key: "journey", label: "Admission Process" },
            { key: "companies", label: "Dream Companies" },
            { key: "fee", label: "Fee & Registration" },
            { key: "faq", label: "FAQs" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => scrollToSection(tab.key)}
              className="px-4 py-2 rounded-full border border-indigo-200 text-gray-700 bg-gray-50 hover:bg-indigo-100 hover:text-indigo-700 transition whitespace-nowrap"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ✅ Sections - Remove spacing between components */}
      <div className="flex flex-col min-h-screen">
        <div ref={sectionRefs.hero}>
          <CourseHero course={course} enrollment={enrollment} onEnroll={handleEnroll} />
        </div>
        <div ref={sectionRefs.description}>
          <CourseDescription description={course.description || ""} />
        </div>
        <div ref={sectionRefs.curriculum}>
          <AdminCurriculum curriculum={curriculum} />
        </div>
        <div ref={sectionRefs.tools}>
          <ToolsTechnologies tools={tools} />
        </div>
        <div ref={sectionRefs.jobs}>
          <JobRoles jobRoles={jobRoles} />
        </div>
        <div ref={sectionRefs.details}>
          <CourseDetails course={course} />
        </div>
        <div ref={sectionRefs.outcomes}>
          <LearningOutcomes outcomes={course.learningOutcomes || []} />
        </div>
        <div ref={sectionRefs.highlights}>
          <CourseHighlights highlights={highlights} />
        </div>
        <div ref={sectionRefs.alumni}>
          <AlumniSpeaks testimonials={testimonials} />
        </div>
        <div ref={sectionRefs.journey}>
          <LearningJourney journey={learningJourney} />
        </div>
        <div ref={sectionRefs.companies}>
          <ClientsSection/>
        </div>
        <div ref={sectionRefs.fee}>
          <FeeRegistration course={course} enrollment={enrollment} onEnroll={handleEnroll} />
        </div>
        <div ref={sectionRefs.faq}>
          <FAQSection faqs={faqs} />
        </div>
      </div>

      {/* Enrollment Form Modal */}
      {showEnrollmentForm && (
        <EnrollmentForm
          course={course}
          onSubmit={handleEnrollmentFormSubmit}
          onCancel={() => setShowEnrollmentForm(false)}
        />
      )}

      {/* Confirmation shown after a paid-course request is recorded */}
      {requestSubmitted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl p-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Request received</h2>
            <p className="text-gray-600 mb-2">
              Thanks for your interest in <span className="font-semibold">{course.title}</span>.
            </p>
            <p className="text-gray-600 mb-6">
              Our team will contact you shortly on the phone number and email you provided to
              confirm your enrollment and arrange the payment.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setRequestSubmitted(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Close
              </button>
              <button
                onClick={() => navigate("/courses")}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Browse more courses
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CourseDetail;