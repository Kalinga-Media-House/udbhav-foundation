import type { Metadata } from 'next';

import { CoreTeamAdvisoryBoardSection } from '@/components/core-team/CoreTeamAdvisoryBoardSection';
import { GoverningBodyGridSection } from '@/components/core-team/GoverningBodyGridSection';
import { getActiveGoverningBodyMembers } from '@/features/governing-body';

export const metadata: Metadata = {
  title: 'Core Team & Leadership',
  description:
    'Meet the dedicated leadership, Governing Body, Advisory Board, and community organizers guiding UDBHAV Foundation across Odisha.',
};

export default async function CoreTeamPage() {
  const members = await getActiveGoverningBodyMembers();

  return (
    <div className="bg-pure-white w-full overflow-hidden">
      <h1 className="sr-only">UDBHAV Foundation Core Team & Leadership</h1>
      {/* 1. Governing Body Grid */}
      <GoverningBodyGridSection members={members} />

      {/* 3. Advisory Board */}
      <CoreTeamAdvisoryBoardSection />
    </div>
  );
}
