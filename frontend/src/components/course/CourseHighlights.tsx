import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Briefcase,
  Users,
  Star,
  Award,
  BookOpen,
  Zap,
} from "lucide-react";

export interface Highlight {
  title: string;
  desc: string;
}

interface Props {
  highlights: Highlight[];
}

const CourseHighlights: React.FC<Props> = ({ highlights }) => {
  // Curated default highlights
  const defaultHighlights = [
    {
      title: "Live + Recorded Classes",
      desc: "Attend interactive sessions or learn at your own pace with full flexibility.",
      icon: <BookOpen className="h-7 w-7" />,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: "Hands-on Projects",
      desc: "Build 5+ portfolio-ready projects guided by industry mentors.",
      icon: <CheckCircle className="h-7 w-7" />,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      title: "Career Support",
      desc: "Mock interviews, resume prep & referrals to 50+ hiring partners.",
      icon: <Briefcase className="h-7 w-7" />,
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200"
    },
    {
      title: "1:1 Mentorship",
      desc: "Personal mentorship from experts throughout your journey.",
      icon: <Users className="h-7 w-7" />,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      title: "Job Guarantee",
      desc: "Placement support until you get hired in your dream role.",
      icon: <Star className="h-7 w-7" />,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200"
    },
    {
      title: "Industry Certificate",
      desc: "Earn a certificate recognized by top MNCs & startups.",
      icon: <Award className="h-7 w-7" />,
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200"
    },
  ];

  // ✅ Merge DB highlights with defaults
  const displayHighlights = [
    ...highlights.map((h, index) => ({
      ...h,
      icon: <CheckCircle className="h-7 w-7" />,
      color: defaultHighlights[index % defaultHighlights.length]?.color || "from-indigo-500 to-purple-500",
      bgColor: defaultHighlights[index % defaultHighlights.length]?.bgColor || "bg-indigo-50",
      borderColor: defaultHighlights[index % defaultHighlights.length]?.borderColor || "border-indigo-200"
    })),
    ...defaultHighlights,
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const hoverVariants = {
    hover: {
      y: -8,
      scale: 1.02,
      boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  return (
    <section className="relative py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_rgba(120,119,198,0.05),_transparent_70%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm pb-3 leading-tight">
            <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium text-gray-700">Highlights</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent pb-3 leading-tight">
            Course Highlights
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to succeed in your learning journey
          </p>
        </motion.div>

        {/* Highlights Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {displayHighlights.map((highlight, idx) => (
            <motion.div
              key={idx}
              variants={{ ...cardVariants, hover: hoverVariants.hover }}
              whileHover="hover"
              className="relative group cursor-pointer"
            >
              {/* Main Card */}
              <div className={`relative ${highlight.bgColor} backdrop-blur-sm rounded-2xl p-8 border ${highlight.borderColor} shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden h-full`}>
                
                {/* Background Gradient on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${highlight.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                {/* Icon Container */}
                <div className="mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${highlight.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {highlight.icon}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="font-semibold text-gray-900 text-xl mb-3 group-hover:text-gray-800 transition-colors">
                    {highlight.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {highlight.desc}
                  </p>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 -inset-1 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CourseHighlights;