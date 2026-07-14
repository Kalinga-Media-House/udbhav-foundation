"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RevealCard } from "@/components/shared/RevealCard";

export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  caption: string;
  category: string;
}

export const HOME_GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: "photo-1",
    src: "/hero/hero-01.png",
    alt: "UDBHAV Foundation community gathering and collaborative empowerment",
    caption: "Community Empowerment Assembly",
    category: "Community",
  },
  {
    id: "photo-2",
    src: "/hero/hero-02.png",
    alt: "Children participating in educational awareness and creative learning sessions",
    caption: "Inclusive Education & Learning",
    category: "Education",
  },
  {
    id: "photo-3",
    src: "/hero/hero-03.png",
    alt: "Volunteers organizing mental well-being and inclusion discussions",
    caption: "Well-being & Inclusion Circle",
    category: "Inclusion",
  },
  {
    id: "photo-4",
    src: "/hero/hero-04.png",
    alt: "Community volunteers driving environmental stewardship and tree planting",
    caption: "Environmental Responsibility Drive",
    category: "Environment",
  },
  {
    id: "photo-5",
    src: "/hero/hero-05.png",
    alt: "Youth empowerment and leadership building workshop",
    caption: "Youth Leadership Development",
    category: "Empowerment",
  },
  {
    id: "photo-6",
    src: "/hero/hero-06.png",
    alt: "Collaborative community planning and dialogue session",
    caption: "Grassroots Dialogue & Action",
    category: "Community",
  },
  {
    id: "photo-7",
    src: "/hero/hero-07.png",
    alt: "Women and youth participation in vocational awareness initiative",
    caption: "Dignity & Skill Enhancement",
    category: "Empowerment",
  },
  {
    id: "photo-8",
    src: "/hero/hero-08.png",
    alt: "Volunteer team supporting local educational access and resources",
    caption: "Educational Outreach Campaign",
    category: "Education",
  },
  {
    id: "photo-9",
    src: "/hero/hero-09.png",
    alt: "Collective community action protecting local natural surroundings",
    caption: "Sustainable Community Action",
    category: "Environment",
  },
];

export function OurMomentsGallerySection() {
  const [isVisible, setIsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Refs for time-based animation and interaction state
  const singleSetWidthRef = useRef<number>(0);
  const exactScrollLeftRef = useRef<number>(0);
  const isInteractionPausedRef = useRef<boolean>(false);
  const isHoveredRef = useRef<boolean>(false);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  
  // Desktop drag state
  const dragStartXRef = useRef<number>(0);
  const dragStartScrollLeftRef = useRef<number>(0);

  // Measure the width of exactly 1 original photo set (9 cards)
  const measureSetWidth = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const children = track.children;
    const originalCount = HOME_GALLERY_PHOTOS.length;
    // We render 3 sets, so wait until they exist
    if (children.length >= originalCount * 2) {
      const firstChild = children[0] as HTMLElement;
      const nextSetChild = children[originalCount] as HTMLElement;
      const setWidth = nextSetChild.offsetLeft - firstChild.offsetLeft;
      if (setWidth > 0) {
        singleSetWidthRef.current = setWidth;
        // Initialize scrollLeft at the start of Set 2 for bidirectional infinite looping
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
        isInteractionPausedRef.current = true;
      } else {
        lastTimestampRef.current = null;
        isInteractionPausedRef.current = false;
        
        // Sync ref when returning to tab
        if (containerRef.current) {
          exactScrollLeftRef.current = containerRef.current.scrollLeft;
        }
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
    isInteractionPausedRef.current = true;
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    resumeTimeoutRef.current = setTimeout(() => {
      const container = containerRef.current;
      if (container) {
        exactScrollLeftRef.current = container.scrollLeft;
      }
      lastTimestampRef.current = null;
      isInteractionPausedRef.current = false;
    }, 3000);
  }, []);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, []);

  // Single stable requestAnimationFrame loop using time-based movement (~30px/sec)
  useEffect(() => {
    const speedPixelsPerSecond = 30; // pixels per second

    const animate = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }

      const deltaSeconds = Math.min(
        (timestamp - lastTimestampRef.current) / 1000,
        0.1 // Cap max delta to 100ms so it doesn't jump huge amounts if the tab lags
      );
      lastTimestampRef.current = timestamp;

      const container = containerRef.current;
      const setWidth = singleSetWidthRef.current;

      if (
        container &&
        setWidth > 0 &&
        !isInteractionPausedRef.current &&
        !isHoveredRef.current &&
        !isDraggingRef.current &&
        !reducedMotion
      ) {
        // Sync if the container was moved natively since last frame
        if (Math.abs(container.scrollLeft - exactScrollLeftRef.current) > 1.5) {
          exactScrollLeftRef.current = container.scrollLeft;
        }

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

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    const container = containerRef.current;
    if (container) {
      exactScrollLeftRef.current = container.scrollLeft;
    }
  };
  
  const handleMouseLeaveContainer = () => {
    isHoveredRef.current = false;
    handleMouseUpOrLeave();
  };

  const handleTouchStart = () => {
    isDraggingRef.current = true;
    setIsDragging(true);
    pauseAutoplayTemporarily();
  };

  const handleTouchMove = () => {
    const container = containerRef.current;
    if (container) {
      exactScrollLeftRef.current = container.scrollLeft;
    }
    pauseAutoplayTemporarily();
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
    pauseAutoplayTemporarily();
  };

  const handleWheel = () => {
    const container = containerRef.current;
    if (container) {
      exactScrollLeftRef.current = container.scrollLeft;
    }
    pauseAutoplayTemporarily();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    if (e.key === "ArrowRight") {
      pauseAutoplayTemporarily();
      container.scrollBy({ left: 280, behavior: "smooth" });
      exactScrollLeftRef.current = container.scrollLeft + 280;
    } else if (e.key === "ArrowLeft") {
      pauseAutoplayTemporarily();
      container.scrollBy({ left: -280, behavior: "smooth" });
      exactScrollLeftRef.current = container.scrollLeft - 280;
    }
  };

  // Render 3 identical sets of 9 photos (27 cards total) for bidirectional infinite scrolling
  const triplePhotos = [
    ...HOME_GALLERY_PHOTOS,
    ...HOME_GALLERY_PHOTOS,
    ...HOME_GALLERY_PHOTOS,
  ];

  return (
    <section
      ref={sectionRef}
      aria-labelledby="our-moments-heading"
      className="relative w-full overflow-hidden bg-gradient-to-b from-pure-white via-warm-white to-pure-white py-14 sm:py-16 md:py-20 border-t border-b border-soft-border/40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Eyebrow & Full Gallery Link */}
        <RevealCard
          as="div"
          index={0}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10"
        >
          <div>
            <span className="inline-block text-xs sm:text-sm font-heading font-bold text-impact-green tracking-wider uppercase mb-2">
              UDBHAV IN ACTION
            </span>
            <h2
              id="our-moments-heading"
              className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-udbhav-blue-deep tracking-tight mb-2"
            >
              OUR MOMENTS
            </h2>
            <div
              aria-hidden="true"
              className="h-1 w-14 rounded-full bg-impact-green mb-3"
            />
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-2xl">
              Stories of action, connection and community captured through our
              journey.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 text-sm sm:text-base font-heading font-semibold text-env-green hover:text-impact-green transition-colors py-2 group/link"
            >
              <span>View Full Gallery</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1" />
            </Link>
          </div>
        </RevealCard>

        {/* Synchronized Continuous Gallery Carousel Track */}
        <RevealCard as="div" index={1} className="relative w-full">
          <div className="w-full overflow-hidden">
            {/* Native Scrollable & Draggable Synchronized Track */}
            <div
              ref={containerRef}
              role="region"
              aria-label="UDBHAV Foundation photo moments carousel"
              tabIndex={0}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeaveContainer}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onWheel={handleWheel}
              onKeyDown={handleKeyDown}
              className={`w-full overflow-x-auto overflow-y-hidden select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-impact-green py-3 px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                isDragging ? "cursor-grabbing" : "cursor-grab"
              }`}
              style={{
                touchAction: "pan-x",
                WebkitOverflowScrolling: "touch",
                overscrollBehaviorX: "contain",
                scrollBehavior: "auto",
              }}
            >
              <div
                ref={trackRef}
                className="flex gap-3.5 sm:gap-4 w-max items-stretch"
              >
                {triplePhotos.map((photo, idx) => {
                  const originalCount = HOME_GALLERY_PHOTOS.length;
                  const isDuplicate =
                    idx < originalCount || idx >= originalCount * 2;

                  return (
                    <article
                      key={`${photo.id}-${idx}`}
                      aria-hidden={isDuplicate ? true : undefined}
                      className="group relative flex flex-col w-[255px] sm:w-[285px] lg:w-[305px] h-[175px] sm:h-[195px] rounded-2xl overflow-hidden bg-pure-white border border-impact-green/25 shadow-sm hover:shadow-md hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 ease-out shrink-0 select-none"
                    >
                      {/* Photo Image */}
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(max-width: 640px) 255px, (max-width: 1024px) 285px, 305px"
                        draggable={false}
                        className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-300 select-none pointer-events-none"
                      />

                      {/* Subtle Gradient Overlay & Caption */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-end p-3.5 sm:p-4 pointer-events-none">
                        <span className="inline-block w-fit text-[10px] font-bold uppercase tracking-wider text-warm-white bg-impact-green/90 px-2 py-0.5 rounded-full mb-1.5 backdrop-blur-2xs">
                          {photo.category}
                        </span>
                        <h3 className="font-heading text-xs sm:text-sm font-semibold text-pure-white leading-snug line-clamp-2">
                          {photo.caption}
                        </h3>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </RevealCard>
      </div>
    </section>
  );
}

export default OurMomentsGallerySection;
