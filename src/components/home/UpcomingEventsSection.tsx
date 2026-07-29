"use client";

import { ArrowRight, MapPin, Clock, Calendar } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";

import { AnimatedCardWrapper } from "@/components/shared/AnimatedCardWrapper";
import { LazyImage } from "@/components/shared/LazyImage";
import { RevealCard } from "@/components/shared/RevealCard";

// Data Structure
export interface UpcomingEvent {
  id: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  eventDate: string; // YYYY-MM-DD
  startTime: string;
  endTime?: string;
  location: string;
  image: string;
  registrationStatus: "Registration Open" | "Registration Closing Soon" | "Coming Soon";
  registrationLink?: string;
  isFeatured?: boolean;
}

// Reusable Mock Data
const UPCOMING_EVENTS: UpcomingEvent[] = [
  {
    id: "evt-01",
    title: "Community Health & Wellness Camp",
    slug: "community-health-camp",
    category: "Health",
    shortDescription: "Free general health check-up, eye screening, and medical consultations for the local community.",
    eventDate: "2026-08-15", // Future date
    startTime: "09:00 AM",
    endTime: "02:00 PM",
    location: "Community Center, Block 4",
    image: "/programmes/programme-04.png",
    registrationStatus: "Registration Open",
  },
  {
    id: "evt-02",
    title: "Green Future Plantation Drive",
    slug: "green-future-plantation",
    category: "Environment",
    shortDescription: "Join our volunteers to plant 500 native saplings and promote urban afforestation.",
    eventDate: "2026-08-22",
    startTime: "07:30 AM",
    location: "City Nature Park",
    image: "/programmes/programme-02.png",
    registrationStatus: "Registration Closing Soon",
  },
  {
    id: "evt-03",
    title: "UDBHAV Siksha Samman 2026",
    slug: "udbhav-siksha-samman",
    category: "Education",
    shortDescription: "Annual scholarship distribution and felicitation ceremony for meritorious underprivileged students.",
    eventDate: "2026-09-05",
    startTime: "10:00 AM",
    location: "Main Auditorium",
    image: "/programmes/programme-01.png",
    registrationStatus: "Coming Soon",
  },
];

export function UpcomingEventsSection() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1024);

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Auto-scroll refs
  const singleSetWidthRef = useRef<number>(0);
  const exactScrollLeftRef = useRef<number>(0);
  const isInteractionPausedRef = useRef<boolean>(false);
  const isHoveredRef = useRef<boolean>(false);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  
  const dragStartXRef = useRef<number>(0);
  const dragStartScrollLeftRef = useRef<number>(0);

  // Filter valid upcoming events and sort by date
  const validEvents = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return UPCOMING_EVENTS
      .filter((ev) => ev.eventDate >= today)
      .sort((a, b) => a.eventDate.localeCompare(b.eventDate))
      .slice(0, 3); // Max 3 on desktop
  }, []);

  // Listen for reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    queueMicrotask(() => setReducedMotion(mediaQuery.matches));
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Track window width
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Visibility change pause
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isInteractionPausedRef.current = true;
      } else {
        lastTimestampRef.current = null;
        isInteractionPausedRef.current = false;
        if (containerRef.current) {
          exactScrollLeftRef.current = containerRef.current.scrollLeft;
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const measureSetWidth = useCallback(() => {
    if (windowWidth >= 768) return; // Only relevant for mobile carousel
    const track = trackRef.current;
    if (!track) return;
    const children = track.children;
    const originalCount = validEvents.length;
    
    // Find the first original child and the first duplicate child
    if (children.length >= originalCount * 2) {
      const firstChild = children[0] as HTMLElement;
      const nextSetChild = children[originalCount] as HTMLElement;
      const setWidth = nextSetChild.offsetLeft - firstChild.offsetLeft;
      if (setWidth > 0) {
        singleSetWidthRef.current = setWidth;
        if (exactScrollLeftRef.current === 0 && containerRef.current) {
          containerRef.current.scrollLeft = setWidth;
          exactScrollLeftRef.current = setWidth;
        }
      }
    }
  }, [validEvents.length, windowWidth]);

  useEffect(() => {
    measureSetWidth();
  }, [measureSetWidth]);

  const normalizeInfiniteScroll = useCallback(() => {
    const container = containerRef.current;
    const setWidth = singleSetWidthRef.current;
    if (!container || setWidth <= 0 || windowWidth >= 768) return;

    if (container.scrollLeft >= setWidth * 2) {
      container.scrollLeft -= setWidth;
      exactScrollLeftRef.current -= setWidth;
    } else if (container.scrollLeft <= setWidth * 0.1) {
      container.scrollLeft += setWidth;
      exactScrollLeftRef.current += setWidth;
    }
  }, [windowWidth]);

  const pauseAutoplayTemporarily = useCallback(() => {
    isInteractionPausedRef.current = true;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      const container = containerRef.current;
      if (container) exactScrollLeftRef.current = container.scrollLeft;
      lastTimestampRef.current = null;
      isInteractionPausedRef.current = false;
    }, 3000);
  }, []);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, []);

  // RequestAnimationFrame Auto-scroll
  useEffect(() => {
    if (reducedMotion || validEvents.length === 0) return;
    const speedPixelsPerSecond = 20;

    const animate = (timestamp: number) => {
      if (window.innerWidth >= 768) {
        // Pause on desktop
        lastTimestampRef.current = null;
        animationFrameIdRef.current = requestAnimationFrame(animate);
        return;
      }

      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }

      const deltaSeconds = Math.min((timestamp - lastTimestampRef.current) / 1000, 0.1);
      lastTimestampRef.current = timestamp;

      const container = containerRef.current;
      const setWidth = singleSetWidthRef.current;

      if (
        container &&
        setWidth > 0 &&
        !isInteractionPausedRef.current &&
        !isHoveredRef.current &&
        !isDraggingRef.current
      ) {
        if (Math.abs(container.scrollLeft - exactScrollLeftRef.current) > 1.5) {
          exactScrollLeftRef.current = container.scrollLeft;
        }
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
  }, [reducedMotion, normalizeInfiniteScroll, validEvents.length]);

  // Interaction handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0 || windowWidth >= 768) return;
    const container = containerRef.current;
    if (!container) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    pauseAutoplayTemporarily();
    dragStartXRef.current = e.pageX - container.offsetLeft;
    dragStartScrollLeftRef.current = container.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || windowWidth >= 768) return;
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;
    const x = e.pageX - container.offsetLeft;
    const walk = (x - dragStartXRef.current) * 1.5;
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
    isHoveredRef.current = false;
  };

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    if (containerRef.current) exactScrollLeftRef.current = containerRef.current.scrollLeft;
  };

  const handleTouchStart = () => {
    if (windowWidth >= 768) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    pauseAutoplayTemporarily();
  };

  const handleTouchMove = () => {
    if (windowWidth >= 768) return;
    if (containerRef.current) exactScrollLeftRef.current = containerRef.current.scrollLeft;
    pauseAutoplayTemporarily();
  };

  const handleTouchEnd = () => {
    if (windowWidth >= 768) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    pauseAutoplayTemporarily();
  };

  const renderRegistrationBadge = (status: UpcomingEvent["registrationStatus"]) => {
    let bgColor = "";
    switch (status) {
      case "Registration Open":
        bgColor = "bg-impact-green text-pure-white";
        break;
      case "Registration Closing Soon":
        bgColor = "bg-amber-500 text-pure-white";
        break;
      case "Coming Soon":
      default:
        bgColor = "bg-[#12245F]/10 text-udbhav-blue-deep";
        break;
    }
    return (
      <span className={`inline-flex items-center px-2 py-0.5 md:px-2.5 md:py-1 rounded-full text-[9px] md:text-[10px] font-heading font-bold uppercase tracking-wider ${bgColor}`}>
        {status}
      </span>
    );
  };

  const renderDateBadge = (dateString: string) => {
    const d = new Date(dateString);
    const day = d.getDate();
    const month = d.toLocaleString('en-US', { month: 'short' });
    return (
      <div className="absolute top-3 right-3 md:top-4 md:right-4 z-20 flex flex-col items-center justify-center bg-pure-white rounded-lg shadow-md border border-soft-border/50 w-10 h-10 md:w-12 md:h-12 overflow-hidden">
        <div className="bg-impact-green w-full text-center py-0.5 text-[9px] md:text-[10px] font-bold text-pure-white uppercase tracking-wider">
          {month}
        </div>
        <div className="flex-1 flex items-center justify-center text-udbhav-blue-deep font-heading font-bold text-base md:text-lg leading-none">
          {day}
        </div>
      </div>
    );
  };

  // Duplicate for infinite carousel on mobile
  const displayEvents = windowWidth < 768 && validEvents.length > 0
    ? [...validEvents, ...validEvents, ...validEvents]
    : validEvents;

  return (
    <section className="relative w-full overflow-hidden bg-warm-white py-10 md:py-16 border-b border-soft-border/40">
      {/* Decorative background element */}
      <div className="pointer-events-none absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-impact-green/5 blur-3xl translate-x-1/3 -translate-y-1/3" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <RevealCard as="div" index={0} className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 md:mb-8">
          <div>
            <span className="inline-block text-xs sm:text-sm font-heading font-bold text-impact-green tracking-wider uppercase mb-2">
              UPCOMING EVENTS
            </span>
            <h2 className="font-heading text-[26px] md:text-3xl lg:text-4xl font-bold text-udbhav-blue-deep tracking-tight leading-tight mb-2">
              Be Part of What&apos;s Coming Next
            </h2>
            <div className="h-1 w-14 rounded-full bg-impact-green mb-3" aria-hidden="true" />
            <p className="text-sm md:text-base text-text-secondary leading-[1.6] max-w-2xl">
              Discover upcoming programmes, community initiatives and opportunities to participate in meaningful action.
            </p>
          </div>
          
          <div className="hidden md:block shrink-0">
            <Link href="/news-and-stories" className="inline-flex items-center gap-2 text-sm sm:text-base font-heading font-semibold text-env-green hover:text-impact-green transition-colors py-2 group/link">
              <span>View All Events</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1" />
            </Link>
          </div>
        </RevealCard>

        {/* Content */}
        {validEvents.length === 0 ? (
          <RevealCard as="div" index={1} className="bg-pure-white rounded-2xl border border-soft-border p-8 text-center shadow-sm">
            <p className="text-text-secondary text-base mb-6">
              No upcoming events have been announced yet. Follow our latest updates for future programmes and opportunities.
            </p>
            <Link href="/news-and-stories" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-impact-green hover:bg-env-green text-pure-white font-heading font-semibold text-sm transition-all shadow-md">
              Explore News & Stories
            </Link>
          </RevealCard>
        ) : (
          <div className="relative w-full">
            <div className="w-full overflow-hidden [mask-image:none] md:[mask-image:none] max-md:[mask-image:linear-gradient(to_right,transparent_0%,black_5%,black_95%,transparent_100%)]">
              <div
                ref={containerRef}
                className={`w-full max-md:overflow-x-auto max-md:overflow-y-hidden select-none focus:outline-none max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden ${
                  windowWidth < 768 && isDragging ? "cursor-grabbing" : windowWidth < 768 ? "cursor-grab" : ""
                }`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseUpOrLeave}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                  touchAction: windowWidth < 768 ? "pan-x" : "auto",
                }}
              >
                <div
                  ref={trackRef}
                  className="flex max-md:w-max max-md:gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 items-stretch"
                >
                  {displayEvents.map((event, idx) => {
                    return (
                      <AnimatedCardWrapper
                        key={`${event.id}-${idx}`}
                        index={idx % 3}
                        className={`flex flex-col h-full bg-pure-white rounded-[14px] md:rounded-2xl border border-impact-green/20 shadow-sm overflow-hidden group shrink-0 ${
                          windowWidth < 768 ? "w-[80vw] max-w-[310px]" : "w-full"
                        }`}
                      >
                        {/* Image Section */}
                        <div className="relative w-full h-[125px] md:h-[160px] overflow-hidden bg-warm-white shrink-0">
                          <LazyImage
                            src={event.image}
                            alt={event.title}
                            fill
                            sizes="(max-width: 768px) 85vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                          />
                          <div className="absolute top-3 left-3 md:top-4 md:left-4 z-20">
                            <span className="inline-block px-2 py-0.5 md:px-2.5 md:py-1 rounded-full text-[9px] md:text-[10px] font-heading font-bold uppercase tracking-wider bg-pure-white/90 text-udbhav-blue-deep backdrop-blur-sm shadow-sm">
                              {event.category}
                            </span>
                          </div>
                          {renderDateBadge(event.eventDate)}
                          {/* Inner gradient for text contrast if needed, but here we place info below image */}
                        </div>

                        {/* Content Section */}
                        <div className="flex flex-col flex-1 p-3.5 md:p-4 lg:p-5">
                          <div className="mb-2 md:mb-3">
                            {renderRegistrationBadge(event.registrationStatus)}
                          </div>
                          
                          <h3 className="font-heading text-[16px] md:text-lg lg:text-xl font-bold text-udbhav-blue-deep leading-[1.25] mb-1.5 line-clamp-2">
                            {event.title}
                          </h3>
                          
                          <p className="text-[12.5px] md:text-sm text-text-secondary leading-[1.45] mb-3 line-clamp-2 flex-1">
                            {event.shortDescription}
                          </p>
                          
                          <div className="flex flex-col gap-1 md:gap-1.5 mb-4 text-[11px] md:text-[12.5px] text-text-primary/80 font-medium">
                            <div className="flex items-start gap-2">
                              <Calendar className="w-4 h-4 text-impact-green shrink-0 mt-0.5" />
                              <span>
                                {new Date(event.eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Clock className="w-4 h-4 text-impact-green shrink-0 mt-0.5" />
                              <span>{event.startTime}{event.endTime ? ` - ${event.endTime}` : ''}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-impact-green shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{event.location}</span>
                            </div>
                          </div>
                          
                          <div className="mt-auto pt-3.5 border-t border-soft-border/50">
                            <Link
                              href={`/programmes/${event.slug}`}
                              className="inline-flex items-center justify-center w-full gap-2 py-1.5 md:py-2 rounded-lg bg-pure-white border-2 border-impact-green text-impact-green font-heading font-semibold text-[12.5px] md:text-[13.5px] lg:text-sm hover:bg-impact-green hover:text-pure-white transition-colors group/btn"
                            >
                              <span>{event.registrationStatus === "Registration Open" ? "Register Now" : "View Event"}</span>
                              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                            </Link>
                          </div>
                        </div>
                      </AnimatedCardWrapper>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile View All Button */}
        {validEvents.length > 0 && (
          <div className="mt-5 md:mt-6 text-center md:hidden">
            <Link href="/news-and-stories" className="inline-flex items-center justify-center gap-2 text-sm font-heading font-semibold text-env-green hover:text-impact-green transition-colors py-2 group/link">
              <span>View All Events</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default UpcomingEventsSection;
