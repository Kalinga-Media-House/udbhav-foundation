import type { Metadata } from 'next';
import React from 'react';

import { NewsAndStoriesHub } from '@/components/news-and-stories/NewsAndStoriesHub';
import { listPublicArticles } from '@/features/news/actions';
import { UPCOMING_EVENTS, PODCAST_EPISODES } from '@/data/news-data';

export const metadata: Metadata = {
  title:
    'News, Stories & UDBHAV Podcast | UDBHAV FOUNDATION — Stories That Inspire. Actions That Create Change.',
  description:
    'Stay connected with UDBHAV FOUNDATION through upcoming community events, daily grassroots programme updates across 11 Index Programmes, inspiring transformation stories, and our official UDBHAV Podcast.',
  openGraph: {
    title: 'News, Stories & UDBHAV Podcast | UDBHAV FOUNDATION',
    description:
      'Explore stories of hope, grassroots action across Odisha, community impact updates, and conversations with young changemakers on the UDBHAV Podcast.',
    type: 'website',
  },
};

export default async function NewsAndStoriesPage() {
  // Fetch dynamic articles
  const result = await listPublicArticles({ page: 1, limit: 100 });
  const articles = result.success && result.data ? result.data.data : [];

  // Pass all data to the client-side Hub component
  return (
    <main className="bg-pure-white flex min-h-screen flex-col">
      <NewsAndStoriesHub 
        articles={articles} 
        events={UPCOMING_EVENTS} 
        podcasts={PODCAST_EPISODES} 
      />
    </main>
  );
}
