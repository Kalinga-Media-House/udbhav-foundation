import type { Metadata } from "next";

import { GalleryHeroSection } from "@/components/gallery/GalleryHeroSection";
import { PhotoGridSection } from "@/components/gallery/PhotoGridSection";
import { listPublicPhotosAction, getPublicGalleryFiltersAction, getRandomPublicPhotosAction } from "@/features/gallery/actions";
import type { PublicGallerySort } from "@/features/gallery/repository";

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

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function GalleryPage({ searchParams }: { searchParams: SearchParams }) {
  const resolvedParams = await searchParams;
  
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page, 10) || 1 : 1;
  const sort = (typeof resolvedParams.sort === 'string' ? resolvedParams.sort : 'newest') as PublicGallerySort;
  const program_id = typeof resolvedParams.program === 'string' ? resolvedParams.program : undefined;
  const event_id = typeof resolvedParams.event === 'string' ? resolvedParams.event : undefined;
  const search = typeof resolvedParams.search === 'string' ? resolvedParams.search : undefined;

  const [photosResult, filtersResult, heroPhotosResult] = await Promise.all([
    listPublicPhotosAction(
      { page: 1, limit: page * 16 }, 
      { program_id, event_id, search },
      sort
    ),
    getPublicGalleryFiltersAction(),
    getRandomPublicPhotosAction(21)
  ]);
  
  const photosData = photosResult.success && photosResult.data ? photosResult.data : { data: [], total: 0, page: 1, limit: 16 };
  const filterOptions = filtersResult.success && filtersResult.data ? filtersResult.data : { programs: [], events: [] };
  const heroPhotos = heroPhotosResult.success && heroPhotosResult.data ? heroPhotosResult.data : [];

  return (
    <>
      <GalleryHeroSection heroPhotos={heroPhotos} />
      <PhotoGridSection 
        initialPhotos={photosData.data} 
        totalPhotos={photosData.total}
        filterOptions={filterOptions}
        currentPage={page}
      />
    </>
  );
}
