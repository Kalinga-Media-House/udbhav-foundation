"use client";

import React from "react";
import { Ear, ShieldCheck, Users2, Leaf } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { RevealCard } from "@/components/shared/RevealCard";

const APPROACH_CARDS = [
  {
    title: "LISTEN DEEPLY",
    description:
      "We understand communities, challenges, and lived experiences before designing solutions.",
    icon: Ear,
  },
  {
    title: "ACT RESPONSIBLY",
    description:
      "We transform awareness into ethical, practical, and measurable grassroots action.",
    icon: ShieldCheck,
  },
  {
    title: "GROW TOGETHER",
    description:
      "We collaborate with communities, volunteers, institutions, and partners to create shared progress.",
    icon: Users2,
  },
  {
    title: "BUILD FOR THE FUTURE",
    description:
      "We focus on sustainable outcomes that continue creating value beyond immediate interventions.",
    icon: Leaf,
  },
];

export function OurApproachSection() {
  return (
    <section
      aria-labelledby="our-approach-heading"
      className="relative w-full overflow-hidden bg-gradient-to-b from-pure-white via-[#FDFCF8] to-warm-white py-12 sm:py-16 md:py-20 border-b border-soft-border/40"
    >
      <Container>
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-14">
          <RevealCard as="div" index={0}>
            <span className="eyebrow-label text-impact-green font-heading text-xs sm:text-sm font-bold tracking-widest uppercase block mb-2">
              METHODOLOGY
            </span>
            <h2
              id="our-approach-heading"
              className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-udbhav-blue-deep tracking-tight"
            >
              How We Create Meaningful Change
            </h2>
          </RevealCard>
        </div>

        {/* 4 Compact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {APPROACH_CARDS.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <RevealCard
                key={item.title}
                as="div"
                index={idx + 1}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-pure-white via-[#FDFCF8] to-soft-green/20 border border-impact-green/20 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-soft-green/60 border border-impact-green/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <IconComponent className="w-6 h-6 text-impact-green" />
                  </div>
                  <h3 className="font-heading font-bold text-base sm:text-lg text-udbhav-blue-deep tracking-tight mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-text-primary leading-relaxed">
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
