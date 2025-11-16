import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ReactPlayer from "react-player";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import {
  PlayCircle,
  CheckCircle,
  FileText,
  Video,
  Calendar,
  Clock,
  Menu,
  X,
} from "lucide-react";

import {
  courseAPI,
  enrollmentAPI,
  forumAPI,
  liveSessionAPI,
} from "../../services/api";
import { Course, Enrollment, ForumPost } from "../../types";
import DiscussionForum from "../student/diss";
import Chat from "../student/Chat";
import SupportTickets from "../student/SupportTicketsPage";

const CoursePlayer: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [currentModule, setCurrentModule] = useState(0);
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "discussions"
    | "live-sessions"
    | "resources"
    | "chat"
    | "support"
  >("overview");
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [accessCheck, setAccessCheck] = useState<any>(null);
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      const [courseRes, enrollmentsRes, forumRes, sessionsRes, accessRes] =
        await Promise.all([
          courseAPI.getCourse(courseId!),
          enrollmentAPI.getMyEnrollments(),
          forumAPI.getCourseForums(courseId!),
          liveSessionAPI.getCourseSessions(courseId!),
          enrollmentAPI.checkCourseAccess(courseId!),
        ]);

      setCourse(courseRes.data);
      const userEnrollment = enrollmentsRes.data.find(
        (e: Enrollment) => e.course._id === courseId
      );
      setEnrollment(userEnrollment || null);
      setForumPosts(forumRes.data);
      setSessions(sessionsRes.data || []);
      setAccessCheck(accessRes.data);
    } catch (error) {
      console.error("Error fetching course data:", error);
    } finally {
      setLoading(false);
      setCheckingAccess(false);
    }
  };

  const handleModuleComplete = async (moduleId: string) => {
    try {
      await enrollmentAPI.updateProgress({
        courseId,
        moduleId,
        completed: true,
        watchTime: course?.modules[currentModule]?.duration || 0,
      });
      await fetchCourseData();
    } catch (error: any) {
      console.error("Error updating progress:", error);
      // Show error message if batch access has expired
      if (error.response?.data?.reason) {
        alert(error.response.data.message);
      }
    }
  };

  if (loading || checkingAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  // Check if batch access is restricted
  if (accessCheck && !accessCheck.accessible) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Navbar />
        <div className="text-center max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <Calendar className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Course Access Restricted
              </h2>
              <p className="text-gray-600 text-lg mb-4">
                {accessCheck.message}
              </p>
            </div>
            
            {enrollment?.batch && (
              <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
                <h3 className="text-lg font-semibold text-indigo-900 mb-4">
                  Batch Information
                </h3>
                <div className="space-y-3 text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Batch Name:</span>
                    <span className="font-medium text-gray-900">
                      {(enrollment.batch as any).name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Start Date:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(accessCheck.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">End Date:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(accessCheck.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-6">
              <a
                href="/student/dashboard"
                className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Back to Dashboard
              </a>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!course || !enrollment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Course not accessible
          </h2>
          <p className="text-gray-600">
            Please enroll in this course to access the content.
          </p>
        </div>
      </div>
    );
  }

  const currentModuleData = course.modules[currentModule];
  const isCurrentModuleCompleted =
    enrollment.progress.find((p) => p.moduleId === currentModuleData?._id)
      ?.completed || false;

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Menu Toggle */}
        <div className="lg:hidden fixed top-16 left-4 z-50">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
          >
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4">
          {/* Mobile Overlay */}
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              />
            )}
          </AnimatePresence>

          {/* Sidebar */}
          <aside className="lg:col-span-1 bg-white border-r border-gray-200 h-screen overflow-y-auto lg:block fixed lg:static w-80 lg:w-auto z-50 lg:z-auto transition-transform duration-300 ease-in-out" style={{ transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)', }}>
            <style>{`
              @media (min-width: 1024px) {
                aside {
                  transform: translateX(0) !important;
                }
              }
            `}</style>
            <div className="p-4 lg:p-6 border-b flex items-center justify-between">
              <h2 className="text-lg lg:text-xl font-bold text-gray-900">
                {course.title}
              </h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-4 lg:px-6 pb-6 space-y-2">
              {course.modules.map((module, index) => {
                const moduleProgress = enrollment.progress.find(
                  (p) => p.moduleId === module._id
                );
                const isCompleted = moduleProgress?.completed || false;

                return (
                  <motion.div
                    key={module._id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-3 rounded-lg cursor-pointer flex items-center space-x-3 transition ${
                      currentModule === index
                        ? "bg-indigo-50 border border-indigo-200"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      setCurrentModule(index);
                      setIsSidebarOpen(false);
                    }}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <PlayCircle className="h-5 w-5 text-gray-400" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {module.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {module.duration} min
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3 px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 lg:space-y-8 pt-20 lg:pt-6">
            {/* Video Player */}
            <div className="rounded-lg sm:rounded-xl overflow-hidden shadow-lg bg-black">
              {currentModuleData?.videoUrl ? (
                <div className="relative" style={{ paddingTop: '56.25%' }}>
                  <ReactPlayer
                    url={currentModuleData.videoUrl}
                    controls
                    width="100%"
                    height="100%"
                    playing={false}
                    className="absolute top-0 left-0"
                    config={{
                      file: {
                        attributes: {
                          preload: 'auto',
                          controlsList: 'nodownload',
                        },
                      },
                      youtube: {
                        playerVars: {
                          modestbranding: 1,
                          rel: 0,
                          showinfo: 0,
                        },
                      },
                    }}
                    onEnded={() => handleModuleComplete(currentModuleData._id)}
                  />
                </div>
              ) : (
                <div className="h-48 sm:h-64 md:h-80 lg:h-[420px] flex flex-col items-center justify-center bg-gradient-to-r from-indigo-700 to-purple-700 text-white">
                  <PlayCircle className="h-12 w-12 sm:h-16 sm:w-16 opacity-60" />
                  <p className="ml-3 text-base sm:text-lg mt-2">Video content coming soon</p>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="bg-white border px-4 sm:px-6 py-4 rounded-lg shadow-sm">
              <div className="mb-4">
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  {currentModuleData?.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  {currentModuleData?.description}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    disabled={currentModule === 0}
                    onClick={() => setCurrentModule(currentModule - 1)}
                    className="flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors sm:min-w-[100px]"
                  >
                    Previous
                  </button>
                  <button
                    disabled={currentModule === course.modules.length - 1}
                    onClick={() => setCurrentModule(currentModule + 1)}
                    className="flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 rounded-lg border border-indigo-600 bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors sm:min-w-[100px]"
                  >
                    Next
                  </button>
                </div>
                {!isCurrentModuleCompleted && (
                  <button
                    onClick={() =>
                      handleModuleComplete(currentModuleData._id)
                    }
                    className="w-full sm:w-auto px-4 sm:px-5 py-2.5 rounded-lg bg-green-600 text-white text-sm font-medium flex items-center gap-2 hover:bg-green-700 transition-colors sm:min-w-[160px] justify-center"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Mark Complete
                  </button>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white px-4 sm:px-6 py-4 rounded-lg shadow-sm border">
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {[
                  { key: "overview", label: "Overview" },
                  { key: "discussions", label: "Discussions" },
                  { key: "live-sessions", label: "Live Sessions" },
                  { key: "resources", label: "Resources" },
                  { key: "chat", label: "Chat" },
                  { key: "support", label: "Support" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition whitespace-nowrap ${
                      activeTab === tab.key
                        ? "bg-indigo-600 text-white shadow"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <motion.div
              className="bg-white p-4 sm:p-6 rounded-lg shadow"
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "overview" && (
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                    Module Overview
                  </h4>
                  <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
                    {currentModuleData?.description}
                  </p>
                  {currentModuleData?.resources?.length > 0 && (
                    <div>
                      <h5 className="text-sm sm:text-base font-medium text-gray-900 mb-3">
                        Resources
                      </h5>
                      <div className="grid grid-cols-1 gap-3">
                        {currentModuleData.resources.map((resource, index) => (
                          <a
                            key={index}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition shadow-sm"
                          >
                            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-3 flex-shrink-0" />
                            <span className="text-gray-900 text-sm break-words">
                              {resource.title}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "discussions" && (
                <DiscussionForum courseId={course._id} />
              )}

              {activeTab === "live-sessions" && (
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                    Live Sessions
                  </h4>
                  {sessions.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {sessions.map((session) => (
                        <motion.div
                          key={session._id}
                          whileHover={{ scale: 1.02 }}
                          className="p-4 border rounded-lg shadow-sm hover:shadow-md transition"
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex-1 w-full">
                              <h5 className="font-medium text-gray-900 flex items-center text-sm sm:text-base">
                                <Video className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mr-2 flex-shrink-0" />
                                {session.title}
                              </h5>
                              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                {session.description}
                              </p>
                              <p className="text-xs text-gray-500 mt-1 flex items-center">
                                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                                <span className="break-all">{new Date(
                                  session.scheduledAt
                                ).toLocaleString()}</span>
                              </p>
                              <p className="text-xs text-gray-500 flex items-center mt-1">
                                <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                                Duration: {session.duration} mins
                              </p>
                            </div>
                            <a
                              href={session.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition text-center text-sm whitespace-nowrap"
                            >
                              Join
                            </a>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm sm:text-base text-gray-600">
                      No live sessions scheduled for this course.
                    </p>
                  )}
                </div>
              )}

              {activeTab === "resources" && (
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                    Course Resources
                  </h4>
                  {course.modules.some((m) => m.resources?.length > 0) ? (
                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                      {course.modules.flatMap((m) =>
                        m.resources?.map((res, idx) => (
                          <a
                            key={idx}
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition shadow-sm"
                          >
                            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-3 flex-shrink-0" />
                            <span className="text-gray-900 text-sm break-words">
                              {res.title}
                            </span>
                          </a>
                        )) || []
                      )}
                    </div>
                  ) : (
                    <p className="text-sm sm:text-base text-gray-600">No resources available.</p>
                  )}
                </div>
              )}

              {/* Chat with Mentor */}
              {activeTab === "chat" && (
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                    Chat with Mentor
                  </h4>
                  <div className="border rounded-lg overflow-hidden">
                    <Chat courseId={course._id} embedded />
                  </div>
                </div>
              )}

              {/* Support Tickets */}
              {activeTab === "support" && (
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                    Support Tickets
                  </h4>
                  <div className="border rounded-lg overflow-hidden">
                    <SupportTickets courseId={course._id} embedded />
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CoursePlayer;
