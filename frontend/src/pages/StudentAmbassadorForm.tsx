import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Send, 
  User, 
  GraduationCap, 
  Mail, 
  Phone, 
  Award, 
  Calendar, 
  BookOpen, 
  Briefcase, 
  CheckCircle,
  Star,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Heart,
  Target,
  Rocket,
  AlertTriangle,
  Handshake
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { countryCodes } from "../utils/countryCodes";
import SEO, { pageSEOConfig } from "../components/common/SEO";

const CampusPartnerForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    university: "",
    department: "",
    graduationYear: "",
    currentYear: "",
    email: "",
    phone: "",
    countryCode: "+91",
    competencies: ""
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentYear = new Date().getFullYear();
  const graduationYears = Array.from({ length: 6 }, (_, i) => (currentYear + i).toString());
  const studyYears = ["1st Year", "2nd Year", "3rd Year", "Final Year"];

  // Benefits data
  const benefits = [
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Promising Incentives",
      description: "Get paid for every successful referral"
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Certificate of Recognition",
      description: "Official recognition for your contributions"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Network Building",
      description: "Connect with industry professionals"
    },
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: "Leadership Experience",
      description: "Develop valuable marketing and leadership skills"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Skill Development",
      description: "Enhance your communication and management abilities"
    },
    {
      icon: <Rocket className="h-6 w-6" />,
      title: "Career Boost",
      description: "Stand out in job applications with this experience"
    }
  ];

  // Validate phone number
  const validatePhone = (phone: string): boolean => {
    const selectedCountry = countryCodes.find(c => c.code === formData.countryCode);
    const requiredLength = selectedCountry?.length || 10;
    const phoneRegex = new RegExp(`^[0-9]{${requiredLength}}$`);
    return phoneRegex.test(phone);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    const selectedCountry = countryCodes.find(c => c.code === formData.countryCode);
    const maxLength = selectedCountry?.length || 10;
    
    if (value.length <= maxLength) {
      setFormData(prev => ({ ...prev, phone: value }));
      
      // Clear error when typing valid input
      if (errors.phone && (value.length === 0 || value.length === maxLength)) {
        setErrors(prev => ({ ...prev, phone: "" }));
      }
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.university.trim()) newErrors.university = "University is required";
    if (!formData.department.trim()) newErrors.department = "Department is required";
    if (!formData.graduationYear) newErrors.graduationYear = "Graduation year is required";
    if (!formData.currentYear) newErrors.currentYear = "Current year is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    else if (!validatePhone(formData.phone)) {
      const selectedCountry = countryCodes.find(c => c.code === formData.countryCode);
      const requiredLength = selectedCountry?.length || 10;
      newErrors.phone = `Phone must be exactly ${requiredLength} digits for ${selectedCountry?.country}`;
    }
    if (!formData.competencies.trim()) newErrors.competencies = "Core competencies required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value.toString() }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      // Combine country code with phone number before submission
      const submissionData = {
        ...formData,
        phone: `${formData.countryCode} ${formData.phone}`
      };

      const response = await fetch("https://rass1.onrender.com/api/student-ambassador-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Submission failed");

      setIsSubmitted(true);
      setFormData({
        name: "",
        university: "",
        department: "",
        graduationYear: "",
        currentYear: "",
        email: "",
        phone: "",
        countryCode: "+91",
        competencies: ""
      });
    } catch (error: any) {
      console.error("Error submitting form:", error.message);
      alert("Error submitting form: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <SEO {...pageSEOConfig.studentAmbassador} />
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute -inset-4 bg-white/20 rounded-full blur-lg"></div>
                <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
                  <Handshake className="h-12 w-12 text-black-400" />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Become a <span className="text-yellow-300">Campus Partner</span>
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join RAAS Academy's elite program and become the face of innovation on your campus
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                <span className="text-yellow-300 font-semibold">Promising Incentives</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                <span className="text-yellow-300 font-semibold">Build Your Network</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                <span className="text-yellow-300 font-semibold">Gain Experience</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Become a Campus Partner?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of students who have transformed their college experience while building an impressive resume
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 text-white">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* About RAAS Academy */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">About RAAS Academy</h2>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  RAAS Academy is a premier online upskilling platform that offers industry-aligned certification programs, 
                  bootcamps, and diplomas in key domains such as IT, Management, Finance, and Healthcare.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Our programs are developed in collaboration with leading universities and corporate partners, 
                  ensuring that learners gain job-ready skills and accelerate their career growth.
                </p>
              </div>

              {/* Program Details */}
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="h-8 w-8 text-yellow-300" />
                  <h2 className="text-2xl font-bold">Your Role as Campus Partner</h2>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-yellow-300 mt-1 flex-shrink-0" />
                    <span>Promote industry-aligned certification programs within your college</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-yellow-300 mt-1 flex-shrink-0" />
                    <span>Refer students and represent RAAS Academy at campus events</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-yellow-300 mt-1 flex-shrink-0" />
                    <span>Share updates and engage your network on social media</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-yellow-300 mt-1 flex-shrink-0" />
                    <span>Provide feedback and insights to help improve our programs</span>
                  </li>
                </ul>
              </div>

              {/* Eligibility */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="h-8 w-8 text-green-500" />
                  <h2 className="text-2xl font-bold text-gray-900">Eligibility</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Open to all enthusiastic college students from any major who are:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Active in campus or online communities
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Passionate about education and skill development
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Interested in building leadership experience
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Looking to enhance their resume
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Right Side - Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="sticky top-8"
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                {/* Form Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <Send className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Application Form</h2>
                      <p className="text-indigo-100">Join our elite campus partners program</p>
                    </div>
                  </div>
                </div>

                {/* Form Body */}
                {isSubmitted ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-8 text-center"
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Application Submitted!</h3>
                    <p className="text-gray-600 mb-6">
                      Thank you for your interest in becoming a Campus Partner. 
                      We'll review your application and get back to you soon.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Submit Another Application
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <User className="h-4 w-4 text-indigo-600" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`block w-full border ${errors.name ? "border-red-500" : "border-gray-300"} rounded-lg p-4 transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                        placeholder="Enter your full name"
                      />
                      {errors.name && <p className="text-red-600 text-sm mt-1 flex items-center gap-1"><AlertTriangle className="h-4 w-4" /> {errors.name}</p>}
                    </div>

                    {/* University & Department Row */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="university" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-indigo-600" />
                          University *
                        </label>
                        <input
                          type="text"
                          name="university"
                          value={formData.university}
                          onChange={handleChange}
                          className={`block w-full border ${errors.university ? "border-red-500" : "border-gray-300"} rounded-lg p-4 transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                          placeholder="Your university"
                        />
                        {errors.university && <p className="text-red-600 text-sm mt-1 flex items-center gap-1"><AlertTriangle className="h-4 w-4" /> {errors.university}</p>}
                      </div>

                      <div>
                        <label htmlFor="department" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-indigo-600" />
                          Department *
                        </label>
                        <input
                          type="text"
                          name="department"
                          value={formData.department}
                          onChange={handleChange}
                          className={`block w-full border ${errors.department ? "border-red-500" : "border-gray-300"} rounded-lg p-4 transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                          placeholder="Your department"
                        />
                        {errors.department && <p className="text-red-600 text-sm mt-1 flex items-center gap-1"><AlertTriangle className="h-4 w-4" /> {errors.department}</p>}
                      </div>
                    </div>

                    {/* Year & Graduation Row */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="currentYear" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-indigo-600" />
                          Current Year *
                        </label>
                        <select
                          name="currentYear"
                          value={formData.currentYear}
                          onChange={handleChange}
                          className={`block w-full border ${errors.currentYear ? "border-red-500" : "border-gray-300"} rounded-lg p-4 transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white`}
                        >
                          <option value="">Select current year</option>
                          {studyYears.map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                        {errors.currentYear && <p className="text-red-600 text-sm mt-1 flex items-center gap-1"><AlertTriangle className="h-4 w-4" /> {errors.currentYear}</p>}
                      </div>

                      <div>
                        <label htmlFor="graduationYear" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <Award className="h-4 w-4 text-indigo-600" />
                          Graduation Year *
                        </label>
                        <select
                          name="graduationYear"
                          value={formData.graduationYear}
                          onChange={handleChange}
                          className={`block w-full border ${errors.graduationYear ? "border-red-500" : "border-gray-300"} rounded-lg p-4 transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white`}
                        >
                          <option value="">Select graduation year</option>
                          {graduationYears.map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                        {errors.graduationYear && <p className="text-red-600 text-sm mt-1 flex items-center gap-1"><AlertTriangle className="h-4 w-4" /> {errors.graduationYear}</p>}
                      </div>
                    </div>

                    {/* Contact Row */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <Mail className="h-4 w-4 text-indigo-600" />
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`block w-full border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-lg p-4 transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                          placeholder="your.email@university.edu"
                        />
                        {errors.email && <p className="text-red-600 text-sm mt-1 flex items-center gap-1"><AlertTriangle className="h-4 w-4" /> {errors.email}</p>}
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <Phone className="h-4 w-4 text-indigo-600" />
                          Phone Number *
                        </label>
                        <div className="flex gap-2">
                          <select
                            value={formData.countryCode}
                            onChange={(e) => {
                              setFormData(prev => ({ ...prev, countryCode: e.target.value, phone: '' }));
                              setErrors(prev => ({ ...prev, phone: '' }));
                            }}
                            className="w-20 px-2 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-sm"
                          >
                            {countryCodes.map((item) => (
                              <option key={item.code} value={item.code}>
                                {item.code} - {item.country}
                              </option>
                            ))}
                          </select>
                          <div className="flex-1">
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handlePhoneChange}
                              className={`block w-full border ${errors.phone ? "border-red-500" : "border-gray-300"} rounded-lg p-4 transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                              placeholder={`Enter ${countryCodes.find(c => c.code === formData.countryCode)?.length || 10} digit number`}
                              maxLength={countryCodes.find(c => c.code === formData.countryCode)?.length || 10}
                            />
                          </div>
                        </div>
                        {errors.phone && <p className="text-red-600 text-sm mt-1 flex items-center gap-1"><AlertTriangle className="h-4 w-4" /> {errors.phone}</p>}
                      </div>
                    </div>

                    {/* Competencies */}
                    <div>
                      <label htmlFor="competencies" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-indigo-600" />
                        Core Competencies & Skills *
                      </label>
                      <textarea
                        name="competencies"
                        value={formData.competencies}
                        onChange={handleChange}
                        rows={4}
                        className={`block w-full border ${errors.competencies ? "border-red-500" : "border-gray-300"} rounded-lg p-4 transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                        placeholder="Tell us about your skills, strengths, and why you'd be a great Campus Partner..."
                      />
                      {errors.competencies && <p className="text-red-600 text-sm mt-1 flex items-center gap-1"><AlertTriangle className="h-4 w-4" /> {errors.competencies}</p>}
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Submitting Application...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <Send className="h-5 w-5" />
                          Submit Application
                        </div>
                      )}
                    </motion.button>

                    <p className="text-center text-sm text-gray-500 mt-4">
                      We'll contact you within 2-3 business days after reviewing your application
                    </p>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default CampusPartnerForm;