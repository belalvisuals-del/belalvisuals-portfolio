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
        className="fixed bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-[90] w-max max-w-[90%] shadow-black/50"
      >
        <motion.div 
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 10, ease: "linear", repeat: Infinity }}
          className="bg-[linear-gradient(45deg,rgba(3,34,89,0.7),rgba(4,81,167,0.7),rgba(58,120,195,0.7),rgba(3,34,89,0.7))] bg-[length:400%_400%] backdrop-blur-xl border border-white/20 p-1.5 md:p-2 rounded-full flex items-center justify-between gap-3 md:gap-6 shadow-2xl overflow-hidden relative group"
        >
          
          {/* Inner subtle glow */}
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full pointer-events-none" />
          
          <span className="text-white/90 font-medium text-xs md:text-sm pl-4 md:pl-5 whitespace-nowrap z-10">
            Let's Create Magic!
          </span>
          <a 
            href="https://wa.me/8801628786232" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white hover:bg-white/90 text-primary-dark flex items-center gap-1.5 px-4 py-2 md:px-5 md:py-2.5 rounded-full font-bold transition-all text-xs md:text-sm hover:scale-[1.02] shadow-[0_0_15px_rgba(255,255,255,0.2)] z-10 whitespace-nowrap"
          >
            <span className="w-5 h-5 flex items-center justify-center bg-primary-blue rounded-full">
              <ArrowUpRight size={12} className="text-white" />
            </span>
            Hire Me
          </a>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FloatingContact;
