import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, User, Send, CheckCircle, X, MessageCircle } from "lucide-react";
import { useContact } from "./ContactContext";

const countryCodes = [
  { code: "+93", country: "Afghanistan", length: 9 },
  { code: "+355", country: "Albania", length: 9 },
  { code: "+213", country: "Algeria", length: 9 },
  { code: "+376", country: "Andorra", length: 6 },
  { code: "+244", country: "Angola", length: 9 },
  { code: "+54", country: "Argentina", length: 10 },
  { code: "+374", country: "Armenia", length: 8 },
  { code: "+61", country: "Australia", length: 9 },
  { code: "+43", country: "Austria", length: 10 },
  { code: "+994", country: "Azerbaijan", length: 9 },
  { code: "+973", country: "Bahrain", length: 8 },
  { code: "+880", country: "Bangladesh", length: 10 },
  { code: "+375", country: "Belarus", length: 9 },
  { code: "+32", country: "Belgium", length: 9 },
  { code: "+501", country: "Belize", length: 7 },
  { code: "+229", country: "Benin", length: 8 },
  { code: "+975", country: "Bhutan", length: 8 },
  { code: "+591", country: "Bolivia", length: 8 },
  { code: "+387", country: "Bosnia and Herzegovina", length: 8 },
  { code: "+267", country: "Botswana", length: 8 },
  { code: "+55", country: "Brazil", length: 11 },
  { code: "+673", country: "Brunei", length: 7 },
  { code: "+359", country: "Bulgaria", length: 9 },
  { code: "+226", country: "Burkina Faso", length: 8 },
  { code: "+257", country: "Burundi", length: 8 },
  { code: "+855", country: "Cambodia", length: 9 },
  { code: "+237", country: "Cameroon", length: 9 },
  { code: "+1", country: "Canada", length: 10 },
  { code: "+238", country: "Cape Verde", length: 7 },
  { code: "+236", country: "Central African Republic", length: 8 },
  { code: "+235", country: "Chad", length: 8 },
  { code: "+56", country: "Chile", length: 9 },
  { code: "+86", country: "China", length: 11 },
  { code: "+57", country: "Colombia", length: 10 },
  { code: "+269", country: "Comoros", length: 7 },
  { code: "+242", country: "Congo", length: 9 },
  { code: "+506", country: "Costa Rica", length: 8 },
  { code: "+385", country: "Croatia", length: 9 },
  { code: "+53", country: "Cuba", length: 8 },
  { code: "+357", country: "Cyprus", length: 8 },
  { code: "+420", country: "Czech Republic", length: 9 },
  { code: "+45", country: "Denmark", length: 8 },
  { code: "+253", country: "Djibouti", length: 8 },
  { code: "+593", country: "Ecuador", length: 9 },
  { code: "+20", country: "Egypt", length: 10 },
  { code: "+503", country: "El Salvador", length: 8 },
  { code: "+240", country: "Equatorial Guinea", length: 9 },
  { code: "+291", country: "Eritrea", length: 7 },
  { code: "+372", country: "Estonia", length: 8 },
  { code: "+251", country: "Ethiopia", length: 9 },
  { code: "+679", country: "Fiji", length: 7 },
  { code: "+358", country: "Finland", length: 10 },
  { code: "+33", country: "France", length: 9 },
  { code: "+241", country: "Gabon", length: 7 },
  { code: "+220", country: "Gambia", length: 7 },
  { code: "+995", country: "Georgia", length: 9 },
  { code: "+49", country: "Germany", length: 10 },
  { code: "+233", country: "Ghana", length: 9 },
  { code: "+30", country: "Greece", length: 10 },
  { code: "+502", country: "Guatemala", length: 8 },
  { code: "+224", country: "Guinea", length: 9 },
  { code: "+245", country: "Guinea-Bissau", length: 7 },
  { code: "+592", country: "Guyana", length: 7 },
  { code: "+509", country: "Haiti", length: 8 },
  { code: "+504", country: "Honduras", length: 8 },
  { code: "+852", country: "Hong Kong", length: 8 },
  { code: "+36", country: "Hungary", length: 9 },
  { code: "+354", country: "Iceland", length: 7 },
  { code: "+91", country: "India", length: 10 },
  { code: "+62", country: "Indonesia", length: 10 },
  { code: "+98", country: "Iran", length: 10 },
  { code: "+964", country: "Iraq", length: 10 },
  { code: "+353", country: "Ireland", length: 9 },
  { code: "+972", country: "Israel", length: 9 },
  { code: "+39", country: "Italy", length: 10 },
  { code: "+225", country: "Ivory Coast", length: 8 },
  { code: "+81", country: "Japan", length: 10 },
  { code: "+962", country: "Jordan", length: 9 },
  { code: "+7", country: "Kazakhstan", length: 10 },
  { code: "+254", country: "Kenya", length: 10 },
  { code: "+965", country: "Kuwait", length: 8 },
  { code: "+996", country: "Kyrgyzstan", length: 9 },
  { code: "+856", country: "Laos", length: 9 },
  { code: "+371", country: "Latvia", length: 8 },
  { code: "+961", country: "Lebanon", length: 8 },
  { code: "+266", country: "Lesotho", length: 8 },
  { code: "+231", country: "Liberia", length: 7 },
  { code: "+218", country: "Libya", length: 10 },
  { code: "+423", country: "Liechtenstein", length: 7 },
  { code: "+370", country: "Lithuania", length: 8 },
  { code: "+352", country: "Luxembourg", length: 9 },
  { code: "+853", country: "Macau", length: 8 },
  { code: "+389", country: "Macedonia", length: 8 },
  { code: "+261", country: "Madagascar", length: 9 },
  { code: "+265", country: "Malawi", length: 9 },
  { code: "+60", country: "Malaysia", length: 9 },
  { code: "+960", country: "Maldives", length: 7 },
  { code: "+223", country: "Mali", length: 8 },
  { code: "+356", country: "Malta", length: 8 },
  { code: "+222", country: "Mauritania", length: 8 },
  { code: "+230", country: "Mauritius", length: 8 },
  { code: "+52", country: "Mexico", length: 10 },
  { code: "+373", country: "Moldova", length: 8 },
  { code: "+377", country: "Monaco", length: 8 },
  { code: "+976", country: "Mongolia", length: 8 },
  { code: "+382", country: "Montenegro", length: 8 },
  { code: "+212", country: "Morocco", length: 9 },
  { code: "+258", country: "Mozambique", length: 9 },
  { code: "+95", country: "Myanmar", length: 9 },
  { code: "+264", country: "Namibia", length: 9 },
  { code: "+977", country: "Nepal", length: 10 },
  { code: "+31", country: "Netherlands", length: 9 },
  { code: "+64", country: "New Zealand", length: 9 },
  { code: "+505", country: "Nicaragua", length: 8 },
  { code: "+227", country: "Niger", length: 8 },
  { code: "+234", country: "Nigeria", length: 10 },
  { code: "+47", country: "Norway", length: 8 },
  { code: "+968", country: "Oman", length: 8 },
  { code: "+92", country: "Pakistan", length: 10 },
  { code: "+507", country: "Panama", length: 8 },
  { code: "+675", country: "Papua New Guinea", length: 8 },
  { code: "+595", country: "Paraguay", length: 9 },
  { code: "+51", country: "Peru", length: 9 },
  { code: "+63", country: "Philippines", length: 10 },
  { code: "+48", country: "Poland", length: 9 },
  { code: "+351", country: "Portugal", length: 9 },
  { code: "+974", country: "Qatar", length: 8 },
  { code: "+40", country: "Romania", length: 10 },
  { code: "+7", country: "Russia", length: 10 },
  { code: "+250", country: "Rwanda", length: 9 },
  { code: "+966", country: "Saudi Arabia", length: 9 },
  { code: "+221", country: "Senegal", length: 9 },
  { code: "+381", country: "Serbia", length: 9 },
  { code: "+248", country: "Seychelles", length: 7 },
  { code: "+232", country: "Sierra Leone", length: 8 },
  { code: "+65", country: "Singapore", length: 8 },
  { code: "+421", country: "Slovakia", length: 9 },
  { code: "+386", country: "Slovenia", length: 9 },
  { code: "+677", country: "Solomon Islands", length: 7 },
  { code: "+252", country: "Somalia", length: 8 },
  { code: "+27", country: "South Africa", length: 9 },
  { code: "+82", country: "South Korea", length: 10 },
  { code: "+211", country: "South Sudan", length: 9 },
  { code: "+34", country: "Spain", length: 9 },
  { code: "+94", country: "Sri Lanka", length: 9 },
  { code: "+249", country: "Sudan", length: 9 },
  { code: "+597", country: "Suriname", length: 7 },
  { code: "+268", country: "Swaziland", length: 8 },
  { code: "+46", country: "Sweden", length: 9 },
  { code: "+41", country: "Switzerland", length: 9 },
  { code: "+963", country: "Syria", length: 9 },
  { code: "+886", country: "Taiwan", length: 9 },
  { code: "+992", country: "Tajikistan", length: 9 },
  { code: "+255", country: "Tanzania", length: 9 },
  { code: "+66", country: "Thailand", length: 9 },
  { code: "+228", country: "Togo", length: 8 },
  { code: "+216", country: "Tunisia", length: 8 },
  { code: "+90", country: "Turkey", length: 10 },
  { code: "+993", country: "Turkmenistan", length: 8 },
  { code: "+256", country: "Uganda", length: 9 },
  { code: "+380", country: "Ukraine", length: 9 },
  { code: "+971", country: "United Arab Emirates", length: 9 },
  { code: "+44", country: "United Kingdom", length: 10 },
  { code: "+1", country: "United States", length: 10 },
  { code: "+598", country: "Uruguay", length: 8 },
  { code: "+998", country: "Uzbekistan", length: 9 },
  { code: "+678", country: "Vanuatu", length: 7 },
  { code: "+58", country: "Venezuela", length: 10 },
  { code: "+84", country: "Vietnam", length: 9 },
  { code: "+967", country: "Yemen", length: 9 },
  { code: "+260", country: "Zambia", length: 9 },
  { code: "+263", country: "Zimbabwe", length: 9 }
];

const GlobalContactForm = () => {
  const {
    isContactFormOpen,
    setIsContactFormOpen,
    formData,
    setFormData,
    isSubmitting,
    setIsSubmitting,
    isSubmitted,
    setIsSubmitted,
  } = useContact();
  
  const [showOptions, setShowOptions] = useState(false);
  const [mobileError, setMobileError] = useState('');
  const [countryCode, setCountryCode] = useState('+91');

  // Generic input handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    const selectedCountry = countryCodes.find(c => c.code === countryCode);
    const maxLength = selectedCountry?.length || 10;
    
    if (value.length <= maxLength) {
      setFormData({ ...formData, mobileNumber: value });
      
      if (value.length > 0 && value.length < maxLength) {
        setMobileError(`Mobile number must be exactly ${maxLength} digits for ${selectedCountry?.country}`);
      } else if (value.length === maxLength) {
        setMobileError('');
      } else {
        setMobileError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate mobile number based on selected country
    const selectedCountry = countryCodes.find(c => c.code === countryCode);
    const requiredLength = selectedCountry?.length || 10;
    const phoneRegex = new RegExp(`^[0-9]{${requiredLength}}$`);
    
    if (!phoneRegex.test(formData.mobileNumber)) {
      setMobileError(`Mobile number must be exactly ${requiredLength} digits for ${selectedCountry?.country}`);
      return;
    }
    
    setIsSubmitting(true);

    try {
      const submissionData = {
        ...formData,
        mobileNumber: `${countryCode} ${formData.mobileNumber}`
      };
      
      const response = await fetch("https://nodemailer-abnc.onrender.com/send-mail/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) throw new Error("Failed to send");

      setIsSubmitted(true);
      setFormData({ name: "", email: "", mobileNumber: "" });
      setMobileError('');
      setCountryCode('+91');

      setTimeout(() => {
        setIsSubmitted(false);
        setIsContactFormOpen(false);
      }, 3000);
    } catch {
      alert("Failed to send message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsContactFormOpen(false);
    setFormData({ name: "", email: "", mobileNumber: "" });
    setIsSubmitted(false);
    setMobileError('');
    setCountryCode('+91');
  };
  
  const handleWhatsAppClick = () => {
    window.open('https://api.whatsapp.com/send?phone=919063194887', '_blank');
    setShowOptions(false);
  };
  
  const handleEmailClick = () => {
    setShowOptions(false);
    setIsContactFormOpen(true);
  };

  return (
    <>
      {/* Hover Container */}
      <div
        onMouseEnter={() => setShowOptions(true)}
        onMouseLeave={() => setShowOptions(false)}
        className="fixed bottom-8 right-8 z-[9999]"
      >
        {/* Trigger Button */}
        <AnimatePresence>
          {!isContactFormOpen && (
            <motion.button
              initial={{ opacity: 0, scale: 0, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0, y: 100 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-2xl flex items-center justify-center"
            >
              <MessageCircle className="w-7 h-7 text-white" />
            </motion.button>
          )}
        </AnimatePresence>
        
        {/* Options Menu */}
        <AnimatePresence>
          {showOptions && !isContactFormOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="absolute bottom-20 right-0 bg-white rounded-2xl shadow-2xl overflow-hidden w-64"
            >
              <div className="p-2">
                {/* WhatsApp Option */}
                <motion.button
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleWhatsAppClick}
                  className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-green-50 transition-colors group"
                >
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center group-hover:bg-green-600 transition-colors overflow-hidden flex-shrink-0">
                    <img src="/whatsapp.jpg" alt="WhatsApp" className="w-16 h-16 object-cover" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">WhatsApp</p>
                    <p className="text-xs text-gray-600">Chat with us instantly</p>
                  </div>
                </motion.button>
                
                {/* Email Option */}
                <motion.button
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEmailClick}
                  className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-indigo-50 transition-colors group"
                >
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center group-hover:bg-indigo-200 transition-colors flex-shrink-0">
                    <Mail className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="text-xs text-gray-600">Get course details</p>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isContactFormOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 100 }}
              className="fixed bottom-8 right-8 z-[9999] w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 relative">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeModal}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-white" />
                </motion.button>
                <h3 className="text-xl font-bold text-white mb-1">Get Course Details</h3>
                <p className="text-indigo-100 text-sm">We'll call you within 24 hours.</p>
              </div>

              {/* Form */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {isSubmitted ? (
                  <div className="text-center py-6">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h4>
                    <p className="text-gray-600 text-sm mb-4">Our team will contact you shortly.</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={closeModal}
                      className="px-6 py-2 bg-indigo-500 text-white rounded-lg font-semibold text-sm"
                    >
                      Close
                    </motion.button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full pl-10 border rounded-xl py-2"
                          placeholder="Your full name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-10 border rounded-xl py-2"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number</label>
                      <div className="flex gap-2">
                        <select
                          value={countryCode}
                          onChange={(e) => {
                            setCountryCode(e.target.value);
                            setFormData({ ...formData, mobileNumber: '' });
                            setMobileError('');
                          }}
                          className="w-20 px-2 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-sm"
                        >
                          {countryCodes.map((item) => (
                            <option key={item.code} value={item.code}>
                              {item.code} - {item.country}
                            </option>
                          ))}
                        </select>
                        <div className="flex-1 relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="tel"
                            name="mobileNumber"
                            required
                            value={formData.mobileNumber}
                            onChange={handlePhoneChange}
                            className={`w-full pl-10 pr-3 border ${mobileError ? 'border-red-500' : 'border-gray-300'} rounded-xl py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                            placeholder={`Enter ${countryCodes.find(c => c.code === countryCode)?.length || 10} digit number`}
                            maxLength={countryCodes.find(c => c.code === countryCode)?.length || 10}
                          />
                        </div>
                      </div>
                      {mobileError && <p className="mt-1 text-xs text-red-600">{mobileError}</p>}
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                      className="w-full bg-indigo-500 text-white py-2 rounded-xl flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                      {isSubmitting ? "Sending..." : "Get Details"}
                    </motion.button>
                  </form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default GlobalContactForm;
