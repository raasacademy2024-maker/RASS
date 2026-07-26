import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mediaPresenceAPI } from '../../services/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { resolveImageUrl } from '../../utils/imageUrl';

interface MediaItem {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  journalLink: string;
}

const MediaPresenceSection: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentGroup, setCurrentGroup] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [itemsPerGroup, setItemsPerGroup] = useState(4); // Default to 4 for large screens
  const autoPlayRef = useRef<NodeJS.Timeout>();

  const totalGroups = Math.ceil(mediaItems.length / itemsPerGroup);

  // Update items per group based on screen size
  useEffect(() => {
    const updateItemsPerGroup = () => {
      if (window.innerWidth < 640) {
        // Mobile (sm)
        setItemsPerGroup(1);
      } else if (window.innerWidth < 1024) {
        // Tablet (md)
        setItemsPerGroup(2);
      } else {
        // Desktop (lg and above)
        setItemsPerGroup(4);
      }
    };

    // Set initial value
    updateItemsPerGroup();

    // Add event listener
    window.addEventListener('resize', updateItemsPerGroup);

    // Cleanup
    return () => window.removeEventListener('resize', updateItemsPerGroup);
  }, []);

  useEffect(() => {
    const fetchMediaItems = async () => {
      try {
        const response = await mediaPresenceAPI.getActiveMediaItems();
        setMediaItems(response.data);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching media items:', err);
        if (err.response) {
          console.error('Response error:', err.response.status, err.response.data);
          setError(`Failed to load media items: ${err.response.status} - ${err.response.data}`);
        } else if (err.request) {
          console.error('Request error:', err.request);
          setError('Failed to load media items: Network error');
        } else {
          console.error('Unknown error:', err.message);
          setError(`Failed to load media items: ${err.message}`);
        }
        setLoading(false);
      }
    };

    fetchMediaItems();
  }, []);

  const getCurrentItems = () => {
    const startIndex = currentGroup * itemsPerGroup;
    return mediaItems.slice(startIndex, startIndex + itemsPerGroup);
  };

  const startAutoPlay = useCallback(() => {
    if (isPaused) return;
    
    autoPlayRef.current = setInterval(() => {
      setDirection(1);
      setCurrentGroup(prev => (prev + 1) % totalGroups);
    }, 5000);
  }, [isPaused, totalGroups]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  }, []);

  useEffect(() => {
    if (mediaItems.length > 0 && totalGroups > 1) {
      startAutoPlay();
    }
    return stopAutoPlay;
  }, [mediaItems.length, totalGroups, startAutoPlay, stopAutoPlay]);

  const nextGroup = () => {
    setDirection(1);
    setCurrentGroup(prev => (prev + 1) % totalGroups);
  };

  const prevGroup = () => {
    setDirection(-1);
    setCurrentGroup(prev => (prev - 1 + totalGroups) % totalGroups);
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

  if (loading) {
    return <div className="py-10 text-center">Loading media mentions...</div>;
  }

  if (error) {
    console.error('MediaPresenceSection error:', error);
    return null;
  }

  if (mediaItems.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Our <span className="text-blue-700">media</span> Highlights
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600 text-lg"
          >
            Featured in leading publications for transforming education and careers
          </motion.p>
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
          <div className="relative min-h-[300px] flex items-center justify-center">
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
                className={`absolute w-full grid gap-6 px-4 ${
                  getCurrentItems().length === 1 
                    ? 'grid-cols-1 max-w-md mx-auto' 
                    : getCurrentItems().length === 2
                    ? 'grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto'
                    : getCurrentItems().length === 3
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                }`}
              >
                {getCurrentItems().map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    onClick={() => {
                      if (item.journalLink) {
                        window.open(item.journalLink, '_blank', 'noopener,noreferrer');
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="h-32 overflow-hidden">
                      <motion.img 
                        src={resolveImageUrl(item.imageUrl, 600)}
                        alt={item.title}
                        className="w-full h-full object-contain p-4"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://placehold.co/300x200?text=Image+Not+Found';
                        }}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-3">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {totalGroups > 1 && (
            <>
              <motion.button
                onClick={prevGroup}
                className="absolute left-4 md:-left-16 top-1/2 -translate-y-1/2 bg-white/20 shadow-2xl border border-gray-200 w-14 h-14 rounded-2xl flex items-center justify-center group hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.95 }}
                disabled={totalGroups <= 1}
              >
                <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-emerald-600 transition-colors" />
              </motion.button>

              <motion.button
                onClick={nextGroup}
                className="absolute right-4 md:-right-16 top-1/2 -translate-y-1/2 bg-white/20 shadow-2xl border border-gray-200 w-14 h-14 rounded-2xl flex items-center justify-center group hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.95 }}
                disabled={totalGroups <= 1}
              >
                <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-emerald-600 transition-colors" />
              </motion.button>

              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: totalGroups }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentGroup(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentGroup 
                        ? "bg-emerald-600 scale-125" 
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default MediaPresenceSection;