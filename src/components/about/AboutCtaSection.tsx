"use client";

import { ArrowRight, Heart } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Container } from "@/components/shared/Container";
import { RevealCard } from "@/components/shared/RevealCard";

export function AboutCtaSection() {
  return (
    <section
      aria-labelledby="about-cta-heading"
      className="relative w-full overflow-hidden py-14 sm:py-16 md:py-20 border-t border-soft-border/40"
      style={{
        background:
          "linear-gradient(135deg, #1b2677 0%, #172a72 50%, #0c1c54 100%)",
      }}
    >
      {/* Decorative subtle ambient radial glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-10 w-80 h-80 rounded-full bg-white/[0.07] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-10 w-80 h-80 rounded-full bg-[#86EFAC]/[0.08] blur-3xl"
      />

      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-5 sm:space-y-6">
          <RevealCard as="div" index={0}>
            <span className="eyebrow-label text-[#86EFAC] font-heading text-xs sm:text-sm font-bold tracking-widest uppercase block mb-2">
              BECOME PART OF THE MOVEMENT
            </span>
            <h2
              id="about-cta-heading"
              className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold text-pure-white tracking-tight leading-tight"
            >
              Together, We Can Turn Compassion into Action
            </h2>
          </RevealCard>

          <RevealCard as="div" index={1}>
            <p className="text-sm sm:text-base md:text-lg text-pure-white/90 leading-relaxed max-w-2xl mx-auto">
              Every meaningful change begins when people choose to care,
              participate, and act together. Join the UDBHAV community and help
              us build a more inclusive, empowered, and sustainable future.
            </p>
          </RevealCard>

          <RevealCard
            as="div"
            index={2}
            className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4"
          >
            {/* Primary Green Button -> Volunteers */}
            <Link
              href="/volunteers"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-impact-green text-udbhav-blue-deep font-heading font-bold text-sm sm:text-base shadow-lg shadow-impact-green/25 hover:bg-[#A7F3D0] transition-all duration-300 active:scale-[0.98]"
            >
              <span>Join as a Volunteer</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Secondary Outlined White Button -> Donate */}
            <Link
              href="/donate"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full border border-pure-white/40 bg-pure-white/10 hover:bg-pure-white/20 text-pure-white font-heading font-bold text-sm sm:text-base backdrop-blur-sm transition-all duration-300 active:scale-[0.98]"
            >
              <Heart className="w-4 h-4 text-[#86EFAC]" />
              <span>Support Our Mission</span>
            </Link>
          </RevealCard>
        </div>
      </Container>
    </section>
  );
}

export default AboutCtaSection;
