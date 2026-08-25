"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
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
      return "scale(1.02) translate3d(0, 0, 0)";
    case 2:
      return "scale(1.065) translate3d(1.2%, 0, 0)";
    case 3:
    default:
      return "scale(1.02) translate3d(0, 0.8%, 0)";
  }
}

function TypewriterTitle({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  const targetText = "UDBHAV FOUNDATION";
  const [typedText, setTypedText] = useState("");
  const [isCursorVisible, setIsCursorVisible] = useState(true);

  useEffect(() => {
    if (prefersReducedMotion) {
      setTypedText(targetText);
      setIsCursorVisible(false);
      return;
    }

    let isCancelled = false;

    // blinking cursor
    const cursorInterval = setInterval(() => {
      setIsCursorVisible(v => !v);
    }, 500);

    const typeLoop = async () => {
      while (!isCancelled) {
        // Pause before starting
        await new Promise(r => setTimeout(r, 500));
        if (isCancelled) return;

        // Type forward
        for (let i = 0; i <= targetText.length; i++) {
          if (isCancelled) return;
          setTypedText(targetText.substring(0, i));
          await new Promise(r => setTimeout(r, 80 + Math.random() * 40));
        }

        // Pause at the end
        if (isCancelled) return;
        await new Promise(r => setTimeout(r, 1500 + Math.random() * 500));

        // Erase
        for (let i = targetText.length; i >= 0; i--) {
          if (isCancelled) return;
          setTypedText(targetText.substring(0, i));
          await new Promise(r => setTimeout(r, 40 + Math.random() * 30));
        }
      }
    };

    typeLoop();

    return () => {
      isCancelled = true;
      clearInterval(cursorInterval);
    };
  }, [prefersReducedMotion]);

  return (
    <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 sm:mb-12 md:mb-16 px-2 h-[48px] sm:h-[60px] md:h-[72px] lg:h-[84px] flex items-center justify-center">
      <span>{typedText}</span>
      <span
        className="inline-block w-[3px] sm:w-[4px] md:w-[5px] h-[36px] sm:h-[46px] md:h-[56px] lg:h-[66px] bg-white ml-1 sm:ml-2"
        style={{ opacity: isCursorVisible ? 1 : 0, transition: 'opacity 0.1s' }}
        aria-hidden="true"
      />
      {/* Screen reader only text so it announces properly */}
      <span className="sr-only">{targetText}</span>
    </h1>
  );
}

function AnimatedStatistic({ target, label, suffix = "+", prefersReducedMotion }: { target: number, label: string, suffix?: string, prefersReducedMotion: boolean }) {
  const [value, setValue] = useState(prefersReducedMotion ? target : 0);
  const [isFinished, setIsFinished] = useState(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) {
      setValue(target);
      setIsFinished(true);
      return;
    }

    let animationFrame: number;
    let startTime: number;
    const DURATION = 2000;
    const PAUSE = 2000;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      if (elapsed < DURATION) {
        const progress = elapsed / DURATION;
        // Ease out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setValue(Math.floor(easeOut * target));
        setIsFinished(false);
        animationFrame = requestAnimationFrame(animate);
      } else if (elapsed < DURATION + PAUSE) {
        setValue(target);
        setIsFinished(true);
        animationFrame = requestAnimationFrame(animate);
      } else {
        // Loop back
        startTime = timestamp;
        setValue(0);
        setIsFinished(false);
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [target, prefersReducedMotion]);

  return (
    <div className={`flex flex-col items-center justify-center transition-all duration-500 w-full ${isFinished ? 'opacity-100 -translate-y-0.5' : 'opacity-90 translate-y-0'}`}>
      <div className={`font-heading text-[18px] sm:text-2xl md:text-3xl font-extrabold text-white leading-none transition-all duration-500 ${isFinished ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]' : 'drop-shadow-none'}`}>
        {value}{suffix}
      </div>
      <div className="mt-1 sm:mt-1.5 text-[9px] sm:text-[10px] md:text-[12px] font-medium text-white/80 uppercase tracking-widest text-center max-w-[70px] sm:max-w-none leading-tight sm:leading-normal">
        {label}
      </div>
    </div>
  );
}

export function HeroCarousel({ heroImages, autoPlayInterval = 6000 }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTabHidden, setIsTabHidden] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setPrefersReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const images = heroImages && heroImages.length > 0
    ? heroImages.map(img => img.image_url)
    : [HERO_SLIDES[0].image];
  const totalSlides = images.length;

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

  useEffect(() => {
    if (isTabHidden || prefersReducedMotion || totalSlides <= 1) return;
    const timer = setInterval(goToNextSlide, autoPlayInterval);
    return () => clearInterval(timer);
  }, [activeIndex, autoPlayInterval, isTabHidden, prefersReducedMotion, goToNextSlide, totalSlides]);

  return (
    <section className="relative w-full h-[100dvh] min-h-[600px] bg-[#0A1628] overflow-hidden flex flex-col justify-center">
      {/* Background Images Carousel */}
      <div className="absolute inset-0 z-0">
        {images.map((imgSrc, index) => {
          const isActive = index === activeIndex;
          const cinematicStyle = getCinematicTransform(index, isActive, prefersReducedMotion);

          return (
            <div
              key={`${imgSrc}-${index}`}
              className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out"
              style={{
                opacity: isActive ? 1 : 0,
                zIndex: isActive ? 1 : 0
              }}
              aria-hidden={!isActive}
            >
              <Image
                src={imgSrc}
                alt=""
                fill
                priority={index === 0}
                className="object-cover transition-transform duration-[8000ms] ease-out will-change-transform"
                style={{ transform: cinematicStyle }}
              />

              {/* Dynamic Overlay adjusted for legibility */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[#0A1628]/60 transition-opacity duration-1000"
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

      {/* Main Content */}
      <Container className="relative z-20 py-8 sm:py-12 lg:py-20 my-auto flex flex-col">
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes heroGlassEntrance {
            0% {
              opacity: 0;
              transform: translateY(12px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-glass-btn {
            opacity: 0;
            animation: heroGlassEntrance 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-glass-btn {
              animation: none !important;
              opacity: 1 !important;
              transform: none !important;
            }
          }
        `}} />

        <div className="flex flex-col items-center justify-center text-center w-full mt-auto mb-auto">
          {/* Animated Title */}
          {isMounted ? <TypewriterTitle prefersReducedMotion={prefersReducedMotion} /> : (
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 sm:mb-12 md:mb-16 px-2 h-[48px] sm:h-[60px] md:h-[72px] lg:h-[84px] flex items-center justify-center">
              UDBHAV FOUNDATION
            </h1>
          )}

          {/* Glass Navigation Grid */}
          <div className="w-full max-w-3xl mx-auto grid grid-cols-3 gap-1.5 sm:gap-3 md:gap-4 px-2 sm:px-0 mb-8 sm:mb-14">
            {[
              {
                title: "EXPLORE OUR WORK",
                href: "/about",
                activeColor: "hover:bg-emerald-500/25 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(52,211,153,0.35)] active:bg-emerald-500/30 active:border-emerald-400 active:shadow-[0_0_20px_rgba(52,211,153,0.4)]",
                delay: "0.1s",
              },
              {
                title: "JOIN AS A VOLUNTEER",
                href: "/volunteers",
                activeColor: "hover:bg-cyan-500/25 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.35)] active:bg-cyan-500/30 active:border-cyan-400 active:shadow-[0_0_20px_rgba(34,211,238,0.4)]",
                delay: "0.15s",
              },
              {
                title: "UPCOMING EVENTS",
                href: "/events",
                activeColor: "hover:bg-amber-500/25 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(251,191,36,0.35)] active:bg-amber-500/30 active:border-amber-400 active:shadow-[0_0_20px_rgba(251,191,36,0.4)]",
                delay: "0.2s",
              },
              {
                title: "PODCAST",
                href: "/podcast",
                activeColor: "hover:bg-violet-500/25 hover:border-violet-400 hover:shadow-[0_0_20px_rgba(139,92,246,0.35)] active:bg-violet-500/30 active:border-violet-400 active:shadow-[0_0_20px_rgba(139,92,246,0.4)]",
                delay: "0.25s",
              },
              {
                title: "GALLERY",
                href: "/gallery",
                activeColor: "hover:bg-pink-500/25 hover:border-pink-400 hover:shadow-[0_0_20px_rgba(236,72,153,0.35)] active:bg-pink-500/30 active:border-pink-400 active:shadow-[0_0_20px_rgba(236,72,153,0.4)]",
                delay: "0.3s",
              },
              {
                title: "CONTRIBUTE",
                href: "/donate",
                activeColor: "hover:bg-orange-500/25 hover:border-orange-400 hover:shadow-[0_0_20px_rgba(249,115,22,0.35)] active:bg-orange-500/30 active:border-orange-400 active:shadow-[0_0_20px_rgba(249,115,22,0.4)]",
                delay: "0.35s",
              },
            ].map((item) => {
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  style={{ animationDelay: item.delay }}
                  className={`animate-glass-btn group flex items-center justify-center w-full h-[48px] sm:h-[56px] md:h-[62px] rounded-[10px] sm:rounded-xl md:rounded-2xl bg-white/5 backdrop-blur-md border border-white/20 text-white shadow-sm transition-all duration-300 ${item.activeColor} sm:hover:-translate-y-1 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-white`}
                >
                  <span className="font-heading text-[9px] sm:text-[11px] md:text-[13px] lg:text-[14px] font-bold tracking-widest uppercase text-center px-1 sm:px-2 leading-tight">
                    {item.title}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Unified Glass Statistics Strip */}
          <div
            className="animate-glass-btn w-full max-w-[1000px] mx-auto grid grid-cols-4 divide-x divide-white/10 bg-white/5 backdrop-blur-md border border-white/20 rounded-[12px] sm:rounded-2xl shadow-sm py-3 sm:py-5 px-1 sm:px-2"
            style={{ animationDelay: "0.5s" }}
          >
            {isMounted ? (
              <>
                <AnimatedStatistic target={50} label="Communities Reached" prefersReducedMotion={prefersReducedMotion} />
                <AnimatedStatistic target={1000} label="Lives Impacted" prefersReducedMotion={prefersReducedMotion} />
                <AnimatedStatistic target={100} label="Volunteers" prefersReducedMotion={prefersReducedMotion} />
                <AnimatedStatistic target={25} label="Initiatives" prefersReducedMotion={prefersReducedMotion} />
              </>
            ) : (
              <>
                <div className="flex flex-col items-center justify-center w-full opacity-100">
                  <div className="font-heading text-[18px] sm:text-2xl md:text-3xl font-extrabold text-white leading-none">50+</div>
                  <div className="mt-1 sm:mt-1.5 text-[9px] sm:text-[10px] md:text-[12px] font-medium text-white/80 uppercase tracking-widest text-center max-w-[70px] sm:max-w-none leading-tight sm:leading-normal">Communities Reached</div>
                </div>
                <div className="flex flex-col items-center justify-center w-full opacity-100">
                  <div className="font-heading text-[18px] sm:text-2xl md:text-3xl font-extrabold text-white leading-none">1000+</div>
                  <div className="mt-1 sm:mt-1.5 text-[9px] sm:text-[10px] md:text-[12px] font-medium text-white/80 uppercase tracking-widest text-center max-w-[70px] sm:max-w-none leading-tight sm:leading-normal">Lives Impacted</div>
                </div>
                <div className="flex flex-col items-center justify-center w-full opacity-100">
                  <div className="font-heading text-[18px] sm:text-2xl md:text-3xl font-extrabold text-white leading-none">100+</div>
                  <div className="mt-1 sm:mt-1.5 text-[9px] sm:text-[10px] md:text-[12px] font-medium text-white/80 uppercase tracking-widest text-center max-w-[70px] sm:max-w-none leading-tight sm:leading-normal">Volunteers</div>
                </div>
                <div className="flex flex-col items-center justify-center w-full opacity-100">
                  <div className="font-heading text-[18px] sm:text-2xl md:text-3xl font-extrabold text-white leading-none">25+</div>
                  <div className="mt-1 sm:mt-1.5 text-[9px] sm:text-[10px] md:text-[12px] font-medium text-white/80 uppercase tracking-widest text-center max-w-[70px] sm:max-w-none leading-tight sm:leading-normal">Initiatives</div>
                </div>
              </>
            )}
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
