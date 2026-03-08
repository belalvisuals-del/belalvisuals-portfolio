import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { PortfolioItem } from './types';
import { AlertCircle } from 'lucide-react';

// Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PortfolioGrid from './components/PortfolioGrid';
import VideoGallery from './components/VideoGallery';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import Admin from './components/Admin';

function MissingConfig() {
  return (
    <div className="min-h-screen bg-primary-dark flex items-center justify-center p-6 text-center">
      <div className="max-w-md bg-primary-navy p-10 rounded-3xl border border-white/10 shadow-2xl">
        <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={32} className="text-yellow-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Firebase Not Configured</h2>
        <p className="text-gray-400 mb-6">
          Please add your Firebase API keys to the environment variables to enable the dynamic features of this portfolio.
        </p>
        <div className="text-left bg-black/30 p-4 rounded-xl font-mono text-xs text-primary-light overflow-x-auto">
          VITE_FIREBASE_API_KEY=...<br/>
          VITE_FIREBASE_PROJECT_ID=...
        </div>
      </div>
    </div>
  );
}

function HomePage({ items }: { items: PortfolioItem[] }) {
  return (
    <div className="bg-primary-dark min-h-screen selection:bg-primary-light selection:text-white">
      <Navbar />
      <Hero />
      <PortfolioGrid items={items} />
      <VideoGallery items={items} />
      <ContactForm />
      <Footer />
    </div>
  );
}

export default function App() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;

    const q = query(collection(db, 'portfolio'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PortfolioItem));
      setItems(data);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (!isFirebaseConfigured) {
    return <MissingConfig />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary-light border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium tracking-widest uppercase text-[10px]">Loading Belal Visuals</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage items={items} />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}
