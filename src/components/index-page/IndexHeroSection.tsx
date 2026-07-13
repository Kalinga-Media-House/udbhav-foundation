"use client";

import React from "react";
import Image from "next/image";

export function IndexHeroSection() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#EAF3FF] via-[#F4F9FF] to-[#F1F9ED] py-12 sm:py-16 md:py-20 lg:py-24 border-b border-gray-200/60">
      {/* Decorative soft green/blue background circles */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#3C9D23]/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-[#172B6B]/10 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[460px] lg:min-h-[520px]">
          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3C9D23]/15 border border-[#3C9D23]/30 text-[#3C9D23] text-xs font-heading font-bold tracking-wider uppercase mb-5 w-fit">
              PROGRAMMES & INITIATIVES
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-[#172B6B] leading-tight mb-6">
              Turning Purpose Into{" "}
              <span className="text-[#3C9D23] block sm:inline">
                Measurable Impact.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-8 max-w-2xl font-normal">
              Explore UDBHAV Foundation’s programmes advancing education,
              environmental responsibility, health, inclusion, awareness, and
              community empowerment across Odisha.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                type="button"
                onClick={() => scrollToSection("programmes")}
                className="px-8 py-3.5 rounded-xl font-heading font-semibold text-sm sm:text-base text-white bg-[#3C9D23] hover:bg-[#348a1e] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-center cursor-pointer"
              >
                Explore All Programmes
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("collective-impact")}
                className="px-8 py-3.5 rounded-xl font-heading font-semibold text-sm sm:text-base text-[#172B6B] bg-white hover:bg-gray-50 border-2 border-[#172B6B]/20 hover:border-[#172B6B] shadow-sm hover:shadow-md transition-all text-center cursor-pointer"
              >
                View Our Impact
              </button>
            </div>
          </div>

          {/* Right Staggered Photo Collage */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <div className="grid grid-cols-2 gap-4 sm:gap-6 relative">
              {/* Top-Left Image Frame */}
              <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden shadow-xl border-2 border-white group transform hover:-translate-y-1 transition-transform duration-300">
                <Image
                  src="/hero/hero-02.png"
                  alt="UDBHAV Siksha Samman felicitation ceremony"
                  fill
                  sizes="(max-width: 1024px) 50vw, 260px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                <span className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold leading-tight drop-shadow">
                  UDBHAV Siksha Samman
                </span>
              </div>

              {/* Top-Right Image Frame (staggered lower) */}
              <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden shadow-xl border-2 border-white group transform translate-y-4 hover:translate-y-3 transition-transform duration-300">
                <Image
                  src="/hero/hero-01.png"
                  alt="UDBHAV Foundation Plantation Drive sapling initiative"
                  fill
                  sizes="(max-width: 1024px) 50vw, 260px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                <span className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold leading-tight drop-shadow">
                  Plantation Drive
                </span>
              </div>

              {/* Bottom-Left Image Frame */}
              <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden shadow-xl border-2 border-white group transform -translate-y-2 hover:-translate-y-3 transition-transform duration-300">
                <Image
                  src="/hero/hero-08.png"
                  alt="Citizens participating in UDBHAV Climate Action Run"
                  fill
                  sizes="(max-width: 1024px) 50vw, 260px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                <span className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold leading-tight drop-shadow">
                  Climate Action Run
                </span>
              </div>

              {/* Bottom-Right Image Frame */}
              <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden shadow-xl border-2 border-white group transform translate-y-2 hover:translate-y-1 transition-transform duration-300">
                <Image
                  src="/hero/hero-09.png"
                  alt="Medical specialists at UDBHAV Health Check-up Camp"
                  fill
                  sizes="(max-width: 1024px) 50vw, 260px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                <span className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold leading-tight drop-shadow">
                  Health Check-up Camps
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
