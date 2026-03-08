import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Download, Play, MessageCircle, Palette, Video as VideoIcon, PenTool, Layers, Image as ImageIcon } from 'lucide-react';

const Hero = () => {
  const floatingIcons = [
    { Icon: Palette, color: 'text-pink-500', top: '-10%', left: '-10%', delay: 0 },
    { Icon: VideoIcon, color: 'text-primary-blue', top: '20%', right: '-15%', delay: 0.5 },
    { Icon: PenTool, color: 'text-emerald-500', bottom: '10%', left: '-15%', delay: 1 },
    { Icon: Layers, color: 'text-orange-500', bottom: '-5%', right: '0%', delay: 1.5 },
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary-dark">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
        
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-blue/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-light/10 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-dark/50 to-primary-dark"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Profile Image with Floating Icons */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              {/* Floating Icons */}
              {floatingIcons.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: 1,
                    y: [0, -10, 0],
                  }}
                  transition={{ 
                    opacity: { duration: 1, delay: item.delay },
                    y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: item.delay }
                  }}
                  className={`absolute z-20 p-1.5 md:p-3 bg-white/5 backdrop-blur-md rounded-lg md:rounded-xl border border-white/10 ${item.color}`}
                  style={{ top: item.top, left: item.left, right: item.right, bottom: item.bottom }}
                >
                  <item.Icon size={14} className="md:w-6 md:h-6" />
                </motion.div>
              ))}

              <div className="absolute inset-0 bg-primary-light/20 rounded-full blur-2xl animate-pulse"></div>
              <img 
                src="https://picsum.photos/seed/belal/400/400" 
                alt="BelalVisuals - Md Belal Hosen Portfolio" 
                referrerPolicy="no-referrer"
                className="relative w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-4 border-primary-navy shadow-2xl z-10"
              />
            </div>
          </div>

          <h1 className="text-3xl md:text-8xl font-bold text-white mb-4 tracking-tight leading-tight md:leading-none flex items-center justify-center gap-3">
            <div className="flex items-center justify-center w-4 h-4 md:w-8 md:h-8 bg-emerald-500/20 rounded-full border border-emerald-500/30 backdrop-blur-sm">
              <div className="w-1.5 h-1.5 md:w-3 md:h-3 bg-emerald-500 rounded-full relative">
                <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
              </div>
            </div>
            <span>Md Belal <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-primary-blue">Hosen</span></span>
          </h1>
          <div className="mb-8">
            <span className="inline-block px-3 py-1 md:px-6 md:py-2 text-[9px] md:text-sm font-bold tracking-[0.2em] text-primary-light uppercase bg-primary-light/10 rounded-full border border-primary-light/20 backdrop-blur-sm">
              Visualizer | Video Editor
            </span>
          </div>
          <p className="max-w-2xl mx-auto text-sm md:text-xl text-gray-400 mb-8 leading-relaxed font-light px-4">
            Professional Graphic Designer & Video Editor. Crafting visually stunning designs and cinematic stories that elevate your brand's digital presence.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 px-4">
            <a
              href="#designs"
              className="group flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-primary-blue hover:bg-primary-light text-white text-sm md:text-base font-semibold rounded-full transition-all duration-300 shadow-lg shadow-primary-blue/20"
            >
              View My Work
              <ArrowRight size={16} className="md:w-[18px] md:h-[18px] group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="https://wa.me/8801628786232"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-white/5 hover:bg-white/10 text-white text-sm md:text-base font-semibold rounded-full border border-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              <MessageCircle size={16} className="md:w-[18px] md:h-[18px]" />
              WhatsApp
            </a>
            <a
              href="#" // Replace with actual CV link
              className="flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-white/5 hover:bg-white/10 text-white text-sm md:text-base font-semibold rounded-full border border-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              <Download size={16} className="md:w-[18px] md:h-[18px]" />
              CV
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-30"
      >
        <span className="text-[7px] md:text-[9px] uppercase tracking-[0.3em] text-gray-500 font-bold">Scroll to explore</span>
        <div className="w-[1px] h-4 md:h-8 bg-gradient-to-b from-primary-light to-transparent opacity-40"></div>
      </motion.div>
    </section>
  );
};

export default Hero;
