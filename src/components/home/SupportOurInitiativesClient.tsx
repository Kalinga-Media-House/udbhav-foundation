"use client";

import {
  GraduationCap,
  BookOpen,
  Sprout,
  Footprints,
  Library,
  ShieldCheck,
  HeartHandshake,
  Stethoscope,
  Sparkles,
  HeartPulse,
  Siren,
  Heart
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState, useCallback } from "react";

import { Container } from "@/components/shared/Container";
import { RevealCard } from "@/components/shared/RevealCard";

export interface InitiativeItem {
  id: string;
  slug: string;
  number: string;
  title: string;
  category: string;
  description: string;
  image?: string;
  iconName: string;
  goalAmount: number;
  raisedAmount: number;
  availableAmount: number;
  percentage: number;
  formattedGoal: string;
  formattedRaised: string;
  formattedAvailable: string;
  theme: {
    gradient: string;
    badgeBg: string;
    badgeText: string;
    progressFill: string;
    buttonBg: string;
    buttonHover: string;
  };
  donationUrl: string;
  detailsUrl: string;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap,
  BookOpen,
  Sprout,
  Footprints,
  Library,
  ShieldCheck,
  HeartHandshake,
  Stethoscope,
  Sparkles,
  HeartPulse,
  Siren,
  Heart
};

function InitiativeDonationCard({
  initiative,
  animateProgress,
  reducedMotion,
}: {
  initiative: InitiativeItem;
  animateProgress: boolean;
  reducedMotion: boolean;
}) {
  const IconComponent = ICON_MAP[initiative.iconName] || Heart;
  const [imgError, setImgError] = useState(false);

  const raisedRef = useRef<HTMLSpanElement>(null);
  const availableRef = useRef<HTMLSpanElement>(null);
  const percentageRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (reducedMotion || !animateProgress) {
      if (raisedRef.current) raisedRef.current.textContent = initiative.formattedRaised;
      if (availableRef.current) availableRef.current.textContent = initiative.formattedAvailable;
      if (percentageRef.current) percentageRef.current.textContent = `${initiative.percentage}%`;
      if (progressRef.current) progressRef.current.style.width = `${initiative.percentage}%`;
      return;
    }

    const duration = 2000; // 2s count up
    const pause = 1500; // 1.5s pause
    const totalCycle = duration + pause;
    let startTime: number | null = null;

    const easeOutQuart = (x: number): number => {
      return 1 - Math.pow(1 - x, 4);
    };

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const cycleTime = elapsed % totalCycle;

      if (cycleTime < duration) {
        // Counting up
        const progress = cycleTime / duration;
        const ease = easeOutQuart(progress);

        const currentRaised = ease * initiative.raisedAmount;
        const currentAvailable = ease * initiative.availableAmount;
        const currentPercentage = ease * initiative.percentage;

        if (raisedRef.current) raisedRef.current.textContent = `₹${Math.round(currentRaised).toLocaleString('en-IN')}`;
        if (availableRef.current) availableRef.current.textContent = `₹${Math.round(currentAvailable).toLocaleString('en-IN')}`;
        if (percentageRef.current) percentageRef.current.textContent = `${Math.round(currentPercentage)}%`;
        if (progressRef.current) progressRef.current.style.width = `${currentPercentage}%`;
      } else {
        // Paused at final value
        if (raisedRef.current) raisedRef.current.textContent = initiative.formattedRaised;
        if (availableRef.current) availableRef.current.textContent = initiative.formattedAvailable;
        if (percentageRef.current) percentageRef.current.textContent = `${initiative.percentage}%`;
        if (progressRef.current) progressRef.current.style.width = `${initiative.percentage}%`;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [reducedMotion, animateProgress, initiative]);

  return (
    <article className="group relative w-[280px] sm:w-[320px] lg:w-[340px] flex flex-col justify-between bg-pure-white rounded-2xl sm:rounded-3xl border border-soft-border/80 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out overflow-hidden shrink-0 select-none">
      {/* Top Visual Area */}
      <div className="relative h-40 sm:h-44 w-full overflow-hidden bg-gradient-to-br from-udbhav-blue-deep to-impact-green">
        {initiative.image && !imgError ? (
          <Image
            src={initiative.image}
            alt={initiative.title}
            fill
            sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 340px"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out select-none"
            draggable={false}
            onError={() => setImgError(true)}
          />
        ) : null}

        {/* Themed Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-tr ${initiative.theme.gradient} opacity-80 mix-blend-multiply`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Initiative Number Badge */}
        <div className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white font-heading font-bold text-xs tracking-wider">
          #{initiative.number}
        </div>

        {/* Large Initiative Icon */}
        <div className="absolute bottom-3.5 right-3.5 w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-sm">
          <IconComponent className="w-5 h-5" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-2.5 ${initiative.theme.badgeBg} ${initiative.theme.badgeText}`}>
            {initiative.category}
          </span>

          <h3 className="font-heading text-lg sm:text-xl font-bold text-udbhav-blue-deep leading-snug line-clamp-2 min-h-[48px] mb-2">
            {initiative.title}
          </h3>

          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed line-clamp-3 mb-5">
            {initiative.description}
          </p>
        </div>

        {/* Donation Statistics */}
        <div className="space-y-4 pt-2 border-t border-soft-border/50">
          <div className="grid grid-cols-3 gap-1.5 text-center">
            <div className="bg-warm-white/80 rounded-lg p-2 border border-soft-border/40">
              <span className="block text-[10px] text-text-secondary font-semibold uppercase tracking-wider">Goal</span>
              <span className="block font-heading text-xs sm:text-sm font-bold text-udbhav-blue-deep mt-0.5">{initiative.formattedGoal}</span>
            </div>
            <div className="bg-warm-white/80 rounded-lg p-2 border border-soft-border/40">
              <span className="block text-[10px] text-text-secondary font-semibold uppercase tracking-wider">Raised</span>
              <span ref={raisedRef} className="block font-heading text-xs sm:text-sm font-bold text-impact-green mt-0.5">{initiative.formattedRaised}</span>
            </div>
            <div className="bg-warm-white/80 rounded-lg p-2 border border-soft-border/40">
              <span className="block text-[10px] text-text-secondary font-semibold uppercase tracking-wider">Available</span>
              <span ref={availableRef} className="block font-heading text-xs sm:text-sm font-bold text-udbhav-blue-deep/80 mt-0.5">{initiative.formattedAvailable}</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-text-secondary mb-1.5">
              <span>Fundraising Progress</span>
              <span ref={percentageRef} className={`font-bold ${initiative.theme.badgeText}`}>{initiative.percentage}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-soft-border/60 overflow-hidden relative">
              <div
                ref={progressRef}
                className={`h-full rounded-full ${initiative.theme.progressFill}`}
                style={{ width: "0%" }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5 pt-1">
            <Link
              href={initiative.donationUrl}
              className={`flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-white font-heading font-semibold text-xs sm:text-sm shadow-sm transition-all duration-200 active:scale-95 ${initiative.theme.buttonBg} ${initiative.theme.buttonHover}`}
            >
              DONATE NOW
            </Link>
            <Link
              href={initiative.detailsUrl}
              className="inline-flex items-center justify-center px-3.5 py-2.5 rounded-xl border border-soft-border hover:border-impact-green/50 text-udbhav-blue-deep font-heading font-semibold text-xs sm:text-sm transition-colors"
            >
              VIEW DETAILS
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export function SupportOurInitiativesClient({ initiatives }: { initiatives: InitiativeItem[] }) {
  const [isVisible, setIsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
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

  const measureSetWidth = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const children = track.children;
    const originalCount = initiatives.length;
    if (children.length >= originalCount * 2 && originalCount > 0) {
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
  }, [initiatives.length]);

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
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      if (containerRef.current) exactScrollLeftRef.current = containerRef.current.scrollLeft;
      lastTimestampRef.current = null;
      isPausedRef.current = false;
    }, 2400);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    queueMicrotask(() => setReducedMotion(mediaQuery.matches));
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) isPausedRef.current = true;
      else {
        lastTimestampRef.current = null;
        isPausedRef.current = false;
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
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
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [reducedMotion]);

  useEffect(() => {
    measureSetWidth();
    window.addEventListener("resize", measureSetWidth);
    return () => window.removeEventListener("resize", measureSetWidth);
  }, [measureSetWidth, isVisible]);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const speedPixelsPerSecond = 30;
    const animate = (timestamp: number) => {
      if (lastTimestampRef.current === null) lastTimestampRef.current = timestamp;
      const deltaSeconds = Math.min((timestamp - lastTimestampRef.current) / 1000, 0.1);
      lastTimestampRef.current = timestamp;

      if (containerRef.current && singleSetWidthRef.current > 0 && !isPausedRef.current && !isDraggingRef.current && !reducedMotion) {
        exactScrollLeftRef.current += speedPixelsPerSecond * deltaSeconds;
        containerRef.current.scrollLeft = exactScrollLeftRef.current;
        normalizeInfiniteScroll();
      }
      animationFrameIdRef.current = requestAnimationFrame(animate);
    };
    if (isVisible && !reducedMotion && initiatives.length > 0) {
      animationFrameIdRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    };
  }, [isVisible, normalizeInfiniteScroll, reducedMotion, initiatives.length]);

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
    const walk = (e.pageX - (containerRef.current.offsetLeft || 0) - dragStartXRef.current) * 1.35;
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
  const handleTouchStart = () => pauseAutoplayTemporarily();
  const handleTouchMove = () => {
    pauseAutoplayTemporarily();
    if (containerRef.current) {
      exactScrollLeftRef.current = containerRef.current.scrollLeft;
      normalizeInfiniteScroll();
    }
  };

  if (initiatives.length === 0) {
    return (
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-pure-white via-[#FDFCF8] to-warm-white py-16 sm:py-20 md:py-24 border-t border-soft-border/40 text-center">
        <Container className="relative z-10">
          <span className="eyebrow-label text-impact-green font-heading text-xs sm:text-sm font-bold tracking-widest uppercase block mb-2">MAKE A DIFFERENCE</span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-udbhav-blue-deep tracking-tight mb-4">Support Our Initiatives</h2>
          <div aria-hidden="true" className="mx-auto h-1 w-14 rounded-full bg-impact-green mt-4 mb-8" />
          <p className="text-sm sm:text-base lg:text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto">No initiatives available at the moment.</p>
        </Container>
      </section>
    );
  }

  // Ensure enough elements for a smooth infinite scroll loop. If we only have 1 or 2, we might just duplicate them a lot.
  // The original used 3 copies. We will use 4 to be safe if there are few items.
  const multipliedInitiatives = [
    ...initiatives,
    ...initiatives,
    ...initiatives,
    ...initiatives,
  ];

  return (
    <section
      ref={sectionRef}
      aria-labelledby="support-initiatives-heading"
      className="relative w-full overflow-hidden bg-gradient-to-b from-pure-white via-[#FDFCF8] to-warm-white py-16 sm:py-20 md:py-24 border-t border-soft-border/40"
    >
      <div aria-hidden="true" className="pointer-events-none absolute top-20 left-1/4 w-[450px] h-[350px] rounded-full bg-impact-green/5 blur-3xl opacity-75" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-10 right-10 w-[350px] h-[350px] rounded-full bg-soft-green/40 blur-3xl opacity-60" />

      <Container className="relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14 lg:mb-16">
          <RevealCard as="div" index={0}>
            <span className="eyebrow-label text-impact-green font-heading text-xs sm:text-sm font-bold tracking-widest uppercase block mb-2">
              MAKE A DIFFERENCE
            </span>
            <h2 id="support-initiatives-heading" className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-udbhav-blue-deep tracking-tight">
              Support Our Initiatives
            </h2>
          </RevealCard>

          <RevealCard as="div" index={1}>
            <p className="font-heading text-sm sm:text-base font-semibold text-impact-green mt-3">
              “Your support today can transform someone’s tomorrow.”
            </p>
            <div aria-hidden="true" className="mx-auto h-1 w-14 rounded-full bg-impact-green mt-4" />
          </RevealCard>
        </div>
      </Container>

      <div className="relative w-full overflow-hidden">
        <div className="w-full overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)", WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)" }}>
          <div
            ref={containerRef}
            role="region"
            aria-label="Support UDBHAV Foundation initiatives"
            tabIndex={0}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            className={`flex items-stretch gap-6 sm:gap-7 lg:gap-8 overflow-x-auto scrollbar-none py-4 px-4 sm:px-6 focus:outline-none select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
          >
            <div ref={trackRef} className="flex items-stretch gap-6 sm:gap-7 lg:gap-8 shrink-0">
              {multipliedInitiatives.map((initiative, index) => (
                <InitiativeDonationCard
                  key={`${initiative.id}-dup-${index}`}
                  initiative={initiative}
                  animateProgress={isVisible || reducedMotion}
                  reducedMotion={reducedMotion}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
