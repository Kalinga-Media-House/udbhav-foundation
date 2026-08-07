import type { Metadata } from 'next';

import { CollectiveImpactSection } from '@/components/index-page/CollectiveImpactSection';
import { CTASection } from '@/components/index-page/CTASection';
import { IndexHeroSection } from '@/components/index-page/IndexHeroSection';
import { ProgrammeDirectorySection } from '@/components/index-page/ProgrammeDirectorySection';
import { listPrograms } from '@/features/programs/actions';
import type { IndexProgrammeDetail, ProgrammeCategory } from '@/types/index-programme';

export const metadata: Metadata = {
  title: 'Programmes & Initiatives Index | UDBHAV FOUNDATION',
  description:
    'Explore UDBHAV Foundation’s 11 official community action programmes advancing education, environmental responsibility, health, inclusion, awareness, and community empowerment across Odisha.',
};

export const dynamic = 'force-dynamic';

export default async function IndexPage() {
  const result = await listPrograms({ page: 1, limit: 100 }, { visibility: 'public', status: 'active' });
  if (!result.success || !result.data) {
    throw new Error(result.error ?? 'Failed to load programs');
  }
  const activePrograms = result.data.data;

  const mappedProgrammes: IndexProgrammeDetail[] = activePrograms.map((p) => {
    const meta = (p.metadata || {}) as any;
    const r2Url = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://media.udbhavfoundation.in';
    const resolvedCover = p.cover_image?.r2_object_key 
      ? `${r2Url}/${p.cover_image.r2_object_key}`
      : (meta.coverImageUrl as string) || '/hero/hero-01.png';

    return {
      id: p.id,
      programmeNumber: (p.sort_order ?? 0).toString().padStart(2, '0'),
      title: p.title,
      tagline: p.short_description || '',
      category: (meta.category as ProgrammeCategory) || 'Community Support',
      slug: p.slug,
      shortDescription: p.short_description || '',
      fullDescription: (meta.fullDescription as string) || p.full_description || '',
      coverImageUrl: resolvedCover,
      accentColor: (meta.accentColor as string) || '#172B6B',
      programDate: p.start_date
        ? new Date(p.start_date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : undefined,
      location: p.location || undefined,
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
    <main className="min-h-screen bg-white selection:bg-[#172B6B] selection:text-white">
      <IndexHeroSection />
      <ProgrammeDirectorySection programmes={mappedProgrammes} />
      <CollectiveImpactSection />
      <CTASection />
    </main>
  );
}
