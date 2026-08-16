import type { Metadata } from 'next';
import React from 'react';

import { NewsAndStoriesHub } from '@/components/news-and-stories/NewsAndStoriesHub';
import { listPublicArticles } from '@/features/news/actions';
import { listEvents } from '@/features/events/actions';
import { listPublicPodcasts } from '@/features/podcasts/actions';

export const dynamic = 'force-dynamic';

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
  const articlesResult = await listPublicArticles({ page: 1, limit: 100 });
  const articles = articlesResult.success && articlesResult.data ? articlesResult.data.data : [];

  // Fetch dynamic events
  const eventsResult = await listEvents({ page: 1, limit: 100 }, { status: 'Published' });
  const rawEvents = eventsResult.success && eventsResult.data ? eventsResult.data.data : [];
  
  const publicEvents = rawEvents
    .filter((e) => e.visibility === 'public')
    .map((e) => {
      const date = new Date(e.start_time || e.created_at);
      const isPast = new Date() > new Date(e.end_time || e.start_time || e.created_at);
      return {
        id: e.id,
        title: e.title,
        slug: e.slug,
        category: e.event_type || 'Event',
        description: e.description || e.subtitle || '',
        imageUrl: (e as any).cover_image?.cdn_url || '/placeholder-image.jpg',
        location: e.venue_name || e.city || 'Online',
        eventDate: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        dayMonthBadge: {
          day: date.getDate().toString().padStart(2, '0'),
          month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
        },
        startTime: e.start_time ? new Date(e.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : undefined,
        endTime: e.end_time ? new Date(e.end_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : undefined,
        registrationStatus: isPast ? 'Completed' : 'Registration Open',
      };
    });

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
    <main className="bg-pure-white flex min-h-screen flex-col">
      <NewsAndStoriesHub 
        articles={articles} 
        events={publicEvents} 
        podcasts={podcasts} 
      />
    </main>
  );
}
