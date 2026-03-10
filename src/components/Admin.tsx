import React, { useState, useEffect } from 'react';
import { auth, db, googleProvider, isFirebaseConfigured } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc, setDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, LogOut, Plus, Trash2, Image as ImageIcon, Video, Link as LinkIcon, ShieldCheck, X, AlertTriangle, FileText, Settings, BookOpen, Edit } from 'lucide-react';
import { PortfolioItem, Category, BlogPost, SiteSettings } from '../types';

import { getGoogleDriveDirectLink } from '../utils';

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [articles, setArticles] = useState<BlogPost[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({ heroImage: '', cvLink: '' });
  const [activeTab, setActiveTab] = useState<'portfolio' | 'messages' | 'articles' | 'settings'>('portfolio');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [hasAttemptedAutoLogin, setHasAttemptedAutoLogin] = useState(false);
  
  // Portfolio Form State
  const [type, setType] = useState<'image' | 'video'>('image');
  const [category, setCategory] = useState<Category>('Post Design');
  const [url, setUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');

  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [editingArticle, setEditingArticle] = useState<BlogPost | null>(null);

  // Article Form State
  const [articleImage, setArticleImage] = useState('');
  const [articleContent, setArticleContent] = useState('');

  // Settings Form State
  const [heroImage, setHeroImage] = useState('');
  const [cvLink, setCvLink] = useState('');

  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const ADMIN_EMAIL = 'belalvisuals@gmail.com';

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!auth) return;
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error('Login Error:', error);
      if (error.code === 'auth/popup-blocked') {
        setStatusMessage({ type: 'error', text: 'আপনার ব্রাউজার পপআপ ব্লক করেছে। দয়া করে পপআপ এলাউ করুন।' });
      }
    }
  };

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth || !db) {
      setLoading(false);
      return;
    }

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email === ADMIN_EMAIL) {
        setUser(currentUser);
      } else if (currentUser) {
        signOut(auth);
        setStatusMessage({ type: 'error', text: 'Access Denied: Only the administrator can access this panel.' });
      } else {
        setUser(null);
        // Trigger auto login if not already attempted
        if (!hasAttemptedAutoLogin) {
          handleLogin();
          setHasAttemptedAutoLogin(true);
        }
      }
      setLoading(false);
    });

    const qItems = query(collection(db, 'portfolio'), orderBy('createdAt', 'desc'));
    const unsubscribeItems = onSnapshot(qItems, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PortfolioItem));
      setItems(data);
    });

    const qMsgs = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const unsubscribeMsgs = onSnapshot(qMsgs, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(data);
    });

    const qArticles = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
    const unsubscribeArticles = onSnapshot(qArticles, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
      setArticles(data);
    });

    const unsubscribeSettings = onSnapshot(doc(db, 'settings', 'site'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as SiteSettings;
        setSettings(data);
        setHeroImage(data.heroImage);
        setCvLink(data.cvLink);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeItems();
      unsubscribeMsgs();
      unsubscribeArticles();
      unsubscribeSettings();
    };
  }, []);

  const handleLogout = () => auth && signOut(auth);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !db) {
      setStatusMessage({ type: 'error', text: 'দয়া করে সব তথ্য পূরণ করুন।' });
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingItem) {
        await updateDoc(doc(db, 'portfolio', editingItem.id), {
          type,
          category: type === 'image' ? category : null,
          url,
          thumbnail: type === 'video' ? thumbnail : null,
          updatedAt: Date.now()
        });
        setStatusMessage({ type: 'success', text: 'আইটেমটি সফলভাবে আপডেট করা হয়েছে!' });
        setEditingItem(null);
      } else {
        await addDoc(collection(db, 'portfolio'), {
          type,
          category: type === 'image' ? category : null,
          url,
          thumbnail: type === 'video' ? thumbnail : null,
          createdAt: Date.now()
        });
        setStatusMessage({ type: 'success', text: 'নতুন আইটেম সফলভাবে যোগ করা হয়েছে!' });
      }
      setUrl('');
      setThumbnail('');
      setShowAddModal(false);
    } catch (error) {
      console.error('Save Item Error:', error);
      setStatusMessage({ type: 'error', text: 'আইটেম সেভ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditItem = (item: PortfolioItem) => {
    setEditingItem(item);
    setType(item.type);
    setCategory(item.category || 'Post Design');
    setUrl(item.url);
    setThumbnail(item.thumbnail || '');
    setShowAddModal(true);
  };

  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleImage || !articleContent || !db) {
      setStatusMessage({ type: 'error', text: 'দয়া করে ইমেজ লিংক এবং কন্টেন্ট উভয়ই প্রদান করুন।' });
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingArticle) {
        await updateDoc(doc(db, 'blogs', editingArticle.id), {
          image: articleImage,
          content: articleContent,
          updatedAt: Date.now()
        });
        setStatusMessage({ type: 'success', text: 'আর্টিকেলটি সফলভাবে আপডেট করা হয়েছে!' });
        setEditingArticle(null);
      } else {
        await addDoc(collection(db, 'blogs'), {
          image: articleImage,
          content: articleContent,
          createdAt: Date.now()
        });
        setStatusMessage({ type: 'success', text: 'আর্টিকেলটি সফলভাবে পাবলিশ করা হয়েছে!' });
      }
      setArticleImage('');
      setArticleContent('');
      setShowArticleModal(false);
    } catch (error) {
      console.error('Save Article Error:', error);
      setStatusMessage({ type: 'error', text: 'আর্টিকেল পাবলিশ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditArticle = (article: BlogPost) => {
    setEditingArticle(article);
    setArticleImage(article.image);
    setArticleContent(article.content);
    setShowArticleModal(true);
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;

    setIsSubmitting(true);
    try {
      await setDoc(doc(db, 'settings', 'site'), {
        heroImage,
        cvLink
      }, { merge: true });
      setStatusMessage({ type: 'success', text: 'সেটিংস সফলভাবে আপডেট করা হয়েছে!' });
    } catch (error) {
      console.error('Update Settings Error:', error);
      setStatusMessage({ type: 'error', text: 'সেটিংস আপডেট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!db) return;
    if (window.confirm('Delete this article?')) {
      try {
        await deleteDoc(doc(db, 'blogs', id));
      } catch (error) {
        console.error('Delete Article Error:', error);
      }
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!db) return;
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteDoc(doc(db, 'portfolio', id));
      } catch (error) {
        console.error('Delete Error:', error);
      }
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!db) return;
    if (window.confirm('Delete this message?')) {
      try {
        await deleteDoc(doc(db, 'messages', id));
      } catch (error) {
        console.error('Delete Message Error:', error);
      }
    }
  };

  if (!isFirebaseConfigured) {
    return (
      <div className="min-h-screen bg-primary-dark flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-primary-navy p-10 rounded-3xl border border-yellow-500/20 text-center shadow-2xl"
        >
          <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <AlertTriangle size={40} className="text-yellow-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Setup Required</h1>
          <p className="text-gray-400 mb-6">অ্যাডমিন প্যানেল এবং লগইন অপশন চালু করার জন্য আপনাকে ফায়ারবেস কনফিগার করতে হবে।</p>
          
          <div className="bg-black/30 p-6 rounded-2xl text-left mb-8 border border-white/5">
            <p className="text-xs font-bold text-primary-light uppercase tracking-widest mb-3">কিভাবে ঠিক করবেন:</p>
            <ol className="text-xs text-gray-400 space-y-2 list-decimal ml-4">
              <li>AI Studio-এর বাম পাশের <b>Secrets</b> আইকনে ক্লিক করুন।</li>
              <li>নিচের ভেরিয়েবলগুলো যোগ করুন:
                <ul className="mt-2 space-y-1 font-mono text-[10px] text-primary-light/70">
                  <li>VITE_FIREBASE_API_KEY</li>
                  <li>VITE_FIREBASE_AUTH_DOMAIN</li>
                  <li>VITE_FIREBASE_PROJECT_ID</li>
                  <li>VITE_FIREBASE_APP_ID</li>
                </ul>
              </li>
              <li>সবগুলো যোগ করার পর পেজটি রিফ্রেশ দিন।</li>
            </ol>
          </div>

          <div className="opacity-50 pointer-events-none">
            <button className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-white text-primary-dark font-bold rounded-2xl shadow-xl">
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              Sign in with Google
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (loading) return (
    <div className="min-h-screen bg-primary-dark flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary-light border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-primary-dark flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-primary-navy p-10 rounded-3xl border border-white/5 text-center shadow-2xl"
        >
          <div className="w-20 h-20 bg-primary-blue/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShieldCheck size={40} className="text-primary-light" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Admin Access</h1>
          <p className="text-gray-400 mb-10">Please sign in with your authorized Google account to manage your portfolio.</p>
          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-white text-primary-dark font-bold rounded-2xl hover:bg-gray-100 transition-all shadow-xl"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Sign in with Google
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-dark text-white p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Status Message */}
        <AnimatePresence>
          {statusMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-10 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border ${
                statusMessage.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${statusMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
              <span className="font-bold text-sm">{statusMessage.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">Portfolio Manager</h1>
            <p className="text-gray-400">Welcome back, {user.displayName}</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-primary-blue hover:bg-primary-light text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-blue/20"
            >
              <Plus size={20} />
              Add New Item
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-primary-navy p-6 rounded-2xl border border-white/5">
            <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mb-2">Portfolio</p>
            <p className="text-3xl font-bold">{items.length}</p>
          </div>
          <div className="bg-primary-navy p-6 rounded-2xl border border-white/5">
            <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mb-2">Articles</p>
            <p className="text-3xl font-bold">{articles.length}</p>
          </div>
          <div className="bg-primary-navy p-6 rounded-2xl border border-white/5">
            <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mb-2">Messages</p>
            <p className="text-3xl font-bold">{messages.length}</p>
          </div>
          <div className="bg-primary-navy p-6 rounded-2xl border border-white/5">
            <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mb-2">Status</p>
            <p className="text-xl font-bold text-green-500 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Live
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-8 border-b border-white/5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`pb-4 px-2 font-bold text-[10px] uppercase tracking-widest transition-all relative whitespace-nowrap ${activeTab === 'portfolio' ? 'text-primary-light' : 'text-gray-500 hover:text-white'}`}
          >
            <div className="flex items-center gap-2">
              <ImageIcon size={14} /> Portfolio
            </div>
            {activeTab === 'portfolio' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary-light rounded-full" />}
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`pb-4 px-2 font-bold text-[10px] uppercase tracking-widest transition-all relative whitespace-nowrap ${activeTab === 'articles' ? 'text-primary-light' : 'text-gray-500 hover:text-white'}`}
          >
            <div className="flex items-center gap-2">
              <BookOpen size={14} /> Articles
            </div>
            {activeTab === 'articles' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary-light rounded-full" />}
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`pb-4 px-2 font-bold text-[10px] uppercase tracking-widest transition-all relative whitespace-nowrap ${activeTab === 'messages' ? 'text-primary-light' : 'text-gray-500 hover:text-white'}`}
          >
            <div className="flex items-center gap-2">
              <FileText size={14} /> Messages
              {messages.length > 0 && <span className="ml-1 px-1.5 py-0.5 bg-primary-blue text-[8px] rounded-full text-white">{messages.length}</span>}
            </div>
            {activeTab === 'messages' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary-light rounded-full" />}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-4 px-2 font-bold text-[10px] uppercase tracking-widest transition-all relative whitespace-nowrap ${activeTab === 'settings' ? 'text-primary-light' : 'text-gray-500 hover:text-white'}`}
          >
            <div className="flex items-center gap-2">
              <Settings size={14} /> Site Settings
            </div>
            {activeTab === 'settings' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary-light rounded-full" />}
          </button>
        </div>

        {activeTab === 'portfolio' && (
          <div className="bg-primary-navy rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5">
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Preview</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="w-16 h-12 bg-primary-dark rounded-lg overflow-hidden border border-white/10">
                          {item.type === 'image' ? (
                            <img src={getGoogleDriveDirectLink(item.url)} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <img src={getGoogleDriveDirectLink(item.thumbnail || '')} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${item.type === 'image' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'}`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-xs">{item.category || '-'}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditItem(item)}
                            className="p-2 text-gray-500 hover:text-primary-light transition-colors"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {items.length === 0 && (
              <div className="text-center py-20 text-gray-500 italic text-sm">No items added yet.</div>
            )}
          </div>
        )}

        {activeTab === 'articles' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={() => setShowArticleModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-primary-blue hover:bg-primary-light text-white font-bold rounded-xl transition-all shadow-lg"
              >
                <Plus size={20} />
                New Article
              </button>
            </div>
            <div className="bg-primary-navy rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/5">
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Image</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Content Preview</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {articles.map((article) => (
                      <tr key={article.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="w-16 h-12 bg-primary-dark rounded-lg overflow-hidden border border-white/10">
                            <img src={getGoogleDriveDirectLink(article.image)} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs text-gray-400 line-clamp-1 max-w-xs font-bengali">{article.content}</p>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500">
                          {new Date(article.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEditArticle(article)}
                              className="p-2 text-gray-500 hover:text-primary-light transition-colors"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteArticle(article.id)}
                              className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {articles.length === 0 && (
                <div className="text-center py-20 text-gray-500 italic text-sm">No articles posted yet.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-primary-navy p-6 rounded-2xl border border-white/5 flex justify-between items-start gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg">{msg.name}</h3>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{msg.message}</p>
                  <div className="mt-4 flex items-center gap-4">
                    <a href={`mailto:${msg.email}`} className="text-xs text-primary-blue hover:underline">{msg.email}</a>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteMessage(msg.id)}
                  className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))}
            {messages.length === 0 && (
              <div className="bg-primary-navy rounded-3xl border border-white/5 py-20 text-center text-gray-500 italic text-sm">
                No messages received yet.
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-primary-navy p-8 rounded-3xl border border-white/5 shadow-2xl">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
              <Settings size={20} className="text-primary-light" />
              Site Configuration
            </h2>
            <form onSubmit={handleUpdateSettings} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Hero Image (Drive Link)</label>
                <input
                  value={heroImage}
                  onChange={(e) => setHeroImage(e.target.value)}
                  className="w-full px-5 py-4 bg-primary-dark/50 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-primary-light/50 text-sm"
                  placeholder="Paste Google Drive link for hero image"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">CV / Resume Link</label>
                <input
                  value={cvLink}
                  onChange={(e) => setCvLink(e.target.value)}
                  className="w-full px-5 py-4 bg-primary-dark/50 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-primary-light/50 text-sm"
                  placeholder="Paste CV link (Drive, Dropbox, etc.)"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 bg-primary-blue hover:bg-primary-light text-white font-bold rounded-2xl transition-all shadow-xl shadow-primary-blue/20 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Updating...' : 'Update Settings'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Add Portfolio Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-dark/90 backdrop-blur-xl"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-xl w-full bg-primary-navy p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">{editingItem ? 'Edit Portfolio Item' : 'Add Portfolio Item'}</h2>
                <button 
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingItem(null);
                    setUrl('');
                    setThumbnail('');
                  }} 
                  className="text-gray-500 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddItem} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Type</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setType('image')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${type === 'image' ? 'bg-primary-blue border-primary-blue text-white' : 'bg-transparent border-white/10 text-gray-400'}`}
                      >
                        <ImageIcon size={18} /> Image
                      </button>
                      <button
                        type="button"
                        onClick={() => setType('video')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${type === 'video' ? 'bg-primary-blue border-primary-blue text-white' : 'bg-transparent border-white/10 text-gray-400'}`}
                      >
                        <Video size={18} /> Video
                      </button>
                    </div>
                  </div>
                  {type === 'image' && (
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as Category)}
                        className="w-full px-5 py-3 bg-primary-dark/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-light/50 text-sm"
                      >
                        <option value="Post Design">Post Design</option>
                        <option value="Facebook Cover">Facebook Cover</option>
                        <option value="Print Design">Print Design</option>
                        <option value="Ads Design">Ads Design</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                    {type === 'image' ? 'Image Drive Link' : 'Video Link (YouTube/Vimeo)'}
                  </label>
                  <div className="relative">
                    <LinkIcon size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full pl-12 pr-5 py-4 bg-primary-dark/50 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-primary-light/50 text-sm"
                      placeholder={type === 'image' ? "Paste Google Drive link" : "Paste video URL"}
                      required
                    />
                  </div>
                </div>

                {type === 'video' && (
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Video Thumbnail (Drive Link)</label>
                    <div className="relative">
                      <ImageIcon size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        value={thumbnail}
                        onChange={(e) => setThumbnail(e.target.value)}
                        className="w-full pl-12 pr-5 py-4 bg-primary-dark/50 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-primary-light/50 text-sm"
                        placeholder="Paste thumbnail image link"
                        required
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 bg-primary-blue hover:bg-primary-light text-white font-bold rounded-2xl transition-all shadow-xl shadow-primary-blue/20 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Saving...' : (editingItem ? 'Update Item' : 'Save Portfolio Item')}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Article Modal */}
      <AnimatePresence>
        {showArticleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-dark/90 backdrop-blur-xl"
            onClick={() => setShowArticleModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-2xl w-full bg-primary-navy p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">{editingArticle ? 'Edit Article' : 'New Article'}</h2>
                <button 
                  onClick={() => {
                    setShowArticleModal(false);
                    setEditingArticle(null);
                    setArticleImage('');
                    setArticleContent('');
                  }} 
                  className="text-gray-500 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddArticle} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Article Image (Drive Link)</label>
                  <input
                    value={articleImage}
                    onChange={(e) => setArticleImage(e.target.value)}
                    className="w-full px-5 py-4 bg-primary-dark/50 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-primary-light/50 text-sm"
                    placeholder="Paste Google Drive link for article image"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Content (Bangla Supported)</label>
                  <textarea
                    value={articleContent}
                    onChange={(e) => setArticleContent(e.target.value)}
                    className="w-full px-5 py-4 bg-primary-dark/50 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-primary-light/50 text-sm h-48 resize-none font-bengali"
                    placeholder="আপনার আর্টিকেলের বিষয়বস্তু এখানে লিখুন..."
                    required
                  />
                  <p className="text-[8px] text-gray-500 mt-2 uppercase tracking-widest">Supports Markdown for links and formatting</p>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 bg-primary-blue hover:bg-primary-light text-white font-bold rounded-2xl transition-all shadow-xl shadow-primary-blue/20 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Publishing...' : (editingArticle ? 'Update Article' : 'Publish Article')}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
