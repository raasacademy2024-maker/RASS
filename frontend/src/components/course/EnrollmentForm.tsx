import React, { useState, useEffect } from "react";
import { X, User, Mail, Phone, GraduationCap, Briefcase, Calendar } from "lucide-react";
import { countryCodes } from "../../utils/countryCodes";
import { batchAPI } from "../../services/api";

interface Course {
  _id: string;
  title: string;
  [key: string]: unknown;
}

interface FormData {
  fullName: string;
  email: string;
  mobileNumber: string;
  countryCode: string;
  hasPriorExperience: string;
  experienceDetails: string;
  isStudent: string;
  batchId: string;
}

interface EnrollmentFormProps {
  course: Course;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
}

interface Batch {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  capacity: number;
  enrolledCount: number;
  isActive: boolean;
}

const EnrollmentForm: React.FC<EnrollmentFormProps> = ({ course, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    mobileNumber: "",
    countryCode: "+91",
    hasPriorExperience: "no",
    experienceDetails: "",
    isStudent: "yes",
    batchId: "",
  });
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchBatches = async () => {
    try {
      setLoadingBatches(true);
      const response = await batchAPI.getCourseBatches(course._id);
      const activeBatches = response.data.filter((b: Batch) => 
        b.isActive && b.enrolledCount < b.capacity
      );
      setBatches(activeBatches);
    } catch (error) {
      console.error("Error fetching batches:", error);
      setBatches([]);
    } finally {
      setLoadingBatches(false);
    }
  };

  useEffect(() => {
    if (course?._id) {
      fetchBatches();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course]);

  const validatePhone = (phone: string): boolean => {
    const selectedCountry = countryCodes.find(c => c.code === formData.countryCode);
    const requiredLength = selectedCountry?.length || 10;
    const phoneRegex = new RegExp(`^[0-9]{${requiredLength}}$`);
    return phoneRegex.test(phone);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    const selectedCountry = countryCodes.find(c => c.code === formData.countryCode);
    const maxLength = selectedCountry?.length || 10;
    
    if (value.length <= maxLength) {
      setFormData(prev => ({ ...prev, mobileNumber: value }));
      
      // Clear error when typing valid input
      if (errors.mobileNumber && (value.length === 0 || value.length === maxLength)) {
        setErrors(prev => ({ ...prev, mobileNumber: "" }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!validatePhone(formData.mobileNumber)) {
      const selectedCountry = countryCodes.find(c => c.code === formData.countryCode);
      const requiredLength = selectedCountry?.length || 10;
      newErrors.mobileNumber = `Please enter a valid ${requiredLength}-digit mobile number for ${selectedCountry?.country}`;
    }
    if (formData.hasPriorExperience === "yes" && !formData.experienceDetails.trim()) {
      newErrors.experienceDetails = "Please mention your experience";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      // Combine country code with mobile number
      const submissionData = {
        courseId: course._id,
        ...formData,
        mobileNumber: `${formData.countryCode} ${formData.mobileNumber}`
      };
      await onSubmit(submissionData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Enrollment Form</h2>
            <p className="text-gray-600 mt-1">Please fill in your details to enroll in {course?.title}</p>
          </div>
          <button 
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-6">
            {/* Batch Selection */}
            {batches.length > 0 && (
              <div className="relative">
                <label htmlFor="batchId" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-indigo-600" />
                  Select Batch
                </label>
                {loadingBatches ? (
                  <div className="text-sm text-gray-500">Loading batches...</div>
                ) : (
                  <select
                    id="batchId"
                    name="batchId"
                    value={formData.batchId}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  >
                    <option value="">No specific batch (open enrollment)</option>
                    {batches.map((batch) => (
                      <option key={batch._id} value={batch._id}>
                        {batch.name} ({new Date(batch.startDate).toLocaleDateString()} - {new Date(batch.endDate).toLocaleDateString()}) - {batch.capacity - batch.enrolledCount} slots available
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* Full Name */}
            <div className="relative">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <User className="h-4 w-4 mr-2 text-indigo-600" />
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors`}
                placeholder="Enter your full name"
              />
              {errors.fullName && <p className="mt-1 text-sm text-red-600 flex items-center"><span className="w-5 h-5 mr-1">⚠️</span>{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-indigo-600" />
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors`}
                  placeholder="Enter your email"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600 flex items-center"><span className="w-5 h-5 mr-1">⚠️</span>{errors.email}</p>}
              </div>

              {/* Mobile Number */}
              <div className="relative">
                <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-indigo-600" />
                  Mobile Number *
                </label>
                <div className="flex gap-2">
                  <select
                    value={formData.countryCode}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, countryCode: e.target.value, mobileNumber: '' }));
                      setErrors(prev => ({ ...prev, mobileNumber: '' }));
                    }}
                    className="w-20 px-2 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-sm"
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
                      id="mobileNumber"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handlePhoneChange}
                      className={`w-full border ${errors.mobileNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors`}
                      placeholder={`Enter ${countryCodes.find(c => c.code === formData.countryCode)?.length || 10} digit number`}
                      maxLength={countryCodes.find(c => c.code === formData.countryCode)?.length || 10}
                    />
                  </div>
                </div>
                {errors.mobileNumber && <p className="mt-1 text-sm text-red-600 flex items-center"><span className="w-5 h-5 mr-1">⚠️</span>{errors.mobileNumber}</p>}
              </div>
            </div>

            {/* Student Status */}
            <div className="relative">
              <label htmlFor="isStudent" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <GraduationCap className="h-4 w-4 mr-2 text-indigo-600" />
                Are you currently a student? *
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="isStudent"
                    value="yes"
                    checked={formData.isStudent === "yes"}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-gray-700">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="isStudent"
                    value="no"
                    checked={formData.isStudent === "no"}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-gray-700">No</span>
                </label>
              </div>
            </div>

            {/* Experience */}
            <div className="relative">
              <label htmlFor="hasPriorExperience" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Briefcase className="h-4 w-4 mr-2 text-indigo-600" />
                Do you have any prior experience? *
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="hasPriorExperience"
                    value="no"
                    checked={formData.hasPriorExperience === "no"}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-gray-700">No</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="hasPriorExperience"
                    value="yes"
                    checked={formData.hasPriorExperience === "yes"}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-gray-700">Yes</span>
                </label>
              </div>
            </div>

            {/* Experience Details */}
            {formData.hasPriorExperience === "yes" && (
              <div className="relative">
                <label htmlFor="experienceDetails" className="block text-sm font-medium text-gray-700 mb-2">
                  Please mention your experience *
                </label>
                <textarea
                  id="experienceDetails"
                  name="experienceDetails"
                  value={formData.experienceDetails}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full border ${errors.experienceDetails ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors`}
                  placeholder="Describe your relevant experience..."
                />
                {errors.experienceDetails && <p className="mt-1 text-sm text-red-600 flex items-center"><span className="w-5 h-5 mr-1">⚠️</span>{errors.experienceDetails}</p>}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Next"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnrollmentForm;