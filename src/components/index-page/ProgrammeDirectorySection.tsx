'use client';

import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useMemo, useRef } from 'react';

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
  const isLeft = index % 2 === 0;

  return (
    <div className="relative mb-24 md:mb-32 w-full flex justify-end md:justify-between items-center group">
      
      {/* Node (Desktop & Mobile) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
        className="absolute left-8 md:left-1/2 w-6 h-6 rounded-full border-[4px] border-[#5E9F3B] bg-white transform -translate-x-1/2 z-20 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(94,159,59,0.4)]" 
      />

      {/* Connector Line (Desktop) */}
      <div className={`hidden md:block absolute top-1/2 h-[1.5px] bg-gray-200 z-10 w-[calc(8%-12px)] transition-colors duration-300 group-hover:bg-[#5E9F3B]/30 ${
        isLeft ? 'right-[50%] mr-[12px]' : 'left-[50%] ml-[12px]'
      }`} />

      {/* Connector Line (Mobile) */}
      <div className="absolute top-1/2 h-[1.5px] bg-gray-200 z-10 w-[36px] left-[44px] block md:hidden transition-colors duration-300 group-hover:bg-[#5E9F3B]/30" />

      {/* Card Container */}
      <div className={`w-full pl-20 pr-4 md:px-0 md:w-[42%] flex ${isLeft ? 'md:mr-auto md:justify-end' : 'md:ml-auto md:justify-start'}`}>
         
         <motion.div 
             initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true, margin: '-100px' }}
             transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
             className="w-full bg-white rounded-[20px] sm:rounded-[24px] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[6px] hover:scale-[1.02] hover:shadow-[0_12px_35px_rgba(0,0,0,0.07)] ring-1 ring-gray-100"
         >
            {/* Top Row */}
            <div className="flex items-center gap-4 mb-4">
               <div className="relative shrink-0 w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] rounded-[14px] sm:rounded-[16px] overflow-hidden bg-gray-100 shadow-sm">
                  <Image src={prog.coverImageUrl} alt={prog.title} fill className="object-cover" sizes="70px" />
               </div>
               <div className="flex flex-col justify-center gap-1.5 flex-1 min-w-0">
                  <div className="flex">
                     <span className="inline-flex items-center justify-center rounded-full bg-[#FAFBFC] border border-gray-100 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold tracking-wide text-[#233A8B]">
                        {prog.category}
                     </span>
                  </div>
                  <h3 className="font-heading text-[20px] sm:text-[24px] font-semibold leading-tight text-[#233A8B] line-clamp-2 truncate whitespace-normal">
                     <Link href={`/programmes/${prog.slug}`}>
                       <span className="absolute inset-0 z-20" aria-hidden="true" />
                       {prog.title}
                     </Link>
                  </h3>
               </div>
            </div>

            {/* Middle Row */}
            <p className="text-[14px] sm:text-[15px] leading-relaxed text-gray-600 line-clamp-1 mb-5 font-medium">
               {prog.shortDescription}
            </p>

            {/* Bottom Row */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 border-t border-gray-100 pt-4 text-[13px] sm:text-[14px]">
               <div className="flex flex-wrap items-center gap-3 xl:gap-4 text-gray-500 font-medium">
                  {prog.programDate && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-[#5E9F3B]" />
                      <span>{prog.programDate}</span>
                    </div>
                  )}
                  {prog.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-[#5E9F3B]" />
                      <span className="line-clamp-1 max-w-[150px] sm:max-w-[200px]">{prog.location}</span>
                    </div>
                  )}
               </div>

               <div className="flex items-center font-semibold text-[#233A8B] transition-colors group-hover:text-[#5E9F3B]">
                  View Details <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
               </div>
            </div>
         </motion.div>
      </div>
    </div>
  );
}

export function ProgrammeDirectorySection({ programmes }: { programmes: IndexProgrammeDetail[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center']
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const filteredProgrammes = useMemo(() => {
    let filtered = programmes;
    if (activeCategory !== 'all') {
      filtered = programmes.filter((prog) => prog.category === activeCategory);
    }
    
    // Sort chronologically (newest first for timelines).
    return [...filtered].sort((a, b) => {
      const timeA = a.programDate ? new Date(a.programDate).getTime() : 0;
      const timeB = b.programDate ? new Date(b.programDate).getTime() : 0;
      return (isNaN(timeB) ? 0 : timeB) - (isNaN(timeA) ? 0 : timeA);
    });
  }, [activeCategory, programmes]);

  return (
    <section id="programmes" className="bg-[#FAFBFC] py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-[#233A8B] sm:text-4xl mb-4">
            Our Key Initiatives
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse through our active programmes dedicated to driving positive change across multiple essential sectors.
          </p>
        </div>

        <SegmentedControl active={activeCategory} onChange={setActiveCategory} />

        {/* Timeline Container */}
        <div className="relative mx-auto max-w-5xl" ref={containerRef}>
          {/* Animated Central Line Background (Desktop & Mobile) */}
          {filteredProgrammes.length > 0 && (
            <div className="absolute bottom-0 top-0 w-[2px] bg-gray-100 left-8 md:left-1/2 transform -translate-x-1/2 z-0" />
          )}

          {/* Animated Central Line Foreground */}
          {filteredProgrammes.length > 0 && (
            <motion.div 
              style={{ scaleY, originY: 0 }}
              className="absolute bottom-0 top-0 w-[2px] bg-gradient-to-b from-[#5E9F3B] to-[#233A8B]/30 left-8 md:left-1/2 transform -translate-x-1/2 z-0" 
            />
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
            className="mx-auto max-w-2xl py-20 text-center bg-white rounded-[24px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] mt-8"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 ring-1 ring-gray-100">
              <Calendar className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mb-2 font-heading text-xl font-bold text-[#233A8B]">No Programmes Found</h3>
            <p className="text-gray-500 font-medium">We couldn't find any programmes in this category at the moment. Please check back later or explore other initiatives.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
