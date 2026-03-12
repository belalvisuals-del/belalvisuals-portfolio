import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, X } from 'lucide-react';
import { PortfolioItem } from '../types';
import { getYouTubeEmbedLink, getGoogleDriveDirectLink } from '../utils';

import { Link } from 'react-router-dom';

interface VideoGalleryProps {
  items: PortfolioItem[];
  limit?: number;
}

const VideoGallery: React.FC<VideoGalleryProps> = ({ items, limit }) => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const videoItems = items.filter(item => item.type === 'video');

  const displayedVideos = React.useMemo(() => {
    if (limit) {
      const shuffled = [...videoItems].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, limit);
    }
    return videoItems;
  }, [items, limit]);

  return (
    <section id="videos" className="py-24 bg-primary-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">Motion & Video</h2>
          <div className="w-20 h-1 bg-primary-light mb-8"></div>
          <p className="text-gray-400 max-w-2xl text-sm md:text-base px-4">
            High-impact promotional videos and smooth motion graphics that capture attention and drive engagement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedVideos.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group relative cursor-pointer overflow-hidden rounded-2xl bg-primary-dark border border-white/5"
              onClick={() => setSelectedVideo(getYouTubeEmbedLink(item.url))}
            >
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={getGoogleDriveDirectLink(item.thumbnail || `https://img.youtube.com/vi/${item.url.split('v=')[1]?.split('&')[0]}/maxresdefault.jpg`)}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-primary-dark/20 group-hover:bg-primary-dark/10 transition-colors duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white transform scale-90 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                    <Play size={20} fill="currentColor" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {displayedVideos.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 italic">No videos found.</p>
          </div>
        )}

        {limit && videoItems.length > limit && (
          <div className="mt-16 text-center">
            <Link 
              to="/videos"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary-light hover:bg-white hover:text-primary-navy text-white font-bold rounded-full transition-all duration-300 shadow-lg shadow-primary-light/20 hover:scale-[1.02]"
            >
              See More Videos
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          </div>
        )}
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-primary-dark/95 backdrop-blur-xl"
            onClick={() => setSelectedVideo(null)}
          >
            <button 
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
              onClick={() => setSelectedVideo(null)}
            >
              <X size={32} />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={selectedVideo}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default VideoGallery;
