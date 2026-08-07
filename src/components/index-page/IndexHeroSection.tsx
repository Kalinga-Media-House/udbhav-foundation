'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Users, MapPin, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, mass: 0.8, damping: 20 } },
};

const STAGGER = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', damping: 20, mass: 0.8, delay }}
      className={`absolute z-20 flex items-center gap-3 overflow-hidden rounded-2xl border border-white/60 bg-white/80 p-3.5 shadow-lg backdrop-blur-xl ${className}`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FAFBFC] shadow-inner">
        <Icon className="h-5 w-5 text-[#233A8B]" />
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#233A8B]/70">{label}</p>
        <p className="font-heading text-lg font-bold leading-tight text-[#233A8B]">{value}</p>
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
    <section className="relative min-h-[85vh] w-full flex items-center justify-center overflow-hidden bg-white">
      {/* Full-width Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero/hero-01.png"
          alt="UDBHAV Foundation Community Impact"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Subtle, Bright Gradient Overlay for text readability (white to transparent) */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/30" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8 py-20 lg:py-32 flex flex-col items-center text-center mt-16">
        <motion.div
          variants={STAGGER}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center max-w-4xl w-full"
        >
          <motion.div variants={FADE_UP} className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#233A8B]/10 bg-white/60 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-[#233A8B] shadow-sm backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-[#5E9F3B]" />
              Programmes & Initiatives
            </div>
          </motion.div>

          <motion.h1
            variants={FADE_UP}
            className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#233A8B] leading-tight tracking-tight mb-6"
          >
            Turning Compassion Into <br className="hidden md:block" />
            <span className="text-[#5E9F3B]">Lasting Action.</span>
          </motion.h1>

          <motion.p
            variants={FADE_UP}
            className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-12 max-w-2xl font-medium"
          >
            Empowering communities across Odisha through structured initiatives in education, healthcare, environmental responsibility, and social welfare.
          </motion.p>

          <motion.div variants={FADE_UP} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto z-30">
            <button
              type="button"
              onClick={() => scrollToSection('programmes')}
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#233A8B] px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#1a2b6c] hover:shadow-xl sm:w-auto"
            >
              Explore Programmes
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            <Link
              href="/volunteers"
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-[#233A8B] shadow-sm ring-1 ring-inset ring-[#233A8B]/20 transition-all hover:-translate-y-0.5 hover:bg-[#FAFBFC] hover:shadow-md sm:w-auto"
            >
              Become a Volunteer
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Glass Stat Cards around the hero image */}
      {isMounted && (
        <>
          <FloatingStatCard
            icon={Heart}
            label="Lives Touched"
            value="10,000+"
            className="hidden lg:flex top-32 left-12 xl:left-24"
            delay={0.6}
          />
          <FloatingStatCard
            icon={MapPin}
            label="Districts"
            value="15+ Covered"
            className="hidden lg:flex bottom-32 left-8 xl:left-20"
            delay={0.8}
          />
          <FloatingStatCard
            icon={Users}
            label="Volunteers"
            value="500+ Active"
            className="hidden lg:flex top-48 right-12 xl:right-24"
            delay={1.0}
          />
        </>
      )}
    </section>
  );
}
