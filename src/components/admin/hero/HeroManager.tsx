'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, GripVertical, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

import { 
  adminAddHeroImages, 
  adminDeleteHeroImage, 
  adminToggleHeroImage, 
  adminReorderHeroImages 
} from '@/features/hero/actions';
import type { HeroImageRow } from '@/features/hero/repository';

import { ImageUploader, type UploadedImage } from '../ImageUploader';

interface HeroManagerProps {
  section: 'home_hero' | 'programmes_hero';
  initialImages: HeroImageRow[];
  title: string;
}

export function HeroManager({ section, initialImages, title }: HeroManagerProps) {
  const [images, setImages] = useState<HeroImageRow[]>(initialImages);
  const [error, setError] = useState<string | null>(null);

  const [clearTrigger, setClearTrigger] = useState(0);

  const handleUploadComplete = async (result: UploadedImage | UploadedImage[]) => {
    const resultsArray = Array.isArray(result) ? result : [result];
    const imageUrls = resultsArray.map(r => r.cdnUrl);

    if (images.length + imageUrls.length > 5) {
      setError(`You can only have up to 5 images. You uploaded ${imageUrls.length} but only have space for ${5 - images.length}.`);
      return;
    }

    setError(null);

    try {
      const res = await adminAddHeroImages(section, imageUrls);
      if (res.error) {
        setError(res.error);
        return;
      }
      setClearTrigger(prev => prev + 1);
      window.location.reload(); 
    } catch (err: any) {
      setError(err.message || 'Failed to save uploaded images to hero section.');
    }
  };

  const handleDelete = async (id: string, url: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    try {
      const res = await adminDeleteHeroImage(id, url);
      if (res.error) {
        setError(res.error);
        return;
      }
      setImages(images.filter(img => img.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete image.');
    }
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      const res = await adminToggleHeroImage(id, !currentStatus);
      if (res.error) {
        setError(res.error);
        return;
      }
      setImages(images.map(img => img.id === id ? { ...img, is_active: !currentStatus } : img));
    } catch (err: any) {
      setError(err.message || 'Failed to toggle status.');
    }
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const newImages = [...images];
    const temp = newImages[index];
    newImages[index] = newImages[index - 1];
    newImages[index - 1] = temp;
    setImages(newImages);

    try {
      const res = await adminReorderHeroImages(section, newImages.map(img => img.id));
      if (res.error) {
        setError(res.error);
        // Revert visually if failed
        setImages(images);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to reorder.');
      setImages(images);
    }
  };

  const moveDown = async (index: number) => {
    if (index === images.length - 1) return;
    const newImages = [...images];
    const temp = newImages[index];
    newImages[index] = newImages[index + 1];
    newImages[index + 1] = temp;
    setImages(newImages);

    try {
      const res = await adminReorderHeroImages(section, newImages.map(img => img.id));
      if (res.error) {
        setError(res.error);
        setImages(images);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to reorder.');
      setImages(images);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
      <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gray-50/50">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500 mt-1">Manage up to 5 background images for the {title}.</p>
        </div>
        <div className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm self-start md:self-auto shrink-0">
          {images.length} / 5 Images
        </div>
      </div>

      <div className="p-4 md:p-6">
        {error && (
          <div className="mb-4 p-4 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100 flex items-center justify-between">
            {error}
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">×</button>
          </div>
        )}

        <div className="space-y-3 mb-6">
          <AnimatePresence>
            {images.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200"
              >
                No images uploaded yet.
              </motion.div>
            )}
            {images.map((img, index) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`flex flex-row items-stretch md:items-center gap-2 md:gap-4 p-2.5 md:p-3 rounded-xl border ${img.is_active ? 'bg-white border-gray-200 shadow-sm' : 'bg-gray-50 border-gray-200 opacity-75'} transition-all`}
              >
                <div className="flex flex-col gap-1 items-center justify-center text-gray-400 shrink-0">
                  <button 
                    onClick={() => moveUp(index)} 
                    disabled={index === 0}
                    className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ▲
                  </button>
                  <GripVertical className="h-4 w-4 hidden md:block" />
                  <button 
                    onClick={() => moveDown(index)} 
                    disabled={index === images.length - 1}
                    className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ▼
                  </button>
                </div>

                <div className="relative w-[100px] sm:w-[120px] md:w-32 rounded-lg overflow-hidden shrink-0 bg-gray-100 border border-gray-200 flex flex-col justify-center">
                  <div className="relative w-full aspect-[16/9] md:h-20 md:aspect-auto">
                    <Image
                      src={img.image_url}
                      alt="Hero Preview"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 120px, 128px"
                    />
                    {!img.is_active && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <EyeOff className="text-white h-4 w-4 md:h-5 md:w-5 drop-shadow-md" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between flex-1 min-w-0 gap-2 md:gap-4 py-0.5">
                  <div className="flex flex-col min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {img.image_url.split('/').pop()}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Added: {new Date(img.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-auto md:mt-0">
                    <button
                      onClick={() => handleToggle(img.id, img.is_active)}
                      className={`px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors ${
                        img.is_active 
                          ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {img.is_active ? (
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3 md:h-4 md:w-4" /> Active</span>
                      ) : (
                        <span className="flex items-center gap-1"><EyeOff className="h-3 w-3 md:h-4 md:w-4" /> Hidden</span>
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleDelete(img.id, img.image_url)}
                      className="p-1.5 md:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

    {images.length < 5 && (
          <div className="mt-8 border-t border-gray-100 pt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Upload New Images</h3>
            <ImageUploader 
              folder="hero-images" 
              multiple={true} 
              maxFiles={5 - images.length}
              onUploadComplete={handleUploadComplete} 
              onStatusChange={setUploadStatus} 
              clearSuccessfulTrigger={clearTrigger}
            />
          </div>
        )}
      </div>
    </div>
  );
}
