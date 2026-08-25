import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: { absolute: 'UDBHAV Foundation | Growing Together for an Inclusive Future' },
  description: 'UDBHAV Foundation works to build inclusive and resilient communities through education, mental well-being, environmental responsibility and collective action.',
  alternates: {
    canonical: '/',
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { OurMomentsGallerySection } from '@/components/home/OurMomentsGallerySection';
import { OurPartnersSection } from '@/components/home/OurPartnersSection';
import { ProgrammesSection } from '@/components/home/ProgrammesSection';
import { SupportOurInitiativesSection } from '@/components/home/SupportOurInitiativesSection';
import { getRandomPublicPhotosAction } from '@/features/gallery/actions';
import { getActiveHeroImages } from '@/features/hero/repository';
import { getActivePartners } from '@/features/partners/repository';

/**
 * UDBHAV Foundation Homepage
 * Composed cleanly with modular sections in exact sequence:
 * 1. Hero Carousel
 * 2. Our Moments — Infinite Auto-Scrolling Gallery
 * 3. Our Programmes
 * 4. Support Our Initiatives — Donation Carousel
 * 5. Our Partners
 */
export default async function Home() {
  const heroImages = await getActiveHeroImages('home_hero');
  const randomPhotosResult = await getRandomPublicPhotosAction(5);
  const galleryPhotos = randomPhotosResult.success && randomPhotosResult.data ? randomPhotosResult.data : [];
  const partners = await getActivePartners();

  return (
    <main className="bg-warm-white text-text-primary flex flex-1 flex-col">
      <HeroCarousel heroImages={heroImages} />
      <OurMomentsGallerySection galleryPhotos={galleryPhotos} />
      <ProgrammesSection />
      <SupportOurInitiativesSection />
      <OurPartnersSection partners={partners} />
    </main>
  );
}

