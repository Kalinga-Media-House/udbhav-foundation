"use client";

import { Eye, Target, Sparkles } from "lucide-react";
import React from "react";

import { Container } from "@/components/shared/Container";
import { RevealCard } from "@/components/shared/RevealCard";

export function AboutVisionMissionSection() {
  return (
    <section
      aria-labelledby="about-vision-mission-heading"
      className="relative w-full overflow-hidden bg-gradient-to-b from-pure-white via-[#FDFCF8] to-warm-white py-12 sm:py-16 md:py-20 border-b border-soft-border/40"
    >
      <Container>
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-14">
          <RevealCard as="div" index={0}>
            <span className="eyebrow-label text-impact-green font-heading text-xs sm:text-sm font-bold tracking-widest uppercase block mb-2">
              GUIDING PRINCIPLES
            </span>
            <h2
              id="about-vision-mission-heading"
              className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-udbhav-blue-deep tracking-tight"
            >
              Our Vision & Mission
            </h2>
          </RevealCard>
        </div>

        {/* Stacked Compact Horizontal Cards */}
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          {/* CARD 1: VISION */}
          <RevealCard
            as="div"
            index={1}
            className="group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-pure-white via-[#FDFCF8] to-soft-green/25 border border-impact-green/25 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-8">
              {/* Icon Side */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-soft-green/60 border border-impact-green/30 flex items-center justify-center shrink-0">
                <Eye className="w-7 h-7 sm:w-8 sm:h-8 text-impact-green" />
              </div>

              {/* Content Side */}
              <div className="flex-1 space-y-2">
                <span className="eyebrow-label text-impact-green font-heading text-xs font-bold tracking-widest uppercase block">
                  OUR VISION
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-udbhav-blue-deep tracking-tight">
                  A Future Where Everyone Can Thrive
                </h3>
                <p className="text-sm sm:text-base text-text-primary leading-relaxed pt-1">
                  To build a world where every mind is heard, every individual
                  is empowered through education, and every community lives in
                  harmony with nature—creating a future that is compassionate,
                  conscious, and sustainable.
                </p>
              </div>
            </div>
          </RevealCard>

          {/* CARD 2: MISSION */}
          <RevealCard
            as="div"
            index={2}
            className="group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-pure-white via-[#FDFCF8] to-soft-green/25 border border-impact-green/25 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-8">
              {/* Icon Side */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-soft-green/60 border border-impact-green/30 flex items-center justify-center shrink-0">
                <Target className="w-7 h-7 sm:w-8 sm:h-8 text-impact-green" />
              </div>

              {/* Content Side */}
              <div className="flex-1 space-y-3">
                <div>
                  <span className="eyebrow-label text-impact-green font-heading text-xs font-bold tracking-widest uppercase block mb-1">
                    OUR MISSION
                  </span>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-udbhav-blue-deep tracking-tight">
                    Turning Awareness into Meaningful Action
                  </h3>
                </div>

                <div className="space-y-2.5 text-sm sm:text-base text-text-primary leading-relaxed">
                  <p>
                    At UDBHAV Foundation, our mission is to create meaningful
                    change by nurturing mental well-being, expanding access to
                    quality education, and fostering environmental responsibility.
                  </p>
                  <p>
                    We work at the grassroots to turn awareness into
                    action—breaking stigma, opening doors to opportunity, and
                    inspiring individuals to become active participants in
                    building a better world.
                  </p>
                </div>

                {/* Highlight box */}
                <div className="mt-3 inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-soft-green/50 border border-impact-green/30 text-xs sm:text-sm font-semibold text-udbhav-blue-deep">
                  <Sparkles className="w-4 h-4 text-impact-green shrink-0" />
                  <span>
                    Our approach is simple yet powerful: listen deeply, act
                    responsibly, and grow together.
                  </span>
                </div>
              </div>
            </div>
          </RevealCard>
        </div>
      </Container>
    </section>
  );
}

export default AboutVisionMissionSection;
