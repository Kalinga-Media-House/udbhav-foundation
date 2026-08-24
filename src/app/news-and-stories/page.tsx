/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from 'next';
import React from 'react';

import { NewsAndStoriesHub } from '@/components/news-and-stories/NewsAndStoriesHub';
import { listPublicArticles } from '@/features/news/actions';
import { listPublicPodcasts } from '@/features/podcasts/actions';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'News & Stories',
  description: 'Read the latest UDBHAV Foundation news, community stories, events and updates from our initiatives and programmes.',
  openGraph: {
    title: 'News & Stories',
    description: 'Read the latest UDBHAV Foundation news, community stories, events and updates from our initiatives and programmes.',
    type: 'website',
  },
};

export default async function NewsAndStoriesPage() {
  // Fetch dynamic articles (including Events)
  const articlesResult = await listPublicArticles({ page: 1, limit: 100 });
  const articles = articlesResult.success && articlesResult.data ? articlesResult.data.data : [];

  // Fetch dynamic podcasts
  const podcastsResult = await listPublicPodcasts();
  const rawPodcasts = podcastsResult.success && podcastsResult.data ? podcastsResult.data.data : [];
  
  const podcasts: any[] = rawPodcasts.map((p: any) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    episodeNumber: p.episode_number || '',
    excerpt: p.excerpt || p.description || '',
    description: p.description || '',
    thumbnailUrl: (p as any).thumbnail?.cdn_url || '/placeholder-image.jpg',
    duration: p.duration || '00:00',
    releaseDate: p.release_date ? new Date(p.release_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
    youtubeUrl: p.youtube_url || p.audio_url || '',
    topics: p.topics || [],
    guest: {
      id: 'guest-' + p.id,
      fullName: p.guest_name || 'Special Guest',
      role: p.guest_role || '',
      profilePhotoUrl: p.guest_profile_photo_url || '/placeholder-image.jpg',
      achievement: ''
    }
  }));

  return (
    <main className="min-h-screen bg-pure-white flex flex-col">
      <h1 className="sr-only">News, Stories & UDBHAV Podcast</h1>
      <NewsAndStoriesHub articles={articles} podcasts={podcasts} />
    </main>
  );
}