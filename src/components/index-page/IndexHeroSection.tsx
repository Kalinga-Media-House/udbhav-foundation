"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

function ProgrammeImageSlideshow({
  images,
  title,
  initialDelay = 0,
  priority = false,
  className = "",
}: {
  images: { src: string; alt: string }[];
  title: string;
  initialDelay?: number;
  priority?: boolean;
  className?: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion || images.length <= 1) return;

    let interval: NodeJS.Timeout;

    // Start with the requested initial stagger delay
    const timeout = setTimeout(() => {
      // Once the delay passes, we trigger the first slide transition
      setCurrentIndex((prev) => (prev + 1) % images.length);
      
      // And start the continuous 4.5s loop
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 4500);
    }, initialDelay);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [reducedMotion, images.length, initialDelay]);

  return (
    <div
      className={`relative h-48 sm:h-56 rounded-2xl overflow-hidden shadow-xl border-2 border-white group transition-transform duration-300 ${className}`}
    >
      {images.map((img, idx) => {
        const isVisible = idx === currentIndex;
        return (
          <Image
            key={img.src}
            src={img.src}
            alt={img.alt}
            fill
            sizes="(max-width: 1024px) 50vw, 260px"
            className="object-cover group-hover:scale-105"
            style={{
              opacity: isVisible ? 1 : 0,
              zIndex: isVisible ? 1 : 0,
              transition: reducedMotion
                ? "none"
                : "opacity 900ms ease-in-out, transform 500ms ease",
            }}
            priority={priority && idx === 0}
            aria-hidden={!isVisible}
          />
        );
      })}
      
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 pointer-events-none"
        style={{ zIndex: 2 }}
      />
      <span
        className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold leading-tight drop-shadow pointer-events-none"
        style={{ zIndex: 3 }}
      >
        {title}
      </span>
    </div>
  );
}

export function IndexHeroSection() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#EAF3FF] via-[#F4F9FF] to-[#F1F9ED] py-12 sm:py-16 md:py-20 lg:py-24 border-b border-gray-200/60">
      {/* Decorative soft green/blue background circles */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#3C9D23]/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-[#172B6B]/10 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[460px] lg:min-h-[520px]">
          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3C9D23]/15 border border-[#3C9D23]/30 text-[#3C9D23] text-xs font-heading font-bold tracking-wider uppercase mb-5 w-fit">
              PROGRAMMES & INITIATIVES
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-[#172B6B] leading-tight mb-6">
              Turning Purpose Into{" "}
              <span className="text-[#3C9D23] block sm:inline">
                Measurable Impact.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-8 max-w-2xl font-normal">
              Explore UDBHAV Foundation’s programmes advancing education,
              environmental responsibility, health, inclusion, awareness, and
              community empowerment across Odisha.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                type="button"
                onClick={() => scrollToSection("programmes")}
                className="px-8 py-3.5 rounded-xl font-heading font-semibold text-sm sm:text-base text-white bg-[#3C9D23] hover:bg-[#348a1e] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-center cursor-pointer"
              >
                Explore All Programmes
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("collective-impact")}
                className="px-8 py-3.5 rounded-xl font-heading font-semibold text-sm sm:text-base text-[#172B6B] bg-white hover:bg-gray-50 border-2 border-[#172B6B]/20 hover:border-[#172B6B] shadow-sm hover:shadow-md transition-all text-center cursor-pointer"
              >
                View Our Impact
              </button>
            </div>
          </div>

          {/* Right Staggered Photo Collage */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <div className="grid grid-cols-2 gap-4 sm:gap-6 relative">
              {/* Top-Left Image Frame */}
              <ProgrammeImageSlideshow
                title="UDBHAV Siksha Samman"
                initialDelay={0}
                priority={true}
                className="hover:-translate-y-1"
                images={[
                  { src: "/hero/hero-02.png", alt: "UDBHAV Siksha Samman felicitation ceremony" },
                  { src: "/hero/hero-04.png", alt: "Students receiving UDBHAV Siksha Samman awards" },
                  { src: "/hero/hero-06.png", alt: "Educational excellence award ceremony" }
                ]}
              />

              {/* Top-Right Image Frame (staggered lower) */}
              <ProgrammeImageSlideshow
                title="Plantation Drive"
                initialDelay={1000}
                priority={true}
                className="translate-y-4 hover:translate-y-3"
                images={[
                  { src: "/hero/hero-01.png", alt: "UDBHAV Foundation Plantation Drive sapling initiative" },
                  { src: "/hero/hero-03.png", alt: "Greening urban public spaces" },
                  { src: "/hero/hero-05.png", alt: "Nurturing fruit orchards for rural schools" }
                ]}
              />

              {/* Bottom-Left Image Frame */}
              <ProgrammeImageSlideshow
                title="Climate Action Run"
                initialDelay={2000}
                className="-translate-y-2 hover:-translate-y-3"
                images={[
                  { src: "/hero/hero-08.png", alt: "Citizens participating in UDBHAV Climate Action Run" },
                  { src: "/hero/hero-07.png", alt: "Striding forward for climate justice" },
                  { src: "/hero/hero-03.png", alt: "Youth running for climate consciousness" }
                ]}
              />

              {/* Bottom-Right Image Frame */}
              <ProgrammeImageSlideshow
                title="Health Check-up Camps"
                initialDelay={3000}
                className="translate-y-2 hover:translate-y-1"
                images={[
                  { src: "/hero/hero-09.png", alt: "Medical specialists at UDBHAV Health Check-up Camp" },
                  { src: "/hero/hero-08.png", alt: "Healthcare at the doorstep for rural communities" },
                  { src: "/hero/hero-01.png", alt: "Specialist pediatric screening camp" }
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
