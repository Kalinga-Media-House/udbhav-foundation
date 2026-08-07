'use client';

import { ArrowRight, Camera, Calendar, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useMemo, useEffect, useRef } from 'react';

import { ProgrammeCategory, IndexProgrammeDetail } from '@/types/index-programme';

const CATEGORY_TABS: { label: string; value: string }[] = [
  { label: 'All Programmes', value: 'all' },
  { label: 'Education', value: 'Education' },
  { label: 'Environment', value: 'Environment' },
  { label: 'Health & Well-being', value: 'Health & Well-being' },
  { label: 'Awareness & Safety', value: 'Awareness & Safety' },
  { label: 'Community Support', value: 'Community Support' },
];

function AnimatedProgrammeCard({ prog, index }: { prog: IndexProgrammeDetail; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const [pressState, setPressState] = useState<'idle' | 'pressed' | 'released'>('idle');
  const [btnPressed, setBtnPressed] = useState(false);

  const cardRef = useRef<HTMLElement>(null);
  const releaseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
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
      { threshold: 0.1 } // 10% visible to trigger early enough
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [reducedMotion]);

  const handlePointerDown = () => {
    if (reducedMotion) return;
    if (releaseTimeoutRef.current) clearTimeout(releaseTimeoutRef.current);
    setPressState('pressed');
  };

  const handlePointerUp = () => {
    if (reducedMotion || pressState !== 'pressed') return;
    setPressState('released');
    releaseTimeoutRef.current = setTimeout(() => {
      setPressState('idle');
    }, 300);
  };

  const handlePointerCancel = () => {
    if (reducedMotion) return;
    setPressState('idle');
  };

  // Entrance stagger: Max delay of 600ms so users don't wait too long
  const staggerDelay = Math.min(index * 100, 600);
  const isPressed = pressState === 'pressed';
  const isReleased = pressState === 'released';

  return (
    <article
      ref={cardRef}
      className="h-full"
      style={{
        opacity: isVisible || reducedMotion ? 1 : 0,
        transform:
          isVisible || reducedMotion ? 'translateY(0) scale(1)' : 'translateY(28px) scale(0.97)',
        transition: reducedMotion
          ? 'none'
          : `opacity 800ms cubic-bezier(0.22, 1, 0.36, 1) ${staggerDelay}ms, transform 800ms cubic-bezier(0.22, 1, 0.36, 1) ${staggerDelay}ms`,
        willChange: isVisible ? 'auto' : 'transform, opacity',
      }}
    >
      <div
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerCancel}
        onPointerCancel={handlePointerCancel}
        style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
        className={`ease-[cubic-bezier(0.22,1,0.36,1)] group flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all will-change-transform ${
          isPressed
            ? 'scale-[0.975] border-[#3C9D23]/25 duration-150'
            : isReleased
              ? 'duration-[200ms] scale-[1.015] border-[#3C9D23]/40 shadow-lg'
              : 'duration-[300ms] scale-100 border-[#3C9D23]/25 hover:-translate-y-[5px] hover:scale-[1.008] hover:border-[#3C9D23]/50 hover:shadow-xl'
        }`}
      >
        {/* Image Header with Number Badge */}
        <div className="relative h-48 w-full shrink-0 overflow-hidden bg-gray-100">
          <Image
            src={prog.coverImageUrl}
            alt={prog.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] scale-100 object-cover transition-transform group-hover:scale-[1.025] motion-reduce:transform-none"
          />

          {/* Programme Number Badge */}
          <div className="absolute left-3.5 top-3.5 z-10">
            <span className="rounded-full bg-[#172B6B] px-3 py-1 font-heading text-xs font-bold uppercase text-white shadow-md">
              {prog.programmeNumber}
            </span>
          </div>

          {/* Category Badge */}
          <div className="absolute right-3.5 top-3.5 z-10">
            <span className="rounded-full bg-[#3C9D23] px-3 py-1 font-heading text-xs font-semibold text-white shadow-md">
              {prog.category}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
          <div>
            <h3 className="mb-1.5 font-heading text-lg font-bold leading-snug text-[#172B6B] transition-colors group-hover:text-[#202B78] sm:text-xl">
              {prog.title}
            </h3>

            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#3C9D23]">
              {prog.tagline}
            </p>

            <p className="mb-5 line-clamp-3 text-xs leading-relaxed text-gray-600 sm:text-sm">
              {prog.shortDescription}
            </p>
          </div>

          <div>
            {/* Compact Impact Preview */}
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#3C9D23]/25 bg-[#F1F9ED] px-3 py-2">
              <TrendingUp className="h-4 w-4 shrink-0 text-[#3C9D23]" />
              <span className="truncate font-heading text-xs font-bold text-[#172B6B]">
                {prog.impactPreview}
              </span>
            </div>

            {/* Metadata counts row */}
            <div className="mb-4 flex flex-col gap-2 border-t border-gray-100 pt-3 text-xs text-gray-500">
              {(prog.programDate || prog.location) && (
                <div className="flex items-center justify-between">
                  {prog.programDate && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      {prog.programDate}
                    </span>
                  )}
                  {prog.location && (
                    <span className="flex items-center gap-1.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-400"
                      >
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span className="line-clamp-1 max-w-[120px]">{prog.location}</span>
                    </span>
                  )}
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Camera className="h-3.5 w-3.5 text-gray-400" />
                  {prog.photoCount} Photos
                </span>
                <span className="flex items-center gap-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-400"
                  >
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  {prog.eventCount} Activities
                </span>
              </div>
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
              className={`ease-[cubic-bezier(0.22,1,0.36,1)] group/btn inline-flex w-full items-center justify-between rounded-xl bg-[#EAF3FF] px-4 py-2.5 font-heading text-xs font-semibold text-[#172B6B] transition-all duration-300 sm:text-sm ${
                btnPressed
                  ? 'scale-[0.98] brightness-95'
                  : 'scale-100 hover:bg-[#172B6B] hover:text-white hover:brightness-110'
              }`}
            >
              <span>Explore Programme</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1 motion-reduce:transform-none" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export function ProgrammeDirectorySection({ programmes }: { programmes: IndexProgrammeDetail[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const filteredProgrammes = useMemo(() => {
    if (activeCategory === 'all') {
      return programmes;
    }
    return programmes.filter((prog) => prog.category === (activeCategory as ProgrammeCategory));
  }, [activeCategory, programmes]);

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
    <section id="programmes" className="scroll-mt-20 bg-[#FCFCF8] py-16 sm:py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Dynamic Category Filter Tabs */}
        <div className="no-scrollbar mb-10 flex items-center justify-start gap-2 overflow-x-auto pb-4 sm:mb-12 sm:justify-center">
          {CATEGORY_TABS.map((tab) => {
            const isActive = selectedCategory === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => handleCategoryChange(tab.value)}
                className={`shrink-0 cursor-pointer whitespace-nowrap rounded-full px-5 py-2.5 font-heading text-xs font-semibold transition-all duration-300 sm:text-sm ${
                  isActive
                    ? 'scale-105 bg-[#172B6B] text-white shadow-md'
                    : 'border border-gray-200 bg-white text-gray-700 hover:bg-[#EAF3FF]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Responsive Programme Card Grid */}
        <div
          className={`ease-[cubic-bezier(0.22,1,0.36,1)] grid grid-cols-1 gap-6 transition-all duration-300 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 xl:grid-cols-4 ${
            isTransitioning ? 'scale-[0.98] opacity-0' : 'scale-100 opacity-100'
          }`}
        >
          {filteredProgrammes.map((prog, index) => (
            <AnimatedProgrammeCard key={`${activeCategory}-${prog.id}`} prog={prog} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
