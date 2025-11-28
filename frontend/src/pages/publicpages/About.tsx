import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Target,
  Users,
  Award,
  TrendingUp,
  Heart,
  Lightbulb,
  Shield,
  Star,
  Calendar,
  GraduationCap,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { useNavigate } from "react-router-dom";
import SEO, { pageSEOConfig } from "../../components/common/SEO";

const heroImages = [
  "/images/universities/university-cta-bg.jpg",
  "/images/universities/hero-classroom.jpg",
  "/images/companies/hero-teamwork.jpg",
  "/images/universities/hero-graduation.jpg",
  "/images/companies/hero-office.jpg",
  "/images/universities/hero-university-campus.jpg",
];

const missionCardImage = "/images/companies/hire-model.jpg";
const trainingImg = "/images/universities/training-session.jpg";
const facultyImg = "/images/universities/faculty-development.jpg";
const placementImg = "/images/universities/placement-support.jpg";
const bridgeImg = "/images/universities/bridge-learning.jpg";
const benefitsImg = "/images/universities/university-benefits.jpg";
const partnershipImg = "/images/universities/partnership-models.jpg";
const successImg = "/images/universities/success-stories.jpg";
const ctaBg = "/images/universities/university-cta-bg.jpg";

const coreValues = [
  { title: "Student First", desc: "Everything we build prioritizes student outcomes.", icon: Heart, color: "from-rose-50 to-rose-100" },
  { title: "Innovation", desc: "Modern curriculum, industry-aligned projects.", icon: Lightbulb, color: "from-amber-50 to-amber-100" },
  { title: "Integrity", desc: "Transparent, measurable career outcomes.", icon: Shield, color: "from-blue-50 to-blue-100" },
  { title: "Impact", desc: "Measured by jobs created and lives changed.", icon: Star, color: "from-indigo-50 to-indigo-100" },
];

const leadership = [
  { name: "Prateek Shukla", role: "CEO & Co-Founder", desc: "IIT Bombay alumnus; vision for democratized learning." },
  { name: "Nrupul Dev", role: "CTO & Co-Founder", desc: "Ex-tech lead; building scalable education platforms." },
  { name: "Yogesh Bhat", role: "VP – Engineering", desc: "Architecting reliable, performant learning systems." },
];

const timeline = [
  { year: "2019", event: "Founded with the mission to democratize tech education." },
  { year: "2020", event: "Launched first cohort and industry-aligned curriculum." },
  { year: "2021", event: "Crossed 1,000 placements milestone." },
  { year: "2022", event: "Expanded to multiple tech stacks and partner universities." },
  { year: "2023", event: "10,000+ learners trained and certified." },
  { year: "2024", event: "Launched AI-powered learning & assessment tools." },
];

const About: React.FC = () => {
  const [heroIndex, setHeroIndex] = useState(0);
  const [counts, setCounts] = useState({ students: 0, placement: 0, salary: 0, partners: 0 });
  const countersRun = useRef(false);
  const navigate = useNavigate();

  // light-weight hero image rotation
  useEffect(() => {
    const t = setInterval(() => setHeroIndex((i) => (i + 1) % heroImages.length), 2000);
    return () => clearInterval(t);
  }, []);

  // counters animation - trigger once on mount with gentle increments
  useEffect(() => {
    if (countersRun.current) return;
    countersRun.current = true;
    const target = { students: 15000, placement: 85, salary: 3.5, partners: 2500 };
    const start = performance.now();
    const duration = 1100;

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setCounts({
        students: Math.floor(target.students * t),
        placement: Math.floor(target.placement * t),
        salary: Math.round((target.salary * t) * 10) / 10,
        partners: Math.floor(target.partners * t),
      });
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, []);

  // helper for card image (with subtle overlay so text sits well regardless of image)
  const ImageCard: React.FC<{ src: string; alt?: string; className?: string }> = ({ src, alt, className }) => (
    <div className={`rounded-2xl overflow-hidden shadow-lg ${className || ""}`}>
      <img
        src={src}
        alt={alt || ""}
        loading="lazy"
        className="w-full h-56 object-cover transform transition-transform duration-500 hover:scale-105"
      />
    </div>
  );

  const minimalFade = { initial: { opacity: 0, y: 6 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };

  return (
    <div className="bg-gray-50 min-h-screen">
      <SEO {...pageSEOConfig.about} />
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 items-center gap-10">
          <motion.div {...minimalFade} className="space-y-6">
            <div className="uppercase text-sm font-semibold text-indigo-600">About RASS Academy</div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Transforming India's Learning into Industry-Ready Talent
            </h1>
            <p className="text-lg text-gray-700 max-w-2xl">
              We partner with universities, companies and communities across India to equip learners with in-demand skills, certifications, and industry connections for career success.
            </p>

            <div className="flex flex-wrap gap-3 items-center">
              <button
                onClick={() => {
                  navigate("/contact");
                  window.scrollTo(0, 0);
                }}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow hover:bg-indigo-700 transition"
              >
                Start a Partnership
              </button>
              <a href="/courses" className="text-sm text-gray-600 hover:underline">Explore Programs</a>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-4 shadow flex items-start gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg"><GraduationCap className="h-6 w-6 text-indigo-600" /></div>
                <div>
                  <div className="text-sm text-gray-500">Students Trained</div>
                  <div className="font-bold text-lg text-gray-900">{counts.students.toLocaleString()}+</div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow flex items-start gap-3">
                <div className="p-2 bg-amber-50 rounded-lg"><Award className="h-6 w-6 text-amber-600" /></div>
                <div>
                  <div className="text-sm text-gray-500">Placement Rate</div>
                  <div className="font-bold text-lg text-gray-900">{counts.placement}%</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* HERO IMAGE CARD: rotating images */}
          <motion.div {...minimalFade} className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-100 bg-white">
              <div className="relative h-80 md:h-96">
                {/* image */}
                <img
                  src={heroImages[heroIndex]}
                  alt="hero"
                  loading="eager"
                  className="w-full h-full object-cover transition-opacity duration-900 ease-out"
                  style={{ willChange: "opacity, transform" }}
                />
                {/* gentle zoom overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10 pointer-events-none" />
                {/* small info card bottom-left */}
                <div className="absolute left-6 bottom-6 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md flex items-center gap-3">
                  <img src="/images/universities/hero-classroom.jpg" alt="thumb" className="w-12 h-12 object-cover rounded-md" />
                  <div>
                    <div className="text-xs text-gray-500">Outcome-Based Learning</div>
                    <div className="text-sm font-semibold text-gray-900">Industry-aligned curriculum</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MISSION + IMAGE (alternating card) */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div {...minimalFade} className="space-y-4">
            <h3 className="text-xl text-indigo-600 font-semibold">Our Mission</h3>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Democratize Industry-Relevant Skills Learning Across India</h2>
            <p className="text-gray-700">
              We close the gap between campus learning and industry expectations by offering skills certifications, project-based learning and talent placement support — so learners become industry-ready professionals.
            </p>
            <ul className="mt-4 space-y-2">
              <li className="text-gray-700">• Curriculum co-created with industry hiring partners</li>
              <li className="text-gray-700">• Real projects and skills mentorship from industry experts</li>
              <li className="text-gray-700">• Placement & talent support for top performers</li>
            </ul>
          </motion.div>

          <motion.div {...minimalFade}>
            <ImageCard src={missionCardImage} alt="hiring model" />
          </motion.div>
        </div>
      </section>

      {/* CORE VALUES (cards with subtle hover) */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h3 className="text-sm text-indigo-600 font-semibold text-center">Foundational Values</h3>
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">What guides us</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreValues.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={i}
                whileHover={{ y: -6 }}
                className="relative bg-white rounded-2xl p-6 shadow hover:shadow-lg transition-transform duration-300"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${v.color}`}>
                  <Icon className="h-7 w-7 text-gray-800" />
                </div>
                <h4 className="font-semibold text-lg text-gray-900">{v.title}</h4>
                <p className="text-gray-600 mt-2 text-sm">{v.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* FEATURE CARDS (alternating image+text) */}
      <section className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Training */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div {...minimalFade}><ImageCard src={trainingImg} alt="training session" /></motion.div>
          <motion.div {...minimalFade} className="space-y-4">
            <h3 className="text-xl text-indigo-600 font-semibold">Industry Training</h3>
            <h4 className="text-2xl font-bold text-gray-900">Instructor-led sessions & hands-on projects</h4>
            <p className="text-gray-700">Short immersive programs that focus on skills employers need — assessments, live projects and certification.</p>
          </motion.div>
        </div>

        {/* Faculty Development (switch sides) */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div {...minimalFade} className="space-y-4 order-2 md:order-1">
            <h3 className="text-xl text-indigo-600 font-semibold">Faculty Enablement</h3>
            <h4 className="text-2xl font-bold text-gray-900">Upskill faculty to deliver industry outcomes</h4>
            <p className="text-gray-700">Workshops and co-teaching models so your faculty become partners in delivering career outcomes.</p>
          </motion.div>
          <motion.div {...minimalFade} className="order-1 md:order-2"><ImageCard src={facultyImg} alt="faculty development" /></motion.div>
        </div>

        {/* Placement support */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div {...minimalFade}><ImageCard src={placementImg} alt="placement support" /></motion.div>
          <motion.div {...minimalFade} className="space-y-4">
            <h3 className="text-xl text-indigo-600 font-semibold">Placement Support</h3>
            <h4 className="text-2xl font-bold text-gray-900">Employer engagement & interview readiness</h4>
            <p className="text-gray-700">From resume clinics to interview simulations, we prepare students and connect them to hiring partners.</p>
          </motion.div>
        </div>

        {/* Bridge learning */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div {...minimalFade} className="space-y-4 order-2 md:order-1">
            <h3 className="text-xl text-indigo-600 font-semibold">Bridge Learning</h3>
            <h4 className="text-2xl font-bold text-gray-900">Curriculum-to-career pathways</h4>
            <p className="text-gray-700">We map academic outcomes to industry roles and create short bridge courses that plug competency gaps.</p>
          </motion.div>
          <motion.div {...minimalFade} className="order-1 md:order-2"><ImageCard src={bridgeImg} alt="bridge learning" /></motion.div>
        </div>
      </section>

      {/* Benefits (image cards grid) */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div {...minimalFade} className="space-y-4">
            <h3 className="text-xl text-indigo-600 font-semibold">Proven Benefits</h3>
            <h2 className="text-3xl font-bold text-gray-900">Why India's Universities and Learners Choose Us</h2>
            <p className="text-gray-700">Faster skill development, industry-ready talent pipeline, and proven learning outcomes across India.</p>

            <ul className="mt-6 space-y-3 text-gray-700">
              <li>• Pre-skilled talent ready for industry roles</li>
              <li>• Industry-verified skills curriculum & assessments</li>
              <li>• Scalable learning and faculty enablement models</li>
            </ul>
          </motion.div>

          <motion.div {...minimalFade}>
            <div className="grid grid-cols-1 gap-4">
              <ImageCard src={benefitsImg} />
              <div className="grid grid-cols-2 gap-4">
                <ImageCard src={partnershipImg} className="h-full" />
                <ImageCard src={successImg} className="h-full" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      

      {/* Timeline */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h3 className="text-sm text-indigo-600 font-semibold text-center">Our Journey</h3>
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Milestones</h2>

        <div className="relative">
          <div className="absolute left-1/2 top-6 bottom-6 w-px bg-gradient-to-b from-indigo-300 to-indigo-500 opacity-40 transform -translate-x-1/2" />
          <div className="space-y-12">
            {timeline.map((t, i) => (
              <div key={i} className={`flex flex-col md:flex-row items-center md:items-start gap-6 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                <div className={`md:w-1/2 flex justify-center md:justify-${i % 2 === 0 ? "end" : "start"}`}>
                  <div className="bg-white/90 rounded-2xl p-6 shadow w-full max-w-md">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="h-5 w-5 text-indigo-600" />
                      <div className="font-semibold text-indigo-700">{t.year}</div>
                    </div>
                    <p className="text-gray-700">{t.event}</p>
                  </div>
                </div>

                <div className="relative z-10">
                  <div className="w-4 h-4 rounded-full bg-indigo-600 border-2 border-white shadow" />
                </div>

                <div className="md:w-1/2 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div
          className="max-w-6xl mx-auto rounded-2xl overflow-hidden relative"
          style={{ backgroundImage: `url(${ctaBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-800/70 to-indigo-700/60"></div>
          <div className="relative z-10 px-6 py-16 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Join India's Movement for Industry-Ready Talent</h2>
            <p className="max-w-3xl mx-auto text-lg mb-8 text-indigo-100">
              Partner with RASS Academy for industry-aligned skills learning, faculty enablement, and talent pipelines for your learners.
            </p>
            <div className="flex justify-center gap-4">
              <button onClick={() => {
                navigate("/contact");
                window.scrollTo(0, 0);
              }} className="px-6 py-3 bg-white text-indigo-700 rounded-xl font-semibold shadow hover:scale-[1.02] transition">Contact Us</button>
              <a href="/partnership" className="px-6 py-3 border border-white/40 rounded-xl text-white hover:bg-white/10 transition">Partnership Details</a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;