// src/pages/UniversitiesPage.tsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  GraduationCap, CheckCircle, BookOpen, Network, Star, Briefcase, 
  Users, Award, ArrowRight, TrendingUp, Globe, Lightbulb, Target,
  ChevronRight, Quote, Calendar, Clock, UserCheck,
  BarChart, Zap, Shield, Heart, MessageSquare, Phone, Mail,
  Check,
  ChevronLeft
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Link, useNavigate } from "react-router-dom";
import SEO, { pageSEOConfig } from "../components/common/SEO";

const heroImages = [
    "/images/universities/university-cta-bg.jpg",
  ];

const UniversitiesPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Auto-rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { value: "200+", label: "Partner Universities", icon: Globe },
    { value: "50K+", label: "Students Trained", icon: Users },
    { value: "85%", label: "Placement Rate", icon: TrendingUp },
    { value: "95%", label: "Satisfaction", icon: Star },
  ];

  const benefits = [
    {
      icon: Target,
      title: "Industry-Aligned Curriculum",
      description: "Courses designed with industry experts to ensure relevance and practical application."
    },
    {
      icon: Award,
      title: "Recognized Certifications",
      description: "Industry-recognized certifications that add value to student resumes."
    },
    {
      icon: Briefcase,
      title: "Placement Support",
      description: "Dedicated placement assistance and connections to hiring partners."
    },
    {
      icon: Network,
      title: "Industry Connections",
      description: "Regular interactions with industry professionals and alumni networks."
    },
  ];

  const partnershipModels = [
    {
      title: "Value-Added Programs",
      description: "Supplementary certification programs that complement existing curriculum.",
      features: ["Flexible scheduling", "Customizable content", "Online and offline options"],
      icon: BookOpen
    },
    {
      title: "Integrated Curriculum",
      description: "Seamlessly integrated modules within existing courses.",
      features: ["Faculty training", "Joint certification", "Shared resources"],
      icon: Lightbulb
    },
    {
      title: "Career Bootcamps",
      description: "Intensive short-term programs focused on specific skills.",
      features: ["Hands-on projects", "Industry mentors", "Placement assistance"],
      icon: Zap
    },
    {
      title: "Faculty Development",
      description: "Training programs for university faculty to enhance teaching methods.",
      features: ["Industry exposure", "Pedagogical training", "Resource access"],
      icon: UserCheck
    },
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      position: "Dean of Computer Science",
      university: "TechVision University",
      content: "Our partnership with RASS Academy has transformed our computer science program. Students are now more industry-ready and our placement rates have increased significantly.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
    },
    {
      name: "Prof. Michael Chen",
      position: "Head of Engineering",
      university: "Global Institute of Technology",
      content: "The industry-aligned curriculum provided by RASS Academy has been instrumental in bridging the gap between academic knowledge and practical skills.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
    },
    {
      name: "Dr. Emily Rodriguez",
      position: "Director of Career Services",
      university: "Innovation University",
      content: "RASS Academy's placement support has been exceptional. Our students are now getting placed in top companies with competitive packages.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80"
    }
  ];

  const faqs = [
    {
      question: "How does the partnership process work?",
      answer: "Our partnership process begins with an initial consultation to understand your institution's needs. We then customize our programs to align with your curriculum and goals. After agreement, we provide faculty training and gradually implement the programs with continuous support."
    },
    {
      question: "What resources are required from the university?",
      answer: "We require minimal resources from your end. Typically, we need access to classrooms for training sessions, basic IT infrastructure, and a coordinator from your side to facilitate communication. Our team handles most of the heavy lifting."
    },
    {
      question: "How are the programs evaluated for effectiveness?",
      answer: "We have a comprehensive evaluation system that includes student feedback, performance assessments, placement metrics, and regular reviews with university leadership. We provide detailed reports on program effectiveness and areas for improvement."
    },
    {
      question: "Can the programs be customized to our specific needs?",
      answer: "Absolutely! We pride ourselves on our flexibility. Our team works closely with your faculty to customize content, delivery methods, and evaluation criteria to match your institution's specific requirements and industry focus."
    }
  ];

  return (
    <div>
      <SEO {...pageSEOConfig.universities} />
      <Navbar />
{/* Hero Section */}
<section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
  <div className="absolute inset-0">
    {/* Animated Background Elements */}
    <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
  </div>

  <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      
      {/* Left Side - Content */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="text-white space-y-8"
      >
        {/* Main Heading - Forced into 2 lines */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-5xl lg:text-5xl font-extrabold leading-tight">
            <span className="block text-blue-400">Empowering Universities</span>
            <span className="block text-pink-400">& Transforming Students</span>
          </h1>

          <p className="text-lg md:text-xl text-indigo-100 leading-relaxed max-w-2xl">
            RASS Academy partners with institutions to bridge the gap between{" "}
            <span className="font-semibold text-yellow-300">education</span> and{" "}
            <span className="font-semibold text-yellow-300">employability</span>, 
            preparing students with real-world skills and industry-recognized certifications.
          </p>
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 pt-4"
        >
          <button
            onClick={() => {
              navigate('/university-partnership');
              window.scrollTo(0, 0);
            }}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-bold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            <span className="relative">Start a Partnership</span>
            <ArrowRight className="h-5 w-5 relative transform group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </motion.div>
      </motion.div>

      {/* Right Side - Image Carousel (Reduced Size) */}
      <motion.div
        initial={{ opacity: 1, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative"
      >
        {/* Main Image Container - Reduced Height */}
        <div className="relative h-[450px] rounded-3xl overflow-hidden shadow-xl">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, scale: 1.05, x: 80 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: -80 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={heroImages[currentImage]}
              alt="University partnership"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 via-transparent to-purple-900/20"></div>
          </motion.div>

          {/* Floating Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="absolute bottom-6 left-6 right-6"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Industry Ready Graduates</h3>
                  <p className="text-indigo-100 text-sm">90% of our partners see improved placement rates</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Image Indicators */}
        <div className="flex justify-center gap-5 mt-8">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`relative group transition-all duration-300 ${
                currentImage === index ? "w-10" : "w-6"
              }`}
            >
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentImage === index
                    ? "bg-gradient-to-r from-yellow-400 to-orange-400"
                    : "bg-white/30 hover:bg-white/50"
                }`}
              />
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  </div>

  {/* Scroll Indicator */}
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 1.5, duration: 0.5 }}
    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
  >
    <div className="flex flex-col items-center gap-2 text-white/60">
      <span className="text-sm">Scroll to explore</span>
      <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-1 h-3 bg-white/60 rounded-full mt-2"
        />
      </div>
    </div>
  </motion.div>
</section>



      {/* Bridging the Gap Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="order-2 md:order-1"
            >
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-72 h-72 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full filter blur-3xl opacity-70"></div>
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
                  alt="Bridge Learning"
                  className="relative rounded-2xl shadow-2xl border-4 border-white"
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="order-1 md:order-2"
            >
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
                  <Lightbulb className="h-4 w-4" />
                  Our Approach
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Bridging the Gap Between Classroom and Career
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Our university partnerships help students apply academic knowledge to real-world challenges through certifications, projects, and placement-oriented training-without adding burden to faculty or existing syllabi.
                </p>
              </div>
              
              <div className="space-y-4">
                {[
                  "Industry-aligned curriculum design",
                  "Hands-on project-based learning",
                  "Expert mentorship from industry professionals",
                  "Continuous assessment and feedback"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mt-0.5">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
              <Award className="h-4 w-4" />
              Benefits
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Universities Partner with RASS Academy
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the transformative benefits our university partners experience
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-lg p-8 h-full"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                  <benefit.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Models Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
              <Network className="h-4 w-4" />
              Partnership Models
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Flexible Partnership Models for Universities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the engagement model that aligns best with your institutional goals
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {partnershipModels.map((model, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-2xl p-8 border border-indigo-100"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <model.icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{model.title}</h3>
                    <p className="text-gray-600">{model.description}</p>
                  </div>
                </div>
                
                <ul className="space-y-3">
                  {model.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      

      {/* Final CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-indigo-900 to-purple-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-black/20"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full filter blur-3xl opacity-20"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500 rounded-full filter blur-3xl opacity-20"></div>
          </div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Let's Build Future-Ready Graduates Together
            </h2>
            <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
              Join the network of universities shaping the next generation of skilled professionals through RASS Academy's industry-aligned programs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => {
                  navigate('/university-partnership');
                  window.scrollTo(0, 0);
                }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-bold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Start Partnership <ArrowRight className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.href = 'tel:+919063194887'}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium rounded-full hover:bg-white/20 transition-all duration-300"
              >
                <Phone className="h-5 w-5" />
                Call: +91 9063194887
              </button>
              <button
                onClick={() => window.open('mailto:partnerships@raasacademy.com', '_blank')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium rounded-full hover:bg-white/20 transition-all duration-300"
              >
                <Mail className="h-5 w-5" />
                Email: partnerships@raasacademy.com
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default UniversitiesPage;