"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Database } from "@/types/supabase";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import { AdminPhotoItem } from "@/features/gallery/repository";

interface GalleryHeroSectionProps {
  heroPhotos: AdminPhotoItem[];
}

type PhotoPlacement = {
  id: string;
  photo: AdminPhotoItem;
  xPct: number;
  yPct: number;
  size: number;
  rotation: number;
  floatDuration: number;
  floatDelay: number;
  blinkDuration: number;
  blinkDelay: number;
};

const GalleryHeroSection = ({ heroPhotos }: GalleryHeroSectionProps) => {
  const containerRef = useRef<HTMLElement>(null);
  const [placements, setPlacements] = useState<PhotoPlacement[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Filter out any items without a valid cdn_url
  const validPhotos = heroPhotos.filter((p) => p.media?.cdn_url);

  useEffect(() => {
    if (isInitialized || !containerRef.current || validPhotos.length === 0) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const isMobile = width < 640;
    const isTablet = width >= 640 && width < 1024;
    
    // Determine count based on breakpoint
    let count = isMobile ? Math.floor(Math.random() * 5) + 8 : (isTablet ? Math.floor(Math.random() * 7) + 10 : Math.floor(Math.random() * 7) + 14);
    count = Math.min(count, validPhotos.length);

    const generatedPlacements: PhotoPlacement[] = [];
    const padding = 20;

    for (let i = 0; i < count; i++) {
       let size;
       if (isMobile) size = 55 + Math.random() * 40; // 55 to 95
       else if (isTablet) size = 70 + Math.random() * 55; // 70 to 125
       else size = 80 + Math.random() * 75; // 80 to 155
       
       let x = 0, y = 0;
       let overlap = true;
       let attempts = 0;
       
       while (overlap && attempts < 50) {
           x = padding + Math.random() * (width - size - padding * 2);
           y = padding + Math.random() * (height - size * 0.75 - padding * 2);
           
           // Check overlap
           overlap = false;
           for (const p of generatedPlacements) {
               // Use pixel values for overlap check
               const px = (p.xPct / 100) * width;
               const py = (p.yPct / 100) * height;
               
               const dx = (x + size/2) - (px + p.size/2);
               const dy = (y + (size*0.75)/2) - (py + (p.size*0.75)/2);
               const dist = Math.sqrt(dx*dx + dy*dy);
               const minRadius = Math.max(size, p.size) * 0.55; // allow slight natural overlap
               
               if (dist < minRadius) {
                   overlap = true;
                   break;
               }
           }
           attempts++;
       }
       
       generatedPlacements.push({
           id: validPhotos[i].id,
           photo: validPhotos[i],
           xPct: (x / width) * 100,
           yPct: (y / height) * 100,
           size,
           rotation: (Math.random() - 0.5) * 16, // -8 to +8
           floatDuration: isMobile ? 10 + Math.random() * 8 : 8 + Math.random() * 8,
           floatDelay: Math.random() * -10,
           blinkDuration: 5 + Math.random() * 4,
           blinkDelay: Math.random() * -5,
       });
    }

    setPlacements(generatedPlacements);
    setIsInitialized(true);
  }, [validPhotos, isInitialized]);

  if (!validPhotos || validPhotos.length === 0) {
    return null;
  }

  return (
    <section 
      ref={containerRef}
      className="relative w-full overflow-hidden bg-[#061A3A] min-h-[clamp(480px,62vh,680px)] flex items-center justify-center isolate"
    >
      {/* Subtle Premium Background Glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-[#1a4a9c] rounded-full blur-[120px] opacity-20 mix-blend-screen" />
      </div>

      {/* Scattered Interactive Photo Gallery */}
      <div className="absolute inset-0 z-10 p-4">
        <AnimatePresence>
          {placements.length > 0 && placements.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-xl overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.2)] ring-1 ring-white/10 bg-[#061A3A] cursor-pointer"
              style={{
                left: `${p.xPct}%`,
                top: `${p.yPct}%`,
                width: `${p.size}px`,
                height: `${p.size * 0.75}px`, // 4:3 aspect ratio
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              whileHover={{ 
                scale: 1.08, 
                zIndex: 50, 
                boxShadow: "0 10px 30px rgba(0,0,0,0.4)" 
              }}
            >
              {/* Inner animated div for declarative floating & blinking */}
              <motion.div
                className="w-full h-full relative"
                animate={prefersReducedMotion ? { filter: "brightness(1)", rotate: p.rotation } : {
                  x: [0, 8, -5, 0],
                  y: [0, -10, 5, 0],
                  rotate: [p.rotation, p.rotation + 1, p.rotation - 1, p.rotation],
                  opacity: [0.88, 1, 0.92, 0.88],
                  filter: ["brightness(0.95)", "brightness(1.08)", "brightness(1)", "brightness(0.95)"],
                }}
                transition={prefersReducedMotion ? {} : {
                  x: { duration: p.floatDuration, repeat: Infinity, ease: "easeInOut", delay: p.floatDelay },
                  y: { duration: p.floatDuration * 1.1, repeat: Infinity, ease: "easeInOut", delay: p.floatDelay },
                  rotate: { duration: p.floatDuration * 1.2, repeat: Infinity, ease: "easeInOut", delay: p.floatDelay },
                  opacity: { duration: p.blinkDuration, repeat: Infinity, ease: "easeInOut", delay: p.blinkDelay },
                  filter: { duration: p.blinkDuration, repeat: Infinity, ease: "easeInOut", delay: p.blinkDelay },
                }}
              >
                {p.photo.media?.cdn_url && (
                  <Image
                    src={p.photo.media.cdn_url}
                    alt={p.photo.media.alt_text || "Gallery Moment"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 95px, (max-width: 1024px) 125px, 155px"
                  />
                )}
                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10 pointer-events-none" />
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}

export { GalleryHeroSection };
