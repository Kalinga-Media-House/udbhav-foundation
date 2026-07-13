"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Info,
} from "lucide-react";
import { Container } from "@/components/shared/Container";
import { LazyImage } from "@/components/shared/LazyImage";
import { AnimatedCardWrapper } from "@/components/shared/AnimatedCardWrapper";
import { UPCOMING_EVENTS } from "@/data/news-data";
import { EventStatus } from "@/types/news";

export function UpcomingEventsSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const startXRef = useRef<number>(0);
  const scrollLeftRef = useRef<number>(0);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeEvents = UPCOMING_EVENTS;

  const pauseAutoScrollForAWhile = useCallback(() => {
    setIsPaused(true);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 3000);
  }, []);

  // Continuous slow auto-scroll (right-to-left)
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

        // Loop seamlessly if reached end
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

  const getStatusBadgeStyles = (status: EventStatus) => {
    switch (status) {
      case "Registration Open":
        return {
          background: "#439B25",
          color: "#FFFFFF",
          border: "border-transparent",
        };
      case "Coming Soon":
        return {
          background: "#EAF3FF",
          color: "#12245F",
          border: "border-[#12245F]/20",
        };
      case "Registration Closing Soon":
        return {
          background: "#FFF4E5",
          color: "#B45309",
          border: "border-amber-400",
        };
      case "Registration Closed":
      case "Completed":
      case "Cancelled":
      default:
        return {
          background: "#F3F4F6",
          color: "#4B5563",
          border: "border-gray-300",
        };
    }
  };

  return (
    <section
      id="upcoming-events"
      aria-labelledby="upcoming-events-heading"
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
              WHAT’S COMING NEXT
            </span>
            <h2
              id="upcoming-events-heading"
              className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight"
              style={{ color: "#12245F" }}
            >
              Upcoming Events
            </h2>
            <p
              className="text-sm sm:text-base mt-2 max-w-xl"
              style={{ color: "#5E6B63" }}
            >
              Be part of our upcoming programmes, campaigns, workshops, and
              community initiatives.
            </p>
          </div>

          {/* Manual Scroll Buttons */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              type="button"
              onClick={() => scrollByAmount(-350)}
              aria-label="Scroll left to previous upcoming events"
              className="w-10 h-10 rounded-full bg-[#FDFCF8] border border-[#12245F]/15 flex items-center justify-center text-[#12245F] hover:bg-[#EEF8E9] hover:border-[#439B25] transition-all cursor-pointer shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollByAmount(350)}
              aria-label="Scroll right to more upcoming events"
              className="w-10 h-10 rounded-full bg-[#FDFCF8] border border-[#12245F]/15 flex items-center justify-center text-[#12245F] hover:bg-[#EEF8E9] hover:border-[#439B25] transition-all cursor-pointer shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Upcoming Events Carousel Track */}
        {activeEvents.length === 0 ? (
          <div className="w-full py-14 rounded-3xl bg-[#FDFCF8] border border-[#12245F]/10 text-center px-4">
            <Info className="w-10 h-10 text-[#439B25] mx-auto mb-3" />
            <h3 className="font-heading text-lg sm:text-xl font-bold text-[#12245F]">
              No upcoming events have been announced yet.
            </h3>
            <p className="text-sm text-[#5E6B63] mt-1 max-w-md mx-auto">
              New programmes and community activities will appear here as soon
              as they are scheduled.
            </p>
          </div>
        ) : (
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
            {activeEvents.map((ev) => {
              const statusStyles = getStatusBadgeStyles(ev.registrationStatus);

              return (
                <AnimatedCardWrapper
                  key={ev.id}
                  index={0}
                  className="w-[84vw] sm:w-[320px] md:w-[350px] shrink-0 flex flex-col rounded-2xl bg-pure-white border border-[#12245F]/10 overflow-hidden"
                >
                  {/* Cover Photo + Overlay Date Badge */}
                  <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-[#EAF3FF]">
                    <LazyImage
                      src={ev.imageUrl}
                      alt={ev.title}
                      fill
                      sizes="350px"
                      className="object-cover group-hover:scale-[1.025]"
                    />

                    {/* Date Badge over image */}
                    <div className="absolute top-3 right-3 z-10 flex flex-col items-center justify-center min-w-[52px] py-1.5 px-2 rounded-xl bg-pure-white/95 backdrop-blur-sm shadow-md border border-white">
                      <span className="font-heading text-lg font-bold leading-none text-[#12245F]">
                        {ev.dayMonthBadge.day}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#439B25]">
                        {ev.dayMonthBadge.month}
                      </span>
                    </div>

                    {/* Programme Category Badge */}
                    <div className="absolute bottom-3 left-3 z-10">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-heading font-bold uppercase tracking-wider bg-[#12245F]/90 text-white backdrop-blur-sm">
                        {ev.category}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Status Badge */}
                      <div className="mb-2.5 flex items-center justify-between">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-heading font-bold border ${statusStyles.border}`}
                          style={{
                            background: statusStyles.background,
                            color: statusStyles.color,
                          }}
                        >
                          {ev.registrationStatus}
                        </span>

                        {ev.registrationDeadline && (
                          <span className="text-[11px] font-medium text-[#5E6B63]">
                            Deadline: {ev.registrationDeadline}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="font-heading text-lg sm:text-xl font-bold text-[#12245F] leading-snug mb-2 group-hover:text-[#439B25] transition-colors">
                        {ev.title}
                      </h3>

                      {/* Short Description */}
                      <p className="text-xs sm:text-sm text-[#5E6B63] leading-relaxed line-clamp-3 mb-4">
                        {ev.description}
                      </p>
                    </div>

                    <div>
                      {/* Location & Time */}
                      <div className="space-y-1.5 pt-3 border-t border-soft-border/40 text-xs font-medium text-[#17231D] mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#439B25] shrink-0" />
                          <span className="truncate">{ev.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-[#439B25] shrink-0" />
                          <span>{ev.eventDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-[#439B25] shrink-0" />
                          <span>
                            {ev.startTime}
                            {ev.endTime ? ` – ${ev.endTime}` : ""}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        <Link
                          href={`/volunteers`}
                          className="flex-1 text-center py-2 px-3 rounded-xl border border-[#12245F]/20 text-xs sm:text-sm font-heading font-semibold text-[#12245F] hover:bg-[#EAF3FF] transition-colors"
                        >
                          View Details
                        </Link>

                        {ev.registrationStatus === "Registration Open" && (
                          <Link
                            href={ev.registrationUrl || "/volunteers"}
                            className="flex-1 text-center py-2 px-3 rounded-xl bg-[#439B25] hover:bg-[#38841F] text-xs sm:text-sm font-heading font-semibold text-white shadow-sm transition-colors inline-flex items-center justify-center gap-1"
                          >
                            Register Now
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </AnimatedCardWrapper>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}

export default UpcomingEventsSection;
