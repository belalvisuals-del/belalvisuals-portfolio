import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import VideoGallery from './VideoGallery';
import { PortfolioItem } from '../types';

interface VideosPageProps {
  items: PortfolioItem[];
}

const VideosPage: React.FC<VideosPageProps> = ({ items }) => {
  return (
    <div className="bg-primary-dark min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-24 flex-1">
        <VideoGallery items={items} />
      </div>
      <Footer />
    </div>
  );
};

export default VideosPage;
