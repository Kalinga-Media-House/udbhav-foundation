'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { Container } from '@/components/shared/Container';

export function AboutHeroSection() {
  return (
    <section
      aria-labelledby="about-hero-heading"
      className="border-soft-border/40 relative w-full overflow-hidden border-b py-10 sm:py-12 md:py-14"
      style={{
        background: 'linear-gradient(135deg, #171f69 0%, #202a7a 50%, #123f72 100%)',
      }}
    >
      {/* Subtle ambient radial accent glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-1/4 h-80 w-80 rounded-full bg-white/[0.08] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="bg-impact-green/[0.12] pointer-events-none absolute -bottom-24 left-1/4 h-80 w-80 rounded-full blur-3xl"
      />

      <Container className="relative z-10">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          {/* Subtle Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-3 sm:mb-4">
            <ol className="text-pure-white/80 inline-flex items-center gap-1.5 text-xs font-medium sm:text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-pure-white underline-offset-4 transition-colors hover:underline"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-pure-white/50">
                <ChevronRight className="h-3.5 w-3.5" />
              </li>
              <li className="font-semibold text-[#86EFAC]" aria-current="page">
                About Us
              </li>
            </ol>
          </nav>

          {/* Eyebrow Label */}
          <span className="eyebrow-label mb-2 block font-heading text-xs font-bold uppercase tracking-widest text-[#86EFAC] sm:mb-2.5 sm:text-sm">
            ABOUT UDBHAV FOUNDATION
          </span>

          {/* Main Heading */}
          <h1
            id="about-hero-heading"
            className="text-pure-white mb-3 font-heading text-2xl font-bold leading-tight tracking-tight sm:mb-4 sm:text-3xl md:text-4xl lg:text-[42px]"
          >
            Growing Together for an Inclusive Future
          </h1>

          {/* Description */}
          <p className="text-pure-white/90 mx-auto max-w-3xl text-sm leading-relaxed sm:text-base md:text-lg">
            We are a family of volunteers working together to nurture young minds, protect our
            environment, and build communities where everyone feels they belong.
          </p>
        </div>
      </Container>
    </section>
  );
}

export default AboutHeroSection;
