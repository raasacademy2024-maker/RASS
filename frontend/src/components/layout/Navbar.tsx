import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  BookOpen,
  User,
  Bell,
  LogOut,
  Menu,
  X,
  Search,
  ChevronDown,
} from "lucide-react";
import { useNotification } from "../../context/NotificationContext";
import { motion, AnimatePresence } from "framer-motion";

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const { unreadCount, notifications, markAsRead, markAllAsRead } =
    useNotification();

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsProfileDropdownOpen(false);
  };

  // Close dropdowns and mobile menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close notification dropdowns
      if (showNotifDropdown && !(event.target as Element).closest('.notification-dropdown')) {
        setShowNotifDropdown(false);
      }
      // Close profile dropdowns
      if (isProfileDropdownOpen && !(event.target as Element).closest('.profile-dropdown')) {
        setIsProfileDropdownOpen(false);
      }
      // Close mobile menu when clicking outside
      if (isMenuOpen && !(event.target as Element).closest('.mobile-menu') && !(event.target as Element).closest('.menu-button')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifDropdown, isProfileDropdownOpen, isMenuOpen]);

  const getDashboardLink = () => {
    if (!user) return "/";
    switch (user.role) {
      case "admin":
        return "/admin/dashboard";
      case "instructor":
        return "/instructor/dashboard";
      case "student":
        return "/student/dashboard";
      default:
        return "/";
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 8, scale: 1.1 }}
              
            >
            </motion.div>
            <img 
  src="/logo.webp" 
  alt="RAAS Academy Logo" 
  className="h-12 w-auto"
/>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 transition"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>
          </div>

          {/* Desktop Navigation - Moved to the right with smaller buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              to="/courses"
              className="px-3 py-1.5 text-sm rounded-full bg-indigo-100/80 backdrop-blur-sm border border-indigo-200 hover:bg-indigo-600 hover:text-white transition-all duration-300 font-medium shadow-sm"
            >
              Courses
            </Link>
            <Link
              to="/companies"
              className="px-3 py-1.5 text-sm rounded-full bg-indigo-100/80 backdrop-blur-sm border border-indigo-200 hover:bg-indigo-600 hover:text-white transition-all duration-300 font-medium shadow-sm"
            >
              Companies
            </Link>
            <Link
              to="/universities"
              className="px-3 py-1.5 text-sm rounded-full bg-indigo-100/80 backdrop-blur-sm border border-indigo-200 hover:bg-indigo-600 hover:text-white transition-all duration-300 font-medium shadow-sm"
            >
              Universities
            </Link>
            
            {isAuthenticated && (
              <Link
                to={getDashboardLink()}
                className="px-3 py-1.5 text-sm rounded-full bg-indigo-100/80 backdrop-blur-sm border border-indigo-200 hover:bg-indigo-600 hover:text-white transition-all duration-300 font-medium shadow-sm"
              >
                Dashboard
              </Link>
            )}
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-3 relative">
                {/* Notification Bell */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowNotifDropdown((p) => !p)}
                  className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </motion.button>

                {/* Notification Dropdown - Enhanced Design */}
                <AnimatePresence>
                  {showNotifDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-200 overflow-hidden notification-dropdown"
                      style={{ top: '100%' }}
                    >
                      <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50">
                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                        {unreadCount > 0 && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              markAllAsRead();
                            }}
                            className="text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-2 py-1 rounded-full font-medium transition-colors"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-8 text-center text-gray-500">
                            <Bell className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                            <p className="text-sm">No notifications yet</p>
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div 
                              key={notification._id} 
                              className={`px-4 py-3 border-b border-gray-50 hover:bg-indigo-50 cursor-pointer transition-colors ${
                                !notification.read ? 'bg-white border-l-4 border-l-indigo-500' : 'bg-gray-50'
                              }`}
                              onClick={() => {
                                markAsRead(notification._id);
                              }}
                            >
                              <div className="flex justify-between">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {notification.title}
                                </p>
                                {!notification.read && (
                                  <span className="h-2 w-2 bg-indigo-600 rounded-full"></span>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                {new Date(notification.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                      {notifications.length > 0 && (
                        <div className="px-4 py-2 text-center bg-gray-50">
                          <p className="text-xs text-gray-500">
                            {notifications.length} {notifications.length === 1 ? 'notification' : 'notifications'}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() =>
                      setIsProfileDropdownOpen(!isProfileDropdownOpen)
                    }
                    className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition-colors"
                  >
                    <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-indigo-600" />
                    </div>
                    <span className="font-medium hidden lg:inline">{user?.name}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        isProfileDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200 profile-dropdown"
                      >
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {user?.name}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">
                            {user?.role}
                          </p>
                        </div>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors flex items-center"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow"
                >
                  Login
                </Link>
                <Link
                  to="/help-center"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full font-medium hover:from-indigo-700 hover:to-purple-700 shadow transition-all duration-300"
                >
                  Help Center
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-4">
            {/* Notification Bell - Mobile */}
            {isAuthenticated && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowNotifDropdown((p) => !p)}
                className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </motion.button>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 p-1 rounded-md hover:bg-gray-100 menu-button"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Notification Dropdown - Mobile Version */}
      <AnimatePresence>
        {showNotifDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="md:hidden absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-200 overflow-hidden notification-dropdown"
            style={{ top: '100%', right: '1rem' }}
          >
            <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50">
              <h3 className="font-semibold text-gray-800">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    markAllAsRead();
                  }}
                  className="text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-2 py-1 rounded-full font-medium transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  <Bell className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div 
                    key={notification._id} 
                    className={`px-4 py-3 border-b border-gray-50 hover:bg-indigo-50 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-white border-l-4 border-l-indigo-500' : 'bg-gray-50'
                    }`}
                    onClick={() => {
                      markAsRead(notification._id);
                      setShowNotifDropdown(false); // Close dropdown on mobile after selecting
                    }}
                  >
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <span className="h-2 w-2 bg-indigo-600 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(notification.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                ))
              )}
            </div>
            {notifications.length > 0 && (
              <div className="px-4 py-2 text-center bg-gray-50">
                <p className="text-xs text-gray-500">
                  {notifications.length} {notifications.length === 1 ? 'notification' : 'notifications'}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Slide-in Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 flex flex-col mobile-menu"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-bold text-lg">Menu</span>
              <button onClick={() => setIsMenuOpen(false)}>
                <X className="h-6 w-6 text-gray-700" />
              </button>
            </div>
            <div className="flex flex-col p-4 space-y-4">
              <Link to="/courses" className="px-4 py-2 rounded-full bg-indigo-100/80 backdrop-blur-sm border border-indigo-200 hover:bg-indigo-600 hover:text-white transition-all duration-300 font-medium text-center shadow-sm" onClick={() => setIsMenuOpen(false)}>Courses</Link>
              <Link to="/companies" className="px-4 py-2 rounded-full bg-indigo-100/80 backdrop-blur-sm border border-indigo-200 hover:bg-indigo-600 hover:text-white transition-all duration-300 font-medium text-center shadow-sm" onClick={() => setIsMenuOpen(false)}>Companies</Link>
              <Link to="/universities" className="px-4 py-2 rounded-full bg-indigo-100/80 backdrop-blur-sm border border-indigo-200 hover:bg-indigo-600 hover:text-white transition-all duration-300 font-medium text-center shadow-sm" onClick={() => setIsMenuOpen(false)}>Universities</Link>
              
              {isAuthenticated ? (
                <>
                  <Link to={getDashboardLink()} className="px-4 py-2 rounded-full bg-indigo-100/80 backdrop-blur-sm border border-indigo-200 hover:bg-indigo-600 hover:text-white transition-all duration-300 font-medium text-center shadow-sm" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                  
                  {/* Profile Dropdown in Mobile Menu */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsProfileDropdownOpen(!isProfileDropdownOpen);
                        }}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-left bg-white rounded-lg border border-blue-100 hover:bg-blue-50 transition-colors duration-200"
                      >
                        <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{user?.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                        </div>
                        <ChevronDown
                          className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${
                            isProfileDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {isProfileDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-white rounded-lg border border-blue-100 overflow-hidden mt-2"
                          >
                            <Link
                              to="/profile"
                              className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                              onClick={() => {
                                setIsProfileDropdownOpen(false);
                                setIsMenuOpen(false);
                              }}
                            >
                              Profile
                            </Link>
                            <div className="border-t border-blue-50 mx-4"></div>
                            <button
                              onClick={() => {
                                handleLogout();
                                setIsProfileDropdownOpen(false);
                                setIsMenuOpen(false);
                              }}
                              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors flex items-center"
                            >
                              <LogOut className="h-4 w-4 mr-2" />
                              Logout
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow text-center" onClick={() => setIsMenuOpen(false)}>Login</Link>
                  <Link to="/help-center" className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 shadow text-center transition-all duration-300" onClick={() => setIsMenuOpen(false)}>Help Center</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;