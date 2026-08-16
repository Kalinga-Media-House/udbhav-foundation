"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { AdminPhotoItem } from "@/features/gallery/repository";

interface GalleryHeroSectionProps {
  heroPhotos: AdminPhotoItem[];
}

type CenterPlacement = {
  id: string;
  photo: AdminPhotoItem;
  width: number;
  height: number;
  floatDuration: number;
};

type ThumbPlacement = {
  id: string;
  photo: AdminPhotoItem;
  xPx: number;
  yPx: number;
  size: number;
  rotation: number;
  floatDuration: number;
  floatDelay: number;
  blinkDuration: number;
  blinkDelay: number;
};

const GalleryHeroSection = ({ heroPhotos }: GalleryHeroSectionProps) => {
  const containerRef = useRef<HTMLElement>(null);
  const [centerImage, setCenterImage] = useState<CenterPlacement | null>(null);
  const [thumbnails, setThumbnails] = useState<ThumbPlacement[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const validPhotos = heroPhotos.filter((p) => p.media?.cdn_url);

  useEffect(() => {
    if (isInitialized || !containerRef.current || validPhotos.length === 0) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    const isMobile = width < 640;
    const isTablet = width >= 640 && width < 1024;
    
    // 1. Center Image Config
    const centerW = isMobile ? (200 + Math.random()*60) : (isTablet ? 280 + Math.random()*60 : 320 + Math.random()*100);
    const centerH = centerW * 0.75;
    
    const centerPhoto = validPhotos[0];
    const thumbPhotos = validPhotos.slice(1);
    
    // 2. Thumbnails Config
    let count = isMobile ? (6 + Math.floor(Math.random() * 5)) : (isTablet ? 8 + Math.floor(Math.random() * 5) : 10 + Math.floor(Math.random() * 7));
    count = Math.min(count, thumbPhotos.length);

    const generatedThumbnails: ThumbPlacement[] = [];
    
    for (let i = 0; i < count; i++) {
       let size = isMobile ? 55 + Math.random() * 35 : (isTablet ? 75 + Math.random() * 40 : 90 + Math.random() * 60);
       
       let baseAngle = (i / count) * Math.PI * 2;
       let angle = baseAngle + (Math.random() - 0.5) * 0.4;
       
       const minRx = centerW / 2 + size / 2 + 15;
       const minRy = centerH / 2 + size / 2 + 15;
       
       const containerHalfW = width / 2;
       const containerHalfH = height / 2;
       
       let rx = minRx + Math.random() * 40;
       let ry = minRy + Math.random() * 40;
       
       // Constrain so they don't overflow the container edges (with safety margin)
       const safety = size / 2 + 15;
       if (Math.abs(Math.cos(angle) * rx) > containerHalfW - safety) {
           rx = (containerHalfW - safety) / Math.abs(Math.cos(angle));
       }
       if (Math.abs(Math.sin(angle) * ry) > containerHalfH - safety) {
           ry = (containerHalfH - safety) / Math.abs(Math.sin(angle));
       }
       
       // Fallback if extremely cramped
       if (rx < minRx * 0.8) rx = minRx * 0.8; 
       if (ry < minRy * 0.8) ry = minRy * 0.8;
       
       generatedThumbnails.push({
           id: thumbPhotos[i].id,
           photo: thumbPhotos[i],
           xPx: Math.cos(angle) * rx,
           yPx: Math.sin(angle) * ry,
           size,
           rotation: (Math.random() - 0.5) * 16,
           floatDuration: 10 + Math.random() * 8, // 10-18s
           floatDelay: Math.random() * -10,
           blinkDuration: 6 + Math.random() * 5,
           blinkDelay: Math.random() * -5,
       });
    }

    setCenterImage({
      id: centerPhoto.id,
      photo: centerPhoto,
      width: centerW,
      height: centerH,
      floatDuration: 8 + Math.random() * 4,
    });
    
    setThumbnails(generatedThumbnails);
    setIsInitialized(true);
  }, [validPhotos, isInitialized]);

  if (!validPhotos || validPhotos.length === 0) {
    return null;
  }

  return (
    <section 
      ref={containerRef}
      className="relative w-full overflow-hidden bg-[#061A3A] min-h-[clamp(520px,60vh,620px)] flex items-center justify-center isolate"
    >
      {/* Premium Background Glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-[#1a4a9c] rounded-full blur-[120px] opacity-20 mix-blend-screen" />
      </div>

      <div className="absolute inset-0 z-10 p-4 overflow-hidden pointer-events-none">
        <div className="relative w-full h-full pointer-events-auto">
          <AnimatePresence>
            {isInitialized && centerImage && (
              <>
                {/* 1. Surrounding Thumbnails */}
                {thumbnails.map((t) => (
                  <motion.div
                    key={t.id}
                    className="absolute rounded-xl overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.2)] ring-1 ring-white/10 bg-[#061A3A] cursor-pointer"
                    style={{
                      left: "50%",
                      top: "50%",
                      width: `${t.size}px`,
                      height: `${t.size * 0.75}px`,
                      x: `calc(-50% + ${t.xPx}px)`,
                      y: `calc(-50% + ${t.yPx}px)`,
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
                    <motion.div
                      className="w-full h-full relative"
                      animate={prefersReducedMotion ? { filter: "brightness(1)", rotate: t.rotation } : {
                        x: [0, 5, -4, 0],
                        y: [0, -8, 5, 0],
                        rotate: [t.rotation, t.rotation + 1, t.rotation - 1, t.rotation],
                        opacity: [0.92, 1, 0.94, 0.92],
                        filter: ["brightness(1)", "brightness(1.05)", "brightness(1)", "brightness(1)"],
                      }}
                      transition={prefersReducedMotion ? {} : {
                        x: { duration: t.floatDuration, repeat: Infinity, ease: "easeInOut", delay: t.floatDelay },
                        y: { duration: t.floatDuration * 1.1, repeat: Infinity, ease: "easeInOut", delay: t.floatDelay },
                        rotate: { duration: t.floatDuration * 1.2, repeat: Infinity, ease: "easeInOut", delay: t.floatDelay },
                        opacity: { duration: t.blinkDuration, repeat: Infinity, ease: "easeInOut", delay: t.blinkDelay },
                        filter: { duration: t.blinkDuration, repeat: Infinity, ease: "easeInOut", delay: t.blinkDelay },
                      }}
                    >
                      {t.photo.media?.cdn_url && (
                        <Image
                          src={t.photo.media.cdn_url}
                          alt={t.photo.media.alt_text || "Gallery Moment"}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 95px, (max-width: 1024px) 125px, 155px"
                        />
                      )}
                      <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10 pointer-events-none" />
                    </motion.div>
                  </motion.div>
                ))}
                
                {/* 2. Main Central Image */}
                <motion.div
                  className="absolute rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(70,130,255,0.18),0_20px_50px_rgba(0,0,0,0.25)] ring-1 ring-white/20 bg-[#061A3A] z-30 cursor-pointer"
                  style={{
                    left: "50%",
                    top: "50%",
                    width: `${centerImage.width}px`,
                    height: `${centerImage.height}px`,
                    x: "-50%",
                    y: "-50%",
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  whileHover={{ 
                    scale: 1.03, 
                    boxShadow: "0 10px 40px rgba(0,0,0,0.5)" 
                  }}
                >
                  <motion.div
                    className="w-full h-full relative"
                    animate={prefersReducedMotion ? {} : {
                      scale: [1, 1.015, 1],
                      y: [0, -4, 0],
                    }}
                    transition={prefersReducedMotion ? {} : {
                      scale: { duration: centerImage.floatDuration, repeat: Infinity, ease: "easeInOut" },
                      y: { duration: centerImage.floatDuration * 1.1, repeat: Infinity, ease: "easeInOut" },
                    }}
                  >
                    {centerImage.photo.media?.cdn_url && (
                      <Image
                        src={centerImage.photo.media.cdn_url}
                        alt={centerImage.photo.media.alt_text || "Featured Gallery Moment"}
                        fill
                        priority
                        className="object-cover"
                        sizes="(max-width: 640px) 260px, (max-width: 1024px) 340px, 420px"
                      />
                    )}
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />
                  </motion.div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export { GalleryHeroSection };
