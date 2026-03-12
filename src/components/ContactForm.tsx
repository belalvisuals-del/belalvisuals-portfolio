import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Send, MapPin, Mail, Phone, MessageCircle } from 'lucide-react';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactForm = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactFormData>();
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const onSubmit = async (data: ContactFormData) => {
    try {
      if (!db) throw new Error('Database not configured');

      await addDoc(collection(db, 'messages'), {
        ...data,
        createdAt: Date.now()
      });

      setStatusMessage({ type: 'success', text: 'Message sent successfully!' });
      reset();
    } catch (error) {
      console.error('Error sending message:', error);
      setStatusMessage({ type: 'error', text: 'Failed to send message. Please try again later.' });
    }
  };

  const contactInfo = [
    { icon: <MapPin size={20} />, label: 'Location', value: 'Chattogram, Bangladesh', color: 'bg-primary-blue/10 text-primary-blue' },
    { icon: <Mail size={20} />, label: 'Email', value: 'belalvisuals@gmail.com', color: 'bg-primary-light/10 text-primary-light' },
    { icon: <Phone size={20} />, label: 'Phone', value: '+880 1628 786232', color: 'bg-primary-blue/10 text-primary-blue', href: 'tel:+8801628786232' },
    { icon: <MessageCircle size={20} />, label: 'WhatsApp', value: '+880 1628 786232', color: 'bg-green-500/10 text-green-500', href: 'https://wa.me/8801628786232' },
  ];

  return (
    <section id="contact" className="pt-12 pb-24 bg-primary-dark px-6 relative">
      {/* Status Message */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-10 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border ${statusMessage.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
              }`}
          >
            <div className={`w-2 h-2 rounded-full ${statusMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
            <span className="font-bold text-sm">{statusMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left flex flex-col items-center lg:items-start"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Get In <span className="text-primary-light">Touch</span></h2>
            <p className="text-gray-400 mb-10 text-sm md:text-lg leading-relaxed font-light px-4 lg:px-0">
              Have a project in mind? I'm always open to discussing new design projects, creative ideas, or opportunities to be part of your vision.
            </p>

            <div className="space-y-6 w-full max-w-sm">
              {contactInfo.map((info, idx) => (
                <div key={idx} className="flex items-center gap-4 group">
                  <div className={`p-4 rounded-2xl transition-transform duration-300 group-hover:scale-110 ${info.color}`}>
                    {info.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{info.label}</p>
                    {info.href ? (
                      <a href={info.href} target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary-light transition-colors font-medium">
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-white font-medium">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-primary-navy/50 backdrop-blur-md p-6 md:p-12 rounded-3xl border border-white/5 shadow-2xl"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 md:space-y-6 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Your Name</label>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    className={`w-full px-5 py-4 bg-primary-dark/50 border rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-primary-light/50 transition-all ${errors.name ? 'border-red-500' : 'border-white/10'}`}
                    placeholder="Md Belal"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Your Email</label>
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                    })}
                    className={`w-full px-5 py-4 bg-primary-dark/50 border rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-primary-light/50 transition-all ${errors.email ? 'border-red-500' : 'border-white/10'}`}
                    placeholder="belal@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
                <input
                  {...register('subject', { required: 'Subject is required' })}
                  className={`w-full px-5 py-4 bg-primary-dark/50 border rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-primary-light/50 transition-all ${errors.subject ? 'border-red-500' : 'border-white/10'}`}
                  placeholder="Project Inquiry"
                />
                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                <textarea
                  {...register('message', { required: 'Message is required' })}
                  rows={5}
                  className={`w-full px-5 py-4 bg-primary-dark/50 border rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-primary-light/50 transition-all resize-none ${errors.message ? 'border-red-500' : 'border-white/10'}`}
                  placeholder="Tell me about your project..."
                ></textarea>
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4 bg-primary-blue hover:bg-primary-light text-white text-sm md:text-base font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-primary-blue/20 disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : (
                  <>
                    Send Message
                    <Send size={18} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
