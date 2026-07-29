"use client";

import React, { useState, useEffect, useRef } from "react";

import { Container } from "@/components/shared/Container";

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
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          {/* Step 1: Section Eyebrow and Established Badge Row */}
          <div
            style={{ transitionDelay: isVisible && !prefersReducedMotion ? "0ms" : "0ms" }}
            className={`flex flex-wrap items-center justify-center gap-3 mb-4 sm:mb-5 transition-all duration-500 ease-out ${
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
            className={`font-heading text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-udbhav-blue-deep tracking-tight transition-all duration-[650ms] ease-out ${
              prefersReducedMotion || isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4 sm:translate-y-[18px]"
            }`}
          >
            About <span className="text-impact-green">UDBHAV</span>
          </h2>

          {/* Step 3: Subtle Institutional Decorative Accent Line */}
          <div
            aria-hidden="true"
            style={{ transitionDelay: isVisible && !prefersReducedMotion ? "160ms" : "0ms" }}
            className={`mt-5 mb-8 sm:mb-12 h-1 w-16 sm:w-20 rounded-full bg-impact-green origin-center transition-transform duration-600 ease-out mx-auto ${
              prefersReducedMotion || isVisible ? "scale-x-100" : "scale-x-0"
            }`}
          />

          {/* Step 4: Staggered Body Content Paragraphs */}
          <div className="space-y-6 sm:space-y-8 text-base sm:text-lg lg:text-xl text-text-primary leading-relaxed sm:leading-[1.82] max-w-3xl">
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
      </Container>
    </section>
  );
}

export default AboutUdbhavSection;
