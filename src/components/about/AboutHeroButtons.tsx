'use client';

import React, { useEffect, useState } from 'react';
import { Users, Target, History, Globe, ArrowRight } from 'lucide-react';

const TOPICS = [
  {
    id: 'who-we-are',
    number: '01',
    title: 'WHO ARE WE?',
    description: 'Explore our identity',
    Icon: Users,
    color: 'green'
  },
  {
    id: 'what-we-do',
    number: '02',
    title: 'WHAT WE DO?',
    description: 'Our areas of work',
    Icon: Target,
    color: 'cyan'
  },
  {
    id: 'when-did-we-start',
    number: '03',
    title: 'WHEN DID WE START?',
    description: 'Our journey',
    Icon: History,
    color: 'amber'
  },
  {
    id: 'why-our-work-matters',
    number: '04',
    title: 'WHY OUR WORK MATTERS?',
    description: 'Our purpose & impact',
    Icon: Globe,
    color: 'coral'
  },
];

export function AboutHeroButtons() {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          setActiveId(visibleEntries[0].target.id);
        }
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    TOPICS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveId(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getColorClasses = (color: string, isActive: boolean) => {
    switch (color) {
      case 'green':
        return {
          bg: isActive ? 'bg-[#f0fdf4]' : 'bg-white',
          border: isActive ? 'border-[#4ade80]' : 'border-white/40',
          hoverBorder: 'hover:border-[#4ade80]',
          accent: 'bg-[#4ade80]',
          icon: 'text-[#166534]',
          iconBg: 'bg-[#dcfce7]',
          glow: isActive ? 'shadow-[0_0_15px_rgba(74,222,128,0.3)]' : '',
        };
      case 'cyan':
        return {
          bg: isActive ? 'bg-[#ecfeff]' : 'bg-white',
          border: isActive ? 'border-[#22d3ee]' : 'border-white/40',
          hoverBorder: 'hover:border-[#22d3ee]',
          accent: 'bg-[#22d3ee]',
          icon: 'text-[#164e63]',
          iconBg: 'bg-[#cffafe]',
          glow: isActive ? 'shadow-[0_0_15px_rgba(34,211,238,0.3)]' : '',
        };
      case 'amber':
        return {
          bg: isActive ? 'bg-[#fffbeb]' : 'bg-white',
          border: isActive ? 'border-[#fbbf24]' : 'border-white/40',
          hoverBorder: 'hover:border-[#fbbf24]',
          accent: 'bg-[#fbbf24]',
          icon: 'text-[#78350f]',
          iconBg: 'bg-[#fef3c7]',
          glow: isActive ? 'shadow-[0_0_15px_rgba(251,191,36,0.3)]' : '',
        };
      case 'coral':
      default:
        return {
          bg: isActive ? 'bg-[#fdf2f8]' : 'bg-white',
          border: isActive ? 'border-[#f472b6]' : 'border-white/40',
          hoverBorder: 'hover:border-[#f472b6]',
          accent: 'bg-[#f472b6]',
          icon: 'text-[#831843]',
          iconBg: 'bg-[#fce7f3]',
          glow: isActive ? 'shadow-[0_0_15px_rgba(244,114,182,0.3)]' : '',
        };
    }
  };

  return (
    <div className="relative mx-auto mt-12 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:gap-8 px-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 border-2 border-dashed border-white/10 rounded-[40px] pointer-events-none hidden md:block"></div>

      {TOPICS.map(({ id, number, title, description, Icon, color }, index) => {
        const isActive = activeId === id;
        const colors = getColorClasses(color, isActive);

        return (
          <div
            key={id}
            className="animate-hero-buttons opacity-0"
            style={{
              animationDelay: `${300 + index * 100}ms`,
              animationFillMode: 'forwards',
              animationName: 'slideUpFade'
            }}
          >
            <a
              href={`#${id}`}
              onClick={(e) => handleClick(e, id)}
              className={`
                group relative flex flex-col justify-between overflow-hidden rounded-3xl p-6 text-left
                transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]
                border-2 shadow-sm hover:-translate-y-2 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-udbhav-blue-deep
                ${colors.bg} ${colors.border} ${colors.hoverBorder} ${colors.glow}
              `}
              aria-current={isActive ? 'true' : undefined}
            >
              <div className="flex items-center justify-between mb-8">
                <span className={`font-serif text-lg font-bold text-gray-400 transition-colors group-hover:text-gray-900 ${isActive ? 'text-gray-900' : ''}`}>
                  {number}
                </span>
                <div className={`p-2 rounded-full transition-transform duration-300 group-hover:scale-110 ${colors.iconBg}`}>
                  <Icon className={`w-5 h-5 ${colors.icon}`} />
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="font-heading text-lg font-bold text-udbhav-blue-deep tracking-tight mb-1">
                  {title}
                </h3>
                <p className="text-sm font-medium text-gray-500 transition-colors group-hover:text-gray-700">
                  {description}
                </p>
              </div>

              <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100">
                <div className={`h-full w-0 transition-all duration-500 ease-out group-hover:w-full ${colors.accent} ${isActive ? 'w-full' : ''}`}></div>
              </div>

              <div className={`absolute bottom-6 right-6 transition-all duration-300 transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 ${isActive ? 'translate-x-0 opacity-100' : ''}`}>
                <ArrowRight className={`w-5 h-5 ${colors.icon}`} />
              </div>
            </a>
          </div>
        );
      })}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}} />
    </div>
  );
}

export function HeroParallax({ children, className, style }: { children: React.ReactNode, className?: string, style?: React.CSSProperties }) {
  const [scrollY, setScrollY] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);

    const handleScroll = () => {
      if (!mediaQuery.matches) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const parallaxY = reducedMotion ? 0 : scrollY * 0.3;
  const opacity = reducedMotion ? 1 : Math.max(0, 1 - scrollY / 500);

  return (
    <section
      aria-labelledby="about-hero-heading"
      className={`relative w-full overflow-hidden border-b border-soft-border/40 ${className}`}
      style={style}
    >
      {/* Animated Blobs */}
      <div
        className="pointer-events-none absolute -top-32 left-0 h-[400px] w-[400px] rounded-full bg-teal-500/10 blur-[100px] mix-blend-overlay"
        style={{ transform: reducedMotion ? 'none' : `translate(${scrollY * 0.1}px, ${scrollY * 0.2}px)` }}
      />
      <div
        className="pointer-events-none absolute top-1/4 right-0 h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[120px] mix-blend-overlay"
        style={{ transform: reducedMotion ? 'none' : `translate(${-scrollY * 0.15}px, ${scrollY * 0.1}px)` }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 left-1/4 h-[400px] w-[400px] rounded-full bg-impact-green/10 blur-[100px] mix-blend-overlay"
        style={{ transform: reducedMotion ? 'none' : `translate(${scrollY * 0.05}px, ${-scrollY * 0.1}px)` }}
      />
      <div
        className="pointer-events-none absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full bg-amber-500/10 blur-[90px] mix-blend-overlay"
        style={{ transform: reducedMotion ? 'none' : `translate(${-scrollY * 0.1}px, ${-scrollY * 0.2}px)` }}
      />

      <div
        className="relative z-10 w-full"
        style={{
          transform: `translateY(${parallaxY}px)`,
          opacity: opacity
        }}
      >
        {children}
      </div>
    </section>
  );
}
