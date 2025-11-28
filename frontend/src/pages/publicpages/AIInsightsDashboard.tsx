import { useState } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  Users, 
  Globe, 
  Zap, 
  BookOpen,
  Shield,
  Target,
  Award,
  Building,
  MapPin,
  Book,
  GraduationCap,
  UserPlus,
  CreditCard,
  Clock,
  Bot,
  TrendingUp as TrendingUpIcon,
  Monitor
} from 'lucide-react';

// Define TypeScript interfaces
interface Report {
  id: number;
  title: string;
  publisher: string;
  year: string;
  highlights: string[];
  keyStat?: {
    value: string;
    label: string;
  };
  source: string;
  image?: string; // Added image property
}

interface MetricCard {
  id: number;
  title: string;
  value: string;
  change: string;
  icon: JSX.Element;
  color: string;
}

const SkillInsightsDashboard = () => {
  const reports: Report[] = [
    {
      id: 1,
      title: "What do employers in India really want in 2025?",
      publisher: "India Today",
      year: "October 2025",
      source: "https://www.indiatoday.in/education-today/featurephilia/story/india-job-market-shifts-from-degrees-to-skills-for-better-employability-2800506-2025-10-10",
      image: "/images/Home/degreevsskills.png", // Added image
      highlights: [
        "India's job market now values skills over degrees. Employers want doers, not just degree holders.",
        "Day-one productivity is the new hiring benchmark.",
        "Degrees ≠ jobs - More than 50% Indian graduates are underemployed.",
        "Govt Initiatives now bridge the gap with assessments and rapid job placement.",
        "Continuous learning and industry collaboration are key for India's future workforce."
      ],
      keyStat: {
        value: "50%+",
        label: "of Indian graduates are underemployed"
      }
    },
    {
      id: 2,
      title: "The Skills Revolution: Shaping India's Workforce and Economy",
      publisher: "The Economist",
      year: "2025",
      source: "https://impact.economist.com/new-globalisation/bridging-skills-gap-fuelling-careers-and-economy-india",
      image: "/images/Home/bridginggap.png", // Added image
      highlights: [
        "9 in 10 Indian companies face hiring challenges from a growing tech skills gap.",
        "70% of employees say upskilling greatly boosts job performance.",
        "71% say employers highly value online certifications.",
        "As India digitalizes, demand surges for advanced digital and soft skills."
      ],
      keyStat: {
        value: "90%",
        label: "of companies face hiring challenges"
      }
    },
    {
      id: 3,
      title: "Global Talent Shortage Survey - 2025",
      publisher: "ManpowerGroup",
      year: "2025",
      source: "https://manpowergroup.co.in/talent-shortage/talent-shortage-files/MPG-Talent-Shortage-2025-Findings.pdf",
      image: "/images/Home/talentshortage.png", // Added image
      highlights: [
        "80% of Indian employers struggle to find skilled talent in 2025 a 25% rise since 2014.",
        "Talent shortage spans all company sizes, peaking at 85% among firms with under 10 employees.",
        "India tops the world in demand for IT and data skills.",
        "All Indian regions face severe talent shortages, ranging from 77%"
      ],
      keyStat: {
        value: "80%",
        label: "of employers struggle to find skilled talent"
      }
    }
  ];

  const metrics = [
    {
      id: 1,
      title: "Internship Seekers",
      value: "93%",
      change: "93% Of students actively seek internships in college",
      icon: <GraduationCap size={24} />,
      color: "from-blue-500 to-cyan-400",
      source: "https://wheebox.com/assets/pdf/ISR_Report_2025.pdf"
    },
    {
      id: 2,
      title: "Hiring Intent 2025",
      value: "29%",
      change: "Rise with 11.1% more new hires projected",
      icon: <UserPlus size={24} />,
      color: "from-purple-500 to-pink-400",
      source: "https://wheebox.com/assets/pdf/ISR_Report_2025.pdf"
    },
    {
      id: 3,
      title: "Salary Preference",
      value: "43%",
      change: "Prefer ₹30K–₹40K/month starting salary",
      icon: <CreditCard size={24} />,
      color: "from-green-500 to-emerald-400",
      source: "https://wheebox.com/assets/pdf/ISR_Report_2025.pdf"
    },
    {
      id: 4,
      title: "Experience Demand",
      value: "55.2%",
      change: "Hiring demand for 1–5 yrs experience",
      icon: <Clock size={24} />,
      color: "from-orange-500 to-red-400",
      source: "https://wheebox.com/assets/pdf/ISR_Report_2025.pdf"
    }
  ];

  const aiTrends = [
    {
      id: 1,
      title: "AI in Recruitment",
      value: "38%",
      description: "AI use in recruitment expected to rise sharply",
      icon: <Bot size={24} />
    },
    {
      id: 2,
      title: "AI-Ready Workforce",
      value: "1 million",
      description: "India's AI-ready workforce by 2026",
      icon: <TrendingUpIcon size={24} />
    },
    {
      id: 3,
      title: "Virtual Internships",
      value: "93%",
      description: "Students prefer AI-driven virtual internships",
      icon: <Monitor size={24} />
    }
  ];

  // Helper function to get image by keyStat value
  const getImageForStat = (statValue: string) => {
    switch(statValue) {
      case "80%":
        return "/images/Home/talentshortage.png";
      case "50%+":
        return "/images/Home/degreevsskills.png";
      case "90%":
        return "/images/Home/bridginggap.png";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 p-4 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 pb-3 leading-tight">
            Skills Survey Insights 2025
          </h1>
          <p className="mt-2 text-lg text-gray-600 font-medium">India's talent trends, industry forecasts, and learning shifts shaping the future workforce.</p>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Reports */}
          <div className="lg:col-span-2 space-y-6">
            {reports.map((report) => (
              <div 
                key={report.id}
                className="relative bg-white/40 backdrop-blur-xl rounded-3xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 p-6"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-purple-100/20 rounded-3xl" />
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{report.title}</h2>
                  <p className="text-gray-600 mb-2">{report.publisher}</p>
                  
                  {/* Added book icon to View Source button */}
                  <div className="flex justify-start mb-4">
                    <a href={report.source} target="_blank" rel="noopener noreferrer" 
                       className="inline-flex items-center px-3 py-1 bg-purple-500/10 text-purple-600 rounded-full text-sm font-medium hover:bg-purple-500/20 transition-colors">
                      <Book size={14} className="mr-1" />
                      <span>View Source</span>
                    </a>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <Zap size={18} className="text-yellow-500" />
                        Key Highlights
                      </h3>
                      <ul className="space-y-2">
                        {report.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700 text-sm">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {report.keyStat && (
                      <div className="relative rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-200/50 overflow-hidden">
                        {/* Full card image with hover overlay */}
                        {report.image && (
                          <div className="relative h-full min-h-[200px]">
                            <img 
                              src={report.image} 
                              alt={report.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                              <div className="text-5xl font-bold text-white mb-2">{report.keyStat.value}</div>
                              <div className="text-white text-center text-sm px-2">{report.keyStat.label}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-200/30 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-100/80 text-gray-700 rounded-full text-xs flex items-center gap-1">
                      <Target size={12} />
                      Workforce Trends
                    </span>
                    <span className="px-3 py-1 bg-gray-100/80 text-gray-700 rounded-full text-xs flex items-center gap-1">
                      <Users size={12} />
                      Employment Shifts
                    </span>
                    <span className="px-3 py-1 bg-gray-100/80 text-gray-700 rounded-full text-xs flex items-center gap-1">
                      <Shield size={12} />
                      Policy Impact
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column - Metrics & Insights */}
          <div className="space-y-6 flex flex-col">
            {/* Key Metrics */}
            <div className="bg-white/40 backdrop-blur-xl rounded-3xl border border-white/30 shadow-xl p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800 text-lg">Key Metrics</h3>
                <a 
                  href="https://wheebox.com/assets/pdf/ISR_Report_2025.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1 bg-purple-500/10 text-purple-600 rounded-full text-sm font-medium hover:bg-purple-500/20 transition-colors"
                >
                  <Book size={14} className="mr-1" />
                  <span>View Source</span>
                </a>
              </div>
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                {metrics.map((metric) => (
                  <div 
                    key={metric.id}
                    className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 p-4 hover:scale-105 transition-all duration-300 flex-1 flex flex-col justify-center"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className={`p-2 rounded-xl bg-gradient-to-r ${metric.color} text-white`}>
                        {metric.icon}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                    <div className="text-sm text-gray-600 mb-3">{metric.title}</div>
                    <div className="text-xs text-gray-500">{metric.change}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI in Skill Development */}
            <div className="bg-gradient-to-br from-purple-100/50 to-pink-100/50 backdrop-blur-xl rounded-3xl border border-white/30 shadow-xl p-6">
              <h3 className="font-semibold text-gray-800 mb-4 text-lg">AI in Skill Development</h3>
              <div className="space-y-4">
                {aiTrends.map((trend) => (
                  <div 
                    key={trend.id}
                    className="flex items-start p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 hover:scale-[1.02] transition-all duration-300"
                  >
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 mr-3">
                      {trend.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-gray-800">{trend.title}</h4>
                        <span className="text-lg font-bold text-purple-600">{trend.value}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{trend.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style>{`
        .shadow-xl {
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        .hover\\:shadow-2xl:hover {
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 12px rgba(0, 0, 0, 0.1);
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default SkillInsightsDashboard;