'use client';

import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useMemo, useRef } from 'react';

import { IndexProgrammeDetail } from '@/types/index-programme';


const PROGRAM_CARD_THEMES = [
  { 
    bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100/40', 
    accent: 'text-emerald-600', 
    hover: 'group-hover:text-emerald-700', 
    text: 'text-emerald-950', 
    border: 'border-emerald-200/60', 
    divider: 'bg-emerald-200/60', 
    icon: 'text-emerald-500',
    blob: 'bg-emerald-500/10',
    num: 'text-emerald-900/5',
    timelineBorder: 'border-emerald-500',
    timelineHover: 'group-hover:bg-emerald-500/30',
    timelineShadow: 'group-hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]'
  },
  { 
    bg: 'bg-gradient-to-br from-blue-50 to-blue-100/40', 
    accent: 'text-blue-600', 
    hover: 'group-hover:text-blue-700', 
    text: 'text-blue-950', 
    border: 'border-blue-200/60', 
    divider: 'bg-blue-200/60', 
    icon: 'text-blue-500',
    blob: 'bg-blue-500/10',
    num: 'text-blue-900/5',
    timelineBorder: 'border-blue-500',
    timelineHover: 'group-hover:bg-blue-500/30',
    timelineShadow: 'group-hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]'
  },
  { 
    bg: 'bg-gradient-to-br from-amber-50 to-amber-100/40', 
    accent: 'text-amber-600', 
    hover: 'group-hover:text-amber-700', 
    text: 'text-amber-950', 
    border: 'border-amber-200/60', 
    divider: 'bg-amber-200/60', 
    icon: 'text-amber-500',
    blob: 'bg-amber-500/10',
    num: 'text-amber-900/5',
    timelineBorder: 'border-amber-500',
    timelineHover: 'group-hover:bg-amber-500/30',
    timelineShadow: 'group-hover:shadow-[0_0_15px_rgba(245,158,11,0.4)]'
  },
  { 
    bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100/40', 
    accent: 'text-indigo-600', 
    hover: 'group-hover:text-indigo-700', 
    text: 'text-indigo-950', 
    border: 'border-indigo-200/60', 
    divider: 'bg-indigo-200/60', 
    icon: 'text-indigo-500',
    blob: 'bg-indigo-500/10',
    num: 'text-indigo-900/5',
    timelineBorder: 'border-indigo-500',
    timelineHover: 'group-hover:bg-indigo-500/30',
    timelineShadow: 'group-hover:shadow-[0_0_15px_rgba(99,102,241,0.4)]'
  },
  { 
    bg: 'bg-gradient-to-br from-teal-50 to-teal-100/40', 
    accent: 'text-teal-600', 
    hover: 'group-hover:text-teal-700', 
    text: 'text-teal-950', 
    border: 'border-teal-200/60', 
    divider: 'bg-teal-200/60', 
    icon: 'text-teal-500',
    blob: 'bg-teal-500/10',
    num: 'text-teal-900/5',
    timelineBorder: 'border-teal-500',
    timelineHover: 'group-hover:bg-teal-500/30',
    timelineShadow: 'group-hover:shadow-[0_0_15px_rgba(20,184,166,0.4)]'
  },
  { 
    bg: 'bg-gradient-to-br from-rose-50 to-rose-100/40', 
    accent: 'text-rose-600', 
    hover: 'group-hover:text-rose-700', 
    text: 'text-rose-950', 
    border: 'border-rose-200/60', 
    divider: 'bg-rose-200/60', 
    icon: 'text-rose-500',
    blob: 'bg-rose-500/10',
    num: 'text-rose-900/5',
    timelineBorder: 'border-rose-500',
    timelineHover: 'group-hover:bg-rose-500/30',
    timelineShadow: 'group-hover:shadow-[0_0_15px_rgba(244,63,94,0.4)]'
  },
  { 
    bg: 'bg-gradient-to-br from-sky-50 to-sky-100/40', 
    accent: 'text-sky-600', 
    hover: 'group-hover:text-sky-700', 
    text: 'text-sky-950', 
    border: 'border-sky-200/60', 
    divider: 'bg-sky-200/60', 
    icon: 'text-sky-500',
    blob: 'bg-sky-500/10',
    num: 'text-sky-900/5',
    timelineBorder: 'border-sky-500',
    timelineHover: 'group-hover:bg-sky-500/30',
    timelineShadow: 'group-hover:shadow-[0_0_15px_rgba(14,165,233,0.4)]'
  },
  { 
    bg: 'bg-gradient-to-br from-fuchsia-50 to-fuchsia-100/40', 
    accent: 'text-fuchsia-600', 
    hover: 'group-hover:text-fuchsia-700', 
    text: 'text-fuchsia-950', 
    border: 'border-fuchsia-200/60', 
    divider: 'bg-fuchsia-200/60', 
    icon: 'text-fuchsia-500',
    blob: 'bg-fuchsia-500/10',
    num: 'text-fuchsia-900/5',
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
  const progNumber = prog.programmeNumber || '00';

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
             className={`w-full ${theme.bg} rounded-[24px] p-6 sm:p-8 shadow-md transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl border ${theme.border} relative overflow-hidden flex flex-col`}
         >
             {/* Decorative Background Elements */}
             <div className={`absolute -right-8 -top-8 w-40 h-40 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-110 ${theme.blob}`} />
             <div className={`absolute right-4 top-4 font-heading font-extrabold text-5xl tracking-tighter select-none ${theme.num}`}>
               {progNumber}
             </div>
             <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.timelineBorder}`} />

             <div className="relative z-10 flex-1">
                 <h3 className={`font-heading text-xl sm:text-2xl font-bold leading-tight ${theme.text} mb-3 pr-8`}>
                     <Link href={`/programmes/${prog.slug}`}>
                       <span className="absolute inset-0 z-20" aria-hidden="true" />
                       {prog.title}
                     </Link>
                 </h3>

                 {prog.shortDescription && (
                   <p className={`text-[13.5px] sm:text-sm ${theme.text} opacity-80 mb-5 line-clamp-2 sm:line-clamp-3 leading-relaxed max-w-[90%]`}>
                     {prog.shortDescription}
                   </p>
                 )}

                 <div className={`w-full h-px ${theme.divider} mb-5`} />

                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[13px]">
                    <div className={`flex flex-wrap items-center gap-3 ${theme.text} opacity-90 font-medium`}>
                       {prog.programDate && (
                         <div className="flex items-center gap-1.5">
                           <Calendar className={`h-4 w-4 ${theme.icon}`} />
                           <span>{prog.programDate}</span>
                         </div>
                       )}
                       {prog.location && (
                         <div className="flex items-center gap-1.5">
                           <MapPin className={`h-4 w-4 ${theme.icon}`} />
                           <span className="line-clamp-1 max-w-[150px] sm:max-w-[180px]">{prog.location}</span>
                         </div>
                       )}
                    </div>

                    <div className={`flex items-center font-bold ${theme.accent} ${theme.hover} transition-colors shrink-0 uppercase tracking-wide text-[12px]`}>
                       View Details <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                 </div>
             </div>
         </motion.div>
      </div>
    </div>
  );
}

export function ProgrammeDirectorySection({ programmes }: { programmes: IndexProgrammeDetail[] }) {
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

  const sortedProgrammes = useMemo(() => {
    // Sort chronologically (newest first for timelines).
    return [...programmes].sort((a, b) => {
      const timeA = a.programDate ? new Date(a.programDate).getTime() : 0;
      const timeB = b.programDate ? new Date(b.programDate).getTime() : 0;
      return (isNaN(timeB) ? 0 : timeB) - (isNaN(timeA) ? 0 : timeA);
    });
  }, [programmes]);

  return (
    <section id="programmes" className="bg-[#FAFBFC] py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-[#233A8B] sm:text-4xl">
            Our Key Initiatives
          </h2>
        </div>

        {/* Timeline Container */}
        <div className="relative mx-auto max-w-5xl" ref={containerRef}>
          {/* Animated Central Line Background (Desktop & Mobile) */}
          {sortedProgrammes.length > 0 && (
            <div className="absolute bottom-0 top-0 w-[2px] bg-gray-100 left-8 md:left-1/2 transform -translate-x-1/2 z-0" />
          )}

          {/* Animated Central Line Foreground */}
          {sortedProgrammes.length > 0 && (
            <motion.div 
              style={{ scaleY, originY: 0 }}
              className="absolute bottom-0 top-0 w-[2px] bg-gradient-to-b from-[#5E9F3B] to-[#233A8B]/30 left-8 md:left-1/2 transform -translate-x-1/2 z-0" 
            />
          )}

          <AnimatePresence mode="popLayout">
            {sortedProgrammes.map((prog, index) => (
              <TimelineItem key={prog.id} prog={prog} index={index} />
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {sortedProgrammes.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-2xl py-20 text-center bg-white rounded-[24px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] mt-8"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 ring-1 ring-gray-100">
              <Calendar className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mb-2 font-heading text-xl font-bold text-[#233A8B]">No Programmes Found</h3>
            <p className="text-gray-500 font-medium">We couldn't find any programmes at the moment. Please check back later or explore other initiatives.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
