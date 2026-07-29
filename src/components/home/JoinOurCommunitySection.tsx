"use client";

import { HeartHandshake, ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

import { RevealCard } from "@/components/shared/RevealCard";

export function JoinOurCommunitySection() {
  return (
    <section
      aria-labelledby="join-community-heading"
      className="relative w-full overflow-hidden bg-gradient-to-b from-warm-white via-pure-white to-[#FDFCF8] py-14 sm:py-16 md:py-20 lg:py-24 border-b border-soft-border/40"
    >
      {/* Non-interactive subtle decorative green blur & background elements */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[350px] rounded-full bg-impact-green/5 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-10 w-[350px] h-[350px] rounded-full bg-soft-green/40 blur-3xl"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealCard
          as="div"
          index={0}
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-pure-white via-pure-white to-soft-green/25 border border-impact-green/25 shadow-xl shadow-impact-green/5 p-6 sm:p-8 md:p-10 lg:p-12"
        >
          {/* Subtle Decorative Accent Glow Inside Card */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-impact-green/10 blur-2xl"
          />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-12">
            {/* Left Column: 65% - 70% Text Content */}
            <div className="lg:max-w-2xl text-left">
              {/* 1. Small Section Label */}
              <span className="inline-block eyebrow-label text-impact-green font-heading text-xs sm:text-sm font-bold tracking-widest uppercase mb-2.5">
                TOGETHER, WE CREATE CHANGE
              </span>

              {/* 2. Main Heading */}
              <h2
                id="join-community-heading"
                className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-udbhav-blue-deep tracking-tight mb-4"
              >
                Join Our Community
              </h2>

              {/* 3. Emotional Caption */}
              <p className="text-base sm:text-lg lg:text-xl text-text-primary leading-relaxed mb-4">
                Every meaningful change begins when someone{" "}
                <strong className="font-semibold text-udbhav-blue-deep">
                  chooses to care
                </strong>
                . Join a community where your ideas, time and compassion can{" "}
                <strong className="font-semibold text-udbhav-blue-deep">
                  create opportunities
                </strong>
                ,{" "}
                <strong className="font-semibold text-impact-green">
                  inspire hope
                </strong>{" "}
                and make a{" "}
                <strong className="font-semibold text-udbhav-blue-deep">
                  lasting difference
                </strong>
                .
              </p>

              {/* 4. Supporting Line */}
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed mb-5">
                You do not have to change the world alone.{" "}
                <strong className="font-semibold text-udbhav-blue-deep">
                  Together
                </strong>
                , our small actions can become a powerful force for a more
                inclusive, compassionate and sustainable future.
              </p>

              {/* Inline Community Impact Details */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm font-heading font-semibold text-impact-green tracking-wide">
                <span>Ideas</span>
                <span aria-hidden="true" className="text-text-secondary/40">
                  •
                </span>
                <span>Compassion</span>
                <span aria-hidden="true" className="text-text-secondary/40">
                  •
                </span>
                <span>Action</span>
                <span aria-hidden="true" className="text-text-secondary/40">
                  •
                </span>
                <span>Impact</span>
              </div>
            </div>

            {/* Right Column: 30% - 35% Compact CTA Area */}
            <div className="lg:w-auto shrink-0 flex flex-col items-stretch sm:items-start lg:items-end gap-4">
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 sm:gap-3.5 w-full sm:w-auto">
                {/* Primary Button */}
                <Link
                  href="/volunteers"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3 sm:px-7 sm:py-3.5 rounded-full bg-impact-green hover:bg-env-green text-pure-white font-heading font-semibold text-sm sm:text-base shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.985] transition-all duration-300"
                >
                  <HeartHandshake aria-hidden="true" className="w-4.5 h-4.5" />
                  <span>Join as a Volunteer</span>
                </Link>

                {/* Secondary Button */}
                <Link
                  href="/about"
                  className="group/btn inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-7 sm:py-3.5 rounded-full bg-pure-white/90 hover:bg-soft-green/30 text-udbhav-blue-deep hover:text-impact-green border border-impact-green/50 hover:border-impact-green font-heading font-semibold text-sm sm:text-base transition-all duration-300 active:scale-[0.985]"
                >
                  <span>Explore Our Work</span>
                  <ArrowRight
                    aria-hidden="true"
                    className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                  />
                </Link>
              </div>

              {/* Optional Small Community Message */}
              <p className="text-xs sm:text-sm font-medium text-text-secondary italic text-center sm:text-left lg:text-right mt-1">
                “Your time. Your voice. Your impact.”
              </p>
            </div>
          </div>
        </RevealCard>
      </div>
    </section>
  );
}

export default JoinOurCommunitySection;
