"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { OFFICIAL_INDEX_PROGRAMMES } from "@/data/index-programmes-data";
import { ProgrammeCategory, IndexProgrammeDetail } from "@/types/index-programme";

const CATEGORY_TABS: { label: string; value: string }[] = [
  { label: "All Programmes", value: "all" },
  { label: "Education", value: "Education" },
  { label: "Environment", value: "Environment" },
  { label: "Health & Well-being", value: "Health & Well-being" },
  { label: "Awareness & Safety", value: "Awareness & Safety" },
  { label: "Community Support", value: "Community Support" },
];

function AnimatedProgrammeCard({ prog, index }: { prog: IndexProgrammeDetail; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const [pressState, setPressState] = useState<"idle" | "pressed" | "released">("idle");
  const [btnPressed, setBtnPressed] = useState(false);
  
  const cardRef = useRef<HTMLElement>(null);
  const releaseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
    if (reducedMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.10 } // 10% visible to trigger early enough
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [reducedMotion]);

  const handlePointerDown = () => {
    if (reducedMotion) return;
    if (releaseTimeoutRef.current) clearTimeout(releaseTimeoutRef.current);
    setPressState("pressed");
  };

  const handlePointerUp = () => {
    if (reducedMotion || pressState !== "pressed") return;
    setPressState("released");
    releaseTimeoutRef.current = setTimeout(() => {
      setPressState("idle");
    }, 300);
  };

  const handlePointerCancel = () => {
    if (reducedMotion) return;
    setPressState("idle");
  };

  // Entrance stagger: Max delay of 600ms so users don't wait too long
  const staggerDelay = Math.min(index * 100, 600);
  const isPressed = pressState === "pressed";
  const isReleased = pressState === "released";

  return (
    <article
      ref={cardRef}
      className="h-full"
      style={{
        opacity: isVisible || reducedMotion ? 1 : 0,
        transform: isVisible || reducedMotion ? "translateY(0) scale(1)" : "translateY(28px) scale(0.97)",
        transition: reducedMotion 
          ? "none" 
          : `opacity 800ms cubic-bezier(0.22, 1, 0.36, 1) ${staggerDelay}ms, transform 800ms cubic-bezier(0.22, 1, 0.36, 1) ${staggerDelay}ms`,
        willChange: isVisible ? "auto" : "transform, opacity",
      }}
    >
      <div
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerCancel}
        onPointerCancel={handlePointerCancel}
        style={{ WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }}
        className={`group flex flex-col h-full rounded-2xl bg-white border overflow-hidden shadow-sm ease-[cubic-bezier(0.22,1,0.36,1)] transition-all will-change-transform ${
          isPressed
            ? "scale-[0.975] border-[#3C9D23]/25 duration-150"
            : isReleased
            ? "scale-[1.015] shadow-lg border-[#3C9D23]/40 duration-[200ms]"
            : "scale-100 border-[#3C9D23]/25 duration-[300ms] hover:-translate-y-[5px] hover:scale-[1.008] hover:shadow-xl hover:border-[#3C9D23]/50"
        }`}
      >
        {/* Image Header with Number Badge */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-100 shrink-0">
          <Image
            src={prog.coverImageUrl}
            alt={prog.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover scale-100 group-hover:scale-[1.025] transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transform-none"
          />

          {/* Programme Number Badge */}
          <div className="absolute top-3.5 left-3.5 z-10">
            <span className="px-3 py-1 rounded-full text-xs font-heading font-bold uppercase bg-[#172B6B] text-white shadow-md">
              {prog.programmeNumber}
            </span>
          </div>

          {/* Category Badge */}
          <div className="absolute top-3.5 right-3.5 z-10">
            <span className="px-3 py-1 rounded-full text-xs font-heading font-semibold bg-[#3C9D23] text-white shadow-md">
              {prog.category}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
          <div>
            <h3 className="font-heading text-lg sm:text-xl font-bold text-[#172B6B] mb-1.5 leading-snug group-hover:text-[#202B78] transition-colors">
              {prog.title}
            </h3>

            <p className="text-xs font-semibold text-[#3C9D23] uppercase tracking-wide mb-3">
              {prog.tagline}
            </p>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3 mb-5">
              {prog.shortDescription}
            </p>
          </div>

          <div>
            {/* Compact Impact Preview */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F1F9ED] border border-[#3C9D23]/25 mb-4">
              <TrendingUp className="w-4 h-4 text-[#3C9D23] shrink-0" />
              <span className="text-xs font-heading font-bold text-[#172B6B] truncate">
                {prog.impactPreview}
              </span>
            </div>

            {/* Metadata counts row */}
            <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3 mb-4">
              <span className="flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-gray-400" />
                {prog.photoCount} Photos
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                {prog.eventCount} Activities
              </span>
            </div>

            {/* CTA Link */}
            <Link
              href={`/programmes/${prog.slug}`}
              onPointerDown={(e) => {
                e.stopPropagation();
                if (!reducedMotion) setBtnPressed(true);
              }}
              onPointerUp={() => setBtnPressed(false)}
              onPointerLeave={() => setBtnPressed(false)}
              onPointerCancel={() => setBtnPressed(false)}
              className={`inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl font-heading text-xs sm:text-sm font-semibold text-[#172B6B] bg-[#EAF3FF] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group/btn ${
                btnPressed
                  ? "scale-[0.98] brightness-95"
                  : "scale-100 hover:bg-[#172B6B] hover:text-white hover:brightness-110"
              }`}
            >
              <span>Explore Programme</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300 motion-reduce:transform-none" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export function ProgrammeDirectorySection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const filteredProgrammes = useMemo(() => {
    if (activeCategory === "all") {
      return OFFICIAL_INDEX_PROGRAMMES;
    }
    return OFFICIAL_INDEX_PROGRAMMES.filter(
      (prog) => prog.category === (activeCategory as ProgrammeCategory)
    );
  }, [activeCategory]);

  const handleCategoryChange = (newCategory: string) => {
    if (newCategory === selectedCategory || isTransitioning) return;
    
    setSelectedCategory(newCategory);
    setIsTransitioning(true);
    
    setTimeout(() => {
      setActiveCategory(newCategory);
      setIsTransitioning(false);
    }, 300); // 300ms fade out duration before swapping content
  };

  return (
    <section
      id="programmes"
      className="py-16 sm:py-20 md:py-24 bg-[#FCFCF8] scroll-mt-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3C9D23]/15 border border-[#3C9D23]/30 text-[#3C9D23] text-xs font-heading font-bold tracking-wider uppercase mb-4">
            OUR AREAS OF ACTION
          </div>

          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#172B6B] leading-tight mb-4">
            11 Programmes. One Shared Purpose.
          </h2>

          <p className="text-base sm:text-lg text-gray-700 font-normal">
            Each initiative responds to a real community need while contributing to
            a more inclusive, aware, healthy, educated, and sustainable society.
          </p>
        </div>

        {/* Dynamic Category Filter Tabs */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-4 mb-10 sm:mb-12 no-scrollbar gap-2">
          {CATEGORY_TABS.map((tab) => {
            const isActive = selectedCategory === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => handleCategoryChange(tab.value)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-heading font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-[#172B6B] text-white shadow-md scale-105"
                    : "bg-white text-gray-700 hover:bg-[#EAF3FF] border border-gray-200"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Responsive Programme Card Grid */}
        <div 
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isTransitioning ? "opacity-0 scale-[0.98]" : "opacity-100 scale-100"
          }`}
        >
          {filteredProgrammes.map((prog, index) => (
            <AnimatedProgrammeCard 
              key={`${activeCategory}-${prog.id}`} 
              prog={prog} 
              index={index} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
