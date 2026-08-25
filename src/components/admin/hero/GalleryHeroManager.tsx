'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import React, { useState, useTransition } from 'react';

import { updateSettingByKey } from '@/features/system_settings/actions';
import { ImageUploader } from '../ImageUploader';

interface GalleryHeroManagerProps {
  initialImage: string | null;
}

export function GalleryHeroManager({ initialImage }: GalleryHeroManagerProps) {
  const [image, setImage] = useState<string | null>(initialImage);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [clearTrigger, setClearTrigger] = useState(0);

  const handleUploadComplete = async (result: any) => {
    const resultsArray = Array.isArray(result) ? result : [result];
    const imageUrl = resultsArray[0]?.cdnUrl || resultsArray[0]?.url;

    if (!imageUrl) {
      setError('Failed to get uploaded image URL.');
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        const res = await updateSettingByKey('gallery_hero_background_image', `"${imageUrl}"`);
        if (res.error) {
          setError(res.error);
          return;
        }
        setImage(imageUrl);
        setClearTrigger(prev => prev + 1);
      } catch (err: any) {
        setError(err.message || 'Failed to save uploaded image to settings.');
      }
    });
  };

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    setError(null);
    startTransition(async () => {
      try {
        const res = await updateSettingByKey('gallery_hero_background_image', `""`);
        if (res.error) {
          setError(res.error);
          return;
        }
        setImage(null);
      } catch (err: any) {
        setError(err.message || 'Failed to delete image.');
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
      <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gray-50/50">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Gallery Page Hero</h2>
          <p className="text-sm text-gray-500 mt-1">Manage the background image for the Gallery page Hero section.</p>
        </div>
      </div>

      <div className="p-4 md:p-6">
        {error && (
          <div className="mb-4 p-4 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100 flex items-center justify-between">
            {error}
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">×</button>
          </div>
        )}

        {isPending && (
          <div className="mb-4 p-4 rounded-lg bg-blue-50 text-blue-600 text-sm font-medium border border-blue-100 flex items-center justify-between">
            Saving changes...
          </div>
        )}

        <div className="space-y-3 mb-6">
          <AnimatePresence>
            {!image && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200"
              >
                No image uploaded yet.
              </motion.div>
            )}
            {image && (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`flex flex-row items-stretch md:items-center gap-2 md:gap-4 p-2.5 md:p-3 rounded-xl border bg-white border-gray-200 shadow-sm transition-all`}
              >
                <div className="relative w-[100px] sm:w-[120px] md:w-32 rounded-lg overflow-hidden shrink-0 bg-gray-100 border border-gray-200 flex flex-col justify-center">
                  <div className="relative w-full aspect-[16/9] md:h-20 md:aspect-auto">
                    <Image
                      src={image}
                      alt="Hero Preview"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 120px, 128px"
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between flex-1 min-w-0 gap-2 md:gap-4 py-0.5">
                  <div className="flex flex-col min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {image.split('/').pop() || 'gallery_hero_background'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-auto md:mt-0">
                    <button
                      onClick={handleDelete}
                      disabled={isPending}
                      className="p-1.5 md:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Remove Image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!image && (
          <div className="mt-8 border-t border-gray-100 pt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Upload New Image</h3>
            <ImageUploader 
              folder="settings" 
              multiple={false} 
              onUploadComplete={handleUploadComplete} 
              clearSuccessfulTrigger={clearTrigger}
            />
          </div>
        )}
      </div>
    </div>
  );
}
