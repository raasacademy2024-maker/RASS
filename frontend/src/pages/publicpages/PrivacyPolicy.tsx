import React from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import SEO, { pageSEOConfig } from "../../components/common/SEO";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <SEO {...pageSEOConfig.privacy} />
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8 w-full">
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-100">
          <div className="p-6 sm:p-8 md:p-12 h-full">
            <div className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-indigo-700 mb-3">Privacy Policy</h1>
              <div className="w-24 h-1 bg-indigo-300 rounded-full mx-auto mt-4"></div>
              <p className="text-lg sm:text-xl text-indigo-500 mt-6">Your Privacy Matters to Us</p>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6 text-base sm:text-lg leading-relaxed">
                At RASS Academy, safeguarding your privacy is a top priority. We employ industry-standard tools and best practices to protect your data and maintain confidentiality. All personal information is handled in accordance with our Terms of Service and this Privacy Policy.
              </p>
              
              <div className="space-y-8 sm:space-y-10">
                <section className="border-l-2 border-indigo-200 pl-4 py-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-4 flex items-center">
                    <span className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">1</span>
                    Use of Personal Information
                  </h2>
                  
                  <h3 className="text-lg sm:text-xl font-semibold text-indigo-600 mb-2 mt-4">a. General Use</h3>
                  <p className="text-gray-600 mb-3 text-base sm:text-lg leading-relaxed">
                    We collect your personal details when you visit our website or register on our LMS platform. This information is necessary for account setup and validation.
                  </p>
                  <p className="text-gray-600 mb-3 text-base sm:text-lg leading-relaxed">
                    When you access our website or LMS, your IP address is automatically recorded to help us understand your browser type and operating system.
                  </p>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    We may also use your contact information to send updates, promotional content, and product announcements via email, provided you've opted in.
                  </p>
                  
                  <h3 className="text-lg sm:text-xl font-semibold text-indigo-600 mb-2 mt-4">b. For Employment and User Services</h3>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    To support internal operations, hiring processes, or service personalization, we may collect your email, communication preferences, and interaction history with our recruitment or LMS systems. You may update or request modifications to this data unless it has already been shared for business-critical operations.
                  </p>
                </section>
                
                <section className="border-l-2 border-indigo-200 pl-4 py-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-4 flex items-center">
                    <span className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">2</span>
                    User Consent
                  </h2>
                  
                  <h3 className="text-lg sm:text-xl font-semibold text-indigo-600 mb-2 mt-4">a. How We Obtain Consent</h3>
                  <p className="text-gray-600 mb-3 text-base sm:text-lg leading-relaxed">
                    When you submit personal data for completing a transaction (e.g., order placement, credit card verification, delivery setup), we treat this as your consent to collect and use that data.
                  </p>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    If we require your data for purposes beyond the original transaction—such as marketing—we will seek explicit permission.
                  </p>
                  
                  <h3 className="text-lg sm:text-xl font-semibold text-indigo-600 mb-2 mt-4">b. Withdrawing Consent</h3>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    You may revoke your consent at any time by contacting us at contact@raasacademy.com to stop further communication or data processing.
                  </p>
                </section>
                
                <section className="border-l-2 border-indigo-200 pl-4 py-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-4 flex items-center">
                    <span className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">3</span>
                    Cookies and Tracking Tools
                  </h2>
                  <p className="text-gray-600 mb-3 text-base sm:text-lg leading-relaxed">
                    Cookies are small files stored by your web browser to help recognize your device and personalize your experience. We use them to analyze performance, store preferences, and monitor user behavior across the site.
                  </p>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    Technologies like JavaScript, Odoo, and Flash cookies may be used to collect information such as session length, download errors, scroll behavior, and device specifications.
                  </p>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    Data collected may be shared with fraud prevention partners, advertising platforms, or analytics tools, and used to improve our offerings or prevent unauthorized activity.
                  </p>
                </section>
                
                <section className="border-l-2 border-indigo-200 pl-4 py-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-4 flex items-center">
                    <span className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">4</span>
                    Managing Cookies
                  </h2>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    Cookies help track areas of the site you visit and improve your browsing experience. While cookies do not store identifiable personal data, disabling them may limit the functionality of certain site features.
                  </p>
                </section>
                
                <section className="border-l-2 border-indigo-200 pl-4 py-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-4 flex items-center">
                    <span className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">5</span>
                    Third-Party Data Sharing
                  </h2>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    We may share your data with trusted third-party partners—like advertisers, analytics firms, and collaborators—for service improvements, targeted marketing, or research purposes. Any such sharing complies with relevant privacy standards.
                  </p>
                </section>
                
                <section className="border-l-2 border-indigo-200 pl-4 py-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-4 flex items-center">
                    <span className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">6</span>
                    International Data Transfers
                  </h2>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    Your data may be accessed or processed by team members or partners located in countries with different data protection laws. By using our platform, you acknowledge and agree to such cross-border transfers, even where protections may differ from your home country.
                  </p>
                </section>
                
                <section className="border-l-2 border-indigo-200 pl-4 py-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-4 flex items-center">
                    <span className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">7</span>
                    Data Security
                  </h2>
                  <p className="text-gray-600 mb-3 text-base sm:text-lg leading-relaxed">
                    While no system is 100% secure, we implement robust security practices—including encrypted connections, SSL technology, and access controls—to protect your data. However, we cannot guarantee full immunity against unauthorized access, and we are committed to acting swiftly in the event of any breach.
                  </p>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    All sensitive information is processed over secure connections and transmitted via trusted gateways. We do not retain payment details after a transaction is complete.
                  </p>
                  <p className="text-gray-600 mt-3 text-base sm:text-lg leading-relaxed">
                    Note: While we maintain rigorous security, users should also take measures to protect their devices and data.
                  </p>
                </section>
                
                <section className="border-l-2 border-indigo-200 pl-4 py-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-4 flex items-center">
                    <span className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">8</span>
                    Affiliates and Business Operations
                  </h2>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    We may share your data with affiliated organizations involved in service delivery or operational support. All such entities are required to follow our privacy standards.
                  </p>
                </section>
                
                <section className="border-l-2 border-indigo-200 pl-4 py-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-4 flex items-center">
                    <span className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">9</span>
                    Data Collection and Governance
                  </h2>
                  
                  <h3 className="text-lg sm:text-xl font-semibold text-indigo-600 mb-2 mt-4">a. Data Register Maintenance</h3>
                  <p className="text-gray-600 mb-3 text-base sm:text-lg leading-relaxed">
                    Our appointed Data Protection Officer ensures that we comply with data regulations by maintaining a Data Processing Register. Employees are responsible for upholding data handling standards under company policy.
                  </p>
                  
                  <h3 className="text-lg sm:text-xl font-semibold text-indigo-600 mb-2 mt-4">b. Data Controller Responsibilities</h3>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    RASS Academy is the official Data Controller of any personal data you submit. The organization managing the platform and services is responsible for how your data is used and stored.
                  </p>
                </section>
                
                <section className="border-l-2 border-indigo-200 pl-4 py-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-4 flex items-center">
                    <span className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">10</span>
                    Data Storage and Retention
                  </h2>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    We retain personal data only as long as necessary to fulfill our obligations to you or comply with legal requirements. Once data is no longer needed, it is securely deleted, anonymized, or archived in accordance with our data retention policy.
                  </p>
                </section>
                
                <section className="border-l-2 border-indigo-200 pl-4 py-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-4 flex items-center">
                    <span className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">11</span>
                    Data Protection Measures
                  </h2>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    All sensitive information is processed over secure connections and transmitted via trusted gateways. We do not retain payment details after a transaction is complete.
                  </p>
                  <p className="text-gray-600 mt-3 text-base sm:text-lg leading-relaxed">
                    Note: While we maintain rigorous security, users should also take measures to protect their devices and data.
                  </p>
                </section>
                
                <section className="border-l-2 border-indigo-200 pl-4 py-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-4 flex items-center">
                    <span className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">12</span>
                    Legal Jurisdiction
                  </h2>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    This Privacy Policy is governed by Indian law, though users may be subject to additional local or international regulations depending on their location.
                  </p>
                  <p className="text-gray-600 mt-3 text-base sm:text-lg leading-relaxed">
                    Using our services, registering, or purchasing implies your agreement to this Privacy Policy.
                  </p>
                </section>
                
                <section className="border-l-2 border-indigo-200 pl-4 py-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-4 flex items-center">
                    <span className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">13</span>
                    External Links
                  </h2>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    Our website may contain links to third-party websites or services. We do not control these external entities and are not responsible for how they collect or use your information. Please review their privacy policies before sharing any data.
                  </p>
                </section>
                
                <section className="border-l-2 border-indigo-200 pl-4 py-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-4 flex items-center">
                    <span className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">14</span>
                    Policy Updates
                  </h2>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    We may revise this Privacy Policy periodically to reflect changes in laws or services. The updated date at the bottom of this document indicates the latest revision. Please revisit this page regularly for updates.
                  </p>
                </section>
                
                <section className="border-l-2 border-indigo-200 pl-4 py-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-4 flex items-center">
                    <span className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">15</span>
                    Third-Party Services
                  </h2>
                  <p className="text-gray-600 mb-3 text-base sm:text-lg leading-relaxed">
                    We may offer services or integrate features from third-party providers. RASS Academy is not responsible for these external services or their privacy practices.
                  </p>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    For any inquiries regarding your data, including access requests, updates, or complaints, contact our Privacy Compliance Officer at:
                  </p>
                  <div className="bg-indigo-50 p-4 sm:p-6 rounded-lg mt-4 border border-indigo-100">
                    <p className="font-semibold text-indigo-700 text-base sm:text-lg">📧 contact@raasacademy.com</p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;