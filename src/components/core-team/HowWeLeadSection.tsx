"use client";

import { Ear, Users2, Zap, CheckCircle2 } from "lucide-react";
import React from "react";

import { Container } from "@/components/shared/Container";
import { RevealCard } from "@/components/shared/RevealCard";

const LEADERSHIP_CARDS = [
  {
    title: "LISTEN",
    description:
      "We listen closely to communities, volunteers, partners, and lived experiences before making decisions.",
    icon: Ear,
    accentClass: "from-pure-white via-[#FDFCF8] to-soft-green/25",
  },
  {
    title: "COLLABORATE",
    description:
      "We combine diverse knowledge, skills, and perspectives to create stronger and more inclusive solutions.",
    icon: Users2,
    accentClass: "from-pure-white via-[#FDFCF8] to-udbhav-blue-deep/5",
  },
  {
    title: "ACT",
    description:
      "We turn ideas and awareness into responsible, measurable, and meaningful action.",
    icon: Zap,
    accentClass: "from-pure-white via-[#FDFCF8] to-soft-green/25",
  },
  {
    title: "STAY ACCOUNTABLE",
    description:
      "We remain transparent and responsible for the outcomes and long-term impact of our work.",
    icon: CheckCircle2,
    accentClass: "from-pure-white via-[#FDFCF8] to-udbhav-blue-deep/5",
  },
];

export function HowWeLeadSection() {
  return (
    <section
      aria-labelledby="how-we-lead-heading"
      className="relative w-full overflow-hidden bg-gradient-to-b from-pure-white via-[#FDFCF8] to-warm-white py-12 sm:py-16 md:py-20 border-b border-soft-border/40"
    >
      <Container>
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-14">
          <RevealCard as="div" index={0}>
            <span className="eyebrow-label text-impact-green font-heading text-xs sm:text-sm font-bold tracking-widest uppercase block mb-2">
              OUR LEADERSHIP APPROACH
            </span>
            <h2
              id="how-we-lead-heading"
              className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-udbhav-blue-deep tracking-tight"
            >
              Leadership Rooted in Service
            </h2>
          </RevealCard>
        </div>

        {/* 2-Column Desktop / 1-Column Mobile Grid */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {LEADERSHIP_CARDS.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <RevealCard
                key={item.title}
                as="div"
                index={idx + 1}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${item.accentClass} border border-impact-green/20 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex items-start gap-4 sm:gap-5`}
              >
                <div className="w-12 h-12 rounded-xl bg-soft-green/60 border border-impact-green/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <IconComponent className="w-6 h-6 text-impact-green" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base sm:text-lg text-udbhav-blue-deep tracking-tight mb-1.5">
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

export default HowWeLeadSection;
