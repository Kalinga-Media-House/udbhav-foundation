import React from "react";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { AboutUdbhavSection } from "@/components/home/AboutUdbhavSection";
import { FoundersMessageSection } from "@/components/home/FoundersMessageSection";
import { VisionMissionSection } from "@/components/home/VisionMissionSection";
import { OurMomentsGallerySection } from "@/components/home/OurMomentsGallerySection";
import { OurCoreValuesSection } from "@/components/home/OurCoreValuesSection";
import { JoinOurCommunitySection } from "@/components/home/JoinOurCommunitySection";
import { GoverningBodySection } from "@/components/home/GoverningBodySection";
import { AdvisoryBoardSection } from "@/components/home/AdvisoryBoardSection";
import { SupportOurInitiativesSection } from "@/components/home/SupportOurInitiativesSection";
import { OurPartnersSection } from "@/components/home/OurPartnersSection";

/**
 * UDBHAV Foundation Homepage
 * Composed cleanly with modular sections in exact sequence:
 * 1. Hero
 * 2. About UDBHAV
 * 3. Founder's Message
 * 4. Vision & Mission
 * 5. Our Moments — Infinite Auto-Scrolling Gallery
 * 6. Our Core Values
 * 7. Join Our Community
 * 8. Governing Body
 * 9. Advisory Board
 * 10. Support Our Initiatives — Donation Carousel
 * 11. Our Partners (immediately above Footer)
 * 12. Footer (rendered via layout.tsx)
 */
export default function Home() {
  return (
    <main className="flex-1 flex flex-col bg-warm-white text-text-primary">
      <HeroCarousel />
      <AboutUdbhavSection />
      <FoundersMessageSection />
      <VisionMissionSection />
      <OurMomentsGallerySection />
      <OurCoreValuesSection />
      <JoinOurCommunitySection />
      <GoverningBodySection />
      <AdvisoryBoardSection />
      <SupportOurInitiativesSection />
      <OurPartnersSection />
    </main>
  );
}






