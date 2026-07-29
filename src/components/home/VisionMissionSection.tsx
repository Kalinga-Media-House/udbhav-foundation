"use client";

import { Eye, Target } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import { Container } from "@/components/shared/Container";


export function VisionMissionSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isReduced = mediaQuery.matches;

    if (isReduced) {
      requestAnimationFrame(() => {
        setReducedMotion(true);
        setIsVisible(true);
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="vision-mission-heading"
      className="relative w-full overflow-hidden bg-[#FDFCF8] py-14 sm:py-16 md:py-20 lg:py-24 border-b border-soft-border/40"
    >
      {/* Subtle radial green glow / ambient CSS decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-soft-green/50 blur-3xl opacity-60"
      />

      <Container className="relative z-10">
        {/* Section Introduction Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-14 lg:mb-16">
          <span className="eyebrow-label text-impact-green font-heading text-xs sm:text-sm font-bold tracking-widest uppercase block mb-3">
            OUR PURPOSE
          </span>
          <h2
            id="vision-mission-heading"
            className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-udbhav-blue-deep tracking-tight mb-4"
          >
            Vision &amp; Mission
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-text-secondary leading-relaxed">
            Guided by compassion, inclusion, education and responsible collective action.
          </p>
        </div>

        {/* Vertical Compact Layout for Vision and Mission Cards */}
        <div className="flex flex-col gap-5 sm:gap-6 lg:gap-7 max-w-5xl mx-auto mb-16 sm:mb-20">
          {/* 1. Vision Card */}
          <article
            className={`interactive-card relative w-full bg-gradient-to-br from-pure-white via-pure-white to-soft-green/40 rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 lg:p-9 border border-impact-green/25 shadow-xl shadow-impact-green/5 text-left duration-700 hover:shadow-2xl hover:border-impact-green/40 ${
              reducedMotion || isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            {/* Card Header Row */}
            <div className="flex items-center justify-between gap-4 mb-3 sm:mb-4">
              <span className="eyebrow-label text-impact-green font-heading text-xs font-bold tracking-widest uppercase">
                OUR VISION
              </span>
              <div className="w-10 h-10 rounded-full bg-soft-green flex items-center justify-center shrink-0 border border-impact-green/20">
                <Eye aria-hidden="true" className="w-5 h-5 text-impact-green" />
              </div>
            </div>

            {/* Card Main Heading */}
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-udbhav-blue-deep tracking-tight mb-4">
              A Future Where Everyone Can Thrive
            </h3>

            {/* Accent Line */}
            <div
              aria-hidden="true"
              className="mb-4 h-1 w-14 rounded-full bg-impact-green"
            />

            {/* Body Content */}
            <p className="text-base sm:text-lg text-text-primary leading-relaxed sm:leading-[1.8] max-w-4xl">
              To build a world where{" "}
              <strong className="font-semibold text-udbhav-blue-deep">
                every mind is heard
              </strong>
              , every individual is{" "}
              <strong className="font-semibold text-udbhav-blue-deep">
                empowered through education
              </strong>
              , and every community lives in harmony with nature—creating a future that is{" "}
              <strong className="font-semibold text-udbhav-blue-deep">
                compassionate, conscious, and sustainable
              </strong>
              .
            </p>
          </article>

          {/* 2. Mission Card */}
          <article
            className={`interactive-card relative w-full bg-pure-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 lg:p-9 border border-impact-green/25 shadow-xl shadow-impact-green/5 text-left duration-700 delay-100 hover:shadow-2xl hover:border-impact-green/40 ${
              reducedMotion || isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            {/* Card Header Row */}
            <div className="flex items-center justify-between gap-4 mb-3 sm:mb-4">
              <span className="eyebrow-label text-udbhav-blue-deep font-heading text-xs font-bold tracking-widest uppercase">
                OUR MISSION
              </span>
              <div className="w-10 h-10 rounded-full bg-soft-green flex items-center justify-center shrink-0 border border-impact-green/20">
                <Target aria-hidden="true" className="w-5 h-5 text-impact-green" />
              </div>
            </div>

            {/* Card Main Heading */}
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-udbhav-blue-deep tracking-tight mb-4">
              Turning Awareness into Meaningful Action
            </h3>

            {/* Accent Line */}
            <div
              aria-hidden="true"
              className="mb-4 sm:mb-5 h-1 w-14 rounded-full bg-impact-green"
            />

            {/* Body Paragraphs */}
            <div className="space-y-4 text-base sm:text-lg text-text-primary leading-relaxed sm:leading-[1.8] max-w-4xl mb-6">
              <p>
                At UDBHAV Foundation, our mission is to create meaningful change by nurturing{" "}
                <strong className="font-semibold text-udbhav-blue-deep">
                  mental well-being
                </strong>
                , expanding access to{" "}
                <strong className="font-semibold text-udbhav-blue-deep">
                  quality education
                </strong>
                , and fostering environmental responsibility.
              </p>

              <p>
                We work at the grassroots to turn{" "}
                <strong className="font-semibold text-udbhav-blue-deep">
                  awareness into action
                </strong>
                —breaking stigma, opening doors to opportunity, and inspiring individuals to become{" "}
                <strong className="font-semibold text-udbhav-blue-deep">
                  active participants
                </strong>{" "}
                in building a better world.
              </p>
            </div>

            {/* Mission Approach Statement Highlighted Panel at Bottom of Card */}
            <div className="bg-soft-green/70 border border-impact-green/25 border-l-4 border-l-impact-green rounded-xl sm:rounded-2xl p-4 sm:p-5">
              <p className="text-sm sm:text-base font-semibold text-text-primary leading-relaxed">
                Our approach is simple yet powerful: listen deeply, act responsibly, and grow together.
              </p>
            </div>
          </article>
        </div>
      </Container>
    </section>
  );
}

export default VisionMissionSection;

