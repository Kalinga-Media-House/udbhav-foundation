'use client';

import { Eye, Target, Sparkles } from 'lucide-react';
import React from 'react';

import { Container } from '@/components/shared/Container';
import { RevealCard } from '@/components/shared/RevealCard';

export function AboutVisionMissionSection() {
  return (
    <section
      aria-labelledby="about-vision-mission-heading"
      className="from-pure-white to-warm-white border-soft-border/40 relative w-full overflow-hidden border-b bg-gradient-to-b via-[#FDFCF8] py-12 sm:py-16 md:py-20"
    >
      <Container>
        {/* Section Header */}
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <RevealCard as="div" index={0}>
            <span className="eyebrow-label text-impact-green mb-2 block font-heading text-xs font-bold uppercase tracking-widest sm:text-sm">
              GUIDING PRINCIPLES
            </span>
            <h2
              id="about-vision-mission-heading"
              className="text-udbhav-blue-deep font-heading text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl"
            >
              Our Vision & Mission
            </h2>
          </RevealCard>
        </div>

        {/* Stacked Compact Horizontal Cards */}
        <div className="mx-auto max-w-4xl space-y-6 sm:space-y-8">
          {/* CARD 1: VISION */}
          <RevealCard
            as="div"
            index={1}
            className="from-pure-white to-soft-green/25 border-impact-green/25 group relative overflow-hidden rounded-2xl border bg-gradient-to-br via-[#FDFCF8] p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:rounded-3xl sm:p-8"
          >
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:gap-8">
              {/* Icon Side */}
              <div className="bg-soft-green/60 border-impact-green/30 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border sm:h-16 sm:w-16">
                <Eye className="text-impact-green h-7 w-7 sm:h-8 sm:w-8" />
              </div>

              {/* Content Side */}
              <div className="flex-1 space-y-2">
                <span className="eyebrow-label text-impact-green block font-heading text-xs font-bold uppercase tracking-widest">
                  OUR VISION
                </span>
                <h3 className="text-udbhav-blue-deep font-heading text-xl font-bold tracking-tight sm:text-2xl">
                  A Future Where Everyone Can Thrive
                </h3>
                <p className="text-text-primary pt-1 text-sm leading-relaxed sm:text-base">
                  To build a world where every person feels heard, where everyone has the chance to
                  learn and grow, and where our communities live in harmony with nature. We want to
                  help create a future that is compassionate, conscious, and sustainable.
                </p>
              </div>
            </div>
          </RevealCard>

          {/* CARD 2: MISSION */}
          <RevealCard
            as="div"
            index={2}
            className="from-pure-white to-soft-green/25 border-impact-green/25 group relative overflow-hidden rounded-2xl border bg-gradient-to-br via-[#FDFCF8] p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:rounded-3xl sm:p-8"
          >
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:gap-8">
              {/* Icon Side */}
              <div className="bg-soft-green/60 border-impact-green/30 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border sm:h-16 sm:w-16">
                <Target className="text-impact-green h-7 w-7 sm:h-8 sm:w-8" />
              </div>

              {/* Content Side */}
              <div className="flex-1 space-y-3">
                <div>
                  <span className="eyebrow-label text-impact-green mb-1 block font-heading text-xs font-bold uppercase tracking-widest">
                    OUR MISSION
                  </span>
                  <h3 className="text-udbhav-blue-deep font-heading text-xl font-bold tracking-tight sm:text-2xl">
                    Turning Awareness into Meaningful Action
                  </h3>
                </div>

                <div className="text-text-primary space-y-2.5 text-sm leading-relaxed sm:text-base">
                  <p>
                    Our mission is to create real, lasting change by supporting mental well-being,
                    making quality education available to more children, and taking care of our
                    environment.
                  </p>
                  <p>
                    We work closely with local neighborhoods to turn good ideas into daily actions.
                    By breaking down barriers and opening new doors, we hope to inspire people to
                    step up and help build a better world together.
                  </p>
                </div>

                {/* Highlight box */}
                <div className="bg-soft-green/50 border-impact-green/30 text-udbhav-blue-deep mt-3 inline-flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-xs font-semibold sm:text-sm">
                  <Sparkles className="text-impact-green h-4 w-4 shrink-0" />
                  <span>
                    We believe lasting change begins by listening to people, understanding their
                    needs, and working together to build a better future.
                  </span>
                </div>
              </div>
            </div>
          </RevealCard>
        </div>
      </Container>
    </section>
  );
}

export default AboutVisionMissionSection;
