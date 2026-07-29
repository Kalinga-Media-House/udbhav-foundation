"use client";

import { Camera } from "lucide-react";
import React from "react";

import { Container } from "@/components/shared/Container";
import { RevealCard } from "@/components/shared/RevealCard";

export function GalleryHeroSection() {
  return (
    <section
      aria-labelledby="gallery-hero-heading"
      className="relative w-full overflow-hidden py-10 sm:py-12 md:py-16 border-b border-soft-border/40"
      style={{
        background:
          "linear-gradient(135deg, #EDF6FF 0%, #F7FBF4 52%, #E5F4DF 100%)",
      }}
    >
      {/* Subtle Ambient Decorative Shapes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -left-16 w-72 h-72 rounded-full bg-[#EAF3FF] blur-3xl opacity-70"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 -right-16 w-72 h-72 rounded-full bg-[#EEF8E9] blur-3xl opacity-80"
      />

      <Container className="relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <RevealCard as="div" index={0}>
            <span
              className="eyebrow-label font-heading text-xs sm:text-sm font-bold tracking-widest uppercase inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF8E9] border border-[#439B25]/25 mb-3.5 sm:mb-4"
              style={{ color: "#439B25" }}
            >
              <Camera className="w-4 h-4" />
              COMMUNITY GALLERY
            </span>
          </RevealCard>

          <RevealCard as="div" index={1}>
            <h1
              id="gallery-hero-heading"
              className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.15] mb-4"
              style={{ color: "#12245F" }}
            >
              Stories of Impact,{" "}
              <span style={{ color: "#439B25" }}>Captured Forever</span>
            </h1>
          </RevealCard>

          <RevealCard as="div" index={2}>
            <p
              className="text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
              style={{ color: "#5E6B63" }}
            >
              Explore authentic moments from UDBHAV Foundation’s programmes,
              community initiatives, volunteer activities, and the people
              creating meaningful change.
            </p>
          </RevealCard>
        </div>
      </Container>
    </section>
  );
}

export default GalleryHeroSection;
