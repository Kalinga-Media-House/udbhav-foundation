"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Clock,
  Camera,
  FolderOpen,
} from "lucide-react";
import { GalleryPhoto } from "@/types/gallery";

interface GalleryLightboxModalProps {
  photos: GalleryPhoto[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export function GalleryLightboxModal({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}: GalleryLightboxModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);
  const [touchDeltaX, setTouchDeltaX] = useState<number>(0);

  const photo = photos[currentIndex];

  useEffect(() => {
    if (!isOpen) return;

    // Lock page scroll
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus modal for keyboard accessibility
    if (modalRef.current) {
      modalRef.current.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        onNavigate((currentIndex - 1 + photos.length) % photos.length);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onNavigate((currentIndex + 1) % photos.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, currentIndex, photos.length, onClose, onNavigate]);

  if (!isOpen || !photo) return null;

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = e.touches[0].clientX;
    setTouchDeltaX(0);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartXRef.current === null) return;
    const currentX = e.touches[0].clientX;
    setTouchDeltaX(currentX - touchStartXRef.current);
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null) return;
    if (touchDeltaX < -50) {
      // Swipe left -> Next
      onNavigate((currentIndex + 1) % photos.length);
    } else if (touchDeltaX > 50) {
      // Swipe right -> Previous
      onNavigate((currentIndex - 1 + photos.length) % photos.length);
    }
    touchStartXRef.current = null;
    setTouchDeltaX(0);
  };

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo details: ${photo.title}`}
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 outline-none animate-in fade-in duration-200"
    >
      {/* Top Bar Controls */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 sm:px-6 py-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-2 text-sm sm:text-base font-heading font-medium text-white/90">
          <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm font-semibold tracking-wide">
            {currentIndex + 1} / {photos.length}
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close photo details lightbox"
          className="p-2.5 sm:p-3 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors duration-200 cursor-pointer"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Main Lightbox Content Area */}
      <div
        className="w-full h-full flex flex-col lg:flex-row items-center justify-center pt-16 pb-6 px-3 sm:px-8 lg:px-12 gap-6 max-h-screen overflow-y-auto lg:overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Previous Button (Desktop) */}
        {photos.length > 1 && (
          <button
            type="button"
            onClick={() =>
              onNavigate((currentIndex - 1 + photos.length) % photos.length)
            }
            aria-label="Previous photo"
            className="hidden lg:flex p-3 rounded-full bg-white/15 hover:bg-white/25 text-white transition-all duration-200 cursor-pointer shrink-0"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
        )}

        {/* High-Resolution Photo Display */}
        <div className="relative flex-1 w-full h-[48vh] sm:h-[55vh] lg:h-[82vh] flex items-center justify-center">
          <div className="relative w-full h-full max-w-5xl rounded-2xl overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center">
            <Image
              src={photo.imageUrl}
              alt={photo.altText}
              fill
              sizes="(max-width: 1024px) 100vw, 75vw"
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Information Panel (Right side on Desktop, Below photo on Mobile) */}
        <div className="w-full lg:w-[380px] xl:w-[420px] bg-[#12245F]/90 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-white/15 text-white shadow-2xl shrink-0 space-y-4 max-h-[42vh] lg:max-h-[82vh] overflow-y-auto">
          {/* Programme Badge */}
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-bold uppercase tracking-wider"
              style={{ background: "#439B25", color: "#FFFFFF" }}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              {photo.programme.title}
            </span>
          </div>

          {/* Photo Title */}
          <h2 className="font-heading text-lg sm:text-xl font-bold text-white leading-snug">
            {photo.title}
          </h2>

          {/* Event & Location Meta */}
          <div className="space-y-2.5 pt-2 border-t border-white/15 text-xs sm:text-sm text-white/85">
            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-[#439B25] shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-white">Event</div>
                <div>{photo.event.title}</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#439B25] shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-white">Location</div>
                <div>{photo.event.location}</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-[#439B25] shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-white">Date & Time</div>
                <div>
                  {photo.event.eventDate}
                  {photo.event.startTime ? ` • ${photo.event.startTime}` : ""}
                </div>
              </div>
            </div>

            {photo.photographerName && (
              <div className="flex items-start gap-2.5">
                <Camera className="w-4 h-4 text-[#439B25] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Photographer</div>
                  <div>{photo.photographerName}</div>
                </div>
              </div>
            )}
          </div>

          {/* Caption / Description */}
          {photo.caption && (
            <div className="pt-3 border-t border-white/15">
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed italic">
                “{photo.caption}”
              </p>
            </div>
          )}

          {/* Mobile Bottom Navigation Controls */}
          {photos.length > 1 && (
            <div className="flex lg:hidden items-center justify-between pt-4 border-t border-white/15">
              <button
                type="button"
                onClick={() =>
                  onNavigate((currentIndex - 1 + photos.length) % photos.length)
                }
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/15 text-sm font-semibold text-white hover:bg-white/25 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                type="button"
                onClick={() =>
                  onNavigate((currentIndex + 1) % photos.length)
                }
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/15 text-sm font-semibold text-white hover:bg-white/25 transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Next Button (Desktop) */}
        {photos.length > 1 && (
          <button
            type="button"
            onClick={() => onNavigate((currentIndex + 1) % photos.length)}
            aria-label="Next photo"
            className="hidden lg:flex p-3 rounded-full bg-white/15 hover:bg-white/25 text-white transition-all duration-200 cursor-pointer shrink-0"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        )}
      </div>
    </div>
  );
}

export default GalleryLightboxModal;
