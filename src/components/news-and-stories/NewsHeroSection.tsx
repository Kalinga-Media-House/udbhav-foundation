"use client";

import { Sparkles, ArrowDown, Mic } from "lucide-react";
import Image from "next/image";
import React from "react";

import { Container } from "@/components/shared/Container";
import { RevealCard } from "@/components/shared/RevealCard";

export function NewsHeroSection() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      aria-labelledby="news-hero-heading"
      className="relative w-full overflow-hidden py-10 sm:py-12 md:py-14 border-b border-soft-border/40"
      style={{
        background:
          "linear-gradient(135deg, #EDF6FF 0%, #F7FBF4 52%, #E5F4DF 100%)",
      }}
    >
      {/* Decorative ambient background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 -left-20 w-80 h-80 rounded-full bg-[#EAF3FF] blur-3xl opacity-70"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -right-20 w-80 h-80 rounded-full bg-[#EEF8E9] blur-3xl opacity-80"
      />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <RevealCard as="div" index={0}>
              <span
                className="eyebrow-label font-heading text-xs sm:text-sm font-bold tracking-widest uppercase inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF8E9] border border-[#439B25]/25 mb-4"
                style={{ color: "#439B25" }}
              >
                <Sparkles className="w-4 h-4" />
                IMPACT STORIES & UPDATES
              </span>
            </RevealCard>

            <RevealCard as="div" index={1}>
              <h1
                id="news-hero-heading"
                className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.15] mb-4"
                style={{ color: "#12245F" }}
              >
                Stories That <span style={{ color: "#439B25" }}>Inspire.</span>
                <br />
                Actions That Create Change.
              </h1>
            </RevealCard>

            <RevealCard as="div" index={2}>
              <p
                className="text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-6 sm:mb-8"
                style={{ color: "#5E6B63" }}
              >
                Stay connected with UDBHAV Foundation through upcoming events,
                grassroots programme updates, inspiring community stories, and
                meaningful conversations with young changemakers.
              </p>
            </RevealCard>

            <RevealCard as="div" index={3}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => scrollToSection("latest-updates")}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-heading text-sm sm:text-base font-semibold text-white shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                  style={{ background: "#439B25" }}
                >
                  Explore Latest Updates
                  <ArrowDown className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection("udbhav-podcast")}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-heading text-sm sm:text-base font-semibold transition-all duration-300 border border-[#12245F]/20 bg-pure-white text-[#12245F] hover:bg-[#EAF3FF] hover:border-[#202B78] cursor-pointer"
                >
                  <Mic className="w-4 h-4 text-[#439B25]" />
                  Discover UDBHAV Podcast
                </button>
              </div>
            </RevealCard>
          </div>

          {/* Right Visual Column — Premium Authentic Photo Collage */}
          <div className="lg:col-span-5">
            <div className="relative w-full max-w-md mx-auto lg:max-w-none grid grid-cols-2 gap-3 sm:gap-4">
              {/* Large Left Image */}
              <div className="col-span-1 row-span-2 relative h-56 sm:h-64 lg:h-76 rounded-2xl overflow-hidden shadow-lg border border-[#12245F]/10 bg-pure-white">
                <Image
                  src="/hero/hero-01.png"
                  alt="UDBHAV Foundation volunteers during community plantation drive"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  priority
                />
              </div>

              {/* Top Right Small Image */}
              <div className="col-span-1 relative h-26 sm:h-30 lg:h-36 rounded-2xl overflow-hidden shadow-md border border-[#12245F]/10 bg-pure-white">
                <Image
                  src="/hero/hero-04.png"
                  alt="Students honored at UDBHAV Siksha Samman scholarship conclave"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Bottom Right Small Image */}
              <div className="col-span-1 relative h-26 sm:h-30 lg:h-36 rounded-2xl overflow-hidden shadow-md border border-[#12245F]/10 bg-pure-white">
                <Image
                  src="/hero/hero-02.png"
                  alt="Mentorship session for civil services aspirants"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover hover:scale-105 transition-transform duration-500"
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
