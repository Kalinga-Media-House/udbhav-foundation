'use client';

import React, { useEffect, useState } from 'react';
import { Users, Target, History, Globe, ArrowRight } from 'lucide-react';

const TOPICS = [
  {
    id: 'who-we-are',
    title: 'WHO ARE WE?',
    description: 'Explore our identity',
    Icon: Users,
    color: 'green'
  },
  {
    id: 'what-we-do',
    title: 'WHAT WE DO?',
    description: 'Our areas of work',
    Icon: Target,
    color: 'cyan'
  },
  {
    id: 'when-did-we-start',
    title: 'WHEN DID WE START?',
    description: 'Our journey',
    Icon: History,
    color: 'amber'
  },
  {
    id: 'why-our-work-matters',
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
          baseBg: isActive ? 'bg-emerald-500/20 border-emerald-400/40' : 'bg-white/10 border-white/20',
          hoverBg: 'hover:bg-emerald-500/20 hover:border-emerald-400/50',
          accent: 'bg-emerald-400',
          title: isActive ? 'text-emerald-100' : 'text-white',
          desc: isActive ? 'text-emerald-50/80' : 'text-white/70',
          icon: isActive ? 'text-emerald-200' : 'text-white/80',
          hoverIcon: 'group-hover:text-emerald-200',
          iconBg: isActive ? 'bg-emerald-500/30' : 'bg-white/10',
          hoverIconBg: 'group-hover:bg-emerald-500/30',
          glow: isActive ? 'shadow-[0_0_20px_rgba(52,211,153,0.3)]' : '',
          hoverGlow: 'hover:shadow-[0_0_25px_rgba(52,211,153,0.4)]',
        };
      case 'cyan':
        return {
          baseBg: isActive ? 'bg-cyan-500/20 border-cyan-400/40' : 'bg-white/10 border-white/20',
          hoverBg: 'hover:bg-cyan-500/20 hover:border-cyan-400/50',
          accent: 'bg-cyan-400',
          title: isActive ? 'text-cyan-100' : 'text-white',
          desc: isActive ? 'text-cyan-50/80' : 'text-white/70',
          icon: isActive ? 'text-cyan-200' : 'text-white/80',
          hoverIcon: 'group-hover:text-cyan-200',
          iconBg: isActive ? 'bg-cyan-500/30' : 'bg-white/10',
          hoverIconBg: 'group-hover:bg-cyan-500/30',
          glow: isActive ? 'shadow-[0_0_20px_rgba(34,211,238,0.3)]' : '',
          hoverGlow: 'hover:shadow-[0_0_25px_rgba(34,211,238,0.4)]',
        };
      case 'amber':
        return {
          baseBg: isActive ? 'bg-amber-500/20 border-amber-400/40' : 'bg-white/10 border-white/20',
          hoverBg: 'hover:bg-amber-500/20 hover:border-amber-400/50',
          accent: 'bg-amber-400',
          title: isActive ? 'text-amber-100' : 'text-white',
          desc: isActive ? 'text-amber-50/80' : 'text-white/70',
          icon: isActive ? 'text-amber-200' : 'text-white/80',
          hoverIcon: 'group-hover:text-amber-200',
          iconBg: isActive ? 'bg-amber-500/30' : 'bg-white/10',
          hoverIconBg: 'group-hover:bg-amber-500/30',
          glow: isActive ? 'shadow-[0_0_20px_rgba(251,191,36,0.3)]' : '',
          hoverGlow: 'hover:shadow-[0_0_25px_rgba(251,191,36,0.4)]',
        };
      case 'coral':
      default:
        return {
          baseBg: isActive ? 'bg-pink-500/20 border-pink-400/40' : 'bg-white/10 border-white/20',
          hoverBg: 'hover:bg-pink-500/20 hover:border-pink-400/50',
          accent: 'bg-pink-400',
          title: isActive ? 'text-pink-100' : 'text-white',
          desc: isActive ? 'text-pink-50/80' : 'text-white/70',
          icon: isActive ? 'text-pink-200' : 'text-white/80',
          hoverIcon: 'group-hover:text-pink-200',
          iconBg: isActive ? 'bg-pink-500/30' : 'bg-white/10',
          hoverIconBg: 'group-hover:bg-pink-500/30',
          glow: isActive ? 'shadow-[0_0_20px_rgba(244,114,182,0.3)]' : '',
          hoverGlow: 'hover:shadow-[0_0_25px_rgba(244,114,182,0.4)]',
        };
    }
  };

  return (
    <div className="relative mx-auto mt-8 sm:mt-10 grid w-full max-w-[760px] grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:gap-5 px-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] border-2 border-dashed border-white/10 rounded-[40px] pointer-events-none hidden md:block"></div>

      {TOPICS.map(({ id, title, description, Icon, color }, index) => {
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
                group relative flex flex-col justify-between overflow-hidden rounded-2xl p-4 sm:p-5 text-left h-[105px] sm:h-[120px]
                backdrop-blur-md border border-solid shadow-sm
                transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                motion-safe:hover:-translate-y-1.5 motion-safe:hover:scale-[1.02]
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/50
                ${colors.baseBg} ${colors.hoverBg} ${colors.glow} ${colors.hoverGlow}
              `}
              aria-current={isActive ? 'true' : undefined}
            >
              <div className="flex justify-end relative z-10">
                <div className={`p-2 rounded-full transition-all duration-500 group-hover:scale-110 motion-safe:group-hover:rotate-3 ${colors.iconBg} ${colors.hoverIconBg}`}>
                  <Icon className={`w-5 h-5 transition-colors duration-300 ${colors.icon} ${colors.hoverIcon}`} />
                </div>
              </div>

              <div className="relative z-10 mt-auto pr-8">
                <h3 className={`font-heading text-base sm:text-lg font-bold tracking-tight mb-0.5 transition-colors duration-300 ${colors.title}`}>
                  {title}
                </h3>
                <p className={`text-xs sm:text-sm font-medium transition-colors duration-300 line-clamp-1 ${colors.desc}`}>
                  {description}
                </p>
              </div>

              <div className={`absolute bottom-4 right-4 sm:bottom-5 sm:right-5 transition-all duration-500 transform translate-x-4 motion-reduce:translate-x-0 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 ${isActive ? 'translate-x-0 opacity-100' : ''}`}>
                <ArrowRight className={`w-4 h-4 sm:w-5 sm:h-5 ${colors.icon} ${colors.hoverIcon}`} />
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

import Image from 'next/image';

export function HeroParallax({ children, className, style, bgImage }: { children: React.ReactNode, className?: string, style?: React.CSSProperties, bgImage?: string }) {
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
      {/* Background Layer */}
      {bgImage ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={bgImage}
            alt="About UDBHAV Foundation"
            fill
            className="object-cover"
            priority
          />
          {/* Subtle dark/brand gradient overlay to maintain readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#123f72]/90 via-[#202a7a]/70 to-[#171f69]/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      ) : (
        <div
          className="absolute inset-0 z-0"
          style={{ background: 'linear-gradient(135deg, #171f69 0%, #202a7a 50%, #123f72 100%)' }}
        />
      )}

      {/* Animated Blobs */}
      <div
        className="pointer-events-none absolute -top-32 left-0 h-[400px] w-[400px] rounded-full bg-teal-500/10 blur-[100px] mix-blend-overlay z-0"
        style={{ transform: reducedMotion ? 'none' : `translate(${scrollY * 0.1}px, ${scrollY * 0.2}px)` }}
      />
      <div
        className="pointer-events-none absolute top-1/4 right-0 h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[120px] mix-blend-overlay z-0"
        style={{ transform: reducedMotion ? 'none' : `translate(${-scrollY * 0.15}px, ${scrollY * 0.1}px)` }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 left-1/4 h-[400px] w-[400px] rounded-full bg-impact-green/10 blur-[100px] mix-blend-overlay z-0"
        style={{ transform: reducedMotion ? 'none' : `translate(${scrollY * 0.05}px, ${-scrollY * 0.1}px)` }}
      />
      <div
        className="pointer-events-none absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full bg-amber-500/10 blur-[90px] mix-blend-overlay z-0"
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
