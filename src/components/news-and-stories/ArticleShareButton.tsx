/* eslint-disable no-console */
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Link as LinkIcon, MessageCircle } from 'lucide-react';
import React, { useState } from 'react';

interface ArticleShareButtonProps {
  title: string;
  slug: string;
  contentType: 'Event' | 'News' | 'Story' | 'Announcement' | string;
}

export function ArticleShareButton({ title, slug, contentType }: ArticleShareButtonProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Safely construct URL (fallback to relative if window is somehow unavailable, but shouldn't happen inside handler)
  const url = typeof window !== 'undefined' ? `${window.location.origin}/news-and-stories/${slug}` : `https://udbhavfoundation.org/news-and-stories/${slug}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });
      } catch (err) {
        // user aborted or error
        console.error('Error sharing', err);
      }
    } else {
      setShowShareMenu((prev) => !prev);
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
  const ariaLabel = `Share this ${contentType.toLowerCase()}`;

  return (
    <div className="relative inline-flex items-center">
      <button
        onClick={handleShare}
        className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-[#20256F] hover:bg-gray-50 hover:scale-105 transition-all duration-200 group"
        aria-label={ariaLabel}
        title="Share"
      >
        <Share2 className="w-[18px] h-[18px] group-hover:text-[#4FAF32] transition-colors" />
      </button>

      <AnimatePresence>
        {showShareMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-12 bg-white rounded-xl shadow-lg border border-gray-100 p-2 flex flex-col gap-1 min-w-[160px] z-50"
          >
            <a
              href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-[#EEF8E9] hover:text-[#4FAF32] rounded-lg transition-colors"
              onClick={() => setShowShareMenu(false)}
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
            
            {/* Facebook Share */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
              onClick={() => setShowShareMenu(false)}
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
              </svg>
              Facebook
            </a>

            <button
              onClick={copyLink}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
            >
              <LinkIcon className="w-4 h-4" /> Copy Link
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-xl z-[100] flex items-center gap-2"
          >
            <LinkIcon className="w-4 h-4" /> Link copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
