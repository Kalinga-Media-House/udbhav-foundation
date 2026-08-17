import type { Metadata } from 'next';

import { CoreTeamAdvisoryBoardSection } from '@/components/core-team/CoreTeamAdvisoryBoardSection';
import { CoreTeamHeroSection } from '@/components/core-team/CoreTeamHeroSection';
import { GoverningBodyGridSection } from '@/components/core-team/GoverningBodyGridSection';

export const metadata: Metadata = {
  title: 'Core Team & Governance — UDBHAV Foundation',
  description:
    'Meet the dedicated leadership, Governing Body, Advisory Board, and community organizers guiding UDBHAV Foundation across Odisha.',
};

export default function CoreTeamPage() {
  return (
    <div className="bg-pure-white w-full overflow-hidden">
      {/* 1. Compact Core Team Hero */}
      <CoreTeamHeroSection />

      {/* 4. Governing Body Grid */}
      <GoverningBodyGridSection />

      {/* 6. Advisory Board */}
      <CoreTeamAdvisoryBoardSection />
    </div>
  );
}
