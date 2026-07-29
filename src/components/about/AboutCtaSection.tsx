'use client';

import { ArrowRight, Heart } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { Container } from '@/components/shared/Container';
import { RevealCard } from '@/components/shared/RevealCard';

export function AboutCtaSection() {
  return (
    <section
      aria-labelledby="about-cta-heading"
      className="border-soft-border/40 relative w-full overflow-hidden border-t py-14 sm:py-16 md:py-20"
      style={{
        background: 'linear-gradient(135deg, #1b2677 0%, #172a72 50%, #0c1c54 100%)',
      }}
    >
      {/* Decorative subtle ambient radial glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-10 h-80 w-80 rounded-full bg-white/[0.07] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-10 h-80 w-80 rounded-full bg-[#86EFAC]/[0.08] blur-3xl"
      />

      <Container className="relative z-10">
        <div className="mx-auto max-w-4xl space-y-5 text-center sm:space-y-6">
          <RevealCard as="div" index={0}>
            <span className="eyebrow-label mb-2 block font-heading text-xs font-bold uppercase tracking-widest text-[#86EFAC] sm:text-sm">
              BECOME PART OF THE MOVEMENT
            </span>
            <h2
              id="about-cta-heading"
              className="text-pure-white font-heading text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl lg:text-[40px]"
            >
              Together, We Can Turn Compassion into Action
            </h2>
          </RevealCard>

          <RevealCard as="div" index={1}>
            <p className="text-pure-white/90 mx-auto max-w-2xl text-sm leading-relaxed sm:text-base md:text-lg">
              Every big change starts with a simple choice to care and act together. We would love
              for you to join our Udbhav family and help us build a brighter, more supportive future
              for everyone.
            </p>
          </RevealCard>

          <RevealCard
            as="div"
            index={2}
            className="flex flex-col items-center justify-center gap-3.5 pt-2 sm:flex-row sm:gap-4"
          >
            {/* Primary Green Button -> Volunteers */}
            <Link
              href="/volunteers"
              className="bg-impact-green text-udbhav-blue-deep shadow-impact-green/25 inline-flex w-full items-center justify-center gap-2.5 rounded-full px-7 py-3.5 font-heading text-sm font-bold shadow-lg transition-all duration-300 hover:bg-[#A7F3D0] active:scale-[0.98] sm:w-auto sm:text-base"
            >
              <span>Join as a Volunteer</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            {/* Secondary Outlined White Button -> Donate */}
            <Link
              href="/donate"
              className="border-pure-white/40 bg-pure-white/10 hover:bg-pure-white/20 text-pure-white inline-flex w-full items-center justify-center gap-2.5 rounded-full border px-7 py-3.5 font-heading text-sm font-bold backdrop-blur-sm transition-all duration-300 active:scale-[0.98] sm:w-auto sm:text-base"
            >
              <Heart className="h-4 w-4 text-[#86EFAC]" />
              <span>Support Our Mission</span>
            </Link>
          </RevealCard>
        </div>
      </Container>
    </section>
  );
}

export default AboutCtaSection;
