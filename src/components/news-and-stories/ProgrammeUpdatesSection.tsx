"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FolderOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  FileText,
} from "lucide-react";
import { Container } from "@/components/shared/Container";
import { LazyImage } from "@/components/shared/LazyImage";
import { AnimatedCardWrapper } from "@/components/shared/AnimatedCardWrapper";
import { PROGRAMME_UPDATE_SUMMARIES } from "@/data/news-data";

export function ProgrammeUpdatesSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const startXRef = useRef<number>(0);
  const scrollLeftRef = useRef<number>(0);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const summaries = PROGRAMME_UPDATE_SUMMARIES;

  const pauseAutoScrollForAWhile = useCallback(() => {
    setIsPaused(true);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 3000);
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const step = () => {
      if (
        !isPaused &&
        !isDragging &&
        scrollContainerRef.current &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        const container = scrollContainerRef.current;
        container.scrollLeft += 0.45;

        if (
          container.scrollLeft + container.clientWidth >=
          container.scrollWidth - 4
        ) {
          container.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, [isPaused, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    pauseAutoScrollForAWhile();
    startXRef.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      pauseAutoScrollForAWhile();
    }
  };

  const scrollByAmount = (offset: number) => {
    pauseAutoScrollForAWhile();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <section
      id="programme-updates"
      aria-labelledby="programme-updates-heading"
      className="w-full py-12 sm:py-16 md:py-20 bg-pure-white border-b border-soft-border/40"
    >
      <Container>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <span
              className="eyebrow-label font-heading text-xs sm:text-sm font-bold tracking-widest uppercase inline-block px-3 py-1 rounded-full bg-[#EEF8E9] border border-[#439B25]/25 mb-3"
              style={{ color: "#439B25" }}
            >
              FROM OUR 11 INITIATIVES
            </span>
            <h2
              id="programme-updates-heading"
              className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight"
              style={{ color: "#12245F" }}
            >
              Programme Updates
            </h2>
            <p
              className="text-sm sm:text-base mt-2 max-w-xl"
              style={{ color: "#5E6B63" }}
            >
              Explore recent activities and progress from UDBHAV
              Foundation&rsquo;s 11 core community action programmes.
            </p>
          </div>

          {/* Manual Controls */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              type="button"
              onClick={() => scrollByAmount(-320)}
              aria-label="Scroll left to previous programme updates"
              className="w-10 h-10 rounded-full bg-[#FDFCF8] border border-[#12245F]/15 flex items-center justify-center text-[#12245F] hover:bg-[#EEF8E9] hover:border-[#439B25] transition-all cursor-pointer shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollByAmount(320)}
              aria-label="Scroll right to more programme updates"
              className="w-10 h-10 rounded-full bg-[#FDFCF8] border border-[#12245F]/15 flex items-center justify-center text-[#12245F] hover:bg-[#EEF8E9] hover:border-[#439B25] transition-all cursor-pointer shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Programme Updates Carousel */}
        <div
          ref={scrollContainerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={handleMouseUpOrLeave}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onTouchStart={pauseAutoScrollForAWhile}
          onFocus={pauseAutoScrollForAWhile}
          className={`flex items-stretch gap-4 sm:gap-6 overflow-x-auto scrollbar-none select-none pb-4 ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          style={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
          }}
        >
          {summaries.map((item) => {
            return (
              <AnimatedCardWrapper
                key={item.programmeSlug}
                index={0}
                className="w-[82vw] sm:w-[300px] md:w-[320px] shrink-0 flex flex-col rounded-2xl bg-[#FDFCF8] border border-[#12245F]/10 overflow-hidden"
              >
                {/* Cover Image */}
                <div className="relative h-40 w-full overflow-hidden bg-[#EAF3FF]">
                  <LazyImage
                    src={item.coverImageUrl}
                    alt={item.programmeTitle}
                    fill
                    sizes="320px"
                    className="object-cover group-hover:scale-[1.025]"
                  />

                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-heading font-bold uppercase bg-[#12245F]/90 text-white backdrop-blur-sm">
                      <FolderOpen className="w-3 h-3 text-[#439B25]" />
                      {item.iconName}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Updates Counter */}
                    <div className="flex items-center justify-between text-xs font-semibold text-[#439B25] mb-2">
                      <span className="inline-flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        {item.publishedUpdatesCount} Published Updates
                      </span>
                      <span className="text-[#5E6B63] font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.latestActivityDate}
                      </span>
                    </div>

                    {/* Programme Title */}
                    <h3 className="font-heading text-lg font-bold text-[#12245F] mb-2 group-hover:text-[#439B25] transition-colors">
                      {item.programmeTitle}
                    </h3>

                    {/* Latest Update Preview */}
                    <div className="p-3 rounded-xl bg-pure-white border border-[#12245F]/10 mb-4">
                      <div className="text-[11px] font-bold uppercase text-[#5E6B63] mb-1">
                        Latest Activity
                      </div>
                      <div className="text-xs font-semibold text-[#17231D] line-clamp-2">
                        {item.latestUpdateTitle}
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/gallery`}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-pure-white border border-[#12245F]/20 text-xs sm:text-sm font-heading font-semibold text-[#12245F] hover:bg-[#439B25] hover:text-white hover:border-[#439B25] transition-all"
                  >
                    View Programme Updates
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </AnimatedCardWrapper>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export default ProgrammeUpdatesSection;
