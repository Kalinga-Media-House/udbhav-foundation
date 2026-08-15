'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  adminUploadHeroImage, 
  adminDeleteHeroImage, 
  adminToggleHeroImage, 
  adminReorderHeroImages 
} from '@/features/hero/actions';
import type { HeroImageRow } from '@/features/hero/repository';
import { Trash2, GripVertical, Eye, EyeOff, Plus, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface HeroManagerProps {
  section: 'home_hero' | 'programmes_hero';
  initialImages: HeroImageRow[];
  title: string;
}

export function HeroManager({ section, initialImages, title }: HeroManagerProps) {
  const [images, setImages] = useState<HeroImageRow[]>(initialImages);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setError(null);
    setIsUploading(true);
    
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 5) {
      setError(`You can only have up to 5 images. You are trying to upload ${files.length} but only have space for ${5 - images.length}.`);
      setIsUploading(false);
      return;
    }

    try {
      for (const file of files) {
        await adminUploadHeroImage(section, file);
      }
      // Usually we'd refetch from server via server action passing the new data, 
      // but a page refresh/revalidate will handle hydrating updated props in the parent component.
      // We rely on the parent page passing updated `initialImages` when revalidated.
      window.location.reload(); 
    } catch (err: any) {
      setError(err.message || 'Failed to upload image.');
    } finally {
      setIsUploading(false);
      // reset file input
      e.target.value = '';
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
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              disabled={isUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
              title="Upload Images"
            />
            <div className={`flex flex-col items-center justify-center py-8 rounded-xl border-2 border-dashed transition-colors ${
              isUploading ? 'bg-gray-50 border-gray-300' : 'bg-gray-50/50 border-gray-300 hover:border-[#233A8B]/50 hover:bg-blue-50/30'
            }`}>
              {isUploading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-6 w-6 text-[#233A8B] animate-spin" />
                  <p className="text-sm font-medium text-gray-600">Uploading...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 text-center px-4">
                  <div className="h-10 w-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center">
                    <Plus className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Click or drag images to upload</p>
                    <p className="text-xs text-gray-500 mt-1">Up to {5 - images.length} more images allowed (JPEG, PNG, WebP)</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
