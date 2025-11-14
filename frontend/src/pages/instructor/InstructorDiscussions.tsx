// frontend/src/pages/instructor/InstructorDiscussions.tsx
import React, { useEffect, useState } from "react";
import { forumAPI, courseAPI } from "../../services/api";
import { Plus, MessageCircle, Send, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

interface Post {
  _id: string;
  title: string;
  content: string;
  author: { _id: string; name: string };
  createdAt: string;
  replies?: Reply[];
  batch?: { _id: string; name: string };
  category?: string;
}

interface Reply {
  _id: string;
  content: string;
  author?: { _id: string; name: string };
  createdAt: string;
}

const InstructorDiscussions: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [discussions, setDiscussions] = useState<Post[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const [newPost, setNewPost] = useState({ title: "", content: "", category: "general" });
  const [replying, setReplying] = useState<{ postId: string; content: string } | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const res = await courseAPI.getInstructorCourses();
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const loadDiscussions = async (courseId: string) => {
    try {
      const res = await forumAPI.getCourseForums(courseId);
      setDiscussions(res.data);
    } catch (err) {
      console.error("Error loading forums:", err);
    }
  };

const handleCreatePost = async () => {
  if (!selectedCourse || !newPost.title.trim() || !newPost.content.trim()) return;
  try {
    const res = await forumAPI.createPost({ 
      ...newPost, 
      course: selectedCourse._id 
    });

    const newPostData: Post = {
      _id: res.data._id,
      title: res.data.title,
      content: res.data.content,
      author: res.data.author,
      createdAt: res.data.createdAt,
      replies: res.data.replies || []
    };

    // Update state instantly - fix the state update
    setDiscussions((prev) => [newPostData, ...prev]);
    setExpanded((prev) => new Set(prev).add(newPostData._id));
    setNewPost({ title: "", content: "", category: "general" });
    setShowModal(false);
  } catch (err) {
    console.error("Error creating post:", err);
  }
};

  const handleReply = async (postId: string) => {
    if (!replying?.content.trim()) return;
    try {
      const res = await forumAPI.addReply(postId, replying.content);

      // Update the post replies instantly
      setDiscussions((prev) =>
        prev.map((post) =>
          post._id === postId ? { ...post, replies: [...(post.replies || []), res.data] } : post
        )
      );

      setReplying(null);
      setExpanded((prev) => new Set(prev).add(postId));
    } catch (err) {
      console.error("Error replying:", err);
    }
  };

  const toggleExpand = (postId: string) => {
    setExpanded((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) newSet.delete(postId);
      else newSet.add(postId);
      return newSet;
    });
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl p-6 text-white shadow-lg"
        >
          <h1 className="text-3xl font-bold">Instructor Discussions</h1>
          <p className="text-sm opacity-80 mt-1">
            Start and manage discussions with students in your courses.
          </p>
        </motion.div>

        {/* Course Selector */}
        <div className="bg-white rounded-xl shadow p-4">
          <select
            value={selectedCourse?._id || ""}
            onChange={(e) => {
              const course = courses.find((c) => c._id === e.target.value);
              setSelectedCourse(course);
              if (course) loadDiscussions(course._id);
            }}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a Course</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        {/* Discussions */}
        {selectedCourse ? (
          <div className="space-y-6">
            {/* Section Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{selectedCourse.title} Discussions</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md flex items-center gap-2 hover:bg-blue-700 transition"
                onClick={() => setShowModal(true)}
              >
                <Plus className="h-4 w-4" /> New Discussion
              </motion.button>
            </div>

            {discussions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No discussions yet. Start one!</p>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {discussions.map((post) => (
                    <motion.div
                      key={post._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="border p-5 rounded-xl bg-white shadow hover:shadow-md transition"
                    >
                      <div
                        className="cursor-pointer flex justify-between items-start"
                        onClick={() => toggleExpand(post._id)}
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg text-gray-900">{post.title}</h3>
                            {post.batch && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                📚 {post.batch.name}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600">{post.content}</p>
                          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            By {post.author?.name || "Unknown"} •{" "}
                            {new Date(post.createdAt).toLocaleString()}
                          </p>
                        </div>
                        {expanded.has(post._id) ? (
                          <ChevronUp className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        )}
                      </div>

                      {/* Replies */}
                      <AnimatePresence>
                        {expanded.has(post._id) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 space-y-3 border-t pt-3"
                          >
                            {post.replies?.length > 0 ? (
                              post.replies.map((reply: Reply) => (
                                <div
                                  key={reply._id}
                                  className="bg-gray-50 p-3 rounded-lg border"
                                >
                                  <p className="text-gray-800 text-sm">{reply.content}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {reply.author?.name || "Anonymous"} •{" "}
                                    {new Date(reply.createdAt).toLocaleString()}
                                  </p>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-400 text-sm">No replies yet.</p>
                            )}

                            {/* Reply Box */}
                            {replying?.postId === post._id ? (
                              <div className="flex items-center space-x-2 mt-3">
                                <input
                                  type="text"
                                  placeholder="Write a reply..."
                                  value={replying.content}
                                  onChange={(e) =>
                                    setReplying({ postId: post._id, content: e.target.value })
                                  }
                                  className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                  onClick={() => handleReply(post._id)}
                                  className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-blue-700"
                                >
                                  <Send className="h-4 w-4" /> Reply
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setReplying({ postId: post._id, content: "" })}
                                className="text-blue-600 text-sm hover:underline mt-2"
                              >
                                Reply
                              </button>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-12">
            Select a course to view discussions.
          </p>
        )}

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-xl"
              >
                <h3 className="text-lg font-semibold mb-4">
                  New Discussion with {selectedCourse?.title} Students
                </h3>
                <input
                  type="text"
                  placeholder="Discussion Title"
                  className="w-full px-4 py-2 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                />
                <textarea
                  rows={4}
                  placeholder="Discussion Content"
                  className="w-full px-4 py-2 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                />
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="general">General</option>
                  <option value="assignment">Assignment</option>
                  <option value="technical">Technical</option>
                  <option value="announcement">Announcement</option>
                </select>
                <div className="flex justify-end space-x-3">
                  <button
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    onClick={handleCreatePost}
                  >
                    Post
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
};

export default InstructorDiscussions;
