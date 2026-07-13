"use client";

import React from "react";
import { HeartHandshake, Sparkles } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { RevealCard } from "@/components/shared/RevealCard";

export function VolunteerPromiseSection() {
  const scrollToForm = () => {
    const elem = document.getElementById("volunteer-application");
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      aria-labelledby="volunteer-promise-heading"
      className="relative w-full py-12 sm:py-16 md:py-20 overflow-hidden border-b border-soft-border/40"
      style={{
        background:
          "linear-gradient(135deg, #12245F 0%, #202B78 50%, #1A387E 100%)",
      }}
    >
      {/* Decorative Radial Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-[#439B25]/20 blur-3xl"
      />

      <Container className="relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <RevealCard as="div" index={0}>
            <span className="eyebrow-label font-heading text-xs sm:text-sm font-bold tracking-widest uppercase inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 text-[#EEF8E9] border border-white/20 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              OUR PROMISE
            </span>
          </RevealCard>

          <RevealCard as="div" index={1}>
            <h2
              id="volunteer-promise-heading"
              className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-pure-white mb-4 leading-[1.18]"
            >
              Small Actions. Shared Purpose. Lasting Change.
            </h2>
          </RevealCard>

          <RevealCard as="div" index={2}>
            <p className="text-sm sm:text-base md:text-lg text-pure-white/90 leading-relaxed mb-6">
              Every hour you contribute, every idea you share, and every person
              you support becomes part of something larger—a community growing
              together with compassion, dignity, and purpose.
            </p>
          </RevealCard>

          {/* Highlighted Quote Box */}
          <RevealCard as="div" index={3} className="mb-8">
            <div className="inline-block p-4 sm:p-5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm max-w-xl mx-auto">
              <p className="font-heading text-base sm:text-lg font-semibold text-[#EEF8E9] leading-snug">
                “You do not have to change the whole world. Begin by changing one
                moment for one person.”
              </p>
            </div>
          </RevealCard>

          <RevealCard as="div" index={4}>
            <button
              type="button"
              onClick={scrollToForm}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-heading font-semibold text-sm sm:text-base text-[#12245F] bg-[#EEF8E9] transition-all duration-300 shadow-lg hover:bg-pure-white hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
            >
              <HeartHandshake className="w-5 h-5 text-[#439B25]" />
              <span>Join the UDBHAV Community</span>
            </button>
          </RevealCard>
        </div>
      </Container>
    </section>
  );
}

export default VolunteerPromiseSection;
