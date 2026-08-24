'use client';

import { Flag, Users, Globe, Award } from 'lucide-react';
import React from 'react';

import { Container } from '@/components/shared/Container';
import { RevealCard } from '@/components/shared/RevealCard';

const MILESTONES = [
  {
    stage: '2020',
    title: 'Foundation & Inception',
    description:
      'We started Udbhav Foundation with a simple promise: to help children learn, protect nature, and uplift our neighborhoods.',
    icon: Flag,
  },
  {
    stage: 'Growing Community',
    title: 'Collective Movement',
    description:
      'People from all walks of life, including students, professionals, and local volunteers, came together because we believed in making a real difference.',
    icon: Users,
  },
  {
    stage: 'Expanding Impact',
    title: 'Regional & Grassroots Reach',
    description:
      'Our work grew beyond our first few neighborhoods, reaching families across Bhubaneswar, Khordha, and surrounding villages.',
    icon: Globe,
  },
  {
    stage: 'Today',
    title: 'Measurable Action',
    description:
      'Today, our family continues to turn caring ideas into hands-on actions that help real people every single day.',
    icon: Award,
  },
];

export function OurJourneySection() {
  return (
    <section
      aria-labelledby="our-journey-heading"
      className="from-warm-white to-pure-white border-soft-border/40 relative w-full overflow-hidden border-b bg-gradient-to-b via-[#FDFCF8] py-12 sm:py-16 md:py-20"
    >
      <Container>
        {/* Section Header */}
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <RevealCard as="div" index={0}>
            <span className="eyebrow-label text-impact-green mb-2 block font-heading text-xs font-bold uppercase tracking-widest sm:text-sm">
              OUR PATH
            </span>
            <h2
              id="our-journey-heading"
              className="text-udbhav-blue-deep font-heading text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl"
            >
              Our Journey
            </h2>
          </RevealCard>
        </div>

        {/* Compact Timeline */}
        <div className="relative mx-auto max-w-4xl">
          {/* Vertical Center Line (Desktop) & Left Line (Mobile) */}
          <div
            aria-hidden="true"
            className="from-impact-green/40 via-udbhav-blue-deep/30 to-impact-green/40 pointer-events-none absolute bottom-4 left-4 top-4 w-0.5 -translate-x-1/2 bg-gradient-to-b sm:left-1/2"
          />

          <div className="space-y-6 sm:space-y-8">
            {MILESTONES.map((item, index) => {
              const IconComponent = item.icon;
              const isEven = index % 2 === 0;

              return (
                <RevealCard
                  key={item.stage}
                  as="div"
                  index={index + 1}
                  className={`relative flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-8 ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  }`}
                >
                  {/* Half Width Content Card */}
                  <div className="w-full pl-10 sm:w-1/2 sm:pl-0">
                    <div
                      className={`from-pure-white to-soft-green/20 border-impact-green/20 group rounded-xl border bg-gradient-to-br via-[#FDFCF8] p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:rounded-2xl sm:p-5 ${
                        isEven ? 'sm:mr-8 sm:text-right' : 'sm:ml-8 sm:text-left'
                      }`}
                    >
                      <div
                        className={`bg-soft-green/70 text-impact-green mb-2 inline-block rounded-full px-2.5 py-0.5 font-heading text-xs font-bold tracking-wider`}
                      >
                        {item.stage}
                      </div>
                      <p className="text-text-primary text-sm leading-relaxed sm:text-base">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Node Circle */}
                  <div className="bg-pure-white border-impact-green absolute left-4 z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border-2 shadow-sm sm:left-1/2">
                    <IconComponent aria-hidden="true" className="text-udbhav-blue-deep h-4 w-4" />
                  </div>

                  {/* Empty Spacer Half on Desktop */}
                  <div className="hidden sm:block sm:w-1/2" />
                </RevealCard>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default OurJourneySection;
