import {
  ArrowLeft,
  Clock,
  Calendar,
  Tv,
  Award,
  Play,
  Share2
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import { format } from "date-fns";

import { Container } from "@/components/shared/Container";
import { podcastRepository } from "@/features/podcasts/repository";

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

function extractYouTubeVideoId(url: string): string | null {
  if (!isValidYouTubeUrl(url)) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await podcastRepository.findBySlug(slug);
  
  if (result.error || !result.data) {
    return {
      title: "Podcast Episode Not Found | UDBHAV FOUNDATION",
    };
  }

  return {
    title: `${result.data.title} | UDBHAV Podcast`,
    description: result.data.excerpt || result.data.description || "Listen to this podcast episode on UDBHAV Foundation.",
  };
}

export default async function PodcastEpisodePage({ params }: PageProps) {
  const { slug } = await params;
  const result = await podcastRepository.findBySlug(slug);
  
  if (result.error || !result.data) {
    notFound();
  }

  const podcast = result.data;
  const videoId = podcast.youtube_url ? extractYouTubeVideoId(podcast.youtube_url) : null;
  const formattedDate = podcast.release_date ? format(new Date(podcast.release_date), "MMMM d, yyyy") : "";

  return (
    <div className="bg-[#F8FAF7] min-h-screen pb-24">
      {/* 1. Header Area with Back button */}
      <div className="bg-[#20256F] pt-8 pb-32">
        <Container>
          <div className="flex items-center gap-2 text-white/70 hover:text-white transition-colors w-fit mb-8 group">
            <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
            <Link href="/podcast" className="text-sm font-semibold">Back to all episodes</Link>
          </div>
          
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[#4FAF32] bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">
                UDBHAV PODCAST
              </span>
              {podcast.episode_number && (
                <span className="text-white/80 bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  EPISODE {podcast.episode_number}
                </span>
              )}
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6 leading-tight">
              {podcast.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-white/70 text-sm font-medium">
              {formattedDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#4FAF32]" />
                  {formattedDate}
                </div>
              )}
              {podcast.duration && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#4FAF32]" />
                  {podcast.duration}
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>

      {/* 2. Content Area */}
      <Container className="relative -mt-24 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Main Content (Video/Audio + Description) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Media Player */}
            <div className="bg-[#181C5A] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl aspect-video relative border border-white/10">
              {videoId ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                ></iframe>
              ) : podcast.thumbnail?.cdn_url ? (
                <div className="relative w-full h-full group">
                   <Image
                    src={podcast.thumbnail.cdn_url}
                    alt={podcast.title}
                    fill
                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    {podcast.youtube_url && (
                      <a 
                        href={podcast.youtube_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-[#4FAF32] text-white rounded-full p-6 shadow-lg shadow-[#4FAF32]/40 hover:scale-110 transition-transform"
                      >
                        <Play className="h-8 w-8 fill-current ml-1" />
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                  <Play className="h-16 w-16 text-[#4FAF32] opacity-30" />
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-heading font-bold text-[#20256F] mb-6">About This Episode</h2>
              <div className="prose prose-lg prose-gray max-w-none text-gray-600">
                {podcast.description ? (
                  <p className="whitespace-pre-wrap">{podcast.description}</p>
                ) : (
                  <p>{podcast.excerpt}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Quick Actions */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-heading font-bold text-[#20256F] mb-6">Listen & Share</h3>
              <div className="flex flex-col gap-4">
                {podcast.youtube_url && !videoId && (
                   <a 
                    href={podcast.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full px-6 py-3.5 bg-[#FF0000]/10 hover:bg-[#FF0000]/20 text-[#FF0000] rounded-xl font-bold transition-colors"
                  >
                    <Tv className="h-5 w-5 mr-2" />
                    Watch on YouTube
                  </a>
                )}
                {podcast.audio_url && (
                  <a 
                    href={podcast.audio_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full px-6 py-3.5 bg-[#4FAF32] hover:bg-[#3E8B28] text-white rounded-xl font-bold transition-colors shadow-sm"
                  >
                    <Play className="h-5 w-5 mr-2 fill-current" />
                    Listen to Audio
                  </a>
                )}
              </div>
            </div>

            {/* Tags/Topics */}
            {podcast.topics && podcast.topics.length > 0 && (
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                <h3 className="text-lg font-heading font-bold text-[#20256F] mb-6">Topics Discussed</h3>
                <div className="flex flex-wrap gap-2">
                  {podcast.topics.map((topic, i) => (
                    <span 
                      key={i}
                      className="px-4 py-2 bg-gray-50 border border-gray-100 text-gray-600 rounded-lg text-sm font-medium"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
        </div>
      </Container>
    </div>
  );
}
