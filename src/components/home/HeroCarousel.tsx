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
    <h1 className="font-heading text-[clamp(1.7rem,8vw,2.8rem)] sm:text-[clamp(2rem,6vw,3.5rem)] lg:text-[clamp(2.2rem,5vw,4rem)] font-extrabold text-white mb-6 sm:mb-8 md:mb-10 lg:mb-12 px-2 h-[40px] sm:h-[48px] md:h-[60px] lg:h-[72px] flex items-center justify-center drop-shadow-md">
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
    <div className={`flex flex-col items-center justify-center transition-all duration-500 w-full px-1 ${isFinished ? 'opacity-100' : 'opacity-90'}`}>
      <div className="font-heading text-[16px] min-[360px]:text-[18px] sm:text-[21px] md:text-[24px] lg:text-[30px] font-bold text-white leading-none tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">
        {value}{suffix}
      </div>
      <div className="mt-0.5 sm:mt-1 text-[7px] min-[360px]:text-[8px] sm:text-[10px] md:text-[11px] lg:text-[12px] font-medium sm:font-semibold text-white/90 uppercase text-center leading-[1.1] tracking-[0.04em] lg:tracking-[0.08em] drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)] max-w-[85px] sm:max-w-none">
        {label}
      </div>
    </div>
  );
}

// Color palette for the buttons
const BASE_COLORS = [
  "79, 174, 47",   // Green
  "49, 85, 200",   // Blue
  "21, 155, 181",  // Cyan
  "118, 84, 198",  // Purple
  "232, 137, 50",  // Orange
  "214, 92, 114"   // Rose
];

const BUTTONS_INFO = [
  { title: "EXPLORE OUR WORK", href: "/about", delay: "0.1s" },
  { title: "JOIN AS A VOLUNTEER", href: "/volunteers", delay: "0.15s" },
  { title: "UPCOMING EVENTS", href: "/events", delay: "0.2s" },
  { title: "PODCAST", href: "/podcast", delay: "0.25s" },
  { title: "GALLERY", href: "/gallery", delay: "0.3s" },
  { title: "CONTRIBUTE", href: "/donate", delay: "0.35s" }
];

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function DynamicGlassButton({ title, href, colorRgb, delay, prefersReducedMotion }: { title: string, href: string, colorRgb: string, delay: string, prefersReducedMotion: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const transitionStr = prefersReducedMotion
    ? 'none'
    : 'background-color 700ms ease, border-color 700ms ease, box-shadow 700ms ease, transform 300ms ease';

  // Increased opacities for stronger, visible colored glass
  const bgAlpha = isActive ? 0.60 : isHovered ? 0.50 : 0.40;
  const borderAlpha = isActive ? 0.80 : isHovered ? 0.70 : 0.45;
  const glowAlpha = isActive ? 0.40 : isHovered ? 0.30 : 0.18;

  return (
    <Link
      href={href}
      style={{
        animationDelay: delay,
        backgroundColor: `rgba(${colorRgb}, ${bgAlpha})`,
        backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 100%)`,
        borderColor: `rgba(${colorRgb}, ${borderAlpha})`,
        boxShadow: isHovered || isActive
          ? `0 12px 30px rgba(${colorRgb}, ${glowAlpha + 0.1}), inset 0 1px 0 rgba(255,255,255,0.25)`
          : `0 8px 24px rgba(${colorRgb}, ${glowAlpha}), inset 0 1px 0 rgba(255,255,255,0.15)`,
        transform: prefersReducedMotion ? 'none' : isActive ? 'scale(0.98)' : isHovered ? 'translateY(-2px) scale(1.015)' : 'none',
        transition: transitionStr
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsActive(false); }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onTouchStart={() => setIsActive(true)}
      onTouchEnd={() => setIsActive(false)}
      className="animate-glass-btn group flex items-center justify-center w-full h-[38px] sm:h-[48px] md:h-[54px] lg:h-[60px] rounded-[10px] sm:rounded-xl md:rounded-2xl backdrop-blur-md border text-white focus-visible:outline-2 focus-visible:outline-white select-none"
    >
      <span className="font-heading text-[9px] sm:text-[11px] md:text-[12px] lg:text-[13px] font-bold tracking-widest uppercase text-center px-1 sm:px-2 leading-tight">
        {title}
      </span>
    </Link>
  );
}

function DynamicNavGrid({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  const [colorAssignment, setColorAssignment] = useState<string[]>(BASE_COLORS);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Initial random shuffle on load so it differs per refresh
    setColorAssignment(shuffle([...BASE_COLORS]));
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || !isMounted) return;

    const interval = setInterval(() => {
      setColorAssignment(prev => {
        const nextColors = shuffle([...BASE_COLORS]);
        // Ensure not completely identical arrangement (swap two if necessary)
        if (nextColors.every((c, i) => c === prev[i])) {
          [nextColors[0], nextColors[1]] = [nextColors[1], nextColors[0]];
        }
        return nextColors;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [prefersReducedMotion, isMounted]);

  return (
    <div className="w-full max-w-3xl mx-auto grid grid-cols-3 gap-1.5 sm:gap-3 md:gap-4 px-2 sm:px-0">
      {BUTTONS_INFO.map((item, idx) => (
        <DynamicGlassButton
          key={item.title}
          title={item.title}
          href={item.href}
          delay={item.delay}
          colorRgb={colorAssignment[idx]}
          prefersReducedMotion={prefersReducedMotion}
        />
      ))}
    </div>
  );
}

export function HeroCarousel({ heroImages, autoPlayInterval = 6000 }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTabHidden, setIsTabHidden] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

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

    const measureHeader = () => {
      const headerEl = document.querySelector('header');
      if (headerEl) {
        setHeaderHeight(headerEl.offsetHeight);
      }
    };

    measureHeader();

    mediaQuery.addEventListener("change", handleMotionChange);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("resize", measureHeader);

    return () => {
      mediaQuery.removeEventListener("change", handleMotionChange);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("resize", measureHeader);
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
    <section
      className="relative w-full h-[100vh] bg-[#0A1628] overflow-hidden flex flex-col box-border"
      style={{
        height: headerHeight > 0 ? `calc(100svh - ${headerHeight}px)` : '100svh',
        minHeight: '0'
      }}
    >
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
                className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0A1628]/95 via-[#0A1628]/45 to-transparent"
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

      {/* Main Content (Vertically centered in available space) */}
      <div className="flex-1 flex flex-col justify-center w-full relative z-20">
        <Container className="flex flex-col items-center justify-center py-4 sm:py-6 lg:py-10">
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

          <div className="flex flex-col items-center justify-center text-center w-full">
            {/* Animated Title */}
            {isMounted ? <TypewriterTitle prefersReducedMotion={prefersReducedMotion} /> : (
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 sm:mb-12 md:mb-16 px-2 h-[48px] sm:h-[60px] md:h-[72px] lg:h-[84px] flex items-center justify-center drop-shadow-md">
                UDBHAV FOUNDATION
              </h1>
            )}

            {/* Dynamic Colored Glass Navigation Grid */}
            <DynamicNavGrid prefersReducedMotion={prefersReducedMotion} />
          </div>
        </Container>
      </div>

      {/* Minimal Plain Text Statistics Strip at the Absolute Bottom */}
      <div
        className="animate-glass-btn relative z-20 w-full px-3 sm:px-[5%] lg:px-[8%] pt-2.5 pb-3"
        style={{ animationDelay: "0.5s" }}
      >
        <div className="w-full grid grid-cols-4 divide-x divide-white/20">
          {isMounted ? (
            <>
              <AnimatedStatistic target={50} label="Communities Reached" prefersReducedMotion={prefersReducedMotion} />
              <AnimatedStatistic target={1000} label="Lives Impacted" prefersReducedMotion={prefersReducedMotion} />
              <AnimatedStatistic target={100} label="Volunteers" prefersReducedMotion={prefersReducedMotion} />
              <AnimatedStatistic target={25} label="Initiatives" prefersReducedMotion={prefersReducedMotion} />
            </>
          ) : (
            <>
              <div className="flex flex-col items-center justify-center w-full px-1 opacity-100">
                <div className="font-heading text-[16px] min-[360px]:text-[18px] sm:text-[21px] md:text-[24px] lg:text-[30px] font-bold text-white leading-none tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">50+</div>
                <div className="mt-0.5 sm:mt-1 text-[7px] min-[360px]:text-[8px] sm:text-[10px] md:text-[11px] lg:text-[12px] font-medium sm:font-semibold text-white/90 uppercase text-center leading-[1.1] tracking-[0.04em] lg:tracking-[0.08em] drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)] max-w-[85px] sm:max-w-none">Communities Reached</div>
              </div>
              <div className="flex flex-col items-center justify-center w-full px-1 opacity-100">
                <div className="font-heading text-[16px] min-[360px]:text-[18px] sm:text-[21px] md:text-[24px] lg:text-[30px] font-bold text-white leading-none tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">1000+</div>
                <div className="mt-0.5 sm:mt-1 text-[7px] min-[360px]:text-[8px] sm:text-[10px] md:text-[11px] lg:text-[12px] font-medium sm:font-semibold text-white/90 uppercase text-center leading-[1.1] tracking-[0.04em] lg:tracking-[0.08em] drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)] max-w-[85px] sm:max-w-none">Lives Impacted</div>
              </div>
              <div className="flex flex-col items-center justify-center w-full px-1 opacity-100">
                <div className="font-heading text-[16px] min-[360px]:text-[18px] sm:text-[21px] md:text-[24px] lg:text-[30px] font-bold text-white leading-none tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">100+</div>
                <div className="mt-0.5 sm:mt-1 text-[7px] min-[360px]:text-[8px] sm:text-[10px] md:text-[11px] lg:text-[12px] font-medium sm:font-semibold text-white/90 uppercase text-center leading-[1.1] tracking-[0.04em] lg:tracking-[0.08em] drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)] max-w-[85px] sm:max-w-none">Volunteers</div>
              </div>
              <div className="flex flex-col items-center justify-center w-full px-1 opacity-100">
                <div className="font-heading text-[16px] min-[360px]:text-[18px] sm:text-[21px] md:text-[24px] lg:text-[30px] font-bold text-white leading-none tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">25+</div>
                <div className="mt-0.5 sm:mt-1 text-[7px] min-[360px]:text-[8px] sm:text-[10px] md:text-[11px] lg:text-[12px] font-medium sm:font-semibold text-white/90 uppercase text-center leading-[1.1] tracking-[0.04em] lg:tracking-[0.08em] drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)] max-w-[85px] sm:max-w-none">Initiatives</div>
              </div>
            </>
          )}
        </div>
      </div>

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
