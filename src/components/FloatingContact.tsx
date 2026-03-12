import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const FloatingContact = () => {
  const location = useLocation();

  // Hide on admin page
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-[90] w-[90%] md:w-max max-w-[400px] md:max-w-none shadow-black/50"
      >
        <motion.div 
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 10, ease: "linear", repeat: Infinity }}
          className="bg-[linear-gradient(45deg,#032259,#0451A7,#3A78C3,#032259)] bg-[length:400%_400%] border border-white/20 p-2 md:p-3 rounded-full flex items-center justify-between gap-4 md:gap-12 shadow-2xl overflow-hidden relative group"
        >
          
          {/* Inner subtle glow */}
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full pointer-events-none" />
          
          <span className="text-white font-medium text-sm md:text-base pl-4 md:pl-6 whitespace-nowrap z-10">
            Let's Create Magic!
          </span>
          <a 
            href="https://wa.me/8801628786232" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white hover:bg-white/90 text-primary-dark flex items-center gap-2 px-5 py-2.5 md:px-8 md:py-3 rounded-full font-extrabold transition-all text-sm md:text-base hover:scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.3)] z-10 whitespace-nowrap"
          >
            <span className="w-6 h-6 flex items-center justify-center bg-primary-blue rounded-full">
              <ArrowUpRight size={14} className="text-white" />
            </span>
            Hire Me
          </a>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FloatingContact;
