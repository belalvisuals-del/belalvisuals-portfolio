import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { BlogPost } from '../types';
import { motion } from 'motion/react';
import Markdown from 'react-markdown';
import Navbar from './Navbar';
import Footer from './Footer';
import { Calendar, User, ArrowRight } from 'lucide-react';

const Article = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;

    const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
      setPosts(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getDriveImageUrl = (url: string) => {
    if (url.includes('drive.google.com')) {
      const id = url.match(/\/d\/(.+?)\//)?.[1] || url.match(/id=(.+?)(&|$)/)?.[1];
      return id ? `https://lh3.googleusercontent.com/d/${id}` : url;
    }
    return url;
  };

  return (
    <div className="bg-primary-dark min-h-screen font-sans">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <header className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight"
          >
            My <span className="text-primary-light">Articles</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto font-bengali text-lg"
          >
            আমার ডিজাইন ভাবনা, টিপস এবং অভিজ্ঞতা শেয়ার করছি এখানে।
          </motion.p>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary-light border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, idx) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-primary-navy rounded-3xl overflow-hidden border border-white/5 hover:border-primary-light/30 transition-all group flex flex-col h-full"
              >
                <div className="aspect-video overflow-hidden relative">
                  <img 
                    src={getDriveImageUrl(post.image)} 
                    alt="Article Post" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-gray-500 text-xs mb-4 uppercase tracking-widest font-bold">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-primary-light" />
                      {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <User size={14} className="text-primary-light" />
                      Belal
                    </span>
                  </div>
                  
                  <div className="text-gray-300 font-bengali line-clamp-4 mb-6 flex-1 markdown-body">
                    <Markdown>{post.content}</Markdown>
                  </div>

                  <button className="flex items-center gap-2 text-primary-light font-bold text-sm uppercase tracking-widest group/btn">
                    Read More 
                    <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 italic font-bengali">এখনো কোনো আর্টিকেল পোস্ট করা হয়নি।</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Article;
