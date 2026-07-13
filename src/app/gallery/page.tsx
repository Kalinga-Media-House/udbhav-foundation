import type { Metadata } from "next";
import { GalleryHeroSection } from "@/components/gallery/GalleryHeroSection";
import { GalleryStatsSection } from "@/components/gallery/GalleryStatsSection";
import { ImpactGallerySection } from "@/components/gallery/ImpactGallerySection";

export const metadata: Metadata = {
  title: "Impact Gallery | UDBHAV Foundation",
  description:
    "Explore authentic visual moments and photographic records from UDBHAV Foundation's 11 Index Programmes, community initiatives, and volunteer activities across Odisha.",
};

export default function GalleryPage() {
  return (
    <>
      {/* 1. Compact Gallery Hero */}
      <GalleryHeroSection />

      {/* 2. Dynamic Gallery Statistics Row */}
      <GalleryStatsSection />

      {/* 3. Programme Filters, Search/Sort Toolbar, Masonry Gallery & Lightbox */}
      <ImpactGallerySection />
    </>
  );
}
