import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { liveSessionAPI, notificationAPI, enrollmentAPI } from "../../services/api";
import { useNotification } from "../../context/NotificationContext";
import {
  Calendar,
  Clock,
  Users,
  Video,
  ExternalLink,
  Zap,
  AlertCircle,
} from "lucide-react";
import { LiveSession } from "../../types";
import { motion } from "framer-motion";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const LiveSessions: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed">("all");
  const { decrementUnread } = useNotification();

  useEffect(() => {
    if (courseId) {
      fetchCourseSessions(courseId);
    } else {
      fetchMySessions();
    }
    markLiveSessionNotificationsAsRead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const markLiveSessionNotificationsAsRead = async () => {
    try {
      const res = await notificationAPI.getNotifications();
      const liveNotifications = res.data.filter(
        (n: any) => n.type === "live-session" && !n.read
      );
      for (const n of liveNotifications) {
        await notificationAPI.markAsRead(n._id);
        decrementUnread();
      }
    } catch (err) {
      console.error("Error marking live-session notifications as read:", err);
    }
  };

  const fetchCourseSessions = async (id: string) => {
    try {
      // Get user's batch from enrollment
      const enrollmentsRes = await enrollmentAPI.getMyEnrollments();
      const enrollment = enrollmentsRes.data.find((e: any) => 
        (typeof e.course === 'object' ? e.course._id : e.course) === id
      );
      const batchId = enrollment?.batch?._id;
      
      // Fetch sessions with batch filter
      const response = await liveSessionAPI.getCourseSessions(id, batchId);
      setSessions(response.data);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMySessions = async () => {
    try {
      const response = await liveSessionAPI.getMySessions();
      setSessions(response.data);
    } catch (error) {
      console.error("Error fetching my sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSession = (link?: string) => {
    if (link) {
      window.open(link, "_blank");
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "live":
        return "bg-red-50 border-l-4 border-red-500";
      case "scheduled":
        return "bg-blue-50 border-l-4 border-blue-500";
      case "completed":
        return "bg-green-50 border-l-4 border-green-500";
      case "cancelled":
        return "bg-gray-50 border-l-4 border-gray-400";
      default:
        return "bg-gray-50 border-l-4 border-gray-400";
    }
  };

  const isUpcoming = (session: LiveSession) =>
    session.status === "scheduled" && new Date(session.scheduledAt) > new Date();

  const isCompleted = (session: LiveSession) =>
    session.status === "completed" ||
    (session.status === "scheduled" &&
      new Date(session.scheduledAt) < new Date());

  const filteredSessions = sessions.filter((session) => {
    if (filter === "upcoming") return isUpcoming(session);
    if (filter === "completed") return isCompleted(session);
    return true;
  });

  const sortedSessions = filteredSessions.sort((a, b) => {
    if (a.status === "live" && b.status !== "live") return -1;
    if (a.status !== "live" && b.status === "live") return 1;
    return (
      new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading live sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Video className="h-6 w-6 mr-2 text-blue-600" />
              Live Sessions
            </h1>
            <p className="text-gray-600 mt-1">
              {courseId
                ? "Course live sessions"
                : "All your enrolled live sessions"}
            </p>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            {["all", "upcoming", "completed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                  filter === f
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {f === "all"
                  ? "All Sessions"
                  : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Session Cards */}
      {sortedSessions.length > 0 ? (
        <div className="space-y-4">
          {sortedSessions.map((session) => (
            <motion.div
              key={session._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`bg-white rounded-xl shadow-sm overflow-hidden ${getStatusStyles(
                session.status
              )}`}
            >
              <div className="p-6 flex flex-col lg:flex-row lg:items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {session.title}
                  </h3>
                  {session.description && (
                    <p className="text-gray-600 mb-3">{session.description}</p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span>
                        {new Date(session.scheduledAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      <span>
                        {new Date(session.scheduledAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{session.attendees?.length || 0} attendees</span>
                    </div>
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="capitalize">{session.status}</span>
                    </div>
                  </div>

                  {session.instructor && (
                    <div className="text-sm text-gray-600 mb-3">
                      <span className="font-medium">Instructor: </span>
                      {session.instructor.name}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-2 mt-4 lg:mt-0 lg:ml-4">
                  <button
                    onClick={() => handleJoinSession(session.meetingLink)}
                    disabled={!session.meetingLink}
                    className={`px-4 py-2 rounded-lg font-medium flex items-center justify-center transition ${
                      session.status === "live"
                        ? "bg-red-600 text-white hover:bg-red-700 animate-pulse"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    } ${!session.meetingLink ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {session.status === "live" ? "Join Live Now" : "Join Meeting"}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <Video className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === "all"
              ? "No live sessions scheduled"
              : filter === "upcoming"
              ? "No upcoming sessions"
              : "No completed sessions"}
          </h3>
          <p className="text-gray-600">
            {filter === "all"
              ? "Live sessions will appear here when scheduled by your instructor."
              : filter === "upcoming"
              ? "Check back later for upcoming sessions."
              : "Completed sessions will appear here after they finish."}
          </p>
        </div>
      )}
    </div>
      <Footer />
    </div>
  );
};

export default LiveSessions;
