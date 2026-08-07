'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useMemo } from 'react';

import { IndexProgrammeDetail } from '@/types/index-programme';

const CATEGORY_TABS = [
  { label: 'All Programmes', value: 'all' },
  { label: 'Education', value: 'Education' },
  { label: 'Environment', value: 'Environment' },
  { label: 'Health', value: 'Health & Well-being' },
  { label: 'Awareness', value: 'Awareness & Safety' },
  { label: 'Community', value: 'Community Support' },
];

/**
 * Elegant segmented control matching a Foundation aesthetic
 */
function SegmentedControl({
  active,
  onChange,
}: {
  active: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="sticky top-[72px] z-40 mx-auto mb-16 flex max-w-fit flex-wrap items-center justify-center gap-1 sm:gap-2 rounded-[2rem] border border-gray-200 bg-white/90 p-1.5 shadow-sm backdrop-blur-xl">
      {CATEGORY_TABS.map((tab) => {
        const isActive = active === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={`relative rounded-full px-5 py-2.5 text-[13px] sm:text-sm font-semibold transition-colors duration-300 ${
              isActive ? 'text-white' : 'text-gray-600 hover:text-[#233A8B]'
            }`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {isActive && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 rounded-full bg-[#233A8B]"
                transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Single Timeline Item Component
 */
function TimelineItem({ prog, index }: { prog: IndexProgrammeDetail; index: number }) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex w-full flex-col md:flex-row items-center justify-between gap-8 mb-16 ${
        isEven ? 'md:flex-row-reverse' : ''
      }`}
    >
      {/* Center Line Dot (Desktop only) */}
      <div className="absolute left-1/2 top-1/2 hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-[#5E9F3B] shadow-md md:block z-10" />

      {/* Spacer for the other side on Desktop */}
      <div className="hidden w-full md:block md:w-5/12" />

      {/* Card Content */}
      <div className="w-full md:w-5/12">
        <div className="group relative flex flex-col overflow-hidden rounded-[24px] bg-white shadow-sm ring-1 ring-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-[#233A8B]/20">
          
          {/* Cover Image */}
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
            <Image
              src={prog.coverImageUrl}
              alt={prog.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Category Badge */}
            <div className="absolute top-4 left-4 z-10">
              <span className="rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-[#233A8B] shadow-sm backdrop-blur-sm">
                {prog.category}
              </span>
            </div>
          </div>
          
          {/* Text Content */}
          <div className="flex flex-col p-6 sm:p-8">
            <h3 className="mb-3 font-heading text-xl font-bold leading-tight text-[#233A8B] transition-colors group-hover:text-[#5E9F3B]">
              <Link href={`/programmes/${prog.slug}`}>
                <span className="absolute inset-0 z-20" aria-hidden="true" />
                {prog.title}
              </Link>
            </h3>
            
            <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-gray-600">
              {prog.shortDescription}
            </p>

            <div className="mb-6 flex flex-col gap-2 border-t border-gray-100 pt-5 text-[13px] text-gray-500">
              {prog.programDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#5E9F3B]" />
                  <span className="font-medium text-gray-700">{prog.programDate}</span>
                </div>
              )}
              {prog.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#5E9F3B]" />
                  <span className="font-medium text-gray-700 line-clamp-1">{prog.location}</span>
                </div>
              )}
            </div>

            <div className="flex items-center text-sm font-bold text-[#233A8B] transition-colors group-hover:text-[#5E9F3B]">
              View Details <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ProgrammeDirectorySection({ programmes }: { programmes: IndexProgrammeDetail[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredProgrammes = useMemo(() => {
    let filtered = programmes;
    if (activeCategory !== 'all') {
      filtered = programmes.filter((prog) => prog.category === activeCategory);
    }
    
    // Sort chronologically (oldest first, or assuming newer programmes have newer dates. Let's do newest first for timelines).
    return [...filtered].sort((a, b) => {
      const timeA = a.programDate ? new Date(a.programDate).getTime() : 0;
      const timeB = b.programDate ? new Date(b.programDate).getTime() : 0;
      return (isNaN(timeB) ? 0 : timeB) - (isNaN(timeA) ? 0 : timeA);
    });
  }, [activeCategory, programmes]);

  return (
    <section id="programmes" className="bg-[#FAFBFC] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-[#233A8B] sm:text-4xl mb-4">
            Our Key Initiatives
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse through our active programmes dedicated to driving positive change across multiple essential sectors.
          </p>
        </div>

        <SegmentedControl active={activeCategory} onChange={setActiveCategory} />

        {/* Timeline Container */}
        <div className="relative mx-auto max-w-5xl">
          {/* Central Line (Desktop only) */}
          {filteredProgrammes.length > 0 && (
            <div className="absolute bottom-0 left-1/2 top-0 hidden w-0.5 -translate-x-1/2 bg-gray-200 md:block" />
          )}

          <AnimatePresence mode="popLayout">
            {filteredProgrammes.map((prog, index) => (
              <TimelineItem key={prog.id} prog={prog} index={index} />
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredProgrammes.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-2xl py-20 text-center bg-white rounded-[24px] border border-gray-100 shadow-sm mt-8"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-50">
              <Calendar className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mb-2 font-heading text-xl font-bold text-[#233A8B]">No Programmes Found</h3>
            <p className="text-gray-500">We couldn't find any programmes in this category at the moment. Please check back later or explore other initiatives.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
