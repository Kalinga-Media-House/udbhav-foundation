import React from 'react';

import { GoverningBodySection } from '@/components/home/GoverningBodySection';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { OurMomentsGallerySection } from '@/components/home/OurMomentsGallerySection';
import { OurPartnersSection } from '@/components/home/OurPartnersSection';
import { SupportOurInitiativesSection } from '@/components/home/SupportOurInitiativesSection';
import { UpcomingEventsSection } from '@/components/home/UpcomingEventsSection';

/**
 * UDBHAV Foundation Homepage
 * Composed cleanly with modular sections in exact sequence:
 * 1. Hero Carousel
 * 2. Our Moments — Infinite Auto-Scrolling Gallery
 * 3. Upcoming Events
 * 4. Governing Body
 * 5. Support Our Initiatives — Donation Carousel
 * 6. Our Partners
 */
export default function Home() {
  return (
    <main className="bg-warm-white text-text-primary flex flex-1 flex-col">
      <HeroCarousel />
      <OurMomentsGallerySection />
      <UpcomingEventsSection />
      <GoverningBodySection />
      <SupportOurInitiativesSection />
      <OurPartnersSection />
    </main>
  );
}
