import React, { useState } from 'react';

const CompaniesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'direct' | 'custom'>('direct');

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 font-sans">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-2/3 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Access India's Industry-Ready Talent Pipeline. At Zero Cost.</h1>
              <p className="text-xl mb-8">Streamline your hiring by engaging pre-skilled, industry-ready interns from India who bring fresh perspectives, support critical projects, and deliver tangible outcomes.</p>
              <button className="bg-white text-blue-700 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-blue-100 transition-all duration-300 transform hover:scale-105">
                Schedule a call
              </button>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <div className="bg-white/20 p-6 rounded-2xl backdrop-blur-md border border-white/30">
                <div className="text-5xl mb-4">👥</div>
                <h3 className="text-xl font-semibold">Skilled Talent</h3>
                <p className="text-sm mt-2">Access pre-skilled talent from India without any recruitment fees</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Flexible Talent & Skills Hiring Solutions for Your Industry</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            We offer tailored learning pathways to help companies seamlessly integrate industry-ready talent into their teams.
          </p>

          {/* Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-full p-1 shadow-lg flex">
              <button
                onClick={() => setActiveTab('direct')}
                className={`px-6 py-3 rounded-full font-medium transition-all ${activeTab === 'direct' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
              >
                Direct Hire Program
              </button>
              <button
                onClick={() => setActiveTab('custom')}
                className={`px-6 py-3 rounded-full font-medium transition-all ${activeTab === 'custom' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
              >
                Custom Training Program
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 max-w-4xl mx-auto">
            {activeTab === 'direct' ? (
              <div className="text-left">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Direct Hire from Our Pre-Skilled Talent Pool in India</h3>
                <p className="text-gray-600 mb-8">Ideal for companies ready to onboard industry-ready talent with proven skills.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                  <div className="text-center">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🔍</span>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">Browse Talent</h4>
                    <p className="text-sm text-gray-600">Access our pool of highly trained, pre-screened interns.</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">👥</span>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">Interview & Select</h4>
                    <p className="text-sm text-gray-600">Conduct interviews with shortlisted candidates to ensure the best fit.</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">Onboard Quickly</h4>
                    <p className="text-sm text-gray-600">Selected interns join your ongoing or upcoming projects without delay.</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Benefit</h4>
                  <p className="text-blue-700">No training overhead—interns are job-ready from day one.</p>
                </div>
              </div>
            ) : (
              <div className="text-left">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Customized Training-to-Hire Program</h3>
                <p className="text-gray-600 mb-8">Perfect for businesses with specific project requirements.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                  <div className="text-center">
                    <div className="bg-indigo-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl">💬</span>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Share Your Needs</h4>
                    <p className="text-xs text-gray-600">Provide us with your project scope, required skills, and timelines.</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-indigo-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl">🎯</span>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Tailored Training</h4>
                    <p className="text-xs text-gray-600">We design and deliver a targeted training program aligned with your requirements.</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-indigo-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl">📊</span>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Assess & Interview</h4>
                    <p className="text-xs text-gray-600">Candidates complete assessments to validate their skills before your final interviews.</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-indigo-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl">🚀</span>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Deploy with Confidence</h4>
                    <p className="text-xs text-gray-600">Interns join your project with the exact skill set you need.</p>
                  </div>
                </div>
                
                <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200">
                  <h4 className="font-semibold text-indigo-800 mb-2">Benefit</h4>
                  <p className="text-indigo-700">Interns are trained exclusively to meet your project's technical and operational needs.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Industry Leaders Choose Our Skilled Talent</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
              <p className="text-gray-600">Industry-ready from day one</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
              <p className="text-gray-600">Pre-skilled and screened</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">$0</div>
              <p className="text-gray-600">Recruitment cost</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">80%</div>
              <p className="text-gray-600">Conversion to full-time</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <h2 className="text-3xl font-bold mb-6">Ready to Access India's Industry-Ready Talent?</h2>
          <p className="text-xl mb-8">Join hundreds of companies that have found skilled talent through our learning and placement programs.</p>
          <button className="bg-white text-blue-700 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-blue-100 transition-all duration-300 mr-4">
            Schedule a call
          </button>
          <button className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-full hover:bg-white/10 transition-all duration-300">
            Browse talent
          </button>
        </div>
      </section>

    </div>
  );
};

export default CompaniesPage;