import type { Metadata } from 'next';
import React from 'react';

import { HowVolunteeringWorksSection } from '@/components/volunteers/HowVolunteeringWorksSection';
import { PublicVolunteerDirectorySection } from '@/components/volunteers/PublicVolunteerDirectorySection';
import { VolunteerApplicationSection } from '@/components/volunteers/VolunteerApplicationSection';
import { VolunteerFaqSection } from '@/components/volunteers/VolunteerFaqSection';
import { VolunteerHeroSection } from '@/components/volunteers/VolunteerHeroSection';
import { WhoCanJoinSection } from '@/components/volunteers/WhoCanJoinSection';

export const metadata: Metadata = {
  title: 'Volunteer With UDBHAV Foundation | Join Our Community',
  description:
    'Join UDBHAV Foundation as a volunteer and contribute your time, skills, and ideas to education, environmental action, health, inclusion, and community development initiatives.',
};

export default function VolunteersPage() {
  return (
    <main className="bg-pure-white min-h-screen text-[#17231D]">
      <VolunteerHeroSection />
      <PublicVolunteerDirectorySection />
      <HowVolunteeringWorksSection />
      <WhoCanJoinSection />
      <VolunteerApplicationSection />
      <VolunteerFaqSection />
    </main>
  );
}
