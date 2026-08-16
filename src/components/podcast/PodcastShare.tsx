'use client';

import React, { useState } from 'react';
import { Share2, Link as LinkIcon, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PodcastShareProps {
  title: string;
  description: string;
  slug: string;
}

export function PodcastShare({ title, description, slug }: PodcastShareProps) {
  const [showFallback, setShowFallback] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Need absolute URL for sharing
  const url = typeof window !== 'undefined' ? `${window.location.origin}/podcast/${slug}` : `https://udbhavfoundation.in/podcast/${slug}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDesc = encodeURIComponent(description);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: url,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setShowFallback(true);
        }
      }
    } else {
      setShowFallback(true);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <div className="flex flex-col gap-3">
        <button 
          onClick={handleShare}
          className="flex items-center justify-center w-full px-6 py-3.5 bg-[#20256F] hover:bg-[#181C5A] text-white rounded-xl font-bold transition-all shadow-sm"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </button>
        
        <button 
          onClick={handleCopyLink}
          className="flex items-center justify-center w-full px-6 py-3.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl font-bold transition-colors"
        >
          <LinkIcon className="h-4 w-4 mr-2 text-gray-500" />
          {copied ? 'Link copied' : 'Copy Link'}
        </button>
      </div>

      <AnimatePresence>
        {showFallback && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 right-0 mt-3 p-4 bg-white rounded-xl shadow-xl border border-gray-100 z-10"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-gray-700">Share via</span>
              <button onClick={() => setShowFallback(false)} className="text-gray-400 hover:text-gray-600">×</button>
            </div>
            
            <div className="flex items-center justify-between gap-2">
              <a 
                href={`https://wa.me/?text=${encodedTitle}%0A%0A${encodedDesc}%0A%0A${encodedUrl}`} 
                target="_blank" rel="noopener noreferrer"
                className="flex-1 flex flex-col items-center justify-center p-2 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
              >
                <MessageCircle className="h-6 w-6 mb-1" />
                <span className="text-[10px] font-bold">WhatsApp</span>
              </a>
              
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} 
                target="_blank" rel="noopener noreferrer"
                className="flex-1 flex flex-col items-center justify-center p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
              >
                <svg className="h-6 w-6 mb-1 fill-current" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                </svg>
                <span className="text-[10px] font-bold">Facebook</span>
              </a>
              
              <a 
                href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`} 
                target="_blank" rel="noopener noreferrer"
                className="flex-1 flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-100 text-gray-900 transition-colors"
              >
                <svg className="h-6 w-6 mb-1 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="text-[10px] font-bold">X</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
