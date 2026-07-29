"use client";

import { Compass, ShieldCheck, Users } from "lucide-react";
import React from "react";

import { Container } from "@/components/shared/Container";
import { RevealCard } from "@/components/shared/RevealCard";

const PRINCIPLE_CARDS = [
  {
    title: "PURPOSE",
    description:
      "Every decision begins with the people and communities we serve.",
    icon: Compass,
  },
  {
    title: "RESPONSIBILITY",
    description:
      "We lead with transparency, accountability, and a commitment to meaningful outcomes.",
    icon: ShieldCheck,
  },
  {
    title: "COLLABORATION",
    description:
      "We bring together diverse experiences and perspectives to create sustainable change.",
    icon: Users,
  },
];

export function LeadershipIntroSection() {
  return (
    <section
      aria-labelledby="leadership-intro-heading"
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#FDFCF8] via-pure-white to-warm-white py-12 sm:py-16 md:py-20 border-b border-soft-border/40"
    >
      <Container>
        {/* Centered Introduction */}
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
          <RevealCard as="div" index={0}>
            <span className="eyebrow-label text-impact-green font-heading text-xs sm:text-sm font-bold tracking-widest uppercase block mb-2">
              LEADERSHIP WITH PURPOSE
            </span>
            <h2
              id="leadership-intro-heading"
              className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-udbhav-blue-deep tracking-tight mb-4"
            >
              Guided by Vision. United by Responsibility.
            </h2>
          </RevealCard>

          <RevealCard as="div" index={1}>
            <p className="text-base sm:text-lg text-text-primary leading-relaxed">
              UDBHAV Foundation is strengthened by a diverse leadership
              community of changemakers, professionals, coordinators,
              volunteers, and advisors. Together, they provide strategic
              direction, strengthen programmes, encourage collaboration, and
              ensure that every initiative remains connected to the needs of the
              communities we serve.
            </p>
          </RevealCard>
        </div>

        {/* 3 Compact Principle Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {PRINCIPLE_CARDS.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <RevealCard
                key={item.title}
                as="div"
                index={idx + 2}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-pure-white via-[#FDFCF8] to-soft-green/20 border border-impact-green/20 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col items-start"
              >
                <div className="w-12 h-12 rounded-xl bg-soft-green/60 border border-impact-green/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <IconComponent className="w-6 h-6 text-impact-green" />
                </div>
                <h3 className="font-heading font-bold text-lg text-udbhav-blue-deep tracking-tight mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-text-primary leading-relaxed">
                  {item.description}
                </p>
              </RevealCard>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export default LeadershipIntroSection;
