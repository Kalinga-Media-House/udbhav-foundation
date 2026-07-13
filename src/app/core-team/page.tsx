import type { Metadata } from "next";
import { CoreTeamHeroSection } from "@/components/core-team/CoreTeamHeroSection";
import { LeadershipIntroSection } from "@/components/core-team/LeadershipIntroSection";
import { FounderSpotlightSection } from "@/components/core-team/FounderSpotlightSection";
import { GoverningBodyGridSection } from "@/components/core-team/GoverningBodyGridSection";
import { HowWeLeadSection } from "@/components/core-team/HowWeLeadSection";
import { CoreTeamAdvisoryBoardSection } from "@/components/core-team/CoreTeamAdvisoryBoardSection";
import { LeadershipStructureSection } from "@/components/core-team/LeadershipStructureSection";
import { CoreTeamCtaSection } from "@/components/core-team/CoreTeamCtaSection";

export const metadata: Metadata = {
  title: "Core Team & Governance — UDBHAV Foundation",
  description:
    "Meet the dedicated leadership, Governing Body, Advisory Board, and community organizers guiding UDBHAV Foundation across Odisha.",
};

export default function CoreTeamPage() {
  return (
    <div className="w-full overflow-hidden bg-pure-white">
      {/* 1. Compact Core Team Hero */}
      <CoreTeamHeroSection />

      {/* 2. Leadership Introduction */}
      <LeadershipIntroSection />

      {/* 3. Founder Spotlight */}
      <FounderSpotlightSection />

      {/* 4. Governing Body Grid */}
      <GoverningBodyGridSection />

      {/* 5. Leadership Philosophy — How We Lead */}
      <HowWeLeadSection />

      {/* 6. Advisory Board */}
      <CoreTeamAdvisoryBoardSection />

      {/* 7. Leadership Structure */}
      <LeadershipStructureSection />

      {/* 8. Join Our Community CTA */}
      <CoreTeamCtaSection />
    </div>
  );
}
