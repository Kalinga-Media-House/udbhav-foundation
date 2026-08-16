'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect, useCallback } from 'react';
import type { HeroImageRow } from '@/features/hero/repository';

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, mass: 0.8, damping: 20 } },
};

const STAGGER = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};



export function IndexHeroSection({ heroImages }: { heroImages?: HeroImageRow[] }) {
  const [isMounted, setIsMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHoverPaused, setIsHoverPaused] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);

  // Fallback to static image if none uploaded
  const images = heroImages && heroImages.length > 0 
    ? heroImages.map(img => img.image_url) 
    : ['/hero/hero-01.png'];
  const totalSlides = images.length;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleVisibility = () => setIsTabHidden(document.hidden);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const goToNextSlide = useCallback(() => {
    setCurrentIndex((prev) => (totalSlides > 0 ? (prev + 1) % totalSlides : 0));
  }, [totalSlides]);

  const goToPrevSlide = useCallback(() => {
    setCurrentIndex((prev) => (totalSlides > 0 ? (prev - 1 + totalSlides) % totalSlides : 0));
  }, [totalSlides]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    if (isHoverPaused || isTabHidden || totalSlides <= 1) return;
    const interval = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 6000);
    return () => clearInterval(interval);
  }, [isHoverPaused, isTabHidden, totalSlides]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      aria-label="Programmes and Initiatives Hero"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsHoverPaused(true)}
      onMouseLeave={() => setIsHoverPaused(false)}
      onFocusCapture={() => setIsHoverPaused(true)}
      onBlurCapture={() => setIsHoverPaused(false)}
      className="relative min-h-[85vh] w-full flex items-center justify-center overflow-hidden bg-white"
    >
      {/* Dynamic Background Image Slider with Ken Burns effect */}
      <div className="absolute inset-0 z-0 bg-black">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1, ease: 'easeInOut' },
              scale: { duration: 6, ease: 'linear' },
            }}
            className="absolute inset-0"
          >
            <Image
              src={images[currentIndex]}
              alt="UDBHAV Foundation Programmes"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8 flex flex-col items-center text-center justify-center">
        <motion.div
          variants={STAGGER}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center max-w-4xl w-full"
        >
          <motion.div variants={FADE_UP} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto z-30">
            <button
              type="button"
              onClick={() => scrollToSection('programmes')}
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#233A8B] px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#1a2b6c] hover:shadow-xl sm:w-auto"
            >
              Explore Programmes
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            <Link
              href="/volunteers"
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-[#233A8B] shadow-sm ring-1 ring-inset ring-[#233A8B]/20 transition-all hover:-translate-y-0.5 hover:bg-[#FAFBFC] hover:shadow-md sm:w-auto"
            >
              Become a Volunteer
            </Link>
          </motion.div>
        </motion.div>
      </div>


      {/* Left/Right Navigation Controls */}
      {totalSlides > 1 && (
        <>
          <button
            type="button"
            onClick={goToPrevSlide}
            aria-label="Previous hero image"
            className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 hover:bg-black/50 border border-white/20 text-white backdrop-blur-sm transition-all focus-visible:outline-2 focus-visible:outline-white shadow-md"
          >
            <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>

          <button
            type="button"
            onClick={goToNextSlide}
            aria-label="Next hero image"
            className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 hover:bg-black/50 border border-white/20 text-white backdrop-blur-sm transition-all focus-visible:outline-2 focus-visible:outline-white shadow-md"
          >
            <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>
        </>
      )}

      {/* Bottom Bar: Slide Indicators */}
      {totalSlides > 1 && (
        <div className="absolute bottom-6 sm:bottom-8 inset-x-0 z-30 flex justify-center">
          <div role="tablist" aria-label="Hero slides" className="flex items-center gap-2 sm:gap-2.5">
            {images.map((_, index) => {
              const isActive = index === currentIndex;
              return (
                <button
                  key={index}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Go to hero image ${index + 1}`}
                  onClick={() => goToSlide(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-white shadow-md ${
                    isActive
                      ? "w-8 sm:w-10 bg-white"
                      : "w-2.5 sm:w-3 bg-white/50 hover:bg-white/80"
                  }`}
                />
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
