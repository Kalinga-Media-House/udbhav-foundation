"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { User, Award } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { RevealCard } from "@/components/shared/RevealCard";
import {
  GOVERNING_BODY_MEMBERS,
  type GoverningBodyMember,
} from "@/components/home/GoverningBodySection";

function GoverningBodyCarouselCard({
  member,
}: {
  member: GoverningBodyMember;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-pure-white via-pure-white to-soft-green/20 border border-impact-green/20 p-4 sm:p-5 shadow-sm hover:shadow-lg transition-all duration-300 ease-out hover:-translate-y-1 active:scale-[0.985] flex flex-col items-center text-center shrink-0 min-w-[195px] w-[195px] sm:min-w-[220px] sm:w-[220px] lg:min-w-[255px] lg:w-[255px] h-full justify-between">
      {/* Optional small leadership icon top right */}
      <div
        aria-hidden="true"
        className="absolute top-3 right-3 w-6 h-6 rounded-full bg-soft-green/50 border border-impact-green/20 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity"
      >
        <Award className="w-3 h-3 text-impact-green" />
      </div>

      <div className="flex flex-col items-center w-full">
        {/* Circular Profile Photo Area */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-impact-green/30 bg-gradient-to-br from-soft-green via-warm-white to-soft-green/40 shadow-sm mb-3 shrink-0">
          {member.image && !imgError ? (
            <Image
              src={member.image}
              alt={member.name}
              fill
              sizes="96px"
              className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105 select-none pointer-events-none"
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              role="img"
              aria-label={member.name}
              className="w-full h-full flex flex-col items-center justify-center bg-soft-green/50 text-impact-green select-none"
            >
              <User className="w-8 h-8 stroke-[1.5]" />
            </div>
          )}
        </div>

        {/* Name */}
        <h3 className="font-heading font-bold text-sm sm:text-base text-udbhav-blue-deep tracking-tight mb-1 group-hover:text-impact-green transition-colors line-clamp-1">
          {member.name}
        </h3>

        {/* Subtle Decorative Divider */}
        <div
          aria-hidden="true"
          className="w-6 h-0.5 rounded-full bg-impact-green/40 my-1.5"
        />

        {/* Designation */}
        <p className="text-xs sm:text-[13px] font-medium text-impact-green leading-snug line-clamp-2">
          {member.designation}
        </p>
      </div>
    </div>
  );
}

export function GoverningBodyGridSection() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const singleSetWidthRef = useRef<number>(0);
  const exactScrollLeftRef = useRef<number>(0);
  const isPausedRef = useRef<boolean>(false);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartScrollLeftRef = useRef<number>(0);

  // Measure single set width (11 cards)
  const measureSetWidth = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const children = track.children;
    if (children.length >= 22) {
      const firstChild = children[0] as HTMLElement;
      const eleventhChild = children[11] as HTMLElement;
      const setWidth = eleventhChild.offsetLeft - firstChild.offsetLeft;
      if (setWidth > 0) {
        singleSetWidthRef.current = setWidth;
        if (exactScrollLeftRef.current === 0 && containerRef.current) {
          containerRef.current.scrollLeft = setWidth;
          exactScrollLeftRef.current = setWidth;
        }
      }
    }
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);

    queueMicrotask(() => {
      setReducedMotion(mediaQuery.matches);
    });

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isPausedRef.current = true;
      } else {
        lastTimestampRef.current = null;
        isPausedRef.current = false;
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    measureSetWidth();
    window.addEventListener("resize", measureSetWidth);
    return () => window.removeEventListener("resize", measureSetWidth);
  }, [measureSetWidth]);

  const normalizeInfiniteScroll = useCallback(() => {
    const container = containerRef.current;
    const setWidth = singleSetWidthRef.current;
    if (!container || setWidth <= 0) return;

    if (container.scrollLeft >= setWidth * 2) {
      container.scrollLeft -= setWidth;
      exactScrollLeftRef.current -= setWidth;
    } else if (container.scrollLeft <= setWidth * 0.1) {
      container.scrollLeft += setWidth;
      exactScrollLeftRef.current += setWidth;
    }
  }, []);

  const pauseAutoplayTemporarily = useCallback(() => {
    isPausedRef.current = true;
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    resumeTimeoutRef.current = setTimeout(() => {
      const container = containerRef.current;
      if (container) {
        exactScrollLeftRef.current = container.scrollLeft;
      }
      lastTimestampRef.current = null;
      isPausedRef.current = false;
    }, 2500);
  }, []);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, []);

  // Single stable requestAnimationFrame loop (~27 px/sec)
  useEffect(() => {
    const speedPixelsPerSecond = 27;

    const animate = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }

      const deltaSeconds = Math.min(
        (timestamp - lastTimestampRef.current) / 1000,
        0.1
      );
      lastTimestampRef.current = timestamp;

      const container = containerRef.current;
      const setWidth = singleSetWidthRef.current;

      if (
        container &&
        setWidth > 0 &&
        !isPausedRef.current &&
        !isDraggingRef.current &&
        !reducedMotion
      ) {
        exactScrollLeftRef.current += speedPixelsPerSecond * deltaSeconds;
        container.scrollLeft = exactScrollLeftRef.current;
        normalizeInfiniteScroll();
      }

      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    animationFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [reducedMotion, normalizeInfiniteScroll]);

  // Mouse Drag / Touch / Wheel Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const container = containerRef.current;
    if (!container) return;

    isDraggingRef.current = true;
    setIsDragging(true);
    pauseAutoplayTemporarily();
    dragStartXRef.current = e.pageX - container.offsetLeft;
    dragStartScrollLeftRef.current = container.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;

    const x = e.pageX - container.offsetLeft;
    const walk = (x - dragStartXRef.current) * 1.25;
    container.scrollLeft = dragStartScrollLeftRef.current - walk;
    exactScrollLeftRef.current = container.scrollLeft;
    normalizeInfiniteScroll();
  };

  const handleMouseUpOrLeave = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
      pauseAutoplayTemporarily();
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    pauseAutoplayTemporarily();
    const container = containerRef.current;
    if (!container) return;

    if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      exactScrollLeftRef.current = container.scrollLeft;
      normalizeInfiniteScroll();
    }
  };

  // Duplicate member set 3 times for seamless infinite loop (Set 1, Set 2, Set 3)
  const infiniteMembers = [
    ...GOVERNING_BODY_MEMBERS,
    ...GOVERNING_BODY_MEMBERS,
    ...GOVERNING_BODY_MEMBERS,
  ];

  return (
    <section
      aria-labelledby="governing-body-carousel-heading"
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#FDFCF8] via-pure-white to-warm-white py-10 sm:py-12 md:py-14 border-b border-soft-border/40"
    >
      <Container>
        {/* Compact Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-6 sm:mb-8">
          <RevealCard as="div" index={0}>
            <span className="eyebrow-label text-impact-green font-heading text-xs sm:text-sm font-bold tracking-widest uppercase block mb-1.5">
              EXECUTIVE COUNCIL
            </span>
            <h2
              id="governing-body-carousel-heading"
              className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-udbhav-blue-deep tracking-tight mb-2"
            >
              Governing Body
            </h2>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
              Meet the dedicated leaders guiding UDBHAV Foundation’s vision,
              programmes, operations, and community impact.
            </p>
          </RevealCard>
        </div>
      </Container>

      {/* Horizontal Carousel Track Area */}
      <div className="relative w-full">
        {/* Soft Left Fade Edge */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 bottom-0 left-0 w-8 sm:w-16 z-10 bg-gradient-to-r from-[#FDFCF8] to-transparent"
        />

        {/* Scrollable Single Row Container */}
        <div
          ref={containerRef}
          role="region"
          aria-label="Governing Body members — horizontally scrollable"
          onMouseEnter={pauseAutoplayTemporarily}
          onMouseLeave={handleMouseUpOrLeave}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onTouchStart={pauseAutoplayTemporarily}
          onTouchMove={pauseAutoplayTemporarily}
          onScroll={normalizeInfiniteScroll}
          onWheel={handleWheel}
          className={`flex overflow-x-auto scrollbar-none select-none py-3 px-4 sm:px-8 ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          style={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <div
            ref={trackRef}
            className="flex items-stretch gap-4 sm:gap-5 flex-nowrap"
          >
            {infiniteMembers.map((member, index) => (
              <GoverningBodyCarouselCard
                key={`${member.name}-${index}`}
                member={member}
              />
            ))}
          </div>
        </div>

        {/* Soft Right Fade Edge */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 bottom-0 right-0 w-8 sm:w-16 z-10 bg-gradient-to-l from-warm-white to-transparent"
        />
      </div>
    </section>
  );
}

export default GoverningBodyGridSection;
