import React from "react";
import { motion } from "framer-motion";
import { Users, Award, Target, Briefcase, Zap, BookOpen } from "lucide-react";

interface Props {
  description: string;
}

const CourseDescription: React.FC<Props> = ({ description }) => {
  if (!description) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <section className="relative py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50/10 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-802 h-92 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_rgba(120,119,198,0.05),_transparent_70%)]" />
      </div>

      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/60 p-10"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-22">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm mb-6">
              <BookOpen className="w-9 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-gray-700">Course Overview</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent pb-3 leading-tight">
              About This Course
            </h2>
          </motion.div>

          {/* Main Description */}
          <motion.div variants={itemVariants} className="mb-12">
            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line text-center max-w-3xl mx-auto">
              {description}
            </p>
          </motion.div>

          {/* Why Choose This Course */}
          <motion.div variants={itemVariants} className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center gap-3">
              <Zap className="w-6 h-6 text-yellow-500" />
              Why Choose This Program?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: <Award className="w-6 h-6" />,
                  title: "Industry-Recognized Certificate",
                  description: "Get certified upon completion with industry-valued credentials",
                  color: "from-yellow-500 to-amber-500",
                  bgColor: "bg-yellow-50",
                  borderColor: "border-yellow-200"
                },
                {
                  icon: <Users className="w-6 h-6" />,
                  title: "1:1 Mentorship & Support",
                  description: "Personalized guidance and dedicated community support",
                  color: "from-indigo-500 to-blue-500",
                  bgColor: "bg-indigo-50",
                  borderColor: "border-indigo-200"
                },
                {
                  icon: <Briefcase className="w-6 h-6" />,
                  title: "Placement Assistance",
                  description: "Connect with 50+ hiring partners and top companies",
                  color: "from-green-500 to-emerald-500",
                  bgColor: "bg-green-50",
                  borderColor: "border-green-200"
                },
                {
                  icon: <Target className="w-6 h-6" />,
                  title: "Real-World Projects",
                  description: "Learn by building industry-relevant projects and portfolio",
                  color: "from-pink-500 to-rose-500",
                  bgColor: "bg-pink-50",
                  borderColor: "border-pink-200"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ 
                    y: -2,
                    scale: 1.02,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                    transition: { type: "spring", stiffness: 800, damping: 17 }
                  }}
                  className={`${feature.bgColor} border ${feature.borderColor} rounded-2xl p-6 backdrop-blur-sm cursor-pointer group overflow-hidden relative`}
                >
                  {/* Background Gradient on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <div className="text-white">
                        {feature.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-gray-800 transition-colors">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Shine Effect */}
                  <div className="absolute inset-0 -inset-1 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Who Is This Course For */}
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center gap-3">
              <Users className="w-6 h-6 text-blue-500" />
              Who Is This Course For?
            </h3>
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 border border-gray-200/60 shadow-lg">
              <p className="text-gray-700 text-lg text-center mb-6 font-medium">
                This program is designed for:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    text: "Freshers who want to kickstart a career in tech",
                    color: "from-blue-500 to-cyan-500",
                    icon: "🎓"
                  },
                  {
                    text: "Working professionals looking to switch domains",
                    color: "from-purple-500 to-pink-500",
                    icon: "💼"
                  },
                  {
                    text: "Students aiming to strengthen their portfolio",
                    color: "from-green-500 to-emerald-500",
                    icon: "📚"
                  },
                  {
                    text: "Anyone passionate about learning by doing",
                    color: "from-amber-500 to-orange-500",
                    icon: "💡"
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300 group"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-white text-xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      {item.icon}
                    </div>
                    <span className="text-gray-800 text-sm font-medium">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CourseDescription;