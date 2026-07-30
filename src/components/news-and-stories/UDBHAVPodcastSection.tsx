'use client';

import { Play, Clock, Calendar, ChevronLeft, ChevronRight, Tv } from 'lucide-react';
import Link from 'next/link';
import React, { useRef, useState, useEffect, useCallback } from 'react';

import { AnimatedCardWrapper } from '@/components/shared/AnimatedCardWrapper';
import { Container } from '@/components/shared/Container';
import { LazyImage } from '@/components/shared/LazyImage';
import { PODCAST_EPISODES } from '@/data/news-data';

function isValidYouTubeUrl(url?: string): boolean {
  if (!url || typeof url !== 'string' || !url.trim()) return false;
  try {
    const parsed = new URL(url.trim());
    const hostname = parsed.hostname.toLowerCase();
    return hostname === 'youtube.com' || hostname === 'www.youtube.com' || hostname === 'youtu.be';
  } catch {
    return false;
  }
}

export function UDBHAVPodcastSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const startXRef = useRef<number>(0);
  const scrollLeftRef = useRef<number>(0);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const carouselEpisodes = PODCAST_EPISODES;

  const pauseAutoScrollForAWhile = useCallback(() => {
    setIsPaused(true);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 3000);
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const step = () => {
      if (
        !isPaused &&
        !isDragging &&
        scrollContainerRef.current &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        const container = scrollContainerRef.current;
        container.scrollLeft += 0.4;

        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 4) {
          container.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, [isPaused, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    pauseAutoScrollForAWhile();
    startXRef.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      pauseAutoScrollForAWhile();
    }
  };

  const scrollByAmount = (offset: number) => {
    pauseAutoScrollForAWhile();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="udbhav-podcast"
      aria-labelledby="udbhav-podcast-heading"
      className="sm:py-18 relative w-full overflow-hidden bg-gradient-to-b from-[#12245F] via-[#1a2f77] to-[#12245F] py-14 text-white md:py-24"
    >
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/4 top-10 h-96 w-96 rounded-full bg-[#439B25]/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 right-1/4 h-96 w-96 rounded-full bg-[#202B78]/40 blur-3xl"
      />

      <Container className="relative z-10">
        {/* Podcast Episode Carousel — Latest Conversations */}
        <div className="mb-14 sm:mb-16">
          <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
            <div>
              <h3 className="font-heading text-xl font-bold text-white sm:text-2xl">
                Latest Conversations
              </h3>
              <p className="mt-1 text-sm text-white/75">
                Explore recent episodes with young scholars, volunteers, and civic leaders.
              </p>
            </div>

            {/* Manual Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollByAmount(-320)}
                aria-label="Scroll left to previous podcast episodes"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-all hover:bg-white/20"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollByAmount(320)}
                aria-label="Scroll right to more podcast episodes"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-all hover:bg-white/20"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div
            ref={scrollContainerRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={handleMouseUpOrLeave}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onTouchStart={pauseAutoScrollForAWhile}
            onFocus={pauseAutoScrollForAWhile}
            className={`scrollbar-none flex select-none items-stretch gap-5 overflow-x-auto pb-4 ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
            }}
          >
            {carouselEpisodes.map((ep) => {
              const hasValidEpYouTube = isValidYouTubeUrl(ep.youtubeUrl);

              return (
                <AnimatedCardWrapper
                  key={ep.id}
                  index={0}
                  className="flex w-[82vw] shrink-0 flex-col overflow-hidden rounded-2xl border border-white/15 bg-white/10 sm:w-[290px] md:w-[310px]"
                >
                  <Link
                    href={`/news-and-stories/podcast/${ep.slug}`}
                    className="relative block h-44 w-full overflow-hidden bg-black/30"
                  >
                    <LazyImage
                      src={ep.thumbnailUrl}
                      alt={`${ep.title} — UDBHAV Podcast cover`}
                      fill
                      sizes="310px"
                      className="object-cover group-hover:scale-[1.025]"
                    />

                    <div className="absolute left-3 top-3 z-10">
                      <span className="rounded-full bg-[#439B25] px-2.5 py-1 font-heading text-[11px] font-bold uppercase text-white">
                        {ep.episodeNumber}
                      </span>
                    </div>

                    <div className="absolute right-3 top-3 z-10">
                      <span className="flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                        <Clock className="h-3 w-3 text-[#439B25]" />
                        {ep.duration}
                      </span>
                    </div>

                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 transition-colors duration-300 group-hover:bg-black/10">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#439B25] text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                        <Play className="ml-0.5 h-5 w-5 fill-current" />
                      </div>
                    </div>
                  </Link>

                  <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                    <Link href={`/news-and-stories/podcast/${ep.slug}`} className="block">
                      <div className="mb-1 truncate text-xs font-bold uppercase text-[#439B25]">
                        Guest: {ep.guest.fullName}
                      </div>
                      <h4 className="mb-2 line-clamp-2 font-heading text-base font-bold leading-snug text-white transition-colors group-hover:text-[#439B25]">
                        {ep.title}
                      </h4>
                      <p className="line-clamp-2 text-xs text-white/75">{ep.guest.role}</p>
                    </Link>

                    <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-white/80">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-[#439B25]" />
                        {ep.releaseDate}
                      </span>
                      {hasValidEpYouTube ? (
                        <a
                          href={ep.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-[#439B25] hover:underline"
                        >
                          Watch Episode →
                        </a>
                      ) : (
                        <span className="font-semibold text-white/50">Coming Soon</span>
                      )}
                    </div>
                  </div>
                </AnimatedCardWrapper>
              );
            })}
          </div>
        </div>

        {/* Follow the Conversation — YouTube Platform */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-8 sm:flex-row">
          <div className="text-center sm:text-left">
            <h4 className="font-heading text-lg font-bold text-white">
              Follow the Conversation on YouTube
            </h4>
            <p className="mt-0.5 text-xs text-white/75 sm:text-sm">
              Watch all full video episodes and community conversations on our official channel.
            </p>
          </div>

          <div className="flex items-center justify-center">
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-white/20 hover:shadow sm:text-sm"
            >
              <Tv className="h-4 w-4 text-[#439B25]" />
              Official YouTube Channel
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default UDBHAVPodcastSection;
