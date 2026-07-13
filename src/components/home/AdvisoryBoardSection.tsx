"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { User, ChevronDown, Pause, Play } from "lucide-react";
import { RevealCard } from "@/components/shared/RevealCard";

export interface AdvisoryBoardMember {
  id: number;
  name: string;
  designation: string;
  image?: string;
}

export const ADVISORY_BOARD_MEMBERS: AdvisoryBoardMember[] = [
  {
    id: 1,
    name: "Mr. Prabhas Singh",
    designation: "Former MP, Bargarh",
  },
  {
    id: 2,
    name: "Mr. Dasarathi Satpathy",
    designation: "Former Secretary, Odisha Legislative Assembly",
  },
  {
    id: 3,
    name: "Ms. Subhra Subhadarshi",
    designation: "Head – Corporate Affairs, Sparc Pvt. Ltd.",
  },
  {
    id: 4,
    name: "Mr. Deepak Nath",
    designation: "Managing Director, Threatsys Technology Pvt. Ltd.",
  },
  {
    id: 5,
    name: "Mr. Sushant Mohanty",
    designation: "Managing Director, Shri Hari Enterprises",
  },
  {
    id: 6,
    name: "Ms. Jagruti Rath",
    designation: "Eminent Actress",
  },
  {
    id: 7,
    name: "Mr. Subhojit Panda",
    designation: "TV Anchor & Emcee",
  },
  {
    id: 8,
    name: "Mr. Amitesh Gugnani",
    designation:
      "Founder – Mango Hotel by Prangan; Co-founder – Rahat Hospital",
  },
  {
    id: 9,
    name: "Mr. Ratul Manek",
    designation: "Chief Financial Officer, Jyoti Construction",
  },
  {
    id: 10,
    name: "Ms. Chidatmika Khatua",
    designation:
      "Social Activist; Founder & CEO, Sushruta Hospital and Trauma Care; Managing Director, Odisha Cosmetic Surgery Clinic",
  },
  {
    id: 11,
    name: "Mr. Raju Das",
    designation: "Renowned Actor",
  },
  {
    id: 12,
    name: "Ms. Nandini Sahoo",
    designation: "Managing Director, IBL Beauty Academy",
  },
  {
    id: 13,
    name: "Mr. Subham Mohanty",
    designation: "Managing Director, Radha Govind Homes",
  },
  {
    id: 14,
    name: "Mr. Mihir Das",
    designation: "Managing Director, Suravi Milk",
  },
  {
    id: 15,
    name: "Mr. Arijit Pariksha",
    designation: "Founder – Utkal Pratidin; MD – Heronex Media Ltd.",
  },
  {
    id: 16,
    name: "Mr. Biswajeet Panigrahi",
    designation: "Director, Odisha IAS Academy",
  },
  {
    id: 17,
    name: "Mr. Kamala Kanta Rath",
    designation: "President, Para Sports Association, Odisha",
  },
];

export function AdvisoryBoardSection() {
  const [scrollTop, setScrollTop] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
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
      setIsReducedMotion(e.matches);
    };
    queueMicrotask(() => {
      setIsReducedMotion(mediaQuery.matches);
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
          setIsInViewport(entry.isIntersecting);
        });
      },
      { threshold: 0.35 }
    );

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Handle manual interaction override
  const handleManualInteraction = useCallback(() => {
    if (isReducedMotion) return;

    // Clear any existing timeouts
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
  }, [isReducedMotion]);

  // Handle internal scroll events
  const handleMobileScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setScrollTop(el.scrollTop);

    // If user is manually scrolling, keep float ref synchronized
    if (isUserInteractingRef.current) {
      exactScrollTopRef.current = el.scrollTop;
    }
  };

  // Main vertical requestAnimationFrame auto-scroll engine (0.40 px/frame)
  useEffect(() => {
    if (isReducedMotion || isDocHidden || !isInViewport) {
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
        // Check if we hit the bottom boundary
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
          // Increment fractional scroll at 0.40 px/frame (~24px/sec at 60fps)
          exactScrollTopRef.current += 0.4;
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
  }, [isInViewport, isDocHidden, isReducedMotion]);

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
      aria-labelledby="advisory-board-heading"
      className="relative w-full overflow-hidden bg-gradient-to-b from-warm-white via-pure-white to-soft-green/15 py-10 sm:py-14 md:py-20 border-t border-soft-border/40"
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

      {/* Subtle Pale-Green Decorative Background Glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-impact-green/5 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <RevealCard
          as="div"
          index={0}
          className="max-w-3xl mx-auto text-center mb-6 sm:mb-8 md:mb-12"
        >
          <h2
            id="advisory-board-heading"
            className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-udbhav-blue-deep tracking-tight mb-2.5 sm:mb-3"
          >
            ADVISORY BOARD
          </h2>
          <div
            aria-hidden="true"
            className="mx-auto h-1 w-14 rounded-full bg-impact-green mb-3 sm:mb-3.5"
          />
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-2xl mx-auto">
            “Guiding UDBHAV Foundation with experience, knowledge and shared
            purpose.”
          </p>
        </RevealCard>

        {/* ==========================================================
            MOBILE LAYOUT (< 768px): Compact Auto-Scrolling Container
            ========================================================== */}
        <RevealCard as="div" index={1} className="block md:hidden w-full">
          <div className="max-w-[400px] mx-auto rounded-2xl bg-pure-white/90 border border-impact-green/25 shadow-md p-2.5 sm:p-3 relative overflow-hidden backdrop-blur-sm">
            {/* Top Fade Mask when scrolled down */}
            {scrollTop > 10 && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-2.5 left-2.5 right-2.5 h-6 bg-gradient-to-b from-pure-white via-pure-white/80 to-transparent z-10 rounded-t-xl transition-opacity duration-300"
              />
            )}

            {/* Internal Scrollable Track (~4 cards visible + peek of next) */}
            <div
              ref={scrollContainerRef}
              role="region"
              aria-label="Advisory Board members — scroll to view all 17 members"
              tabIndex={0}
              onScroll={handleMobileScroll}
              onTouchStart={handleManualInteraction}
              onTouchMove={handleManualInteraction}
              onWheel={handleManualInteraction}
              onKeyDown={handleManualInteraction}
              onFocus={handleManualInteraction}
              className="custom-mobile-scroll h-[clamp(320px,46vh,380px)] overflow-y-auto overscroll-contain pr-1 flex flex-col gap-2 focus:outline-none focus:ring-1 focus:ring-impact-green/40 rounded-xl"
              style={{
                WebkitOverflowScrolling: "touch",
              }}
            >
              {ADVISORY_BOARD_MEMBERS.map((member) => (
                <article
                  key={`mobile-${member.id}`}
                  className="flex items-center gap-2.5 w-full min-h-[54px] py-2 px-2.5 rounded-xl bg-warm-white/80 border border-impact-green/15 shadow-2xs active:scale-[0.985] transition-transform duration-150 shrink-0"
                >
                  {/* Compact Profile Circle (~36px) */}
                  <div className="relative w-9 h-9 rounded-full border border-impact-green/35 bg-gradient-to-br from-soft-green via-warm-white to-soft-green/60 flex items-center justify-center shrink-0 overflow-hidden">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={`Portrait of ${member.name}`}
                        fill
                        sizes="36px"
                        className="rounded-full object-cover object-center"
                      />
                    ) : (
                      <User
                        className="w-4.5 h-4.5 text-udbhav-blue-deep/75 stroke-[1.75]"
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  {/* Member Name and Designation */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-[13.5px] font-bold text-udbhav-blue-deep leading-tight truncate">
                      {member.name}
                    </h3>
                    <p className="text-[11px] text-text-secondary font-medium leading-snug mt-0.5 line-clamp-2">
                      {member.designation}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            {/* Bottom Edge Fade Overlay */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-9 left-2.5 right-2.5 h-10 bg-gradient-to-t from-pure-white via-pure-white/85 to-transparent z-10 rounded-b-xl"
            />

            {/* Bottom Compact Scroll Indicator Hint + Status */}
            <div className="pt-2 px-1 flex items-center justify-between gap-2 border-t border-soft-border/50 bg-pure-white/95 relative z-20">
              <span className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-impact-green">
                {isReducedMotion ? (
                  <span>Swipe or scroll to explore all advisors</span>
                ) : isPaused ? (
                  <>
                    <Pause className="w-3 h-3 text-amber-600 shrink-0" />
                    <span className="text-amber-700 font-semibold">Paused</span>
                    <span className="text-text-secondary">•</span>
                    <span>Swipe to explore all 17 advisors</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 text-impact-green shrink-0 fill-impact-green animate-pulse" />
                    <span>Auto-scrolling • Swipe to explore all 17 advisors</span>
                  </>
                )}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-impact-green animate-bounce shrink-0" />
            </div>
          </div>
        </RevealCard>

        {/* ==========================================================
            DESKTOP & TABLET LAYOUT (>= 768px): Existing Full Grid
            ========================================================== */}
        <div className="hidden md:grid grid-cols-2 gap-3 lg:gap-3.5">
          {ADVISORY_BOARD_MEMBERS.map((member, idx) => {
            const isLastOddItem =
              idx === ADVISORY_BOARD_MEMBERS.length - 1 &&
              ADVISORY_BOARD_MEMBERS.length % 2 !== 0;

            return (
              <div
                key={`desktop-${member.id}`}
                className={
                  isLastOddItem
                    ? "col-span-2 flex justify-center"
                    : undefined
                }
              >
                <RevealCard
                  as="article"
                  index={idx + 1}
                  maxStagger={800}
                  className={`group relative flex items-center gap-3.5 w-full ${
                    isLastOddItem ? "w-[calc(50%-0.375rem)]" : ""
                  } min-h-[60px] py-3 px-4 rounded-xl bg-pure-white border border-impact-green/20 shadow-2xs hover:shadow-md hover:-translate-y-0.5 hover:border-impact-green/50 active:scale-[0.985] transition-all duration-300 ease-out`}
                >
                  {/* Circular Profile Image (~40px) */}
                  <div className="relative w-10 h-10 rounded-full border border-impact-green/40 bg-gradient-to-br from-soft-green via-warm-white to-soft-green/60 shadow-2xs flex items-center justify-center shrink-0 overflow-hidden group-hover:border-impact-green/70 transition-colors">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={`Portrait of ${member.name}`}
                        fill
                        sizes="40px"
                        className="rounded-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div
                        role="img"
                        aria-label={`Profile placeholder for ${member.name}`}
                        className="w-full h-full flex items-center justify-center text-udbhav-blue-deep/70"
                      >
                        <User
                          className="w-5 h-5 stroke-[1.75]"
                          aria-hidden="true"
                        />
                      </div>
                    )}
                  </div>

                  {/* Member Name and Designation */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 className="font-heading text-[14.5px] font-bold text-udbhav-blue-deep leading-tight">
                      {member.name}
                    </h3>
                    <p className="text-[12.5px] text-text-secondary font-medium leading-snug mt-0.5 wrap-balance">
                      {member.designation}
                    </p>
                  </div>
                </RevealCard>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default AdvisoryBoardSection;
