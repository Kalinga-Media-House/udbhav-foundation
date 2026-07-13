import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Tv,
  Award,
  Play,
} from "lucide-react";
import { Container } from "@/components/shared/Container";
import { PODCAST_EPISODES } from "@/data/news-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const episode = PODCAST_EPISODES.find((p) => p.slug === slug);

  if (!episode) {
    return {
      title: "Podcast Episode Not Found | UDBHAV FOUNDATION",
    };
  }

  return {
    title: `${episode.episodeNumber}: ${episode.title} | UDBHAV FOUNDATION Podcast`,
    description: episode.excerpt,
  };
}

export default async function PodcastEpisodePage({ params }: PageProps) {
  const { slug } = await params;
  const episode = PODCAST_EPISODES.find((p) => p.slug === slug);

  if (!episode) {
    notFound();
  }

  const hasValidYouTube = isValidYouTubeUrl(episode.youtubeUrl);

  return (
    <main className="min-h-screen py-12 sm:py-16 md:py-20 bg-[#12245F] text-white">
      <Container>
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/news-and-stories#udbhav-podcast"
            className="inline-flex items-center gap-2 text-sm font-heading font-semibold text-white/80 hover:text-[#439B25] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to UDBHAV Podcast
          </Link>
        </div>

        {/* Hero Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center rounded-3xl bg-white/10 border border-white/15 p-6 sm:p-8 lg:p-10 backdrop-blur-md shadow-2xl max-w-5xl mx-auto">
          {/* Left Thumbnail */}
          <div className="lg:col-span-5">
            <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-black/40 border border-white/15 shadow-xl group">
              <Image
                src={episode.thumbnailUrl}
                alt={`${episode.title} — UDBHAV Podcast cover`}
                fill
                sizes="(max-width: 1024px) 100vw, 400px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                priority
              />

              {/* Episode Number Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-heading font-bold uppercase bg-[#439B25] text-white shadow-md">
                  {episode.episodeNumber}
                </span>
              </div>

              {/* Duration Badge */}
              <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-black/70 text-white backdrop-blur-sm">
                <Clock className="w-3.5 h-3.5 text-[#439B25]" />
                {episode.duration}
              </div>

              {/* Center Play Overlay Link */}
              {hasValidYouTube ? (
                <a
                  href={episode.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Watch ${episode.title} on YouTube`}
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

          {/* Right Info */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#439B25] uppercase tracking-wider mb-2">
                <Award className="w-4 h-4" />
                <span>Guest: {episode.guest.fullName}</span>
              </div>

              <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
                {episode.title}
              </h1>

              <div className="flex items-center gap-4 text-xs sm:text-sm text-white/70 mb-5">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#439B25]" />
                  Released {episode.releaseDate}
                </span>
                <span>•</span>
                <span>Role: {episode.guest.role}</span>
              </div>

              <p className="text-sm sm:text-base text-white/85 leading-relaxed mb-6">
                {episode.description}
              </p>

              <div className="flex flex-wrap items-center gap-2 mb-6">
                {episode.topics.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-white/90"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Single Primary Action Button */}
            <div className="pt-4 border-t border-white/15">
              {hasValidYouTube ? (
                <a
                  href={episode.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-heading text-sm sm:text-base font-semibold text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all w-full sm:w-auto cursor-pointer"
                  style={{ background: "#439B25" }}
                >
                  <Tv className="w-4 h-4" />
                  Watch on YouTube
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
      </Container>
    </main>
  );
}
