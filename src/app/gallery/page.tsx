import type { Metadata } from "next";

import { GalleryHeroSection } from "@/components/gallery/GalleryHeroSection";
import { PhotoGridSection } from "@/components/gallery/PhotoGridSection";
import { METADATA } from "@/constants/metadata";
import { listPublicPhotosAction, getPublicGalleryFiltersAction, getRandomPublicPhotosAction } from "@/features/gallery/actions";
import type { PublicGallerySort } from "@/features/gallery/repository";
import { systemSettingsRepository } from "@/features/system_settings/repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Explore moments from UDBHAV Foundation programmes, community initiatives, events and volunteer activities.",
  alternates: {
    canonical: `${METADATA.BASE_URL}/gallery`,
  },
  openGraph: {
    title: "Gallery",
    description:
      "Explore moments from UDBHAV Foundation programmes, community initiatives, events and volunteer activities.",
    url: `${METADATA.BASE_URL}/gallery`,
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

  const [photosResult, filtersResult, heroPhotosResult, heroBgResult] = await Promise.all([
    listPublicPhotosAction(
      { page: 1, limit: page * 16 }, 
      { program_id, event_id, search },
      sort
    ),
    getPublicGalleryFiltersAction(),
    getRandomPublicPhotosAction(21),
    systemSettingsRepository.getSettingByKey('gallery_hero_background_image')
  ]);
  
  const photosData = photosResult.success && photosResult.data ? photosResult.data : { data: [], total: 0, page: 1, limit: 16 };
  const filterOptions = filtersResult.success && filtersResult.data ? filtersResult.data : { programs: [], events: [] };
  const heroPhotos = heroPhotosResult.success && heroPhotosResult.data ? heroPhotosResult.data : [];

  let heroBgImage = null;
  if (heroBgResult.data && heroBgResult.data.value) {
    try {
      heroBgImage = JSON.parse(heroBgResult.data.value);
    } catch {
      heroBgImage = heroBgResult.data.value;
    }
    if (heroBgImage === '""' || heroBgImage === '') {
      heroBgImage = null;
    }
  }

  return (
    <>
      <h1 className="sr-only">Impact Gallery of UDBHAV Foundation</h1>
      <GalleryHeroSection heroPhotos={heroPhotos} backgroundImage={heroBgImage} />
      <PhotoGridSection 
        initialPhotos={photosData.data} 
        totalPhotos={photosData.total}
        filterOptions={filterOptions}
        currentPage={page}
      />
    </>
  );
}
