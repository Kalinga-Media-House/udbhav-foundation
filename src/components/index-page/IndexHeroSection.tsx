'use client';

import { motion, Variants } from 'framer-motion';
import { ArrowRight, Users, MapPin, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

const FADE_UP: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, mass: 0.5, damping: 15 } },
};

const STAGGER: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

function FloatingStatCard({
  icon: Icon,
  label,
  value,
  className,
  delay = 0,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', damping: 20, mass: 0.8, delay }}
      className={`absolute z-20 flex items-center gap-3 overflow-hidden rounded-[20px] border border-white/40 bg-white/70 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-xl ${className}`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
        <Icon className="h-5 w-5 text-[#172B6B]" />
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">{label}</p>
        <p className="font-heading text-lg font-bold leading-tight text-[#172B6B]">{value}</p>
      </div>
    </motion.div>
  );
}

export function IndexHeroSection() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-[#FAFAFA] pt-24 lg:pt-32 pb-16 lg:pb-24 flex items-center">
      {/* Premium Background Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-[#172B6B]/8 blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#3C9D23]/8 blur-[100px]"
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">
          {/* Left Text Column */}
          <motion.div
            variants={STAGGER}
            initial="hidden"
            animate="show"
            className="flex flex-col justify-center max-w-2xl"
          >
            <motion.div variants={FADE_UP} className="mb-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-200/60 bg-white/50 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gray-600 shadow-sm backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-[#3C9D23]" />
                Programmes & Initiatives
              </div>
            </motion.div>

            <motion.h1
              variants={FADE_UP}
              className="font-heading text-5xl sm:text-6xl lg:text-[4.5rem] font-bold text-[#111111] leading-[1.05] tracking-tight mb-6"
            >
              Creating Impact <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#172B6B] to-[#3C9D23]">
                Across Odisha.
              </span>
            </motion.h1>

            <motion.p
              variants={FADE_UP}
              className="text-lg sm:text-xl text-gray-500 leading-relaxed mb-10 max-w-xl font-medium"
            >
              Transforming lives through structured programs in education, healthcare, environment, awareness and community development.
            </motion.p>

            <motion.div variants={FADE_UP} className="flex flex-col sm:flex-row items-center gap-4">
              <button
                type="button"
                onClick={() => scrollToSection('programmes')}
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#111111] px-8 py-4 text-sm font-semibold text-white shadow-xl transition-all hover:scale-[1.02] hover:bg-gray-900 hover:shadow-2xl sm:w-auto"
              >
                Explore Programmes
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('collective-impact')}
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-[#111111] shadow-sm ring-1 ring-inset ring-gray-200 transition-all hover:scale-[1.02] hover:bg-gray-50 hover:shadow-md sm:w-auto"
              >
                View Our Impact
              </button>
            </motion.div>
          </motion.div>

          {/* Right Image Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative lg:h-[600px] w-full flex items-center justify-center"
          >
            {/* Main Image Container */}
            <div className="relative w-full max-w-lg aspect-[4/5] sm:aspect-square lg:aspect-[4/5] overflow-hidden rounded-[32px] sm:rounded-[40px] shadow-2xl ring-1 ring-black/5 bg-gray-100">
              <Image
                src="/hero/hero-01.png"
                alt="UDBHAV Foundation impact"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>

            {isMounted && (
              <>
                <FloatingStatCard
                  icon={Heart}
                  label="Lives Touched"
                  value="10,000+"
                  className="top-10 -left-4 sm:-left-12 lg:-left-20"
                  delay={0.6}
                />
                <FloatingStatCard
                  icon={MapPin}
                  label="Districts"
                  value="15+ Covered"
                  className="bottom-32 -right-4 sm:-right-8 lg:-right-12"
                  delay={0.8}
                />
                <FloatingStatCard
                  icon={Users}
                  label="Volunteers"
                  value="500+ Active"
                  className="-bottom-6 left-10 sm:left-20 lg:left-12"
                  delay={1.0}
                />
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
