"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Users,
  Zap,
  Shield,
  Target,
  Sprout,
  Handshake,
  ShieldCheck,
  Heart,
  Award,
  Network,
  ChevronDown,
  Pause,
  Play,
} from "lucide-react";
import { Container } from "@/components/shared/Container";

interface CoreValueData {
  number: string;
  title: string;
  principle: string;
  description?: string;
  icon: React.ComponentType<{
    className?: string;
    "aria-hidden"?: boolean | "true" | "false";
  }>;
}

const CORE_VALUES_DATA: CoreValueData[] = [
  {
    number: "01",
    title: "People Over Optics",
    principle: "We don’t chase visibility—we prioritize real lives.",
    description:
      "Every decision we make is rooted in what genuinely benefits people, not what simply looks good on paper or social media.",
    icon: Users,
  },
  {
    number: "02",
    title: "Action Over Awareness",
    principle: "Awareness without action is noise.",
    description:
      "We move beyond conversations to create tangible, on-ground impact that can be seen, felt, and measured.",
    icon: Zap,
  },
  {
    number: "03",
    title: "Courage Over Comfort",
    principle: "We speak about what is ignored. We act where it is difficult.",
    description:
      "Whether it’s mental health stigma, educational inequality, or environmental neglect—we choose courage every time.",
    icon: Shield,
  },
  {
    number: "04",
    title: "Impact Over Intent",
    principle: "Good intentions are not enough.",
    description:
      "We hold ourselves accountable to outcomes, ensuring that our efforts translate into meaningful and lasting change.",
    icon: Target,
  },
  {
    number: "05",
    title: "Sustainability Over Quick Wins",
    principle: "We build for the future, not just the moment.",
    description:
      "From planting urban forests to establishing long-term educational structures, we focus on solutions that outlive us.",
    icon: Sprout,
  },
  {
    number: "06",
    title: "Inclusion Over Exclusion",
    principle: "Every voice matters. Every person belongs.",
    description:
      "We actively create spaces where marginalized, overlooked, and vulnerable individuals are welcomed, heard, and empowered.",
    icon: Handshake,
  },
  {
    number: "07",
    title: "Integrity Over Expediency",
    principle: "We do what is right, even when no one is watching.",
    description:
      "Honesty, ethical responsibility, and transparent practices form the bedrock of our relationships and operations.",
    icon: ShieldCheck,
  },
  {
    number: "08",
    title: "Compassion Over Judgment",
    principle: "Empathy leads our work.",
    description:
      "We approach human challenges with kindness and understanding, recognizing the dignity within every individual.",
    icon: Heart,
  },
  {
    number: "09",
    title: "Excellence Over Mediocrity",
    principle: "Community work deserves the highest standards.",
    description:
      "We bring dedication, rigour, and professional excellence to every grassroots project we undertake.",
    icon: Award,
  },
  {
    number: "10",
    title: "Collaboration Over Competition",
    principle: "We grow together.",
    description:
      "We partner with communities, volunteers, and organizations because collective action creates exponential impact.",
    icon: Network,
  },
];

function CoreValueCard({
  item,
  index,
  isVisible,
  reducedMotion,
}: {
  item: CoreValueData;
  index: number;
  isVisible: boolean;
  reducedMotion: boolean;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const IconComponent = item.icon;

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reducedMotion || !cardRef.current) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    cardRef.current.style.setProperty("--cursor-x", `${x}px`);
    cardRef.current.style.setProperty("--cursor-y", `${y}px`);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.removeProperty("--cursor-x");
    cardRef.current.style.removeProperty("--cursor-y");
  };

  const staggerDelay = reducedMotion ? 0 : Math.min(index * 90, 360);

  return (
    <article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transitionDelay: isVisible ? `${staggerDelay}ms` : "0ms",
      }}
      className={`interactive-card group relative h-auto min-h-0 bg-gradient-to-br from-pure-white via-pure-white to-soft-green/30 rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-impact-green/25 shadow-md shadow-impact-green/5 text-left duration-[650ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:border-impact-green/45 ${
        reducedMotion || isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-5 scale-[0.99]"
      }`}
    >
      {/* Soft Radial Cursor Hover Highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(300px circle at var(--cursor-x, 50%) var(--cursor-y, 50%), rgba(22, 163, 74, 0.08), transparent 80%)",
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-3 mb-2.5 sm:mb-3">
          <span className="w-8 h-8 rounded-full bg-impact-green text-pure-white font-heading font-bold text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-sm">
            {item.number}
          </span>
          <div className="w-8 h-8 rounded-full bg-soft-green flex items-center justify-center shrink-0 border border-impact-green/20 group-hover:bg-impact-green/10 transition-colors">
            <IconComponent
              aria-hidden="true"
              className="w-4 h-4 text-impact-green"
            />
          </div>
        </div>

        <h4 className="font-heading text-lg sm:text-xl font-bold text-udbhav-blue-deep group-hover:text-impact-green transition-colors tracking-tight mb-1.5 sm:mb-2">
          {item.title}
        </h4>

        <p className="text-sm sm:text-base font-semibold text-text-primary leading-snug mb-1.5 sm:mb-2">
          {item.principle}
        </p>

        {item.description && (
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            {item.description}
          </p>
        )}
      </div>
    </article>
  );
}

export function OurCoreValuesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);
  const [isDocHidden, setIsDocHidden] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic refs
  const exactScrollTopRef = useRef(0);
  const isUserInteractingRef = useRef(false);
  const isLoopingRef = useRef(false);
  const hasStartedInitialDelayRef = useRef(false);
  const initialDelayPassedRef = useRef(false);

  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loopTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loopReturnTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detect reduced motion & browser visibility
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    queueMicrotask(() => {
      setReducedMotion(mediaQuery.matches);
    });
    mediaQuery.addEventListener("change", handleMotionChange);

    const handleVisibilityChange = () => {
      setIsDocHidden(document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMotionChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Viewport IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
          setIsInViewport(entry.isIntersecting);
        });
      },
      { threshold: 0.35 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Handle manual interaction override
  const handleManualInteraction = useCallback(() => {
    if (reducedMotion) return;

    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current);
    if (loopReturnTimeoutRef.current) clearTimeout(loopReturnTimeoutRef.current);

    isUserInteractingRef.current = true;
    isLoopingRef.current = false;
    setIsPaused(true);

    const el = scrollContainerRef.current;
    if (el) {
      exactScrollTopRef.current = el.scrollTop;
    }

    // Resume autoplay smoothly after 4000ms of inactivity
    resumeTimeoutRef.current = setTimeout(() => {
      isUserInteractingRef.current = false;
      isLoopingRef.current = false;
      setIsPaused(false);
      const container = scrollContainerRef.current;
      if (container) {
        exactScrollTopRef.current = container.scrollTop;
      }
    }, 4000);
  }, [reducedMotion]);

  const handleMobileScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setScrollTop(el.scrollTop);

    if (isUserInteractingRef.current) {
      exactScrollTopRef.current = el.scrollTop;
    }
  };

  // Main vertical requestAnimationFrame auto-scroll engine (0.25 px/frame)
  useEffect(() => {
    if (reducedMotion || isDocHidden || !isInViewport) {
      return;
    }

    // Handle initial 2000ms autoplay start delay
    let initialDelayTimeout: NodeJS.Timeout | null = null;
    if (!initialDelayPassedRef.current && !hasStartedInitialDelayRef.current) {
      hasStartedInitialDelayRef.current = true;
      initialDelayTimeout = setTimeout(() => {
        initialDelayPassedRef.current = true;
      }, 2000);
    }

    let animationFrameId: number;

    const animateScroll = () => {
      const el = scrollContainerRef.current;

      if (
        el &&
        initialDelayPassedRef.current &&
        !isUserInteractingRef.current &&
        !isLoopingRef.current
      ) {
        const isAtBottom =
          el.scrollTop + el.clientHeight >= el.scrollHeight - 3;

        if (isAtBottom) {
          isLoopingRef.current = true;

          // Pause at bottom for 1800ms before returning smoothly to top
          loopTimeoutRef.current = setTimeout(() => {
            el.scrollTo({ top: 0, behavior: "smooth" });
            exactScrollTopRef.current = 0;

            // Wait 800ms after smooth scroll completes to resume automatic scrolling
            loopReturnTimeoutRef.current = setTimeout(() => {
              isLoopingRef.current = false;
            }, 800);
          }, 1800);
        } else {
          // Increment fractional scroll at 0.25 px/frame (~15px/sec at 60fps)
          exactScrollTopRef.current += 0.25;
          el.scrollTop = exactScrollTopRef.current;
        }
      }

      animationFrameId = requestAnimationFrame(animateScroll);
    };

    animationFrameId = requestAnimationFrame(animateScroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (initialDelayTimeout) clearTimeout(initialDelayTimeout);
    };
  }, [isInViewport, isDocHidden, reducedMotion]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
      if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current);
      if (loopReturnTimeoutRef.current) clearTimeout(loopReturnTimeoutRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="core-values-heading"
      className="relative w-full overflow-hidden bg-[#FDFCF8] py-10 sm:py-14 md:py-20 lg:py-24 border-b border-soft-border/40"
    >
      {/* Custom slim green scrollbar for mobile panel */}
      <style jsx>{`
        .custom-mobile-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .custom-mobile-scroll::-webkit-scrollbar-track {
          background: rgba(46, 125, 50, 0.08);
          border-radius: 9999px;
        }
        .custom-mobile-scroll::-webkit-scrollbar-thumb {
          background: rgba(46, 125, 50, 0.45);
          border-radius: 9999px;
        }
        .custom-mobile-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(46, 125, 50, 0.65);
        }
      `}</style>

      <Container className="relative z-10">
        <div
          className={`transition-all duration-700 ${
            reducedMotion || isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          {/* Core Values Section Header */}
          <div className="max-w-3xl mx-auto text-center mb-6 sm:mb-8 md:mb-10">
            <span className="eyebrow-label text-impact-green font-heading text-xs sm:text-sm font-bold tracking-widest uppercase block mb-2">
              WHAT GUIDES US
            </span>
            <h3
              id="core-values-heading"
              className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-udbhav-blue-deep tracking-tight mb-2.5"
            >
              Our Core Values
            </h3>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
              The principles that guide our decisions, actions and commitment to
              meaningful community impact.
            </p>
          </div>

          {/* ==========================================================
              MOBILE LAYOUT (< 768px): Compact Auto-Scrolling Container
              ========================================================== */}
          <div className="block md:hidden w-full">
            <div className="max-w-[400px] mx-auto rounded-2xl bg-pure-white/90 border border-impact-green/25 shadow-md p-2.5 sm:p-3 relative overflow-hidden backdrop-blur-sm">
              {/* Top Fade Mask when scrolled down */}
              {scrollTop > 10 && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-2.5 left-2.5 right-2.5 h-6 bg-gradient-to-b from-pure-white via-pure-white/85 to-transparent z-10 rounded-t-xl transition-opacity duration-300"
                />
              )}

              {/* Internal Scrollable Track (~2 complete cards visible + peek of 3rd) */}
              <div
                ref={scrollContainerRef}
                role="region"
                aria-label="Our Core Values — scroll to explore all 10 values"
                tabIndex={0}
                onScroll={handleMobileScroll}
                onTouchStart={handleManualInteraction}
                onTouchMove={handleManualInteraction}
                onWheel={handleManualInteraction}
                onKeyDown={handleManualInteraction}
                onFocus={handleManualInteraction}
                className="custom-mobile-scroll h-[clamp(380px,54vh,470px)] overflow-y-auto overflow-x-hidden overscroll-contain pr-1 flex flex-col gap-2.5 focus:outline-none focus:ring-1 focus:ring-impact-green/40 rounded-xl"
                style={{
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {CORE_VALUES_DATA.map((item) => {
                  const MobileIconComponent = item.icon;
                  return (
                    <article
                      key={`mobile-${item.number}`}
                      className="flex flex-col w-full h-auto py-3.5 px-4 rounded-xl bg-gradient-to-br from-pure-white via-pure-white to-soft-green/20 border border-impact-green/20 shadow-2xs shrink-0"
                    >
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <span className="w-7 h-7 rounded-full bg-impact-green text-pure-white font-heading font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                          {item.number}
                        </span>
                        <div className="w-7 h-7 rounded-full bg-soft-green flex items-center justify-center shrink-0 border border-impact-green/20">
                          <MobileIconComponent
                            aria-hidden="true"
                            className="w-3.5 h-3.5 text-impact-green"
                          />
                        </div>
                      </div>

                      <h4 className="font-heading text-base sm:text-lg font-bold text-udbhav-blue-deep tracking-tight mb-1">
                        {item.title}
                      </h4>

                      <p className="text-xs sm:text-sm font-semibold text-text-primary leading-snug mb-1">
                        {item.principle}
                      </p>

                      {item.description && (
                        <p className="text-xs text-text-secondary leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </article>
                  );
                })}
              </div>

              {/* Bottom Edge Fade Overlay */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-9 left-2.5 right-2.5 h-11 bg-gradient-to-t from-pure-white via-pure-white/85 to-transparent z-10 rounded-b-xl"
              />

              {/* Bottom Compact Scroll Indicator Hint + Status */}
              <div className="pt-2 px-1 flex items-center justify-between gap-2 border-t border-soft-border/50 bg-pure-white/95 relative z-20">
                <span className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-impact-green">
                  {reducedMotion ? (
                    <span>Swipe or scroll to explore all core values</span>
                  ) : isPaused ? (
                    <>
                      <Pause className="w-3 h-3 text-amber-600 shrink-0" />
                      <span className="text-amber-700 font-semibold">Paused</span>
                      <span className="text-text-secondary">•</span>
                      <span>Swipe to explore all 10 core values</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 text-impact-green shrink-0 fill-impact-green animate-pulse" />
                      <span>Auto-scrolling • Swipe to explore all 10 core values</span>
                    </>
                  )}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-impact-green animate-bounce shrink-0" />
              </div>
            </div>
          </div>

          {/* ==========================================================
              DESKTOP & TABLET LAYOUT (>= 768px): Existing Two-Column Grid
              ========================================================== */}
          <div className="hidden md:grid grid-cols-2 gap-x-5 lg:gap-x-6 gap-y-4 sm:gap-y-5 items-start">
            {CORE_VALUES_DATA.map((item, idx) => (
              <CoreValueCard
                key={item.number}
                item={item}
                index={idx}
                isVisible={isVisible}
                reducedMotion={reducedMotion}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default OurCoreValuesSection;
