import type { Metadata } from "next";
import React from "react";
import { VolunteerHeroSection } from "@/components/volunteers/VolunteerHeroSection";
import { WhyVolunteerSection } from "@/components/volunteers/WhyVolunteerSection";
import { VolunteerOpportunitiesSection } from "@/components/volunteers/VolunteerOpportunitiesSection";
import { HowVolunteeringWorksSection } from "@/components/volunteers/HowVolunteeringWorksSection";
import { WhoCanJoinSection } from "@/components/volunteers/WhoCanJoinSection";
import { VolunteerApplicationSection } from "@/components/volunteers/VolunteerApplicationSection";
import { VolunteerPromiseSection } from "@/components/volunteers/VolunteerPromiseSection";
import { VolunteerFaqSection } from "@/components/volunteers/VolunteerFaqSection";

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
      <HowVolunteeringWorksSection />
      <WhoCanJoinSection />
      <VolunteerApplicationSection />
      <VolunteerPromiseSection />
      <VolunteerFaqSection />
    </main>
  );
}
