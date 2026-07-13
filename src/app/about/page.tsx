import type { Metadata } from "next";
import { AboutHeroSection } from "@/components/about/AboutHeroSection";
import { AboutOverviewSection } from "@/components/about/AboutOverviewSection";
import { OurJourneySection } from "@/components/about/OurJourneySection";
import { AboutVisionMissionSection } from "@/components/about/AboutVisionMissionSection";
import { FoundersMessageSection } from "@/components/home/FoundersMessageSection";
import { OurCoreValuesSection } from "@/components/home/OurCoreValuesSection";
import { UsfactImpactSection } from "@/components/about/UsfactImpactSection";
import { OurApproachSection } from "@/components/about/OurApproachSection";
import { AboutCtaSection } from "@/components/about/AboutCtaSection";

export const metadata: Metadata = {
  title: "About Us — UDBHAV Foundation",
  description:
    "Learn about UDBHAV Foundation's history since 2020, our mission, vision, core values, student front USFACT, and grassroots community impact across Odisha.",
};

export default function AboutPage() {
  return (
    <div className="w-full overflow-hidden bg-pure-white">
      {/* 1. Compact Page Hero */}
      <AboutHeroSection />

      {/* 2. Section 1 — About UDBHAV Overview & Impact Stats */}
      <AboutOverviewSection />

      {/* 3. Section 2 — Our Journey & Milestones */}
      <OurJourneySection />

      {/* 4. Section 3 — Vision & Mission */}
      <AboutVisionMissionSection />

      {/* 5. Section 4 — Founder's Message (Reused approved compact blue gradient card) */}
      <FoundersMessageSection />

      {/* 6. Section 5 — Our Core Values (Reused 10 values with compact mobile auto-scrolling container) */}
      <OurCoreValuesSection />

      {/* 7. Section 6 — USFACT & Community Impact */}
      <UsfactImpactSection />

      {/* 8. Section 7 — Our Approach */}
      <OurApproachSection />

      {/* 9. Final Call to Action */}
      <AboutCtaSection />
    </div>
  );
}
