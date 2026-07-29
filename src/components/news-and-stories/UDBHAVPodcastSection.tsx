"use client";

import {
  Mic,
  Play,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Tv,
  Award,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState, useEffect, useCallback } from "react";

import { AnimatedCardWrapper } from "@/components/shared/AnimatedCardWrapper";
import { Container } from "@/components/shared/Container";
import { LazyImage } from "@/components/shared/LazyImage";
import { PODCAST_EPISODES } from "@/data/news-data";

function isValidYouTubeUrl(url?: string): boolean {
  if (!url || typeof url !== "string" || !url.trim()) return false;
  try {
    const parsed = new URL(url.trim());
    const hostname = parsed.hostname.toLowerCase();
    return (
      hostname === "youtube.com" ||
      hostname === "www.youtube.com" ||
      hostname === "youtu.be"
    );
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

  const featuredEpisode =
    PODCAST_EPISODES.find((p) => p.isFeatured) || PODCAST_EPISODES[0];
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
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        const container = scrollContainerRef.current;
        container.scrollLeft += 0.4;

        if (
          container.scrollLeft + container.clientWidth >=
          container.scrollWidth - 4
        ) {
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
      scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  if (!featuredEpisode) return null;

  const featuredHasValidYouTube = isValidYouTubeUrl(featuredEpisode.youtubeUrl);

  return (
    <section
      id="udbhav-podcast"
      aria-labelledby="udbhav-podcast-heading"
      className="w-full py-14 sm:py-18 md:py-24 bg-gradient-to-b from-[#12245F] via-[#1a2f77] to-[#12245F] text-white overflow-hidden relative"
    >
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-10 left-1/4 w-96 h-96 rounded-full bg-[#439B25]/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-[#202B78]/40 blur-3xl"
      />

      <Container className="relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-14">
          <span className="eyebrow-label font-heading text-xs sm:text-sm font-bold tracking-widest uppercase inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#439B25] mb-4">
            <Mic className="w-4 h-4 text-[#439B25]" />
            VOICES THAT INSPIRE
          </span>
          <h2
            id="udbhav-podcast-heading"
            className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-3"
          >
            The UDBHAV Podcast
          </h2>
          <p className="text-base sm:text-lg text-white/90 font-medium italic mb-5">
            “Every achievement has a journey. Every journey carries a lesson
            worth sharing.”
          </p>

          <div className="space-y-3 text-sm sm:text-base text-white/80 leading-relaxed">
            <p>
              The UDBHAV Podcast brings students, young achievers,
              changemakers, volunteers, educators, and community leaders into
              meaningful conversations about their struggles, achievements,
              social impact, and the people and platforms that helped shape
              their journey.
            </p>
            <p>
              Through honest conversations, we explore how education,
              mentorship, opportunity, community support, and platforms such as
              UDBHAV contributed to their growth—and how their journey now
              inspires others to create positive change.
            </p>
          </div>
        </div>

        {/* Featured Podcast Episode Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center rounded-3xl bg-white/10 border border-white/15 p-6 sm:p-8 lg:p-10 backdrop-blur-md shadow-2xl mb-14 sm:mb-16">
          {/* Left Thumbnail with Play Button */}
          <div className="lg:col-span-5">
            <div className="relative h-64 sm:h-76 md:h-84 w-full rounded-2xl overflow-hidden bg-black/40 border border-white/15 shadow-xl group">
              <Image
                src={featuredEpisode.thumbnailUrl}
                alt={`${featuredEpisode.title} — UDBHAV Podcast cover`}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Episode Number Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-heading font-bold uppercase tracking-wider bg-[#439B25] text-white shadow-md">
                  {featuredEpisode.episodeNumber}
                </span>
              </div>

              {/* Duration Badge */}
              <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-black/70 text-white backdrop-blur-sm">
                <Clock className="w-3.5 h-3.5 text-[#439B25]" />
                {featuredEpisode.duration}
              </div>

              {/* Center Play Overlay Link */}
              {featuredHasValidYouTube ? (
                <a
                  href={featuredEpisode.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Watch ${featuredEpisode.title} on YouTube`}
                  className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors duration-300"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#439B25] text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </div>
                </a>
              ) : (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 text-white/60 flex items-center justify-center shadow-2xl">
                    <Play className="w-8 h-8 fill-current ml-1 opacity-60" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Information Column */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Guest & Achievement */}
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#439B25] uppercase tracking-wider mb-2">
                <Award className="w-4 h-4" />
                <span>
                  Guest: {featuredEpisode.guest.fullName} •{" "}
                  {featuredEpisode.guest.achievement}
                </span>
              </div>

              {/* Episode Title */}
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white leading-tight mb-4">
                {featuredEpisode.title}
              </h3>

              {/* Description */}
              <p className="text-sm sm:text-base text-white/85 leading-relaxed mb-6">
                {featuredEpisode.description}
              </p>

              {/* Topics */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {featuredEpisode.topics.map((topic: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-white/90"
                  >
                    #{topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Single Primary Action Button */}
            <div className="pt-4 border-t border-white/15">
              {featuredHasValidYouTube ? (
                <a
                  href={featuredEpisode.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-heading text-sm sm:text-base font-semibold text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all w-full sm:w-auto cursor-pointer"
                  style={{ background: "#439B25" }}
                >
                  <Tv className="w-4 h-4" />
                  Watch Episode
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-heading text-sm sm:text-base font-semibold text-white/60 bg-white/10 border border-white/15 cursor-not-allowed w-full sm:w-auto"
                >
                  <Tv className="w-4 h-4 opacity-60" />
                  Episode Coming Soon
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Podcast Episode Carousel — Latest Conversations */}
        <div className="mb-14 sm:mb-16">
          <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">
                Latest Conversations
              </h3>
              <p className="text-sm text-white/75 mt-1">
                Explore recent episodes with young scholars, volunteers, and
                civic leaders.
              </p>
            </div>

            {/* Manual Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollByAmount(-320)}
                aria-label="Scroll left to previous podcast episodes"
                className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollByAmount(320)}
                aria-label="Scroll right to more podcast episodes"
                className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
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
            className={`flex items-stretch gap-5 overflow-x-auto scrollbar-none select-none pb-4 ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
            style={{
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
            }}
          >
            {carouselEpisodes.map((ep) => {
              const hasValidEpYouTube = isValidYouTubeUrl(ep.youtubeUrl);

              return (
                <AnimatedCardWrapper
                  key={ep.id}
                  index={0}
                  className="w-[82vw] sm:w-[290px] md:w-[310px] shrink-0 flex flex-col rounded-2xl bg-white/10 border border-white/15 overflow-hidden"
                >
                  <Link
                    href={`/news-and-stories/podcast/${ep.slug}`}
                    className="relative h-44 w-full overflow-hidden bg-black/30 block"
                  >
                    <LazyImage
                      src={ep.thumbnailUrl}
                      alt={`${ep.title} — UDBHAV Podcast cover`}
                      fill
                      sizes="310px"
                      className="object-cover group-hover:scale-[1.025]"
                    />

                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-heading font-bold uppercase bg-[#439B25] text-white">
                        {ep.episodeNumber}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 z-10">
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-black/70 text-white backdrop-blur-sm">
                        <Clock className="w-3 h-3 text-[#439B25]" />
                        {ep.duration}
                      </span>
                    </div>

                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors duration-300">
                      <div className="w-12 h-12 rounded-full bg-[#439B25] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                  </Link>

                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <Link href={`/news-and-stories/podcast/${ep.slug}`} className="block">
                      <div className="text-xs font-bold uppercase text-[#439B25] mb-1 truncate">
                        Guest: {ep.guest.fullName}
                      </div>
                      <h4 className="font-heading text-base font-bold text-white leading-snug line-clamp-2 group-hover:text-[#439B25] transition-colors mb-2">
                        {ep.title}
                      </h4>
                      <p className="text-xs text-white/75 line-clamp-2">
                        {ep.guest.role}
                      </p>
                    </Link>

                    <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/80">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#439B25]" />
                        {ep.releaseDate}
                      </span>
                      {hasValidEpYouTube ? (
                        <a
                          href={ep.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-[#439B25] hover:underline inline-flex items-center gap-1"
                        >
                          Watch Episode →
                        </a>
                      ) : (
                        <span className="font-semibold text-white/50">
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </div>
                </AnimatedCardWrapper>
              );
            })}
          </div>
        </div>

        {/* Follow the Conversation — YouTube Platform */}
        <div className="pt-8 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="font-heading text-lg font-bold text-white">
              Follow the Conversation on YouTube
            </h4>
            <p className="text-xs sm:text-sm text-white/75 mt-0.5">
              Watch all full video episodes and community conversations on our
              official channel.
            </p>
          </div>

          <div className="flex items-center justify-center">
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs sm:text-sm font-semibold text-white transition-all inline-flex items-center gap-2 shadow-sm hover:shadow"
            >
              <Tv className="w-4 h-4 text-[#439B25]" />
              Official YouTube Channel
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default UDBHAVPodcastSection;
