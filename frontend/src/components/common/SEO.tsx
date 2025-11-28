import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  noindex?: boolean;
  structuredData?: object;
}

const SEO: React.FC<SEOProps> = ({
  title = 'RASS Academy - India\'s Premier Skills & Learning Platform | Industry-Ready Talent',
  description = 'RASS Academy - India\'s #1 outcome-focused learning platform for skills development and industry-ready talent. Join 10,000+ learners building in-demand skills.',
  keywords = 'learning, industry, india, skills, talent, online courses, professional training, certifications, e-learning, coding courses, data science, RASS Academy',
  canonical,
  ogTitle,
  ogDescription,
  ogImage = 'https://www.raasacademy.com/logo.webp',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  twitterTitle,
  twitterDescription,
  twitterImage,
  noindex = false,
  structuredData,
}) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper function to update or create meta tag
    const updateMetaTag = (selector: string, attribute: string, content: string) => {
      const existingElement = document.querySelector(selector);
      let element: HTMLMetaElement;
      
      if (existingElement && existingElement instanceof HTMLMetaElement) {
        element = existingElement;
        element.setAttribute(attribute === 'content' ? 'content' : attribute, content);
      } else {
        element = document.createElement('meta');
        if (selector.includes('property=')) {
          const propertyMatch = selector.match(/property="([^"]+)"/);
          if (propertyMatch) {
            element.setAttribute('property', propertyMatch[1]);
          }
        } else if (selector.includes('name=')) {
          const nameMatch = selector.match(/name="([^"]+)"/);
          if (nameMatch) {
            element.setAttribute('name', nameMatch[1]);
          }
        }
        element.setAttribute('content', content);
        document.head.appendChild(element);
      }
    };

    // Update meta description
    updateMetaTag('meta[name="description"]', 'content', description);

    // Update meta keywords
    updateMetaTag('meta[name="keywords"]', 'content', keywords);

    // Update robots meta tag
    updateMetaTag(
      'meta[name="robots"]',
      'content',
      noindex ? 'noindex, nofollow' : 'index, follow'
    );

    // Update Open Graph tags
    updateMetaTag('meta[property="og:title"]', 'content', ogTitle || title);
    updateMetaTag('meta[property="og:description"]', 'content', ogDescription || description);
    updateMetaTag('meta[property="og:image"]', 'content', ogImage);
    updateMetaTag('meta[property="og:type"]', 'content', ogType);

    // Update Twitter Card tags
    updateMetaTag('meta[name="twitter:card"]', 'content', twitterCard);
    updateMetaTag('meta[name="twitter:title"]', 'content', twitterTitle || ogTitle || title);
    updateMetaTag(
      'meta[name="twitter:description"]',
      'content',
      twitterDescription || ogDescription || description
    );
    updateMetaTag('meta[name="twitter:image"]', 'content', twitterImage || ogImage);

    // Update canonical URL
    if (canonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (canonicalLink) {
        canonicalLink.href = canonical;
      } else {
        canonicalLink = document.createElement('link');
        canonicalLink.rel = 'canonical';
        canonicalLink.href = canonical;
        document.head.appendChild(canonicalLink);
      }
      updateMetaTag('meta[property="og:url"]', 'content', canonical);
      updateMetaTag('meta[name="twitter:url"]', 'content', canonical);
    }

    // Add structured data
    if (structuredData) {
      const existingScript = document.querySelector('script[data-seo="dynamic"]');
      if (existingScript) {
        existingScript.remove();
      }
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo', 'dynamic');
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    // Cleanup function
    return () => {
      // Reset to default title when component unmounts (optional)
    };
  }, [
    title,
    description,
    keywords,
    canonical,
    ogTitle,
    ogDescription,
    ogImage,
    ogType,
    twitterCard,
    twitterTitle,
    twitterDescription,
    twitterImage,
    noindex,
    structuredData,
  ]);

  return null; // This component doesn't render anything
};

export default SEO;

// Predefined SEO configurations for common pages
export const pageSEOConfig = {
  home: {
    title: 'RASS Academy - India\'s Premier Skills & Learning Platform | Industry-Ready Talent Development',
    description: 'RASS Academy - India\'s #1 outcome-focused learning platform for skills development and industry-ready talent. Join 10,000+ learners building in-demand skills through hands-on training, certifications, and placement support.',
    keywords: 'learning, industry, india, skills, talent, online courses, professional training, certifications, e-learning, coding courses, data science, AI courses, career development, RASS Academy, skill development',
    canonical: 'https://www.raasacademy.com/',
  },
  courses: {
    title: 'Skills Development Courses - RASS Academy | India\'s Leading Learning Platform',
    description: 'Explore industry-aligned skills courses at RASS Academy. Build talent in web development, data science, AI, and more. India\'s premier learning destination for career growth.',
    keywords: 'learning, industry, india, skills, talent, online courses, web development, data science, AI courses, professional certifications, skill development, RASS Academy courses',
    canonical: 'https://www.raasacademy.com/courses',
  },
  about: {
    title: 'About RASS Academy - India\'s Skills & Learning Revolution | Industry-Ready Talent',
    description: 'Learn about RASS Academy, India\'s mission to democratize skills education and create industry-ready talent through outcome-focused learning programs.',
    keywords: 'learning, industry, india, skills, talent, about RASS Academy, online learning platform, education mission, professional training',
    canonical: 'https://www.raasacademy.com/about',
  },
  contact: {
    title: 'Contact RASS Academy - India\'s Premier Skills & Learning Platform',
    description: 'Contact RASS Academy for inquiries about skills courses, learning programs, and talent development in India. Our team is here to help you succeed.',
    keywords: 'learning, industry, india, skills, talent, contact RASS Academy, support, customer service, enrollment help, course inquiries',
    canonical: 'https://www.raasacademy.com/contact',
  },
  blog: {
    title: 'Blog - RASS Academy | Skills, Learning & Industry Insights for India',
    description: 'Stay updated with the latest in skills development, learning tips, industry trends, and talent growth. Read our blog for valuable insights.',
    keywords: 'learning, industry, india, skills, talent, RASS Academy blog, learning tips, career advice, technology trends, education news',
    canonical: 'https://www.raasacademy.com/blog',
  },
  events: {
    title: 'Events & Webinars - RASS Academy | Skills Learning Sessions for India',
    description: 'Join live webinars, workshops, and events hosted by RASS Academy. Learn industry skills from experts and network with fellow learners in India.',
    keywords: 'learning, industry, india, skills, talent, webinars, live sessions, workshops, online events, RASS Academy events',
    canonical: 'https://www.raasacademy.com/events',
  },
  companies: {
    title: 'For Companies - RASS Academy | Access Industry-Ready Talent in India',
    description: 'Partner with RASS Academy to hire skilled talent and build your workforce. Access India\'s industry-ready professionals through our learning programs.',
    keywords: 'learning, industry, india, skills, talent, corporate training, hire talent, workforce development, company partnerships',
    canonical: 'https://www.raasacademy.com/companies',
  },
  universities: {
    title: 'For Universities - RASS Academy | Industry Skills Learning Partnerships in India',
    description: 'Partner with RASS Academy to enhance your curriculum with industry-relevant skills training and talent development programs.',
    keywords: 'learning, industry, india, skills, talent, university partnerships, academic collaboration, student certifications',
    canonical: 'https://www.raasacademy.com/universities',
  },
  helpCenter: {
    title: 'Help Center & FAQ - RASS Academy | Skills & Learning Support',
    description: 'Find answers to frequently asked questions about RASS Academy skills courses, learning programs, certifications, and talent development in India.',
    keywords: 'learning, industry, india, skills, talent, FAQ, help center, support, course questions, RASS Academy support',
    canonical: 'https://www.raasacademy.com/help-center',
  },
  terms: {
    title: 'Terms and Conditions - RASS Academy | India\'s Skills Learning Platform',
    description: 'Read the terms and conditions for using RASS Academy services, India\'s premier skills learning and talent development platform.',
    keywords: 'learning, india, skills, terms and conditions, terms of service, usage policy, RASS Academy terms',
    canonical: 'https://www.raasacademy.com/terms',
    noindex: false,
  },
  privacy: {
    title: 'Privacy Policy - RASS Academy | India\'s Skills Learning Platform',
    description: 'Learn how RASS Academy, India\'s premier skills learning platform, collects, uses, and protects your personal information.',
    keywords: 'learning, india, skills, privacy policy, data protection, personal information, RASS Academy privacy',
    canonical: 'https://www.raasacademy.com/privacy',
    noindex: false,
  },
  login: {
    title: 'Login - RASS Academy | Access Your Skills Learning Account',
    description: 'Login to your RASS Academy account to access skills courses, track your learning progress, and continue your journey to become industry-ready talent.',
    keywords: 'learning, skills, talent, login, sign in, RASS Academy account, student login',
    canonical: 'https://www.raasacademy.com/login',
    noindex: true,
  },
  register: {
    title: 'Register - RASS Academy | Start Your Skills Learning Journey',
    description: 'Create a free RASS Academy account to access industry-aligned skills courses, earn certifications, and become industry-ready talent in India.',
    keywords: 'learning, industry, india, skills, talent, register, sign up, create account, join RASS Academy',
    canonical: 'https://www.raasacademy.com/register',
    noindex: true,
  },
  studentAmbassador: {
    title: 'Campus Partner Program - RASS Academy | Build Skills & Talent Leadership',
    description: 'Become a RASS Academy Campus Partner. Earn incentives, build leadership skills, and represent India\'s premier learning platform on your campus.',
    keywords: 'learning, industry, india, skills, talent, campus partner, student ambassador, college representative, student leadership',
    canonical: 'https://www.raasacademy.com/StudentAmbassadorForm',
  },
  universityPartnership: {
    title: 'University Partnership - RASS Academy | Skills & Talent Development for India',
    description: 'Partner with RASS Academy to provide industry-relevant skills training and talent development programs to your students in India.',
    keywords: 'learning, industry, india, skills, talent, university partnership, academic partnership, institution collaboration',
    canonical: 'https://www.raasacademy.com/university-partnership',
  },
  companyPartnership: {
    title: 'Company Partnership - RASS Academy | Access Industry-Ready Talent in India',
    description: 'Partner with RASS Academy to hire industry-ready talent, access skilled professionals, and build your workforce with our learning programs.',
    keywords: 'learning, industry, india, skills, talent, company partnership, corporate partnership, hire trained talent',
    canonical: 'https://www.raasacademy.com/company-partnership',
  },
  notFound: {
    title: '404 - Page Not Found | RASS Academy - India\'s Skills Learning Platform',
    description: 'The page you are looking for could not be found. Explore our skills courses, learning resources, or return to the homepage.',
    keywords: 'learning, india, skills, 404, page not found, RASS Academy',
    canonical: 'https://www.raasacademy.com/404',
    noindex: true,
  },
};

// Helper function to generate course structured data
export const generateCourseSchema = (course: {
  name: string;
  description: string;
  instructor: string;
  provider?: string;
  imageUrl?: string;
  price?: number;
  currency?: string;
  duration?: string;
  level?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: course.name,
  description: course.description,
  provider: {
    '@type': 'Organization',
    name: course.provider || 'RASS Academy',
    sameAs: 'https://www.raasacademy.com',
  },
  instructor: {
    '@type': 'Person',
    name: course.instructor,
  },
  ...(course.imageUrl && { image: course.imageUrl }),
  ...(course.price !== undefined && {
    offers: {
      '@type': 'Offer',
      price: course.price,
      priceCurrency: course.currency || 'INR',
      availability: 'https://schema.org/InStock',
    },
  }),
  ...(course.duration && { timeRequired: course.duration }),
  ...(course.level && {
    educationalLevel: course.level,
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student',
    },
  }),
});

// Helper function to generate breadcrumb schema
export const generateBreadcrumbSchema = (
  items: Array<{ name: string; url: string }>
) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});
