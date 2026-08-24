/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from 'next';
import React from 'react';

import { PodcastHub } from '@/components/podcast/PodcastHub';
import { podcastRepository } from '@/features/podcasts/repository';
import { siteLinksRepository } from '@/features/site-links/repository';

export const metadata: Metadata = {
  title: 'Podcast',
  description: 'Listen to conversations, experiences and inspiring stories from the UDBHAV community.',
};

export const revalidate = 60; // Revalidate every 60 seconds

export default async function PodcastPage() {
  const [result, youtubeSetting] = await Promise.all([
    podcastRepository.list(
      { page: 1, limit: 100 }, 
      { status: 'Published', visibility: 'public' }
    ),
    siteLinksRepository.getActiveBySlug('youtube_channel')
  ]);

  const podcasts = result.data || [];

  return (
    <>
      <h1 className="sr-only">UDBHAV Foundation Podcast</h1>
      <PodcastHub initialPodcasts={podcasts as any[]} youtubeUrl={youtubeSetting?.url} />
    </>
  );
}
