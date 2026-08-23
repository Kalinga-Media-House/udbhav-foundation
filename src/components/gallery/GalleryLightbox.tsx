'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

import type { AdminPhotoItem } from '@/features/gallery/repository';

interface GalleryLightboxProps {
  photos: AdminPhotoItem[];
  initialIndex: number;
  onClose: () => void;
}

export function GalleryLightbox({ photos, initialIndex, onClose }: GalleryLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);

  const photo = photos[currentIndex];

  const handleNext = useCallback(() => {
    if (currentIndex < photos.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setScale(1);
    }
  }, [currentIndex, photos.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setScale(1);
    }
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, onClose]);

  // Lock body scroll
  useEffect(() => {
    // Save original overflow
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  if (!photo) return null;

  const isFallbackTitle = photo.album?.title?.startsWith('Gallery Upload -');
  let title: string | undefined = photo.caption || undefined;
  if (!title && !isFallbackTitle) title = photo.album?.title || undefined;
  
  const programTitle = photo.album?.program?.title;
  const eventTitle = photo.album?.event?.title;
  const location = photo.location || photo.album?.location;

  const metadataPieces = [programTitle, eventTitle, location].filter(Boolean);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
      >
        {/* Top bar controls */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-[110] pointer-events-none">
          <div className="text-white/80 text-sm font-medium bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md">
            {currentIndex + 1} / {photos.length}
          </div>
          <button 
            onClick={onClose}
            aria-label="Close viewer"
            className="pointer-events-auto p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Previous Button */}
        {currentIndex > 0 && (
          <button 
            onClick={handlePrev}
            aria-label="Previous photo"
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors z-[110] backdrop-blur-md hidden sm:block"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Next Button */}
        {currentIndex < photos.length - 1 && (
          <button 
            onClick={handleNext}
            aria-label="Next photo"
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors z-[110] backdrop-blur-md hidden sm:block"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Main Image Viewer */}
        <div className="w-full h-full flex items-center justify-center relative outline-none">
          <TransformWrapper
            key={currentIndex} // Reset transform on image change
            initialScale={1}
            minScale={1}
            maxScale={4}
            centerZoomedOut={true}
            panning={{ disabled: scale === 1 }} // Allow outer motion.div swipe when scale is 1
            onTransform={(ref: any) => setScale(ref.state.scale)}
            doubleClick={{ disabled: false, mode: 'reset' }}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                <motion.div
                  className="w-full h-full flex items-center justify-center"
                  drag={scale === 1 ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.8}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipeThreshold = 50;
                    if (offset.x > swipeThreshold || velocity.x > 500) {
                      handlePrev();
                    } else if (offset.x < -swipeThreshold || velocity.x < -500) {
                      handleNext();
                    }
                  }}
                >
                  <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full flex items-center justify-center">
                    {photo.media?.cdn_url && (
                      <div className="relative w-full h-full flex items-center justify-center max-w-[100vw] max-h-[100vh] p-4 sm:p-12">
                        <Image
                          src={photo.media.cdn_url}
                          alt={photo.media.alt_text || title || 'Gallery View'}
                          fill
                          className="object-contain pointer-events-none select-none"
                          sizes="100vw"
                          priority
                        />
                      </div>
                    )}
                  </TransformComponent>
                </motion.div>

                {/* Bottom Zoom Controls & Metadata */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-[110] pointer-events-none w-full max-w-lg">
                  {/* Metadata */}
                  {(title || metadataPieces.length > 0) && (
                    <div className="text-center px-4 w-full">
                      {title && <h3 className="text-white font-medium text-base shadow-sm drop-shadow-md truncate">{title}</h3>}
                      {metadataPieces.length > 0 && (
                        <p className="text-white/80 text-sm mt-1 drop-shadow-md truncate">
                          {metadataPieces.join(' • ')}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Zoom controls */}
                  <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-full p-1.5 pointer-events-auto">
                    <button 
                      onClick={() => zoomOut(0.2)}
                      aria-label="Zoom out"
                      className="p-2 hover:bg-white/20 text-white rounded-full transition-colors"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-white/90 text-xs font-medium w-12 text-center select-none">
                      {Math.round(scale * 100)}%
                    </span>
                    <button 
                      onClick={() => zoomIn(0.2)}
                      aria-label="Zoom in"
                      className="p-2 hover:bg-white/20 text-white rounded-full transition-colors"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    {scale > 1 && (
                      <>
                        <div className="w-[1px] h-4 bg-white/20 mx-1" />
                        <button 
                          onClick={() => resetTransform()}
                          aria-label="Reset zoom"
                          className="p-2 hover:bg-white/20 text-white rounded-full transition-colors"
                        >
                          <Maximize className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </TransformWrapper>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
