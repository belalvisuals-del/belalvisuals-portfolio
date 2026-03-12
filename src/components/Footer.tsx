import React from 'react';
import { Facebook, Instagram, Linkedin, Twitter, Github, MessageCircle } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { icon: <Facebook size={20} />, href: 'https://facebook.com/belalvisuals', label: 'Facebook' },
    { icon: <Instagram size={20} />, href: 'https://instagram.com/belalvisuals', label: 'Instagram' },
    { icon: <Linkedin size={20} />, href: 'https://www.linkedin.com/in/belalvisuals/', label: 'LinkedIn' },
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M9 12c2.1 0 3.7-1.6 3.7-3.7S11.1 4.6 9 4.6H4.6v7.4H9zm0-5.9c1.3 0 2.2.9 2.2 2.2s-.9 2.2-2.2 2.2H6.1V6.1H9zm9.4 5.9c2.1 0 3.7 1.6 3.7 3.7s-1.6 3.7-3.7 3.7h-4.4v-7.4h4.4zm0 5.9c1.3 0 2.2-.9 2.2-2.2s-.9-2.2-2.2-2.2h-2.2v4.4h2.2z" /></svg>, href: 'https://behance.net/belalvisuals', label: 'Behance' },
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="10" /><path d="M8 12c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8-8 3.6-8 8z" /><path d="M12 16c0-4 3-4 3-8 0-2.2-1.8-4-4-4s-4 1.8-4 4c0 1.5 1 2.5 1 2.5s-1.5 1.5-1.5 3.5c0 2 2 2 2 2s.5-1.5.5-2.5" /></svg>, href: 'https://pinterest.com/belalvisuals', label: 'Pinterest' },
    { icon: <MessageCircle size={20} />, href: 'https://wa.me/8801628786232', label: 'WhatsApp' },
  ];

  return (
    <footer className="bg-primary-dark border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <a href="#home" className="text-2xl font-bold text-white tracking-tighter">
              BELAL<span className="text-primary-light">VISUALS</span>
            </a>
            <p className="text-gray-500 mt-2 text-sm max-w-xs">
              Professional Graphic Designer & Video Editor. Crafting visually stunning designs and cinematic stories that elevate your brand's digital presence.
            </p>
          </div>

          <div className="flex items-center gap-6">
            {socialLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="text-gray-400 hover:text-primary-light transition-all duration-300 transform hover:-translate-y-1"
              >
                {link.icon}
              </a>
            ))}
          </div>

          <div className="text-center md:text-right">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Belal Visuals. All rights reserved.
            </p>
            <p className="text-gray-600 text-[10px] mt-1 uppercase tracking-widest font-medium">
              Designed & Developed with ❤️
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
