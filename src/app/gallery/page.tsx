import type { Metadata } from "next";

import { AlbumGridSection } from "@/components/gallery/AlbumGridSection";
import { GalleryHeroSection } from "@/components/gallery/GalleryHeroSection";
import { GalleryStatsSection } from "@/components/gallery/GalleryStatsSection";
import { listAlbums } from "@/features/gallery/actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Impact Gallery | UDBHAV Foundation",
  description:
    "Explore authentic visual moments and photographic records from UDBHAV Foundation's 11 Index Programmes, community initiatives, and volunteer activities across Odisha.",
  alternates: {
    canonical: "https://udbhavfoundation.org/gallery",
  },
  openGraph: {
    title: "Impact Gallery | UDBHAV Foundation",
    description:
      "Explore authentic visual moments and photographic records from UDBHAV Foundation's programmes and community initiatives across Odisha.",
    url: "https://udbhavfoundation.org/gallery",
    siteName: "UDBHAV Foundation",
    locale: "en_IN",
    type: "website",
  },
};

export default async function GalleryPage() {
  const result = await listAlbums({ page: 1, limit: 50 });
  const albums = result.success && result.data ? result.data.data : [];

  return (
    <>
      {/* 1. Compact Gallery Hero */}
      <GalleryHeroSection />

      {/* 2. Dynamic Gallery Statistics Row */}
      <GalleryStatsSection />

      {/* 3. Database-Backed Album Collections Grid */}
      <AlbumGridSection albums={albums} />
    </>
  );
}
