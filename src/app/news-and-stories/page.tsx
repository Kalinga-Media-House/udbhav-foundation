import React from "react";
import type { Metadata } from "next";
import { NewsHeroSection } from "@/components/news-and-stories/NewsHeroSection";
import { AnnouncementTickerSection } from "@/components/news-and-stories/AnnouncementTickerSection";
import { UpcomingEventsSection } from "@/components/news-and-stories/UpcomingEventsSection";
import { LatestUpdatesSection } from "@/components/news-and-stories/LatestUpdatesSection";
import { ProgrammeUpdatesSection } from "@/components/news-and-stories/ProgrammeUpdatesSection";
import { ImpactStoriesSection } from "@/components/news-and-stories/ImpactStoriesSection";
import { UDBHAVPodcastSection } from "@/components/news-and-stories/UDBHAVPodcastSection";
import { CommunityCTASection } from "@/components/news-and-stories/CommunityCTASection";

export const metadata: Metadata = {
  title:
    "News, Stories & UDBHAV Podcast | UDBHAV FOUNDATION — Stories That Inspire. Actions That Create Change.",
  description:
    "Stay connected with UDBHAV FOUNDATION through upcoming community events, daily grassroots programme updates across 11 Index Programmes, inspiring transformation stories, and our official UDBHAV Podcast.",
  openGraph: {
    title: "News, Stories & UDBHAV Podcast | UDBHAV FOUNDATION",
    description:
      "Explore stories of hope, grassroots action across Odisha, community impact updates, and conversations with young changemakers on the UDBHAV Podcast.",
    type: "website",
  },
};

export default function NewsAndStoriesPage() {
  return (
    <main className="min-h-screen flex flex-col bg-pure-white">
      {/* 1. Compact News Hero */}
      <NewsHeroSection />

      {/* 2. Important Announcement Ticker */}
      <AnnouncementTickerSection />

      {/* 3. Upcoming Events & Notifications */}
      <UpcomingEventsSection />

      {/* 4. Latest from UDBHAV (News, Activities & Community Updates) */}
      <LatestUpdatesSection />

      {/* 5. Programme Updates (From Our 11 Initiatives) */}
      <ProgrammeUpdatesSection />

      {/* 6. Impact Stories (Real People. Real Change.) */}
      <ImpactStoriesSection />

      {/* 7. UDBHAV Podcast (Voices That Inspire) */}
      <UDBHAVPodcastSection />

      {/* 8. Community CTA / Story Submission */}
      <CommunityCTASection />
    </main>
  );
}
