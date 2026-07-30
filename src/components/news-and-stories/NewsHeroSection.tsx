'use client';

import { ArrowDown, Mic } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

import { Container } from '@/components/shared/Container';
import { RevealCard } from '@/components/shared/RevealCard';

export function NewsHeroSection() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      aria-labelledby="news-hero-heading"
      className="border-soft-border/40 relative w-full overflow-hidden border-b py-10 sm:py-12 md:py-14"
      style={{
        background: 'linear-gradient(135deg, #EDF6FF 0%, #F7FBF4 52%, #E5F4DF 100%)',
      }}
    >
      {/* Decorative ambient background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-[#EAF3FF] opacity-70 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-1/3 h-80 w-80 rounded-full bg-[#EEF8E9] opacity-80 blur-3xl"
      />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left Text Column */}
          <div className="text-center lg:col-span-7 lg:text-left">
            <RevealCard as="div" index={0}>
              <span
                className="eyebrow-label mb-4 inline-flex items-center gap-2 rounded-full border border-[#439B25]/25 bg-[#EEF8E9] px-3.5 py-1.5 font-heading text-xs font-bold uppercase tracking-widest sm:text-sm"
                style={{ color: '#439B25' }}
              >
                IMPACT STORIES & UPDATES
              </span>
            </RevealCard>

            <RevealCard as="div" index={1}>
              <h1
                id="news-hero-heading"
                className="mb-4 font-heading text-3xl font-bold leading-[1.15] tracking-tight sm:text-4xl md:text-5xl"
                style={{ color: '#12245F' }}
              >
                Stories That <span style={{ color: '#439B25' }}>Inspire.</span>
                <br />
                Actions That Create Change.
              </h1>
            </RevealCard>

            <RevealCard as="div" index={2}>
              <p
                className="mx-auto mb-6 max-w-2xl text-sm leading-relaxed sm:mb-8 sm:text-base md:text-lg lg:mx-0"
                style={{ color: '#5E6B63' }}
              >
                Stay connected with UDBHAV Foundation through upcoming events, grassroots programme
                updates, inspiring community stories, and meaningful conversations with young
                changemakers.
              </p>
            </RevealCard>

            <RevealCard as="div" index={3}>
              <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4 lg:justify-start">
                <button
                  type="button"
                  onClick={() => scrollToSection('latest-updates')}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-6 py-3 font-heading text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:text-base"
                  style={{ background: '#439B25' }}
                >
                  Explore Latest Updates
                  <ArrowDown className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('udbhav-podcast')}
                  className="bg-pure-white inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#12245F]/20 px-6 py-3 font-heading text-sm font-semibold text-[#12245F] transition-all duration-300 hover:border-[#202B78] hover:bg-[#EAF3FF] sm:text-base"
                >
                  <Mic className="h-4 w-4 text-[#439B25]" />
                  Discover UDBHAV Podcast
                </button>
              </div>
            </RevealCard>
          </div>

          {/* Right Visual Column — Premium Authentic Photo Collage */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto grid w-full max-w-md grid-cols-2 gap-3 sm:gap-4 lg:max-w-none">
              {/* Large Left Image */}
              <div className="lg:h-76 bg-pure-white relative col-span-1 row-span-2 h-56 overflow-hidden rounded-2xl border border-[#12245F]/10 shadow-lg sm:h-64">
                <Image
                  src="/hero/hero-01.png"
                  alt="UDBHAV Foundation volunteers during community plantation drive"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  priority
                />
              </div>

              {/* Top Right Small Image */}
              <div className="h-26 sm:h-30 bg-pure-white relative col-span-1 overflow-hidden rounded-2xl border border-[#12245F]/10 shadow-md lg:h-36">
                <Image
                  src="/hero/hero-04.png"
                  alt="Students honored at UDBHAV Siksha Samman scholarship conclave"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>

              {/* Bottom Right Small Image */}
              <div className="h-26 sm:h-30 bg-pure-white relative col-span-1 overflow-hidden rounded-2xl border border-[#12245F]/10 shadow-md lg:h-36">
                <Image
                  src="/hero/hero-02.png"
                  alt="Mentorship session for civil services aspirants"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default NewsHeroSection;
