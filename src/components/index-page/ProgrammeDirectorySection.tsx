'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calendar, MapPin, Users, Camera, Activity } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useMemo } from 'react';

import { IndexProgrammeDetail, ProgrammeCategory } from '@/types/index-programme';

const CATEGORY_TABS = [
  { label: 'All', value: 'all' },
  { label: 'Education', value: 'Education' },
  { label: 'Environment', value: 'Environment' },
  { label: 'Health', value: 'Health & Well-being' },
  { label: 'Awareness', value: 'Awareness & Safety' },
  { label: 'Community', value: 'Community Support' },
];

/**
 * Premium segmented control (Apple style)
 */
function SegmentedControl({
  active,
  onChange,
}: {
  active: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="sticky top-[72px] z-40 mx-auto mb-16 flex max-w-fit items-center justify-center gap-1 rounded-full border border-black/5 bg-white/80 p-1.5 shadow-sm backdrop-blur-xl transition-all">
      {CATEGORY_TABS.map((tab) => {
        const isActive = active === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={`relative rounded-full px-5 py-2.5 text-[13px] font-semibold transition-colors duration-200 ${
              isActive ? 'text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {isActive && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 rounded-full bg-[#111111]"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
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
 * Full-width Spotlight Card for Featured Program
 */
function FeaturedSpotlightCard({ prog }: { prog: IndexProgrammeDetail }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="group relative mb-20 overflow-hidden rounded-[32px] bg-white shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] transition-all hover:shadow-[0_16px_60px_-15px_rgba(0,0,0,0.15)] ring-1 ring-black/5"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Image Half */}
        <div className="relative aspect-[4/3] lg:aspect-auto h-full w-full overflow-hidden">
          <Image
            src={prog.coverImageUrl}
            alt={prog.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/5" />
          
          <div className="absolute bottom-6 left-6 flex items-center gap-2 lg:hidden">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
              {prog.category}
            </span>
          </div>
        </div>

        {/* Content Half */}
        <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
          <div className="mb-4 hidden lg:inline-flex items-center gap-2 rounded-full bg-[#FAFAFA] px-4 py-1.5 text-xs font-semibold text-gray-600 border border-black/5 w-fit">
            <span className="h-2 w-2 rounded-full bg-[#172B6B]" />
            Featured Programme
          </div>
          
          <h3 className="mb-4 font-heading text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl">
            {prog.title}
          </h3>
          <p className="mb-8 text-base leading-relaxed text-gray-500 sm:text-lg">
            {prog.shortDescription}
          </p>

          <div className="mb-10 grid grid-cols-2 gap-6 sm:grid-cols-3">
            {prog.programDate && (
              <div>
                <dt className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Date</dt>
                <dd className="text-sm font-semibold text-[#111111]">{prog.programDate}</dd>
              </div>
            )}
            {prog.location && (
              <div>
                <dt className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Location</dt>
                <dd className="text-sm font-semibold text-[#111111] line-clamp-1">{prog.location}</dd>
              </div>
            )}
            <div>
              <dt className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Category</dt>
              <dd className="text-sm font-semibold text-[#3C9D23]">{prog.category}</dd>
            </div>
          </div>

          <Link
            href={`/programmes/${prog.slug}`}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-full bg-[#111111] px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-gray-900 hover:scale-105"
          >
            Explore Programme
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Premium Edge-to-Edge Programme Card
 */
function PremiumProgrammeCard({ prog, index }: { prog: IndexProgrammeDetail; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-[24px] bg-white shadow-sm ring-1 ring-black/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl sm:rounded-[30px]"
    >
      <Link href={`/programmes/${prog.slug}`} className="absolute inset-0 z-20">
        <span className="sr-only">View {prog.title}</span>
      </Link>

      {/* Edge-to-edge Cover */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <Image
          src={prog.coverImageUrl}
          alt={prog.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Soft dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-90" />
        
        {/* Floating Badges */}
        <div className="absolute top-5 left-5 flex gap-2 z-10">
          <span className="rounded-full bg-white/20 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-md ring-1 ring-white/30 shadow-sm">
            {prog.category}
          </span>
        </div>

        {/* Content overlaid on image */}
        <div className="absolute bottom-0 left-0 right-0 flex flex-col justify-end p-6 z-10">
          {prog.programDate && (
            <p className="mb-2 text-xs font-semibold text-white/80">
              {prog.programDate}
            </p>
          )}
          <h3 className="mb-2 font-heading text-xl font-bold leading-tight text-white sm:text-2xl">
            {prog.title}
          </h3>
          <p className="line-clamp-2 text-sm text-white/70">
            {prog.shortDescription}
          </p>
        </div>
      </div>
      
      {/* Bottom Stats Bar */}
      <div className="flex items-center justify-between border-t border-gray-50 bg-white px-6 py-4 z-10">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
            <Camera className="h-4 w-4 text-gray-400" />
            {prog.photoCount}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
            <Activity className="h-4 w-4 text-gray-400" />
            {prog.eventCount}
          </div>
        </div>
        <div className="text-xs font-bold uppercase tracking-widest text-[#172B6B] transition-colors group-hover:text-[#3C9D23]">
          Read More &rarr;
        </div>
      </div>
    </motion.article>
  );
}

/**
 * Vertical Timeline Section
 */
function VerticalTimeline({ programmes }: { programmes: IndexProgrammeDetail[] }) {
  if (programmes.length === 0) return null;
  // Get latest 4 programmes
  const latest = [...programmes].slice(0, 4);

  return (
    <div className="mt-32">
      <div className="mb-16 text-center">
        <h2 className="font-heading text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl">
          Latest Initiatives
        </h2>
      </div>
      
      <div className="mx-auto max-w-4xl relative">
        {/* Vertical Line */}
        <div className="absolute left-[27px] sm:left-1/2 top-0 bottom-0 w-px bg-gray-200 transform sm:-translate-x-1/2" />

        <div className="space-y-12 sm:space-y-24">
          {latest.map((prog, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <motion.div 
                key={prog.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="relative flex items-center justify-between w-full"
              >
                {/* Timeline Dot */}
                <div className="absolute left-6 sm:left-1/2 w-4 h-4 rounded-full border-4 border-white bg-[#172B6B] shadow-sm transform -translate-x-1/2 z-10" />

                <div className={`w-full sm:w-[calc(50%-40px)] flex flex-col pl-16 sm:pl-0 ${isEven ? 'sm:items-end sm:text-right sm:pr-0' : 'sm:ml-auto sm:items-start sm:text-left'}`}>
                  
                  <div className="group relative overflow-hidden rounded-2xl ring-1 ring-black/5 shadow-sm mb-4 w-full aspect-[16/9] sm:w-[320px]">
                    <Image
                      src={prog.coverImageUrl}
                      alt={prog.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="320px"
                    />
                    <Link href={`/programmes/${prog.slug}`} className="absolute inset-0 z-10">
                      <span className="sr-only">View {prog.title}</span>
                    </Link>
                  </div>
                  
                  {prog.programDate && (
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                      {prog.programDate}
                    </span>
                  )}
                  <h4 className="font-heading text-xl font-bold text-[#111111] mb-2">
                    <Link href={`/programmes/${prog.slug}`} className="hover:text-[#172B6B] transition-colors">
                      {prog.title}
                    </Link>
                  </h4>
                  <p className="text-sm text-gray-500 line-clamp-2 max-w-[320px]">
                    {prog.shortDescription}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function ProgrammeDirectorySection({ programmes }: { programmes: IndexProgrammeDetail[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredProgrammes = useMemo(() => {
    if (activeCategory === 'all') return programmes;
    return programmes.filter((prog) => prog.category === activeCategory);
  }, [activeCategory, programmes]);

  const featuredProgram = programmes.length > 0 ? programmes[0] : null;

  return (
    <section id="programmes" className="bg-[#FAFAFA] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        <SegmentedControl active={activeCategory} onChange={setActiveCategory} />

        <AnimatePresence mode="wait">
          {activeCategory === 'all' && featuredProgram && (
            <motion.div
              key="featured"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
            >
              <FeaturedSpotlightCard prog={featuredProgram} />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          layout
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredProgrammes.map((prog, index) => (
              <PremiumProgrammeCard key={prog.id} prog={prog} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProgrammes.length === 0 && (
          <div className="py-20 text-center text-gray-500">
            No programmes found in this category.
          </div>
        )}

        <VerticalTimeline programmes={programmes} />
      </div>
    </section>
  );
}
