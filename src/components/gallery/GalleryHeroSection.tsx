"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import { Container } from "@/components/shared/Container";
import type { AdminPhotoItem } from "@/features/gallery/repository";

interface GalleryHeroSectionProps {
  heroPhotos: AdminPhotoItem[];
}

export function GalleryHeroSection({ heroPhotos }: GalleryHeroSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  // We only enable floating animations after mount to avoid hydration mismatch
  // and safely read window sizes if we need to, though we can use % based CSS.
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!heroPhotos || heroPhotos.length === 0) {
    return (
      <section className="relative w-full overflow-hidden py-10 sm:py-16 bg-white border-b border-soft-border/40 min-h-[40vh] flex items-center justify-center">
         <Container className="relative z-10 text-center">
            <h1 className="font-heading text-3xl sm:text-5xl font-bold text-[#12245F] tracking-tight">
              Stories of Impact
            </h1>
         </Container>
      </section>
    );
  }

  const mainImage = heroPhotos[0];
  const floatingPhotos = heroPhotos.slice(1, 21); // up to 20 thumbnails

  // Predetermined relative positions for up to 20 thumbnails around the center.
  // Using percentages helps keep them responsive and contained.
  // The center is roughly 35% to 65% horizontally, 30% to 70% vertically.
  // We place these items in the outer edges.
  const positions = [
    { top: "5%", left: "5%", scale: 1.1, zIndex: 1 },
    { top: "15%", left: "80%", scale: 0.9, zIndex: 2 },
    { top: "60%", left: "85%", scale: 1.2, zIndex: 1 },
    { top: "80%", left: "10%", scale: 0.85, zIndex: 3 },
    { top: "25%", left: "18%", scale: 1.0, zIndex: 1 },
    { top: "70%", left: "25%", scale: 0.95, zIndex: 2 },
    { top: "10%", left: "65%", scale: 1.15, zIndex: 1 },
    { top: "85%", left: "70%", scale: 0.9, zIndex: 2 },
    { top: "40%", left: "4%", scale: 1.05, zIndex: 1 },
    { top: "45%", left: "88%", scale: 1.1, zIndex: 3 },
    { top: "2%", left: "40%", scale: 0.8, zIndex: 1 },
    { top: "88%", left: "45%", scale: 1.0, zIndex: 2 },
    { top: "35%", left: "28%", scale: 0.85, zIndex: 1 }, // desktop only
    { top: "55%", left: "75%", scale: 0.95, zIndex: 1 }, // desktop only
    { top: "15%", left: "50%", scale: 1.2, zIndex: 1 }, // desktop only
    { top: "75%", left: "55%", scale: 0.9, zIndex: 1 }, // desktop only
    { top: "5%", left: "25%", scale: 1.0, zIndex: 2 }, // desktop only
    { top: "90%", left: "80%", scale: 1.1, zIndex: 1 }, // desktop only
    { top: "25%", left: "90%", scale: 0.85, zIndex: 2 }, // desktop only
    { top: "65%", left: "8%", scale: 0.95, zIndex: 1 }, // desktop only
  ];

  return (
    <section className="relative w-full overflow-hidden py-12 sm:py-16 md:py-24 bg-[#FAFCF8] border-b border-soft-border/40 min-h-[60vh] xl:min-h-[70vh] flex items-center justify-center isolate">
      {/* Subtle Background Glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[50vw] h-[50vw] bg-[#EAF3FF] rounded-full blur-[100px] opacity-40 mix-blend-multiply" />
        <div className="w-[40vw] h-[40vw] bg-[#EEF8E9] rounded-full blur-[100px] opacity-50 mix-blend-multiply -ml-20" />
      </div>

      {/* Optional Minimal Text Overlay behind images */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-10">
        <h2 className="font-heading text-[10vw] sm:text-[8vw] font-black text-[#12245F] whitespace-nowrap tracking-tighter select-none">
          Stories of Impact
        </h2>
      </div>

      <Container className="relative z-10 w-full h-full flex items-center justify-center">
        <div className="relative w-full max-w-7xl aspect-[4/3] sm:aspect-[16/7] flex items-center justify-center">
          
          {/* Main Hero Image */}
          {mainImage?.media?.cdn_url && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-20 w-[55%] sm:w-[40%] md:w-[35%] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5 bg-gray-100"
            >
              <Image
                src={mainImage.media.cdn_url}
                alt={mainImage.media.alt_text || "Featured Gallery Moment"}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 640px) 55vw, 40vw"
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/10 pointer-events-none" />
            </motion.div>
          )}

          {/* Floating Thumbnails */}
          {mounted && floatingPhotos.map((photo, i) => {
            if (!photo.media?.cdn_url || i >= positions.length) return null;
            
            const pos = positions[i];
            
            // Hide thumbnails beyond index 7 on mobile to prevent clutter and overflow
            const isMobileHidden = i > 7;
            
            // Varied animation settings for organic feel
            const duration = 6 + (i % 5) * 1.5; // 6 to 12 seconds
            const delay = (i % 7) * -1.5; // Start at different times
            
            // The first two thumbnails get the subtle bling shimmer
            const hasBling = i === 0 || i === 2;
            
            return (
              <motion.div
                key={photo.id}
                initial={{ 
                  opacity: 0, 
                  scale: pos.scale * 0.8,
                  x: 0,
                  y: 0
                }}
                animate={
                  prefersReducedMotion 
                    ? { opacity: 1, scale: pos.scale }
                    : { 
                        opacity: 1,
                        scale: pos.scale,
                        y: ["-10px", "15px", "-10px"],
                        x: ["-5px", "8px", "-5px"],
                      }
                }
                transition={
                  prefersReducedMotion 
                    ? { duration: 0.8, delay: i * 0.05 }
                    : {
                        opacity: { duration: 0.8, delay: i * 0.05 },
                        scale: { duration: 0.8, delay: i * 0.05 },
                        y: { duration: duration, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay },
                        x: { duration: duration * 1.2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay }
                      }
                }
                className={`absolute w-[20%] sm:w-[13%] md:w-[10%] aspect-[4/3] rounded-xl overflow-hidden shadow-lg ring-1 ring-black/5 bg-gray-100 ${isMobileHidden ? 'hidden sm:block' : 'block'}`}
                style={{ 
                  top: pos.top, 
                  left: pos.left, 
                  zIndex: pos.zIndex 
                }}
              >
                <Image
                  src={photo.media.cdn_url}
                  alt={photo.media.alt_text || "Gallery Moment"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 20vw, 13vw"
                />
                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10 pointer-events-none" />
                
                {/* Subtle Bling / Shimmer Effect */}
                {hasBling && !prefersReducedMotion && (
                  <motion.div 
                    className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
                    animate={{
                      left: ["-150%", "150%"]
                    }}
                    transition={{
                      duration: 3,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatDelay: 8 + i * 2, // shimmer happens rarely
                      delay: i * 3
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export default GalleryHeroSection;
