"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useCallback } from "react";

import { Container } from "@/components/shared/Container";
import { HERO_SLIDES, type HeroSlide } from "@/data/hero-slides";

export interface HeroCarouselProps {
  slides?: HeroSlide[];
  autoPlayInterval?: number;
}

// Computes alternating Ken Burns motion styles safely derived from slide index
function getCinematicTransform(index: number, isActive: boolean, reducedMotion: boolean) {
  if (reducedMotion) {
    return "scale(1) translate3d(0, 0, 0)";
  }

  const variant = index % 4;
  if (!isActive) {
    switch (variant) {
      case 0:
        return "scale(1.02) translate3d(0, 0, 0)";
      case 1:
        return "scale(1.065) translate3d(-1.2%, 0, 0)";
      case 2:
        return "scale(1.02) translate3d(0, -1%, 0)";
      case 3:
      default:
        return "scale(1.065) translate3d(0, 0, 0)";
    }
  }

  switch (variant) {
    case 0:
      return "scale(1.065) translate3d(-1.2%, -0.8%, 0)";
    case 1:
      return "scale(1.02) translate3d(0, -0.6%, 0)";
    case 2:
      return "scale(1.065) translate3d(-1%, 0, 0)";
    case 3:
    default:
      return "scale(1.02) translate3d(-1.2%, -0.6%, 0)";
  }
}

export function HeroCarousel({
  slides = HERO_SLIDES,
  autoPlayInterval = 5000,
}: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHoverPaused, setIsHoverPaused] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  const totalSlides = slides?.length || 0;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    const handleVisibility = () => {
      setIsTabHidden(document.hidden);
    };

    mediaQuery.addEventListener("change", handleMotionChange);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      mediaQuery.removeEventListener("change", handleMotionChange);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const goToNextSlide = useCallback(() => {
    setActiveIndex((prev) => (totalSlides > 0 ? (prev + 1) % totalSlides : 0));
  }, [totalSlides]);

  const goToPrevSlide = useCallback(() => {
    setActiveIndex((prev) => (totalSlides > 0 ? (prev - 1 + totalSlides) % totalSlides : 0));
  }, [totalSlides]);

  const goToSlide = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  // Stable single automatic slide transition timer (pauses on hover/focus or hidden tab)
  useEffect(() => {
    if (isHoverPaused || isTabHidden || totalSlides <= 1) return;

    const interval = window.setInterval(() => {
      setActiveIndex((currentSlide) => (currentSlide + 1) % totalSlides);
    }, autoPlayInterval);

    return () => {
      window.clearInterval(interval);
    };
  }, [isHoverPaused, isTabHidden, totalSlides, autoPlayInterval]);

  if (!slides || totalSlides === 0) {
    return null;
  }

  return (
    <section
      aria-label="UDBHAV Foundation featured initiatives"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsHoverPaused(true)}
      onMouseLeave={() => setIsHoverPaused(false)}
      onFocusCapture={() => setIsHoverPaused(true)}
      onBlurCapture={() => setIsHoverPaused(false)}
      className="relative w-full overflow-hidden min-h-[calc(100dvh-121px)] sm:min-h-[calc(100dvh-114px)] flex flex-col justify-center bg-udbhav-blue-deep"
    >
      {/* Background Images and Cinematic Overlay Layers for Each Slide */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;
          const transformStyle = getCinematicTransform(index, isActive, prefersReducedMotion);

          return (
            <div
              key={slide.id}
              aria-hidden={!isActive}
              style={{
                transition: "opacity 1000ms cubic-bezier(0.22, 1, 0.36, 1)",
                willChange: isActive ? "opacity" : "auto",
              }}
              className={`absolute inset-0 ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Background Image with Cinematic Ken Burns Motion */}
              <Image
                src={slide.image}
                alt={slide.imageAlt}
                fill
                priority={index === 0}
                sizes="100vw"
                style={{
                  objectPosition: slide.objectPosition || "center center",
                  transform: transformStyle,
                  transition:
                    "transform 6000ms cubic-bezier(0.25, 1, 0.5, 1), filter 1000ms ease",
                  filter:
                    isActive && !prefersReducedMotion
                      ? "brightness(1) contrast(1.02)"
                      : "brightness(0.96) contrast(1)",
                  willChange: isActive ? "transform" : "auto",
                }}
                className="object-cover"
              />

              {/* Multi-layer Accessible Dark Gradient Overlay */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-[#0A1628]/92 via-[#0A1628]/78 to-[#0A1628]/60 lg:from-[#0A1628]/85 lg:via-[#0A1628]/50 lg:to-[#0A1628]/25"
              />

              {/* Subtle Bottom Gradient for Indicator & Control Readability */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0A1628]/85 via-[#0A1628]/35 to-transparent"
              />
            </div>
          );
        })}

        {/* Very Soft Ambient Living Light Layer (~0.05 opacity) */}
        {!prefersReducedMotion && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 opacity-5 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-soft-green via-transparent to-transparent"
          />
        )}
      </div>

      {/* Main Slide Text Content */}
      <Container className="relative z-20 py-12 sm:py-16 lg:py-24 my-auto">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;
          if (!isActive) return null;

          return (
            <div
              key={`${slide.id}-${activeIndex}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${totalSlides}: ${slide.eyebrow}`}
              className="max-w-[740px] text-left flex flex-col items-start"
            >
              {/* Eyebrow Label */}
              <span
                style={{
                  color: "#FFFFFF",
                  opacity: 1,
                  textShadow: "0 1px 6px rgba(0, 0, 0, 0.6)",
                }}
                className="animate-hero-eyebrow eyebrow-label text-white font-heading text-xs sm:text-sm font-bold tracking-widest uppercase mb-3 sm:mb-4 block"
              >
                {slide.eyebrow}
              </span>

              {/* Main Heading */}
              <h1 className="animate-hero-heading font-heading text-[32px] max-[359px]:text-[28px] sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-pure-white leading-[1.12]">
                {slide.heading}
              </h1>

              {/* Description */}
              <p className="animate-hero-description text-base sm:text-lg lg:text-xl text-pure-white/90 leading-relaxed max-w-2xl mt-4 sm:mt-6">
                {slide.description}
              </p>

              {/* Action Buttons */}
              <div className="animate-hero-buttons flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-6 sm:mt-8 w-full sm:w-auto">
                <Link
                  href={slide.primaryAction.href}
                  className="inline-flex items-center justify-center min-h-[46px] px-6 py-3 rounded-xl bg-impact-green hover:bg-env-green text-pure-white font-semibold text-sm sm:text-base shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-pure-white"
                >
                  {slide.primaryAction.label}
                </Link>
                <Link
                  href={slide.secondaryAction.href}
                  className="inline-flex items-center justify-center min-h-[46px] px-6 py-3 rounded-xl bg-pure-white/10 hover:bg-pure-white hover:text-udbhav-blue-deep border border-pure-white/60 text-pure-white font-semibold text-sm sm:text-base backdrop-blur-xs shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-pure-white"
                >
                  {slide.secondaryAction.label}
                </Link>
              </div>
            </div>
          );
        })}
      </Container>

      {/* Left/Right Navigation Controls (Hidden below 768px: hidden md:flex) */}
      <button
        type="button"
        onClick={goToPrevSlide}
        aria-label="Previous slide"
        className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 items-center justify-center w-11 h-11 rounded-full bg-pure-white/15 hover:bg-pure-white/30 border border-pure-white/30 text-pure-white backdrop-blur-xs transition-all focus-visible:outline-2 focus-visible:outline-fresh-green"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        type="button"
        onClick={goToNextSlide}
        aria-label="Next slide"
        className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 items-center justify-center w-11 h-11 rounded-full bg-pure-white/15 hover:bg-pure-white/30 border border-pure-white/30 text-pure-white backdrop-blur-xs transition-all focus-visible:outline-2 focus-visible:outline-fresh-green"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Bottom Bar: Slide Indicators (Always visible, synchronized, clean bottom-left layout) */}
      <div className="absolute bottom-6 sm:bottom-8 inset-x-0 z-30">
        <Container className="flex items-center">
          {/* Progress Indicators */}
          <div
            role="tablist"
            aria-label="Hero slides"
            className="flex items-center gap-2 sm:gap-2.5"
          >
            {slides.map((_, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={index}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Go to slide ${index + 1}`}
                  onClick={() => goToSlide(index)}
                  className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-pure-white ${
                    isActive
                      ? "w-8 sm:w-10 bg-fresh-green"
                      : "w-2.5 sm:w-3 bg-pure-white/45 hover:bg-pure-white/75"
                  }`}
                />
              );
            })}
          </div>
        </Container>
      </div>
    </section>
  );
}

export default HeroCarousel;
