import type { Metadata } from "next";

import { AdhyayaFlagshipSection } from "@/components/index-page/AdhyayaFlagshipSection";
import { CollectiveImpactSection } from "@/components/index-page/CollectiveImpactSection";
import { IndexHeroSection } from "@/components/index-page/IndexHeroSection";
import { ProgrammeDirectorySection } from "@/components/index-page/ProgrammeDirectorySection";
import { listPrograms } from "@/features/programs/actions";
import type { IndexProgrammeDetail, ProgrammeCategory } from "@/types/index-programme";

export const metadata: Metadata = {
  title: "Programmes & Initiatives Index | UDBHAV FOUNDATION",
  description:
    "Explore UDBHAV Foundation’s 11 official community action programmes advancing education, environmental responsibility, health, inclusion, awareness, and community empowerment across Odisha.",
};

export const dynamic = 'force-dynamic';

export default async function IndexPage() {
  const result = await listPrograms({ page: 1, limit: 100 }, { visibility: 'public' });
  if (!result.success || !result.data) {
    throw new Error(result.error ?? 'Failed to load programs');
  }
  const activePrograms = result.data.data.filter(p => p.status === 'active' && p.slug !== 'adhyaya-ramp-of-inclusion');

  const mappedProgrammes: IndexProgrammeDetail[] = activePrograms.map(p => {
    const meta = (p.metadata || {}) as any;
    return {
      id: p.id,
      programmeNumber: (p.display_order ?? 0).toString().padStart(2, '0'),
      title: p.title,
      tagline: p.subtitle || '',
      category: (meta.category as ProgrammeCategory) || 'Community Support',
      slug: p.slug,
      shortDescription: p.description || '',
      fullDescription: (meta.fullDescription as string) || p.description || '',
      coverImageUrl: (meta.coverImageUrl as string) || '/hero/hero-01.png',
      accentColor: (meta.accentColor as string) || '#172B6B',
      impactPreview: (meta.impactPreview as string) || '',
      impactStats: (meta.impactStats as any) || [],
      purpose: (meta.purpose as string) || '',
      communityNeed: (meta.communityNeed as string) || '',
      approach: (meta.approach as string) || '',
      targetBeneficiaries: (meta.targetBeneficiaries as string[]) || [],
      majorActivities: (meta.majorActivities as string[]) || [],
      photoCount: (meta.photoCount as number) || 0,
      eventCount: (meta.eventCount as number) || 0,
    };
  });

  return (
    <main className="min-h-screen bg-[#FCFCF8]">
      <IndexHeroSection />
      <ProgrammeDirectorySection programmes={mappedProgrammes} />
      <CollectiveImpactSection />
      <AdhyayaFlagshipSection />
    </main>
  );
}
