import type { Metadata } from 'next';
import React from 'react';

import { HowVolunteeringWorksSection } from '@/components/volunteers/HowVolunteeringWorksSection';
import { PublicVolunteerDirectorySection } from '@/components/volunteers/PublicVolunteerDirectorySection';
import { VolunteerApplicationSection } from '@/components/volunteers/VolunteerApplicationSection';
import { VolunteerFaqSection } from '@/components/volunteers/VolunteerFaqSection';

export const metadata: Metadata = {
  title: 'Volunteer With Us | Join Our Community',
  description:
    'Join UDBHAV Foundation as a volunteer and contribute your time, skills, and ideas to education, environmental action, health, inclusion, and community development initiatives.',
};

export default function VolunteersPage() {
  return (
    <main className="bg-pure-white min-h-screen text-[#17231D]">
      <h1 className="sr-only">Volunteer With UDBHAV Foundation</h1>
      <PublicVolunteerDirectorySection />
      <HowVolunteeringWorksSection />
      <VolunteerApplicationSection />
      <VolunteerFaqSection />
    </main>
  );
}
