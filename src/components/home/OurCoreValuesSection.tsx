'use client';

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
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import { Container } from '@/components/shared/Container';

interface CoreValueData {
  number: string;
  title: string;
  principle: string;
  description?: string;
  icon: React.ComponentType<{
    className?: string;
    'aria-hidden'?: boolean | 'true' | 'false';
  }>;
}

const CORE_VALUES_DATA: CoreValueData[] = [
  {
    number: '01',
    title: 'People Over Optics',
    principle: "We don't chase visibility. We prioritize real lives.",
    description:
      'Every choice we make is based on what genuinely helps people, rather than what simply looks good on social media.',
    icon: Users,
  },
  {
    number: '02',
    title: 'Action Over Awareness',
    principle: 'Talking is good, but doing is better.',
    description:
      'We believe in stepping up and getting things done. We focus on real, practical efforts that you can see and feel in the community.',
    icon: Zap,
  },
  {
    number: '03',
    title: 'Courage Over Comfort',
    principle: 'We speak up for those who are ignored and help where it is hardest.',
    description:
      'Whether we are addressing mental health stigma, educational inequality, or environmental neglect, we choose to act with courage every single time.',
    icon: Shield,
  },
  {
    number: '04',
    title: 'Impact Over Intent',
    principle: 'Wanting to help is just the beginning.',
    description:
      'We make sure our efforts actually improve lives. We hold ourselves responsible for creating meaningful changes that truly last.',
    icon: Target,
  },
  {
    number: '05',
    title: 'Sustainability Over Quick Wins',
    principle: 'We build for the future, not just for today.',
    description:
      'Whether we are planting trees or setting up local classrooms, we focus on solutions that will continue to support the community long after we are gone.',
    icon: Sprout,
  },
  {
    number: '06',
    title: 'Inclusion Over Exclusion',
    principle: 'Everyone belongs here, and every single voice matters.',
    description:
      'We warmly welcome everyone. We work hard to create safe spaces where overlooked and vulnerable individuals feel heard, respected, and empowered.',
    icon: Handshake,
  },
  {
    number: '07',
    title: 'Integrity Over Expediency',
    principle: 'We do what is right, especially when it is difficult.',
    description:
      'Honesty and trust are at the heart of everything we do. We believe in being fully transparent with our community and our wonderful volunteers.',
    icon: ShieldCheck,
  },
  {
    number: '08',
    title: 'Compassion Over Judgment',
    principle: 'Empathy guides all of our work.',
    description:
      'We face human struggles with a kind heart. We treat everyone we meet with the respect and understanding that they deserve.',
    icon: Heart,
  },
  {
    number: '09',
    title: 'Excellence Over Mediocrity',
    principle: 'Our communities deserve the very best from us.',
    description:
      'We put genuine care and hard work into every local project. We always try our best to deliver high-quality support to those who need it.',
    icon: Award,
  },
  {
    number: '10',
    title: 'Collaboration Over Competition',
    principle: 'We are so much stronger when we grow together.',
    description:
      'We love partnering with local families, volunteers, and other groups. Working side by side is the best way to make a real difference.',
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
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    cardRef.current.style.setProperty('--cursor-x', `${x}px`);
    cardRef.current.style.setProperty('--cursor-y', `${y}px`);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.removeProperty('--cursor-x');
    cardRef.current.style.removeProperty('--cursor-y');
  };

  const staggerDelay = reducedMotion ? 0 : Math.min((index % 4) * 90, 360);

  return (
    <article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transitionDelay: isVisible ? `${staggerDelay}ms` : '0ms',
      }}
      className={`interactive-card from-pure-white via-pure-white to-soft-green/30 border-impact-green/25 shadow-impact-green/5 duration-[650ms] hover:border-impact-green/45 group relative h-auto min-h-0 rounded-xl border bg-gradient-to-br p-5 text-left shadow-md [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] sm:rounded-2xl sm:p-6 ${
        reducedMotion || isVisible
          ? 'translate-y-0 scale-100 opacity-100'
          : 'translate-y-5 scale-[0.99] opacity-0'
      }`}
    >
      {/* Soft Radial Cursor Hover Highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:rounded-2xl"
        style={{
          background:
            'radial-gradient(300px circle at var(--cursor-x, 50%) var(--cursor-y, 50%), rgba(22, 163, 74, 0.08), transparent 80%)',
        }}
      />

      <div className="relative z-10">
        <div className="mb-2.5 flex items-center justify-between gap-3 sm:mb-3">
          <span className="bg-impact-green text-pure-white flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-heading text-xs font-bold shadow-sm sm:text-sm">
            {item.number}
          </span>
          <div className="bg-soft-green border-impact-green/20 group-hover:bg-impact-green/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors">
            <IconComponent aria-hidden="true" className="text-impact-green h-4 w-4" />
          </div>
        </div>

        <h4 className="text-udbhav-blue-deep group-hover:text-impact-green mb-1.5 font-heading text-lg font-bold tracking-tight transition-colors sm:mb-2 sm:text-xl">
          {item.title}
        </h4>

        <p className="text-text-primary mb-1.5 text-sm font-semibold leading-snug sm:mb-2 sm:text-base">
          {item.principle}
        </p>

        {item.description && (
          <p className="text-text-secondary text-xs leading-relaxed sm:text-sm">
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
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    queueMicrotask(() => {
      setReducedMotion(mediaQuery.matches);
    });
    mediaQuery.addEventListener('change', handleMotionChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
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
        window.scrollTo({ top: y, behavior: reducedMotion ? 'auto' : 'smooth' });
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
      className="border-soft-border/40 relative w-full overflow-hidden border-b bg-[#FDFCF8] py-10 sm:py-14 md:py-20 lg:py-24"
    >
      <Container className="relative z-10">
        <div
          className={`transition-all duration-700 ${
            reducedMotion || isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          {/* Core Values Section Header */}
          <div className="mx-auto mb-6 max-w-3xl text-center sm:mb-8 md:mb-10">
            <span className="eyebrow-label text-impact-green mb-2 block font-heading text-xs font-bold uppercase tracking-widest sm:text-sm">
              WHAT GUIDES US
            </span>
            <h3
              id="core-values-heading"
              className="text-udbhav-blue-deep mb-2.5 font-heading text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl"
            >
              Our Core Values
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed sm:text-base">
              The principles that guide our decisions, actions and commitment to meaningful
              community impact.
            </p>
          </div>

          <div id="core-values-list">
            {/* MOBILE LAYOUT (< 768px): Single Column Container */}
            <div className="mx-auto flex w-full max-w-[400px] flex-col gap-3 md:hidden">
              {displayedValues.map((item, idx) => {
                const MobileIconComponent = item.icon;
                const staggerDelay = reducedMotion ? 0 : Math.min((idx % 4) * 90, 360);

                const hideOnSmallMobile = !isExpanded && idx >= 2 ? 'hidden sm:flex' : 'flex';

                return (
                  <article
                    key={`mobile-${item.number}`}
                    style={{ transitionDelay: isVisible ? `${staggerDelay}ms` : '0ms' }}
                    className={`${hideOnSmallMobile} from-pure-white via-pure-white to-soft-green/20 border-impact-green/20 shadow-2xs duration-[650ms] h-auto w-full shrink-0 flex-col rounded-xl border bg-gradient-to-br px-4 py-3.5 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] ${
                      reducedMotion || isVisible
                        ? 'translate-y-0 scale-100 opacity-100'
                        : 'translate-y-5 scale-[0.99] opacity-0'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="bg-impact-green text-pure-white shadow-2xs flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-heading text-xs font-bold">
                        {item.number}
                      </span>
                      <div className="bg-soft-green border-impact-green/20 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border">
                        <MobileIconComponent
                          aria-hidden="true"
                          className="text-impact-green h-3.5 w-3.5"
                        />
                      </div>
                    </div>

                    <h4 className="text-udbhav-blue-deep mb-1 font-heading text-base font-bold tracking-tight sm:text-lg">
                      {item.title}
                    </h4>

                    <p className="text-text-primary mb-1 text-xs font-semibold leading-snug sm:text-sm">
                      {item.principle}
                    </p>

                    {item.description && (
                      <p className="text-text-secondary text-xs leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </article>
                );
              })}
            </div>

            {/* DESKTOP & TABLET LAYOUT (>= 768px): Two-Column Grid */}
            <div className="hidden grid-cols-2 items-start gap-x-5 gap-y-4 sm:gap-y-5 md:grid lg:gap-x-6">
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

          <div className="mt-8 flex justify-center sm:mt-10 md:mt-12">
            <button
              onClick={handleToggle}
              aria-expanded={isExpanded}
              aria-controls="core-values-list"
              className="bg-impact-green text-pure-white shadow-impact-green/20 focus:ring-impact-green inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-heading text-sm font-semibold shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#31851c] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              <span>{isExpanded ? 'Show Less' : 'View All Core Values'}</span>
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default OurCoreValuesSection;
