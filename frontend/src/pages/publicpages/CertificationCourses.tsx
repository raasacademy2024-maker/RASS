import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  ChevronRight, 
  Users, 
  Target, 
  Award, 
  Clock, 
  Zap, 
  BookOpen, 
  BarChart3,
  Sparkles,
  GraduationCap,
  Brain,
  Code,
  Shield,
  Star,
  ArrowRight,
  Apple
} from 'lucide-react';

// Define types for our data
interface Feature {
  id: number;
  title: string;
  description: string;
  icon: JSX.Element;
  color: string;
}

interface CourseBenefit {
  id: number;
  title: string;
  description: string;
  icon: JSX.Element;
}

// Main component
const CertificationCourses: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Data for our features
  const features: Feature[] = [
    {
      id: 1,
      title: "Flexible Blended Learning",
      description: "Experience the energy of live, instructor-led classes combined with the freedom of self-paced preparatory modules.",
      icon: <Clock className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-400"
    },
    {
      id: 2,
      title: "Applied, Hands-On Learning",
      description: "Bridge the gap between theory and practice with immersive projects and labs that mirror professional tasks.",
      icon: <Zap className="w-6 h-6" />,
      color: "from-purple-500 to-pink-400"
    },
    {
      id: 3,
      title: "Practice for Mastery",
      description: "Ensure you master every concept with module-specific assignments and practical challenges designed to test your knowledge.",
      icon: <Target className="w-6 h-6" />,
      color: "from-green-500 to-emerald-400"
    },
    {
      id: 4,
      title: "Central Learning Hub",
      description: "Navigate your entire learning journey from lessons to peer collaboration on one intuitive, state-of-the-art platform.",
      icon: <BookOpen className="w-6 h-6" />,
      color: "from-orange-500 to-red-400"
    },
    {
      id: 5,
      title: "Data-Driven Insights",
      description: "Track your learning journey and identify areas for improvement with a personalized dashboard showing detailed performance analytics.",
      icon: <BarChart3 className="w-6 h-6" />,
      color: "from-teal-500 to-green-400"
    },
    {
      id: 6,
      title: "Innovate & Compete",
      description: "Showcase your talent to the industry by participating in high-stakes hackathons and real-world coding challenges.",
      icon: <Code className="w-6 h-6" />,
      color: "from-rose-500 to-pink-400"
    },
    {
      id: 7,
      title: "Bridge to Your Career",
      description: "Translate your training into professional experience by qualifying for exclusive internship opportunities with our network of partner companies.",
      icon: <GraduationCap className="w-6 h-6" />,
      color: "from-violet-500 to-purple-400"
    },
    {
      id: 8,
      title: "Learn from the Best",
      description: "Go beyond the curriculum with exclusive masterclasses and Q&A sessions featuring top-tier leaders from industry and academia.",
      icon: <Star className="w-6 h-6" />,
      color: "from-amber-500 to-yellow-400"
    },
    {
      id: 9,
      title: "Exclusive Community Events",
      description: "Stay on the cutting edge with our regular lineup of expert-led workshops, webinars, and virtual conferences.",
      icon: <Sparkles className="w-6 h-6" />,
      color: "from-cyan-500 to-blue-400"
    }
  ];

  // Data for our benefits
  const benefits: CourseBenefit[] = [
    {
      id: 1,
      title: "Mastering the Art of Learning",
      description: "Develop effective learning strategies that will serve you throughout your career.",
      icon: <Brain className="w-8 h-8" />
    },
    {
      id: 2,
      title: "Building Skills Through Practice",
      description: "Reinforce your knowledge with hands-on exercises and real-world applications.",
      icon: <Target className="w-8 h-8" />
    },
    {
      id: 3,
      title: "Learning with a Peer Community",
      description: "Collaborate and grow with like-minded individuals on the same learning journey.",
      icon: <Users className="w-8 h-8" />
    },
    {
      id: 4,
      title: "Proving Talent in Competitions",
      description: "Test your skills against others and demonstrate your abilities in competitive environments.",
      icon: <Award className="w-8 h-8" />
    }
  ];

  // Handle scroll for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate featured section
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setSelectedFeature(prev => (prev % features.length) + 1);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, features.length]);

  const currentFeature = features.find(f => f.id === selectedFeature);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden"
    >
      {/* iOS/macOS Style Background Elements */}
      <div className="absolute inset-0">
        {/* Floating bubbles */}
        <div 
          className="absolute top-20 left-10 w-72 h-72 bg-blue-200/10 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        />
        <div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.15}px)` }}
        />
        <div 
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-200/10 rounded-full blur-3xl"
          style={{ transform: `translate(${scrollY * 0.05}px, ${scrollY * 0.1}px)` }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Header Section with iOS-style typography */}
        <header className="text-center mb-20">
          
          
          <h1 className="text-5xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pb-3 leading-tight">
               How Our Skills Learning is Different 

            </span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-gray-600 font-light max-w-3xl mx-auto leading-relaxed">
            "Bridging India's talent gap with industry-ready learning programs"
          </p>
        </header>

        {/* Benefits Grid - macOS Style Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.id}
              className="group bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 p-6 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-2"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-200/50">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{benefit.title}</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Featured Learning Feature - iOS 18 Style */}
       

        {/* All Features Grid - macOS Dock Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`group bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                feature.id === selectedFeature ? 'ring-2 ring-blue-500/20' : ''
              }`}
              onMouseEnter={() => setSelectedFeature(feature.id)}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-2xl bg-gradient-to-r ${feature.color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <div>
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600 mb-2">
                    {feature.id}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section - iOS App Store Style */}
      </div>

      {/* Custom Styles */}
      <style >{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .shadow-ios {
          box-shadow: 
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
};

export default CertificationCourses;