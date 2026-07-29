import type { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";

import { ProgrammeDetailView } from "@/components/index-page/ProgrammeDetailView";
import { INDEX_PROGRAMME_EVENTS, INDEX_PROGRAMME_PHOTOS } from "@/data/index-programmes-data";
import { getProgramBySlug, listPrograms } from "@/features/programs/actions";
import type { IndexProgrammeDetail, ProgrammeCategory } from "@/types/index-programme";

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  let title = "Programme Not Found | UDBHAV FOUNDATION";
  let description = "Explore UDBHAV Foundation community action programmes.";
  let coverImage = "/hero/hero-01.png";

  try {
    const res = await getProgramBySlug(slug);
    if (res.success && res.data) {
      const programmeRow = res.data;
      const meta = (programmeRow.metadata || {}) as Record<string, unknown>;
      title = `${(programmeRow.display_order ?? 0).toString().padStart(2, '0')}: ${programmeRow.title} | UDBHAV FOUNDATION`;
      description = programmeRow.description || "Explore UDBHAV Foundation community action programmes.";
      coverImage = (meta.coverImageUrl as string) || coverImage;
    }
  } catch {
    // Keep defaults
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [coverImage],
      url: `https://udbhavfoundation.org/programmes/${slug}`,
    },
    alternates: {
      canonical: `https://udbhavfoundation.org/programmes/${slug}`,
    },
  };
}

export default async function ProgrammeDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let programme: IndexProgrammeDetail | undefined;

  try {
    const res = await getProgramBySlug(slug);
    if (!res.success || !res.data) throw new Error();
    const p = res.data;
    const meta = (p.metadata || {}) as Record<string, unknown>;
    programme = {
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
  } catch {
    notFound();
  }

  if (!programme) {
    notFound();
  }

  // Events & Photos (Mocked until those modules are built)
  const events = INDEX_PROGRAMME_EVENTS.filter(
    (e) => e.programmeSlug === slug || e.programmeId === programme.id
  );

  const photos = INDEX_PROGRAMME_PHOTOS.filter(
    (p) => p.programmeSlug === slug || p.programmeId === programme.id
  );

  // Fetch related programs
  let relatedProgrammes: IndexProgrammeDetail[] = [];
  try {
    const allRes = await listPrograms({ page: 1, limit: 4 }, { visibility: 'public' });
    if (allRes.success && allRes.data) {
      relatedProgrammes = allRes.data.data.filter(p => p.slug !== slug).slice(0, 3).map(p => {
        const meta = (p.metadata || {}) as Record<string, unknown>;
        return {
          id: p.id,
          programmeNumber: ((p.display_order ?? 0) ?? 0).toString().padStart(2, '0'),
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
        }
      });
    }
  } catch {
    // Ignore error for related programs
  }

  return (
    <ProgrammeDetailView
      programme={programme}
      events={events}
      photos={photos}
      relatedProgrammes={relatedProgrammes}
    />
  );
}
