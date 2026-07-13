"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import {
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Clock,
  Camera,
} from "lucide-react";
import { ProgrammePhotoItem } from "@/types/index-programme";

interface AccessibleLightboxProps {
  photos: ProgrammePhotoItem[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export function AccessibleLightbox({
  photos,
  initialIndex,
  isOpen,
  onClose,
}: AccessibleLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [prevInitialIndex, setPrevInitialIndex] = useState<number>(initialIndex);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  if (initialIndex !== prevInitialIndex) {
    setPrevInitialIndex(initialIndex);
    setCurrentIndex(initialIndex);
  }

  const handleNext = useCallback(() => {
    if (photos.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const handlePrevious = useCallback(() => {
    if (photos.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  // Handle keyboard events & focus restoration
  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement;
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose, handleNext, handlePrevious]);

  // Touch swipe navigation handlers for mobile
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrevious();
    }
  };

  if (!isOpen || photos.length === 0) return null;

  const photo = photos[currentIndex];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Programme photo lightbox"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-6 md:p-10"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEndHandler}
    >
      {/* Top Controls Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white/80 z-20">
        <div className="text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full bg-white/10 border border-white/20">
          Photo {currentIndex + 1} of {photos.length}
        </div>

        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close photo lightbox"
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation Arrow Previous */}
      {photos.length > 1 && (
        <button
          type="button"
          onClick={handlePrevious}
          aria-label="Previous photo"
          className="absolute left-4 z-20 p-3 rounded-full bg-black/50 hover:bg-white/20 text-white border border-white/15 transition-all cursor-pointer hidden sm:flex items-center justify-center"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Main Image Frame */}
      <div className="relative w-full max-w-5xl h-[60vh] sm:h-[70vh] flex items-center justify-center">
        <Image
          src={photo.imageUrl}
          alt={photo.altText}
          fill
          sizes="100vw"
          className="object-contain"
          priority
        />
      </div>

      {/* Navigation Arrow Next */}
      {photos.length > 1 && (
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next photo"
          className="absolute right-4 z-20 p-3 rounded-full bg-black/50 hover:bg-white/20 text-white border border-white/15 transition-all cursor-pointer hidden sm:flex items-center justify-center"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Bottom Metadata Panel */}
      <div className="absolute bottom-4 left-4 right-4 max-w-3xl mx-auto rounded-2xl bg-black/80 border border-white/15 p-4 sm:p-5 text-white backdrop-blur-md z-20">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#3C9D23] text-white">
            Programme Photo
          </span>
          <span className="text-xs text-white/70 truncate">
            {photo.programmeSlug}
          </span>
        </div>

        <h3 className="font-heading font-bold text-base sm:text-lg text-white mb-1">
          {photo.title}
        </h3>

        {photo.description && (
          <p className="text-xs sm:text-sm text-white/80 line-clamp-2 mb-3">
            {photo.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-xs text-white/70 border-t border-white/10 pt-2.5">
          {photo.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#3C9D23]" />
              {photo.location}
            </span>
          )}

          {photo.photoDate && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#3C9D23]" />
              {photo.photoDate}
            </span>
          )}

          {photo.photoTime && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#3C9D23]" />
              {photo.photoTime}
            </span>
          )}

          {photo.photographerName && (
            <span className="flex items-center gap-1">
              <Camera className="w-3.5 h-3.5 text-[#3C9D23]" />
              {photo.photographerName}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
