import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Eye, EyeOff, UserPlus, ArrowLeft, Shield, GraduationCap, Star, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ScrollToTop from '../ScrollToTop';
import SEO, { pageSEOConfig } from '../../components/common/SEO';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await register(formData.name, formData.email, formData.password, formData.role);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Company logo component with iOS-inspired design
  const CompanyLogo = () => (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="relative p-2 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm"
    >
      <div className="flex items-center justify-center space-x-2">
        <div className="flex flex-col items-center">
          <div className="flex space-x-1">

          </div>
          <div className="flex space-x-1">

          </div>
        </div>
         <img
          src="./logo.webp"
          alt="RAAS logo"
          className="h-12 w-auto object-contain"
        />
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-100 relative overflow-hidden">
      <SEO {...pageSEOConfig.register} />
      {/* Subtle iOS-style gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-100"></div>

      {/* Animated particles for iOS-like sparkle effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-300/30"
            style={{
              width: Math.random() * 6 + 3,
              height: Math.random() * 6 + 3,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <Navbar />
      <ScrollToTop />

      <div className="min-h-screen flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Left Side - Register Form */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 shadow-lg p-8 lg:p-12 flex flex-col justify-between"
            >
              <div>
                <Link
                  to="/"
                  className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 mb-8 transition group"
                >
                  <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Back to home
                </Link>

                <div className="text-center mb-10">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="inline-block mb-6"
                  >
                    <CompanyLogo />
                  </motion.div>
                  <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl font-bold text-gray-900"
                  >
                    Join RASS Academy
                  </motion.h2>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg text-gray-500"
                  >
                    Create your account and start learning today
                  </motion.p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm"
                    >
                      {error}
                    </motion.div>
                  )}

                  {/* Name Field */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                  </motion.div>

                  {/* Email Field */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                  </motion.div>

                  {/* Password Field */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 pr-12"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-blue-600 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <motion.div whileTap={{ scale: 0.9 }}>
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </motion.div>
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Must be at least 8 characters
                    </p>
                  </motion.div>

                  {/* Confirm Password Field */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 pr-12"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-blue-600 transition-colors"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <motion.div whileTap={{ scale: 0.9 }}>
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </motion.div>
                      </button>
                    </div>
                  </motion.div>

                  {/* Role Selection */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      I want to join as a
                    </label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <div>
                        <input
                          type="radio"
                          id="student"
                          name="role"
                          value="student"
                          checked={formData.role === 'student'}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          className="sr-only"
                        />
                        <label
                          htmlFor="student"
                          className={`flex flex-row items-center justify-center p-3 border rounded-xl cursor-pointer transition-colors ${
                            formData.role === 'student'
                              ? 'border-blue-400 bg-blue-50 text-blue-700'
                              : 'border-gray-200 text-gray-700 hover:border-blue-200'
                          }`}
                        >
                          <GraduationCap className="h-5 w-5 mb-2" />
                          <span className="text-center">Student</span>
                        </label>
                      </div>
                    </div>
                  </motion.div>

                  {/* Terms Checkbox */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="flex items-center"
                  >
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      required
                      className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-200 rounded"
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                      I agree to the{' '}
                      <Link to="/terms" className="text-blue-500 hover:text-blue-700 hover:underline transition-colors">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-blue-500 hover:text-blue-700 hover:underline transition-colors">
                        Privacy Policy
                      </Link>
                    </label>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-6 rounded-xl font-semibold text-white bg-blue-500 shadow-md hover:bg-blue-600 transition-all duration-300 disabled:opacity-50"
                  >
                    <div className="flex items-center justify-center">
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        <>
                          <UserPlus className="h-5 w-5 mr-2" />
                          Create Account
                        </>
                      )}
                    </div>
                  </motion.button>

                  {/* Login Link */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.1 }}
                    className="text-center text-sm text-gray-600"
                  >
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      className="font-semibold text-blue-500 hover:text-blue-700 hover:underline transition-colors"
                    >
                      Sign In
                    </Link>
                  </motion.div>
                </form>
              </div>
            </motion.div>

            {/* Right Side - Features */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="hidden lg:flex relative bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 shadow-lg p-8 lg:p-12 flex-col justify-between"
            >
              <div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center mb-10"
                >
                  <CompanyLogo />
                  <motion.h3
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl font-bold text-gray-900 mt-6"
                  >
                    Why Choose RAAS?
                  </motion.h3>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg text-gray-500"
                  >
                    Empowering your learning with cutting-edge tools
                  </motion.p>
                </motion.div>

                <div className="space-y-4">
                  {[
                    { icon: Rocket, color: "blue", title: "200+ Courses", desc: "From beginner to advanced levels" },
                    { icon: Shield, color: "blue", title: "Expert Instructors", desc: "Learn from industry professionals" },
                    { icon: GraduationCap, color: "blue", title: "Certificates", desc: "Earn recognized credentials" },
                    { icon: Star, color: "blue", title: "Community Support", desc: "Join a vibrant learning community" },
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ x: 40, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/50 p-4 rounded-xl border border-gray-200/50 hover:border-blue-200 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`flex-shrink-0 bg-${feature.color}-100 rounded-xl p-2`}>
                          <feature.icon className={`h-6 w-6 text-${feature.color}-500`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                          <p className="text-sm text-gray-500">{feature.desc}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Trust Badge */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="flex items-center justify-center space-x-2 mt-8 pt-6 border-t border-gray-200/50"
              >
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-blue-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">Rated 4.9/5 by 10,000+ learners</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;