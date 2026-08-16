import {
  ArrowLeft,
  Clock,
  Calendar,
  Tv,
  Play,
  VideoOff
} from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import { format } from "date-fns";

import { Container } from "@/components/shared/Container";
import { podcastRepository } from "@/features/podcasts/repository";
import { extractYouTubeVideoId } from "@/utils/youtube";
import { PodcastShare } from "@/components/podcast/PodcastShare";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  const result = await podcastRepository.findBySlug(slug);
  
  if (result.error || !result.data) {
    return {
      title: "Podcast Episode Not Found | UDBHAV FOUNDATION",
    };
  }

  const podcast = result.data;
  const title = `${podcast.title} | UDBHAV Foundation`;
  const description = podcast.excerpt || podcast.description || "Listen to this podcast episode on UDBHAV Foundation.";
  
  // Try to use podcast thumbnail, otherwise fallback to parent generic og image (or nothing)
  const imageUrl = podcast.thumbnail?.cdn_url || "https://udbhavfoundation.in/default-social.jpg";
  const url = `https://udbhavfoundation.in/podcast/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      siteName: "UDBHAV Foundation",
      images: [
        {
          url: imageUrl,
          width: 1280,
          height: 720,
          alt: podcast.title,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
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
  const shareDesc = podcast.excerpt || podcast.description || "Check out this podcast episode.";

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
                  src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&rel=0`}
                  title={podcast.title || "YouTube video player"}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                ></iframe>
              ) : (
                <div className="relative w-full h-full flex flex-col items-center justify-center text-center group">
                  {podcast.thumbnail?.cdn_url && (
                    <>
                      <Image
                        src={podcast.thumbnail.cdn_url}
                        alt={podcast.title}
                        fill
                        className="object-cover opacity-30 group-hover:opacity-40 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-black/60" />
                    </>
                  )}
                  <div className="relative z-10 flex flex-col items-center p-6">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                      <VideoOff className="h-8 w-8 text-white/80" />
                    </div>
                    <h3 className="text-xl font-heading font-bold text-white mb-2">Video coming soon</h3>
                    <p className="text-white/70 text-sm max-w-sm">
                      This podcast episode is available, but its video has not been added yet.
                    </p>
                  </div>
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
                  <p className="whitespace-pre-wrap">{podcast.excerpt}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Listen & Share */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-heading font-bold text-[#20256F] mb-2">Listen & Share</h3>
              <p className="text-gray-500 text-sm mb-6">Share this episode with your community.</p>
              
              <PodcastShare 
                title={podcast.title} 
                description={shareDesc} 
                slug={podcast.slug} 
              />
              
              {/* Optional external platform links could go below */}
              {podcast.youtube_url && !videoId && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <a 
                    href={podcast.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full px-6 py-3 bg-[#FF0000]/10 hover:bg-[#FF0000]/20 text-[#FF0000] rounded-xl font-semibold transition-colors text-sm"
                  >
                    <Tv className="h-4 w-4 mr-2" />
                    Watch on YouTube
                  </a>
                </div>
              )}
              {podcast.audio_url && (
                <div className="mt-4">
                  <a 
                    href={podcast.audio_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full px-6 py-3 bg-[#4FAF32]/10 hover:bg-[#4FAF32]/20 text-[#4FAF32] rounded-xl font-semibold transition-colors text-sm"
                  >
                    <Play className="h-4 w-4 mr-2 fill-current" />
                    Listen to Audio
                  </a>
                </div>
              )}
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
