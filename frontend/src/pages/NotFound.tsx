import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Search, BookOpen, HelpCircle, ArrowLeft, Mail, Phone } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const popularLinks = [
    { name: 'Browse All Courses', href: '/courses', icon: BookOpen },
    { name: 'Help Center', href: '/help-center', icon: HelpCircle },
    { name: 'Contact Us', href: '/contact', icon: Mail },
    { name: 'Home Page', href: '/', icon: Home },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="relative">
              <h1 className="text-[150px] md:text-[200px] font-bold text-indigo-100 leading-none select-none">
                404
              </h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white rounded-full p-6 shadow-xl">
                  <Search className="w-12 h-12 text-indigo-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist or has been moved. 
            Let's help you find what you need.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-10">
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search for courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pr-14 rounded-full border-2 border-indigo-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-gray-700 text-lg"
                aria-label="Search for courses"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Quick Links */}
          <div className="mb-10">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Popular Pages
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {popularLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 hover:border-indigo-200 transition-all group"
                >
                  <link.icon className="w-8 h-8 text-indigo-500 group-hover:text-indigo-600 mb-2 transition-colors" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
                    {link.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-full font-medium hover:bg-indigo-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </button>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
          </div>

          {/* Contact Support */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-gray-600 mb-4">
              Need help? Our support team is here for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="mailto:support@rassacademy.com"
                className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
              >
                <Mail className="w-5 h-5 mr-2" />
                support@rassacademy.com
              </a>
              <span className="hidden sm:block text-gray-300">|</span>
              <a
                href="tel:+919063194887"
                className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
              >
                <Phone className="w-5 h-5 mr-2" />
                +91 9063194887
              </a>
            </div>
          </div>

          {/* RASS Academy Branding */}
          <div className="mt-10">
            <Link to="/" className="inline-block">
              <img 
                src="/logo.webp" 
                alt="RASS Academy" 
                className="h-12 mx-auto opacity-50 hover:opacity-100 transition-opacity"
                loading="lazy"
              />
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NotFound;
