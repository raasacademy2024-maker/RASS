import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, UserCheck, BookOpen, GraduationCap, Briefcase } from "lucide-react";

export interface JourneyStep {
  step: string;
  desc: string;
}

interface Props {
  journey: JourneyStep[];
}

const LearningJourney: React.FC<Props> = ({ journey }) => {
  const steps = journey.length
    ? journey
    : [
        { step: "Apply", desc: "Submit your application and get shortlisted." },
        { step: "Screening", desc: "Clear a quick aptitude + communication round." },
        { step: "Enroll", desc: "Choose your batch and pay the registration fee." },
        { step: "Learn", desc: "Attend live classes, projects & mentorship." },
        { step: "Get Placed", desc: "Crack top companies with our placement support." },
      ];

  const getStepIcon = (index: number) => {
    const icons = [
      <UserCheck className="w-6 h-6" />,
      <CheckCircle className="w-6 h-6" />,
      <BookOpen className="w-6 h-6" />,
      <GraduationCap className="w-6 h-6" />,
      <Briefcase className="w-6 h-6" />
    ];
    return icons[index] || <CheckCircle className="w-6 h-6" />;
  };

  const getStepColor = (index: number) => {
    const colors = [
      "from-blue-500 to-cyan-500",
      "from-purple-500 to-pink-500",
      "from-green-500 to-emerald-500",
      "from-orange-500 to-red-500",
      "from-indigo-500 to-blue-500"
    ];
    return colors[index % colors.length];
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
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
      y: -2,
      scale: 1.05,
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
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm mb-6">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-gray-700">Admission Process</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent pb-3 leading-tight">
            Your Learning Journey
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Simple steps from application to placement in your dream company
          </p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="relative"
        >
          {/* Connecting Line - Hidden on mobile */}
          <div className="hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 -z-10" />
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                variants={{ ...itemVariants, hover: hoverVariants.hover }}
                whileHover="hover"
                className="relative group"
              >
                {/* Step Card */}
                <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/60 shadow-lg hover:shadow-2xl transition-all duration-500 text-center flex flex-col items-center h-full">
                  
                  {/* Background Gradient on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${getStepColor(idx)} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`} />
                  
                  {/* Step Number with Gradient */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${getStepColor(idx)} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 mb-6`}>
                    <div className="text-white font-bold text-xl">
                      {idx + 1}
                    </div>
                  </div>

                  {/* Step Icon */}
                  <div className="mb-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-300">
                      {getStepIcon(idx)}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="font-bold text-gray-900 text-lg mb-3 group-hover:text-gray-800 transition-colors">
                    {step.step}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed flex-1">
                    {step.desc}
                  </p>

                  {/* Shine Effect */}
                  <div className="absolute inset-0 -inset-1 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 rounded-2xl" />
                </div>

                {/* Arrow Connector - Hidden on mobile */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-10">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.2 + 0.5 }}
                      className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </motion.div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>


      </div>
    </section>
  );
};

export default LearningJourney;