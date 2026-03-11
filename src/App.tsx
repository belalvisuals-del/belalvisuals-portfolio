import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot, doc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { PortfolioItem } from './types';
import { AlertCircle } from 'lucide-react';
import { sampleData } from './data/sampleData';

// Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PortfolioGrid from './components/PortfolioGrid';
import VideoGallery from './components/VideoGallery';
import Experience from './components/Experience';
import Clients from './components/Clients';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import Admin from './components/Admin';
import Article from './components/Article';
import ArticleDetail from './components/ArticleDetail';
import { Skill, ClientLogo, SiteSettings } from './types';

function MissingConfig() {
  return (
    <div className="min-h-screen bg-primary-dark flex items-center justify-center p-6 text-center">
      <div className="max-w-md bg-primary-navy p-10 rounded-3xl border border-white/10 shadow-2xl">
        <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={32} className="text-yellow-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Firebase Not Configured</h2>
        <p className="text-gray-400 mb-6">
          আপনার ফায়ারবেস এপিআই কী (API Keys) গুলো AI Studio-এর Secrets সেকশনে যোগ করুন। এটি না করলে অ্যাডমিন প্যানেল এবং ডাইনামিক ডিজাইনগুলো কাজ করবে না।
        </p>
        <div className="text-left bg-black/30 p-4 rounded-xl font-mono text-[10px] text-primary-light overflow-x-auto">
          VITE_FIREBASE_API_KEY=your_key<br/>
          VITE_FIREBASE_PROJECT_ID=your_id<br/>
          ...এবং অন্যান্য
        </div>
      </div>
    </div>
  );
}

function HomePage({ items, skills, clients, settings }: { items: PortfolioItem[], skills: Skill[], clients: ClientLogo[], settings: SiteSettings | null }) {
  return (
    <div className="bg-primary-dark min-h-screen selection:bg-primary-light selection:text-white">
      <Navbar />
      <Hero />
      <Experience skills={skills} settings={settings} />
      <PortfolioGrid items={items} />
      <VideoGallery items={items} />
      <Clients clients={clients} />
      <ContactForm />
      <Footer />
    </div>
  );
}

export default function App() {
  const [items, setItems] = useState<PortfolioItem[]>(isFirebaseConfigured ? [] : sampleData);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [clients, setClients] = useState<ClientLogo[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setLoading(false);
      return;
    }

    // Fetch Portfolio
    const q = query(collection(db, 'portfolio'), orderBy('createdAt', 'desc'));
    const unsubscribePortfolio = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PortfolioItem));
      setItems(data);
    });

    // Fetch Skills
    const qSkills = query(collection(db, 'skills'), orderBy('createdAt', 'asc'));
    const unsubscribeSkills = onSnapshot(qSkills, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Skill));
      setSkills(data);
    });

    // Fetch Clients
    const qClients = query(collection(db, 'clients'), orderBy('createdAt', 'desc'));
    const unsubscribeClients = onSnapshot(qClients, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ClientLogo));
      setClients(data);
    });

    // Fetch Settings
    const unsubscribeSettings = onSnapshot(doc(db, 'settings', 'site'), (doc) => {
      if (doc.exists()) {
        setSettings(doc.data() as SiteSettings);
      }
      setLoading(false);
    });

    return () => {
      unsubscribePortfolio();
      unsubscribeSkills();
      unsubscribeClients();
      unsubscribeSettings();
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage items={items} skills={skills} clients={clients} settings={settings} />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/articles" element={<Article />} />
        <Route path="/articles/:id" element={<ArticleDetail />} />
      </Routes>
    </Router>
  );
}
