"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/shared/Container";

export function AboutHeroSection() {
  return (
    <section
      aria-labelledby="about-hero-heading"
      className="relative w-full overflow-hidden py-10 sm:py-12 md:py-14 border-b border-soft-border/40"
      style={{
        background:
          "linear-gradient(135deg, #171f69 0%, #202a7a 50%, #123f72 100%)",
      }}
    >
      {/* Subtle ambient radial accent glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-1/4 w-80 h-80 rounded-full bg-white/[0.08] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-1/4 w-80 h-80 rounded-full bg-impact-green/[0.12] blur-3xl"
      />

      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          {/* Subtle Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-3 sm:mb-4">
            <ol className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-pure-white/80 font-medium">
              <li>
                <Link
                  href="/"
                  className="hover:text-pure-white transition-colors underline-offset-4 hover:underline"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-pure-white/50">
                <ChevronRight className="w-3.5 h-3.5" />
              </li>
              <li className="text-[#86EFAC] font-semibold" aria-current="page">
                About Us
              </li>
            </ol>
          </nav>

          {/* Eyebrow Label */}
          <span className="eyebrow-label text-[#86EFAC] font-heading text-xs sm:text-sm font-bold tracking-widest uppercase block mb-2 sm:mb-2.5">
            ABOUT UDBHAV FOUNDATION
          </span>

          {/* Main Heading */}
          <h1
            id="about-hero-heading"
            className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold text-pure-white tracking-tight leading-tight mb-3 sm:mb-4"
          >
            Growing Together for an Inclusive Future
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg text-pure-white/90 leading-relaxed max-w-3xl mx-auto">
            UDBHAV Foundation is a community-rooted non-profit organization
            committed to nurturing minds, expanding opportunities, protecting
            the environment, and building inclusive communities through
            compassion and collective action.
          </p>
        </div>
      </Container>
    </section>
  );
}

export default AboutHeroSection;
