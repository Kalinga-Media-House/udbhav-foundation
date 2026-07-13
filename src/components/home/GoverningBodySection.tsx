"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { User } from "lucide-react";

export interface GoverningBodyMember {
  name: string;
  designation: string;
  image?: string;
}

export const GOVERNING_BODY_MEMBERS: GoverningBodyMember[] = [
  {
    name: "JAYSURAJ PATTANAYAK",
    designation: "Visionary Founder",
  },
  {
    name: "SUJIT MOHARANA",
    designation: "Co-Founder",
  },
  {
    name: "ARCHITA JENA",
    designation: "Project Coordinator",
  },
  {
    name: "SANJAY PATTANAYAK",
    designation: "Executive Director cum CSR & Collaboration Lead",
  },
  {
    name: "JANAKI ROUT",
    designation: "Volunteer Coordinator",
  },
  {
    name: "PRASANJIT HOTA",
    designation: "Operation Lead",
  },
  {
    name: "SANJIB MANDAL",
    designation: "Creative Lead",
  },
  {
    name: "RAJASHREE KAR",
    designation:
      "Research and Innovation & Communication and Media Lead",
  },
  {
    name: "SUJATA BEHERA",
    designation: "Field Coordinator",
  },
  {
    name: "LIPU BEHERA",
    designation: "Event Coordinator & Monitoring and Evaluation Lead",
  },
  {
    name: "SAKTI SWAGAT PATTANAYAK",
    designation: "Finance & Compliance Lead",
  },
];

export function GoverningBodySection() {
  const [isVisible, setIsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Refs for time-based animation and interaction state
  const singleSetWidthRef = useRef<number>(0);
  const exactScrollLeftRef = useRef<number>(0);
  const isPausedRef = useRef<boolean>(false);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartScrollLeftRef = useRef<number>(0);

  // Measure the width of exactly 1 original member set (11 cards)
  const measureSetWidth = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const children = track.children;
    if (children.length >= 22) {
      const firstChild = children[0] as HTMLElement;
      const eleventhChild = children[11] as HTMLElement;
      const setWidth = eleventhChild.offsetLeft - firstChild.offsetLeft;
      if (setWidth > 0) {
        singleSetWidthRef.current = setWidth;
        // Initialize scrollLeft at the start of Set 2 so both left and right infinite scroll work
        if (exactScrollLeftRef.current === 0 && containerRef.current) {
          containerRef.current.scrollLeft = setWidth;
          exactScrollLeftRef.current = setWidth;
        }
      }
    }
  }, []);

  // Listen for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);

    queueMicrotask(() => {
      setReducedMotion(mediaQuery.matches);
    });

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Listen for document visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isPausedRef.current = true;
      } else {
        lastTimestampRef.current = null; // Reset timestamp so delta time does not jump
        isPausedRef.current = false;
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Intersection observer to trigger entrance animation
  useEffect(() => {
    if (reducedMotion) {
      queueMicrotask(() => {
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
  }, [reducedMotion]);

  useEffect(() => {
    measureSetWidth();
    window.addEventListener("resize", measureSetWidth);
    return () => window.removeEventListener("resize", measureSetWidth);
  }, [measureSetWidth, isVisible]);

  // Seamless infinite loop normalization across Set 1, Set 2, Set 3
  const normalizeInfiniteScroll = useCallback(() => {
    const container = containerRef.current;
    const setWidth = singleSetWidthRef.current;
    if (!container || setWidth <= 0) return;

    if (container.scrollLeft >= setWidth * 2) {
      container.scrollLeft -= setWidth;
      exactScrollLeftRef.current -= setWidth;
    } else if (container.scrollLeft <= setWidth * 0.1) {
      container.scrollLeft += setWidth;
      exactScrollLeftRef.current += setWidth;
    }
  }, []);

  // Pause autoplay temporarily on manual interaction and auto-resume after 3 seconds
  const pauseAutoplayTemporarily = useCallback(() => {
    isPausedRef.current = true;
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    resumeTimeoutRef.current = setTimeout(() => {
      // Resume from current scroll position
      const container = containerRef.current;
      if (container) {
        exactScrollLeftRef.current = container.scrollLeft;
      }
      lastTimestampRef.current = null;
      isPausedRef.current = false;
    }, 3000);
  }, []);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, []);

  // Single stable requestAnimationFrame loop using time-based movement (~30px/sec)
  useEffect(() => {
    const speedPixelsPerSecond = 30;

    const animate = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }

      const deltaSeconds = Math.min(
        (timestamp - lastTimestampRef.current) / 1000,
        0.1
      );
      lastTimestampRef.current = timestamp;

      const container = containerRef.current;
      const setWidth = singleSetWidthRef.current;

      if (
        container &&
        setWidth > 0 &&
        !isPausedRef.current &&
        !isDraggingRef.current &&
        !reducedMotion
      ) {
        exactScrollLeftRef.current += speedPixelsPerSecond * deltaSeconds;
        container.scrollLeft = exactScrollLeftRef.current;
        normalizeInfiniteScroll();
      }

      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    animationFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [reducedMotion, normalizeInfiniteScroll]);

  // Manual Interaction Handlers (Pointer, Touch, Wheel, Keyboard)
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const container = containerRef.current;
    if (!container) return;

    isDraggingRef.current = true;
    setIsDragging(true);
    pauseAutoplayTemporarily();
    dragStartXRef.current = e.pageX - container.offsetLeft;
    dragStartScrollLeftRef.current = container.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;

    const x = e.pageX - container.offsetLeft;
    const walk = (x - dragStartXRef.current) * 1.25;
    container.scrollLeft = dragStartScrollLeftRef.current - walk;
    exactScrollLeftRef.current = container.scrollLeft;
    normalizeInfiniteScroll();
  };

  const handleMouseUpOrLeave = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
      pauseAutoplayTemporarily();
    }
  };

  const handleTouchStart = () => {
    pauseAutoplayTemporarily();
  };

  const handleTouchMove = () => {
    const container = containerRef.current;
    if (container) {
      exactScrollLeftRef.current = container.scrollLeft;
      normalizeInfiniteScroll();
    }
    pauseAutoplayTemporarily();
  };

  const handleWheel = () => {
    const container = containerRef.current;
    if (container) {
      exactScrollLeftRef.current = container.scrollLeft;
      normalizeInfiniteScroll();
    }
    pauseAutoplayTemporarily();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    if (e.key === "ArrowRight") {
      e.preventDefault();
      pauseAutoplayTemporarily();
      container.scrollBy({ left: 240, behavior: "smooth" });
      exactScrollLeftRef.current = container.scrollLeft + 240;
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      pauseAutoplayTemporarily();
      container.scrollBy({ left: -240, behavior: "smooth" });
      exactScrollLeftRef.current = container.scrollLeft - 240;
    }
  };

  // Render 3 identical sets of 11 members (33 cards total) for bidirectional infinite scrolling
  const tripleMembers = [
    ...GOVERNING_BODY_MEMBERS,
    ...GOVERNING_BODY_MEMBERS,
    ...GOVERNING_BODY_MEMBERS,
  ];

  return (
    <section
      ref={sectionRef}
      aria-labelledby="governing-body-heading"
      className="relative w-full overflow-hidden bg-[#FDFCF8] py-14 sm:py-16 md:py-20 border-t border-b border-soft-border/40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading & Subtitle */}
        <div
          className={`max-w-3xl mx-auto text-center mb-10 sm:mb-12 transition-all duration-600 ${
            reducedMotion || isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          <h2
            id="governing-body-heading"
            className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-udbhav-blue-deep tracking-tight mb-3"
          >
            Governing Body
          </h2>
          <div
            aria-hidden="true"
            className="mx-auto h-1 w-14 rounded-full bg-impact-green mb-3.5"
          />
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-2xl mx-auto">
            Meet the dedicated leaders guiding UDBHAV Foundation’s vision,
            programmes and community impact.
          </p>
        </div>

        {/* Synchronized Continuous Carousel Track Container with Edge Fade Mask */}
        <div
          className={`relative w-full transition-all duration-700 delay-150 ${
            reducedMotion || isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          {/* Edge Fade Mask Wrapper */}
          <div
            className="w-full overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
            }}
          >
            {/* Native Scrollable & Draggable Synchronized Track */}
            <div
              ref={containerRef}
              role="region"
              aria-label="Governing Body member carousel"
              tabIndex={0}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onWheel={handleWheel}
              onKeyDown={handleKeyDown}
              className={`w-full overflow-x-auto select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-impact-green py-3 px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                isDragging ? "cursor-grabbing" : "cursor-grab"
              }`}
              style={{
                touchAction: "pan-y",
                WebkitOverflowScrolling: "touch",
              }}
            >
              <div
                ref={trackRef}
                className="flex gap-4 sm:gap-5 w-max items-stretch"
              >
                {tripleMembers.map((member, idx) => {
                  const isDuplicate = idx < 11 || idx >= 22;
                  return (
                    <MemberProfileCard
                      key={`${member.name}-${idx}`}
                      member={member}
                      ariaHidden={isDuplicate ? true : undefined}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MemberProfileCard({
  member,
  ariaHidden,
}: {
  member: GoverningBodyMember;
  ariaHidden?: boolean;
}) {
  return (
    <article
      aria-hidden={ariaHidden}
      className="group relative flex flex-col items-center justify-start w-[220px] sm:w-[232px] min-h-[264px] p-5 rounded-2xl bg-gradient-to-b from-pure-white via-pure-white to-soft-green/35 border border-impact-green/20 shadow-sm hover:shadow-md hover:-translate-y-1.5 hover:scale-[1.018] hover:border-impact-green/50 active:scale-[0.98] transition-all duration-280 ease-out shrink-0 select-none"
    >
      {/* Circular Profile Image (96px desktop / 80px mobile) */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-impact-green/30 bg-gradient-to-br from-soft-green via-warm-white to-soft-green/70 shadow-sm flex items-center justify-center shrink-0 mb-4 overflow-hidden group-hover:border-impact-green/60 transition-colors">
        {member.image ? (
          <Image
            src={member.image}
            alt={`Portrait of ${member.name}`}
            fill
            sizes="96px"
            draggable={false}
            className="rounded-full object-cover object-center select-none"
          />
        ) : (
          <div
            role="img"
            aria-label={`Profile placeholder for ${member.name}`}
            className="w-full h-full flex items-center justify-center text-udbhav-blue-deep/70 select-none"
          >
            <User
              className="w-10 h-10 sm:w-11 sm:h-11 stroke-[1.5]"
              aria-hidden="true"
            />
          </div>
        )}
      </div>

      {/* Member Name */}
      <h3 className="font-heading text-[16px] sm:text-[17px] font-bold text-udbhav-blue-deep text-center leading-snug line-clamp-2 min-h-[42px] flex items-center justify-center w-full select-none">
        {member.name}
      </h3>

      {/* Small Accent Line */}
      <div
        aria-hidden="true"
        className="h-0.5 w-8 rounded-full bg-impact-green/40 my-2"
      />

      {/* Member Designation */}
      <p className="text-[13px] sm:text-[13.5px] font-medium text-env-green text-center leading-relaxed select-none">
        {member.designation}
      </p>
    </article>
  );
}

export default GoverningBodySection;
