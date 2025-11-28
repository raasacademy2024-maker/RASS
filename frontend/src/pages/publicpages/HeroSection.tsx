import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, TrendingUp, Users, Star, Award, Clock, Target, Building, Brain, Handshake } from "lucide-react";

// Define separate images for desktop and mobile only
const heroImages = {
  desktop: "https://res.cloudinary.com/dc3bi7giu/image/upload/v1760840218/httpswww.freepik.comfree-vectorhand-drawn-private-school-landing-page_32398807.htm_fromView_search_page_1_position_49_uuid_c9da476c-aca9-4b32-a4eb-26f8201e19bd_query_edtech_landing_page_3_znavyf.jpg",
  mobile: "https://res.cloudinary.com/dc3bi7giu/image/upload/v1760842149/mobile_hhhl1j.jpg"
};

const slide = {
  id: 1,
  title: ["Become the Talent", "that every Industry wants to Hire."],
  subtitle: "India's #1 Outcome-Focused Skills Learning Initiative, trusted by learners with proven results.",
  cta: "Explore Our Impact",
  accentColor: "blue",
  stats: [
    { value: "Startup India", label: "Recognized", icon: Award },
    { value: "AI Powered", label: "Learning Platform", icon: Brain },
    { value: "Industry", label: "Collaborations", icon: Handshake }
  ],
  features: ["Industry-aligned curriculum", "1:1 Mentorship", "Real-world projects"]
};

const colorMap = {
  blue: {
    primary: "bg-blue-600",
    hover: "hover:bg-blue-700",
    gradient: "from-blue-500 via-blue-600 to-blue-700",
    light: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-200",
    glow: "shadow-2xl shadow-blue-500/20"
  },
  emerald: {
    primary: "bg-emerald-600",
    hover: "hover:bg-emerald-700",
    gradient: "from-emerald-500 via-emerald-600 to-emerald-700",
    light: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-200",
    glow: "shadow-2xl shadow-emerald-500/20"
  },
  amber: {
    primary: "bg-amber-600",
    hover: "hover:bg-amber-700",
    gradient: "from-amber-500 via-amber-600 to-amber-700",
    light: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-200",
    glow: "shadow-2xl shadow-amber-500/20"
  },
  violet: {
    primary: "bg-violet-600",
    hover: "hover:bg-violet-700",
    gradient: "from-violet-500 via-violet-600 to-violet-700",
    light: "bg-violet-50",
    text: "text-violet-600",
    border: "border-violet-200",
    glow: "shadow-2xl shadow-violet-500/20"
  },
};

export function HeroCarousel() {
  const currentSlideData = slide;
  const currentAccent = colorMap[currentSlideData.accentColor];
  const [typedText, setTypedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let index = 0;
    const text = currentSlideData.subtitle;
    
    const typeInterval = setInterval(() => {
      if (index < text.length) {
        setTypedText(text.substring(0, index + 1));
        index++;
      } else {
        clearInterval(typeInterval);
        // Cursor blinking after typing is complete
        setTimeout(() => setShowCursor(false), 1000);
      }
    }, 50); // Adjust typing speed here (lower = faster)

    return () => clearInterval(typeInterval);
  }, [currentSlideData.subtitle]);

  return (
    <section className="relative h-[90vh] w-full overflow-hidden pt-0 mt-0">
      <br/>
      <br/>
      {/* Background Image - Single desktop version for tablet and larger screens, separate mobile version */}
      <div 
        className="absolute inset-0 bg-cover bg-center hidden sm:block"
        
        style={{ backgroundImage: `url(${heroImages.desktop})`, backgroundSize: '105%' }}
      />
      <div 
        className="absolute inset-0 bg-cover bg-center sm:hidden"
        style={{ backgroundImage: `url(${heroImages.mobile})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-conic from-white/5 via-transparent to-transparent animate-spin-slow" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-conic from-transparent via-white/5 to-transparent animate-spin-slower" />
      </div>

      {/* Main Content */}
      <div className="relative h-full max-w-7xl mx-auto flex items-center px-4 py-8">
        {/* Left Content - Full Width on Mobile, 60% on Desktop */}
        <div className="w-full lg:w-3/5 xl:w-2/3">
          <div className="max-w-2xl">
            <motion.h1
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-6xl font-bold text-blue-700 leading-tight pb-2"
            >
              {currentSlideData.title[0]}<br/>{currentSlideData.title[1]}
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-black/90 leading-relaxed mb-6 font-light"
            >
              {typedText}
              <span className={showCursor ? "inline-block w-1 h-8 md:h-10 bg-black ml-1 align-middle" : "hidden"}></span>
            </motion.p>

            {/* Stats - Unified version for tablet and desktop, separate mobile version */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="hidden sm:grid grid-cols-3 gap-2 md:gap-3 mt-8 mb-6"
            >
              {currentSlideData.stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="bg-blue-100 rounded-xl md:rounded-2xl p-2 md:p-3 border border-blue-200 hover:bg-blue-200 transition-all duration-300 w-40">
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-blue-50 p-1.5 md:p-2 rounded-lg md:rounded-xl mb-1 md:mb-2">
                        <IconComponent className="h-5 w-5 md:h-5 md:w-5 text-blue-700" />
                      </div>
                      <div className="text-center">
                        <div className="text-xs md:text-base font-bold text-blue-800">{stat.value}</div>
                        <div className="text-blue-700 text-[0.6rem] md:text-xs font-medium mt-0.5 md:mt-1 leading-tight">{stat.label}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>

            {/* Stats - Mobile Version (Visible on Mobile) - Now with blue background */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="sm:hidden flex flex-col items-start mt-6 mb-6"
            >
              {currentSlideData.stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="bg-blue-100 rounded-xl p-4 border-2 border-blue-200 hover:bg-blue-200 transition-all duration-300 mb-4 w-48">
                    <div className="flex items-center">
                      <div className="bg-blue-50 p-2 rounded-lg mr-4">
                        <IconComponent className="h-6 w-6 text-blue-700" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-blue-800">{stat.value}</div>
                        <div className="text-blue-700 text-sm font-medium leading-tight">{stat.label}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]" />
      </div>
    </section>
  );
}