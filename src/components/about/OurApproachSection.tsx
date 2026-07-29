'use client';

import { Ear, ShieldCheck, Users2, Leaf } from 'lucide-react';
import React from 'react';

import { Container } from '@/components/shared/Container';
import { RevealCard } from '@/components/shared/RevealCard';

const APPROACH_CARDS = [
  {
    title: 'Listen Deeply',
    description:
      "We take the time to hear people's stories and understand what they truly need before we offer help.",
    icon: Ear,
  },
  {
    title: 'Act Responsibly',
    description:
      'We turn good intentions into honest, practical actions that make a genuine difference on the ground.',
    icon: ShieldCheck,
  },
  {
    title: 'Grow Together',
    description:
      'We believe that by working side by side with local families and volunteers, we all become stronger.',
    icon: Users2,
  },
  {
    title: 'Build for the Future',
    description:
      'Everything we do is designed to create lasting benefits that will support our communities for years to come.',
    icon: Leaf,
  },
];

export function OurApproachSection() {
  return (
    <section
      aria-labelledby="our-approach-heading"
      className="from-pure-white to-warm-white border-soft-border/40 relative w-full overflow-hidden border-b bg-gradient-to-b via-[#FDFCF8] py-12 sm:py-16 md:py-20"
    >
      <Container>
        {/* Section Header */}
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <RevealCard as="div" index={0}>
            <span className="eyebrow-label text-impact-green mb-2 block font-heading text-xs font-bold uppercase tracking-widest sm:text-sm">
              METHODOLOGY
            </span>
            <h2
              id="our-approach-heading"
              className="text-udbhav-blue-deep font-heading text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl"
            >
              How We Create Meaningful Change
            </h2>
          </RevealCard>
        </div>

        {/* 4 Compact Cards Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {APPROACH_CARDS.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <RevealCard
                key={item.title}
                as="div"
                index={idx + 1}
                className="from-pure-white to-soft-green/20 border-impact-green/20 group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-gradient-to-br via-[#FDFCF8] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div>
                  <div className="bg-soft-green/60 border-impact-green/30 mb-4 flex h-12 w-12 items-center justify-center rounded-xl border transition-transform group-hover:scale-105">
                    <IconComponent className="text-impact-green h-6 w-6" />
                  </div>
                  <h3 className="text-udbhav-blue-deep mb-2 font-heading text-base font-bold tracking-tight sm:text-lg">
                    {item.title}
                  </h3>
                  <p className="text-text-primary text-xs leading-relaxed sm:text-sm">
                    {item.description}
                  </p>
                </div>
              </RevealCard>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export default OurApproachSection;
