import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  MessageCircle,
  ArrowRight,
  Building,
  Smartphone,
  Globe,
  Users,
  Headphones
} from 'lucide-react';
import Footer from '../../components/layout/Footer';
import Navbar from '../../components/layout/Navbar';
import { countryCodes } from '../../utils/countryCodes';
import SEO, { pageSEOConfig } from '../../components/common/SEO';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    subject: '',
    message: '',
    countryCode: '+91'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileError, setMobileError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    const selectedCountry = countryCodes.find(c => c.code === formData.countryCode);
    const maxLength = selectedCountry?.length || 10;
    
    if (value.length <= maxLength) {
      setFormData(prev => ({ ...prev, mobileNumber: value }));
      
      if (value.length > 0 && value.length < maxLength) {
        setMobileError(`Mobile number must be exactly ${maxLength} digits for ${selectedCountry?.country}`);
      } else if (value.length === maxLength) {
        setMobileError('');
      } else {
        setMobileError('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate mobile number based on selected country
    const selectedCountry = countryCodes.find(c => c.code === formData.countryCode);
    const requiredLength = selectedCountry?.length || 10;
    const phoneRegex = new RegExp(`^[0-9]{${requiredLength}}$`);
    
    if (!phoneRegex.test(formData.mobileNumber)) {
      setMobileError(`Mobile number must be exactly ${requiredLength} digits for ${selectedCountry?.country}`);
      setIsSubmitting(false);
      return;
    }

    try {
      const submissionData = {
        ...formData,
        mobileNumber: `${formData.countryCode} ${formData.mobileNumber}`
      };
      delete submissionData.countryCode;
      
      const response = await fetch("https://nodemailer-abnc.onrender.com/send-mail/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Thank you for your message! We will get back to you soon.");
        setFormData({
          name: "",
          email: "",
          mobileNumber: "",
          subject: "",
          message: "",
          countryCode: "+91"
        });
        setMobileError('');
      } else {
        alert("❌ Failed to send your message. Please try again later.");
        console.error("Server Error:", data);
      }
    } catch (error) {
      console.error("❌ Network Error:", error);
      alert("⚠️ Something went wrong. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <SEO {...pageSEOConfig.contact} />
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Get in <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Touch</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions about our programs? Want to know more about how we can help transform your career? We're here to help!
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <MessageCircle className="h-6 w-6 mr-2 text-blue-600" />
              Send us a Message
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    placeholder="Your Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number *</label>
                  <div className="flex gap-2">
                    <select
                      value={formData.countryCode}
                      onChange={(e) => {
                        setFormData({ ...formData, countryCode: e.target.value, mobileNumber: '' });
                        setMobileError('');
                      }}
                      className="w-20 px-2 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                    >
                      {countryCodes.map((item) => (
                        <option key={item.code} value={item.code}>
                          {item.code} - {item.country}
                        </option>
                      ))}
                    </select>
                    <div className="flex-1">
                      <input
                        type="tel"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handlePhoneChange}
                        required
                        className={`w-full px-4 py-3 border ${mobileError ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300`}
                        placeholder={`Enter ${countryCodes.find(c => c.code === formData.countryCode)?.length || 10} digit number`}
                        maxLength={countryCodes.find(c => c.code === formData.countryCode)?.length || 10}
                      />
                    </div>
                  </div>
                  {mobileError && <p className="mt-1 text-sm text-red-600">{mobileError}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="admissions">Admissions</option>
                    <option value="courses">Course Information</option>
                    <option value="partnerships">Partnerships</option>
                    <option value="support">Technical Support</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-xl font-semibold flex items-center justify-center transition-all duration-300 transform ${
                  isSubmitting
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:-translate-y-1 hover:shadow-lg"
                }`}
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {/* Quick Contact Cards */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>
              
              <div className="space-y-5">
                <a 
                  href="tel:+919063194887" 
                  className="flex items-start group hover:bg-blue-50 p-3 rounded-lg transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                    <Phone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Phone</h3>
                    <p className="text-gray-600">+91 90631 94887</p>
                  </div>
                </a>

                <a 
                  href="https://api.whatsapp.com/send?phone=919063194887" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-start group hover:bg-green-50 p-3 rounded-lg transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-green-200 transition-colors overflow-hidden">
                    <img src="/whatsapp.jpg" alt="WhatsApp" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">WhatsApp</h3>
                    <p className="text-gray-600">Chat with us</p>
                  </div>
                </a>

                <div className="flex items-start group hover:bg-blue-50 p-3 rounded-lg transition-all duration-300">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Email</h3>
                    <p className="text-gray-600">info@raasacademy.com</p>
                    <p className="text-gray-600">contact@raasacademy.com</p>
                    <p className="text-gray-600">support@raasacademy.com</p>
                  </div>
                </div>

                <div className="flex items-start group hover:bg-blue-50 p-3 rounded-lg transition-all duration-300">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Partnerships</h3>
                    <p className="text-gray-600">partnerships@raasacademy.com</p>
                  </div>
                </div>

                <div className="flex items-start group hover:bg-blue-50 p-3 rounded-lg transition-all duration-300">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Address</h3>
                    <p className="text-gray-600">1-60, A & B, 3rd Floor, KNR Square</p>
                    <p className="text-gray-600">opp. The Platina, Gachibowli</p>
                    <p className="text-gray-600">Hyderabad, Telangana, India 500032</p>
                  </div>
                </div>

                <div className="flex items-start group hover:bg-blue-50 p-3 rounded-lg transition-all duration-300">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Office Hours</h3>
                    <p className="text-gray-600">Mon - Fri: 9 AM - 6 PM</p>
                    <p className="text-gray-600">Saturday: 10 AM - 4 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Support Card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                  <Headphones className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Need Immediate Assistance?</h3>
                  <p className="text-blue-100">Call or WhatsApp us now</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a 
                  href="tel:+919063194887"
                  className="flex-1 bg-white text-blue-600 py-3 px-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center justify-center"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </a>
                <a 
                  href="https://api.whatsapp.com/send?phone=919063194887"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-500 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-600 transition-all duration-300 flex items-center justify-center"
                >
                  <div className="w-4 h-4 mr-2 overflow-hidden rounded flex items-center justify-center">
                    <img src="/whatsapp.jpg" alt="WhatsApp" className="w-full h-full object-cover" />
                  </div>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="max-w-7xl mx-auto mt-16">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <MapPin className="h-6 w-6 mr-2 text-blue-600" />
                Find Us
              </h2>
            </div>
            <div className="h-96 bg-gray-100 relative">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.4115445347433!2d78.351941314878!3d17.4386786880475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb93e4b5b5b5b5%3A0x5b5b5b5b5b5b5b5b!2sKNR%20Square!5e0!3m2!1sen!2sin!4v1629386400000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy"
                title="RAAS Academy Location"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactUs;