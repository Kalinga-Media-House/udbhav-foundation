'use client';

import React from 'react';

import { Container } from '@/components/shared/Container';
import { RevealCard } from '@/components/shared/RevealCard';

const STAT_ITEMS = [
  {
    value: '2020',
    label: 'Established',
  },
  {
    value: '250 to 300',
    label: 'Active Members',
  },
  {
    value: '2',
    label: 'Operational Branches',
  },
  {
    value: '11',
    label: 'Major Initiatives',
  },
];

export function AboutOverviewSection() {
  return (
    <section
      aria-labelledby="about-overview-heading"
      className="via-pure-white to-warm-white border-soft-border/40 relative w-full overflow-hidden border-b bg-gradient-to-b from-[#FDFCF8] py-12 sm:py-16 md:py-20"
    >
      <Container>
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: About UDBHAV Narrative */}
          <div className="space-y-4 sm:space-y-5 lg:col-span-7">
            <RevealCard as="div" index={0}>
              <span className="eyebrow-label text-impact-green mb-2 block font-heading text-xs font-bold uppercase tracking-widest sm:text-sm">
                WHO WE ARE
              </span>
              <h2
                id="about-overview-heading"
                className="text-udbhav-blue-deep font-heading text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl"
              >
                About UDBHAV
              </h2>
            </RevealCard>

            <RevealCard
              as="div"
              index={1}
              className="text-text-primary space-y-4 text-base leading-relaxed sm:text-lg"
            >
              <p>
                We started Udbhav Foundation in 2020 because we care deeply about our community. Our
                goal is simple. We want to create a world where everyone belongs, people look out
                for one another, and everyone has the chance to thrive. We focus on education,
                protecting our environment, and celebrating our shared culture.
              </p>
              <p>
                Over the years, our small family has grown into a wonderful community of around 300
                active members. We are students, professionals, and everyday people from all walks
                of life, brought together by a shared desire to make a difference.
              </p>
              <p>
                From our homes in Bhubaneswar and Khordha, we work hand in hand with neighborhoods
                across both cities and villages. Whether we are running awareness campaigns or
                organizing support programs, our heart is always in building stronger, more
                connected communities.
              </p>
            </RevealCard>
          </div>

          {/* Right Column: Compact Impact Stat Cards */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              {STAT_ITEMS.map((stat, idx) => (
                <RevealCard
                  key={stat.label}
                  as="div"
                  index={idx + 2}
                  className="from-pure-white to-soft-green/30 border-impact-green/20 group relative overflow-hidden rounded-xl border bg-gradient-to-br via-[#FDFCF8] p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:rounded-2xl sm:p-6"
                >
                  <div
                    aria-hidden="true"
                    className="bg-impact-green pointer-events-none absolute left-0 top-0 h-full w-1.5 rounded-l-xl opacity-80"
                  />
                  <div className="text-udbhav-blue-deep mb-1 font-heading text-2xl font-bold tracking-tight sm:text-3xl md:text-[34px]">
                    {stat.value}
                  </div>
                  <div className="text-text-secondary group-hover:text-impact-green text-xs font-medium transition-colors sm:text-sm">
                    {stat.label}
                  </div>
                </RevealCard>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default AboutOverviewSection;
