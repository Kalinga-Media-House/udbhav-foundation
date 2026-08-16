import { Metadata } from 'next';
import React from 'react';
import { PodcastHub } from '@/components/podcast/PodcastHub';
import { podcastRepository } from '@/features/podcasts/repository';

export const metadata: Metadata = {
  title: 'Podcast | UDBHAV FOUNDATION',
  description: 'Listen to conversations, experiences and inspiring stories from the UDBHAV community.',
};

export const revalidate = 60; // Revalidate every 60 seconds

export default async function PodcastPage() {
  const result = await podcastRepository.list(
    { page: 1, limit: 100 }, 
    { status: 'Published', visibility: 'public' }
  );

  const podcasts = result.data || [];

  return <PodcastHub initialPodcasts={podcasts as any[]} />;
}
