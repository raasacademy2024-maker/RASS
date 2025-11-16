import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { userAPI } from "../../services/api";

interface CurriculumSection {
  order: number;
  subtitle: string;
  description: string;
}

interface CurriculumItem {
  order: number;
  logoUrl: string;
  title: string;
  sections: CurriculumSection[];
}

interface TechStackItem {
  name: string;
  imageUrl: string;
}

interface TestimonialItem {
  name: string;
  imageUrl: string;
  description: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface ResourceItem {
  title: string;
  url: string;
  type: string;
}

interface ModuleItem {
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  order: number;
  resources: ResourceItem[];
}

const AddCoursePage: React.FC = () => {
  const navigate = useNavigate();
  
  // Basic Information
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [about, setAbout] = useState('');
  const [instructor, setInstructor] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  
  // Array states
  const [curriculum, setCurriculum] = useState<CurriculumItem[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [techStack, setTechStack] = useState<TechStackItem[]>([]);
  const [skillsGained, setSkillsGained] = useState<string[]>([]);
  const [jobRoles, setJobRoles] = useState<string[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [learningOutcomes, setLearningOutcomes] = useState<string[]>([]);
  
  // Auto-save state
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaving, setAutoSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // Temporary input states for array items
  const [newCurriculumItem, setNewCurriculumItem] = useState({
    order: 1,
    logoUrl: '',
    title: '',
    sections: [{ order: 1, subtitle: '', description: '' }]
  });
  const [newFeature, setNewFeature] = useState('');
  const [newTechStackItem, setNewTechStackItem] = useState({ name: '', imageUrl: '' });
  const [newSkill, setNewSkill] = useState('');
  const [newJobRole, setNewJobRole] = useState('');
  const [newTestimonial, setNewTestimonial] = useState({ name: '', imageUrl: '', description: '' });
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [newModule, setNewModule] = useState({ 
    title: '', 
    description: '', 
    videoUrl: '', 
    duration: 0, 
    order: 1, 
    resources: [] 
  });
  const [newTag, setNewTag] = useState('');
  const [newRequirement, setNewRequirement] = useState('');
  const [newLearningOutcome, setNewLearningOutcome] = useState('');
  const [newResource, setNewResource] = useState({ title: '', url: '', type: 'link' });
  
  // Instructors list for dropdown
  const [instructors, setInstructors] = useState<any[]>([]);
  const [loadingInstructors, setLoadingInstructors] = useState(false);
  
  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');
  
  // Edit states for inline editing
  const [editingCurriculumIndex, setEditingCurriculumIndex] = useState<number | null>(null);
  const [editingModuleIndex, setEditingModuleIndex] = useState<number | null>(null);
  const [editingTestimonialIndex, setEditingTestimonialIndex] = useState<number | null>(null);
  const [editingFaqIndex, setEditingFaqIndex] = useState<number | null>(null);

  // Fetch instructors on component mount
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        setLoadingInstructors(true);
        const response = await userAPI.getInstructors();
        setInstructors(response);
      } catch (err) {
        console.error('Error fetching instructors:', err);
        setError('Failed to load instructors. You can still enter instructor ID manually.');
      } finally {
        setLoadingInstructors(false);
      }
    };
    
    fetchInstructors();
    
    // Load draft from localStorage
    const savedDraft = localStorage.getItem('course_draft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setTitle(draft.title || '');
        setDescription(draft.description || '');
        setAbout(draft.about || '');
        setInstructor(draft.instructor || '');
        setCategory(draft.category || '');
        setPrice(draft.price || '');
        setThumbnail(draft.thumbnail || '');
        setCurriculum(draft.curriculum || []);
        setFeatures(draft.features || []);
        setTechStack(draft.techStack || []);
        setSkillsGained(draft.skillsGained || []);
        setJobRoles(draft.jobRoles || []);
        setTestimonials(draft.testimonials || []);
        setFaqs(draft.faqs || []);
        setModules(draft.modules || []);
        setTags(draft.tags || []);
        setRequirements(draft.requirements || []);
        setLearningOutcomes(draft.learningOutcomes || []);
        setLastSaved(new Date(draft.lastSaved));
      } catch (err) {
        console.error('Error loading draft:', err);
      }
    }
  }, []);

  // Auto-save to localStorage every 30 seconds
  useEffect(() => {
    const saveDraft = () => {
      setAutoSaving(true);
      const draft = {
        title,
        description,
        about,
        instructor,
        category,
        price,
        thumbnail,
        curriculum,
        features,
        techStack,
        skillsGained,
        jobRoles,
        testimonials,
        faqs,
        modules,
        tags,
        requirements,
        learningOutcomes,
        lastSaved: new Date().toISOString()
      };
      localStorage.setItem('course_draft', JSON.stringify(draft));
      setLastSaved(new Date());
      setTimeout(() => setAutoSaving(false), 500);
    };

    // Only auto-save if there's some content
    if (title || description || about) {
      const timer = setTimeout(saveDraft, 30000); // Auto-save every 30 seconds
      return () => clearTimeout(timer);
    }
  }, [title, description, about, instructor, category, price, thumbnail, curriculum, features, techStack, skillsGained, jobRoles, testimonials, faqs, modules, tags, requirements, learningOutcomes]);

  // Helper functions for array management
  const addCurriculumItem = () => {
    if (newCurriculumItem.title) {
      setCurriculum([...curriculum, { ...newCurriculumItem, order: curriculum.length + 1 }]);
      setNewCurriculumItem({
        order: curriculum.length + 2,
        logoUrl: '',
        title: '',
        sections: [{ order: 1, subtitle: '', description: '' }]
      });
      setActiveSection('curriculum');
    }
  };

  const removeCurriculumItem = (index: number) => {
    const updated = curriculum.filter((_, i) => i !== index);
    setCurriculum(updated.map((item, i) => ({ ...item, order: i + 1 })));
  };

  const handleSectionChange = (sectionIndex: number, field: keyof CurriculumSection, value: string) => {
    const updatedSections = [...newCurriculumItem.sections];
    updatedSections[sectionIndex][field] = value;
    setNewCurriculumItem({ ...newCurriculumItem, sections: updatedSections });
  };

  const addSectionField = () => {
    setNewCurriculumItem({
      ...newCurriculumItem,
      sections: [...newCurriculumItem.sections, { order: newCurriculumItem.sections.length + 1, subtitle: '', description: '' }]
    });
  };

  const removeSectionField = (index: number) => {
    const updatedSections = newCurriculumItem.sections.filter((_, i) => i !== index);
    setNewCurriculumItem({ 
      ...newCurriculumItem, 
      sections: updatedSections.map((section, i) => ({ ...section, order: i + 1 }))
    });
  };

  const addFeature = () => {
    if (newFeature) {
      setFeatures([...features, newFeature]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const addTechStackItem = () => {
    if (newTechStackItem.name && newTechStackItem.imageUrl) {
      setTechStack([...techStack, newTechStackItem]);
      setNewTechStackItem({ name: '', imageUrl: '' });
    }
  };

  const removeTechStackItem = (index: number) => {
    setTechStack(techStack.filter((_, i) => i !== index));
  };

  const addSkill = () => {
    if (newSkill) {
      setSkillsGained([...skillsGained, newSkill]);
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setSkillsGained(skillsGained.filter((_, i) => i !== index));
  };

  const addJobRole = () => {
    if (newJobRole) {
      setJobRoles([...jobRoles, newJobRole]);
      setNewJobRole('');
    }
  };

  const removeJobRole = (index: number) => {
    setJobRoles(jobRoles.filter((_, i) => i !== index));
  };

  const addTestimonial = () => {
    if (newTestimonial.name && newTestimonial.description) {
      setTestimonials([...testimonials, newTestimonial]);
      setNewTestimonial({ name: '', imageUrl: '', description: '' });
    }
  };

  const removeTestimonial = (index: number) => {
    setTestimonials(testimonials.filter((_, i) => i !== index));
  };

  const addFaq = () => {
    if (newFaq.question && newFaq.answer) {
      setFaqs([...faqs, newFaq]);
      setNewFaq({ question: '', answer: '' });
    }
  };

  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const addResourceToModule = () => {
    if (newResource.title && newResource.url) {
      setNewModule({
        ...newModule,
        resources: [...newModule.resources, newResource]
      });
      setNewResource({ title: '', url: '', type: 'link' });
    }
  };

  const removeResourceFromModule = (index: number) => {
    setNewModule({
      ...newModule,
      resources: newModule.resources.filter((_, i) => i !== index)
    });
  };

  const addModule = () => {
    if (newModule.title && newModule.description) {
      setModules([...modules, { ...newModule, order: modules.length + 1 }]);
      setNewModule({ 
        title: '', 
        description: '', 
        videoUrl: '', 
        duration: 0, 
        order: modules.length + 2, 
        resources: [] 
      });
      setActiveSection('modules');
    }
  };

  const removeModule = (index: number) => {
    const updated = modules.filter((_, i) => i !== index);
    setModules(updated.map((item, i) => ({ ...item, order: i + 1 })));
  };

  const addTag = () => {
    if (newTag) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const addRequirement = () => {
    if (newRequirement) {
      setRequirements([...requirements, newRequirement]);
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const addLearningOutcome = () => {
    if (newLearningOutcome) {
      setLearningOutcomes([...learningOutcomes, newLearningOutcome]);
      setNewLearningOutcome('');
    }
  };

  const removeLearningOutcome = (index: number) => {
    setLearningOutcomes(learningOutcomes.filter((_, i) => i !== index));
  };

  // Reordering functions for curriculum
  const moveCurriculumItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === curriculum.length - 1) return;
    
    const newCurriculum = [...curriculum];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newCurriculum[index], newCurriculum[targetIndex]] = [newCurriculum[targetIndex], newCurriculum[index]];
    
    // Update order numbers
    setCurriculum(newCurriculum.map((item, i) => ({ ...item, order: i + 1 })));
  };

  const moveSection = (curriculumIndex: number, sectionIndex: number, direction: 'up' | 'down') => {
    const item = curriculum[curriculumIndex];
    if (direction === 'up' && sectionIndex === 0) return;
    if (direction === 'down' && sectionIndex === item.sections.length - 1) return;
    
    const newSections = [...item.sections];
    const targetIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;
    [newSections[sectionIndex], newSections[targetIndex]] = [newSections[targetIndex], newSections[sectionIndex]];
    
    // Update order numbers
    const updatedSections = newSections.map((section, i) => ({ ...section, order: i + 1 }));
    const newCurriculum = curriculum.map((c, i) => 
      i === curriculumIndex ? { ...c, sections: updatedSections } : c
    );
    setCurriculum(newCurriculum);
  };

  // Reordering functions for modules
  const moveModule = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === modules.length - 1) return;
    
    const newModules = [...modules];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newModules[index], newModules[targetIndex]] = [newModules[targetIndex], newModules[index]];
    
    // Update order numbers
    setModules(newModules.map((item, i) => ({ ...item, order: i + 1 })));
  };

  // Inline edit functions for curriculum
  const startEditCurriculum = (index: number) => {
    setEditingCurriculumIndex(index);
  };

  const saveEditCurriculum = () => {
    setEditingCurriculumIndex(null);
  };

  const updateCurriculumField = (index: number, field: string, value: any) => {
    const updated = [...curriculum];
    updated[index] = { ...updated[index], [field]: value };
    setCurriculum(updated);
  };

  const updateCurriculumSection = (currIndex: number, sectIndex: number, field: string, value: any) => {
    const updated = [...curriculum];
    const updatedSections = [...updated[currIndex].sections];
    updatedSections[sectIndex] = { ...updatedSections[sectIndex], [field]: value };
    updated[currIndex] = { ...updated[currIndex], sections: updatedSections };
    setCurriculum(updated);
  };

  // Inline edit functions for modules
  const startEditModule = (index: number) => {
    setEditingModuleIndex(index);
  };

  const saveEditModule = () => {
    setEditingModuleIndex(null);
  };

  const updateModuleField = (index: number, field: string, value: any) => {
    const updated = [...modules];
    updated[index] = { ...updated[index], [field]: value };
    setModules(updated);
  };

  // Inline edit functions for testimonials
  const startEditTestimonial = (index: number) => {
    setEditingTestimonialIndex(index);
  };

  const saveEditTestimonial = () => {
    setEditingTestimonialIndex(null);
  };

  const updateTestimonialField = (index: number, field: string, value: any) => {
    const updated = [...testimonials];
    updated[index] = { ...updated[index], [field]: value };
    setTestimonials(updated);
  };

  // Inline edit functions for FAQs
  const startEditFaq = (index: number) => {
    setEditingFaqIndex(index);
  };

  const saveEditFaq = () => {
    setEditingFaqIndex(null);
  };

  const updateFaqField = (index: number, field: string, value: any) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: value };
    setFaqs(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const courseData = {
        title,
        description,
        about,
        instructor,
        category,
        price: parseInt(price),
        thumbnail,
        curriculum,
        features,
        techStack,
        skillsGained,
        jobRoles,
        testimonials,
        faqs,
        modules,
        tags,
        requirements,
        learningOutcomes
      };
      
      const response = await fetch('https://rass1.onrender.com/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create course');
      }
      
      // Clear localStorage draft on successful submission
      localStorage.removeItem('course_draft');
      setSuccess(true);
      setTimeout(() => {
        navigate('/courses');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation items
  const navigationItems = [
    { id: 'basic', label: 'Basic Info', icon: '📝' },
    { id: 'curriculum', label: 'Curriculum', icon: '📚' },
    { id: 'tech', label: 'Tech Stack', icon: '💻' },
    { id: 'skills', label: 'Skills & Jobs', icon: '🎯' },
    { id: 'modules', label: 'Modules', icon: '🎬' },
    { id: 'testimonials', label: 'Testimonials', icon: '⭐' },
    { id: 'faq', label: 'FAQ', icon: '❓' },
    { id: 'additional', label: 'Additional', icon: '📋' },
  ];

  const ProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Course Creation Progress</span>
        <span className="text-sm font-medium text-gray-700">
          {Math.round((Object.values({
            title, description, about, instructor, category, price, thumbnail,
            curriculum, techStack, skillsGained, modules
          }).filter(val => {
            if (Array.isArray(val)) return val.length > 0;
            return val !== '' && val !== "0";
          }).length / 11) * 100)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-green-600 h-2 rounded-full transition-all duration-300" 
          style={{ 
            width: `${(Object.values({
              title, description, about, instructor, category, price, thumbnail,
              curriculum, techStack, skillsGained, modules
            }).filter(val => {
              if (Array.isArray(val)) return val.length > 0;
              return val !== '' && (val !== "0");
            }).length / 11) * 100}%` 
          }}
        />
      </div>
    </div>
  );

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="px-6 py-8 bg-gradient-to-r from-blue-600 to-purple-700">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white">Create New Course</h1>
                  <p className="mt-2 text-blue-100">Build an engaging learning experience for your students</p>
                  {lastSaved && (
                    <p className="mt-1 text-sm text-blue-200">
                      {autoSaving ? '💾 Saving...' : `✓ Last saved: ${lastSaved.toLocaleTimeString()}`}
                    </p>
                  )}
                </div>
                <div className="hidden md:flex md:flex-col md:gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPreview(true)}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm font-medium transition-colors duration-200"
                  >
                    👁️ Preview Course
                  </button>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-white text-sm font-medium">Quick Tips</p>
                    <p className="text-blue-100 text-xs">Auto-save every 30s</p>
                  </div>
                </div>
              </div>
              <ProgressBar />
            </div>

            {/* Navigation */}
            <div className="bg-white border-b border-gray-200">
              <div className="px-6">
                <div className="flex space-x-1 overflow-x-auto py-4">
                  {navigationItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
                        activeSection === item.id
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Alerts */}
            <div className="px-6 pt-6">
              {success && (
                <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">
                        Course created successfully! Redirecting...
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800">
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {/* Basic Information Section */}
              {(activeSection === 'basic') && (
                <div className="space-y-8">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Basics</h2>
                    <p className="text-gray-600">Start with the fundamental information about your course</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                          Course Title *
                        </label>
                        <input
                          type="text"
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="e.g., Complete Web Development Bootcamp"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="instructor" className="block text-sm font-semibold text-gray-700 mb-2">
                          Instructor *
                        </label>
                        {loadingInstructors ? (
                          <div className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500">
                            Loading instructors...
                          </div>
                        ) : instructors.length > 0 ? (
                          <select
                            id="instructor"
                            value={instructor}
                            onChange={(e) => setInstructor(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            required
                          >
                            <option value="">Select an instructor</option>
                            {instructors.map((inst) => (
                              <option key={inst._id} value={inst._id}>
                                {inst.name} ({inst.email})
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            id="instructor"
                            value={instructor}
                            onChange={(e) => setInstructor(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="Enter instructor ID manually"
                            required
                          />
                        )}
                      </div>

                      <div>
                        <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                          Category *
                        </label>
                        <input
                          type="text"
                          id="category"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="e.g., Web Development, Data Science"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                          Price ($) *
                        </label>
                        <input
                          type="number"
                          id="price"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="0"
                          min="0"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label htmlFor="thumbnail" className="block text-sm font-semibold text-gray-700 mb-2">
                          Thumbnail URL *
                        </label>
                        <input
                          type="url"
                          id="thumbnail"
                          value={thumbnail}
                          onChange={(e) => setThumbnail(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="https://example.com/thumbnail.jpg"
                          required
                        />
                        {thumbnail && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-600 mb-2">Preview:</p>
                            <img 
                              src={thumbnail} 
                              alt="Thumbnail preview" 
                              className="w-full h-32 object-cover rounded-lg border border-gray-300"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                          Short Description *
                        </label>
                        <textarea
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="Brief description that appears in course listings..."
                          required
                        />
                        <p className="mt-1 text-sm text-gray-500">{description.length}/200 characters</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="about" className="block text-sm font-semibold text-gray-700 mb-2">
                      Detailed About Section *
                    </label>
                    <textarea
                      id="about"
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Comprehensive description of what students will learn, teaching approach, etc."
                      required
                    />
                    <p className="mt-1 text-sm text-gray-500">{about.length}/1000 characters</p>
                  </div>
                </div>
              )}

              {/* Curriculum Section */}
              {(activeSection === 'curriculum') && (
                <div className="space-y-8">
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Curriculum</h2>
                    <p className="text-gray-600">Structure your course content with sections and subsections</p>
                  </div>

                  {/* Existing Curriculum Items */}
                  <div className="space-y-4">
                    {curriculum.map((item, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-4 flex-1">
                            <div className="flex-shrink-0 w-10 h-10 bg-amber-100 text-amber-800 rounded-lg flex items-center justify-center font-bold">
                              {item.order}
                            </div>
                            <div className="flex-1">
                              {editingCurriculumIndex === index ? (
                                <div className="space-y-3">
                                  <input
                                    type="text"
                                    value={item.title}
                                    onChange={(e) => updateCurriculumField(index, 'title', e.target.value)}
                                    className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                    placeholder="Title"
                                  />
                                  <input
                                    type="url"
                                    value={item.logoUrl || ''}
                                    onChange={(e) => updateCurriculumField(index, 'logoUrl', e.target.value)}
                                    className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                    placeholder="Logo URL (optional)"
                                  />
                                </div>
                              ) : (
                                <>
                                  <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                                  {item.logoUrl && (
                                    <img 
                                      src={item.logoUrl} 
                                      alt={item.title} 
                                      className="mt-2 h-12 w-12 object-contain rounded-lg bg-gray-100 p-1"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                      }}
                                    />
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {editingCurriculumIndex === index ? (
                              <button
                                type="button"
                                onClick={saveEditCurriculum}
                                className="text-green-600 hover:text-green-700 px-3 py-1 rounded-lg hover:bg-green-50 text-sm font-medium"
                                title="Save changes"
                              >
                                Save
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => startEditCurriculum(index)}
                                className="text-blue-600 hover:text-blue-700 p-1 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                                title="Edit"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => moveCurriculumItem(index, 'up')}
                              disabled={index === 0}
                              className="text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200"
                              title="Move up"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => moveCurriculumItem(index, 'down')}
                              disabled={index === curriculum.length - 1}
                              className="text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200"
                              title="Move down"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => removeCurriculumItem(index)}
                              className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors duration-200"
                              title="Delete"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-3 ml-14">
                          {item.sections.map((section, sectionIndex) => (
                            <div key={sectionIndex} className="bg-gray-50 rounded-lg p-4">
                              {editingCurriculumIndex === index ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <input
                                    type="text"
                                    value={section.subtitle}
                                    onChange={(e) => updateCurriculumSection(index, sectionIndex, 'subtitle', e.target.value)}
                                    className="px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                    placeholder="Section subtitle"
                                  />
                                  <input
                                    type="text"
                                    value={section.description}
                                    onChange={(e) => updateCurriculumSection(index, sectionIndex, 'description', e.target.value)}
                                    className="px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                    placeholder="Section description"
                                  />
                                </div>
                              ) : (
                                <div className="flex items-start justify-between group">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-200 text-amber-900 text-xs font-bold">
                                        {item.order}.{section.order}
                                      </span>
                                      <h4 className="font-medium text-gray-900">{section.subtitle}</h4>
                                    </div>
                                    <p className="text-gray-600 mt-1 ml-8">{section.description}</p>
                                  </div>
                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      type="button"
                                      onClick={() => moveSection(index, sectionIndex, 'up')}
                                      disabled={sectionIndex === 0}
                                      className="text-gray-400 hover:text-gray-600 p-1 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                                      title="Move up"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                      </svg>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => moveSection(index, sectionIndex, 'down')}
                                      disabled={sectionIndex === item.sections.length - 1}
                                      className="text-gray-400 hover:text-gray-600 p-1 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                                      title="Move down"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add New Curriculum Item */}
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Curriculum Item</h3>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                          <input
                            type="text"
                            placeholder="e.g., Introduction to React"
                            value={newCurriculumItem.title}
                            onChange={(e) => setNewCurriculumItem({ ...newCurriculumItem, title: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL (Optional)</label>
                          <input
                            type="url"
                            placeholder="https://example.com/logo.png"
                            value={newCurriculumItem.logoUrl}
                            onChange={(e) => setNewCurriculumItem({ ...newCurriculumItem, logoUrl: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700">Sections</label>
                          <button
                            type="button"
                            onClick={addSectionField}
                            className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Section
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          {newCurriculumItem.sections.map((section, sectionIndex) => (
                            <div key={sectionIndex} className="bg-white border border-gray-200 rounded-lg p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <input
                                    type="text"
                                    placeholder="Section subtitle"
                                    value={section.subtitle}
                                    onChange={(e) => handleSectionChange(sectionIndex, 'subtitle', e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Section description"
                                    value={section.description}
                                    onChange={(e) => handleSectionChange(sectionIndex, 'description', e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                  />
                                </div>
                                {newCurriculumItem.sections.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeSectionField(sectionIndex)}
                                    className="ml-2 text-red-500 hover:text-red-700 p-1 rounded"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={addCurriculumItem}
                        disabled={!newCurriculumItem.title}
                        className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Add Curriculum Item</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tech Stack Section */}
              {(activeSection === 'tech') && (
                <div className="space-y-8">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Technologies & Tools</h2>
                    <p className="text-gray-600">List the technologies, frameworks, and tools used in this course</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {techStack.map((item, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={item.imageUrl} 
                              alt={item.name} 
                              className="h-10 w-10 object-contain rounded-lg bg-gray-100 p-1"
                              onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/40?text=?';
                              }}
                            />
                            <span className="font-medium text-gray-900">{item.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeTechStackItem(index)}
                            className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors duration-200"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Technology</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Technology Name</label>
                        <input
                          type="text"
                          placeholder="e.g., React, Node.js, Python"
                          value={newTechStackItem.name}
                          onChange={(e) => setNewTechStackItem({ ...newTechStackItem, name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                        <input
                          type="url"
                          placeholder="https://example.com/logo.png"
                          value={newTechStackItem.imageUrl}
                          onChange={(e) => setNewTechStackItem({ ...newTechStackItem, imageUrl: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={addTechStackItem}
                      disabled={!newTechStackItem.name || !newTechStackItem.imageUrl}
                      className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>Add Technology</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Skills & Job Roles Section */}
              {(activeSection === 'skills') && (
                <div className="space-y-8">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Skills & Career Outcomes</h2>
                    <p className="text-gray-600">What skills will students gain and what job roles can they target?</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Skills Gained */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-gray-900">Skills Gained</h3>
                      <div className="space-y-3">
                        {skillsGained.map((skill, index) => (
                          <div key={index} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span>{skill}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeSkill(index)}
                              className="text-red-500 hover:text-red-700 p-1 rounded"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add a skill (e.g., React Hooks, REST APIs)"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                        <button
                          type="button"
                          onClick={addSkill}
                          disabled={!newSkill}
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Job Roles */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-gray-900">Target Job Roles</h3>
                      <div className="space-y-3">
                        {jobRoles.map((role, index) => (
                          <div key={index} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span>{role}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeJobRole(index)}
                              className="text-red-500 hover:text-red-700 p-1 rounded"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add a job role (e.g., Frontend Developer)"
                          value={newJobRole}
                          onChange={(e) => setNewJobRole(e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={addJobRole}
                          disabled={!newJobRole}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Modules Section */}
              {(activeSection === 'modules') && (
                <div className="space-y-8">
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-2xl border border-indigo-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Modules</h2>
                    <p className="text-gray-600">Create video lessons and learning materials for your course</p>
                  </div>

                  {/* Existing Modules */}
                  <div className="space-y-4">
                    {modules.map((module, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-4 flex-1">
                            <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 text-indigo-800 rounded-lg flex items-center justify-center font-bold">
                              {module.order}
                            </div>
                            <div className="flex-1">
                              {editingModuleIndex === index ? (
                                <div className="space-y-3">
                                  <input
                                    type="text"
                                    value={module.title}
                                    onChange={(e) => updateModuleField(index, 'title', e.target.value)}
                                    className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Module title"
                                  />
                                  <textarea
                                    value={module.description}
                                    onChange={(e) => updateModuleField(index, 'description', e.target.value)}
                                    className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Module description"
                                    rows={2}
                                  />
                                  <input
                                    type="url"
                                    value={module.videoUrl || ''}
                                    onChange={(e) => updateModuleField(index, 'videoUrl', e.target.value)}
                                    className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Video URL"
                                  />
                                  <input
                                    type="number"
                                    value={module.duration || 0}
                                    onChange={(e) => updateModuleField(index, 'duration', parseInt(e.target.value) || 0)}
                                    className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Duration (minutes)"
                                    min="0"
                                  />
                                </div>
                              ) : (
                                <>
                                  <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                                  <p className="text-gray-600 mt-1">{module.description}</p>
                                  {module.videoUrl && (
                                    <div className="mt-2">
                                      <a 
                                        href={module.videoUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                                      >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Preview Video
                                      </a>
                                    </div>
                                  )}
                                  <div className="mt-2 flex items-center text-sm text-gray-500">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {module.duration} minutes
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {editingModuleIndex === index ? (
                              <button
                                type="button"
                                onClick={saveEditModule}
                                className="text-green-600 hover:text-green-700 px-3 py-1 rounded-lg hover:bg-green-50 text-sm font-medium"
                                title="Save changes"
                              >
                                Save
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => startEditModule(index)}
                                className="text-blue-600 hover:text-blue-700 p-1 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                                title="Edit"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => moveModule(index, 'up')}
                              disabled={index === 0}
                              className="text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200"
                              title="Move up"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => moveModule(index, 'down')}
                              disabled={index === modules.length - 1}
                              className="text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200"
                              title="Move down"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => removeModule(index)}
                              className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors duration-200"
                              title="Delete"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        {module.resources.length > 0 && (
                          <div className="ml-14">
                            <h4 className="font-medium text-gray-900 mb-2">Resources</h4>
                            <div className="space-y-2">
                              {module.resources.map((resource, resourceIndex) => (
                                <div key={resourceIndex} className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2">
                                  <span className="text-sm text-gray-700">{resource.title}</span>
                                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">{resource.type}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add New Module */}
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Module</h3>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                          <input
                            type="text"
                            placeholder="e.g., Introduction to React Components"
                            value={newModule.title}
                            onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                          <input
                            type="number"
                            placeholder="e.g., 45"
                            value={newModule.duration || ''}
                            onChange={(e) => setNewModule({ ...newModule, duration: parseInt(e.target.value) || 0 })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                            min="0"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          placeholder="Describe what this module covers..."
                          value={newModule.description}
                          onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Video URL</label>
                        <input
                          type="url"
                          placeholder="https://example.com/video.mp4"
                          value={newModule.videoUrl}
                          onChange={(e) => setNewModule({ ...newModule, videoUrl: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700">Resources</label>
                          <button
                            type="button"
                            onClick={addResourceToModule}
                            disabled={!newResource.title || !newResource.url}
                            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center disabled:text-gray-400"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Resource
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                          <input
                            type="text"
                            placeholder="Resource title"
                            value={newResource.title}
                            onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                          <input
                            type="url"
                            placeholder="Resource URL"
                            value={newResource.url}
                            onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                          <select
                            value={newResource.type}
                            onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option value="link">Link</option>
                            <option value="pdf">PDF</option>
                            <option value="doc">Document</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        
                        {newModule.resources.length > 0 && (
                          <div className="space-y-2">
                            {newModule.resources.map((resource, resourceIndex) => (
                              <div key={resourceIndex} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-2">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-700">{resource.title}</span>
                                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">{resource.type}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeResourceFromModule(resourceIndex)}
                                  className="text-red-500 hover:text-red-700 p-1 rounded"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={addModule}
                        disabled={!newModule.title || !newModule.description}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Add Module</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Testimonials Section */}
              {(activeSection === 'testimonials') && (
                <div className="space-y-8">
                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-2xl border border-yellow-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Testimonials</h2>
                    <p className="text-gray-600">Showcase what your students are saying about the course</p>
                  </div>

                  {/* Existing Testimonials */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {testimonials.map((testimonial, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        {editingTestimonialIndex === index ? (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                              <input
                                type="text"
                                value={testimonial.name}
                                onChange={(e) => updateTestimonialField(index, 'name', e.target.value)}
                                className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                                placeholder="Student name"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                              <input
                                type="url"
                                value={testimonial.imageUrl || ''}
                                onChange={(e) => updateTestimonialField(index, 'imageUrl', e.target.value)}
                                className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                                placeholder="Profile image URL"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Testimonial</label>
                              <textarea
                                value={testimonial.description}
                                onChange={(e) => updateTestimonialField(index, 'description', e.target.value)}
                                className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                                placeholder="Testimonial text"
                                rows={3}
                              />
                            </div>
                            <div className="flex gap-2 justify-end">
                              <button
                                type="button"
                                onClick={saveEditTestimonial}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-start space-x-4">
                                <img 
                                  src={testimonial.imageUrl || 'https://via.placeholder.com/60?text=Student'} 
                                  alt={testimonial.name} 
                                  className="h-12 w-12 rounded-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = 'https://via.placeholder.com/60?text=Student';
                                  }}
                                />
                                <div>
                                  <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                                  <div className="flex mt-1">
                                    {[...Array(5)].map((_, i) => (
                                      <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                      </svg>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => startEditTestimonial(index)}
                                  className="text-blue-600 hover:text-blue-700 p-1 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                                  title="Edit"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeTestimonial(index)}
                                  className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors duration-200"
                                  title="Delete"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            <p className="text-gray-600 italic">"{testimonial.description}"</p>
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add New Testimonial */}
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Testimonial</h3>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Student Name</label>
                          <input
                            type="text"
                            placeholder="e.g., John Doe"
                            value={newTestimonial.name}
                            onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image URL (Optional)</label>
                          <input
                            type="url"
                            placeholder="https://example.com/profile.jpg"
                            value={newTestimonial.imageUrl}
                            onChange={(e) => setNewTestimonial({ ...newTestimonial, imageUrl: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Testimonial</label>
                        <textarea
                          placeholder="What did the student say about your course?"
                          value={newTestimonial.description}
                          onChange={(e) => setNewTestimonial({ ...newTestimonial, description: e.target.value })}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={addTestimonial}
                        disabled={!newTestimonial.name || !newTestimonial.description}
                        className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Add Testimonial</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* FAQ Section */}
              {(activeSection === 'faq') && (
                <div className="space-y-8">
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-2xl border border-teal-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
                    <p className="text-gray-600">Address common questions about your course</p>
                  </div>

                  {/* Existing FAQs */}
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="p-6">
                          {editingFaqIndex === index ? (
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                                <input
                                  type="text"
                                  value={faq.question}
                                  onChange={(e) => updateFaqField(index, 'question', e.target.value)}
                                  className="w-full px-3 py-2 border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                                  placeholder="FAQ question"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Answer</label>
                                <textarea
                                  value={faq.answer}
                                  onChange={(e) => updateFaqField(index, 'answer', e.target.value)}
                                  className="w-full px-3 py-2 border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                                  placeholder="FAQ answer"
                                  rows={3}
                                />
                              </div>
                              <div className="flex gap-2 justify-end">
                                <button
                                  type="button"
                                  onClick={saveEditFaq}
                                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                                <p className="text-gray-600">{faq.answer}</p>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <button
                                  type="button"
                                  onClick={() => startEditFaq(index)}
                                  className="text-blue-600 hover:text-blue-700 p-1 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                                  title="Edit"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeFaq(index)}
                                  className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors duration-200"
                                  title="Delete"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add New FAQ */}
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New FAQ</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                        <input
                          type="text"
                          placeholder="e.g., Do I need prior programming experience?"
                          value={newFaq.question}
                          onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Answer</label>
                        <textarea
                          placeholder="Provide a clear and helpful answer..."
                          value={newFaq.answer}
                          onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={addFaq}
                        disabled={!newFaq.question || !newFaq.answer}
                        className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Add FAQ</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Information Section */}
              {(activeSection === 'additional') && (
                <div className="space-y-8">
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-2xl border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Additional Information</h2>
                    <p className="text-gray-600">Add tags, requirements, and learning outcomes</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Tags */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-gray-900">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(index)}
                              className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add a tag (e.g., JavaScript, React)"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={addTag}
                          disabled={!newTag}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Requirements */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-gray-900">Requirements</h3>
                      <div className="space-y-3">
                        {requirements.map((requirement, index) => (
                          <div key={index} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span>{requirement}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeRequirement(index)}
                              className="text-red-500 hover:text-red-700 p-1 rounded"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add a requirement (e.g., Basic HTML knowledge)"
                          value={newRequirement}
                          onChange={(e) => setNewRequirement(e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                        <button
                          type="button"
                          onClick={addRequirement}
                          disabled={!newRequirement}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Learning Outcomes */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-gray-900">Learning Outcomes</h3>
                      <div className="space-y-3">
                        {learningOutcomes.map((outcome, index) => (
                          <div key={index} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span>{outcome}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeLearningOutcome(index)}
                              className="text-red-500 hover:text-red-700 p-1 rounded"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add a learning outcome (e.g., Build responsive websites)"
                          value={newLearningOutcome}
                          onChange={(e) => setNewLearningOutcome(e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                        <button
                          type="button"
                          onClick={addLearningOutcome}
                          disabled={!newLearningOutcome}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-gray-900">Course Features</h3>
                      <div className="space-y-3">
                        {features.map((feature, index) => (
                          <div key={index} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              <span>{feature}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFeature(index)}
                              className="text-red-500 hover:text-red-700 p-1 rounded"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add a feature (e.g., Lifetime access)"
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                        <button
                          type="button"
                          onClick={addFeature}
                          disabled={!newFeature}
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8 mt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    const currentIndex = navigationItems.findIndex(item => item.id === activeSection);
                    if (currentIndex > 0) {
                      setActiveSection(navigationItems[currentIndex - 1].id);
                    }
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Previous</span>
                </button>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      const currentIndex = navigationItems.findIndex(item => item.id === activeSection);
                      if (currentIndex < navigationItems.length - 1) {
                        setActiveSection(navigationItems[currentIndex + 1].id);
                      }
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <span>Next</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {activeSection === 'additional' && (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors duration-200 flex items-center space-x-2"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Creating Course...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Create Course</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Course Preview</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="text-white hover:text-gray-200 p-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-8 space-y-8">
              {/* Basic Info */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{title || 'Untitled Course'}</h3>
                <p className="text-gray-600 mt-2">{description}</p>
                {thumbnail && (
                  <img src={thumbnail} alt={title} className="mt-4 w-full h-64 object-cover rounded-lg" />
                )}
                <div className="mt-4 flex flex-wrap gap-4">
                  <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
                    <span className="font-semibold">Category:</span> {category || 'N/A'}
                  </div>
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                    <span className="font-semibold">Price:</span> ${price || '0'}
                  </div>
                </div>
              </div>

              {/* About */}
              {about && (
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">About This Course</h4>
                  <p className="text-gray-600 whitespace-pre-wrap">{about}</p>
                </div>
              )}

              {/* Curriculum */}
              {curriculum.length > 0 && (
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">Curriculum</h4>
                  <div className="space-y-4">
                    {curriculum.map((item, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-bold">{item.order}</span>
                          <h5 className="font-semibold text-gray-900">{item.title}</h5>
                        </div>
                        {item.sections.map((section, sidx) => (
                          <div key={sidx} className="ml-10 mt-2 pl-4 border-l-2 border-gray-200">
                            <div className="flex items-center gap-2">
                              <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">{item.order}.{section.order}</span>
                              <p className="font-medium">{section.subtitle}</p>
                            </div>
                            {section.description && <p className="text-sm text-gray-600 mt-1">{section.description}</p>}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modules */}
              {modules.length > 0 && (
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">Course Modules</h4>
                  <div className="space-y-3">
                    {modules.map((module, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-4 flex items-start gap-4">
                        <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-bold flex-shrink-0">{module.order}</span>
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900">{module.title}</h5>
                          <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                          <p className="text-xs text-gray-500 mt-1">Duration: {module.duration} minutes</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tech Stack */}
              {techStack.length > 0 && (
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">Technologies Used</h4>
                  <div className="flex flex-wrap gap-3">
                    {techStack.map((tech, idx) => (
                      <div key={idx} className="bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2">
                        <img src={tech.imageUrl} alt={tech.name} className="w-6 h-6 object-contain" />
                        <span className="font-medium">{tech.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills & Job Roles */}
              {(skillsGained.length > 0 || jobRoles.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {skillsGained.length > 0 && (
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-3">Skills You'll Gain</h4>
                      <ul className="space-y-2">
                        {skillsGained.map((skill, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>{skill}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {jobRoles.length > 0 && (
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-3">Career Opportunities</h4>
                      <ul className="space-y-2">
                        {jobRoles.map((role, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>{role}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Testimonials */}
              {testimonials.length > 0 && (
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">What Students Say</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {testimonials.map((testimonial, idx) => (
                      <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-600 italic">"{testimonial.description}"</p>
                        <p className="font-semibold text-gray-900 mt-2">— {testimonial.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQs */}
              {faqs.length > 0 && (
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h4>
                  <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                      <div key={idx} className="border-b border-gray-200 pb-4">
                        <p className="font-semibold text-gray-900">{faq.question}</p>
                        <p className="text-gray-600 mt-2">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-4 pt-4 border-t">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AddCoursePage;
