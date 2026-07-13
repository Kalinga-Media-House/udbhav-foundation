"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Heart, Mic, Users } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { StorySubmissionModal } from "./StorySubmissionModal";

export function CommunityCTASection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"story" | "podcast">("story");

  const openModal = (mode: "story" | "podcast") => {
    setModalMode(mode);
    setModalOpen(true);
  };

  return (
    <section
      id="share-story"
      aria-labelledby="community-cta-heading"
      className="w-full py-14 sm:py-18 md:py-24 border-b border-soft-border/40 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #EEF8E9 0%, #F4FBF1 50%, #EAF3FF 100%)",
      }}
    >
      {/* Decorative subtle radial circles */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-16 w-80 h-80 rounded-full bg-[#439B25]/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-[#12245F]/10 blur-3xl"
      />

      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <span
            className="eyebrow-label font-heading text-xs sm:text-sm font-bold tracking-widest uppercase inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pure-white border border-[#439B25]/25 shadow-sm mb-4"
            style={{ color: "#439B25" }}
          >
            <Sparkles className="w-4 h-4" />
            COMMUNITY VOICE
          </span>

          <h2
            id="community-cta-heading"
            className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4"
            style={{ color: "#12245F" }}
          >
            Have a Story That Can Inspire Change?
          </h2>

          <p
            className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed"
            style={{ color: "#5E6B63" }}
          >
            Your journey, achievement, experience, or community initiative may
            encourage someone else to believe, begin, and create an impact.
          </p>

          {/* 3 Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => openModal("story")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-heading text-sm sm:text-base font-semibold text-white shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
              style={{ background: "#439B25" }}
            >
              <Heart className="w-4 h-4" />
              Share Your Story
            </button>

            <button
              type="button"
              onClick={() => openModal("podcast")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-heading text-sm sm:text-base font-semibold transition-all duration-300 border border-[#12245F]/20 bg-pure-white text-[#12245F] hover:bg-[#EAF3FF] hover:border-[#202B78] cursor-pointer shadow-sm"
            >
              <Mic className="w-4 h-4 text-[#439B25]" />
              Suggest a Podcast Guest
            </button>

            <Link
              href="/volunteers"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-heading text-sm sm:text-base font-semibold transition-all duration-300 border border-[#12245F]/20 bg-pure-white text-[#12245F] hover:bg-[#EEF8E9] hover:border-[#439B25] shadow-sm"
            >
              <Users className="w-4 h-4 text-[#439B25]" />
              Join Our Community
            </Link>
          </div>
        </div>
      </Container>

      <StorySubmissionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
      />
    </section>
  );
}

export default CommunityCTASection;
