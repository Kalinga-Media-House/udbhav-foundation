"use client";

import { MapPin, Calendar, Clock, FolderOpen } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

import { GalleryPhoto } from "@/types/gallery";


interface GalleryCardProps {
  photo: GalleryPhoto;
  index: number;
  onClick: (id: string) => void;
}

export function GalleryCard({ photo, index, onClick }: GalleryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isImageInView, setIsImageInView] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [pressState, setPressState] = useState<"idle" | "pressed" | "released">("idle");
  const releaseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Card Reveal Observer
  useEffect(() => {
    if (reducedMotion) {
      queueMicrotask(() => setIsVisible(true));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.10 } // 10% visible
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [reducedMotion]);

  // Image Lazy Load Observer (Root margin 200px)
  useEffect(() => {
    if (reducedMotion) {
      queueMicrotask(() => setIsImageInView(true));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsImageInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" }
    );

    if (cardRef.current) observer.observe(cardRef.current);
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

  const getAspectClass = (ratio: GalleryPhoto["aspectRatio"]) => {
    switch (ratio) {
      case "portrait": return "aspect-[3/4]";
      case "square": return "aspect-square";
      case "landscape": default: return "aspect-[4/3]";
    }
  };

  const staggerDelay = Math.min(index * 90, 360);
  const isPressed = pressState === "pressed";
  const isReleased = pressState === "released";

  return (
    <div
      ref={cardRef}
      style={{
        opacity: isVisible || reducedMotion ? 1 : 0,
        transform: isVisible || reducedMotion ? "translateY(0) scale(1)" : "translateY(30px) scale(0.975)",
        transition: reducedMotion 
          ? "none" 
          : `opacity 800ms cubic-bezier(0.22, 1, 0.36, 1) ${staggerDelay}ms, transform 800ms cubic-bezier(0.22, 1, 0.36, 1) ${staggerDelay}ms`,
        willChange: isVisible ? "auto" : "transform, opacity",
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation"
      }}
      role="button"
      tabIndex={0}
      aria-label={`View photo details: ${photo.title}`}
      onClick={() => onClick(photo.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(photo.id);
        }
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerCancel}
      onPointerCancel={handlePointerCancel}
      className={`break-inside-avoid mb-4 sm:mb-6 rounded-2xl overflow-hidden relative group border border-[#12245F]/10 bg-pure-white transition-all ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isPressed
          ? "scale-[0.985] duration-150 shadow-sm"
          : isReleased
          ? "scale-[1.01] duration-200 shadow-md"
          : "scale-100 duration-[500ms] lg:hover:-translate-y-1 lg:hover:shadow-xl"
      } ${getAspectClass(photo.aspectRatio)}`}
    >
      {/* Subtle Shimmer Placeholder matching exact size */}
      <div 
        className={`absolute inset-0 z-0 bg-[#F8F9F5] transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${isImageLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>

      {/* Image with Custom Lazy Load & Blur Effect */}
      {isImageInView && (
        <Image
          src={photo.imageUrl}
          alt={photo.altText}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          onLoad={() => setIsImageLoaded(true)}
          className={`object-cover object-center transition-all duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isImageLoaded 
              ? "opacity-100 blur-0 scale-100 group-hover:scale-[1.025]" 
              : "opacity-0 blur-[10px] scale-[1.03]"
          }`}
          priority={index < 4}
        />
      )}

      {/* Mobile Compact Always-Visible Badge */}
      <div className="absolute top-3 left-3 z-30 lg:hidden">
        <span
          className="inline-block px-2.5 py-1 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider shadow-sm"
          style={{ background: "#439B25", color: "#FFFFFF" }}
        >
          {photo.programme.title}
        </span>
      </div>

      {/* Rich Information Overlay (Bottom-up dark gradient) */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-4 sm:p-5 bg-gradient-to-t from-[#12245F]/95 via-[#12245F]/65 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
        <div className="mb-2">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-heading font-bold uppercase tracking-wider"
            style={{ background: "#439B25", color: "#FFFFFF" }}
          >
            <FolderOpen className="w-3 h-3" />
            {photo.programme.title}
          </span>
        </div>
        <h3 className="font-heading text-sm sm:text-base font-bold text-white leading-snug mb-2">
          {photo.title}
        </h3>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/90">
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#439B25]" />
            {photo.event.location}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#439B25]" />
            {photo.event.eventDate}
          </span>
          {photo.event.startTime && (
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#439B25]" />
              {photo.event.startTime}
            </span>
          )}
        </div>
        <div className="mt-2 pt-2 border-t border-white/15 text-[11px] text-white/75 font-medium truncate">
          From: {photo.event.title}
        </div>
      </div>
    </div>
  );
}
