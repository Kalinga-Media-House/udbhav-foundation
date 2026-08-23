/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight, Calendar, MapPin, Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useMemo, useEffect } from 'react';

import { IndexProgrammeDetail } from '@/types/index-programme';

export function ProgrammeDirectorySection({ programmes }: { programmes: IndexProgrammeDetail[] }) {
  const sortedProgrammes = useMemo(() => {
    // Keep sequential sort chronologically based on canonical numbering.
    return [...programmes].sort((a, b) => parseInt(a.programmeNumber || '0') - parseInt(b.programmeNumber || '0'));
  }, [programmes]);

  const [activeId, setActiveId] = useState<string>(sortedProgrammes[0]?.id || '');
  const prefersReducedMotion = useReducedMotion();

  // If activeId becomes invalid for some reason, reset to first.
  useEffect(() => {
    if (sortedProgrammes.length > 0 && !sortedProgrammes.find(p => p.id === activeId)) {
      setActiveId(sortedProgrammes[0].id);
    }
  }, [sortedProgrammes, activeId]);

  if (sortedProgrammes.length === 0) {
    return (
      <section id="programmes" className="bg-[#FAFBFC] py-24 sm:py-32 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-2xl py-20 text-center bg-white rounded-[24px] border border-gray-100 shadow-sm"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 ring-1 ring-gray-100">
              <Calendar className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mb-2 font-heading text-xl font-bold text-[#233A8B]">No Programmes Found</h3>
            <p className="text-gray-500 font-medium">We couldn&apos;t find any programmes at the moment. Please check back later or explore other initiatives.</p>
          </motion.div>
        </div>
      </section>
    );
  }

  const activeProg = sortedProgrammes.find(p => p.id === activeId) || sortedProgrammes[0];

  // Render Details Panel (Reusable for desktop right-pane)
  const ProgrammeDetails = ({ prog }: { prog: IndexProgrammeDetail }) => (
    <div className="flex flex-col h-full bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
      {/* Image */}
      <div className="relative w-full aspect-[16/8] xl:aspect-[16/7] shrink-0 bg-gray-100">
        <Image
          src={prog.coverImageUrl || '/hero/hero-01.png'}
          alt={prog.title}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 60vw, 100vw"
          priority
        />
      </div>
      
      {/* Content */}
      <div className="flex flex-col p-6 lg:p-7 xl:p-8 flex-1">
        <h3 className="font-heading text-2xl xl:text-3xl font-bold text-[#233A8B] mb-3 tracking-tight">
          {prog.title}
        </h3>
        
        {prog.fullDescription && (
          <p className="text-gray-600 text-[15px] xl:text-base leading-relaxed mb-6 line-clamp-3 xl:line-clamp-4">
            {prog.fullDescription}
          </p>
        )}
        
        <div className="flex flex-wrap items-center gap-5 mb-6 mt-auto">
          {prog.programDate && (
            <div className="flex items-center gap-2 text-[13px] font-semibold text-gray-600 uppercase tracking-wide">
              <Calendar className="w-4 h-4 text-[#5E9F3B]" />
              <span>{prog.programDate}</span>
            </div>
          )}
          {prog.location && (
            <div className="flex items-center gap-2 text-[13px] font-semibold text-gray-600 uppercase tracking-wide">
              <MapPin className="w-4 h-4 text-[#5E9F3B]" />
              <span className="line-clamp-1">{prog.location}</span>
            </div>
          )}
        </div>
        
        <div className="mt-auto border-t border-gray-100 pt-5">
          <Link
            href={`/programmes/${prog.slug}`}
            className="group inline-flex items-center justify-center rounded-full bg-[#233A8B] px-6 py-3 text-[14px] font-bold tracking-wide text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#1a2b6c] hover:shadow-md w-full sm:w-auto"
          >
            VIEW DETAILS
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <section id="programmes" className="bg-[#FAFBFC] py-20 sm:py-28 lg:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center md:text-left mb-12 sm:mb-16">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-[#233A8B] sm:text-4xl lg:text-5xl">
            Our Key Initiatives
          </h2>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid grid-cols-12 gap-8 xl:gap-10 items-start">
          
          {/* Left: Programme Selector */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-2.5">
            {sortedProgrammes.map((prog) => {
              const isActive = prog.id === activeId;
              return (
                <button
                  key={prog.id}
                  onClick={() => setActiveId(prog.id)}
                  className={`group relative flex items-center w-full p-4 rounded-2xl text-left transition-all duration-200 border ${
                    isActive 
                      ? 'bg-blue-50/80 border-[#233A8B]/20 shadow-sm' 
                      : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-200'
                  }`}
                >
                  <span className={`font-heading text-lg font-bold tracking-tight w-10 shrink-0 ${isActive ? 'text-[#5E9F3B]' : 'text-gray-400 group-hover:text-gray-500 transition-colors'}`}>
                    {prog.programmeNumber}
                  </span>
                  <span className={`font-semibold text-[15px] xl:text-base flex-1 pr-3 leading-tight ${isActive ? 'text-[#233A8B]' : 'text-gray-700 group-hover:text-gray-900 transition-colors'}`}>
                    {prog.title}
                  </span>
                  {isActive && (
                    <span className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-[#233A8B] text-white shadow-sm">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: Active Programme Details */}
          <div className="lg:col-span-7 xl:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeId}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -8 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="h-full"
              >
                <ProgrammeDetails prog={activeProg} />
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* Mobile/Tablet Layout (Accordion-style) */}
        <div className="flex flex-col gap-4 lg:hidden">
          {sortedProgrammes.map((prog) => {
            const isActive = prog.id === activeId;
            return (
              <div key={prog.id} className="flex flex-col">
                <button
                  onClick={() => setActiveId(prog.id)}
                  className={`group flex items-center w-full p-5 rounded-2xl text-left transition-all duration-300 border ${
                    isActive 
                      ? 'bg-blue-50/70 border-[#233A8B]/15 shadow-sm' 
                      : 'bg-white border-transparent shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.06)]'
                  } ${isActive ? 'rounded-b-none border-b-0' : ''}`}
                >
                  <span className={`font-heading text-lg font-bold tracking-tight w-10 shrink-0 ${isActive ? 'text-[#5E9F3B]' : 'text-gray-400'}`}>
                    {prog.programmeNumber}
                  </span>
                  <span className={`font-semibold text-base sm:text-lg flex-1 pr-3 leading-tight ${isActive ? 'text-[#233A8B]' : 'text-gray-700'}`}>
                    {prog.title}
                  </span>
                  {isActive && (
                    <span className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-[#233A8B] text-white shadow-sm">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: prefersReducedMotion ? 0.01 : 0.35, ease: 'easeInOut' }}
                      className="overflow-hidden bg-white border border-t-0 border-[#233A8B]/15 rounded-b-2xl shadow-sm"
                    >
                      {/* Sub-panel details (mobile variant) */}
                      <div className="p-4 sm:p-5 flex flex-col gap-4">
                        <div className="relative w-full aspect-[16/8] shrink-0 bg-gray-100 rounded-xl overflow-hidden">
                          <Image
                            src={prog.coverImageUrl || '/hero/hero-01.png'}
                            alt={prog.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 60vw"
                            priority
                          />
                        </div>
                        
                        {prog.fullDescription && (
                          <p className="text-gray-600 text-[14px] sm:text-[15px] leading-relaxed line-clamp-4">
                            {prog.fullDescription}
                          </p>
                        )}
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-1 border-t border-gray-100 pt-4">
                          {prog.programDate && (
                            <div className="flex items-center gap-2.5 text-[13px] font-semibold text-gray-600 uppercase tracking-wide">
                              <Calendar className="w-4 h-4 text-[#5E9F3B]" />
                              <span>{prog.programDate}</span>
                            </div>
                          )}
                          {prog.location && (
                            <div className="flex items-center gap-2.5 text-[13px] font-semibold text-gray-600 uppercase tracking-wide">
                              <MapPin className="w-4 h-4 text-[#5E9F3B]" />
                              <span className="line-clamp-1">{prog.location}</span>
                            </div>
                          )}
                        </div>
                        
                        <Link
                          href={`/programmes/${prog.slug}`}
                          className="group mt-4 inline-flex items-center justify-center rounded-xl bg-[#233A8B] px-5 py-3.5 text-[13px] font-bold tracking-wide text-white shadow-sm transition-all active:scale-[0.98] w-full"
                        >
                          VIEW DETAILS
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
