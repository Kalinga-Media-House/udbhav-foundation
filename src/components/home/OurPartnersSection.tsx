"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { RevealCard } from "@/components/shared/RevealCard";

export interface PartnerLogo {
  id: string;
  name: string;
  logo: string;
}

// Upper Row (17 partners scrolling Right -> Left)
export const UPPER_ROW_PARTNERS: PartnerLogo[] = [
  { id: "queens-club", name: "Queens Club", logo: "/images/partners/queens-club.png" },
  { id: "round-table-india", name: "Round Table India", logo: "/images/partners/round-table-india.png" },
  { id: "ladies-circle-india", name: "Ladies Circle India", logo: "/images/partners/ladies-circle-india.png" },
  { id: "knight-round-table-230", name: "Knight Round Table 230", logo: "/images/partners/knight-round-table-230.png" },
  { id: "shreehari", name: "ShreeHari", logo: "/images/partners/shreehari.png" },
  { id: "bank-of-baroda", name: "Bank of Baroda", logo: "/images/partners/bank-of-baroda.png" },
  { id: "state-bank-of-india", name: "State Bank of India", logo: "/images/partners/state-bank-of-india.png" },
  { id: "idbi-bank", name: "IDBI Bank", logo: "/images/partners/idbi-bank.png" },
  { id: "nirvana-eye-hospital", name: "Nirvana Eye Hospital", logo: "/images/partners/nirvana-eye-hospital.png" },
  { id: "centre-for-sight", name: "Centre for Sight", logo: "/images/partners/centre-for-sight.png" },
  { id: "nalco", name: "NALCO", logo: "/images/partners/nalco.png" },
  { id: "imfa", name: "IMFA", logo: "/images/partners/imfa.png" },
  { id: "utkal-pratidin", name: "Utkal Pratidin", logo: "/images/partners/utkal-pratidin.png" },
  { id: "odisha-ias-banking-academy", name: "Odisha IAS & Banking Academy", logo: "/images/partners/odisha-ias-banking-academy.png" },
  { id: "threatsys", name: "Threatsys", logo: "/images/partners/threatsys.png" },
  { id: "duramix", name: "Duramix", logo: "/images/partners/duramix.png" },
  { id: "apollo-hospitals", name: "Apollo Hospitals", logo: "/images/partners/apollo-hospitals.png" },
];

// Lower Row (16 partners scrolling Left -> Right)
export const LOWER_ROW_PARTNERS: PartnerLogo[] = [
  { id: "ibl-beauty-academy", name: "IBL Beauty Academy", logo: "/images/partners/ibl-beauty-academy.png" },
  { id: "sparc", name: "SPARC", logo: "/images/partners/sparc.png" },
  { id: "decathlon", name: "Decathlon", logo: "/images/partners/decathlon.png" },
  { id: "ajanta-advertisers", name: "Ajanta Advertisers", logo: "/images/partners/ajanta-advertisers.png" },
  { id: "eco-saathi", name: "Eco Saathi", logo: "/images/partners/eco-saathi.png" },
  { id: "niswa", name: "Niswa", logo: "/images/partners/niswa.png" },
  { id: "koustuv-group", name: "Koustuv Group", logo: "/images/partners/koustuv-group.png" },
  { id: "sdg-partner", name: "SDG Partner", logo: "/images/partners/sdg-partner.png" },
  { id: "dr-lal-pathlabs", name: "Dr. Lal PathLabs", logo: "/images/partners/dr-lal-pathlabs.png" },
  { id: "ucmas", name: "UCMAS", logo: "/images/partners/ucmas.png" },
  { id: "kidzee", name: "Kidzee", logo: "/images/partners/kidzee.png" },
  { id: "gurukulam-india-school", name: "Gurukulam India School", logo: "/images/partners/gurukulam-india-school.png" },
  { id: "radha-govind-homes", name: "Radha Govind Homes", logo: "/images/partners/radha-govind-homes.png" },
  { id: "reach-digitally", name: "Reach Digitally", logo: "/images/partners/reach-digitally.png" },
  { id: "digital-ratha", name: "Digital Ratha", logo: "/images/partners/digital-ratha.png" },
  { id: "suravi-milk", name: "Suravi Milk", logo: "/images/partners/suravi-milk.png" },
];

interface PartnerMarqueeRowProps {
  partners: PartnerLogo[];
  direction: "rtl" | "ltr";
  ariaLabel: string;
  reducedMotion: boolean;
  isVisible: boolean;
}

function PartnerMarqueeRow({
  partners,
  direction,
  ariaLabel,
  reducedMotion,
  isVisible,
}: PartnerMarqueeRowProps) {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const singleSetWidthRef = useRef<number>(0);
  const exactScrollLeftRef = useRef<number>(0);
  const isPausedRef = useRef<boolean>(false);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartScrollLeftRef = useRef<number>(0);

  // Measure the width of exactly 1 original partner set
  const measureSetWidth = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const children = track.children;
    const originalCount = partners.length;
    if (children.length >= originalCount * 2) {
      const firstChild = children[0] as HTMLElement;
      const nextSetChild = children[originalCount] as HTMLElement;
      const setWidth = nextSetChild.offsetLeft - firstChild.offsetLeft;
      if (setWidth > 0) {
        singleSetWidthRef.current = setWidth;
        if (exactScrollLeftRef.current === 0 && containerRef.current) {
          containerRef.current.scrollLeft = setWidth;
          exactScrollLeftRef.current = setWidth;
        }
      }
    }
  }, [partners.length]);

  // Normalize infinite scroll across Set 1, Set 2, Set 3
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

  const pauseAutoplayTemporarily = useCallback(() => {
    isPausedRef.current = true;
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    resumeTimeoutRef.current = setTimeout(() => {
      const container = containerRef.current;
      if (container) {
        exactScrollLeftRef.current = container.scrollLeft;
      }
      lastTimestampRef.current = null;
      isPausedRef.current = false;
    }, 2200);
  }, []);

  useEffect(() => {
    measureSetWidth();
    window.addEventListener("resize", measureSetWidth);
    return () => window.removeEventListener("resize", measureSetWidth);
  }, [measureSetWidth, isVisible]);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, []);

  // Time-based smooth linear animation loop (~38px/sec)
  useEffect(() => {
    const speedPixelsPerSecond = 38;

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
        if (direction === "rtl") {
          exactScrollLeftRef.current += speedPixelsPerSecond * deltaSeconds;
        } else {
          exactScrollLeftRef.current -= speedPixelsPerSecond * deltaSeconds;
        }
        container.scrollLeft = exactScrollLeftRef.current;
        normalizeInfiniteScroll();
      }

      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    if (isVisible && !reducedMotion) {
      animationFrameIdRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    };
  }, [direction, isVisible, normalizeInfiniteScroll, reducedMotion]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartXRef.current = e.pageX - (containerRef.current?.offsetLeft || 0);
    dragStartScrollLeftRef.current = containerRef.current?.scrollLeft || 0;
    pauseAutoplayTemporarily();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - (containerRef.current.offsetLeft || 0);
    const walk = (x - dragStartXRef.current) * 1.35;
    containerRef.current.scrollLeft = dragStartScrollLeftRef.current - walk;
    exactScrollLeftRef.current = containerRef.current.scrollLeft;
    normalizeInfiniteScroll();
  };

  const handleMouseUpOrLeave = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
      pauseAutoplayTemporarily();
    }
  };

  // Touch handlers
  const handleTouchStart = () => {
    pauseAutoplayTemporarily();
  };

  const handleTouchMove = () => {
    pauseAutoplayTemporarily();
    const container = containerRef.current;
    if (container) {
      exactScrollLeftRef.current = container.scrollLeft;
      normalizeInfiniteScroll();
    }
  };

  const triplePartners = [...partners, ...partners, ...partners];

  return (
    <div
      className="w-full overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
      }}
    >
      <div
        ref={containerRef}
        role="region"
        aria-label={ariaLabel}
        tabIndex={0}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        className={`flex items-center gap-4 sm:gap-5 lg:gap-6 overflow-x-auto scrollbar-none py-2 focus:outline-none select-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        <div ref={trackRef} className="flex items-center gap-4 sm:gap-5 lg:gap-6 shrink-0">
          {triplePartners.map((partner, index) => (
            <PartnerCard key={`${partner.id}-${index}`} partner={partner} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PartnerCard({ partner }: { partner: PartnerLogo }) {
  const [imgError, setImgError] = useState(false);

  return (
    <article className="group relative w-[135px] sm:w-[170px] lg:w-[216px] h-[70px] sm:h-[86px] lg:h-[104px] rounded-xl sm:rounded-2xl bg-pure-white border border-impact-green/20 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-impact-green/45 active:scale-[0.985] transition-all duration-300 ease-out flex items-center justify-center p-3 sm:p-4 shrink-0 select-none overflow-hidden">
      {!imgError ? (
        <Image
          src={partner.logo}
          alt={`${partner.name} — UDBHAV Foundation partner`}
          fill
          sizes="(max-width: 640px) 135px, (max-width: 1024px) 170px, 216px"
          className="object-contain p-2.5 sm:p-3.5 group-hover:scale-[1.03] transition-transform duration-300 ease-out select-none"
          draggable={false}
          onError={() => setImgError(true)}
        />
      ) : (
        /* Refined institutional crest fallback emblem while image file is not yet placed on disk */
        <div
          role="img"
          aria-label={`${partner.name} — UDBHAV Foundation partner`}
          className="w-full h-full flex flex-col items-center justify-center text-center p-1.5 select-none"
        >
          <span className="font-heading font-bold text-[11px] sm:text-xs lg:text-sm text-udbhav-blue-deep line-clamp-2 leading-tight">
            {partner.name}
          </span>
          <span className="text-[9px] sm:text-[10px] text-impact-green font-medium tracking-wide uppercase mt-0.5">
            Partner
          </span>
        </div>
      )}
    </article>
  );
}

export function OurPartnersSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    queueMicrotask(() => setReducedMotion(mediaQuery.matches));
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      queueMicrotask(() => setIsVisible(true));
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

    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="our-partners-heading"
      className="relative w-full overflow-hidden bg-gradient-to-b from-warm-white via-[#FDFCF8] to-pure-white py-14 sm:py-16 md:py-20 lg:py-24 border-t border-soft-border/40"
    >
      {/* Restrained decorative subtle green glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-soft-green/30 blur-3xl opacity-75"
      />

      <Container className="relative z-10">
        {/* Section Heading & Caption */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 lg:mb-14">
          <RevealCard as="div" index={0}>
            <span className="eyebrow-label text-impact-green font-heading text-xs sm:text-sm font-bold tracking-widest uppercase block mb-2">
              COMMUNITY & COLLABORATION
            </span>
            <h2
              id="our-partners-heading"
              className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-udbhav-blue-deep tracking-tight"
            >
              OUR PARTNERS
            </h2>
          </RevealCard>

          <RevealCard as="div" index={1}>
            <p className="text-sm sm:text-base lg:text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto mt-3">
              “Together with our trusted partners, we are creating meaningful
              and lasting community impact.”
            </p>
            <div
              aria-hidden="true"
              className="mx-auto h-1 w-14 rounded-full bg-impact-green mt-3.5"
            />
          </RevealCard>
        </div>

        {/* Two Infinite Marquee Rows */}
        <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6">
          {/* Upper Row: Right to Left */}
          <RevealCard as="div" index={2} className="w-full">
            <PartnerMarqueeRow
              partners={UPPER_ROW_PARTNERS}
              direction="rtl"
              ariaLabel="UDBHAV Foundation partners scrolling from right to left"
              reducedMotion={reducedMotion}
              isVisible={isVisible}
            />
          </RevealCard>

          {/* Lower Row: Left to Right */}
          <RevealCard as="div" index={3} className="w-full">
            <PartnerMarqueeRow
              partners={LOWER_ROW_PARTNERS}
              direction="ltr"
              ariaLabel="UDBHAV Foundation partners scrolling from left to right"
              reducedMotion={reducedMotion}
              isVisible={isVisible}
            />
          </RevealCard>
        </div>
      </Container>
    </section>
  );
}

export default OurPartnersSection;
