'use client';

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Share2, Link as LinkIcon, MessageCircle } from 'lucide-react';

interface ArticleInteractionsProps {
  title: string;
  slug: string;
}

export function ArticleInteractions({ title, slug }: ArticleInteractionsProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  const [showToast, setShowToast] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const url = typeof window !== 'undefined' ? `${window.location.origin}/news-and-stories/${slug}` : '';

  const handleShare = async () => {
    if (navigator.share && isMobile) {
      try {
        await navigator.share({
          title,
          url,
        });
      } catch (err) {
        console.error('Error sharing', err);
      }
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setShowToast(true);
      setShowShareMenu(false);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  return (
    <>
      {/* 1. Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#4FAF32] origin-left z-50"
        style={{ scaleX }}
      />

      {/* 2. Desktop Floating Share */}
      <div className="hidden lg:flex fixed top-1/2 -translate-y-1/2 left-8 flex-col gap-4 z-40">
        <div className="relative">
          <button
            onClick={handleShare}
            className="w-12 h-12 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-500 hover:text-[#20256F] hover:shadow-lg transition-all"
            aria-label="Share article"
          >
            <Share2 className="w-5 h-5" />
          </button>
          
          {showShareMenu && (
            <motion.div 
              initial={{ opacity: 0, x: -10, y: -20 }}
              animate={{ opacity: 1, x: 0, y: -20 }}
              className="absolute left-16 top-0 bg-white rounded-xl shadow-xl border border-gray-100 p-2 flex flex-col gap-2 min-w-[150px]"
            >
              <a 
                href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-[#EEF8E9] hover:text-[#4FAF32] rounded-lg transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
              <button 
                onClick={copyLink}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
              >
                <LinkIcon className="w-4 h-4" /> Copy Link
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* 3. Mobile Inline Share (Rendered in normal flow if placed manually, or sticky at bottom) */}
      <div className="lg:hidden mt-8 border-t border-gray-100 pt-8 pb-4">
        <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider text-center">Share this</h3>
        <div className="flex items-center justify-center gap-4">
          <a 
            href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
            target="_blank" rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-[#EEF8E9] text-[#4FAF32] flex items-center justify-center hover:bg-[#E5F4DF] transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
          </a>
          <a 
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            target="_blank" rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"
          >
             <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
               <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
             </svg>
          </a>
          <button 
            onClick={copyLink}
            className="w-12 h-12 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <LinkIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm shadow-xl z-50 flex items-center gap-2 animate-in slide-in-from-bottom-4">
          <LinkIcon className="w-4 h-4" /> Link copied!
        </div>
      )}
    </>
  );
}
