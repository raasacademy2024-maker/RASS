// frontend/src/pages/Companies.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Briefcase,
  CheckCircle,
  Phone,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Building,
  Star,
  Shield,
  Clock,
  Target,
  Zap,
  Award,
  TrendingUp,
  Mail,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import HTDSection from "./HTDSection";
import SEO, { pageSEOConfig } from "../components/common/SEO";

const Companies: React.FC = () => {
  const heroImages = [
    { src: "/images/companies/hero-office.jpg", dark: false },
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(true);

  // Smooth fade slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Simulated loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="w-12 h-12 border-4 border-white border-t-transparent rounded-full"
        ></motion.div>
      </div>
    );
  }

  return (
    <div>
      <SEO {...pageSEOConfig.companies} />
      <Navbar />
      <div className="bg-white overflow-hidden">
{/* 🟣 Hero Section - Fixed for Mobile */}
<section className="relative min-h-screen md:h-[90vh] flex flex-col md:flex-row items-center justify-between px-6 md:px-12 lg:px-20 overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 py-10 md:py-0">
  {/* Decorative elements */}
  <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
  <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
  <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
  
  {/* Left Content */}
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="md:w-1/2 text-center md:text-left z-10 order-2 md:order-1 mt-8 md:mt-0"
  >
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
      Hire <span className="text-yellow-300">Certified Talent</span>{" "}
      Ready Before Day One
    </h1>
    <p className="text-lg text-white/90 mb-8 max-w-md mx-auto md:mx-0">
      Partner with RASS Academy to access pre-trained, project-ready
      professionals who contribute from the very first day.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
      <a
        href="/company-partnership"
        className="px-8 py-3 bg-yellow-400 text-gray-900 rounded-lg font-medium hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-lg text-center"
      >
        Become a Partner
      </a>
    </div>
  </motion.div>

  {/* Right Image Player - Fixed for Mobile */}
  <div className="md:w-1/2 relative w-full h-[280px] sm:h-[320px] md:h-[400px] lg:h-[500px] mt-6 md:mt-0 rounded-2xl overflow-hidden shadow-2xl order-1 md:order-2 z-0">
    <AnimatePresence mode="wait">
      <motion.img
        key={heroImages[currentImage].src}
        src={heroImages[currentImage].src}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0 w-full h-full object-cover"
        alt="Hero"
      />
    </AnimatePresence>
    <div
      className={`absolute inset-0 ${
        heroImages[currentImage].dark
          ? "bg-black/40"
          : "bg-gradient-to-t from-purple-900/50 to-transparent"
      }`}
    />
  </div>
</section>


        {/* 🧠 About Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-16 md:py-20 bg-gradient-to-br from-blue-50 to-indigo-100 text-center px-6"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              About RASS Academy
            </h2>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              We bridge the gap between academia and industry by providing
              students with real-world, project-based training and certifications.
              Our mission: empower graduates to be industry-ready while giving
              companies access to trained, job-ready professionals.
            </p>
          </div>
        </motion.section>
        
        <HTDSection />
        
        {/* 💼 Partnership Models */}
        <section className="py-16 md:py-20 max-w-7xl mx-auto px-6 space-y-16 md:space-y-24">
          {/* Direct Hire */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8 md:gap-10 items-center"
          >
            <div className="space-y-6 order-2 md:order-1">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                Direct Hire: Access Pre-Screened Talent
              </h3>
              <p className="text-gray-600 text-base md:text-lg">
                Ideal for companies that need skilled talent immediately. Access
                job-ready interns who require no additional onboarding effort.
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex gap-2 items-center">
                  <CheckCircle className="h-5 w-5 text-green-600" /> Browse
                  certified candidates
                </li>
                <li className="flex gap-2 items-center">
                  <CheckCircle className="h-5 w-5 text-green-600" /> Hire and
                  onboard instantly
                </li>
              </ul>
              <a
                href="/company-partnership"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition transform hover:scale-105 shadow-lg text-sm md:text-base"
              >
                Learn More <ArrowRight className="h-5 w-5" />
              </a>
            </div>
            <div className="relative order-1 md:order-2">
              <img
                src="/images/companies/hire-model.jpg"
                alt="Hire model"
                className="rounded-2xl shadow-lg object-cover w-full h-auto"
              />
              <div className="absolute -bottom-4 -right-4 w-16 h-16 md:w-24 md:h-24 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                <Zap className="h-6 w-6 md:h-10 md:w-10 text-gray-900" />
              </div>
            </div>
          </motion.div>

          {/* Training-to-Hire */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8 md:gap-10 items-center"
          >
            <div className="relative order-1 md:order-1">
              <img
                src="/images/companies/training-hire.jpg"
                alt="Training program"
                className="rounded-2xl shadow-lg object-cover w-full h-auto"
              />
              <div className="absolute -top-4 -left-4 w-16 h-16 md:w-24 md:h-24 bg-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <Award className="h-6 w-6 md:h-10 md:w-10 text-white" />
              </div>
            </div>
            <div className="space-y-6 order-2 md:order-2">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                Training-to-Hire: Custom Workforce Development
              </h3>
              <p className="text-gray-600 text-base md:text-lg">
                Build a custom-trained workforce aligned with your project goals.
                Reduce hiring risks while improving team productivity.
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex gap-2 items-center">
                  <Briefcase className="h-5 w-5 text-green-600" /> Tailored
                  programs based on your stack
                </li>
                <li className="flex gap-2 items-center">
                  <Shield className="h-5 w-5 text-green-600" /> Skilled interns
                  trained for your needs
                </li>
              </ul>
              <a
                href="/company-partnership"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-teal-700 transition transform hover:scale-105 shadow-lg text-sm md:text-base"
              >
                Learn More <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </motion.div>
        </section>

        {/* ⚙️ Startup Challenges & Solutions */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-orange-50 to-red-100 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 md:gap-10 items-start"
          >
            {/* Challenges */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <AlertTriangle className="text-red-500 h-6 w-6 md:h-7 md:w-7" /> Startup
                Challenges
              </h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-xl md:text-2xl">💸</span>
                  <span>High hiring costs & limited access to skilled talent.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl md:text-2xl">⚡</span>
                  <span>Risk of mismatched hires slowing project delivery.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl md:text-2xl">⏱️</span>
                  <span>Long onboarding times that delay productivity.</span>
                </li>
              </ul>
            </div>

            {/* Solutions */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Lightbulb className="text-green-500 h-6 w-6 md:h-7 md:w-7" /> RASS Solutions
              </h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-xl md:text-2xl">✅</span>
                  <span>Access pre-trained, certified professionals ready from day one.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl md:text-2xl">🧠</span>
                  <span>Reduce onboarding & training costs through verified skills.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl md:text-2xl">🚀</span>
                  <span>Flexible hire models: project-based or full-time talent.</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </section>

        {/* 💡 Benefits */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-16 md:py-20 max-w-7xl mx-auto px-6 text-center bg-gradient-to-br from-purple-50 to-pink-50"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 md:mb-10">
            Why Partner with RASS Academy
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: <Clock className="h-8 w-8 md:h-10 md:w-10 text-indigo-600 mb-4" />,
                title: "Immediate Productivity",
                desc: "Interns require minimal onboarding.",
                color: "from-blue-500 to-indigo-600"
              },
              {
                icon: <Users className="h-8 w-8 md:h-10 md:w-10 text-green-600 mb-4" />,
                title: "Zero-Cost Pipeline",
                desc: "Access skilled, pre-trained students for free.",
                color: "from-green-500 to-teal-600"
              },
              {
                icon: <Lightbulb className="h-8 w-8 md:h-10 md:w-10 text-yellow-500 mb-4" />,
                title: "Fresh Perspectives",
                desc: "Students bring creativity & innovation.",
                color: "from-yellow-500 to-orange-600"
              },
              {
                icon: <TrendingUp className="h-8 w-8 md:h-10 md:w-10 text-purple-600 mb-4" />,
                title: "Scalable Workforce",
                desc: "Scale your team up or down as needed.",
                color: "from-purple-500 to-pink-600"
              },
              {
                icon: <Shield className="h-8 w-8 md:h-10 md:w-10 text-red-600 mb-4" />,
                title: "Verified Skills",
                desc: "All candidates are certified and tested.",
                color: "from-red-500 to-pink-600"
              },
              {
                icon: <Target className="h-8 w-8 md:h-10 md:w-10 text-indigo-600 mb-4" />,
                title: "Project-Ready",
                desc: "Talent trained specifically for your industry.",
                color: "from-indigo-500 to-purple-600"
              }
            ].map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-all transform hover:-translate-y-2 overflow-hidden relative"
              >
                <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${b.color}`}></div>
                {b.icon}
                <h4 className="text-lg md:text-xl font-bold mb-2">{b.title}</h4>
                <p className="text-gray-600 text-sm md:text-base">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 🚀 Final CTA */}
        <section
          className="relative py-16 md:py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          </div>
          
          <div className="relative max-w-5xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Access Job-Ready Talent?
            </h2>
            <p className="text-base md:text-lg text-white/90 mb-8">
              Zero-cost, pre-trained professionals certified and ready for your
              projects. Join our hiring network today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <a
                href="/company-partnership"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-yellow-400 text-gray-900 font-semibold rounded-lg shadow-lg hover:bg-yellow-300 transition transform hover:scale-105 text-sm md:text-base"
              >
                <Phone className="h-5 w-5" /> Become a Partner
              </a>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.href = 'tel:+919063194887'}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium rounded-lg hover:bg-white/20 transition-all duration-300"
              >
                <Phone className="h-5 w-5" />
                Call: +91 9063194887
              </button>
              <button
                onClick={() => window.open('mailto:partnerships@raasacademy.com', '_blank')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium rounded-lg hover:bg-white/20 transition-all duration-300"
              >
                <Mail className="h-5 w-5" />
                Email: partnerships@raasacademy.com
              </button>
            </div>
          </div>
        </section>

        <Footer />
      </div>

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

export default Companies;