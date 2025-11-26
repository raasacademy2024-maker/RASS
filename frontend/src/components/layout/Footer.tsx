import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12" role="contentinfo" aria-label="Site footer">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* About Section */}
          <div>
            <img 
              src="/logo.webp" 
              alt="RASS Academy Logo - Online Learning Platform" 
              className="h-12 w-auto"
              width="auto"
              height="48"
              loading="lazy"
            />
            <p className="text-sm leading-relaxed mt-4">
              RASS Academy offers comprehensive LMS solutions, online courses, webinars, and community support  
              to help learners achieve their goals. Join us to unlock your potential.
            </p>
          </div>
          
          {/* Useful Links */}
          <nav aria-label="Useful links">
            <h3 className="text-white text-xl font-semibold mb-4">Useful Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/courses" className="hover:text-white transition" aria-label="Browse all courses">Courses</a></li>
              <li><a href="/blog" className="hover:text-white transition" aria-label="Read our blog">Blog</a></li>
              <li><a href="/contact" className="hover:text-white transition" aria-label="Contact us">Contact Us</a></li>
              <li><a href="/StudentAmbassadorForm" className="hover:text-white transition" aria-label="Become a campus partner">Campus Partner</a></li>
            </ul>
          </nav>
          
          {/* Support & Resources */}
          <nav aria-label="Support links">
            <h3 className="text-white text-xl font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/help-center" className="hover:text-white transition" aria-label="Visit help center">Help Center</a></li>
              <li><a href="/terms" className="hover:text-white transition" aria-label="Read terms and conditions">Terms and Conditions</a></li>
              <li><a href="/privacy" className="hover:text-white transition" aria-label="Read privacy policy">Privacy Policy</a></li>
            </ul>
          </nav>
          
          {/* Social & Contact */}
          <div>
            <h3 className="text-white text-xl font-semibold mb-4">Stay Connected</h3>
            <div className="flex space-x-4 mb-4" role="navigation" aria-label="Social media links">
              <a 
                href="https://www.facebook.com/people/RAAS-Academy/61575206894118/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition"
                aria-label="Follow us on Facebook"
              >
                <FaFacebookF className="text-white w-4 h-4" aria-hidden="true" />
              </a>
              <a 
                href="https://www.instagram.com/raas_academy_/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-gray-800 rounded-full hover:bg-pink-500 transition"
                aria-label="Follow us on Instagram"
              >
                <FaInstagram className="text-white w-4 h-4" aria-hidden="true" />
              </a>
              <a 
                href="https://www.linkedin.com/company/raasacademy/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-gray-800 rounded-full hover:bg-blue-700 transition"
                aria-label="Connect with us on LinkedIn"
              >
                <FaLinkedinIn className="text-white w-4 h-4" aria-hidden="true" />
              </a>
            </div>
            <p className="text-sm">
              <strong>Email:</strong>{" "}
              <a 
                href="mailto:support@rassacademy.com"
                className="hover:text-white transition"
                aria-label="Email us at support@rassacademy.com"
              >
                support@rassacademy.com
              </a>
            </p>
            <p className="text-sm mt-1">
              <strong>Phone:</strong>{" "}
              <a href="tel:+919063194887" className="hover:text-white transition" aria-label="Call us at +91 9063194887">
                +91 9063194887
              </a>
            </p>
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-t border-gray-700 mt-12" role="separator"></div>
        
        {/* Bottom */}
        <div className="mt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} RASS Academy. All rights reserved.</p>
          <nav className="mt-4 md:mt-0 space-x-4" aria-label="Legal links">
            <a href="/terms" className="hover:text-white transition">Terms and Conditions</a>
            <span className="text-gray-600" aria-hidden="true">·</span>
            <a href="/privacy" className="hover:text-white transition">Privacy Policy</a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
