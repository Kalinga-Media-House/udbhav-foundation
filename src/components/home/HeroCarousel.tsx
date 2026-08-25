"use client";

import { ChevronLeft, ChevronRight, Compass, Users, Calendar, Mic, Image as ImageIcon, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useCallback } from "react";

import { Container } from "@/components/shared/Container";
import { HERO_SLIDES } from "@/data/hero-slides";
import type { HeroImageRow } from "@/features/hero/repository";

export interface HeroCarouselProps {
  heroImages?: HeroImageRow[];
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
  heroImages,
  autoPlayInterval = 5000,
}: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHoverPaused, setIsHoverPaused] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  const images = heroImages && heroImages.length > 0
    ? heroImages.map(img => img.image_url)
    : [HERO_SLIDES[0].image];
  const totalSlides = images.length;

  // Static text from the first slide as per requirements
  const staticContent = HERO_SLIDES[0];

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
        {images.map((imageUrl, index) => {
          const isActive = index === activeIndex;
          const transformStyle = getCinematicTransform(index, isActive, prefersReducedMotion);

          return (
            <div
              key={index}
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
                src={imageUrl}
                alt="UDBHAV Foundation"
                fill
                priority={index === 0}
                sizes="100vw"
                style={{
                  objectPosition: "center center",
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

      {/* Main Static Text Content */}
      <Container className="relative z-20 py-10 sm:py-16 lg:py-24 my-auto">
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes heroTitleFloat {
            0%, 100% {
              transform: translateY(0);
              opacity: 0.9;
              text-shadow: 0 4px 20px rgba(255,255,255,0.3);
              letter-spacing: normal;
            }
            50% {
              transform: translateY(-8px);
              opacity: 1;
              text-shadow: 0 4px 30px rgba(255,255,255,0.7);
              letter-spacing: 0.05em;
            }
          }
          @keyframes heroTitleEntrance {
            0% {
              opacity: 0;
              transform: translateY(20px);
              letter-spacing: -0.05em;
            }
            100% {
              opacity: 0.9;
              transform: translateY(0);
              letter-spacing: normal;
            }
          }
          @keyframes heroGlassEntrance {
            0% {
              opacity: 0;
              transform: translateY(16px) scale(0.98);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          .animate-hero-title {
            animation: heroTitleEntrance 0.8s ease-out forwards, heroTitleFloat 6s ease-in-out 1s infinite;
          }
          .animate-glass-btn {
            opacity: 0;
            animation: heroGlassEntrance 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-hero-title {
              animation: none !important;
              opacity: 1 !important;
              transform: none !important;
              letter-spacing: normal !important;
              text-shadow: none !important;
            }
            .animate-glass-btn {
              animation: none !important;
              opacity: 1 !important;
              transform: none !important;
            }
          }
        `}} />

        <div className="flex flex-col items-center justify-center text-center w-full">
          {/* Animated Title */}
          <h1 className="animate-hero-title font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 sm:mb-14 md:mb-20 px-2">
            UDBHAV FOUNDATION
          </h1>

          {/* Glass Navigation Grid */}
          <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-4 md:gap-5 px-2 sm:px-0">
            {[
              {
                title: "EXPLORE OUR WORK",
                href: "/about",
                icon: Compass,
                activeColor: "hover:bg-emerald-500/25 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(52,211,153,0.35)] active:bg-emerald-500/30 active:border-emerald-400 active:shadow-[0_0_20px_rgba(52,211,153,0.4)]",
                delay: "0.1s",
              },
              {
                title: "JOIN AS A VOLUNTEER",
                href: "/volunteers",
                icon: Users,
                activeColor: "hover:bg-cyan-500/25 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.35)] active:bg-cyan-500/30 active:border-cyan-400 active:shadow-[0_0_20px_rgba(34,211,238,0.4)]",
                delay: "0.18s",
              },
              {
                title: "UPCOMING EVENTS",
                href: "/events",
                icon: Calendar,
                activeColor: "hover:bg-amber-500/25 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(251,191,36,0.35)] active:bg-amber-500/30 active:border-amber-400 active:shadow-[0_0_20px_rgba(251,191,36,0.4)]",
                delay: "0.26s",
              },
              {
                title: "PODCAST",
                href: "/podcast",
                icon: Mic,
                activeColor: "hover:bg-violet-500/25 hover:border-violet-400 hover:shadow-[0_0_20px_rgba(139,92,246,0.35)] active:bg-violet-500/30 active:border-violet-400 active:shadow-[0_0_20px_rgba(139,92,246,0.4)]",
                delay: "0.34s",
              },
              {
                title: "GALLERY",
                href: "/gallery",
                icon: ImageIcon,
                activeColor: "hover:bg-pink-500/25 hover:border-pink-400 hover:shadow-[0_0_20px_rgba(236,72,153,0.35)] active:bg-pink-500/30 active:border-pink-400 active:shadow-[0_0_20px_rgba(236,72,153,0.4)]",
                delay: "0.42s",
              },
              {
                title: "CONTRIBUTE",
                href: "/donate",
                icon: Heart,
                activeColor: "hover:bg-orange-500/25 hover:border-orange-400 hover:shadow-[0_0_20px_rgba(249,115,22,0.35)] active:bg-orange-500/30 active:border-orange-400 active:shadow-[0_0_20px_rgba(249,115,22,0.4)]",
                delay: "0.5s",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  style={{ animationDelay: item.delay }}
                  className={`animate-glass-btn group flex items-center justify-center gap-2.5 sm:gap-3 w-full h-[56px] sm:h-[80px] md:h-[90px] rounded-[14px] sm:rounded-2xl bg-white/5 backdrop-blur-md border border-white/20 text-white shadow-sm transition-all duration-300 ${item.activeColor} sm:hover:-translate-y-1 sm:hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-white`}
                >
                  <Icon className="w-[18px] h-[18px] sm:w-6 sm:h-6 transition-transform duration-300 sm:group-hover:scale-110 group-active:scale-110" />
                  <span className="font-heading text-[12px] sm:text-sm md:text-base font-bold tracking-widest uppercase mt-[2px]">
                    {item.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </Container>

      {/* Left/Right Navigation Controls */}
      {totalSlides > 1 && (
        <>
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
        </>
      )}

      {/* Bottom Bar: Slide Indicators */}
      {totalSlides > 1 && (
        <div className="absolute bottom-6 sm:bottom-8 inset-x-0 z-30">
          <Container className="flex items-center">
            {/* Progress Indicators */}
            <div
              role="tablist"
              aria-label="Hero slides"
              className="flex items-center gap-2 sm:gap-2.5"
            >
              {images.map((_, index) => {
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
      )}
    </section>
  );
}

export default HeroCarousel;
