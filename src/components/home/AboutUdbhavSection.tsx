"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/shared/Container";

const ROLE_CONTRIBUTIONS = [
  "Organizing events and campaigns",
  "Conducting surveys and research",
  "Managing outreach and engagement",
  "Supporting execution of programs on the ground",
];

export function AboutUdbhavSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleMotionChange);
    return () => mediaQuery.removeEventListener("change", handleMotionChange);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !sectionRef.current) return;

    if (prefersReducedMotion) {
      const frame = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="about-udbhav-heading"
      className="relative w-full overflow-hidden bg-warm-white py-14 sm:py-16 md:py-20 lg:py-24 border-b border-soft-border/40"
    >
      {/* Subtle pale-green decorative glow background accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-0 w-96 h-96 rounded-full bg-soft-green/60 blur-3xl opacity-50"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-fresh-green/10 blur-3xl opacity-40"
      />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-14 items-start">
          {/* Left Column: About UDBHAV Heading and Existing Paragraphs (~55% width on desktop) */}
          <div className="lg:col-span-7 text-left">
            {/* Step 1: Section Eyebrow and Established Badge Row */}
            <div
              style={{ transitionDelay: isVisible && !prefersReducedMotion ? "0ms" : "0ms" }}
              className={`flex flex-wrap items-center gap-3 mb-3 sm:mb-4 transition-all duration-500 ease-out ${
                prefersReducedMotion || isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2.5"
              }`}
            >
              <span className="eyebrow-label text-impact-green font-heading text-xs sm:text-sm font-bold tracking-widest uppercase">
                WHO WE ARE
              </span>
              <span
                aria-hidden="true"
                className="inline-block h-1 w-1 rounded-full bg-impact-green/50"
              />
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-soft-green text-env-green border border-impact-green/20">
                ESTABLISHED IN 2020
              </span>
            </div>

            {/* Step 2: Main Heading */}
            <h2
              id="about-udbhav-heading"
              style={{ transitionDelay: isVisible && !prefersReducedMotion ? "80ms" : "0ms" }}
              className={`font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-udbhav-blue-deep tracking-tight transition-all duration-[650ms] ease-out ${
                prefersReducedMotion || isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4 sm:translate-y-[18px]"
              }`}
            >
              About <span className="text-impact-green">UDBHAV</span>
            </h2>

            {/* Step 3: Subtle Institutional Decorative Accent Line (Green underline scaleX reveal) */}
            <div
              aria-hidden="true"
              style={{ transitionDelay: isVisible && !prefersReducedMotion ? "160ms" : "0ms" }}
              className={`mt-4 mb-8 sm:mb-10 h-1 w-16 sm:w-20 rounded-full bg-impact-green origin-left transition-transform duration-600 ease-out ${
                prefersReducedMotion || isVisible ? "scale-x-100" : "scale-x-0"
              }`}
            />

            {/* Step 4: Staggered Body Content Paragraphs */}
            <div className="space-y-6 sm:space-y-8 text-base sm:text-lg lg:text-xl text-text-primary leading-relaxed sm:leading-[1.82]">
              <p
                style={{ transitionDelay: isVisible && !prefersReducedMotion ? "220ms" : "0ms" }}
                className={`transition-all duration-700 ease-out ${
                  prefersReducedMotion || isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4 sm:translate-y-[18px]"
                }`}
              >
                UDBHAV is a community-rooted non-profit organization established in 2020, with a core mission to promote inclusivity, compassion, and empowerment through education, environment, and cultural initiatives. Since its inception, UDBHAV has flourished into a vibrant collective of{" "}
                <strong className="font-semibold text-udbhav-blue-deep">
                  250–300 active members
                </strong>
                , including professionals, student volunteers, and changemakers from various backgrounds.
              </p>

              <p
                style={{ transitionDelay: isVisible && !prefersReducedMotion ? "280ms" : "0ms" }}
                className={`transition-all duration-700 ease-out ${
                  prefersReducedMotion || isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4 sm:translate-y-[18px]"
                }`}
              >
                With operational branches in Bhubaneswar and Khordha, we are deeply engaged in community development, awareness drives, and social inclusion programs across{" "}
                <strong className="font-semibold text-udbhav-blue-deep">
                  urban and rural areas
                </strong>
                .
              </p>
            </div>
          </div>

          {/* Step 5 Outer Wrapper: Viewport Entrance Animation for USFACT Card (safe nested structure) */}
          <div
            style={{ transitionDelay: isVisible && !prefersReducedMotion ? "200ms" : "0ms" }}
            className={`lg:col-span-5 w-full transition-all duration-[850ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] ${
              prefersReducedMotion || isVisible
                ? "opacity-100 translate-x-0 translate-y-0 scale-100"
                : "opacity-0 translate-y-5 md:translate-y-3 md:translate-x-7 scale-[0.99] md:scale-[0.985]"
            }`}
          >
            {/* Step 5 Middle Wrapper: Continuous Floating Effect (no transform conflict with hover or reveal) */}
            <div className={!prefersReducedMotion ? "animate-usfact-float" : ""}>
              {/* Step 5 Inner Card: Interactive Hover / Tap Card */}
              <article className="interactive-card relative bg-pure-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-9 border border-impact-green/25 shadow-xl shadow-impact-green/5 flex flex-col justify-between">
              {/* Card Header Row with Eyebrow and Optional Official Logo */}
              <div
                style={{ transitionDelay: isVisible && !prefersReducedMotion ? "280ms" : "0ms" }}
                className={`flex items-start justify-between gap-4 mb-4 transition-all duration-500 ease-out ${
                  prefersReducedMotion || isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2"
                }`}
              >
                <div>
                  <span className="eyebrow-label text-udbhav-blue-deep font-heading text-xs font-bold tracking-widest uppercase block mb-1.5">
                    UDBHAV STUDENT FRONT
                  </span>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-udbhav-blue-deep tracking-tight">
                    USFACT &amp; Community Impact
                  </h3>
                </div>

                <div className="shrink-0">
                  <Image
                    src="/brand/usfact-logo.png"
                    alt="USFACT official emblem"
                    width={56}
                    height={56}
                    className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
                  />
                </div>
              </div>

              {/* Decorative Accent Line */}
              <div
                aria-hidden="true"
                className="mb-5 h-0.5 w-12 rounded-full bg-impact-green/60"
              />

              {/* Introductory Content */}
              <p
                style={{ transitionDelay: isVisible && !prefersReducedMotion ? "340ms" : "0ms" }}
                className={`text-sm sm:text-base text-text-primary leading-relaxed mb-6 transition-all duration-500 ease-out ${
                  prefersReducedMotion || isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2"
                }`}
              >
                A unique strength of UDBHAV is its student front,{" "}
                <strong className="font-semibold text-udbhav-blue-deep">
                  USFACT
                </strong>{" "}
                ({" "}
                <strong className="font-semibold text-udbhav-blue-deep">
                  UDBHAV Student Front for Action, Change, and Transformation
                </strong>{" "}
                ) — a dynamic youth wing that plays a critical role in organizing events, conducting surveys, coordinating outreach, and managing ground-level execution.
              </p>

              {/* Role & Contributions Panel */}
              <div
                style={{ transitionDelay: isVisible && !prefersReducedMotion ? "400ms" : "0ms" }}
                className={`bg-soft-green/70 border border-impact-green/20 rounded-2xl p-5 sm:p-6 transition-all duration-500 ease-out ${
                  prefersReducedMotion || isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2"
                }`}
              >
                <h4 className="font-heading text-base sm:text-lg font-semibold text-env-green mb-3.5 flex items-center gap-2">
                  Role &amp; Contributions
                </h4>

                <ul className="space-y-2.5 text-sm sm:text-base text-text-primary">
                  {ROLE_CONTRIBUTIONS.map((point) => (
                    <li key={point} className="flex items-start gap-2.5">
                      <CheckCircle2
                        aria-hidden="true"
                        className="w-5 h-5 text-impact-green shrink-0 mt-0.5"
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default AboutUdbhavSection;
