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

const PROGRAM_CARD_THEMES = [
  { 
    bg: 'bg-emerald-50', 
    accent: 'text-emerald-600', 
    hover: 'group-hover:text-emerald-700', 
    text: 'text-emerald-950', 
    border: 'border-emerald-100', 
    divider: 'bg-emerald-200/60', 
    icon: 'text-emerald-500',
    timelineBorder: 'border-emerald-500',
    timelineHover: 'group-hover:bg-emerald-500/30',
    timelineShadow: 'group-hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]'
  },
  { 
    bg: 'bg-blue-50', 
    accent: 'text-blue-600', 
    hover: 'group-hover:text-blue-700', 
    text: 'text-blue-950', 
    border: 'border-blue-100', 
    divider: 'bg-blue-200/60', 
    icon: 'text-blue-500',
    timelineBorder: 'border-blue-500',
    timelineHover: 'group-hover:bg-blue-500/30',
    timelineShadow: 'group-hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]'
  },
  { 
    bg: 'bg-amber-50', 
    accent: 'text-amber-600', 
    hover: 'group-hover:text-amber-700', 
    text: 'text-amber-950', 
    border: 'border-amber-100', 
    divider: 'bg-amber-200/60', 
    icon: 'text-amber-500',
    timelineBorder: 'border-amber-500',
    timelineHover: 'group-hover:bg-amber-500/30',
    timelineShadow: 'group-hover:shadow-[0_0_15px_rgba(245,158,11,0.4)]'
  },
  { 
    bg: 'bg-indigo-50', 
    accent: 'text-indigo-600', 
    hover: 'group-hover:text-indigo-700', 
    text: 'text-indigo-950', 
    border: 'border-indigo-100', 
    divider: 'bg-indigo-200/60', 
    icon: 'text-indigo-500',
    timelineBorder: 'border-indigo-500',
    timelineHover: 'group-hover:bg-indigo-500/30',
    timelineShadow: 'group-hover:shadow-[0_0_15px_rgba(99,102,241,0.4)]'
  },
  { 
    bg: 'bg-teal-50', 
    accent: 'text-teal-600', 
    hover: 'group-hover:text-teal-700', 
    text: 'text-teal-950', 
    border: 'border-teal-100', 
    divider: 'bg-teal-200/60', 
    icon: 'text-teal-500',
    timelineBorder: 'border-teal-500',
    timelineHover: 'group-hover:bg-teal-500/30',
    timelineShadow: 'group-hover:shadow-[0_0_15px_rgba(20,184,166,0.4)]'
  },
  { 
    bg: 'bg-rose-50', 
    accent: 'text-rose-600', 
    hover: 'group-hover:text-rose-700', 
    text: 'text-rose-950', 
    border: 'border-rose-100', 
    divider: 'bg-rose-200/60', 
    icon: 'text-rose-500',
    timelineBorder: 'border-rose-500',
    timelineHover: 'group-hover:bg-rose-500/30',
    timelineShadow: 'group-hover:shadow-[0_0_15px_rgba(244,63,94,0.4)]'
  },
  { 
    bg: 'bg-sky-50', 
    accent: 'text-sky-600', 
    hover: 'group-hover:text-sky-700', 
    text: 'text-sky-950', 
    border: 'border-sky-100', 
    divider: 'bg-sky-200/60', 
    icon: 'text-sky-500',
    timelineBorder: 'border-sky-500',
    timelineHover: 'group-hover:bg-sky-500/30',
    timelineShadow: 'group-hover:shadow-[0_0_15px_rgba(14,165,233,0.4)]'
  },
  { 
    bg: 'bg-fuchsia-50', 
    accent: 'text-fuchsia-600', 
    hover: 'group-hover:text-fuchsia-700', 
    text: 'text-fuchsia-950', 
    border: 'border-fuchsia-100', 
    divider: 'bg-fuchsia-200/60', 
    icon: 'text-fuchsia-500',
    timelineBorder: 'border-fuchsia-500',
    timelineHover: 'group-hover:bg-fuchsia-500/30',
    timelineShadow: 'group-hover:shadow-[0_0_15px_rgba(217,70,239,0.4)]'
  },
];

function getThemeForId(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PROGRAM_CARD_THEMES.length;
  return PROGRAM_CARD_THEMES[index];
}

/**
 * Single Timeline Item Component
 */
function TimelineItem({ prog, index }: { prog: IndexProgrammeDetail; index: number }) {
  const isLeft = index % 2 === 0;
  const theme = getThemeForId(prog.id);

  return (
    <div className="relative mb-6 md:mb-12 w-full flex justify-end md:justify-between items-center group">
      
      {/* Node (Desktop & Mobile) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
        className={`absolute left-8 md:left-1/2 w-6 h-6 rounded-full border-[4px] ${theme.timelineBorder} bg-white transform -translate-x-1/2 z-20 transition-all duration-300 ${theme.timelineShadow}`} 
      />

      {/* Connector Line (Desktop) */}
      <div className={`hidden md:block absolute top-1/2 h-[1.5px] bg-gray-200 z-10 w-[calc(8%-12px)] transition-colors duration-300 ${theme.timelineHover} ${
        isLeft ? 'right-[50%] mr-[12px]' : 'left-[50%] ml-[12px]'
      }`} />

      {/* Connector Line (Mobile) */}
      <div className={`absolute top-1/2 h-[1.5px] bg-gray-200 z-10 w-[20px] left-[44px] block md:hidden transition-colors duration-300 ${theme.timelineHover}`} />

      {/* Card Container */}
      <div className={`w-full pl-16 pr-4 md:px-0 md:w-[42%] flex ${isLeft ? 'md:mr-auto md:justify-end' : 'md:ml-auto md:justify-start'}`}>
         
         <motion.div 
             initial={{ opacity: 0, x: isLeft ? -15 : 15 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true, margin: '-50px' }}
             transition={{ duration: 0.5, ease: 'easeOut' }}
             className={`w-full ${theme.bg} rounded-[16px] sm:rounded-[20px] p-5 sm:p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md border ${theme.border} relative overflow-hidden`}
         >
             <h3 className={`font-heading text-[18px] sm:text-[22px] font-bold leading-tight ${theme.text} mb-4`}>
                 <Link href={`/programmes/${prog.slug}`}>
                   <span className="absolute inset-0 z-20" aria-hidden="true" />
                   {prog.title}
                 </Link>
             </h3>

             <div className={`w-full h-px ${theme.divider} mb-4`} />

             <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 text-[13px] sm:text-[14px]">
                <div className={`flex flex-wrap items-center gap-3 xl:gap-4 ${theme.text} opacity-90 font-medium`}>
                   {prog.programDate && (
                     <div className="flex items-center gap-1.5">
                       <Calendar className={`h-4 w-4 ${theme.icon}`} />
                       <span>{prog.programDate}</span>
                     </div>
                   )}
                   {prog.location && (
                     <div className="flex items-center gap-1.5">
                       <MapPin className={`h-4 w-4 ${theme.icon}`} />
                       <span className="line-clamp-1 max-w-[150px] sm:max-w-[200px]">{prog.location}</span>
                     </div>
                   )}
                </div>

                <div className={`flex items-center font-semibold ${theme.accent} ${theme.hover} transition-colors shrink-0`}>
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
