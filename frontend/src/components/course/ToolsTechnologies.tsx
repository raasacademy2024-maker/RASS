import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";

export interface Tool {
  name: string;
  imageUrl?: string;
  color?: string;
}

interface Props {
  tools: Tool[];
}

const ToolsTechnologies: React.FC<Props> = ({ tools }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (!tools || tools.length === 0) return null;

  // Split tools into rows of 5
  const chunkedTools = [];
  for (let i = 0; i < tools.length; i += 5) {
    chunkedTools.push(tools.slice(i, i + 5));
  }

  const getToolColor = (toolName: string) => {
    const colors: { [key: string]: string } = {
      Python: "bg-gradient-to-br from-blue-500 to-blue-600",
      SQL: "bg-gradient-to-br from-orange-500 to-red-500",
      NumPy: "bg-gradient-to-br from-indigo-500 to-purple-600",
      Pandas: "bg-gradient-to-br from-blue-600 to-blue-700",
      Seaborn: "bg-gradient-to-br from-teal-500 to-green-500",
      "scikit-learn": "bg-gradient-to-br from-orange-500 to-yellow-500",
      Keras: "bg-gradient-to-br from-red-500 to-pink-500",
      Tensorflow: "bg-gradient-to-br from-orange-500 to-red-600",
      Transformers: "bg-gradient-to-br from-yellow-500 to-amber-500",
      ChatGPT: "bg-gradient-to-br from-green-500 to-emerald-600",
      OpenCV: "bg-gradient-to-br from-red-600 to-rose-600",
      SpaCy: "bg-gradient-to-br from-indigo-500 to-violet-500",
      LangChain: "bg-gradient-to-br from-blue-700 to-blue-800",
      Docker: "bg-gradient-to-br from-blue-400 to-cyan-500",
      Flask: "bg-gradient-to-br from-gray-800 to-black",
      Whisper: "bg-gradient-to-br from-purple-500 to-violet-600",
      "ML Flow": "bg-gradient-to-br from-blue-800 to-indigo-900",
      Github: "bg-gradient-to-br from-gray-900 to-black",
      Gemini: "bg-gradient-to-br from-blue-500 to-cyan-500",
      "DALL-E": "bg-gradient-to-br from-green-500 to-teal-500",
      "Dall.E": "bg-gradient-to-br from-green-500 to-emerald-500",
    };
    return colors[toolName] || "bg-gradient-to-br from-gray-500 to-gray-600";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section className="relative py-20 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent pb-3 leading-tight"
          >
            Tools & Technologies
          </motion.h2>
        </div>

        {/* Centered Rows of 5 Rectangular Tool Cards */}
        <div className="flex flex-col items-center gap-8 mb-20">
          {chunkedTools.map((row, rowIndex) => (
            <motion.div
              key={rowIndex}
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              className="flex justify-center gap-8 flex-wrap"
            >
              {row.map((tool) => (
                <motion.div
                  key={tool.name}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="relative group w-52 h-12 sm:w-52 sm:h-24 bg-white/80 backdrop-blur-md border border-gray-200/70 rounded-2xl shadow-md hover:shadow-xl overflow-hidden transition-all"
                >
                  {/* Background Image */}
                  {tool.imageUrl ? (
                    <img
                      src={tool.imageUrl}
                      alt={tool.name}
                      className="w-full h-full object-contain filter group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div
                      className={`${getToolColor(
                        tool.name
                      )} w-full h-full flex items-center justify-center`}
                    >
                      <span className="text-white font-bold text-lg tracking-tight">
                        {tool.name[0]}
                      </span>
                    </div>
                  )}

                  {/* Overlay + Tooltip */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <span className="text-white font-semibold text-base px-2 py-1 rounded-lg bg-black/50">
                      {tool.name}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ))}
        </div>

        {/* Floating Contact Form Button */}
        <AnimatePresence>
          {!isFormOpen && (
            <motion.button
              initial={{ opacity: 0, scale: 0, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0, y: 100 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsFormOpen(true)}
              className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-2xl flex items-center justify-center"
            >
              <MessageCircle className="w-7 h-7 text-white" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ToolsTechnologies;