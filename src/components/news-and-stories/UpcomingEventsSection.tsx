'use client';

import { MapPin, Clock, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import Link from 'next/link';
import React, { useRef, useState, useEffect, useCallback } from 'react';

import { AnimatedCardWrapper } from '@/components/shared/AnimatedCardWrapper';
import { Container } from '@/components/shared/Container';
import { LazyImage } from '@/components/shared/LazyImage';
import { UPCOMING_EVENTS } from '@/data/news-data';
import { EventStatus } from '@/types/news';

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
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        const container = scrollContainerRef.current;
        container.scrollLeft += 0.45;

        // Loop seamlessly if reached end
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 4) {
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
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const getStatusBadgeStyles = (status: EventStatus) => {
    switch (status) {
      case 'Registration Open':
        return {
          background: '#439B25',
          color: '#FFFFFF',
          border: 'border-transparent',
        };
      case 'Coming Soon':
        return {
          background: '#EAF3FF',
          color: '#12245F',
          border: 'border-[#12245F]/20',
        };
      case 'Registration Closing Soon':
        return {
          background: '#FFF4E5',
          color: '#B45309',
          border: 'border-amber-400',
        };
      case 'Registration Closed':
      case 'Completed':
      case 'Cancelled':
      default:
        return {
          background: '#F3F4F6',
          color: '#4B5563',
          border: 'border-gray-300',
        };
    }
  };

  return (
    <section
      id="upcoming-events"
      aria-labelledby="upcoming-events-heading"
      className="bg-pure-white border-soft-border/40 w-full border-b py-12 sm:py-16 md:py-20"
    >
      <Container>
        {/* Section Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:mb-10 md:flex-row md:items-end">
          <div>
            <span
              className="eyebrow-label mb-3 inline-block rounded-full border border-[#439B25]/25 bg-[#EEF8E9] px-3 py-1 font-heading text-xs font-bold uppercase tracking-widest sm:text-sm"
              style={{ color: '#439B25' }}
            >
              WHAT’S COMING NEXT
            </span>
            <h2
              id="upcoming-events-heading"
              className="font-heading text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl"
              style={{ color: '#12245F' }}
            >
              Upcoming Events
            </h2>
            <p className="mt-2 max-w-xl text-sm sm:text-base" style={{ color: '#5E6B63' }}>
              Be part of our upcoming programmes, campaigns, workshops, and community initiatives.
            </p>
          </div>

          {/* Manual Scroll Buttons */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              type="button"
              onClick={() => scrollByAmount(-350)}
              aria-label="Scroll left to previous upcoming events"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#12245F]/15 bg-[#FDFCF8] text-[#12245F] shadow-sm transition-all hover:border-[#439B25] hover:bg-[#EEF8E9]"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollByAmount(350)}
              aria-label="Scroll right to more upcoming events"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#12245F]/15 bg-[#FDFCF8] text-[#12245F] shadow-sm transition-all hover:border-[#439B25] hover:bg-[#EEF8E9]"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Upcoming Events Carousel Track */}
        {activeEvents.length === 0 ? (
          <div className="w-full rounded-3xl border border-[#12245F]/10 bg-[#FDFCF8] px-4 py-14 text-center">
            <Info className="mx-auto mb-3 h-10 w-10 text-[#439B25]" />
            <h3 className="font-heading text-lg font-bold text-[#12245F] sm:text-xl">
              No upcoming events have been announced yet.
            </h3>
            <p className="mx-auto mt-1 max-w-md text-sm text-[#5E6B63]">
              New programmes and community activities will appear here as soon as they are
              scheduled.
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
            className={`scrollbar-none flex select-none items-stretch gap-4 overflow-x-auto pb-4 sm:gap-6 ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
            }}
          >
            {activeEvents.map((ev) => {
              const statusStyles = getStatusBadgeStyles(ev.registrationStatus);

              return (
                <AnimatedCardWrapper
                  key={ev.id}
                  index={0}
                  className="flex w-[80vw] shrink-0 flex-col overflow-hidden rounded-[14px] border border-gray-100 bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.08)] sm:w-[280px] md:w-[300px]"
                >
                  {/* Cover Photo */}
                  <div className="relative h-36 w-full overflow-hidden bg-gray-50 sm:h-40">
                    <LazyImage
                      src={ev.imageUrl}
                      alt={ev.title}
                      fill
                      sizes="300px"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />

                    {/* Date Badge over image */}
                    <div className="absolute right-2.5 top-2.5 z-10 flex min-w-[44px] flex-col items-center justify-center rounded-lg border border-white/50 bg-white/95 px-1.5 py-1 shadow-sm backdrop-blur-md">
                      <span className="font-heading text-base font-bold leading-none text-[#12245F]">
                        {ev.dayMonthBadge.day}
                      </span>
                      <span className="mt-0.5 text-[9px] font-bold uppercase tracking-widest text-[#439B25]">
                        {ev.dayMonthBadge.month}
                      </span>
                    </div>

                    {/* Programme Category Badge */}
                    <div className="absolute bottom-2.5 left-2.5 z-10">
                      <span className="rounded bg-black/60 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-white backdrop-blur-md">
                        {ev.category}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4">
                    <div>
                      {/* Status Badge */}
                      <div className="mb-2 flex items-center justify-between">
                        <span
                          className={`inline-block rounded border px-2 py-0.5 text-[9px] font-bold tracking-wide ${statusStyles.border}`}
                          style={{
                            background: statusStyles.background,
                            color: statusStyles.color,
                          }}
                        >
                          {ev.registrationStatus}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="mb-1.5 font-heading text-base font-bold leading-snug text-[#12245F] transition-colors group-hover:text-[#439B25] sm:text-lg">
                        {ev.title}
                      </h3>
                    </div>

                    <div>
                      {/* Location & Time */}
                      <div className="mb-3 mt-3 space-y-1 border-t border-gray-50 pt-3 text-[11px] font-medium text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3 w-3 shrink-0 text-gray-400" />
                          <span className="truncate">{ev.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3 w-3 shrink-0 text-gray-400" />
                          <span>
                            {ev.startTime}
                            {ev.endTime ? ` – ${ev.endTime}` : ''}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        <Link
                          href={`/volunteers`}
                          className="flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-center text-[11px] font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-[#12245F]"
                        >
                          Details
                        </Link>

                        {ev.registrationStatus === 'Registration Open' && (
                          <Link
                            href={ev.registrationUrl || '/volunteers'}
                            className="flex-1 rounded-lg bg-[#439B25] px-2 py-1.5 text-center text-[11px] font-medium text-white shadow-sm transition-colors hover:bg-[#38841F]"
                          >
                            Register
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
