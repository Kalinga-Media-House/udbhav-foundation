"use client";

import {
  HeartHandshake,
  ArrowDownRight,
  Users,
  Sparkles,
  MapPin,
  Target,
} from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";

import { Container } from "@/components/shared/Container";
import { RevealCard } from "@/components/shared/RevealCard";

interface SlidePhoto {
  src: string;
  alt: string;
}

function PhotoFrameSlideshow({
  photos,
  intervalMs,
  startDelayMs,
  className,
  sizes,
  priorityFirst = false,
}: {
  photos: SlidePhoto[];
  intervalMs: number;
  startDelayMs: number;
  className?: string;
  sizes: string;
  priorityFirst?: boolean;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    queueMicrotask(() => setReducedMotion(mediaQuery.matches));
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion || isPaused || photos.length <= 1) return;

    let intervalId: NodeJS.Timeout | null = null;
    const startTimeout = setTimeout(() => {
      intervalId = setInterval(() => {
        setCurrentIndex((prevIdx) => (prevIdx + 1) % photos.length);
      }, intervalMs);
    }, startDelayMs);

    return () => {
      clearTimeout(startTimeout);
      if (intervalId) clearInterval(intervalId);
    };
  }, [photos.length, intervalMs, startDelayMs, reducedMotion, isPaused]);

  const getKenBurnsClass = (index: number, isActive: boolean) => {
    if (reducedMotion || !isActive) {
      return "scale-100";
    }
    const mode = index % 4;
    switch (mode) {
      case 0:
        return "scale-[1.04] transition-transform duration-[5000ms] ease-out";
      case 1:
        return "scale-[1.035] translate-x-1 transition-transform duration-[5000ms] ease-out";
      case 2:
        return "scale-[1.035] -translate-x-1 transition-transform duration-[5000ms] ease-out";
      case 3:
      default:
        return "scale-100 transition-transform duration-[5000ms] ease-out";
    }
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`relative overflow-hidden bg-pure-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${
        className || ""
      }`}
    >
      {photos.map((photo, idx) => {
        const isActive = idx === currentIndex;
        return (
          <div
            key={photo.src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes={sizes}
              priority={priorityFirst && idx === 0}
              className={`object-cover object-center ${getKenBurnsClass(
                idx,
                isActive
              )}`}
            />
          </div>
        );
      })}

      {/* Tiny subtle white slide indicators at bottom center */}
      {photos.length > 1 && (
        <div
          aria-hidden="true"
          className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 pointer-events-none"
        >
          {photos.map((_, dotIdx) => (
            <span
              key={dotIdx}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                dotIdx === currentIndex ? "bg-white/95 scale-110" : "bg-white/45"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// 1. Large left frame photos (4 photos, staggered 4.5s interval, 0ms delay)
const LEFT_FRAME_PHOTOS: SlidePhoto[] = [
  {
    src: "/hero/hero-01.png",
    alt: "UDBHAV Foundation volunteers participating in a plantation drive and environmental community campaign",
  },
  {
    src: "/hero/hero-04.png",
    alt: "Student volunteers distributing educational materials and supporting grassroots learning",
  },
  {
    src: "/hero/hero-07.png",
    alt: "Active volunteers organizing community welfare and youth empowerment initiatives in Odisha",
  },
  {
    src: "/hero/hero-08.png",
    alt: "Compassionate changemakers collaborating on community development and volunteer outreach activities",
  },
];

// 2. Top-right frame photos (4 photos, staggered 5.2s interval, 1000ms delay)
const TOP_RIGHT_FRAME_PHOTOS: SlidePhoto[] = [
  {
    src: "/hero/hero-02.png",
    alt: "Student volunteers planting saplings during an environmental awareness programme",
  },
  {
    src: "/hero/hero-05.png",
    alt: "Youth volunteers engaged in environmental conservation and cleanliness initiatives",
  },
  {
    src: "/hero/hero-08.png",
    alt: "Volunteers conducting awareness campaigns on sustainability and community hygiene",
  },
  {
    src: "/hero/hero-01.png",
    alt: "Dedicated volunteers nurturing green spaces and community plantation initiatives",
  },
];

// 3. Bottom-right frame photos (4 photos, staggered 5.8s interval, 2000ms delay)
const BOTTOM_RIGHT_FRAME_PHOTOS: SlidePhoto[] = [
  {
    src: "/hero/hero-03.png",
    alt: "Community members participating in an UDBHAV health awareness event and gathering",
  },
  {
    src: "/hero/hero-06.png",
    alt: "Volunteers coordinating public campaigns, health camps, and grassroots workshops",
  },
  {
    src: "/hero/hero-09.png",
    alt: "Volunteers leading interactive community sessions and social action campaigns",
  },
  {
    src: "/hero/hero-02.png",
    alt: "Changemakers engaging with community leaders during volunteer outreach activities",
  },
];

export function VolunteerHeroSection() {
  const [statsAnimated, setStatsAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStatsAnimated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const scrollToForm = () => {
    const elem = document.getElementById("volunteer-application");
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToOpportunities = () => {
    const elem = document.getElementById("volunteer-opportunities");
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      aria-labelledby="volunteer-hero-heading"
      className="relative w-full overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24 border-b border-soft-border/40"
      style={{
        background:
          "linear-gradient(135deg, #EDF6FF 0%, #F7FBF4 52%, #E5F4DF 100%)",
      }}
    >
      {/* Blurred Blue and Green Ambient Shapes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#EAF3FF] blur-3xl opacity-70"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 -right-24 w-96 h-96 rounded-full bg-[#EEF8E9] blur-3xl opacity-80"
      />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Heading, Copy, Buttons, Statistics */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            <RevealCard as="div" index={0}>
              <span
                className="eyebrow-label font-heading text-xs sm:text-sm font-bold tracking-widest uppercase inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF8E9] border border-[#439B25]/25 mb-4"
                style={{ color: "#439B25" }}
              >
                <HeartHandshake className="w-4 h-4" />
                COMMUNITY VOLUNTEERS
              </span>
            </RevealCard>

            <RevealCard as="div" index={1}>
              <h1
                id="volunteer-hero-heading"
                className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold tracking-tight leading-[1.12] mb-5"
                style={{ color: "#12245F" }}
              >
                Your Time Can Become{" "}
                <span style={{ color: "#439B25" }}>Someone’s Hope</span>
              </h1>
            </RevealCard>

            <RevealCard as="div" index={2} className="space-y-3 max-w-2xl">
              <p
                className="text-base sm:text-lg md:text-[19px] leading-relaxed font-normal"
                style={{ color: "#17231D" }}
              >
                Change does not always begin with money or authority. Sometimes,
                it begins with one person choosing to give their time, share their
                skills, and stand beside a community.
              </p>
              <p
                className="text-sm sm:text-base font-medium"
                style={{ color: "#5E6B63" }}
              >
                Join UDBHAV Foundation and turn your compassion into meaningful action.
              </p>
            </RevealCard>

            {/* CTA Buttons */}
            <RevealCard as="div" index={3} className="w-full sm:w-auto mt-7 sm:mt-8">
              <div className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={scrollToForm}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-heading font-semibold text-sm sm:text-base text-pure-white transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
                  style={{ background: "#439B25" }}
                >
                  <HeartHandshake className="w-5 h-5" />
                  Become a Volunteer
                </button>

                <button
                  type="button"
                  onClick={scrollToOpportunities}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-heading font-semibold text-sm sm:text-base transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
                  style={{
                    background: "#EAF3FF",
                    border: "1px solid #202B78",
                    color: "#202B78",
                  }}
                >
                  Explore Opportunities
                  <ArrowDownRight className="w-4 h-4" />
                </button>
              </div>
            </RevealCard>

            {/* Compact Impact-Statistics Row */}
            <RevealCard
              as="div"
              index={4}
              className="w-full mt-8 sm:mt-11 pt-6 sm:pt-8 border-t border-[#12245F]/10"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center lg:text-left">
                <div className="flex flex-col items-center lg:items-start">
                  <div className="flex items-center gap-1.5 font-heading text-2xl sm:text-3xl font-bold text-[#12245F]">
                    <Users className="w-5 h-5 text-[#439B25] hidden sm:block" />
                    <span>{statsAnimated ? "250–300+" : "250+"}</span>
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-[#5E6B63] mt-0.5">
                    Active Members
                  </span>
                </div>

                <div className="flex flex-col items-center lg:items-start">
                  <div className="flex items-center gap-1.5 font-heading text-2xl sm:text-3xl font-bold text-[#12245F]">
                    <Sparkles className="w-5 h-5 text-[#439B25] hidden sm:block" />
                    <span>{statsAnimated ? "11+" : "10+"}</span>
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-[#5E6B63] mt-0.5">
                    Community Initiatives
                  </span>
                </div>

                <div className="flex flex-col items-center lg:items-start">
                  <div className="flex items-center gap-1.5 font-heading text-2xl sm:text-3xl font-bold text-[#12245F]">
                    <MapPin className="w-5 h-5 text-[#439B25] hidden sm:block" />
                    <span>{statsAnimated ? "2" : "1"}</span>
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-[#5E6B63] mt-0.5">
                    Operational Locations
                  </span>
                </div>

                <div className="flex flex-col items-center lg:items-start">
                  <div className="flex items-center gap-1.5 font-heading text-2xl sm:text-3xl font-bold text-[#12245F]">
                    <Target className="w-5 h-5 text-[#439B25] hidden sm:block" />
                    <span>1</span>
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-[#5E6B63] mt-0.5">
                    Shared Purpose
                  </span>
                </div>
              </div>
            </RevealCard>
          </div>

          {/* Right Column: 3-Frame Collage with Independent Staggered Slideshows */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <RevealCard
              as="div"
              index={2}
              className="relative w-full max-w-[480px] lg:max-w-none"
            >
              <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
                {/* 1. Large Vertical Frame on Left (4500ms interval, 0ms start delay) */}
                <PhotoFrameSlideshow
                  photos={LEFT_FRAME_PHOTOS}
                  intervalMs={4500}
                  startDelayMs={0}
                  priorityFirst={true}
                  sizes="(max-width: 768px) 50vw, 240px"
                  className="aspect-[4/5] rounded-2xl shadow-lg border border-[#439B25]/20"
                />

                {/* Right Column containing Top-Right & Bottom-Right Frames */}
                <div className="flex flex-col gap-3.5 sm:gap-4">
                  {/* 2. Small Top-Right Frame (5200ms interval, 1000ms start delay) */}
                  <PhotoFrameSlideshow
                    photos={TOP_RIGHT_FRAME_PHOTOS}
                    intervalMs={5200}
                    startDelayMs={1000}
                    sizes="(max-width: 768px) 50vw, 240px"
                    className="aspect-[4/3] rounded-2xl shadow-md border border-[#439B25]/20"
                  />

                  {/* 3. Small Bottom-Right Frame (5800ms interval, 2000ms start delay) */}
                  <PhotoFrameSlideshow
                    photos={BOTTOM_RIGHT_FRAME_PHOTOS}
                    intervalMs={5800}
                    startDelayMs={2000}
                    sizes="(max-width: 768px) 50vw, 240px"
                    className="aspect-[4/3] rounded-2xl shadow-md border border-[#439B25]/20"
                  />
                </div>
              </div>
            </RevealCard>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default VolunteerHeroSection;
