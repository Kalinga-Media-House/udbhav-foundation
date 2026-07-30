'use client';

import { Heart, Mic, Users } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

import { Container } from '@/components/shared/Container';

import { StorySubmissionModal } from './StorySubmissionModal';

export function CommunityCTASection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'story' | 'podcast'>('story');

  const openModal = (mode: 'story' | 'podcast') => {
    setModalMode(mode);
    setModalOpen(true);
  };

  return (
    <section
      id="share-story"
      aria-labelledby="community-cta-heading"
      className="sm:py-18 border-soft-border/40 relative w-full overflow-hidden border-b py-14 md:py-24"
      style={{
        background: 'linear-gradient(135deg, #EEF8E9 0%, #F4FBF1 50%, #EAF3FF 100%)',
      }}
    >
      {/* Decorative subtle radial circles */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-80 w-80 rounded-full bg-[#439B25]/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -left-16 h-80 w-80 rounded-full bg-[#12245F]/10 blur-3xl"
      />

      <Container className="relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <span
            className="eyebrow-label bg-pure-white mb-4 inline-flex items-center gap-2 rounded-full border border-[#439B25]/25 px-3.5 py-1.5 font-heading text-xs font-bold uppercase tracking-widest shadow-sm sm:text-sm"
            style={{ color: '#439B25' }}
          >
            COMMUNITY VOICE
          </span>

          <h2
            id="community-cta-heading"
            className="mb-4 font-heading text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl"
            style={{ color: '#12245F' }}
          >
            Have a Story That Can Inspire Change?
          </h2>

          <p
            className="mx-auto mb-8 max-w-2xl text-sm leading-relaxed sm:mb-10 sm:text-base md:text-lg"
            style={{ color: '#5E6B63' }}
          >
            Your journey, achievement, experience, or community initiative may encourage someone
            else to believe, begin, and create an impact.
          </p>

          {/* 3 Action Buttons */}
          <div className="flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => openModal('story')}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-heading text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:text-base"
              style={{ background: '#439B25' }}
            >
              <Heart className="h-4 w-4" />
              Share Your Story
            </button>

            <button
              type="button"
              onClick={() => openModal('podcast')}
              className="bg-pure-white inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#12245F]/20 px-6 py-3.5 font-heading text-sm font-semibold text-[#12245F] shadow-sm transition-all duration-300 hover:border-[#202B78] hover:bg-[#EAF3FF] sm:text-base"
            >
              <Mic className="h-4 w-4 text-[#439B25]" />
              Suggest a Podcast Guest
            </button>

            <Link
              href="/volunteers"
              className="bg-pure-white inline-flex items-center justify-center gap-2 rounded-xl border border-[#12245F]/20 px-6 py-3.5 font-heading text-sm font-semibold text-[#12245F] shadow-sm transition-all duration-300 hover:border-[#439B25] hover:bg-[#EEF8E9] sm:text-base"
            >
              <Users className="h-4 w-4 text-[#439B25]" />
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
