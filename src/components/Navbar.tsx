import React, { useState, useEffect } from 'react';
import { Menu, X, Instagram, Facebook, Linkedin, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Designs', href: '#designs' },
    { name: 'Videos', href: '#videos' },
    { name: 'Contact', href: '#contact' },
  ];

  const socialLinks = [
    { icon: <Facebook size={18} />, href: 'https://facebook.com/belalvisuals' },
    { icon: <Instagram size={18} />, href: 'https://instagram.com/belalvisuals' },
    { icon: <Linkedin size={18} />, href: 'https://www.linkedin.com/in/belalvisuals/' },
    { icon: <svg size={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]"><path d="M9 12c2.1 0 3.7-1.6 3.7-3.7S11.1 4.6 9 4.6H4.6v7.4H9zm0-5.9c1.3 0 2.2.9 2.2 2.2s-.9 2.2-2.2 2.2H6.1V6.1H9zm9.4 5.9c2.1 0 3.7 1.6 3.7 3.7s-1.6 3.7-3.7 3.7h-4.4v-7.4h4.4zm0 5.9c1.3 0 2.2-.9 2.2-2.2s-.9-2.2-2.2-2.2h-2.2v4.4h2.2z"/></svg>, href: 'https://behance.net/belalvisuals' },
    { icon: <svg size={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]"><circle cx="12" cy="12" r="10"/><path d="M8 12c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8-8 3.6-8 8z"/><path d="M12 16c0-4 3-4 3-8 0-2.2-1.8-4-4-4s-4 1.8-4 4c0 1.5 1 2.5 1 2.5s-1.5 1.5-1.5 3.5c0 2 2 2 2 2s.5-1.5.5-2.5"/></svg>, href: 'https://pinterest.com/belalvisuals' },
    { icon: <MessageCircle size={18} />, href: 'https://wa.me/8801628786232' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-primary-dark/90 backdrop-blur-md py-3 shadow-lg' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0">
            <a href="#home" className="text-2xl font-bold text-white tracking-tighter">
              BELAL<span className="text-primary-light">VISUALS</span>
            </a>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {socialLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-light transition-colors"
              >
                {link.icon}
              </a>
            ))}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-primary-navy border-t border-white/10"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium"
                >
                  {link.name}
                </a>
              ))}
              <div className="flex space-x-4 px-3 py-4">
                {socialLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-primary-light"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
