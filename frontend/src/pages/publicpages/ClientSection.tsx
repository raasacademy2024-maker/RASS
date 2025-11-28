import React from "react";
import { motion } from "framer-motion";


import JnJLogo from "../clients/jnj-logo.png";
import PfizerLogo from "@/assets/clients/pfizer-logo.png";
import MicrosoftLogo from "@/assets/clients/microsoft-logo.png";
import AmazonLogo from "@/assets/clients/amazon-logo.png";
import GoogleLogo from "@/assets/clients/google-logo.png";
import IBMLogo from "@/assets/clients/ibm-logo.png";
import OracleLogo from "@/assets/clients/oracle-logo.png";
import SalesforceLogo from "@/assets/clients/salesforce-logo.png";
import CiscoLogo from "@/assets/clients/cisco-logo.png";
import IntelLogo from "@/assets/clients/intel-logo.png";
import HPELogo from "@/assets/clients/hpe-logo.png";
import DellLogo from "@/assets/clients/dell-logo.png";
import AccentureLogo from "@/assets/clients/accenture-logo.png";
import DeloitteLogo from "@/assets/clients/deloitte-logo.png";
import EYLogo from "@/assets/clients/ey-logo.png";
import McKinseyLogo from "@/assets/clients/mckinsey-logo.png";
import BCGLogo from "@/assets/clients/bcg-logo.png";


const clientLogos = [
  { name: "Johnson & Johnson", logo: "../clients/jnj-logo.png" },
  { name: "Pfizer", logo: "../clients/pfizer-logo.png" },
  { name: "Microsoft", logo: "../clients/microsoft-logo.png" },
  { name: "Amazon", logo: "../clients/amazon-logo.png" },
  { name: "Google", logo: "../clients/google-logo.png" },
  { name: "IBM", logo: "../clients/ibm-logo.png" },
  { name: "Oracle", logo: "../clients/oracle-logo.png" },
  { name: "Salesforce", logo: "../clients/salesforce-logo.png" },
  { name: "Cisco", logo: "../clients/cisco-logo.png" },
  { name: "Intel", logo: "../clients/intel-logo.png" },
  { name: "HPE", logo: "../clients/hpe-logo.png" },
  { name: "Dell Technologies", logo: "../clients/dell-logo.png" },
  { name: "Accenture", logo: "../clients/accenture-logo.png" },
  { name: "Deloitte", logo: "../clients/deloitte-logo.png" },
  { name: "EY", logo: "../clients/ey-logo.png" },
  { name: "McKinsey", logo: "../clients/mckinsey-logo.png" },
  { name: "BCG", logo: "../clients/bcg-logo.png" },
];

export function ClientsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Decorative elements */}
   
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-bold text-gray-800 pb-3 leading-tight">
            Trusted by Industry Leaders Across India
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our skilled talent and learning programs are recognized by top companies.
          </p>
        </motion.div>

        {/* Scrolling logos container */}
        <div className="relative overflow-hidden py-4">
          {/* Gradient fades on the sides */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10"></div>
          
          {/* First scrolling row */}
          <motion.div 
            className="flex mb-8"
            initial={{ x: 0 }}
            animate={{ x: "-50%" }}
            transition={{ 
              repeat: Infinity,
              duration: 30,
              ease: "linear"
            }}
          >
            {[...clientLogos, ...clientLogos].map((client, index) => (
              <div
                key={`first-${client.name}-${index}`}
                className="flex-shrink-0 w-48 h-24 mx-6 bg-white rounded-xl shadow-sm flex items-center justify-center p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 border border-gray-100"
              >
                <img 
                  src={client.logo} 
                  alt={client.name} 
                  className="max-h-12 max-w-full object-contain transition-all duration-300 hover:opacity-80"
                />
              </div>
            ))}
          </motion.div>
          
          {/* Second scrolling row (reverse direction) */}
          <motion.div 
            className="flex"
            initial={{ x: "-50%" }}
            animate={{ x: 0 }}
            transition={{ 
              repeat: Infinity,
              duration: 35,
              ease: "linear"
            }}
          >
            {[...clientLogos, ...clientLogos].map((client, index) => (
              <div
                key={`second-${client.name}-${index}`}
                className="flex-shrink-0 w-48 h-24 mx-6 bg-white rounded-xl shadow-sm flex items-center justify-center p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 border border-gray-100"
              >
                <img 
                  src={client.logo} 
                  alt={client.name} 
                  className="max-h-12 max-w-full object-contain transition-all duration-300 hover:opacity-80"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}