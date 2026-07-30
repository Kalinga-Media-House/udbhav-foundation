import type { Metadata } from 'next';
import React from 'react';

import { CommunityCTASection } from '@/components/news-and-stories/CommunityCTASection';
import { ImpactStoriesSection } from '@/components/news-and-stories/ImpactStoriesSection';
import { LatestUpdatesSection } from '@/components/news-and-stories/LatestUpdatesSection';
import { NewsHeroSection } from '@/components/news-and-stories/NewsHeroSection';
import { UDBHAVPodcastSection } from '@/components/news-and-stories/UDBHAVPodcastSection';
import { UpcomingEventsSection } from '@/components/news-and-stories/UpcomingEventsSection';
import { listPublicArticles } from '@/features/news/actions';

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
  const result = await listPublicArticles({ page: 1, limit: 50 });
  const articles = result.success && result.data ? result.data.data : [];

  return (
    <main className="bg-pure-white flex min-h-screen flex-col">
      {/* 1. Compact News Hero */}
      <NewsHeroSection />

      {/* 3. Upcoming Events & Notifications */}
      <UpcomingEventsSection />

      {/* 4. Latest from UDBHAV (News, Activities & Community Updates) */}
      <LatestUpdatesSection articles={articles} />

      {/* 6. Impact Stories (Real People. Real Change.) */}
      <ImpactStoriesSection articles={articles} />

      {/* 7. UDBHAV Podcast (Voices That Inspire) */}
      <UDBHAVPodcastSection />

      {/* 8. Community CTA / Story Submission */}
      <CommunityCTASection />
    </main>
  );
}
