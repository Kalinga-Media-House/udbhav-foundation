"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { AdminPhotoItem } from "@/features/gallery/repository";

interface GalleryHeroSectionProps {
  heroPhotos: AdminPhotoItem[];
}

// User-specified exact depth values
const DEPTH_SCALES = [1, 0.88, 0.78, 0.65, 0.55];
const DEPTH_OPACITIES = [1, 0.78, 0.55, 0.35, 0];

const GalleryHeroSection = ({ heroPhotos }: GalleryHeroSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200);
  const [isMounted, setIsMounted] = useState(false);

  const validPhotos = heroPhotos.filter((p) => p.media?.cdn_url);
  const total = validPhotos.length;

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (isHovered || total === 0) return;
    const timer = setInterval(() => {
      handleNext();
    }, 3800);
    return () => clearInterval(timer);
  }, [isHovered, handleNext, total]);

  const getOffset = (i: number) => {
    let offset = (i - currentIndex) % total;
    if (offset > Math.floor(total / 2)) offset -= total;
    if (offset < -Math.ceil(total / 2)) offset += total;
    return offset;
  };

  if (total === 0) return null;

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  
  // Dynamic horizontal distance between cards
  const baseSpacing = isMobile ? 85 : (isTablet ? 130 : 180);

  return (
    <section 
      className="relative w-full overflow-hidden bg-[#061A3A] min-h-[clamp(330px,50vh,480px)] flex items-center justify-center isolate py-8 md:py-12"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Premium Background Glows */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="absolute w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-[#1a4a9c] rounded-full blur-[130px] opacity-[0.25] mix-blend-screen" />
        <div className="absolute w-[400px] h-[400px] bg-cyan-400 rounded-full blur-[160px] opacity-[0.1]" />
      </div>

      <div className="relative w-full max-w-7xl mx-auto flex flex-col items-center justify-center h-full">
        
        {/* Carousel Track */}
        <div className="relative w-full h-[220px] sm:h-[300px] md:h-[360px] flex items-center justify-center perspective-[1200px]">
          
          <AnimatePresence initial={false}>
            {isMounted && validPhotos.map((photo, i) => {
              const offset = getOffset(i);
              const absOffset = Math.abs(offset);
              const sign = Math.sign(offset);

              // Limit render distance for performance and visual cleanup
              const visibleRange = isMobile ? 2 : 3;
              if (absOffset > visibleRange + 1) return null;

              // Use requested scale and opacity arrays
              const scale = DEPTH_SCALES[Math.min(absOffset, 4)];
              const opacity = absOffset > visibleRange ? 0 : DEPTH_OPACITIES[Math.min(absOffset, 4)];
              
              const x = baseSpacing * offset;
              const zIndex = 50 - absOffset;
              const blur = absOffset === 0 ? 0 : absOffset * 1.5;
              const brightness = absOffset === 0 ? 1 : 1 - (absOffset * 0.15);
              
              const isActive = absOffset === 0;

              return (
                <motion.div
                  key={photo.id}
                  className={`absolute rounded-[18px] md:rounded-[22px] overflow-hidden cursor-pointer ${
                    isActive 
                      ? 'ring-1 ring-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_40px_rgba(34,211,238,0.15)]' 
                      : 'ring-1 ring-white/10 shadow-xl'
                  }`}
                  style={{
                    width: isMobile ? "260px" : (isTablet ? "360px" : "480px"),
                    height: isMobile ? "180px" : (isTablet ? "250px" : "320px"),
                    originX: 0.5,
                    originY: 0.5,
                  }}
                  animate={{
                    x,
                    scale,
                    opacity,
                    zIndex,
                    filter: `brightness(${brightness}) blur(${blur}px)`,
                  }}
                  transition={{
                    duration: 0.9,
                    ease: [0.22, 1, 0.36, 1], // cinematic cubic-bezier as requested
                  }}
                  onClick={() => {
                    if (!isActive) {
                       if (offset > 0) handleNext();
                       else handlePrev();
                    }
                  }}
                  drag={isActive ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(e, { offset: dragOffset }) => {
                    const swipeThreshold = 40;
                    if (dragOffset.x > swipeThreshold) handlePrev();
                    else if (dragOffset.x < -swipeThreshold) handleNext();
                  }}
                >
                  <Image
                    src={photo.media?.cdn_url || ""}
                    alt={photo.media?.alt_text || "Gallery image"}
                    fill
                    className="object-cover pointer-events-none"
                    sizes="(max-width: 640px) 260px, (max-width: 1024px) 360px, 480px"
                    priority={isActive || absOffset === 1}
                  />
                  {!isActive && <div className="absolute inset-0 bg-black/10 pointer-events-none transition-opacity duration-700" />}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button 
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            className="absolute left-3 sm:left-8 md:left-12 z-50 p-2 sm:p-3 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-all ring-1 ring-white/20 hover:scale-110 shadow-lg group"
            aria-label="Previous photo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className="absolute right-3 sm:right-8 md:right-12 z-50 p-2 sm:p-3 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-all ring-1 ring-white/20 hover:scale-110 shadow-lg group"
            aria-label="Next photo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform"><path d="m9 18 6-6-6-6"/></svg>
          </button>

        </div>

        {/* Pagination Dots */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6 sm:mt-10 z-50 max-w-[80vw]">
          {isMounted && validPhotos.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`rounded-full transition-all duration-300 ${
                i === currentIndex 
                  ? "w-6 h-2 bg-white ring-1 ring-white/50" 
                  : "w-2 h-2 bg-white/30 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export { GalleryHeroSection };
