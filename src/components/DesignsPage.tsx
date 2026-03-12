import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import PortfolioGrid from './PortfolioGrid';
import { PortfolioItem } from '../types';
import { motion } from 'motion/react';

interface DesignsPageProps {
  items: PortfolioItem[];
}

const DesignsPage: React.FC<DesignsPageProps> = ({ items }) => {
  return (
    <div className="bg-primary-dark min-h-screen">
      <Navbar />
      <div className="pt-24">
        <PortfolioGrid items={items} />
      </div>

      <div className="pb-24 text-center">
        <motion.a 
          href="https://www.behance.net/belalvisuals" 
          target="_blank" 
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-3 px-8 py-4 bg-primary-blue hover:bg-[#1769ff] text-white font-bold rounded-full transition-all duration-300 shadow-lg shadow-primary-blue/30 hover:scale-[1.02] border border-white/10"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-6 h-6"><path d="M9 12c2.1 0 3.7-1.6 3.7-3.7S11.1 4.6 9 4.6H4.6v7.4H9zm0-5.9c1.3 0 2.2.9 2.2 2.2s-.9 2.2-2.2 2.2H6.1V6.1H9zm9.4 5.9c2.1 0 3.7 1.6 3.7 3.7s-1.6 3.7-3.7 3.7h-4.4v-7.4h4.4zm0 5.9c1.3 0 2.2-.9 2.2-2.2s-.9-2.2-2.2-2.2h-2.2v4.4h2.2z"/></svg>
          Appreciate My Work on Behance
        </motion.a>
      </div>
      
      <Footer />
    </div>
  );
};

export default DesignsPage;
