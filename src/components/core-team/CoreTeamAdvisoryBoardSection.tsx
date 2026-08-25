"use client";

import { User, ChevronDown } from "lucide-react";
import Image from "next/image";
import React, { useState, useRef, useEffect, useCallback } from "react";

import { Container } from "@/components/shared/Container";
import { RevealCard } from "@/components/shared/RevealCard";

interface AdvisoryBoardMember {
  id: string;
  full_name: string;
  designation: string;
  photo_url?: string | null;
}

function AdvisorHorizontalCard({
  member,
}: {
  member: AdvisoryBoardMember;
}) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className="group relative flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-pure-white via-[#FDFCF8] to-soft-green/20 border border-impact-green/20 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
      {/* Small Circular Profile Photo / Placeholder */}
      <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-impact-green/30 bg-soft-green/50 flex items-center justify-center shrink-0">
        {member.photo_url && !imgErr ? (
          <Image
            src={member.photo_url}
            alt={member.full_name}
            fill
            sizes="48px"
            className="object-cover object-center"
            onError={() => setImgErr(true)}
          />
        ) : (
          <User className="w-5 h-5 text-impact-green" />
        )}
      </div>

      {/* Name & Designation */}
      <div className="min-w-0 flex-1">
        <h3 className="font-heading font-bold text-sm sm:text-[15px] text-udbhav-blue-deep truncate group-hover:text-impact-green transition-colors">
          {member.full_name}
        </h3>
        <p className="text-xs text-impact-green font-medium line-clamp-2 leading-snug">
          {member.designation}
        </p>
      </div>
    </div>
  );
}

export function CoreTeamAdvisoryBoardSection({ members }: { members: AdvisoryBoardMember[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const exactScrollTopRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const isUserInteractingRef = useRef<boolean>(false);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    queueMicrotask(() => {
      setReducedMotion(mediaQuery.matches);
    });
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Handle manual touch/scroll overriding auto-scroll with safe 4000ms resume delay
  const handleManualInteraction = useCallback(() => {
    isUserInteractingRef.current = true;
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    if (scrollContainerRef.current) {
      exactScrollTopRef.current = scrollContainerRef.current.scrollTop;
    }
    resumeTimeoutRef.current = setTimeout(() => {
      isUserInteractingRef.current = false;
    }, 4000);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    let isMounted = true;
    const speed = 0.35; // Slow continuous showcase movement (0.35 px/frame)

    const step = () => {
      if (!isMounted) return;
      const el = scrollContainerRef.current;
      if (el && !isUserInteractingRef.current && !document.hidden) {
        const isMobileView = window.innerWidth < 768;
        if (isMobileView) {
          exactScrollTopRef.current += speed;
          el.scrollTop = exactScrollTopRef.current;

          const maxScroll = el.scrollHeight - el.clientHeight;
          if (maxScroll > 0 && el.scrollTop >= maxScroll - 2) {
            exactScrollTopRef.current = 0;
            el.scrollTop = 0;
          } else {
            exactScrollTopRef.current = el.scrollTop;
          }
        }
      }
      animationFrameRef.current = requestAnimationFrame(step);
    };

    animationFrameRef.current = requestAnimationFrame(step);

    return () => {
      isMounted = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, [reducedMotion]);

  return (
    <section
      aria-labelledby="core-team-advisory-heading"
      className="relative w-full overflow-hidden bg-gradient-to-b from-warm-white via-[#FDFCF8] to-pure-white py-12 sm:py-16 md:py-20 border-b border-soft-border/40"
    >
      <Container>
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-14">
          <RevealCard as="div" index={0}>
            <span className="eyebrow-label text-impact-green font-heading text-xs sm:text-sm font-bold tracking-widest uppercase block mb-2">
              STRATEGIC ADVISORS
            </span>
            <h2
              id="core-team-advisory-heading"
              className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-udbhav-blue-deep tracking-tight mb-3"
            >
              Advisory Board
            </h2>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
              Guiding UDBHAV Foundation with experience, knowledge, professional
              expertise, and shared purpose.
            </p>
          </RevealCard>
        </div>

        {/* DESKTOP/TABLET GRID (>=768px): 2 cols tablet/laptop, 3 cols large desktop */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {members.map((member, index) => (
            <RevealCard
              key={`desktop-${member.id}`}
              as="div"
              index={(index % 6) + 1}
            >
              <AdvisorHorizontalCard member={member} />
            </RevealCard>
          ))}
        </div>

        {/* MOBILE ONLY (<768px): Compact Internal Scroll Container with Auto-Scrolling */}
        <div className="block md:hidden">
          <div className="relative rounded-2xl bg-gradient-to-b from-pure-white to-[#FDFCF8] border border-impact-green/25 p-3.5 shadow-sm">
            {/* Top scroll gradient mask */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-pure-white to-transparent z-10 rounded-t-2xl"
            />

            {/* Scrollable Container (~4-5 cards visible max-h-[420px]) */}
            <div
              ref={scrollContainerRef}
              onTouchStart={handleManualInteraction}
              onTouchMove={handleManualInteraction}
              onWheel={handleManualInteraction}
              className="max-h-[420px] overflow-y-auto space-y-3 pr-1 py-1 scrollbar-thin scrollbar-thumb-impact-green/30"
            >
              {members.map((member) => (
                <AdvisorHorizontalCard
                  key={`mobile-${member.id}`}
                  member={member}
                />
              ))}
            </div>

            {/* Bottom scroll gradient mask */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-pure-white to-transparent z-10 rounded-b-2xl"
            />

            {/* Mobile Swipe / Scroll Hint */}
            <div className="mt-2.5 pt-2 border-t border-soft-border/40 flex items-center justify-center gap-1.5 text-xs text-text-secondary font-medium">
              <ChevronDown className="w-3.5 h-3.5 text-impact-green animate-bounce" />
              <span>Swipe or scroll to explore all advisors</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default CoreTeamAdvisoryBoardSection;
