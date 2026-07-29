"use client";

import { HeartHandshake, BookOpen, Users, Sparkles } from "lucide-react";
import React from "react";

import { Container } from "@/components/shared/Container";
import { RevealCard } from "@/components/shared/RevealCard";

const WHY_VOLUNTEER_CARDS = [
  {
    number: "01",
    title: "Create Real Impact",
    description:
      "Participate in meaningful initiatives that directly support education, health, environmental responsibility, inclusion, and community development.",
    icon: HeartHandshake,
  },
  {
    number: "02",
    title: "Learn & Grow",
    description:
      "Develop leadership, communication, teamwork, project-management, and problem-solving skills through practical community experience.",
    icon: BookOpen,
  },
  {
    number: "03",
    title: "Build Connections",
    description:
      "Meet compassionate students, professionals, educators, social workers, and changemakers who share a commitment to positive action.",
    icon: Users,
  },
  {
    number: "04",
    title: "Be Part of a Movement",
    description:
      "Become part of a growing community that believes sustainable change is created with people—not simply for people.",
    icon: Sparkles,
  },
];

export function WhyVolunteerSection() {
  return (
    <section
      aria-labelledby="why-volunteer-heading"
      className="relative w-full py-12 sm:py-16 md:py-20 bg-gradient-to-b from-pure-white via-[#FDFCF8] to-pure-white border-b border-soft-border/40"
    >
      <Container>
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-14">
          <RevealCard as="div" index={0}>
            <span
              className="eyebrow-label font-heading text-xs sm:text-sm font-bold tracking-widest uppercase block mb-2"
              style={{ color: "#439B25" }}
            >
              WHY VOLUNTEER
            </span>
            <h2
              id="why-volunteer-heading"
              className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3"
              style={{ color: "#12245F" }}
            >
              Why Volunteer With UDBHAV?
            </h2>
            <p
              className="text-sm sm:text-base leading-relaxed"
              style={{ color: "#5E6B63" }}
            >
              Every contribution matters. Your knowledge, creativity, compassion,
              and time can help build stronger and more inclusive communities.
            </p>
          </RevealCard>
        </div>

        {/* 4 Cards Grid: 4 per row on desktop, 2 per row on tablet, 1 per row on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {WHY_VOLUNTEER_CARDS.map((card, idx) => {
            const IconComponent = card.icon;
            return (
              <RevealCard
                key={card.number}
                as="div"
                index={idx}
                className="group relative flex flex-col justify-between rounded-2xl bg-pure-white p-5 sm:p-6 border border-[#439B25]/20 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-lg hover:border-[#439B25] active:scale-[0.985]"
              >
                <div>
                  {/* Top Row: Icon Container + Number */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                      style={{ background: "#EEF8E9", color: "#439B25" }}
                    >
                      <IconComponent className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <span
                      className="font-heading text-xs font-bold tracking-widest uppercase"
                      style={{ color: "#439B25" }}
                    >
                      {card.number}
                    </span>
                  </div>

                  {/* Heading */}
                  <h3
                    className="font-heading text-lg sm:text-xl font-bold mb-2.5 leading-snug"
                    style={{ color: "#12245F" }}
                  >
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-xs sm:text-sm leading-relaxed"
                    style={{ color: "#5E6B63" }}
                  >
                    {card.description}
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

export default WhyVolunteerSection;
