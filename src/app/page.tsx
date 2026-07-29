import React from "react";

import { AboutUdbhavSection } from "@/components/home/AboutUdbhavSection";
import { AdvisoryBoardSection } from "@/components/home/AdvisoryBoardSection";
import { FoundersMessageSection } from "@/components/home/FoundersMessageSection";
import { GoverningBodySection } from "@/components/home/GoverningBodySection";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { JoinOurCommunitySection } from "@/components/home/JoinOurCommunitySection";
import { OurCoreValuesSection } from "@/components/home/OurCoreValuesSection";
import { OurMomentsGallerySection } from "@/components/home/OurMomentsGallerySection";
import { OurPartnersSection } from "@/components/home/OurPartnersSection";
import { SupportOurInitiativesSection } from "@/components/home/SupportOurInitiativesSection";
import { UpcomingEventsSection } from "@/components/home/UpcomingEventsSection";
import { VisionMissionSection } from "@/components/home/VisionMissionSection";

/**
 * UDBHAV Foundation Homepage
 * Composed cleanly with modular sections in exact sequence:
 * 1. Hero Carousel
 * 2. About UDBHAV
 * 3. Founder's Message
 * 4. Vision & Mission
 * 5. Our Moments — Infinite Auto-Scrolling Gallery
 * 6. Our Core Values
 * 7. Upcoming Events
 * 8. Governing Body
 * 9. Advisory Board
 * 10. Support Our Initiatives — Donation Carousel
 * 11. Our Partners
 * 12. Join Our Community (CTA)
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
      <UpcomingEventsSection />
      <GoverningBodySection />
      <AdvisoryBoardSection />
      <SupportOurInitiativesSection />
      <OurPartnersSection />
      <JoinOurCommunitySection />
    </main>
  );
}
