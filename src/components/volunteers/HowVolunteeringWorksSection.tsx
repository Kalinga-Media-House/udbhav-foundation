"use client";

import React from "react";
import { Container } from "@/components/shared/Container";
import { RevealCard } from "@/components/shared/RevealCard";

const STEPS = [
  {
    number: "01",
    title: "Submit Your Interest",
    description:
      "Complete the volunteer application and tell us about your interests, skills, and availability.",
  },
  {
    number: "02",
    title: "Connect With Our Team",
    description:
      "Our volunteer coordination team will review your application and contact you.",
  },
  {
    number: "03",
    title: "Join an Initiative",
    description:
      "Choose suitable programmes, campaigns, events, or community activities.",
  },
  {
    number: "04",
    title: "Create Meaningful Impact",
    description:
      "Work with the community, develop new skills, and contribute to measurable change.",
  },
];

export function HowVolunteeringWorksSection() {
  return (
    <section
      aria-labelledby="how-it-works-heading"
      className="relative w-full py-12 sm:py-16 md:py-20 border-b border-soft-border/40"
      style={{
        background: "linear-gradient(180deg, #EAF3FF 0%, #F4F9FF 100%)",
      }}
    >
      <Container>
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-14">
          <RevealCard as="div" index={0}>
            <span
              className="eyebrow-label font-heading text-xs sm:text-sm font-bold tracking-widest uppercase block mb-2"
              style={{ color: "#439B25" }}
            >
              PROCESS
            </span>
            <h2
              id="how-it-works-heading"
              className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-2"
              style={{ color: "#12245F" }}
            >
              Your Journey With UDBHAV
            </h2>
            <p
              className="text-sm sm:text-base leading-relaxed font-medium"
              style={{ color: "#5E6B63" }}
            >
              Joining the movement is simple.
            </p>
          </RevealCard>
        </div>

        {/* 4-Step Process: Horizontal on Desktop with green connector, Vertical Timeline on Mobile */}
        <div className="relative">
          {/* Desktop Connecting Line */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-7 left-[10%] right-[10%] h-0.5"
            style={{ background: "#439B25" }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8 relative z-10">
            {STEPS.map((step, idx) => (
              <RevealCard
                key={step.number}
                as="div"
                index={idx}
                className="group flex flex-col items-center text-center lg:items-start lg:text-left rounded-2xl bg-pure-white p-5 sm:p-6 border border-[#439B25]/20 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                {/* Step Circle */}
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center font-heading font-bold text-lg mb-4 shadow-sm"
                  style={{
                    background: "#EEF8E9",
                    color: "#439B25",
                    border: "2px solid #439B25",
                  }}
                >
                  {step.number}
                </div>

                {/* Step Title */}
                <h3
                  className="font-heading text-lg sm:text-xl font-bold mb-2 leading-snug"
                  style={{ color: "#12245F" }}
                >
                  {step.title}
                </h3>

                {/* Step Description */}
                <p
                  className="text-xs sm:text-sm leading-relaxed"
                  style={{ color: "#5E6B63" }}
                >
                  {step.description}
                </p>
              </RevealCard>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default HowVolunteeringWorksSection;
