"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  GraduationCap,
  Trees,
  HeartPulse,
  CalendarDays,
  ClipboardList,
  Camera,
  Laptop,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { Container } from "@/components/shared/Container";
import { RevealCard } from "@/components/shared/RevealCard";

export interface OpportunityCategory {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const OPPORTUNITY_CATEGORIES: OpportunityCategory[] = [
  {
    title: "Education & Mentorship",
    description:
      "Support students through teaching, mentoring, study-material distribution, career guidance, and educational programmes.",
    icon: GraduationCap,
  },
  {
    title: "Environmental Action",
    description:
      "Participate in plantation drives, climate-awareness programmes, cleanliness initiatives, and sustainability campaigns.",
    icon: Trees,
  },
  {
    title: "Health & Well-being",
    description:
      "Support health camps, mental-health awareness, blood-donation initiatives, sanitation programmes, and community outreach.",
    icon: HeartPulse,
  },
  {
    title: "Events & Campaigns",
    description:
      "Help plan, coordinate, promote, and execute social campaigns, awareness programmes, workshops, and community events.",
    icon: CalendarDays,
  },
  {
    title: "Research & Community Surveys",
    description:
      "Assist with field surveys, data collection, community research, impact assessment, documentation, and reporting.",
    icon: ClipboardList,
  },
  {
    title: "Media & Communication",
    description:
      "Contribute through photography, videography, graphic design, social-media management, storytelling, writing, and public communication.",
    icon: Camera,
  },
  {
    title: "Technology & Digital Support",
    description:
      "Support website development, digital systems, data management, cybersecurity awareness, and technology-based social initiatives.",
    icon: Laptop,
  },
  {
    title: "Emergency & Community Support",
    description:
      "Participate in emergency response, blood-donation coordination, relief activities, and urgent community-support initiatives.",
    icon: ShieldAlert,
  },
];

function OpportunityCarouselCard({
  category,
  onInterested,
  isDuplicate = false,
}: {
  category: OpportunityCategory;
  onInterested: (title: string) => void;
  isDuplicate?: boolean;
}) {
  const IconComponent = category.icon;

  return (
    <div
      aria-hidden={isDuplicate ? "true" : undefined}
      className="group relative flex flex-col justify-between rounded-2xl bg-[#FDFCF8] p-[15px] sm:p-[18px] border border-[#12245F]/10 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md hover:border-[#439B25]/50 active:scale-[1.015] shrink-0 w-[230px] min-w-[230px] sm:w-[245px] sm:min-w-[245px] lg:w-[270px] lg:min-w-[270px] h-full"
      style={{ flex: "0 0 auto" }}
    >
      <div className="flex flex-col flex-1">
        {/* Category Icon */}
        <div
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-105 shrink-0"
          style={{ background: "#EEF8E9", color: "#439B25" }}
        >
          <IconComponent className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[1.8]" />
        </div>

        {/* Category Title */}
        <h3
          className="font-heading text-[15px] lg:text-[17px] font-bold mb-1.5 leading-[1.25]"
          style={{ color: "#12245F" }}
        >
          {category.title}
        </h3>

        {/* Short Description with CSS 4-line clamping and full accessible title */}
        <p
          title={category.description}
          className="text-[12px] lg:text-[13px] leading-[1.45] lg:leading-[1.55] line-clamp-4 mb-4 flex-1"
          style={{ color: "#5E6B63" }}
        >
          {category.description}
        </p>
      </div>

      {/* "I'm Interested" Action Button at bottom */}
      <button
        type="button"
        tabIndex={isDuplicate ? -1 : 0}
        onClick={() => onInterested(category.title)}
        className="w-full h-[38px] inline-flex items-center justify-between px-3 rounded-xl font-heading text-[13px] font-semibold transition-all duration-200 cursor-pointer group/btn mt-auto shrink-0"
        style={{
          background: "#EAF3FF",
          color: "#202B78",
        }}
      >
        <span>I’m Interested</span>
        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
      </button>
    </div>
  );
}

export function VolunteerOpportunitiesSection() {
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
  const didDragMovedRef = useRef<boolean>(false);

  const handleInterested = useCallback((categoryTitle: string) => {
    // Avoid triggering button if user was dragging the carousel
    if (didDragMovedRef.current) return;

    window.dispatchEvent(
      new CustomEvent("select-volunteer-area", { detail: categoryTitle })
    );

    const formElem = document.getElementById("volunteer-application");
    if (formElem) {
      formElem.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Measure single set width (8 cards)
  const measureSetWidth = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const children = track.children;
    if (children.length >= 16) {
      const firstChild = children[0] as HTMLElement;
      const ninthChild = children[8] as HTMLElement;
      const setWidth = ninthChild.offsetLeft - firstChild.offsetLeft;
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
    }, 2800);
  }, []);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, []);

  // RequestAnimationFrame loop for linear right-to-left scrolling
  useEffect(() => {
    // Speed: ~48 px/sec gives ~48s cycle for 8 cards on desktop
    const speedPixelsPerSecond = 48;

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

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const container = containerRef.current;
    if (!container) return;

    isDraggingRef.current = true;
    didDragMovedRef.current = false;
    setIsDragging(true);
    pauseAutoplayTemporarily();
    dragStartXRef.current = e.pageX - container.offsetLeft;
    dragStartScrollLeftRef.current = container.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const container = containerRef.current;
    if (!container) return;

    const x = e.pageX - container.offsetLeft;
    const walk = (x - dragStartXRef.current) * 1.25;
    if (Math.abs(walk) > 4) {
      didDragMovedRef.current = true;
    }
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

  // Duplicate sequence 3 times (Set 1, Set 2, Set 3) for seamless loop
  const carouselCategories = [
    ...OPPORTUNITY_CATEGORIES,
    ...OPPORTUNITY_CATEGORIES,
    ...OPPORTUNITY_CATEGORIES,
  ];

  return (
    <section
      id="volunteer-opportunities"
      aria-labelledby="opportunities-heading"
      className="relative w-full py-12 sm:py-16 md:py-20 bg-pure-white border-b border-soft-border/40 scroll-mt-20 overflow-hidden"
    >
      <Container>
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-8 sm:mb-10">
          <RevealCard as="div" index={0}>
            <span
              className="eyebrow-label font-heading text-xs sm:text-sm font-bold tracking-widest uppercase block mb-2"
              style={{ color: "#439B25" }}
            >
              OPPORTUNITIES
            </span>
            <h2
              id="opportunities-heading"
              className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3"
              style={{ color: "#12245F" }}
            >
              Find Your Way to Contribute
            </h2>
            <p
              className="text-sm sm:text-base leading-relaxed"
              style={{ color: "#5E6B63" }}
            >
              Whether you can volunteer regularly or support a single
              initiative, there is a place for your skills and passion at UDBHAV.
            </p>
          </RevealCard>
        </div>
      </Container>

      {/* Horizontal Single-Row Carousel Track Container */}
      <div className="relative w-full">
        {/* Soft Left Fade Edge Mask */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 bottom-0 left-0 w-6 sm:w-14 z-10 bg-gradient-to-r from-pure-white to-transparent"
        />

        {/* Scrollable Single Row Container */}
        <div
          ref={containerRef}
          role="region"
          aria-label="Volunteer opportunities — horizontally scrollable carousel"
          onMouseEnter={pauseAutoplayTemporarily}
          onMouseLeave={handleMouseUpOrLeave}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onTouchStart={pauseAutoplayTemporarily}
          onTouchMove={pauseAutoplayTemporarily}
          onFocusCapture={pauseAutoplayTemporarily}
          onScroll={normalizeInfiniteScroll}
          onWheel={handleWheel}
          className={`flex overflow-x-auto overflow-y-hidden select-none py-3 px-4 sm:px-8 [&::-webkit-scrollbar]:h-1.5 sm:[&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:bg-[#439B25]/30 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          style={{
            WebkitOverflowScrolling: "touch",
            touchAction: "pan-x",
          }}
        >
          <div
            ref={trackRef}
            className="flex items-stretch gap-4 sm:gap-5 flex-nowrap"
          >
            {carouselCategories.map((cat, index) => {
              // Only first 8 items are the primary accessible sequence; duplicates are hidden from screen readers/tab order
              const isDuplicate = index >= OPPORTUNITY_CATEGORIES.length;
              return (
                <OpportunityCarouselCard
                  key={`${cat.title}-${index}`}
                  category={cat}
                  onInterested={handleInterested}
                  isDuplicate={isDuplicate}
                />
              );
            })}
          </div>
        </div>

        {/* Soft Right Fade Edge Mask */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 bottom-0 right-0 w-6 sm:w-14 z-10 bg-gradient-to-l from-pure-white to-transparent"
        />
      </div>
    </section>
  );
}

export default VolunteerOpportunitiesSection;
