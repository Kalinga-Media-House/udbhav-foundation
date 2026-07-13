"use client";

import React from "react";
import { CheckCircle2, Heart } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { RevealCard } from "@/components/shared/RevealCard";

const CHECKLIST_ITEMS = [
  "School and college students",
  "University students and researchers",
  "Teachers and educators",
  "Working professionals",
  "Retired professionals",
  "Artists and content creators",
  "Healthcare professionals",
  "Technology professionals",
  "Community leaders",
  "Anyone committed to responsible social action",
];

export function WhoCanJoinSection() {
  return (
    <section
      aria-labelledby="who-can-join-heading"
      className="relative w-full py-12 sm:py-16 md:py-20 bg-gradient-to-b from-pure-white via-[#FDFCF8] to-pure-white border-b border-soft-border/40"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Heading & Narrative */}
          <div className="lg:col-span-5 flex flex-col justify-center text-center lg:text-left">
            <RevealCard as="div" index={0}>
              <span
                className="eyebrow-label font-heading text-xs sm:text-sm font-bold tracking-widest uppercase block mb-2"
                style={{ color: "#439B25" }}
              >
                INCLUSIVE IMPACT
              </span>
              <h2
                id="who-can-join-heading"
                className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4 leading-[1.15]"
                style={{ color: "#12245F" }}
              >
                Everyone Has Something Valuable to Contribute
              </h2>
            </RevealCard>

            <RevealCard as="div" index={1}>
              <p
                className="text-sm sm:text-base leading-relaxed mb-6"
                style={{ color: "#5E6B63" }}
              >
                You do not need years of experience to create change. If you are
                willing to learn, collaborate, act responsibly, and serve with
                compassion, you already have something valuable to offer.
              </p>
            </RevealCard>

            {/* Highlighted Note Box */}
            <RevealCard as="div" index={2}>
              <div
                className="inline-flex items-start gap-3 p-4 sm:p-5 rounded-2xl border border-[#439B25]/30 shadow-sm"
                style={{ background: "#EEF8E9" }}
              >
                <Heart className="w-5 h-5 text-[#439B25] shrink-0 mt-0.5" />
                <p
                  className="font-heading text-xs sm:text-sm font-semibold leading-snug"
                  style={{ color: "#12245F" }}
                >
                  “Skills are valuable. Commitment, compassion, and
                  responsibility are essential.”
                </p>
              </div>
            </RevealCard>
          </div>

          {/* Right Column: Compact Checklist Card */}
          <div className="lg:col-span-7">
            <RevealCard as="div" index={1}>
              <div
                className="rounded-3xl p-6 sm:p-8 border border-[#12245F]/15 shadow-md"
                style={{ background: "#FFFFFF" }}
              >
                <h3
                  className="font-heading text-lg sm:text-xl font-bold mb-5 pb-3 border-b border-soft-border/50"
                  style={{ color: "#12245F" }}
                >
                  Who We Welcome
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {CHECKLIST_ITEMS.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#EEF8E9]/50 transition-colors"
                    >
                      <CheckCircle2 className="w-5 h-5 text-[#439B25] shrink-0" />
                      <span
                        className="text-xs sm:text-sm font-medium"
                        style={{ color: "#17231D" }}
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </RevealCard>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default WhoCanJoinSection;
