"use client";

import React from "react";
import { Container } from "@/components/shared/Container";
import { RevealCard } from "@/components/shared/RevealCard";

const STAT_ITEMS = [
  {
    value: "2020",
    label: "Established",
  },
  {
    value: "250–300",
    label: "Active Members",
  },
  {
    value: "2",
    label: "Operational Branches",
  },
  {
    value: "11",
    label: "Major Initiatives",
  },
];

export function AboutOverviewSection() {
  return (
    <section
      aria-labelledby="about-overview-heading"
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#FDFCF8] via-pure-white to-warm-white py-12 sm:py-16 md:py-20 border-b border-soft-border/40"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: About UDBHAV Narrative */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            <RevealCard as="div" index={0}>
              <span className="eyebrow-label text-impact-green font-heading text-xs sm:text-sm font-bold tracking-widest uppercase block mb-2">
                WHO WE ARE
              </span>
              <h2
                id="about-overview-heading"
                className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-udbhav-blue-deep tracking-tight"
              >
                About UDBHAV
              </h2>
            </RevealCard>

            <RevealCard
              as="div"
              index={1}
              className="space-y-4 text-base sm:text-lg text-text-primary leading-relaxed"
            >
              <p>
                UDBHAV is a community-rooted non-profit organization established
                in 2020, with a core mission to promote inclusivity, compassion,
                and empowerment through education, environment, and cultural
                initiatives.
              </p>
              <p>
                Since its inception, UDBHAV has flourished into a vibrant
                collective of 250–300 active members, including professionals,
                student volunteers, and changemakers from various backgrounds.
              </p>
              <p>
                With operational branches in Bhubaneswar and Khordha, we are
                deeply engaged in community development, awareness drives, and
                social inclusion programmes across urban and rural areas.
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
                  className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-pure-white via-[#FDFCF8] to-soft-green/30 border border-impact-green/20 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute top-0 left-0 w-1.5 h-full bg-impact-green rounded-l-xl opacity-80"
                  />
                  <div className="text-2xl sm:text-3xl md:text-[34px] font-heading font-bold text-udbhav-blue-deep tracking-tight mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-text-secondary group-hover:text-impact-green transition-colors">
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
