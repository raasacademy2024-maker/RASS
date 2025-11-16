import React from "react";
import { motion } from "framer-motion";
import { 
  Clock, 
  Users, 
  Star, 
  Layers, 
  Award, 
  Calendar,
  Target,
  Zap,
  BookOpen,
  BadgeCheck,
  Video
} from "lucide-react";
import { Course } from "../../types";

interface Props {
  course: Course;
}

const CourseDetails: React.FC<Props> = ({ course }) => {
  const rating = course.rating?.average ?? 0;
  const ratingCount = course.rating?.count ?? 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
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
      y: -5,
      scale: 1.02,
      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    }
  };

  const details = [
    {
      icon: <Clock className="h-7 w-7" />,
      label: "Duration",
      value: `${Math.round(course.totalDuration / 60)} hours`,
      description: "Total learning time",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      icon: <Users className="h-7 w-7" />,
      label: "Enrollments",
      value: `${course.enrollmentCount}+`,
      description: "Active students",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      icon: <Star className="h-7 w-7" />,
      label: "Rating",
      value: `${rating.toFixed(1)}/5.0`,
      description: `${ratingCount} reviews`,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200"
    },
    {
      icon: <Layers className="h-7 w-7" />,
      label: "Level",
      value: course.level.charAt(0).toUpperCase() + course.level.slice(1),
      description: "Skill level",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      icon: <BookOpen className="h-7 w-7" />,
      label: "Lessons",
      value: `${course.lessonsCount}+`,
      description: "Learning modules",
      color: "from-indigo-500 to-blue-500",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200"
    },
    {
      icon: <Award className="h-7 w-7" />,
      label: "Certificate",
      value: "Included",
      description: "Industry recognized",
      color: "from-teal-500 to-green-500",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200"
    },
    {
      icon: <Video className="h-7 w-7" />,
      label: "Format",
      value: "Hybrid",
      description: "Live + Recorded",
      color: "from-red-500 to-rose-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
    {
      icon: <Calendar className="h-7 w-7" />,
      label: "Access",
      value: "Lifetime",
      description: "Learn at your pace",
      color: "from-violet-500 to-purple-500",
      bgColor: "bg-violet-50",
      borderColor: "border-violet-200"
    },
    {
      icon: <Target className="h-7 w-7" />,
      label: "Projects",
      value: "10+ Real",
      description: "Hands-on practice",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    }
  ];

  const getLevelColor = (level: string) => {
    const colors = {
      beginner: "from-green-500 to-emerald-500",
      intermediate: "from-blue-500 to-cyan-500",
      advanced: "from-purple-500 to-pink-500",
      expert: "from-red-500 to-orange-500"
    };
    return colors[level as keyof typeof colors] || colors.beginner;
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl" />
      </div>

      <div className="relative bg-gradient-to-br from-white/80 via-blue-50/30 to-purple-50/30 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm mb-4">
            <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium text-gray-700">Course Overview</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent pb-3 leading-tight">
            Everything You Need to Know
          </h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Comprehensive course details to help you make the right learning decision
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-12"
        >
          {details.slice(0, 5).map((item, idx) => (
            <motion.div
              key={idx}
              variants={{ ...itemVariants, hover: hoverVariants.hover }}
              whileHover="hover"
              className={`relative group p-6 rounded-2xl ${item.bgColor} border ${item.borderColor} backdrop-blur-sm cursor-pointer overflow-hidden`}
            >
              {/* Background Gradient on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              {/* Icon with Gradient Background */}
              <div className={`relative mb-4 w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <div className="text-white">
                  {item.icon}
                </div>
              </div>

              {/* Content */}
              <div className="relative">
                <div className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-gray-800 transition-colors">
                  {item.value}
                </div>
                <div className="text-sm font-semibold text-gray-700 mb-1">
                  {item.label}
                </div>
                <div className="text-xs text-gray-500">
                  {item.description}
                </div>
              </div>

              {/* Shine Effect */}
              <div className="absolute inset-0 -inset-1 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <BadgeCheck className="w-6 h-6 text-green-500" />
            Course Features & Benefits
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {details.slice(5).map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className={`flex items-center gap-4 p-4 rounded-xl ${item.bgColor} border ${item.borderColor} backdrop-blur-sm transition-all duration-300`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-md`}>
                  <div className="text-white">
                    {React.cloneElement(item.icon, { className: "h-5 w-5" })}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 text-sm">
                    {item.value}
                  </div>
                  <div className="text-xs text-gray-600">
                    {item.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        
      </div>
    </section>
  );
};

export default CourseDetails;