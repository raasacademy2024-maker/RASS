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
  title = `RAAS Academy - India's Premier Skills & Learning Platform | Industry-Ready Talent`,
  description = `RAAS Academy - India's #1 outcome-focused learning platform for skills development and industry-ready talent. Join 10,000+ learners building in-demand skills.`,
  keywords = 'learning, industry, india, skills, talent, online courses, professional training, certifications, e-learning, coding courses, data science, RAAS Academy',
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
    title: 'RAAS Academy - India\'s Premier Skills & Learning Platform | Industry-Ready Talent Development',
    description: 'India\'s outcome-focused learning platform for skills development and industry-ready talent. Hands-on training, certifications and placement support.',
    keywords: 'learning, industry, india, skills, talent, online courses, professional training, certifications, e-learning, coding courses, data science, AI courses, career development, RAAS Academy, skill development',
    canonical: 'https://www.raasacademy.com/',
  },
  courses: {
    title: 'Skills Development Courses - RAAS Academy | India\'s Leading Learning Platform',
    description: 'Explore industry-aligned skills courses at RAAS Academy: web development, data science, AI and more. India\'s learning destination for career growth.',
    keywords: 'learning, industry, india, skills, talent, online courses, web development, data science, AI courses, professional certifications, skill development, RAAS Academy courses',
    canonical: 'https://www.raasacademy.com/courses',
  },
  about: {
    title: 'About RAAS Academy - India\'s Skills & Learning Revolution | Industry-Ready Talent',
    description: 'Learn about RAAS Academy, India\'s mission to democratize skills education and create industry-ready talent through outcome-focused learning programs.',
    keywords: 'learning, industry, india, skills, talent, about RAAS Academy, online learning platform, education mission, professional training',
    canonical: 'https://www.raasacademy.com/about',
  },
  contact: {
    title: 'Contact RAAS Academy - India\'s Premier Skills & Learning Platform',
    description: 'Contact RAAS Academy for inquiries about skills courses, learning programs, and talent development in India. Our team is here to help you succeed.',
    keywords: 'learning, industry, india, skills, talent, contact RAAS Academy, support, customer service, enrollment help, course inquiries',
    canonical: 'https://www.raasacademy.com/contact',
  },
  blog: {
    title: 'Blog - RAAS Academy | Skills, Learning & Industry Insights for India',
    description: 'Stay updated with the latest in skills development, learning tips, industry trends, and talent growth. Read our blog for valuable insights.',
    keywords: 'learning, industry, india, skills, talent, RAAS Academy blog, learning tips, career advice, technology trends, education news',
    canonical: 'https://www.raasacademy.com/blog',
  },
  events: {
    title: 'Events & Webinars - RAAS Academy | Skills Learning Sessions for India',
    description: 'Join live webinars, workshops, and events hosted by RAAS Academy. Learn industry skills from experts and network with fellow learners in India.',
    keywords: 'learning, industry, india, skills, talent, webinars, live sessions, workshops, online events, RAAS Academy events',
    canonical: 'https://www.raasacademy.com/events',
  },
  companies: {
    title: 'For Companies - RAAS Academy | Access Industry-Ready Talent in India',
    description: 'Partner with RAAS Academy to hire skilled talent and build your workforce. Access India\'s industry-ready professionals through our learning programs.',
    keywords: 'learning, industry, india, skills, talent, corporate training, hire talent, workforce development, company partnerships',
    canonical: 'https://www.raasacademy.com/companies',
  },
  universities: {
    title: 'For Universities - RAAS Academy | Industry Skills Learning Partnerships in India',
    description: 'Partner with RAAS Academy to enhance your curriculum with industry-relevant skills training and talent development programs.',
    keywords: 'learning, industry, india, skills, talent, university partnerships, academic collaboration, student certifications',
    canonical: 'https://www.raasacademy.com/universities',
  },
  helpCenter: {
    title: 'Help Center & FAQ - RAAS Academy | Skills & Learning Support',
    description: 'Find answers to frequently asked questions about RAAS Academy skills courses, learning programs, certifications, and talent development in India.',
    keywords: 'learning, industry, india, skills, talent, FAQ, help center, support, course questions, RAAS Academy support',
    canonical: 'https://www.raasacademy.com/help-center',
  },
  terms: {
    title: 'Terms and Conditions - RAAS Academy | India\'s Skills Learning Platform',
    description: 'Read the terms and conditions for using RAAS Academy services, India\'s premier skills learning and talent development platform.',
    keywords: 'learning, india, skills, terms and conditions, terms of service, usage policy, RAAS Academy terms',
    canonical: 'https://www.raasacademy.com/terms',
    noindex: false,
  },
  privacy: {
    title: 'Privacy Policy - RAAS Academy | India\'s Skills Learning Platform',
    description: 'Learn how RAAS Academy, India\'s premier skills learning platform, collects, uses, and protects your personal information.',
    keywords: 'learning, india, skills, privacy policy, data protection, personal information, RAAS Academy privacy',
    canonical: 'https://www.raasacademy.com/privacy',
    noindex: false,
  },
  login: {
    title: 'Login - RAAS Academy | Access Your Skills Learning Account',
    description: 'Login to your RAAS Academy account to access skills courses, track your learning progress, and continue your journey to become industry-ready talent.',
    keywords: 'learning, skills, talent, login, sign in, RAAS Academy account, student login',
    canonical: 'https://www.raasacademy.com/login',
    noindex: true,
  },
  register: {
    title: 'Register - RAAS Academy | Start Your Skills Learning Journey',
    description: 'Create a free RAAS Academy account to access industry-aligned skills courses, earn certifications, and become industry-ready talent in India.',
    keywords: 'learning, industry, india, skills, talent, register, sign up, create account, join RAAS Academy',
    canonical: 'https://www.raasacademy.com/register',
    noindex: true,
  },
  studentAmbassador: {
    title: 'Campus Partner Program - RAAS Academy | Build Skills & Talent Leadership',
    description: 'Become a RAAS Academy Campus Partner. Earn incentives, build leadership skills, and represent India\'s premier learning platform on your campus.',
    keywords: 'learning, industry, india, skills, talent, campus partner, student ambassador, college representative, student leadership',
    canonical: 'https://www.raasacademy.com/StudentAmbassadorForm',
  },
  universityPartnership: {
    title: 'University Partnership - RAAS Academy | Skills & Talent Development for India',
    description: 'Partner with RAAS Academy to provide industry-relevant skills training and talent development programs to your students in India.',
    keywords: 'learning, industry, india, skills, talent, university partnership, academic partnership, institution collaboration',
    canonical: 'https://www.raasacademy.com/university-partnership',
  },
  companyPartnership: {
    title: 'Company Partnership - RAAS Academy | Access Industry-Ready Talent in India',
    description: 'Partner with RAAS Academy to hire industry-ready talent, access skilled professionals, and build your workforce with our learning programs.',
    keywords: 'learning, industry, india, skills, talent, company partnership, corporate partnership, hire trained talent',
    canonical: 'https://www.raasacademy.com/company-partnership',
  },
  notFound: {
    title: '404 - Page Not Found | RAAS Academy - India\'s Skills Learning Platform',
    description: 'The page you are looking for could not be found. Explore our skills courses, learning resources, or return to the homepage.',
    keywords: 'learning, india, skills, 404, page not found, RAAS Academy',
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
    name: course.provider || 'RAAS Academy',
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

/**
 * Event schema for a single event page.
 * Lets Google show the event in rich results / the events carousel.
 */
export const generateEventSchema = (event: {
  name: string;
  description: string;
  startDate: string;
  location?: string;
  imageUrl?: string;
  price?: number;
  currency?: string;
  isOnline?: boolean;
  url?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: event.name,
  description: event.description,
  startDate: event.startDate,
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: event.isOnline
    ? 'https://schema.org/OnlineEventAttendanceMode'
    : 'https://schema.org/OfflineEventAttendanceMode',
  location: event.isOnline
    ? {
        '@type': 'VirtualLocation',
        url: event.url || 'https://www.raasacademy.com/events',
      }
    : {
        '@type': 'Place',
        name: event.location || 'RAAS Academy',
        address: {
          '@type': 'PostalAddress',
          addressLocality: event.location || 'India',
          addressCountry: 'IN',
        },
      },
  organizer: {
    '@type': 'Organization',
    name: 'RAAS Academy',
    url: 'https://www.raasacademy.com',
  },
  ...(event.imageUrl && { image: event.imageUrl }),
  ...(event.price !== undefined && {
    offers: {
      '@type': 'Offer',
      price: event.price,
      priceCurrency: event.currency || 'INR',
      availability: 'https://schema.org/InStock',
      ...(event.url && { url: event.url }),
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
