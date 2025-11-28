import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Users, Award, Video, MessageCircle, Calendar, ChevronRight, Star, TrendingUp, Clock, Heart, Target, Globe } from 'lucide-react';
import { HeroCarousel } from './publicpages/HeroSection';
import { ClientsSection } from './publicpages/ClientSection';
import CourseShowcase from './publicpages/CourseShowcase';
import Footer from '../components/layout/Footer';
import Navbar from '../components/layout/Navbar';
import CertificationCourses from './publicpages/CertificationCourses';
import PartnerWithUs from './publicpages/PartnerWithUs';
import CompaniesPage from './publicpages/CompaniesPage';
import CourseCatalog from './courses/CourseCatalog';
import IntroCourse from './publicpages/IntroCourse';
import AIInsightsDashboard from './publicpages/AIInsightsDashboard';
import { motion } from 'framer-motion';
import TestimonialCarousel from './publicpages/TestimonialCarousel';
import MediaPresenceSection from './publicpages/MediaPresenceSection';
import TrainingAssessment from './publicpages/TrainingAssessment';
import UpcomingEvents from '../components/home/UpcomingEvents';
import SEO, { pageSEOConfig } from '../components/common/SEO';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <BookOpen className="h-10 w-10 text-indigo-600" />,
      title: "Interactive Courses",
      description: "Engage with video content, assignments, and interactive learning materials"
    },
    {
      icon: <Users className="h-10 w-10 text-indigo-600" />,
      title: "Expert Instructors",
      description: "Learn from industry professionals and experienced educators"
    },
    {
      icon: <Award className="h-10 w-10 text-indigo-600" />,
      title: "Certificates",
      description: "Earn verified certificates upon course completion"
    },
    {
      icon: <Video className="h-10 w-10 text-indigo-600" />,
      title: "Live Sessions",
      description: "Join live webinars and interactive sessions with instructors"
    },
    {
      icon: <MessageCircle className="h-10 w-10 text-indigo-600" />,
      title: "Discussion Forums",
      description: "Connect with peers and instructors in course-specific forums"
    },
    {
      icon: <Calendar className="h-10 w-10 text-indigo-600" />,
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed progress analytics"
    }
  ];

  const stats = [
    { value: "10,000+", label: "Active Students", icon: <Users className="h-6 w-6" /> },
    { value: "500+", label: "Expert Instructors", icon: <Heart className="h-6 w-6" /> },
    { value: "200+", label: "Courses Available", icon: <BookOpen className="h-6 w-6" /> },
    { value: "98%", label: "Satisfaction Rate", icon: <Target className="h-6 w-6" /> }
  ];

  const testimonials = [
    {
      name: "Bhaskar Lekkala",
      role: "Web Developer",
      content: "RASS Academy completely transformed my career. The courses are well-structured and the instructors are incredibly knowledgeable.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
      name: "S Vamsi",
      role: "Data Scientist",
      content: "The hands-on projects helped me build a portfolio that landed me my dream job. The support from instructors was exceptional.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
      name: "Priya Sharma",
      role: "UX Designer",
      content: "As a working professional, the flexible learning schedule was perfect for me. I could learn at my own pace without compromising my job.",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    }
  ];

  return (
    <div>
      <SEO {...pageSEOConfig.home} />
      <Navbar/>
      <div className="min-h-screen overflow-hidden bg-white">
        {/* Main heading for SEO - hidden visually but accessible to screen readers */}
        <h1 className="sr-only">RASS Academy - India's Premier Skills & Learning Platform for Industry-Ready Talent Development</h1>
        <HeroCarousel/>
        <ClientsSection/>
        <IntroCourse/>
        <TrainingAssessment/>
        <AIInsightsDashboard/>
        <CertificationCourses/>
        <UpcomingEvents />
        <TestimonialCarousel/>
        <MediaPresenceSection/>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-indigo-700 to-indigo-800 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Build Industry-Ready Skills?
            </h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
              Join India's fastest-growing talent community. Start your learning journey today with RASS Academy 
              and become the skilled professional that industry leaders want to hire.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => {
                  if (isAuthenticated) {
                    // Get the user role to navigate to the correct dashboard
                    let dashboardPath = '/';
                    if (user?.role === 'admin') {
                      dashboardPath = '/admin/dashboard';
                    } else if (user?.role === 'instructor') {
                      dashboardPath = '/instructor/dashboard';
                    } else {
                      dashboardPath = '/student/dashboard';
                    }
                    navigate(dashboardPath);
                    window.scrollTo(0, 0);
                  } else {
                    navigate("/register");
                    window.scrollTo(0, 0);
                  }
                }}
                className="bg-white text-indigo-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 shadow-lg flex items-center justify-center gap-2"
              >
                Join RASS Academy <TrendingUp size={20} />
              </button>
              <Link 
                to="/courses" 
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-indigo-700 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                View Courses <Clock size={20} />
              </Link>
            </div>
          </div>
        </section>
        <Footer/>
      </div>
    </div>
  );
};

export default Home;