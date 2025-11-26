import React from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import SEO, { pageSEOConfig } from "../../components/common/SEO";

const Terms: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <SEO {...pageSEOConfig.terms} />
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8 w-full">
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-100">
          <div className="p-6 sm:p-8 md:p-12 h-full">
            <div className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-indigo-700 mb-3">Terms and Conditions</h1>
              <div className="w-24 h-1 bg-indigo-300 rounded-full mx-auto mt-4"></div>
              <p className="text-lg sm:text-xl text-indigo-500 mt-6">Welcome to RASS Academy!</p>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6 text-base sm:text-lg leading-relaxed">
                Please read the following Terms and Conditions carefully before using our website or LMS (Learning Management System). 
                By accessing or using our platform, you agree to comply with and be bound by these Terms and Conditions.
              </p>
              
              <p className="text-gray-600 mb-8 text-base sm:text-lg leading-relaxed">
                In this document, "RASS Academy", "Company", "we", or "us" refers to the provider of the services, 
                while "user", "you", or "customer" refers to the individual or entity using our services.
              </p>
              
              <div className="space-y-8 sm:space-y-10">
                <section className="border-l-2 border-indigo-200 pl-4 py-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-4 flex items-center">
                    <span className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">1</span>
                    Acceptance of Terms
                  </h2>
                  <p className="text-gray-600 mb-3 text-base sm:text-lg leading-relaxed">
                    By accessing any part of our website, content, or LMS, you acknowledge that you have read, 
                    understood, and agree to be legally bound by these Terms and Conditions. If you do not accept 
                    any of the terms, you are advised to cease using our website, products, or services immediately.
                  </p>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    If a third party (such as an organization or another person) grants you access to our platform, 
                    that party assumes full responsibility for any liabilities or damages resulting from the access.
                  </p>
                </section>
                
                <section className="border-l-2 border-indigo-200 pl-4 py-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-4 flex items-center">
                    <span className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">2</span>
                    Usage Rights
                  </h2>
                  <p className="text-gray-600 mb-3 text-base sm:text-lg leading-relaxed">
                    RASS Academy is the sole owner and operator of the website, its content, products, and services. 
                    Unless otherwise explicitly permitted, you may only use the site and its materials for personal 
                    and non-commercial purposes under specified conditions.
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-3 text-base sm:text-lg leading-relaxed">
                    <li>Materials (images, logos, designs, content) may not be used for commercial gain without written consent.</li>
                    <li>Users may print or download content for personal, non-commercial use.</li>
                    <li>Reproduction, distribution, transmission, or public display of any material from our platform is strictly prohibited.</li>
                  </ul>
                </section>
                
                <section className="border-l-2 border-indigo-200 pl-4 py-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-4 flex items-center">
                    <span className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">3</span>
                    Access and Availability
                  </h2>
                  <p className="text-gray-600 mb-3 text-base sm:text-lg leading-relaxed">
                    Any user with an internet connection can access certain free services. However, RASS Academy is not 
                    responsible for any internet, hardware, or software costs incurred. The user is solely responsible 
                    for the functionality of their own equipment and connection.
                  </p>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    Users will require login credentials to access paid or restricted areas. We reserve the right to 
                    grant or revoke access at our discretion if a user violates these Terms.
                  </p>
                </section>
                
                <section className="border-l-2 border-indigo-200 pl-4 py-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-4 flex items-center">
                    <span className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">4</span>
                    Third-party Services
                  </h2>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    We collaborate with third-party service providers to enhance functionality. By accepting these Terms, 
                    you also agree to abide by the terms of these providers. RASS Academy is not liable for disruptions 
                    caused by third-party services.
                  </p>
                </section>
                
                <section className="border-l-2 border-indigo-200 pl-4 py-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-4 flex items-center">
                    <span className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">5</span>
                    Use of Cookies
                  </h2>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    We use cookies to store, manage, and retrieve data to improve your browsing experience. Some cookies 
                    may come from third-party advertising or analytics partners. By using our website, you consent to the 
                    use of cookies.
                  </p>
                </section>
                
                <section className="border-l-2 border-indigo-200 pl-4 py-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-4 flex items-center">
                    <span className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">6</span>
                    User Conduct
                  </h2>
                  <p className="text-gray-600 mb-3 text-base sm:text-lg leading-relaxed">
                    When registering or enrolling in a course/program, users agree to:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-3 text-base sm:text-lg leading-relaxed">
                    <li>Not create multiple accounts.</li>
                    <li>Comply with these Terms and any program-specific policies.</li>
                  </ul>
                  <p className="text-gray-600 mb-3 text-base sm:text-lg leading-relaxed">Users shall not:</p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2 text-base sm:text-lg leading-relaxed">
                    <li>Copy, redistribute, or modify any RASS Academy content for commercial purposes.</li>
                    <li>Share or upload any unauthorized, illegal, obscene, or defamatory content.</li>
                    <li>Use bots, scripts, or automated tools to access or manipulate the platform.</li>
                  </ul>
                </section>
                
                <section className="border-l-2 border-indigo-200 pl-4 py-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-4 flex items-center">
                    <span className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">7</span>
                    Intellectual Property
                  </h2>
                  <p className="text-gray-600 mb-3 text-base sm:text-lg leading-relaxed">
                    All content available on RASS Academy's platform is copyrighted and owned by RASS Academy or its affiliates. 
                    Any unauthorized use constitutes copyright infringement.
                  </p>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    If your copyrighted work appears on our platform without authorization, you may contact us with:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-2 text-base sm:text-lg leading-relaxed">
                    <li>A description of the copyrighted work.</li>
                    <li>Location of the infringing material on our site.</li>
                    <li>Proof of ownership or authority.</li>
                    <li>Contact information.</li>
                  </ul>
                  <p className="text-gray-600 mt-3 text-base sm:text-lg leading-relaxed">
                    We will respond appropriately upon verification.
                  </p>
                </section>
                
                <section className="border-l-2 border-indigo-200 pl-4 py-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-4 flex items-center">
                    <span className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">8</span>
                    User-Generated Content
                  </h2>
                  <p className="text-gray-600 mb-3 text-base sm:text-lg leading-relaxed">
                    RASS Academy does not pre-screen user comments or content. Such content reflects the views of the user 
                    and not of RASS Academy. However, we reserve the right to:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-3 text-base sm:text-lg leading-relaxed">
                    <li>Remove comments that are offensive, unlawful, or violate third-party rights.</li>
                    <li>Monitor and manage posted content on any of our digital forums or social media platforms.</li>
                  </ul>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    By posting, you grant RASS Academy the right to use, reproduce, and publish your contributions.
                  </p>
                </section>
                
                <section className="border-l-2 border-indigo-200 pl-4 py-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-4 flex items-center">
                    <span className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">9</span>
                    Linking Policy
                  </h2>
                  <p className="text-gray-600 mb-3 text-base sm:text-lg leading-relaxed">
                    Users must obtain written permission before linking to our website. We may request removal of such 
                    links at any time. Linking to our site:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2 text-base sm:text-lg leading-relaxed">
                    <li>Should not misrepresent RASS Academy.</li>
                    <li>Must not connect our content with inappropriate, offensive, or illegal websites.</li>
                    <li>Should not imply endorsement where none exists.</li>
                  </ul>
                </section>
                
                <section className="border-l-2 border-indigo-200 pl-4 py-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-4 flex items-center">
                    <span className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">10</span>
                    Transactions & Payments
                  </h2>
                  <p className="text-gray-600 mb-3 text-base sm:text-lg leading-relaxed">
                    By making a transaction on our website:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-3 text-base sm:text-lg leading-relaxed">
                    <li>You agree to the terms of that transaction, including payment, subscription timelines, processing fees, and taxes.</li>
                    <li>No warranties are provided regarding our products or services unless stated in writing.</li>
                  </ul>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    RASS Academy reserves the right to modify pricing, limit orders, or refuse service at its discretion.
                  </p>
                </section>
                
                <section className="border-l-2 border-indigo-200 pl-4 py-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-4 flex items-center">
                    <span className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">11</span>
                    Platform Security
                  </h2>
                  <p className="text-gray-600 mb-3 text-base sm:text-lg leading-relaxed">Users must not:</p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2 text-base sm:text-lg leading-relaxed">
                    <li>Attempt unauthorized access to accounts or features.</li>
                    <li>Hack, tamper, or disrupt the functionality of the platform.</li>
                    <li>Upload harmful software (viruses, trojans, worms).</li>
                    <li>Advertise or spam users.</li>
                    <li>Post illegal, explicit, or misleading content.</li>
                  </ul>
                  <p className="text-gray-600 mt-3 text-base sm:text-lg leading-relaxed">
                    Violations may lead to civil or criminal prosecution, and RASS Academy will cooperate with law 
                    enforcement as necessary.
                  </p>
                </section>
                
                <section className="border-l-2 border-indigo-200 pl-4 py-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-4 flex items-center">
                    <span className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">12</span>
                    Termination of Access
                  </h2>
                  <p className="text-gray-600 mb-3 text-base sm:text-lg leading-relaxed">
                    RASS Academy may, at its discretion, suspend or terminate user access to the platform without prior 
                    notice if:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2 text-base sm:text-lg leading-relaxed">
                    <li>The user violates any part of these Terms.</li>
                    <li>Intellectual property rights are infringed.</li>
                    <li>Unauthorized content is uploaded.</li>
                    <li>User conduct is inconsistent with the platform's standards.</li>
                  </ul>
                  <p className="text-gray-600 mt-3 text-base sm:text-lg leading-relaxed">
                    We reserve the right to retain user data even after termination.
                  </p>
                </section>
                
                <section className="border-l-2 border-indigo-200 pl-4 py-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-4 flex items-center">
                    <span className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">13</span>
                    Career Services Terms
                  </h2>
                  <p className="text-gray-600 mb-3 text-base sm:text-lg leading-relaxed">
                    RASS Academy may collect and use personal information from job seekers only for recruitment and 
                    management purposes. This data will be:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2 text-base sm:text-lg leading-relaxed">
                    <li>Used strictly for hiring purposes.</li>
                    <li>Maintained securely and kept up to date.</li>
                    <li>Accessed only by authorized personnel.</li>
                  </ul>
                  <p className="text-gray-600 mt-3 text-base sm:text-lg leading-relaxed">
                    We may contact job seekers via phone, email, or other communication channels.
                  </p>
                </section>
                
                <section className="border-l-2 border-indigo-200 pl-4 py-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-4 flex items-center">
                    <span className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">14</span>
                    Updates and Changes
                  </h2>
                  <p className="text-gray-600 mb-3 text-base sm:text-lg leading-relaxed">
                    We may update our platform and Terms of Service at any time. These updates may:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2 text-base sm:text-lg leading-relaxed">
                    <li>Add or remove features.</li>
                    <li>Change the appearance or functionality of services.</li>
                    <li>Be subject to the same Terms and Conditions.</li>
                  </ul>
                  <p className="text-gray-600 mt-3 text-base sm:text-lg leading-relaxed">
                    We are not obligated to maintain or restore previous features or versions.
                  </p>
                </section>
                
                <section className="border-l-2 border-indigo-200 pl-4 py-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-4 flex items-center">
                    <span className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">15</span>
                    Dispute Resolution
                  </h2>
                  <p className="text-gray-600 mb-3 text-base sm:text-lg leading-relaxed">
                    To resolve a dispute, a Notice of Dispute must first be sent. Within 60 days, we will attempt 
                    informal negotiations. If unresolved after this period, either party may initiate arbitration.
                  </p>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    Any dispute not resolved within 60 working days via support may be escalated to our Grievance Officer.
                  </p>
                  <div className="bg-indigo-50 p-4 sm:p-6 rounded-lg mt-4 border border-indigo-100">
                    <p className="font-semibold text-indigo-700 text-base sm:text-lg">Grievance Officer: Mr. Ajay Kandimalla</p>
                    <p className="text-indigo-600 text-base sm:text-lg">Email: <a href="mailto:contact@raasacademy.com" className="text-indigo-600 hover:underline font-medium">contact@raasacademy.com</a></p>
                  </div>
                </section>
                
                <section className="border-l-2 border-indigo-200 pl-4 py-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-4 flex items-center">
                    <span className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">16</span>
                    Entire Agreement
                  </h2>
                  <p className="text-gray-600 mb-3 text-base sm:text-lg leading-relaxed">
                    These Terms constitute the complete agreement between you and RASS Academy. Any additional terms 
                    must be agreed upon in writing. You may not transfer your rights or obligations under this agreement 
                    to another party.
                  </p>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    By using this website, enrolling in a program, or submitting a form, you acknowledge and agree to 
                    receive communications (SMS, email, or calls) via third-party platforms for promotional or 
                    informational purposes.
                  </p>
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

export default Terms;