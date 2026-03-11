import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { BlogPost } from '../types';
import { motion } from 'motion/react';
import Markdown from 'react-markdown';
import Navbar from './Navbar';
import Footer from './Footer';
import { Calendar, User, ArrowLeft, Heart, Share2, Facebook, Twitter, Link as LinkIcon } from 'lucide-react';
import { getGoogleDriveDirectLink } from '../utils';

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      if (!db || !id) return;
      try {
        const docRef = doc(db, 'blogs', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as BlogPost;
          setPost({ id: docSnap.id, ...data });
          setLikesCount((data as any).likes || 0);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleLike = async () => {
    if (!db || !id || liked) return;
    try {
      const docRef = doc(db, 'blogs', id);
      await updateDoc(docRef, {
        likes: increment(1)
      });
      setLiked(true);
      setLikesCount(prev => prev + 1);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleShare = (platform: 'facebook' | 'twitter' | 'copy') => {
    const url = window.location.href;
    const text = post?.content.substring(0, 100) || "Check out this article!";
    
    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="bg-primary-dark min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-light border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-primary-dark min-h-screen flex flex-col items-center justify-center text-white p-4">
        <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
        <Link to="/articles" className="text-primary-light flex items-center gap-2">
          <ArrowLeft size={20} /> Back to Articles
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-primary-dark min-h-screen font-sans">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link to="/articles" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-light transition-colors mb-8 text-sm uppercase tracking-widest font-bold">
            <ArrowLeft size={16} /> Back to Articles
          </Link>

          <div className="aspect-video rounded-3xl overflow-hidden mb-12 border border-white/5">
            <img 
              src={getGoogleDriveDirectLink(post.image)} 
              alt="Article Header" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="flex items-center gap-6 text-gray-500 text-xs mb-8 uppercase tracking-widest font-bold">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-primary-light" />
              {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5">
              <User size={14} className="text-primary-light" />
              Belal
            </span>
          </div>

          <div className="prose prose-invert prose-primary max-w-none markdown-body font-bengali text-lg text-gray-300 leading-relaxed mb-16">
            <Markdown>{post.content}</Markdown>
          </div>

          <div className="border-t border-white/5 pt-12 flex flex-wrap items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleLike}
                className={`flex items-center gap-2 px-6 py-3 rounded-full border transition-all ${liked ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'}`}
              >
                <Heart size={20} fill={liked ? "currentColor" : "none"} />
                <span className="font-bold">{likesCount} Likes</span>
              </button>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Share this article:</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleShare('facebook')}
                  className="p-3 bg-white/5 border border-white/10 rounded-full text-gray-400 hover:text-white hover:border-white/20 transition-all"
                >
                  <Facebook size={18} />
                </button>
                <button 
                  onClick={() => handleShare('twitter')}
                  className="p-3 bg-white/5 border border-white/10 rounded-full text-gray-400 hover:text-white hover:border-white/20 transition-all"
                >
                  <Twitter size={18} />
                </button>
                <button 
                  onClick={() => handleShare('copy')}
                  className="p-3 bg-white/5 border border-white/10 rounded-full text-gray-400 hover:text-white hover:border-white/20 transition-all"
                >
                  <LinkIcon size={18} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default ArticleDetail;
