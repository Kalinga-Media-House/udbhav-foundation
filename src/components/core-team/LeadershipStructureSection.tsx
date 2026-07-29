"use client";

import { ArrowDown } from "lucide-react";
import React from "react";

import { Container } from "@/components/shared/Container";
import { RevealCard } from "@/components/shared/RevealCard";

const STRUCTURE_LEVELS = [
  {
    level: "Founder & Co-Founder",
    role: "Vision, Strategic Philosophy & Core Purpose",
  },
  {
    level: "Executive Leadership",
    role: "Governance, Institutional Partnerships & Operations",
  },
  {
    level: "Programme, Project & Operations Leads",
    role: "Initiative Execution, Monitoring & Regional Coordination",
  },
  {
    level: "Volunteer and Community Coordinators",
    role: "Grassroots Engagement, Mobilization & Youth Wing",
  },
  {
    level: "Advisory Board & Strategic Guidance",
    role: "Policy Advisory, Mentorship & Sectoral Expertise",
  },
];

export function LeadershipStructureSection() {
  return (
    <section
      aria-labelledby="leadership-structure-heading"
      className="relative w-full overflow-hidden bg-gradient-to-b from-pure-white via-[#FDFCF8] to-warm-white py-12 sm:py-16 md:py-20 border-b border-soft-border/40"
    >
      <Container>
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-14">
          <RevealCard as="div" index={0}>
            <span className="eyebrow-label text-impact-green font-heading text-xs sm:text-sm font-bold tracking-widest uppercase block mb-2">
              ORGANIZATIONAL ARCHITECTURE
            </span>
            <h2
              id="leadership-structure-heading"
              className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-udbhav-blue-deep tracking-tight"
            >
              Working Together for Meaningful Impact
            </h2>
          </RevealCard>
        </div>

        {/* Clean Connected Structured Hierarchy */}
        <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
          {STRUCTURE_LEVELS.map((item, idx) => (
            <React.Fragment key={item.level}>
              <RevealCard as="div" index={idx + 1}>
                <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-pure-white via-[#FDFCF8] to-soft-green/20 border border-impact-green/25 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-6">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-soft-green/70 border border-impact-green/30 text-impact-green font-heading font-bold text-sm flex items-center justify-center shrink-0">
                      0{idx + 1}
                    </span>
                    <h3 className="font-heading font-bold text-base sm:text-lg text-udbhav-blue-deep tracking-tight">
                      {item.level}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-text-secondary font-medium sm:text-right">
                    {item.role}
                  </p>
                </div>
              </RevealCard>

              {/* Connected Arrow Divider (except after final level) */}
              {idx < STRUCTURE_LEVELS.length - 1 && (
                <div className="flex justify-center py-0.5">
                  <ArrowDown className="w-5 h-5 text-impact-green/70 animate-pulse" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default LeadershipStructureSection;
