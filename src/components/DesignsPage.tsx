import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import PortfolioGrid from './PortfolioGrid';
import { PortfolioItem } from '../types';
import { motion } from 'motion/react';
import { ThumbsUp } from 'lucide-react';

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
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-blue/90 hover:bg-[#1769ff] text-white font-medium text-sm rounded-full transition-all duration-300 shadow-lg shadow-primary-blue/30 hover:scale-[1.02] border border-white/10"
        >
          <ThumbsUp size={16} className="text-white" />
          Appreciate My Work on Behance
        </motion.a>
      </div>

      <Footer />
    </div>
  );
};

export default DesignsPage;
