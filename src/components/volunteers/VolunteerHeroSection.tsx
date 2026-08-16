"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";

import { Container } from "@/components/shared/Container";

// Using the existing images
const MAIN_PHOTO = { src: "/hero/hero-01.png", alt: "UDBHAV Foundation volunteer initiative" };

const SUPPORTING_PHOTOS = [
  { src: "/hero/hero-02.png", alt: "Volunteer supporting community", size: "w-28 h-20 sm:w-48 sm:h-32", position: "top-[10%] left-[5%] sm:top-[15%] sm:left-[10%]", delay: "0s", duration: "5s" },
  { src: "/hero/hero-04.png", alt: "Volunteers working together", size: "w-24 h-24 sm:w-40 sm:h-40", position: "bottom-[5%] left-[8%] sm:bottom-[10%] sm:left-[15%]", delay: "1.5s", duration: "6s" },
  { src: "/hero/hero-05.png", alt: "Community engagement", size: "w-32 h-24 sm:w-56 sm:h-40", position: "top-[5%] right-[5%] sm:top-[10%] sm:right-[10%]", delay: "0.5s", duration: "5.5s" },
  { src: "/hero/hero-07.png", alt: "Grassroots volunteering", size: "w-28 h-28 sm:w-44 sm:h-44", position: "bottom-[10%] right-[10%] sm:bottom-[15%] sm:right-[15%]", delay: "2s", duration: "6.5s", hideMobile: true },
  { src: "/hero/hero-09.png", alt: "Volunteer teaching", size: "hidden lg:block w-32 h-24 sm:w-40 sm:h-32", position: "top-[40%] right-[2%] sm:top-[45%] sm:right-[5%]", delay: "1s", duration: "4.5s" },
  { src: "/hero/hero-08.png", alt: "Environmental action", size: "hidden lg:block w-36 h-28 sm:w-48 sm:h-36", position: "top-[35%] left-[2%] sm:top-[40%] sm:left-[4%]", delay: "2.5s", duration: "5.8s" },
];

export function VolunteerHeroSection() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    setReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-white py-12 sm:py-16 md:py-20 flex items-center justify-center min-h-[360px] md:min-h-[500px]">
      <Container className="relative w-full h-full flex items-center justify-center max-w-6xl py-8">
        
        {/* Main Photo (Center) */}
        <div className="relative z-20 w-[90%] sm:w-[460px] md:w-[500px] lg:w-[520px] aspect-[16/10] sm:aspect-[3/2] rounded-[18px] sm:rounded-[24px] shadow-sm hover:shadow-md transition-all duration-500 hover:scale-[1.02] bg-gray-100 overflow-hidden group mx-auto my-auto">
          <Image
            src={MAIN_PHOTO.src}
            alt={MAIN_PHOTO.alt}
            fill
            priority
            sizes="(max-width: 640px) 90vw, 520px"
            className="object-cover"
          />
        </div>

        {/* Supporting Photos (Absolute Positioning around Main Photo) */}
        {SUPPORTING_PHOTOS.map((photo, idx) => (
          <div
            key={idx}
            className={`absolute z-10 rounded-[12px] sm:rounded-[16px] shadow-sm hover:shadow-md transition-all duration-500 hover:scale-[1.04] bg-gray-100 overflow-hidden ${photo.size} ${photo.position} ${photo.hideMobile ? 'hidden sm:block' : ''}`}
            style={!reducedMotion ? {
              animation: `float ${photo.duration} ease-in-out infinite alternate ${photo.delay}`
            } : {}}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 640px) 150px, 250px"
              className="object-cover"
            />
          </div>
        ))}
      </Container>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-8px); }
        }
      `}} />
    </section>
  );
}

export default VolunteerHeroSection;
