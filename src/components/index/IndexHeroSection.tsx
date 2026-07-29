'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

export function IndexHeroSection() {
  return (
    <section className="relative w-full h-[50vh] min-h-[380px] max-h-[520px] flex items-center justify-center overflow-hidden bg-[#121B2A]">
      {/* Background Image */}
      <Image
        src="/hero/hero-01.png"
        alt="UDBHAV Foundation Community Action"
        fill
        priority
        className="object-cover object-center opacity-40 scale-105"
      />

      {/* Subtle Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#121B2A]" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-xs md:text-sm uppercase tracking-[0.2em] font-semibold text-[#439B25] mb-3"
        >
          Historical Documentation &amp; Impact Archive
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight mb-4 text-[#FCFCF8]"
        >
          Programs &amp; Initiatives
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="text-base md:text-lg text-gray-200 font-normal max-w-2xl mx-auto leading-relaxed"
        >
          Documenting every initiative undertaken by UDBHAV Foundation to create meaningful and lasting social impact.
        </motion.p>
      </div>

      {/* Subtle Scroll Indicator */}
      <div aria-hidden="true" className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-60">
        <span className="text-[10px] uppercase tracking-widest text-gray-300 mb-1 font-sans">Scroll</span>
        <div className="w-[1px] h-6 bg-gradient-to-b from-gray-300 to-transparent" />
      </div>
    </section>
  );
}
