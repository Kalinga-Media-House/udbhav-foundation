"use client";

import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

import type { AdminPhotoItem } from "@/features/gallery/repository";

interface GalleryHeroSectionProps {
  heroPhotos: AdminPhotoItem[];
}

export function GalleryHeroSection({ heroPhotos }: GalleryHeroSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Central image state
  const [centerImage, setCenterImage] = useState<AdminPhotoItem | null>(null);

  useEffect(() => {
    setMounted(true);
    if (heroPhotos && heroPhotos.length > 0) {
      setCenterImage(heroPhotos[0]);
    }
  }, [heroPhotos]);

  // Periodically change center image
  useEffect(() => {
    if (!mounted || prefersReducedMotion || !heroPhotos || heroPhotos.length <= 1) return;
    const interval = setInterval(() => {
      const randomPhoto = heroPhotos[Math.floor(Math.random() * heroPhotos.length)];
      setCenterImage(randomPhoto);
    }, 7000); // Change every 7 seconds
    return () => clearInterval(interval);
  }, [mounted, prefersReducedMotion, heroPhotos]);

  // Physics animation loop
  useEffect(() => {
    if (!mounted || prefersReducedMotion || !containerRef.current) return;
    
    let animationFrameId: number;
    const container = containerRef.current;
    
    const isMobile = window.innerWidth < 640;
    const numThumbs = isMobile ? Math.min(8, thumbsRef.current.length) : thumbsRef.current.length;
    
    // Initialize physics state
    const thumbsState = Array.from({ length: numThumbs }).map((_, i) => {
      const angle = (i / numThumbs) * Math.PI * 2 + (Math.random() * 0.5);
      const radius = isMobile ? (80 + Math.random() * 50) : (200 + Math.random() * 150);
      
      const cx = window.innerWidth / 2;
      const cy = (window.innerHeight * 0.7) / 2;
      
      const thumbW = isMobile ? 80 : 120; // approximate initial size for physics bounds
      const thumbH = thumbW * 0.75; 
      
      const maxSpeed = isMobile ? (0.1 + Math.random() * 0.1) : (0.15 + Math.random() * 0.2); // Very slow 5-15 px/s

      return {
        x: cx + Math.cos(angle) * radius - thumbW / 2,
        y: cy + Math.sin(angle) * radius - thumbH / 2,
        vx: (Math.random() - 0.5) * maxSpeed,
        vy: (Math.random() - 0.5) * maxSpeed,
        targetVx: 0,
        targetVy: 0,
        driftVx: (Math.random() - 0.5) * maxSpeed * 0.5,
        driftVy: (Math.random() - 0.5) * maxSpeed * 0.5,
        maxSpeed: maxSpeed,
        preferredRadius: radius,
        rotation: Math.random() * 20 - 10,
        rotV: (Math.random() - 0.5) * 0.05, // slower rotation
        parallaxPhase: Math.random() * Math.PI * 2, // for depth/drift offset
      };
    });

    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min((time - lastTime) / 16.66, 3); // Normalize to ~60fps, cap at 3 frames to avoid huge jumps
      lastTime = time;

      const rect = container.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Dynamic mobile check inside loop for resize tolerance
      const currentIsMobile = rect.width < 640;

      thumbsState.forEach((state, i) => {
         const el = thumbsRef.current[i];
         if (!el) return;

         const thumbWidth = el.offsetWidth;
         const thumbHeight = el.offsetHeight;

         // Vector to center
         let dx = centerX - (state.x + thumbWidth / 2);
         let dy = centerY - (state.y + thumbHeight / 2);
         let dist = Math.sqrt(dx * dx + dy * dy);
         if (dist === 0) dist = 0.001;

         const nx = dx / dist;
         const ny = dy / dist;

         // 1. Calculate base orbital velocity
         const tx = -ny;
         const ty = nx;
         const orbitSpeed = state.maxSpeed * 0.5; // slow orbit
         state.targetVx = tx * orbitSpeed + state.driftVx;
         state.targetVy = ty * orbitSpeed + state.driftVy;

         // 2. Slow drift variance based on time (Parallax/Organic feel)
         state.parallaxPhase += 0.005 * dt;
         state.targetVx += Math.sin(state.parallaxPhase) * state.maxSpeed * 0.2;
         state.targetVy += Math.cos(state.parallaxPhase * 0.8) * state.maxSpeed * 0.2;

         // 3. Gravity to preferred radius
         const radiusDiff = dist - state.preferredRadius;
         state.targetVx += nx * radiusDiff * 0.002;
         state.targetVy += ny * radiusDiff * 0.002;

         // 4. Repulsion from Center Image to prevent overlapping the focal point
         const centerImgRadius = currentIsMobile ? 120 : 180;
         const minCenterDist = centerImgRadius + (thumbWidth / 2) + 20;
           
         if (dist < minCenterDist) {
           const repulsion = (minCenterDist - dist) * 0.01;
           state.targetVx -= nx * repulsion; 
           state.targetVy -= ny * repulsion;
         }

         // 5. Boundary Steering (Smooth collision instead of jerky bounce)
         const margin = currentIsMobile ? 20 : 40;
         const steerStrength = 0.05;
         
         if (state.x < margin) {
            state.targetVx += steerStrength * (margin - state.x);
         } else if (state.x + thumbWidth > rect.width - margin) {
            state.targetVx -= steerStrength * (state.x + thumbWidth - (rect.width - margin));
         }
         
         if (state.y < margin) {
            state.targetVy += steerStrength * (margin - state.y);
         } else if (state.y + thumbHeight > rect.height - margin) {
            state.targetVy -= steerStrength * (state.y + thumbHeight - (rect.height - margin));
         }

         // 6. Smooth Interpolation (gradually adjust current velocity towards target)
         const lerpFactor = 0.02 * dt;
         state.vx += (state.targetVx - state.vx) * lerpFactor;
         state.vy += (state.targetVy - state.vy) * lerpFactor;

         // Apply velocity
         state.x += state.vx * dt;
         state.y += state.vy * dt;
         
         // Slow rotation
         state.rotation += state.rotV * dt;

         // Hard boundary enforcement just in case steering isn't fast enough
         if (state.x < 0) { state.x = 0; state.vx *= -0.5; }
         if (state.x + thumbWidth > rect.width) { state.x = rect.width - thumbWidth; state.vx *= -0.5; }
         if (state.y < 0) { state.y = 0; state.vy *= -0.5; }
         if (state.y + thumbHeight > rect.height) { state.y = rect.height - thumbHeight; state.vy *= -0.5; }

         // Apply transform directly to DOM for 60fps performance without React renders
         el.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) rotate(${state.rotation}deg)`;
      });

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animationFrameId);
  }, [mounted, prefersReducedMotion]);

  // Filter out any items without a valid cdn_url
  const validPhotos = heroPhotos.filter((p) => p.media?.cdn_url);

  if (!validPhotos || validPhotos.length === 0) {
    return null;
  }

  // Slice up to 20 images for the floating thumbnails.
  // We use images 1 through 21 to give maximum variety, leaving 0 for the initial center.
  const floatingPhotos = validPhotos.slice(1, 21);

  return (
    <section 
      ref={containerRef}
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#061A3A] via-[#08265A] to-[#0B2E63] min-h-[70vh] sm:min-h-[75vh] flex items-center justify-center isolate"
    >
      {/* Subtle Premium Background Glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-[#1a4a9c] rounded-full blur-[120px] opacity-20 mix-blend-screen" />
      </div>

      {/* Floating Thumbnails Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {mounted && floatingPhotos.map((photo, i) => {
          const isMobileHidden = i > 9;

          // Static fallback layout for reduced motion
          const staticAngle = (i / floatingPhotos.length) * Math.PI * 2;
          const staticStyles = prefersReducedMotion ? {
            top: `calc(50% + ${Math.sin(staticAngle) * 35}% - 6%)`,
            left: `calc(50% + ${Math.cos(staticAngle) * 35}% - 6%)`,
            transform: `rotate(${(i % 5) * 5 - 10}deg)`,
            opacity: 0.8
          } : { top: 0, left: 0 }; // Physics loop handles positions if motion enabled

          return (
            <div
              key={`thumb-${photo.id}`}
              ref={(el) => { 
                if (el) thumbsRef.current[i] = el; 
              }}
              className={`absolute w-[clamp(60px,9vw,140px)] aspect-[4/3] rounded-xl overflow-hidden shadow-[0_2px_15px_rgba(0,0,0,0.2)] ring-1 ring-white/10 bg-[#061A3A] will-change-transform ${isMobileHidden ? 'hidden sm:block' : 'block'}`}
              style={staticStyles}
            >
              {photo.media?.cdn_url && (
                <Image
                  src={photo.media.cdn_url}
                  alt={photo.media.alt_text || "Gallery Moment"}
                  fill
                  className="object-cover opacity-90 transition-opacity"
                  sizes="(max-width: 640px) 90px, 140px"
                />
              )}
              <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10 pointer-events-none" />
            </div>
          );
        })}
      </div>

      {/* Central Focal Image */}
      <div className="relative z-30 flex items-center justify-center pointer-events-none w-full h-full px-4">
        <motion.div 
          className="relative w-[clamp(190px,28vw,360px)] aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(70,130,255,0.18),0_20px_50px_rgba(0,0,0,0.25)] ring-1 ring-white/20 bg-[#061A3A] pointer-events-auto"
          animate={prefersReducedMotion ? {} : {
            y: [0, -8, 0],
            scale: [1, 1.015, 1],
            rotate: [-0.3, 0.3, -0.3],
          }}
          transition={prefersReducedMotion ? {} : {
            duration: 8,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop"
          }}
        >
          <AnimatePresence mode="wait">
            {centerImage?.media?.cdn_url && (
              <motion.div
                key={centerImage.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={centerImage.media.cdn_url}
                  alt={centerImage.media.alt_text || "Featured Gallery Moment"}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 640px) 240px, 360px"
                />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}

export default GalleryHeroSection;
