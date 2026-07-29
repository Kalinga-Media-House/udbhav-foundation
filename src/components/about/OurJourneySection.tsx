"use client";

import { Flag, Users, Globe, Award } from "lucide-react";
import React from "react";

import { Container } from "@/components/shared/Container";
import { RevealCard } from "@/components/shared/RevealCard";

const MILESTONES = [
  {
    stage: "2020",
    title: "Foundation & Inception",
    description:
      "UDBHAV Foundation was established with a commitment to education, inclusion, environmental responsibility, and community empowerment.",
    icon: Flag,
  },
  {
    stage: "Growing Community",
    title: "Collective Movement",
    description:
      "Professionals, volunteers, students, and changemakers joined together to build a purpose-driven community.",
    icon: Users,
  },
  {
    stage: "Expanding Impact",
    title: "Regional & Grassroots Reach",
    description:
      "Community programmes expanded across Bhubaneswar, Khordha, urban communities, and rural communities.",
    icon: Globe,
  },
  {
    stage: "Today",
    title: "Measurable Action",
    description:
      "UDBHAV continues transforming awareness into meaningful and measurable grassroots action.",
    icon: Award,
  },
];

export function OurJourneySection() {
  return (
    <section
      aria-labelledby="our-journey-heading"
      className="relative w-full overflow-hidden bg-gradient-to-b from-warm-white via-[#FDFCF8] to-pure-white py-12 sm:py-16 md:py-20 border-b border-soft-border/40"
    >
      <Container>
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-14">
          <RevealCard as="div" index={0}>
            <span className="eyebrow-label text-impact-green font-heading text-xs sm:text-sm font-bold tracking-widest uppercase block mb-2">
              OUR PATH
            </span>
            <h2
              id="our-journey-heading"
              className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-udbhav-blue-deep tracking-tight"
            >
              Our Journey
            </h2>
          </RevealCard>
        </div>

        {/* Compact Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Center Line (Desktop) & Left Line (Mobile) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-4 sm:left-1/2 top-4 bottom-4 w-0.5 -translate-x-1/2 bg-gradient-to-b from-impact-green/40 via-udbhav-blue-deep/30 to-impact-green/40"
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
                  className={`relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 ${
                    isEven ? "sm:flex-row-reverse" : ""
                  }`}
                >
                  {/* Half Width Content Card */}
                  <div className="w-full sm:w-1/2 pl-10 sm:pl-0">
                    <div
                      className={`group rounded-xl sm:rounded-2xl bg-gradient-to-br from-pure-white via-[#FDFCF8] to-soft-green/20 border border-impact-green/20 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 ${
                        isEven ? "sm:mr-8 sm:text-right" : "sm:ml-8 sm:text-left"
                      }`}
                    >
                      <div
                        className={`inline-block px-2.5 py-0.5 rounded-full bg-soft-green/70 text-impact-green font-heading text-xs font-bold tracking-wider mb-2`}
                      >
                        {item.stage}
                      </div>
                      <p className="text-sm sm:text-base text-text-primary leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Node Circle */}
                  <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-pure-white border-2 border-impact-green shadow-sm flex items-center justify-center z-10">
                    <IconComponent
                      aria-hidden="true"
                      className="w-4 h-4 text-udbhav-blue-deep"
                    />
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
