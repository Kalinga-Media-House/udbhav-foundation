'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useMemo } from 'react';

import { IndexProgrammeDetail, ProgrammeCategory } from '@/types/index-programme';

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
 * Bright, institutional Featured Programme Card
 */
function FeaturedSpotlightCard({ prog }: { prog: IndexProgrammeDetail }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="group relative mb-20 overflow-hidden rounded-[24px] sm:rounded-[32px] bg-white shadow-lg ring-1 ring-black/5"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Content Half */}
        <div className="order-2 lg:order-1 flex flex-col justify-center p-8 sm:p-12 lg:p-16">
          <div className="mb-6 hidden lg:inline-flex items-center gap-2 rounded-full bg-[#EAF3FF] px-4 py-1.5 text-xs font-semibold text-[#233A8B] border border-[#233A8B]/10 w-fit">
            <span className="h-2 w-2 rounded-full bg-[#5E9F3B]" />
            Featured Initiative
          </div>
          
          <h3 className="mb-4 font-heading text-3xl font-bold tracking-tight text-[#233A8B] sm:text-4xl">
            {prog.title}
          </h3>
          <p className="mb-8 text-base leading-relaxed text-gray-600 sm:text-lg">
            {prog.shortDescription}
          </p>

          <div className="mb-10 grid grid-cols-2 gap-6 sm:grid-cols-3">
            {prog.programDate && (
              <div>
                <dt className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Date</dt>
                <dd className="text-sm font-semibold text-[#233A8B]">{prog.programDate}</dd>
              </div>
            )}
            {prog.location && (
              <div>
                <dt className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Location</dt>
                <dd className="text-sm font-semibold text-[#233A8B] line-clamp-1">{prog.location}</dd>
              </div>
            )}
            <div>
              <dt className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Category</dt>
              <dd className="text-sm font-semibold text-[#5E9F3B]">{prog.category}</dd>
            </div>
          </div>

          <Link
            href={`/programmes/${prog.slug}`}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-full bg-[#233A8B] px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-[#1a2b6c] hover:-translate-y-0.5 shadow-md"
          >
            Learn More
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Image Half */}
        <div className="order-1 lg:order-2 relative aspect-[4/3] lg:aspect-auto h-full w-full overflow-hidden bg-gray-100">
          <Image
            src={prog.coverImageUrl}
            alt={prog.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent lg:hidden" />
          <div className="absolute bottom-6 left-6 flex items-center gap-2 lg:hidden">
            <span className="rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold text-[#233A8B] shadow-sm">
              {prog.category}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Premium Human-centered Programme Card
 */
function PremiumProgrammeCard({ prog, index }: { prog: IndexProgrammeDetail; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col overflow-hidden rounded-[24px] bg-white shadow-sm ring-1 ring-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-[#233A8B]/20"
    >
      {/* Cover Image Section */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
        <Image
          src={prog.coverImageUrl}
          alt={prog.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        
        {/* Floating Category Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-[#233A8B] shadow-sm backdrop-blur-sm">
            {prog.category}
          </span>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <h3 className="mb-3 font-heading text-xl font-bold leading-tight text-[#233A8B] transition-colors group-hover:text-[#5E9F3B]">
          <Link href={`/programmes/${prog.slug}`}>
            <span className="absolute inset-0 z-20" aria-hidden="true" />
            {prog.title}
          </Link>
        </h3>
        
        <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-gray-600 flex-1">
          {prog.shortDescription}
        </p>

        {/* Date and Location */}
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

        {/* Action */}
        <div className="flex items-center text-sm font-bold text-[#233A8B] transition-colors group-hover:text-[#5E9F3B]">
          Learn More <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </motion.article>
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
          <div className="py-20 text-center text-gray-500 bg-white rounded-2xl border border-gray-100 shadow-sm mt-8">
            No programmes found in this category.
          </div>
        )}
      </div>
    </section>
  );
}
