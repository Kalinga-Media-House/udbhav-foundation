"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { OFFICIAL_INDEX_PROGRAMMES } from "@/data/index-programmes-data";
import { ProgrammeCategory } from "@/types/index-programme";

const CATEGORY_TABS: { label: string; value: string }[] = [
  { label: "All Programmes", value: "all" },
  { label: "Education", value: "Education" },
  { label: "Environment", value: "Environment" },
  { label: "Health & Well-being", value: "Health & Well-being" },
  { label: "Awareness & Safety", value: "Awareness & Safety" },
  { label: "Community Support", value: "Community Support" },
];

export function ProgrammeDirectorySection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredProgrammes = useMemo(() => {
    if (selectedCategory === "all") {
      return OFFICIAL_INDEX_PROGRAMMES;
    }
    return OFFICIAL_INDEX_PROGRAMMES.filter(
      (prog) => prog.category === (selectedCategory as ProgrammeCategory)
    );
  }, [selectedCategory]);

  return (
    <section
      id="programmes"
      className="py-16 sm:py-20 md:py-24 bg-[#FCFCF8] scroll-mt-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3C9D23]/15 border border-[#3C9D23]/30 text-[#3C9D23] text-xs font-heading font-bold tracking-wider uppercase mb-4">
            OUR AREAS OF ACTION
          </div>

          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#172B6B] leading-tight mb-4">
            11 Programmes. One Shared Purpose.
          </h2>

          <p className="text-base sm:text-lg text-gray-700 font-normal">
            Each initiative responds to a real community need while contributing to
            a more inclusive, aware, healthy, educated, and sustainable society.
          </p>
        </div>

        {/* Dynamic Category Filter Tabs (Client side, no URL reload) */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-4 mb-10 sm:mb-12 no-scrollbar gap-2">
          {CATEGORY_TABS.map((tab) => {
            const isActive = selectedCategory === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setSelectedCategory(tab.value)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-heading font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-[#172B6B] text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-[#EAF3FF] border border-gray-200"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Responsive Programme Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
          {filteredProgrammes.map((prog) => {
            return (
              <article
                key={prog.id}
                className="group flex flex-col h-full rounded-2xl bg-white border border-[#3C9D23]/25 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 motion-reduce:transform-none"
              >
                {/* Image Header with Number Badge */}
                <div className="relative h-48 w-full overflow-hidden bg-gray-100 shrink-0">
                  <Image
                    src={prog.coverImageUrl}
                    alt={prog.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 motion-reduce:transform-none"
                  />

                  {/* Programme Number Badge */}
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <span className="px-3 py-1 rounded-full text-xs font-heading font-bold uppercase bg-[#172B6B] text-white shadow-md">
                      {prog.programmeNumber}
                    </span>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-3.5 right-3.5 z-10">
                    <span className="px-3 py-1 rounded-full text-xs font-heading font-semibold bg-[#3C9D23] text-white shadow-md">
                      {prog.category}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-[#172B6B] mb-1.5 leading-snug group-hover:text-[#202B78] transition-colors">
                      {prog.title}
                    </h3>

                    <p className="text-xs font-semibold text-[#3C9D23] uppercase tracking-wide mb-3">
                      {prog.tagline}
                    </p>

                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3 mb-5">
                      {prog.shortDescription}
                    </p>
                  </div>

                  <div>
                    {/* Compact Impact Preview */}
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F1F9ED] border border-[#3C9D23]/25 mb-4">
                      <TrendingUp className="w-4 h-4 text-[#3C9D23] shrink-0" />
                      <span className="text-xs font-heading font-bold text-[#172B6B] truncate">
                        {prog.impactPreview}
                      </span>
                    </div>

                    {/* Metadata counts row */}
                    <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3 mb-4">
                      <span className="flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-gray-400" />
                        {prog.photoCount} Photos
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {prog.eventCount} Activities
                      </span>
                    </div>

                    {/* CTA Link */}
                    <Link
                      href={`/index/${prog.slug}`}
                      className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl font-heading text-xs sm:text-sm font-semibold text-[#172B6B] bg-[#EAF3FF] hover:bg-[#172B6B] hover:text-white transition-all group/btn"
                    >
                      <span>Explore Programme</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform motion-reduce:transform-none" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
