import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Clock, Mail, Phone, Play, User, Zap } from "lucide-react";
import { countryCodes } from "../../utils/countryCodes";

interface CurriculumSection {
  subtitle: string;
  description?: string;
  duration?: number;
  resources?: Array<{
    title: string;
    url: string;
    type: string;
  }>;
}

interface CurriculumItem {
  _id?: string;
  order: number;
  logoUrl?: string;
  title: string;
  sections: CurriculumSection[];
  estimatedDuration?: number;
  difficulty?: string;
  prerequisites?: string[];
}

interface ContactFormData {
  name: string;
  email: string;
  mobileNumber: string;
  countryCode: string;
}

interface Props {
  curriculum: CurriculumItem[];
  courseTitle?: string;
  courseDescription?: string;
  totalDuration?: number;
  totalModules?: number;
  instructorName?: string;
  instructorImage?: string;
}

const AdminCurriculum: React.FC<Props> = ({ 
  curriculum, 
  courseTitle = "Course Curriculum",
  courseDescription = "Explore what you'll learn in this comprehensive course",
  totalDuration = 0,
  totalModules = 0,
  instructorName = "Expert Instructor",
  instructorImage = ""
}) => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [contactForm, setContactForm] = useState<ContactFormData>({
    name: "",
    email: "",
    mobileNumber: "",
    countryCode: "+91"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"curriculum">("curriculum");
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState("");

  if (!curriculum || curriculum.length === 0) return null;

  // Sort curriculum items by order
  const sortedCurriculum = [...curriculum].sort((a, b) => a.order - b.order);

  // Calculate total duration if not provided
  const calculatedTotalDuration = totalDuration || sortedCurriculum.reduce((total, item) => {
    return total + (item.estimatedDuration || 0) + 
      (item.sections?.reduce((sectionTotal, section) => sectionTotal + (section.duration || 0), 0) || 0);
  }, 0);



  // Color mapping for different curriculum items
  const getColorForCurriculum = (index: number) => {
    const colors = [
      "from-blue-500 to-indigo-600",
      "from-purple-500 to-pink-600",
      "from-green-500 to-teal-600",
      "from-orange-500 to-red-600",
      "from-indigo-500 to-purple-600",
      "from-teal-500 to-green-600",
      "from-red-500 to-pink-600",
      "from-yellow-500 to-orange-600"
    ];
    return colors[index % colors.length];
  };

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const validatePhone = (phone: string): boolean => {
    const selectedCountry = countryCodes.find(c => c.code === contactForm.countryCode);
    const requiredLength = selectedCountry?.length || 10;
    const phoneRegex = new RegExp(`^[0-9]{${requiredLength}}$`);
    return phoneRegex.test(phone);
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
    if (phoneError && name === 'mobileNumber') {
      setPhoneError('');
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    const selectedCountry = countryCodes.find(c => c.code === contactForm.countryCode);
    const maxLength = selectedCountry?.length || 10;
    
    if (value.length <= maxLength) {
      setContactForm(prev => ({ ...prev, mobileNumber: value }));
      
      if (value.length > 0 && value.length < maxLength) {
        setPhoneError(`Mobile number must be exactly ${maxLength} digits for ${selectedCountry?.country}`);
      } else if (value.length === maxLength) {
        setPhoneError('');
      } else {
        setPhoneError('');
      }
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone number
    if (!contactForm.mobileNumber.trim()) {
      setPhoneError("Mobile number is required");
      return;
    }
    
    if (!validatePhone(contactForm.mobileNumber)) {
      const selectedCountry = countryCodes.find(c => c.code === contactForm.countryCode);
      const requiredLength = selectedCountry?.length || 10;
      setPhoneError(`Mobile number must be exactly ${requiredLength} digits for ${selectedCountry?.country}`);
      return;
    }
    
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Combine country code with mobile number
      const submissionData = {
        ...contactForm,
        mobileNumber: `${contactForm.countryCode} ${contactForm.mobileNumber}`
      };
      
      // Here you would typically send the data to your backend
      console.log("Contact form submitted:", submissionData);
      
      setSubmitMessage("Thank you! We'll contact you soon.");
      setContactForm({
        name: "",
        email: "",
        mobileNumber: "",
        countryCode: "+91"
      });
      setPhoneError("");
    } catch {
      setSubmitMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format duration in hours and minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {courseTitle}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {courseDescription}
          </p>
          
        </motion.div>

        {/* Tab Navigation - Removed overview tab */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full shadow-md p-1 flex">
            <button
              onClick={() => setActiveTab("curriculum")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === "curriculum"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Curriculum
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {sortedCurriculum.map((item, index) => {
                const isOpen = openItems.has(index);
                const hasSections = item.sections && item.sections.length > 0;
                const colorClass = getColorForCurriculum(index);
                  
                  return (
                    <motion.div
                      key={item._id || index}
                      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                      whileHover={{ y: -2 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      {/* Main Curriculum Item */}
                      <button
                        onClick={() => toggleItem(index)}
                        className="w-full flex justify-between items-center px-6 py-5 text-left font-medium text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-3">
                            {/* Display logo in place of order number */}
                            {item.logoUrl ? (
                              <div className="relative">
                                <img 
                                  src={item.logoUrl} 
                                  alt={`${item.title} logo`}
                                  className="w-14 h-14 object-contain rounded-xl shadow-lg border"
                                  onError={(e) => {
                                    // Fallback to gradient badge with order number if image fails to load
                                    e.currentTarget.style.display = 'none';
                                    const fallbackElement = document.createElement('div');
                                    fallbackElement.className = `relative bg-gradient-to-r ${colorClass} text-white w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold shadow-lg`;
                                    fallbackElement.textContent = item.order.toString();
                                    e.currentTarget.parentNode?.appendChild(fallbackElement);
                                  }}
                                />
                              </div>
                            ) : (
                              <div className={`relative bg-gradient-to-r ${colorClass} text-white w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold shadow-lg`}>
                                {item.order}
                              </div>
                            )}
                            
                            <div className="text-left">
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-semibold text-gray-900 block">{item.title}</span>
                              </div>
                              <div className="flex items-center gap-3 mt-1">
                                {hasSections && (
                                  <span className="bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full font-medium">
                                    {item.sections.length} section{item.sections.length > 1 ? 's' : ''}
                                  </span>
                                )}
                                {item.estimatedDuration && (
                                  <span className="text-gray-500 text-xs flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatDuration(item.estimatedDuration)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {hasSections ? (
                            <motion.div
                              animate={{ rotate: isOpen ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className="h-5 w-5 text-indigo-600" />
                            </motion.div>
                          ) : (
                            <Play className="h-5 w-5 text-indigo-600" />
                          )}
                        </div>
                      </button>

                     {/* Sections Tree Structure */}
<AnimatePresence>
  {isOpen && hasSections && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="px-6 pb-6"
    >
      <div className="border-l-2 border-indigo-200 pl-6 ml-6 py-4 space-y-4">
        {item.sections.map((section, sectionIndex) => (
          <motion.div 
            key={sectionIndex} 
            className="relative group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
            onMouseEnter={() => setHoveredSection(`${item._id}-${item.logoUrl}`)}
            onMouseLeave={() => setHoveredSection(null)}
          >
            {/* Tree branch connector */}
            <div className="absolute -left-6 top-4 w-4 h-0.5 bg-indigo-300 group-hover:bg-indigo-400 transition-colors"></div>
            
            <div className={`flex items-start gap-4 p-4 bg-white rounded-lg border ${
              hoveredSection === `${item._id}-${item.logoUrl}` 
                ? "border-indigo-300 shadow-md" 
                : "border-gray-200"
            } transition-all duration-200 group`}>
              {/* Curriculum Image instead of Number Badge - Reduced size */}
              <div className="relative group/image">
                {item.logoUrl ? (
                  <div className="relative overflow-hidden rounded-md shadow group-hover/image:shadow-md transition-all duration-300">
                    <img 
                      src={item.logoUrl} 
                      alt={`${item.title} logo`}
                      className="w-8 h-8 object-contain bg-white p-0.5 group-hover/image:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        // Fallback to gradient badge if image fails to load
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement?.classList.add('hidden');
                        e.currentTarget.parentElement?.nextElementSibling?.classList.remove('hidden');
                      }}
                    />

                  </div>
                ) : null}
                
                {/* Fallback to gradient badge if no image - Reduced size */}
                {(!item.logoUrl || item.logoUrl === '') && (
                  <div className={`relative bg-gradient-to-r ${colorClass} text-white w-8 h-8 rounded-md flex items-center justify-center text-sm font-bold shadow group-hover/image:scale-110 transition-transform duration-300`}>
                    {item.order}
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-base mb-2 group-hover:text-indigo-700 transition-colors">
                  {section.subtitle}
                </h3>
                {section.description && (
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {section.description}
                  </p>
                )}
                
                {/* Section metadata */}
                <div className="flex items-center gap-4 mt-3">
                  {section.duration && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(section.duration)}
                    </span>
                  )}
                  {section.resources && section.resources.length > 0 && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      {section.resources.length} resource{section.resources.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )}
</AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden h-fit sticky top-8"
            >
              <div className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Get Course Details</h3>
                  <p className="text-gray-600">
                    Interested in this course? Get detailed information and pricing.
                  </p>
                </div>
                
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={contactForm.name}
                        onChange={handleContactChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50/50"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={contactForm.email}
                        onChange={handleContactChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50/50"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Number *
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={contactForm.countryCode}
                        onChange={(e) => {
                          setContactForm(prev => ({ ...prev, countryCode: e.target.value, mobileNumber: '' }));
                          setPhoneError('');
                        }}
                        className="w-32 px-2 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-sm"
                      >
                        {countryCodes.map((item) => (
                          <option key={item.code} value={item.code}>
                            {item.code} - {item.country}
                          </option>
                        ))}
                      </select>
                      <div className="flex-1 relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          id="mobileNumber"
                          name="mobileNumber"
                          value={contactForm.mobileNumber}
                          onChange={handlePhoneChange}
                          required
                          className={`w-full pl-10 pr-4 py-3 border ${phoneError ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50/50`}
                          placeholder={`Enter ${countryCodes.find(c => c.code === contactForm.countryCode)?.length || 10} digit number`}
                          maxLength={countryCodes.find(c => c.code === contactForm.countryCode)?.length || 10}
                        />
                      </div>
                    </div>
                    {phoneError && (
                      <p className="mt-1 text-sm text-red-600">{phoneError}</p>
                    )}
                  </div>

                  {submitMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg ${
                        submitMessage.includes("Thank you") 
                          ? "bg-green-50 text-green-800 border border-green-200" 
                          : "bg-red-50 text-red-800 border border-red-200"
                      }`}
                    >
                      {submitMessage}
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      "Get Course Information"
                    )}
                  </button>

                  <div className="text-center space-y-2">
                    <p className="text-gray-500 text-sm">
                      📞 We'll call you within 24 hours
                    </p>
                    <p className="text-gray-500 text-sm">
                      📧 Detailed course brochure sent to your email
                    </p>
                    <p className="text-gray-400 text-xs mt-4">
                      We respect your privacy. Your information will never be shared.
                    </p>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminCurriculum;