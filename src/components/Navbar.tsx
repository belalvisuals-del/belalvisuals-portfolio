import React, { useState, useEffect } from 'react';
import { Menu, X, Instagram, Facebook, Linkedin, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/', isHash: true, hash: '#home' },
    { name: 'Designs', href: '/', isHash: true, hash: '#designs' },
    { name: 'Videos', href: '/', isHash: true, hash: '#videos' },
    { name: 'Article', href: '/blog' },
    { name: 'Contact', href: '/', isHash: true, hash: '#contact' },
  ];

  const socialLinks = [
    { icon: <Facebook size={18} />, href: 'https://facebook.com/belalvisuals' },
    { icon: <Instagram size={18} />, href: 'https://instagram.com/belalvisuals' },
    { icon: <Linkedin size={18} />, href: 'https://www.linkedin.com/in/belalvisuals/' },
    { icon: <MessageCircle size={18} />, href: 'https://wa.me/8801628786232' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: any) => {
    if (link.isHash && location.pathname === '/') {
      e.preventDefault();
      const element = document.querySelector(link.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      setIsOpen(false);
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-primary-dark/90 backdrop-blur-md py-3 shadow-lg' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-white tracking-tighter">
              BELAL<span className="text-primary-light">VISUALS</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href + (link.hash || '')}
                  onClick={(e) => handleLinkClick(e, link)}
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  {link.name}
                </Link>
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
                <Link
                  key={link.name}
                  to={link.href + (link.hash || '')}
                  onClick={(e) => handleLinkClick(e, link)}
                  className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium"
                >
                  {link.name}
                </Link>
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
