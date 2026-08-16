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

type OrbitNode = {
  id: string;
  photo: AdminPhotoItem;
  size: number;
  angle: number; // degrees
  tilt: number;
  floatDuration: number;
  floatDelay: number;
};

type OuterNode = {
  id: string;
  photo: AdminPhotoItem;
  size: number;
  x: number;
  y: number;
  tilt: number;
  floatDuration: number;
  floatDelay: number;
};

const GalleryHeroSection = ({ heroPhotos }: GalleryHeroSectionProps) => {
  const containerRef = useRef<HTMLElement>(null);
  
  const [centerImage, setCenterImage] = useState<CenterPlacement | null>(null);
  const [orbitNodes, setOrbitNodes] = useState<OrbitNode[]>([]);
  const [outerNodes, setOuterNodes] = useState<OuterNode[]>([]);
  const [orbitRadius, setOrbitRadius] = useState(0);
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
    const centerW = isMobile ? (210 + Math.random()*30) : (isTablet ? 280 + Math.random()*40 : 360 + Math.random()*40);
    const centerH = centerW * 0.75; // 4:3
    
    const centerPhoto = validPhotos[0];
    const calculatedRadius = centerW * (isMobile ? 0.9 : 0.95);
    
    // 2. Inner Orbit Photos
    const orbitCount = isMobile ? (5 + Math.floor(Math.random()*2)) : (isTablet ? 8 : (8 + Math.floor(Math.random()*3))); // 5-6 mobile, 8 tablet, 8-10 desktop
    const availableForOrbit = validPhotos.slice(1);
    const actualOrbitCount = Math.min(orbitCount, availableForOrbit.length);
    
    const generatedOrbitNodes: OrbitNode[] = [];
    for (let i = 0; i < actualOrbitCount; i++) {
       let size = isMobile ? 60 + Math.random()*25 : (isTablet ? 80 + Math.random()*30 : 100 + Math.random()*40);
       
       let baseAngle = (i / actualOrbitCount) * 360;
       let angle = baseAngle + (Math.random() - 0.5) * 15; // +/- 7.5 deg variance
       
       generatedOrbitNodes.push({
           id: availableForOrbit[i].id,
           photo: availableForOrbit[i],
           size,
           angle,
           tilt: (Math.random() - 0.5) * 16, // +/- 8 deg
           floatDuration: 8 + Math.random() * 6,
           floatDelay: Math.random() * -10,
       });
    }

    // 3. Outer Scattered Photos
    const outerCount = isMobile ? 0 : (isTablet ? (4 + Math.floor(Math.random()*2)) : (5 + Math.floor(Math.random()*3))); // 0 mobile, 4-5 tablet, 5-7 desktop
    const availableForOuter = validPhotos.slice(1 + actualOrbitCount);
    const actualOuterCount = Math.min(outerCount, availableForOuter.length);
    
    const generatedOuterNodes: OuterNode[] = [];
    for (let i = 0; i < actualOuterCount; i++) {
       let size = isTablet ? 70 + Math.random()*25 : 85 + Math.random()*35;
       
       // Distribute radially outside the orbit
       let angleRad = (i / actualOuterCount) * Math.PI * 2 + (Math.random()-0.5)*0.5;
       
       // Find safe max radius so it stays in bounds
       const padding = size/2 + 20;
       let maxRx = Infinity, maxRy = Infinity;
       if (Math.abs(Math.cos(angleRad)) > 0.001) maxRx = Math.abs((width/2 - padding) / Math.cos(angleRad));
       if (Math.abs(Math.sin(angleRad)) > 0.001) maxRy = Math.abs((height/2 - padding) / Math.sin(angleRad));
       const maxR = Math.min(maxRx, maxRy);
       
       const minR = calculatedRadius + size/2 + 30; // safely outside the inner orbit
       
       if (maxR > minR) {
           const r = minR + Math.random() * (maxR - minR);
           generatedOuterNodes.push({
               id: availableForOuter[i].id,
               photo: availableForOuter[i],
               size,
               x: Math.cos(angleRad) * r,
               y: Math.sin(angleRad) * r,
               tilt: (Math.random() - 0.5) * 16,
               floatDuration: 8 + Math.random() * 6,
               floatDelay: Math.random() * -10,
           });
       }
    }

    setCenterImage({
      id: centerPhoto.id,
      photo: centerPhoto,
      width: centerW,
      height: centerH,
      floatDuration: 8 + Math.random() * 4,
    });
    setOrbitRadius(calculatedRadius);
    setOrbitNodes(generatedOrbitNodes);
    setOuterNodes(generatedOuterNodes);
    setIsInitialized(true);
  }, [validPhotos, isInitialized]);

  if (!validPhotos || validPhotos.length === 0) {
    return null;
  }

  return (
    <section 
      ref={containerRef}
      className="relative w-full overflow-hidden bg-[#061A3A] min-h-[clamp(420px,60vh,560px)] flex items-center justify-center isolate"
    >
      {/* Premium Background Glows */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="absolute w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-[#1a4a9c] rounded-full blur-[120px] opacity-20 mix-blend-screen" />
        <div className="absolute w-[400px] h-[400px] bg-cyan-500 rounded-full blur-[150px] opacity-[0.08]" />
      </div>

      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        <div className="relative w-full h-full pointer-events-auto">
          <AnimatePresence>
            {isInitialized && centerImage && (
              <>
                {/* 1. Outer Scattered Photos (Z-10) */}
                {outerNodes.map((node) => (
                  <motion.div
                    key={node.id}
                    className="absolute pointer-events-auto z-10"
                    style={{
                      left: "50%",
                      top: "50%",
                      width: `${node.size}px`,
                      height: `${node.size * 0.75}px`,
                      x: `calc(-50% + ${node.x}px)`,
                      y: `calc(-50% + ${node.y}px)`,
                    }}
                  >
                    <div className="w-full h-full" style={{ rotate: `${node.tilt}deg` }}>
                       <motion.div
                         className="w-full h-full relative rounded-xl overflow-hidden shadow-lg ring-1 ring-white/10 bg-[#061A3A] cursor-pointer"
                         whileHover={{ scale: 1.12, zIndex: 50, filter: "brightness(1.1)", boxShadow: "0 10px 30px rgba(34, 211, 238, 0.3)" }}
                         animate={prefersReducedMotion ? {} : { y: [-6, 6, -6], opacity: [0.85, 0.95, 0.85] }}
                         transition={prefersReducedMotion ? {} : { 
                           y: { duration: node.floatDuration, repeat: Infinity, ease: "easeInOut", delay: node.floatDelay },
                           opacity: { duration: node.floatDuration * 1.2, repeat: Infinity, ease: "easeInOut", delay: node.floatDelay }
                         }}
                       >
                         {node.photo.media?.cdn_url && (
                           <Image src={node.photo.media.cdn_url} alt={node.photo.media.alt_text || "Outer Gallery Moment"} fill className="object-cover" sizes="120px" />
                         )}
                         <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10 pointer-events-none" />
                       </motion.div>
                    </div>
                  </motion.div>
                ))}

                {/* 2. Dotted Orbit Ring (Z-15) */}
                <div 
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-dashed border-cyan-400/20 z-15 pointer-events-none"
                  style={{ 
                    width: orbitRadius * 2, 
                    height: orbitRadius * 2,
                    boxShadow: "0 0 40px rgba(34, 211, 238, 0.05), inset 0 0 40px rgba(34, 211, 238, 0.05)"
                  }}
                />

                {/* 3. Orbit Wrapper (Z-20) - Rotates the entire inner ring slowly */}
                <motion.div
                  className="absolute left-1/2 top-1/2 w-0 h-0 z-20 pointer-events-none"
                  animate={prefersReducedMotion ? {} : { rotate: [0, 360] }}
                  transition={prefersReducedMotion ? {} : { duration: 40, repeat: Infinity, ease: "linear" }}
                >
                  {orbitNodes.map((node) => (
                    <div 
                      key={node.id}
                      className="absolute pointer-events-none"
                      style={{
                        transform: `rotate(${node.angle}deg) translateX(${orbitRadius}px)`,
                      }}
                    >
                       {/* Counter-rotator to keep images upright while orbiting */}
                       <motion.div
                         className="absolute pointer-events-auto"
                         style={{ 
                           left: `-${node.size / 2}px`, 
                           top: `-${(node.size * 0.75) / 2}px`, 
                           width: `${node.size}px`, 
                           height: `${node.size * 0.75}px` 
                         }}
                         animate={prefersReducedMotion ? {} : { rotate: [0, -360] }}
                         transition={prefersReducedMotion ? {} : { duration: 40, repeat: Infinity, ease: "linear" }}
                       >
                          {/* Natural Tilt */}
                          <div className="w-full h-full" style={{ rotate: `${node.tilt}deg` }}>
                             {/* Float and Hover interaction */}
                             <motion.div 
                               className="w-full h-full relative rounded-xl overflow-hidden shadow-lg ring-1 ring-white/20 bg-[#061A3A] cursor-pointer"
                               whileHover={{ scale: 1.12, zIndex: 50, filter: "brightness(1.1)", boxShadow: "0 10px 30px rgba(34, 211, 238, 0.3)" }}
                               animate={prefersReducedMotion ? {} : { y: [-5, 5, -5], opacity: [0.9, 1, 0.9] }}
                               transition={prefersReducedMotion ? {} : { 
                                 y: { duration: node.floatDuration, repeat: Infinity, ease: "easeInOut", delay: node.floatDelay },
                                 opacity: { duration: node.floatDuration * 1.3, repeat: Infinity, ease: "easeInOut", delay: node.floatDelay }
                               }}
                             >
                                {node.photo.media?.cdn_url && (
                                  <Image src={node.photo.media.cdn_url} alt={node.photo.media.alt_text || "Orbiting Gallery Moment"} fill className="object-cover" sizes="150px" />
                                )}
                                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10 pointer-events-none" />
                             </motion.div>
                          </div>
                       </motion.div>
                    </div>
                  ))}
                </motion.div>
                
                {/* 4. Main Central Featured Image (Z-30) */}
                <motion.div
                  className="absolute pointer-events-auto rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(70,130,255,0.18),0_20px_50px_rgba(0,0,0,0.25)] ring-1 ring-white/20 bg-[#061A3A] z-30 cursor-pointer"
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
                    boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                    filter: "brightness(1.05)"
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
