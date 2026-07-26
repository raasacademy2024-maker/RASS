import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../services/api";
import { resolveImageUrl } from "../../utils/imageUrl";

interface AgendaItem {
  day: string;
  title: string;
  description: string;
  time: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface Event {
  _id: string;
  title: string;
  description: string;
  aboutEvent: string;
  date: string;
  location: string;
  type: "Free" | "Paid";
  price: number;
  imageUrl: string;
  highlights: string[];
  agenda: AgendaItem[];
  faq: FAQItem[];
}

interface Attendee {
  userId?: string;
  email: string;
}

interface EventWithAttendees extends Event {
  attendees?: Attendee[];
}

export default function UpcomingEvents() {
  const { isAuthenticated, user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentGroup, setCurrentGroup] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [eventsPerGroup, setEventsPerGroup] = useState(3); // Default to 3 for large screens
  const autoPlayRef = useRef<NodeJS.Timeout>();
  const [registeredCurrentGroup, setRegisteredCurrentGroup] = useState(0);
  const [registeredDirection, setRegisteredDirection] = useState(0);
  const [registeredIsPaused, setRegisteredIsPaused] = useState(false);
  const registeredAutoPlayRef = useRef<NodeJS.Timeout>();

  // Update events per group based on screen size
  useEffect(() => {
    const updateEventsPerGroup = () => {
      if (window.innerWidth < 640) {
        // Mobile (sm)
        setEventsPerGroup(1);
      } else if (window.innerWidth < 1024) {
        // Tablet (md)
        setEventsPerGroup(2);
      } else {
        // Desktop (lg and above)
        setEventsPerGroup(3);
      }
    };

    // Set initial value
    updateEventsPerGroup();

    // Add event listener
    window.addEventListener('resize', updateEventsPerGroup);

    // Cleanup
    return () => window.removeEventListener('resize', updateEventsPerGroup);
  }, []);

  useEffect(() => {
    fetchAllEvents();
    if (isAuthenticated && user) {
      fetchRegisteredEvents();
    }
  }, [isAuthenticated, user]);

  const fetchAllEvents = async () => {
    try {
      // Fetch all events with a high limit to get all events
      const res = await apiClient.get("/admin/events?limit=100");
      if (res.status === 200) {
        const data = res.data;
        // Use all events or just the events array from the response
        // Make sure we're handling both possible response formats
        const allEvents = Array.isArray(data) ? data : (data.events || []);
        console.log("Fetched events:", allEvents); // For debugging
        setEvents(allEvents);
      } else {
        console.error("Failed to fetch events, status:", res.status);
      }
    } catch (error: any) {
      console.error("Error fetching all events:", error);
      // Fallback to upcoming events if all events fetch fails
      try {
        const res = await apiClient.get("/admin/events/upcoming");
        if (res.status === 200) {
          const data = res.data;
          // Handle both possible response formats for upcoming events too
          const upcomingEvents = Array.isArray(data) ? data : (data.events || []);
          setEvents(upcomingEvents);
        }
      } catch (fallbackError) {
        console.error("Error fetching upcoming events:", fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRegisteredEvents = async () => {
    try {
      // Fetch all events first to get the full list
      const res = await apiClient.get("/admin/events?limit=100");
      if (res.status === 200) {
        const data = res.data;
        // Handle both possible response formats
        const allEvents: EventWithAttendees[] = Array.isArray(data) ? data : (data.events || []);
        
        // Filter events where the current user is registered
        // Check both userId (if available) and email for matching
        const userRegisteredEvents = allEvents.filter((event) => 
          event.attendees && event.attendees.some(
            (attendee) => {
              if (user?._id && attendee.userId) {
                return attendee.userId === user._id;
              } else if (user?.email) {
                return attendee.email === user.email;
              }
              return false;
            }
          )
        );
        
        setRegisteredEvents(userRegisteredEvents);
      } else {
        console.error("Failed to fetch events, status:", res.status);
      }
    } catch (error) {
      console.error("Error fetching registered events:", error);
    }
  };

  // Get current events to display based on the current group
  const getCurrentEvents = () => {
    if (events.length === 0) return [];
    
    const startIndex = currentGroup * eventsPerGroup;
    return events.slice(startIndex, startIndex + eventsPerGroup);
  };

  const startAutoPlay = useCallback(() => {
    if (isPaused) return;
    
    autoPlayRef.current = setInterval(() => {
      setDirection(1);
      setCurrentGroup(prev => {
        const totalGroups = Math.ceil(events.length / eventsPerGroup);
        return (prev + 1) % totalGroups;
      });
    }, 5000); // Changed from 3000 to 5000 milliseconds (5 seconds)
  }, [isPaused, events.length, eventsPerGroup]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  }, []);

  const startRegisteredAutoPlay = useCallback(() => {
    if (registeredIsPaused) return;
    
    if (registeredAutoPlayRef.current) {
      clearInterval(registeredAutoPlayRef.current);
    }
    
    if (registeredEvents.length > 0) {
      registeredAutoPlayRef.current = setInterval(() => {
        setRegisteredDirection(1);
        setRegisteredCurrentGroup(prev => {
          const totalGroups = Math.ceil(registeredEvents.length / eventsPerGroup);
          const nextGroup = (prev + 1) % totalGroups;
          return nextGroup;
        });
      }, 5000);
    }
  }, [registeredIsPaused, registeredEvents.length, eventsPerGroup]);

  const stopRegisteredAutoPlay = useCallback(() => {
    if (registeredAutoPlayRef.current) {
      clearInterval(registeredAutoPlayRef.current);
    }
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      startAutoPlay();
    }
    return () => {
      stopAutoPlay();
    };
  }, [events.length, startAutoPlay, stopAutoPlay]);

  useEffect(() => {
    if (registeredEvents.length > 0) {
      startRegisteredAutoPlay();
    }
    return () => {
      stopRegisteredAutoPlay();
    };
  }, [registeredEvents.length, eventsPerGroup, startRegisteredAutoPlay, stopRegisteredAutoPlay]);

  const nextGroup = () => {
    setDirection(1);
    setCurrentGroup(prev => {
      const totalGroups = Math.ceil(events.length / eventsPerGroup);
      return (prev + 1) % totalGroups;
    });
  };

  const prevGroup = () => {
    setDirection(-1);
    setCurrentGroup(prev => {
      const totalGroups = Math.ceil(events.length / eventsPerGroup);
      return (prev - 1 + totalGroups) % totalGroups;
    });
  };

  const groupVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
    }),
  };

  const registeredGroupVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
    }),
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getImageUrl = (event: Event) => {
    return resolveImageUrl(event.imageUrl, 800) || `https://picsum.photos/600/400?random=${event._id}`;
  };

  const getRegisteredEventsForCurrentGroup = () => {
    const startIndex = registeredCurrentGroup * eventsPerGroup;
    return registeredEvents.slice(startIndex, startIndex + eventsPerGroup);
  };

  const nextRegisteredGroup = () => {
    setRegisteredDirection(1);
    setRegisteredCurrentGroup(prev => {
      const totalGroups = Math.ceil(registeredEvents.length / eventsPerGroup);
      return (prev + 1) % totalGroups;
    });
  };

  const prevRegisteredGroup = () => {
    setRegisteredDirection(-1);
    setRegisteredCurrentGroup(prev => {
      const totalGroups = Math.ceil(registeredEvents.length / eventsPerGroup);
      return (prev - 1 + totalGroups) % totalGroups;
    });
  };

  if (loading) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">All Events</h2>
            <p className="text-xl text-gray-600">Discover our events and workshops</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Hide the entire section if there are no events
  if (events.length === 0) {
    return null;
  }

  return (
    <div className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">All Events</h2>
          <p className="text-xl text-gray-600">Discover our events and workshops</p>
        </div>
        
        <div 
          className="relative max-w-7xl mx-auto"
          onMouseEnter={() => {
            setIsPaused(true);
            stopAutoPlay();
          }}
          onMouseLeave={() => {
            setIsPaused(false);
            startAutoPlay();
          }}
        >
          <div className="relative min-h-[500px] flex items-center justify-center">
            <AnimatePresence mode="popLayout" custom={direction}>
              <motion.div
                key={currentGroup}
                custom={direction}
                variants={groupVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.4 },
                }}
                className={`absolute w-full grid gap-8 px-4 ${
                  getCurrentEvents().length === 1 
                    ? 'grid-cols-1 max-w-md mx-auto' 
                    : getCurrentEvents().length === 2
                    ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                }`}
              >
                {getCurrentEvents().map((event, index) => (
                  <motion.div
                    key={`${event._id}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    {/* Event Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={getImageUrl(event)}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16' fill='%239ca3af'%3EEvent Image%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>

                    {/* Event Details */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{event.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-700 text-sm">
                          <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(event.date)}
                        </div>
                        <div className="flex items-center text-gray-700 text-sm">
                          <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {event.location}
                        </div>
                      </div>

                      <Link
                        to={`/events/${event._id}`}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold text-center transition-colors duration-200 block"
                      >
                        View Details
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <motion.button
            onClick={prevGroup}
            className="absolute left-4 md:-left-16 top-1/2 -translate-y-1/2 bg-white/20 shadow-2xl border border-gray-200 w-14 h-14 rounded-2xl flex items-center justify-center group hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </motion.button>

          <motion.button
            onClick={nextGroup}
            className="absolute right-4 md:-right-16 top-1/2 -translate-y-1/2 bg-white/20 shadow-2xl border border-gray-200 w-14 h-14 rounded-2xl flex items-center justify-center group hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </motion.button>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: Math.ceil(events.length / eventsPerGroup) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentGroup(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentGroup 
                    ? "bg-blue-600 scale-125" 
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Registered Events Section */}
        {isAuthenticated && registeredEvents.length > 0 && (
          <div className="mt-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Registered Events</h3>
              <p className="text-gray-600">Events you've registered for</p>
            </div>
            
            <div 
              className="relative max-w-7xl mx-auto"
              onMouseEnter={() => {
                setRegisteredIsPaused(true);
                stopRegisteredAutoPlay();
              }}
              onMouseLeave={() => {
                setRegisteredIsPaused(false);
                startRegisteredAutoPlay();
              }}
            >
              <div className="relative min-h-[250px] flex items-center justify-center">
                <AnimatePresence mode="popLayout" custom={registeredDirection}>
                  <motion.div
                    key={registeredCurrentGroup}
                    custom={registeredDirection}
                    variants={registeredGroupVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.4 },
                    }}
                    className={`absolute w-full grid gap-6 px-4 ${
                      getRegisteredEventsForCurrentGroup().length === 1 
                        ? 'grid-cols-1 max-w-md mx-auto' 
                        : getRegisteredEventsForCurrentGroup().length === 2
                        ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
                        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    }`}
                  >
                    {getRegisteredEventsForCurrentGroup().map((event) => (
                      <motion.div
                        key={event._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-green-500 hover:shadow-lg transition-all duration-300"
                      >
                        {/* Event Image */}
                        <div className="relative h-32 overflow-hidden">
                          <img
                            src={getImageUrl(event)}
                            alt={event.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16' fill='%239ca3af'%3EEvent Image%3C/text%3E%3C/svg%3E";
                            }}
                          />
                          <div className="absolute top-2 right-2">
                            <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                              REGISTERED
                            </span>
                          </div>
                        </div>

                        {/* Event Details */}
                        <div className="p-4">
                          <h4 className="font-bold text-gray-800 mb-1 line-clamp-1">{event.title}</h4>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>
                          
                          <div className="flex items-center text-gray-700 text-xs mb-3">
                            <svg className="w-3 h-3 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(event.date)}
                          </div>

                          <Link
                            to={`/events/${event._id}`}
                            className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center"
                          >
                            View Details
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Arrows for Registered Events */}
              {registeredEvents.length > 0 && (
                <>
                  <motion.button
                    onClick={prevRegisteredGroup}
                    className="absolute left-4 md:-left-16 top-1/2 -translate-y-1/2 bg-white/20 shadow-2xl border border-gray-200 w-14 h-14 rounded-2xl flex items-center justify-center group hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.1, x: -5 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={registeredEvents.length <= eventsPerGroup}
                    style={{ opacity: registeredEvents.length <= eventsPerGroup ? 0.5 : 1, cursor: registeredEvents.length <= eventsPerGroup ? 'not-allowed' : 'pointer' }}
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-green-600 transition-colors" />
                  </motion.button>

                  <motion.button
                    onClick={nextRegisteredGroup}
                    className="absolute right-4 md:-right-16 top-1/2 -translate-y-1/2 bg-white/20 shadow-2xl border border-gray-200 w-14 h-14 rounded-2xl flex items-center justify-center group hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.1, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={registeredEvents.length <= eventsPerGroup}
                    style={{ opacity: registeredEvents.length <= eventsPerGroup ? 0.5 : 1, cursor: registeredEvents.length <= eventsPerGroup ? 'not-allowed' : 'pointer' }}
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-green-600 transition-colors" />
                  </motion.button>

                  {/* Pagination Dots for Registered Events */}
                  <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: Math.ceil(registeredEvents.length / eventsPerGroup) }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setRegisteredCurrentGroup(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === registeredCurrentGroup 
                            ? "bg-green-600 scale-125" 
                            : "bg-gray-300 hover:bg-gray-400"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <Link 
            to="/events" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold"
          >
            View All Events
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}