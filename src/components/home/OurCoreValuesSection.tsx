"use client";

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
  ChevronUp,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

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

  const staggerDelay = reducedMotion ? 0 : Math.min((index % 4) * 90, 360);

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
  const [isExpanded, setIsExpanded] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);

  // Detect reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    queueMicrotask(() => {
      setReducedMotion(mediaQuery.matches);
    });
    mediaQuery.addEventListener("change", handleMotionChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  // Viewport IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect(); // Only need to trigger once
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
  }, []);

  const handleToggle = () => {
    if (isExpanded) {
      setIsExpanded(false);
      if (sectionRef.current) {
        const yOffset = -80;
        const y = sectionRef.current.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: reducedMotion ? "auto" : "smooth" });
      }
    } else {
      setIsExpanded(true);
    }
  };

  const displayedValues = isExpanded ? CORE_VALUES_DATA : CORE_VALUES_DATA.slice(0, 4);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="core-values-heading"
      className="relative w-full overflow-hidden bg-[#FDFCF8] py-10 sm:py-14 md:py-20 lg:py-24 border-b border-soft-border/40"
    >
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

          <div id="core-values-list">
            {/* MOBILE LAYOUT (< 768px): Single Column Container */}
            <div className="flex md:hidden flex-col gap-3 max-w-[400px] mx-auto w-full">
              {displayedValues.map((item, idx) => {
                const MobileIconComponent = item.icon;
                const staggerDelay = reducedMotion ? 0 : Math.min((idx % 4) * 90, 360);
                
                const hideOnSmallMobile = !isExpanded && idx >= 2 ? "hidden sm:flex" : "flex";

                return (
                  <article
                    key={`mobile-${item.number}`}
                    style={{ transitionDelay: isVisible ? `${staggerDelay}ms` : "0ms" }}
                    className={`${hideOnSmallMobile} flex-col w-full h-auto py-3.5 px-4 rounded-xl bg-gradient-to-br from-pure-white via-pure-white to-soft-green/20 border border-impact-green/20 shadow-2xs shrink-0 duration-[650ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] ${
                      reducedMotion || isVisible
                        ? "opacity-100 translate-y-0 scale-100"
                        : "opacity-0 translate-y-5 scale-[0.99]"
                    }`}
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

            {/* DESKTOP & TABLET LAYOUT (>= 768px): Two-Column Grid */}
            <div className="hidden md:grid grid-cols-2 gap-x-5 lg:gap-x-6 gap-y-4 sm:gap-y-5 items-start">
              {displayedValues.map((item, idx) => (
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
          
          <div className="mt-8 sm:mt-10 md:mt-12 flex justify-center">
            <button
              onClick={handleToggle}
              aria-expanded={isExpanded}
              aria-controls="core-values-list"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-impact-green hover:bg-[#31851c] text-pure-white font-heading font-semibold text-sm transition-all shadow-md shadow-impact-green/20 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-impact-green focus:ring-offset-2"
            >
              <span>{isExpanded ? "Show Less" : "View All Core Values"}</span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>

        </div>
      </Container>
    </section>
  );
}

export default OurCoreValuesSection;
