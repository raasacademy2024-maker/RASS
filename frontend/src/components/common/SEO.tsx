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
  title = 'RASS Academy - Online Courses, Certifications & Professional Training',
  description = 'Join RASS Academy for expert-led online courses, professional certifications, and career development programs. Learn coding, data science, AI, and more with 10,000+ students.',
  keywords = 'online courses, professional training, certifications, e-learning, LMS, coding courses, data science, RASS Academy',
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
      let element = document.querySelector(selector) as HTMLMetaElement;
      if (element) {
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
    title: 'RASS Academy - Online Courses, Certifications & Professional Training | Learn from Industry Experts',
    description: 'Join RASS Academy for expert-led online courses, professional certifications, and career development programs. Learn coding, data science, AI, and more with 10,000+ students. Start your journey today!',
    keywords: 'online courses, professional training, certifications, e-learning, LMS, coding courses, data science, AI courses, career development, RASS Academy, online learning platform',
    canonical: 'https://www.raasacademy.com/',
  },
  courses: {
    title: 'Browse All Courses - RASS Academy | Professional Training & Certifications',
    description: 'Explore our comprehensive catalog of online courses. Learn web development, data science, AI, cloud computing, and more from industry experts. Get certified today!',
    keywords: 'online courses, web development courses, data science courses, AI courses, professional certifications, coding bootcamp, RASS Academy courses',
    canonical: 'https://www.raasacademy.com/courses',
  },
  about: {
    title: 'About RASS Academy - Our Mission & Vision | Online Learning Platform',
    description: 'Learn about RASS Academy, our mission to democratize education, and our commitment to providing quality online courses and professional training.',
    keywords: 'about RASS Academy, online learning platform, education mission, professional training, e-learning platform',
    canonical: 'https://www.raasacademy.com/about',
  },
  contact: {
    title: 'Contact Us - RASS Academy | Get in Touch with Our Team',
    description: 'Have questions? Contact RASS Academy support team. We are here to help with enrollment, courses, certifications, and more. Reach out via email or phone.',
    keywords: 'contact RASS Academy, support, customer service, enrollment help, course inquiries',
    canonical: 'https://www.raasacademy.com/contact',
  },
  blog: {
    title: 'Blog - RASS Academy | Latest News, Tips & Learning Resources',
    description: 'Stay updated with the latest in online education, learning tips, career advice, and technology trends. Read our blog for valuable insights.',
    keywords: 'RASS Academy blog, online learning tips, career advice, technology trends, education news',
    canonical: 'https://www.raasacademy.com/blog',
  },
  events: {
    title: 'Events & Webinars - RASS Academy | Live Sessions & Workshops',
    description: 'Join live webinars, workshops, and events hosted by RASS Academy. Learn from experts in real-time and network with fellow learners.',
    keywords: 'webinars, live sessions, workshops, online events, RASS Academy events, learning events',
    canonical: 'https://www.raasacademy.com/events',
  },
  companies: {
    title: 'For Companies - RASS Academy | Corporate Training Solutions',
    description: 'Partner with RASS Academy for corporate training solutions. Upskill your workforce with customized courses and professional development programs.',
    keywords: 'corporate training, business training, workforce development, company partnerships, employee upskilling',
    canonical: 'https://www.raasacademy.com/companies',
  },
  universities: {
    title: 'For Universities - RASS Academy | Academic Partnerships',
    description: 'Partner with RASS Academy to enhance your curriculum. Offer industry-relevant courses and certifications to your students.',
    keywords: 'university partnerships, academic collaboration, student certifications, curriculum enhancement',
    canonical: 'https://www.raasacademy.com/universities',
  },
  helpCenter: {
    title: 'Help Center & FAQ - RASS Academy | Support & Resources',
    description: 'Find answers to frequently asked questions about RASS Academy courses, enrollment, payments, certificates, and more in our comprehensive help center.',
    keywords: 'FAQ, help center, support, course questions, enrollment help, RASS Academy support',
    canonical: 'https://www.raasacademy.com/help-center',
  },
  terms: {
    title: 'Terms and Conditions - RASS Academy',
    description: 'Read the terms and conditions for using RASS Academy services, including enrollment policies, payment terms, and usage guidelines.',
    keywords: 'terms and conditions, terms of service, usage policy, RASS Academy terms',
    canonical: 'https://www.raasacademy.com/terms',
    noindex: false,
  },
  privacy: {
    title: 'Privacy Policy - RASS Academy',
    description: 'Learn how RASS Academy collects, uses, and protects your personal information. Read our comprehensive privacy policy.',
    keywords: 'privacy policy, data protection, personal information, RASS Academy privacy',
    canonical: 'https://www.raasacademy.com/privacy',
    noindex: false,
  },
  login: {
    title: 'Login - RASS Academy | Access Your Account',
    description: 'Login to your RASS Academy account to access your courses, track progress, and continue your learning journey.',
    keywords: 'login, sign in, RASS Academy account, student login',
    canonical: 'https://www.raasacademy.com/login',
    noindex: true,
  },
  register: {
    title: 'Register - RASS Academy | Create Your Free Account',
    description: 'Create a free RASS Academy account to access courses, earn certifications, and start your learning journey today.',
    keywords: 'register, sign up, create account, join RASS Academy, free account',
    canonical: 'https://www.raasacademy.com/register',
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
