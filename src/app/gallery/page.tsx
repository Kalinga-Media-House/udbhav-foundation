import type { Metadata } from "next";

import { GalleryHeroSection } from "@/components/gallery/GalleryHeroSection";
import { GalleryStatsSection } from "@/components/gallery/GalleryStatsSection";
import { PhotoGridSection } from "@/components/gallery/PhotoGridSection";
import { getGalleryStatsAction, listPublicPhotosAction } from "@/features/gallery/actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Impact Gallery | UDBHAV Foundation",
  description:
    "Explore authentic visual moments and photographic records from UDBHAV Foundation's programmes and community initiatives across Odisha.",
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
  const [statsResult, photosResult] = await Promise.all([
    getGalleryStatsAction(),
    listPublicPhotosAction({ page: 1, limit: 100 })
  ]);
  
  const stats = statsResult.success && statsResult.data ? statsResult.data : {
    totalPhotos: 0,
    eventsCovered: 0,
    programmesRepresented: 0,
    locationsReached: 0
  };
  
  const photos = photosResult.success && photosResult.data ? photosResult.data.data : [];

  return (
    <>
      <GalleryHeroSection />
      <GalleryStatsSection stats={stats} />
      <PhotoGridSection photos={photos} />
    </>
  );
}
