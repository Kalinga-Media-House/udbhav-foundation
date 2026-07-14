import React from "react";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { OurMomentsGallerySection } from "@/components/home/OurMomentsGallerySection";
import { GoverningBodySection } from "@/components/home/GoverningBodySection";
import { UpcomingEventsSection } from "@/components/home/UpcomingEventsSection";
import { SupportOurInitiativesSection } from "@/components/home/SupportOurInitiativesSection";
import { OurPartnersSection } from "@/components/home/OurPartnersSection";

/**
 * UDBHAV Foundation Homepage
 * Composed cleanly with modular sections in exact sequence:
 * 1. Hero
 * 2. Our Moments — Infinite Auto-Scrolling Gallery
 * 3. Governing Body
 * 4. Support Our Initiatives — Donation Carousel
 * 5. Our Partners (immediately above Footer)
 * 6. Footer (rendered via layout.tsx)
 */
export default function Home() {
  return (
    <main className="flex-1 flex flex-col bg-warm-white text-text-primary">
      <HeroCarousel />
      <OurMomentsGallerySection />
      <UpcomingEventsSection />
      <GoverningBodySection />
      <SupportOurInitiativesSection />
      <OurPartnersSection />
    </main>
  );
}






