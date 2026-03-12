import React, { useState } from 'react';
import Masonry from 'react-masonry-css';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, X } from 'lucide-react';
import { PortfolioItem, Category } from '../types';
import { getGoogleDriveDirectLink } from '../utils';
import { Link } from 'react-router-dom';

interface PortfolioGridProps {
  items: PortfolioItem[];
  limit?: number;
}

const PortfolioGrid: React.FC<PortfolioGridProps> = ({ items, limit }) => {
  const [filter, setFilter] = useState<Category | 'All'>('All');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const categories: (Category | 'All')[] = ['All', 'Post Design', 'Facebook Cover', 'Print Design', 'Ads Design', 'Other'];

  const displayedItems = React.useMemo(() => {
    const filtered = items.filter(item => 
      item.type === 'image' && (filter === 'All' || item.category === filter)
    );
    
    if (limit && filter === 'All') {
      // Shuffle only on 'All' to ensure a cool mix on homepage
      const shuffled = [...filtered].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, limit);
    } else if (limit) {
      return filtered.slice(0, limit);
    }
    return filtered;
  }, [items, filter, limit]);

  const totalFilteredCount = items.filter(item => item.type === 'image' && (filter === 'All' || item.category === filter)).length;

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  return (
    <section id="designs" className="py-24 bg-primary-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Design Portfolio</h2>
          <div className="w-20 h-1 bg-primary-light mx-auto mb-8"></div>
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                  filter === cat 
                    ? 'bg-primary-light border-primary-light text-white shadow-lg shadow-primary-light/20' 
                    : 'bg-transparent border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="masonry-grid"
          columnClassName="masonry-grid_column"
        >
          {displayedItems.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="relative group cursor-pointer overflow-hidden rounded-2xl bg-primary-navy"
              onClick={() => setSelectedImage(getGoogleDriveDirectLink(item.url))}
            >
              <img
                src={getGoogleDriveDirectLink(item.url)}
                alt="Portfolio Item"
                className="w-full h-auto transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <p className="text-xs font-semibold text-white uppercase tracking-widest mb-1">{item.category}</p>
                <div className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <Maximize2 size={18} />
                </div>
              </div>
            </motion.div>
          ))}
        </Masonry>

        {displayedItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 italic">No designs found in this category.</p>
          </div>
        )}

        {limit && totalFilteredCount > limit && (
          <div className="mt-16 text-center">
            <Link 
              to="/designs"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary-blue hover:bg-primary-light text-white font-bold rounded-full transition-all duration-300 shadow-lg shadow-primary-blue/20 hover:scale-[1.02]"
            >
              See More Designs
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary-dark/95 backdrop-blur-xl"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImage}
              alt="Preview"
              className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              referrerPolicy="no-referrer"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PortfolioGrid;
