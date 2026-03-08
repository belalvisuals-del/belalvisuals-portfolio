import React, { useState, useEffect } from 'react';
import { auth, db, googleProvider, isFirebaseConfigured } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, LogOut, Plus, Trash2, Image as ImageIcon, Video, Link as LinkIcon, ShieldCheck, X, AlertTriangle } from 'lucide-react';
import { PortfolioItem, Category } from '../types';

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'messages'>('portfolio');
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'image' | 'video'>('image');
  const [category, setCategory] = useState<Category>('Post Design');
  const [url, setUrl] = useState('');

  const ADMIN_EMAIL = 'belalvisuals@gmail.com';

  useEffect(() => {
    if (!isFirebaseConfigured || !auth || !db) return;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email === ADMIN_EMAIL) {
        setUser(currentUser);
      } else if (currentUser) {
        signOut(auth);
        alert('Access Denied: Only the administrator can access this panel.');
      } else {
        setUser(null);
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

    return () => {
      unsubscribeAuth();
      unsubscribeItems();
      unsubscribeMsgs();
    };
  }, []);

  const handleLogin = async () => {
    if (!auth) return;
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login Error:', error);
    }
  };

  const handleLogout = () => auth && signOut(auth);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url || !db) return;

    try {
      await addDoc(collection(db, 'portfolio'), {
        title,
        type,
        category: type === 'image' ? category : null,
        url,
        createdAt: Date.now()
      });
      setTitle('');
      setUrl('');
      setShowAddModal(false);
    } catch (error) {
      console.error('Add Item Error:', error);
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-primary-navy p-6 rounded-2xl border border-white/5">
            <p className="text-gray-500 text-sm uppercase tracking-widest font-bold mb-2">Total Items</p>
            <p className="text-4xl font-bold">{items.length}</p>
          </div>
          <div className="bg-primary-navy p-6 rounded-2xl border border-white/5">
            <p className="text-gray-500 text-sm uppercase tracking-widest font-bold mb-2">Images</p>
            <p className="text-4xl font-bold">{items.filter(i => i.type === 'image').length}</p>
          </div>
          <div className="bg-primary-navy p-6 rounded-2xl border border-white/5">
            <p className="text-gray-500 text-sm uppercase tracking-widest font-bold mb-2">Videos</p>
            <p className="text-4xl font-bold">{items.filter(i => i.type === 'video').length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/5">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`pb-4 px-2 font-bold text-sm uppercase tracking-widest transition-all relative ${activeTab === 'portfolio' ? 'text-primary-light' : 'text-gray-500 hover:text-white'}`}
          >
            Portfolio
            {activeTab === 'portfolio' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary-light rounded-full" />}
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`pb-4 px-2 font-bold text-sm uppercase tracking-widest transition-all relative ${activeTab === 'messages' ? 'text-primary-light' : 'text-gray-500 hover:text-white'}`}
          >
            Messages
            {messages.length > 0 && <span className="ml-2 px-1.5 py-0.5 bg-primary-blue text-[10px] rounded-full text-white">{messages.length}</span>}
            {activeTab === 'messages' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary-light rounded-full" />}
          </button>
        </div>

        {activeTab === 'portfolio' ? (
          <div className="bg-primary-navy rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5">
                    <th className="px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-widest">Preview</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-widest">Title</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-widest">Type</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-widest">Category</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="w-16 h-12 bg-primary-dark rounded-lg overflow-hidden border border-white/10">
                          {item.type === 'image' ? (
                            <img src={item.url.includes('drive.google.com') ? `https://lh3.googleusercontent.com/d/${item.url.match(/\/d\/(.+?)\//)?.[1]}` : item.url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-primary-light">
                              <Video size={20} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium">{item.title}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${item.type === 'image' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'}`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400">{item.category || '-'}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {items.length === 0 && (
              <div className="text-center py-20 text-gray-500 italic">No items added yet.</div>
            )}
          </div>
        ) : (
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
                    <span className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-primary-light text-sm font-medium mb-2">{msg.subject}</p>
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
              <div className="bg-primary-navy rounded-3xl border border-white/5 py-20 text-center text-gray-500 italic">
                No messages received yet.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-dark/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-xl w-full bg-primary-navy p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Add New Portfolio Item</h2>
                <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddItem} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-5 py-4 bg-primary-dark/50 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-primary-light/50"
                    placeholder="e.g. Social Media Post Design"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Type</label>
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
                      <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as Category)}
                        className="w-full px-5 py-3 bg-primary-dark/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-light/50"
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
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    {type === 'image' ? 'Google Drive Link' : 'YouTube/Vimeo Link'}
                  </label>
                  <div className="relative">
                    <LinkIcon size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full pl-12 pr-5 py-4 bg-primary-dark/50 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-primary-light/50"
                      placeholder={type === 'image' ? "Paste Google Drive sharing link" : "Paste video URL"}
                      required
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-widest">Make sure the link is set to "Anyone with the link"</p>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-primary-blue hover:bg-primary-light text-white font-bold rounded-2xl transition-all shadow-xl shadow-primary-blue/20"
                >
                  Save Item
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
