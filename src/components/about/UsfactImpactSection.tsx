"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { RevealCard } from "@/components/shared/RevealCard";

const CONTRIBUTIONS = [
  "Organizing events and campaigns",
  "Conducting surveys and research",
  "Managing outreach and engagement",
  "Supporting execution of programmes on the ground",
];

export function UsfactImpactSection() {
  return (
    <section
      aria-labelledby="usfact-impact-heading"
      className="relative w-full overflow-hidden bg-gradient-to-b from-warm-white via-[#FDFCF8] to-pure-white py-12 sm:py-16 md:py-20 border-b border-soft-border/40"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: USFACT Narrative & Logo */}
          <div className="lg:col-span-7 space-y-5">
            <RevealCard as="div" index={0}>
              <span className="eyebrow-label text-impact-green font-heading text-xs sm:text-sm font-bold tracking-widest uppercase block mb-2">
                STUDENT FRONT
              </span>
              <h2
                id="usfact-impact-heading"
                className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-udbhav-blue-deep tracking-tight"
              >
                USFACT & Community Impact
              </h2>
            </RevealCard>

            <RevealCard as="div" index={1}>
              <p className="text-base sm:text-lg text-text-primary leading-relaxed">
                A unique strength of UDBHAV is its student front,{" "}
                <strong className="font-semibold text-udbhav-blue-deep">
                  USFACT (Udbhav Student Front for Action, Change, and
                  Transformation)
                </strong>
                —a dynamic youth wing that plays a critical role in organizing
                events, conducting surveys, coordinating outreach, and managing
                ground-level execution.
              </p>
            </RevealCard>

            {/* USFACT Logo Banner */}
            <RevealCard as="div" index={2} className="pt-2">
              <div className="inline-flex items-center gap-4 p-3.5 sm:p-4 rounded-xl bg-pure-white border border-impact-green/20 shadow-sm">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0">
                  <Image
                    src="/brand/usfact-logo.png"
                    alt="USFACT - Udbhav Student Front for Action, Change, and Transformation"
                    fill
                    sizes="80px"
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm sm:text-base text-udbhav-blue-deep">
                    USFACT Youth Wing
                  </h3>
                  <p className="text-xs sm:text-sm text-impact-green font-medium">
                    Driving Grassroots Youth Action Across Odisha
                  </p>
                </div>
              </div>
            </RevealCard>
          </div>

          {/* Right Column: Role & Contributions Card */}
          <div className="lg:col-span-5">
            <RevealCard
              as="div"
              index={3}
              className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-pure-white via-[#FDFCF8] to-soft-green/25 border border-impact-green/25 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-0 left-0 w-2 h-full bg-impact-green rounded-l-2xl opacity-80"
              />
              <span className="eyebrow-label text-impact-green font-heading text-xs font-bold tracking-widest uppercase block mb-3">
                KEY RESPONSIBILITIES
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-udbhav-blue-deep tracking-tight mb-5">
                Role & Contributions
              </h3>

              <ul className="space-y-3.5">
                {CONTRIBUTIONS.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-impact-green shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-text-primary font-medium leading-snug">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </RevealCard>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default UsfactImpactSection;
