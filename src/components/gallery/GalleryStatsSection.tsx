"use client";

import { Camera, Calendar, Layers, MapPin } from "lucide-react";
import React from "react";

import { Container } from "@/components/shared/Container";
import { getGalleryStats } from "@/data/gallery-data";

export function GalleryStatsSection() {
  const stats = getGalleryStats();

  const STATS_CARDS = [
    {
      icon: Camera,
      count: `${stats.totalPhotos}+`,
      label: "Authentic Photos",
    },
    {
      icon: Calendar,
      count: `${stats.eventsCovered}+`,
      label: "Events Covered",
    },
    {
      icon: Layers,
      count: `${stats.programmesRepresented}`,
      label: "Index Programmes",
    },
    {
      icon: MapPin,
      count: `${stats.locationsReached}+`,
      label: "Locations Reached",
    },
  ];

  return (
    <section
      aria-label="Impact Gallery Statistics"
      className="w-full py-6 sm:py-8 bg-pure-white border-b border-soft-border/40"
    >
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {STATS_CARDS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl border border-[#439B25]/25 bg-[#EEF8E9] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 bg-pure-white border border-[#439B25]/20"
                  style={{ color: "#439B25" }}
                >
                  <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <div
                    className="font-heading text-xl sm:text-2xl font-bold leading-tight"
                    style={{ color: "#12245F" }}
                  >
                    {item.count}
                  </div>
                  <div
                    className="text-xs sm:text-sm font-medium truncate"
                    style={{ color: "#5E6B63" }}
                  >
                    {item.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export default GalleryStatsSection;
