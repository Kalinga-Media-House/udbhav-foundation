'use client';

import React, { useEffect, useState } from 'react';

const TOPICS = [
  { label: 'WHO ARE WE?', id: 'who-we-are' },
  { label: 'WHAT WE DO?', id: 'what-we-do' },
  { label: 'WHEN DID WE START?', id: 'when-did-we-start' },
  { label: 'WHY OUR WORK MATTERS?', id: 'why-our-work-matters' },
];

export function AboutHeroButtons() {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    // Setup intersection observer to track active section
    const observer = new IntersectionObserver(
      (entries) => {
        // Find all intersecting entries
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // If multiple are visible, pick the first one
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

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-row flex-wrap justify-center gap-3 sm:gap-4 md:gap-5">
      {TOPICS.map(({ label, id }, index) => {
        const isActive = activeId === id;
        return (
          <div
            key={id}
            className="animate-hero-buttons"
            style={{ animationDelay: `${300 + index * 100}ms`, animationFillMode: 'both' }}
          >
            <a
              href={`#${id}`}
              onClick={(e) => handleClick(e, id)}
              className={`
                group relative flex items-center justify-center rounded-full px-5 py-2.5 sm:px-6 sm:py-3
                font-heading text-xs sm:text-sm md:text-base font-semibold tracking-wide
                transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
                border shadow-sm hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                ${
                  isActive
                    ? 'bg-impact-green text-udbhav-blue-deep border-impact-green shadow-sm ring-2 ring-impact-green/20'
                    : 'bg-pure-white text-udbhav-blue-deep border-gray-100 hover:border-impact-green/60 hover:text-udbhav-blue-deep'
                }
              `}
              aria-current={isActive ? 'true' : undefined}
            >
              {label}
            </a>
          </div>
        );
      })}
    </div>
  );
}
