import React, { useState } from 'react';
import { 
  Search, 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  ChevronDown,
  ChevronUp,
  BookOpen,
  Video,
  FileText,
  Users,
  Zap,
  Shield,
  Star,
  ArrowRight,
  HeadphonesIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Footer from '../../components/layout/Footer';
import Navbar from '../../components/layout/Navbar';
import SEO, { pageSEOConfig } from '../../components/common/SEO';

const HelpCenter = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('general');
  const [openItems, setOpenItems] = useState<{[key: string]: boolean}>({});
  const [searchQuery, setSearchQuery] = useState('');

  // FAQ data organized by categories
  const faqCategories = [
    {
      id: 'general',
      title: 'General Questions',
      icon: <BookOpen className="h-5 w-5" />,
      questions: [
        {
          question: 'What is RAAS Academy?',
          answer: 'RAAS Academy is a premier online learning platform that provides industry-relevant courses with guaranteed job opportunities. We focus on outcome-based education to transform careers.'
        },
        {
          question: 'How do I enroll in a course?',
          answer: 'You can enroll by browsing our courses, selecting your preferred program, and completing the payment process. Our admissions team will then guide you through the onboarding process.'
        },
        {
          question: 'Do you offer placement assistance?',
          answer: 'Yes, we have a dedicated placement cell that works with 2500+ hiring partners to ensure our graduates get placed in top companies with an average placement rate of 92%.'
        }
      ]
    },
    {
      id: 'technical',
      title: 'Technical Support',
      icon: <Zap className="h-5 w-5" />,
      questions: [
        {
          question: 'What are the technical requirements for courses?',
          answer: 'You need a computer with at least 4GB RAM, stable internet connection, and modern web browser. Specific courses may have additional requirements which are listed on the course page.'
        },
        {
          question: 'How do I access course materials?',
          answer: 'Once enrolled, you can access all course materials through our learning portal. You\'ll get login credentials after successful registration and payment.'
        },
        {
          question: 'What if I face issues during live classes?',
          answer: 'We have 24/7 technical support. You can contact our support team via chat, email, or phone. Most issues are resolved within minutes.'
        }
      ]
    },
    {
      id: 'payment',
      title: 'Payment & Pricing',
      icon: <Shield className="h-5 w-5" />,
      questions: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept credit/debit cards, net banking, UPI, and EMI options. We also offer educational loans through our banking partners.'
        },
        {
          question: 'Do you offer refunds?',
          answer: 'Yes, we have a 7-day refund policy. If you\'re not satisfied with the course, you can request a refund within 7 days of enrollment.'
        },
        {
          question: 'Are there any hidden fees?',
          answer: 'No, all prices listed are inclusive of taxes. There are no hidden fees. The course fee includes all learning materials, mentorship, and placement support.'
        }
      ]
    },
    {
      id: 'courses',
      title: 'Courses & Learning',
      icon: <Video className="h-5 w-5" />,
      questions: [
        {
          question: 'How long do courses take to complete?',
          answer: 'Course duration varies from 8-24 weeks depending on the program. Each course has a suggested timeline, but you can learn at your own pace.'
        },
        {
          question: 'Do I get a certificate after completion?',
          answer: 'Yes, you receive an industry-recognized certificate upon successful completion of the course and assessment. Our certificates are valued by hiring partners.'
        },
        {
          question: 'Can I access course content after completion?',
          answer: 'Yes, you get lifetime access to course materials, including updates. You can revisit the content anytime to refresh your knowledge.'
        }
      ]
    }
  ];

  const supportOptions = [
    {
      icon: (
        <img src="/whatsapp.jpg" alt="WhatsApp" className="w-full h-full object-cover rounded-2xl" />
      ),
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      availability: 'Available 24/7',
      action: 'Start Chat',
      color: 'bg-green-500',
      onClick: () => {
        // WhatsApp link for the support number
        window.open('https://api.whatsapp.com/send?phone=919063194887', '_blank');
      }
    },
    {
      icon: <Phone className="h-8 w-8" />,
      title: 'Phone Support',
      description: 'Talk directly with our support specialists',
      availability: 'Mon-Sat, 9AM-9PM IST',
      action: 'Call Now',
      color: 'bg-green-500',
      onClick: () => {
        // Redirect to dialer with the phone number
        window.location.href = 'tel:+919063194887';
      }
    },
    {
      icon: <Mail className="h-8 w-8" />,
      title: 'Email Support',
      description: 'Send us your queries and get detailed responses',
      availability: 'Response within 4 hours',
      action: 'Send Email',
      color: 'bg-purple-500',
      onClick: () => {
        // Open email client in a new tab with the support email
        window.open('mailto:support@raasacademy.com', '_blank');
      }
    }
  ];

  const toggleItem = (categoryId: string, index: number) => {
    const key = `${categoryId}-${index}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div>
        <SEO {...pageSEOConfig.helpCenter} />
        <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
          How can we <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">help you?</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
          Find answers to common questions, get technical support, or contact our team directly.
        </p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search for answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-300"
          />
        </div>
      </div>

      {/* Support Options */}
      <div className="max-w-7xl mx-auto mb-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Get Support</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {supportOptions.map((option, index) => (
            <div 
              key={index}
              className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-6 text-center group"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 ${option.color} text-white rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 overflow-hidden`}>
                {option.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{option.title}</h3>
              <p className="text-gray-600 mb-3">{option.description}</p>
              <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
                <Clock className="h-4 w-4 mr-1" />
                {option.availability}
              </div>
              <button 
                onClick={() => {
                  if (option.onClick) {
                    option.onClick();
                  } else {
                    // Default behavior for other options
                    console.log(`Action for ${option.title}`);
                  }
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                {option.action}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
        
        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {faqCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.title}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden">
          {filteredCategories
            .filter(category => category.id === activeCategory)
            .map(category => (
              <div key={category.id} className="p-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  {category.icon}
                  <span className="ml-2">{category.title}</span>
                </h3>
                <div className="space-y-4">
                  {category.questions.map((item, index) => {
                    const key = `${category.id}-${index}`;
                    const isOpen = openItems[key];
                    
                    return (
                      <div 
                        key={key} 
                        className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md"
                      >
                        <button
                          onClick={() => toggleItem(category.id, index)}
                          className="w-full flex items-center justify-between p-6 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                        >
                          <span className="text-lg font-medium text-gray-900">{item.question}</span>
                          {isOpen ? (
                            <ChevronUp className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="p-6 bg-white border-t border-gray-200">
                            <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          }
        </div>

        {/* Still Need Help Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-10 text-white shadow-xl">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm mb-6">
              <HeadphonesIcon className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Still need help?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Our support team is here to assist you with any questions or issues you might have. We're committed to providing the best learning experience.
            </p>
            <button 
              onClick={() => navigate('/contact')}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center mx-auto"
            >
              Contact Support
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl mb-4">
              <Clock className="h-8 w-8" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">Under 30 min</div>
            <div className="text-gray-600">Average response time</div>
          </div>
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-2xl mb-4">
              <Star className="h-8 w-8" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">98%</div>
            <div className="text-gray-600">Customer satisfaction rate</div>
          </div>
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl mb-4">
              <Users className="h-8 w-8" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">24/7</div>
            <div className="text-gray-600">Support availability</div>
          </div>
        </div>
      </div>
    </div>
     <Footer />
     </div>
  );
};

export default HelpCenter;