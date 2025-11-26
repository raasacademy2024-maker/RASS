import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  User, 
  Clock, 
  ArrowRight, 
  Search, 
  Tag,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Share,
  Heart,
  MessageCircle
} from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import Footer from '../../components/layout/Footer';
import Navbar from '../../components/layout/Navbar';
import SEO, { pageSEOConfig } from '../../components/common/SEO';

// Types for our blog data
interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  readTime: string;
  image: string;
  category: string;
  tags: string[];
  featured?: boolean;
}

// Mock data - in a real app, this would come from an API
const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "The Future of Web Development in 2024",
    excerpt: "Explore the latest trends and technologies shaping the future of web development and how you can stay ahead of the curve.",
    content: `The landscape of web development is constantly evolving, with new frameworks, tools, and methodologies emerging regularly. In 2024, we're seeing several key trends that are shaping the future of how we build for the web.

    ## Serverless Architecture Takes Center Stage
    Serverless computing has moved from buzzword to mainstream, with more companies adopting Functions as a Service (FaaS) for their applications. This approach allows developers to focus on writing code without worrying about infrastructure management.

    ## AI-Powered Development Tools
    Artificial intelligence is revolutionizing how developers work. From code completion to automated testing, AI tools are helping developers work more efficiently and reduce errors.

    ## WebAssembly for High-Performance Applications
    WebAssembly continues to gain traction, enabling near-native performance in web applications. This technology is particularly valuable for applications that require heavy computation.

    ## Jamstack Architecture
    The Jamstack (JavaScript, APIs, and Markup) approach is becoming the standard for modern web development, offering better performance, security, and scalability.

    At RAAS Academy, we're constantly updating our curriculum to ensure our students are learning the most relevant and in-demand skills for the future of web development.`,
    author: "Sarah Johnson",
    publishDate: "2024-03-15",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1581276879432-15e50529f34b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80",
    category: "Web Development",
    tags: ["React", "Next.js", "JavaScript", "Web3"],
    featured: true
  },
  {
    id: 2,
    title: "How to Master Data Structures and Algorithms",
    excerpt: "A comprehensive guide to mastering DSA concepts that are essential for technical interviews and efficient coding.",
    content: `Data Structures and Algorithms form the foundation of computer science and are crucial for success in technical interviews and building efficient software.

    ## Understanding the Basics
    Before diving into complex algorithms, it's essential to have a solid understanding of basic data structures like arrays, linked lists, stacks, and queues.

    ## Common Algorithm Patterns
    Recognizing common patterns like sliding window, two pointers, and dynamic programming can help you approach problems more systematically.

    ## Practice Strategies
    Consistent practice is key to mastering DSA. We recommend solving at least 2-3 problems daily and participating in coding challenges.

    ## Real-World Applications
    Understanding how these concepts apply to real-world scenarios will help you appreciate their importance and retain the knowledge better.

    Our DSA course at RAAS Academy is designed to take you from beginner to advanced level with hands-on practice and expert guidance.`,
    author: "Michael Chen",
    publishDate: "2024-03-10",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80",
    category: "Programming",
    tags: ["DSA", "Algorithms", "Interview Prep", "Coding"],
    featured: true
  },
  {
    id: 3,
    title: "Getting Started with Machine Learning",
    excerpt: "Begin your journey into machine learning with this beginner-friendly guide to essential concepts and tools.",
    content: `Machine learning is transforming industries across the globe, and getting started has never been more accessible.

    ## What is Machine Learning?
    At its core, machine learning is about creating systems that can learn from data and make predictions or decisions without being explicitly programmed.

    ## Essential Mathematics
    A basic understanding of linear algebra, calculus, and statistics is helpful for understanding how ML algorithms work.

    ## Popular Frameworks
    TensorFlow, PyTorch, and Scikit-learn are among the most popular frameworks for implementing machine learning models.

    ## Learning Path
    We recommend starting with supervised learning algorithms before moving on to unsupervised learning and more advanced topics.

    Our Machine Learning Bootcamp at RAAS Academy provides a comprehensive foundation for aspiring data scientists and ML engineers.`,
    author: "Priya Sharma",
    publishDate: "2024-03-05",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80",
    category: "Data Science",
    tags: ["Machine Learning", "Python", "AI", "Data Analysis"]
  },
  {
    id: 4,
    title: "UI/UX Design Principles for Developers",
    excerpt: "Learn essential design principles that every developer should know to create better user experiences.",
    content: `Understanding UI/UX design principles can make you a better developer and help you create more user-friendly applications.

    ## The Importance of User-Centered Design
    Putting the user at the center of your design process leads to more intuitive and successful products.

    ## Basic Design Principles
    Concepts like hierarchy, contrast, alignment, and consistency are fundamental to creating effective interfaces.

    ## Tools and Workflows
    Familiarize yourself with design tools like Figma and Adobe XD to better collaborate with designers.

    ## Accessibility Matters
    Designing with accessibility in mind ensures your products can be used by everyone, regardless of abilities.

    Our UI/UX for Developers course bridges the gap between design and development, helping you create better digital experiences.`,
    author: "Emma Wilson",
    publishDate: "2024-02-28",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80",
    category: "Design",
    tags: ["UI/UX", "Design", "Figma", "Accessibility"]
  },
  {
    id: 5,
    title: "Building Your First Full-Stack Application",
    excerpt: "A step-by-step guide to building your first complete web application from frontend to backend.",
    content: `Building a full-stack application can seem daunting, but breaking it down into manageable steps makes the process achievable.

    ## Planning Your Application
    Before writing code, clearly define your application's features, target audience, and technical requirements.

    ## Choosing Your Tech Stack
    Select appropriate technologies for your frontend, backend, and database based on your project needs and team expertise.

    ## Development Approach
    Adopt an iterative development process, building and testing features incrementally rather than all at once.

    ## Deployment Strategies
    Learn about different deployment options and how to choose the right one for your application.

    Our Full-Stack Development program takes you through the entire process of building real-world applications from concept to deployment.`,
    author: "Alex Rodriguez",
    publishDate: "2024-02-22",
    readTime: "15 min read",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80",
    category: "Web Development",
    tags: ["Full-Stack", "MERN", "Node.js", "React"]
  },
  {
    id: 6,
    title: "Career Transition: From Non-Tech to Tech",
    excerpt: "Inspiring stories and practical advice for making a successful transition into the tech industry.",
    content: `Making a career transition into tech is challenging but achievable with the right approach and mindset.

    ## Assessing Your Transferable Skills
    Many skills from non-tech roles are valuable in tech, including problem-solving, communication, and project management.

    ## Choosing the Right Path
    Research different tech roles to find one that aligns with your interests, skills, and career goals.

    ## Building a Learning Plan
    Create a structured learning plan with clear milestones to track your progress and stay motivated.

    ## Networking and Community
    Connect with others in the tech community through meetups, online forums, and social media.

    At RAAS Academy, we've helped thousands of students from diverse backgrounds successfully transition into tech careers.`,
    author: "Jessica Lee",
    publishDate: "2024-02-18",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80",
    category: "Career",
    tags: ["Career Change", "Learning", "Interview", "Resume"]
  }
];

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>(blogPosts);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(blogPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  
  const { id } = useParams<{ id: string }>();
  const singlePost = id ? posts.find(post => post.id === parseInt(id)) : null;

  // Extract unique categories
  const categories = ['All', ...new Set(posts.map(post => post.category))];

  // Filter posts based on search and category
  useEffect(() => {
    let result = posts;
    
    if (searchQuery) {
      result = result.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    if (selectedCategory !== 'All') {
      result = result.filter(post => post.category === selectedCategory);
    }
    
    setFilteredPosts(result);
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, posts]);

  // Get current posts for pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  if (singlePost) {
    return <BlogPostDetail post={singlePost} />;
  }

  return (
    <div>
        <SEO {...pageSEOConfig.blog} />
        <Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
          RAAS Academy <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Blog</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Insights, tutorials, and news about technology, programming, and career development
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-3">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Post */}
      {filteredPosts.length > 0 && filteredPosts[0].featured && (
        <div className="max-w-7xl mx-auto mb-16">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
            <div className="grid md:grid-cols-2">
              <div className="h-64 md:h-auto">
                <img
                  src={filteredPosts[0].image}
                  alt={filteredPosts[0].title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <span className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mb-4">
                  Featured
                </span>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {filteredPosts[0].title}
                </h2>
                <p className="text-gray-600 mb-6">
                  {filteredPosts[0].excerpt}
                </p>
                <div className="flex items-center text-sm text-gray-500 mb-6">
                  <User className="h-4 w-4 mr-1" />
                  <span className="mr-4">{filteredPosts[0].author}</span>
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="mr-4">{new Date(filteredPosts[0].publishDate).toLocaleDateString()}</span>
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{filteredPosts[0].readTime}</span>
                </div>
                <Link
                  to={`/blog/${filteredPosts[0].id}`}
                  className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700"
                >
                  Read full article
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blog Posts Grid */}
      <div className="max-w-7xl mx-auto mb-12">
        {currentPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Search className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="max-w-7xl mx-auto flex justify-center">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-4 flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-xl font-medium ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
      <div className=''>
    </div>
     </div>
     <Footer />
     </div>
  );
};

// Blog Post Card Component
const BlogPostCard = ({ post }: { post: BlogPost }) => {
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group">
      <div className="h-48 overflow-hidden">
        <img 
          src={post.image} 
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
            {post.category}
          </span>
          <span className="text-sm text-gray-500 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {post.readTime}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
          {post.title}
        </h3>
        
        <p className="text-gray-600 mb-4">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <User className="h-4 w-4 mr-1" />
            {post.author}
          </div>
          <div className="text-sm text-gray-500">
            {new Date(post.publishDate).toLocaleDateString()}
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map(tag => (
            <span key={tag} className="inline-flex items-center text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>
        
        <Link
          to={`/blog/${post.id}`}
          className="mt-6 inline-flex items-center text-blue-600 font-medium hover:text-blue-700 group-hover:translate-x-1 transition-transform duration-300"
        >
          Read more
          <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};

// Blog Post Detail Component
const BlogPostDetail = ({ post }: { post: BlogPost }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(42);
  
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          to="/blog"
          className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 mb-8"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to all articles
        </Link>

        {/* Article Header */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 mb-8">
          <span className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mb-4">
            {post.category}
          </span>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            {post.excerpt}
          </p>
          
          <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4 mb-6">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              {post.author}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(post.publishDate).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {post.readTime}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="inline-flex items-center text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Article Image */}
        <div className="rounded-2xl shadow-xl overflow-hidden mb-8">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-64 sm:h-96 object-cover"
          />
        </div>

        {/* Article Content */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 mb-8">
          <div className="prose max-w-none">
            {post.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-gray-700 mb-6 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
          
          {/* Social Sharing and Reactions */}
          <div className="flex items-center justify-between mt-12 pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 px-4 py-2 rounded-xl transition-all duration-300 ${
                  isLiked
                    ? 'bg-rose-100 text-rose-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                <span>{likes}</span>
              </button>
              
              <button className="flex items-center space-x-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors duration-300">
                <MessageCircle className="h-5 w-5" />
                <span>24</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Share:</span>
              <button className="p-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors duration-300">
                <Share className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Author Bio */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-6">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{post.author}</h3>
              <p className="text-gray-600">Instructor at RAAS Academy</p>
              <p className="text-gray-500 text-sm mt-2">
                With over 10 years of experience in the industry, {post.author.split(' ')[0]} specializes in {post.category.toLowerCase()} and is passionate about teaching the next generation of developers.
              </p>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogPosts
              .filter(p => p.id !== post.id && p.category === post.category)
              .slice(0, 2)
              .map(relatedPost => (
                <div key={relatedPost.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
                  <h3 className="font-semibold text-gray-900 mb-2">{relatedPost.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{relatedPost.excerpt}</p>
                  <Link
                    to={`/blog/${relatedPost.id}`}
                    className="text-blue-600 text-sm font-medium hover:text-blue-700"
                  >
                    Read article
                  </Link>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;