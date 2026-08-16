"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { RevealCard } from "@/components/shared/RevealCard";
import { AdminPhotoItem } from "@/features/gallery/repository";

interface OurMomentsGallerySectionProps {
  galleryPhotos?: AdminPhotoItem[];
}

// User-specified exact depth values
const DEPTH_SCALES = [1, 0.88, 0.78, 0.65, 0.55];
const DEPTH_OPACITIES = [1, 0.78, 0.55, 0.35, 0];

export function OurMomentsGallerySection({ galleryPhotos = [] }: OurMomentsGallerySectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200);
  const [isMounted, setIsMounted] = useState(false);
  
  // Randomize exactly once after mount to prevent hydration mismatch
  const [randomPhotos, setRandomPhotos] = useState<AdminPhotoItem[]>([]);

  useEffect(() => {
    setIsMounted(true);
    
    // Client-side shuffle to avoid hydration mismatch
    const validPhotos = galleryPhotos.filter(p => p.media?.cdn_url);
    if (validPhotos.length > 0) {
      const shuffled = [...validPhotos].sort(() => 0.5 - Math.random());
      setRandomPhotos(shuffled.slice(0, 15));
    }

    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [galleryPhotos]);

  const total = randomPhotos.length;

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

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  
  // Dynamic horizontal distance between cards
  const baseSpacing = isMobile ? 85 : (isTablet ? 130 : 180);

  // Render a skeleton placeholder that maintains layout height during SSR/hydration
  if (!isMounted || total === 0) {
    return (
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-pure-white via-warm-white to-pure-white py-14 sm:py-16 md:py-20 border-t border-b border-soft-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10 relative z-20">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-udbhav-blue-deep tracking-tight mb-2">
                OUR MOMENTS
              </h2>
              <div aria-hidden="true" className="h-1 w-14 rounded-full bg-impact-green mb-3" />
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-2xl">
                Stories of action, connection and community captured through our journey.
              </p>
            </div>
          </div>
          {total === 0 && isMounted && (
            <div className="w-full text-center py-20 text-text-secondary">
              No moments available yet.
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section 
      aria-labelledby="our-moments-heading"
      className="relative w-full overflow-hidden bg-gradient-to-b from-pure-white via-warm-white to-pure-white py-14 sm:py-16 md:py-20 border-t border-b border-soft-border/40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Eyebrow & Full Gallery Link */}
        <RevealCard
          as="div"
          index={0}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10 relative z-20"
        >
          <div>
            <h2
              id="our-moments-heading"
              className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-udbhav-blue-deep tracking-tight mb-2"
            >
              OUR MOMENTS
            </h2>
            <div
              aria-hidden="true"
              className="h-1 w-14 rounded-full bg-impact-green mb-3"
            />
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-2xl">
              Stories of action, connection and community captured through our
              journey.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 text-sm sm:text-base font-heading font-semibold text-env-green hover:text-impact-green transition-colors py-2 group/link"
            >
              <span>View Full Gallery</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1" />
            </Link>
          </div>
        </RevealCard>

        {/* Carousel Visual Stage */}
        <RevealCard as="div" index={1} className="relative w-full mt-4 sm:mt-8">
          <div 
            className="relative w-full overflow-hidden bg-transparent py-4 md:py-8"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Carousel Track */}
            <div 
              className="relative w-full h-[220px] sm:h-[300px] md:h-[360px] flex items-center justify-center perspective-[1200px]"
              style={{
                WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
                maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)"
              }}
            >
              
              <AnimatePresence initial={false}>
                {randomPhotos.map((photo, i) => {
                  const offset = getOffset(i);
                  const absOffset = Math.abs(offset);
                  const sign = Math.sign(offset);

                  // Limit render distance
                  const visibleRange = isMobile ? 2 : 3;
                  if (absOffset > visibleRange + 1) return null;

                  const scale = DEPTH_SCALES[Math.min(absOffset, 4)];
                  const opacity = absOffset > visibleRange ? 0 : DEPTH_OPACITIES[Math.min(absOffset, 4)];
                  
                  const x = baseSpacing * offset;
                  const zIndex = 50 - absOffset;
                  const blur = absOffset === 0 ? 0 : absOffset * 1.5;
                  
                  const isActive = absOffset === 0;

                  return (
                    <motion.div
                      key={photo.id}
                      className={`absolute rounded-[18px] md:rounded-[22px] overflow-hidden cursor-pointer ${
                        isActive 
                          ? 'ring-1 ring-slate-200 shadow-[0_20px_50px_rgba(15,23,42,0.15)] bg-white' 
                          : 'ring-1 ring-slate-200/40 bg-transparent'
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
                        filter: `blur(${blur}px)`,
                      }}
                      transition={{
                        duration: 0.9,
                        ease: [0.22, 1, 0.36, 1], // cinematic cubic-bezier
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
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button 
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="absolute left-1 sm:left-4 md:left-6 z-50 p-2 sm:p-3 rounded-full bg-white/90 hover:bg-white text-udbhav-blue-deep border border-slate-200/60 backdrop-blur-md transition-all shadow-[0_4px_14px_rgba(15,23,42,0.08)] hover:shadow-[0_6px_20px_rgba(15,23,42,0.12)] hover:scale-105 group"
                aria-label="Previous photo"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              
              <button 
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="absolute right-1 sm:right-4 md:right-6 z-50 p-2 sm:p-3 rounded-full bg-white/90 hover:bg-white text-udbhav-blue-deep border border-slate-200/60 backdrop-blur-md transition-all shadow-[0_4px_14px_rgba(15,23,42,0.08)] hover:shadow-[0_6px_20px_rgba(15,23,42,0.12)] hover:scale-105 group"
                aria-label="Next photo"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>

            {/* Pagination Dots */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6 sm:mt-10 z-50 max-w-[80vw] mx-auto">
              {randomPhotos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === currentIndex 
                      ? "w-6 h-2 bg-impact-green" 
                      : "w-2 h-2 bg-slate-300 hover:bg-slate-400"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </RevealCard>
      </div>
    </section>
  );
}

export default OurMomentsGallerySection;
