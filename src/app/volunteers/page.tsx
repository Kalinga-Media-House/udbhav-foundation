import type { Metadata } from "next";
import React from "react";

import { HowVolunteeringWorksSection } from "@/components/volunteers/HowVolunteeringWorksSection";
import { PublicVolunteerDirectorySection } from "@/components/volunteers/PublicVolunteerDirectorySection";
import { VolunteerApplicationSection } from "@/components/volunteers/VolunteerApplicationSection";
import { VolunteerFaqSection } from "@/components/volunteers/VolunteerFaqSection";
import { VolunteerHeroSection } from "@/components/volunteers/VolunteerHeroSection";
import { VolunteerOpportunitiesSection } from "@/components/volunteers/VolunteerOpportunitiesSection";
import { VolunteerPromiseSection } from "@/components/volunteers/VolunteerPromiseSection";
import { WhoCanJoinSection } from "@/components/volunteers/WhoCanJoinSection";
import { WhyVolunteerSection } from "@/components/volunteers/WhyVolunteerSection";

export const metadata: Metadata = {
  title: "Volunteer With UDBHAV Foundation | Join Our Community",
  description:
    "Join UDBHAV Foundation as a volunteer and contribute your time, skills, and ideas to education, environmental action, health, inclusion, and community development initiatives.",
};

export default function VolunteersPage() {
  return (
    <main className="min-h-screen bg-pure-white text-[#17231D]">
      <VolunteerHeroSection />
      <WhyVolunteerSection />
      <VolunteerOpportunitiesSection />
      <PublicVolunteerDirectorySection />
      <HowVolunteeringWorksSection />
      <WhoCanJoinSection />
      <VolunteerApplicationSection />
      <VolunteerPromiseSection />
      <VolunteerFaqSection />
    </main>
  );
}
