import type { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";

import { ProgrammeDetailView } from "@/components/index-page/ProgrammeDetailView";
import { listPublicPhotosAction } from "@/features/gallery/actions";
import { getProgramBySlug, listPrograms } from "@/features/programs/actions";
import type { IndexProgrammeDetail, ProgrammeCategory } from "@/types/index-programme";
import type { AdminPhotoItem } from "@/features/gallery/repository";

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
      title = `${(programmeRow.sort_order ?? 0).toString().padStart(2, '0')}: ${programmeRow.title} | UDBHAV FOUNDATION`;
      description = programmeRow.short_description || "Explore UDBHAV Foundation community action programmes.";
      const r2Url = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://media.udbhavfoundation.in';
      const resolvedCover = programmeRow.cover_image?.r2_object_key 
        ? `${r2Url}/${programmeRow.cover_image.r2_object_key}`
        : (meta.coverImageUrl as string) || coverImage;
      coverImage = resolvedCover;
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
    const r2Url = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://media.udbhavfoundation.in';
    const resolvedCover = p.cover_image?.r2_object_key 
      ? `${r2Url}/${p.cover_image.r2_object_key}`
      : (meta.coverImageUrl as string) || '/hero/hero-01.png';

    programme = {
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
  } catch {
    notFound();
  }

  if (!programme) {
    notFound();
  }

  // Fetch real gallery photos for this programme
  let photos: AdminPhotoItem[] = [];
  try {
    const photosRes = await listPublicPhotosAction({ page: 1, limit: 100 }, { program_id: programme.id });
    if (photosRes.success && photosRes.data) {
      photos = photosRes.data.data;
    }
  } catch {
    // Graceful fallback to empty array
  }

  // Fetch related programs
  let relatedProgrammes: IndexProgrammeDetail[] = [];
  try {
    const allRes = await listPrograms({ page: 1, limit: 4 }, { visibility: 'public' });
    if (allRes.success && allRes.data) {
      relatedProgrammes = allRes.data.data.filter(p => p.slug !== slug).slice(0, 3).map(p => {
        const meta = (p.metadata || {}) as Record<string, unknown>;
        const r2Url = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://media.udbhavfoundation.in';
        const relCover = p.cover_image?.r2_object_key 
          ? `${r2Url}/${p.cover_image.r2_object_key}`
          : (meta.coverImageUrl as string) || '/hero/hero-01.png';
        return {
          id: p.id,
          programmeNumber: ((p.sort_order ?? 0) ?? 0).toString().padStart(2, '0'),
          title: p.title,
          tagline: p.short_description || '',
          category: (meta.category as ProgrammeCategory) || 'Community Support',
          slug: p.slug,
          shortDescription: p.short_description || '',
          fullDescription: (meta.fullDescription as string) || p.full_description || '',
          coverImageUrl: relCover,
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
      photos={photos}
      relatedProgrammes={relatedProgrammes}
    />
  );
}
