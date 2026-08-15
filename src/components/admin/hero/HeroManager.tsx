'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  adminAddHeroImages, 
  adminDeleteHeroImage, 
  adminToggleHeroImage, 
  adminReorderHeroImages 
} from '@/features/hero/actions';
import type { HeroImageRow } from '@/features/hero/repository';
import { Trash2, GripVertical, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { ImageUploader, type UploadedImage, type UploadStatus } from '../ImageUploader';

interface HeroManagerProps {
  section: 'home_hero' | 'programmes_hero';
  initialImages: HeroImageRow[];
  title: string;
}

export function HeroManager({ section, initialImages, title }: HeroManagerProps) {
  const [images, setImages] = useState<HeroImageRow[]>(initialImages);
  const [error, setError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
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
      await adminAddHeroImages(section, imageUrls);
      setClearTrigger(prev => prev + 1);
      window.location.reload(); 
    } catch (err: any) {
      setError(err.message || 'Failed to save uploaded images to hero section.');
    }
  };

  const handleDelete = async (id: string, url: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    try {
      await adminDeleteHeroImage(id, url);
      setImages(images.filter(img => img.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete image.');
    }
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      await adminToggleHeroImage(id, !currentStatus);
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
      await adminReorderHeroImages(section, newImages.map(img => img.id));
    } catch (err: any) {
      setError(err.message || 'Failed to reorder.');
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
      await adminReorderHeroImages(section, newImages.map(img => img.id));
    } catch (err: any) {
      setError(err.message || 'Failed to reorder.');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500 mt-1">Manage up to 5 background images for the {title}.</p>
        </div>
        <div className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
          {images.length} / 5 Images
        </div>
      </div>

      <div className="p-6">
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
                className={`flex items-center gap-4 p-3 rounded-xl border ${img.is_active ? 'bg-white border-gray-200 shadow-sm' : 'bg-gray-50 border-gray-200 opacity-75'} transition-all`}
              >
                <div className="flex flex-col gap-1 items-center justify-center text-gray-400">
                  <button 
                    onClick={() => moveUp(index)} 
                    disabled={index === 0}
                    className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ▲
                  </button>
                  <GripVertical className="h-4 w-4" />
                  <button 
                    onClick={() => moveDown(index)} 
                    disabled={index === images.length - 1}
                    className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ▼
                  </button>
                </div>

                <div className="relative h-20 w-32 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200">
                  <Image
                    src={img.image_url}
                    alt="Hero Preview"
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                  {!img.is_active && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <EyeOff className="text-white h-5 w-5 drop-shadow-md" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {img.image_url.split('/').pop()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Added: {new Date(img.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggle(img.id, img.is_active)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      img.is_active 
                        ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {img.is_active ? (
                      <span className="flex items-center gap-1.5"><Eye className="h-4 w-4" /> Active</span>
                    ) : (
                      <span className="flex items-center gap-1.5"><EyeOff className="h-4 w-4" /> Hidden</span>
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleDelete(img.id, img.image_url)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Image"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
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
