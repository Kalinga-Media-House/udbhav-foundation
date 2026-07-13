"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Award } from "lucide-react";
import { ADHYAYA_FLAGSHIP_DATA } from "@/data/index-programmes-data";

export function AdhyayaFlagshipSection() {
  const data = ADHYAYA_FLAGSHIP_DATA;

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-[#EAF3FF] via-[#F4F9FF] to-[#F1F9ED] border-t border-b border-[#172B6B]/15">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3C9D23] text-white text-xs font-heading font-bold tracking-wider uppercase mb-5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{data.badge}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-[#172B6B] leading-tight mb-4">
              {data.title}
            </h2>

            <p className="text-sm sm:text-base font-semibold text-[#3C9D23] mb-6 uppercase tracking-wide">
              {data.subtitle}
            </p>

            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-8">
              {data.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#3C9D23]/15 text-[#3C9D23] flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-heading font-bold text-sm text-[#172B6B]">
                    Dignity & Leadership
                  </div>
                  <div className="text-xs text-gray-600">
                    Shared stage for marginalized voices
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Link
                href={data.ctaHref}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-heading font-semibold text-sm sm:text-base text-white bg-[#172B6B] hover:bg-[#101F55] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                <span>{data.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Image Grid */}
          <div className="lg:col-span-5">
            <div className="relative h-72 sm:h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-white group">
              <Image
                src={data.coverImageUrl}
                alt={`${data.title} — Flagship Inclusion Event`}
                fill
                sizes="(max-width: 1024px) 100vw, 450px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#172B6B]/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-6 right-6 text-white">
                <span className="inline-block px-3 py-1 rounded-full bg-[#3C9D23] text-xs font-bold uppercase mb-2">
                  ODISHA’S FIRST RAMP OF INCLUSION
                </span>
                <h3 className="font-heading font-bold text-lg sm:text-xl leading-snug">
                  Celebrating Diversity & Representation
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
