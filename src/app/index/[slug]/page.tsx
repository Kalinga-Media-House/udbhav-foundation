import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';

import { METADATA } from '@/constants/metadata';

import { InitiativeDetailClient } from '@/components/index/InitiativeDetailClient';
import {
  getIndexInitiativeBySlug,
  getRelatedIndexInitiatives,
  getAdjacentIndexInitiatives,
} from '@/features/index/actions';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const res = await getIndexInitiativeBySlug(slug);
    if (res.success && res.data) {
      const item = res.data;
      const title = `${item.title} | Programs & Initiatives Archive`;
      const description = item.seo_description || item.short_summary;
      const coverUrl = item.cover_image_url || '/hero/hero-01.png';

      return {
        title,
        description,
        openGraph: {
          title,
          description,
          url: `${METADATA.BASE_URL}/index/${slug}`,
          type: 'article',
          images: [{ url: coverUrl }],
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          images: [coverUrl],
        },
        alternates: {
          canonical: `${METADATA.BASE_URL}/index/${slug}`,
        },
      };
    }
  } catch {
    // Fallback to default
  }

  return {
    title: 'Initiative Not Found',
    description: 'Explore UDBHAV Foundation community action initiatives.',
  };
}

export default async function InitiativeDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let initiative;
  try {
    const res = await getIndexInitiativeBySlug(slug);
    if (!res.success || !res.data) {
      notFound();
    }
    initiative = res.data;
  } catch {
    notFound();
  }

  const [relatedRes, adjacentRes] = await Promise.all([
    getRelatedIndexInitiatives(initiative.id, initiative.initiative_type, initiative.year),
    getAdjacentIndexInitiatives(initiative.id, initiative.display_order),
  ]);

  const related = relatedRes.success && relatedRes.data ? relatedRes.data : [];
  const adjacent = adjacentRes.success && adjacentRes.data ? adjacentRes.data : { prev: null, next: null };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: initiative.title,
    description: initiative.short_summary,
    image: initiative.cover_image_url ? [initiative.cover_image_url] : [],
    datePublished: initiative.published_at || initiative.created_at,
    author: {
      '@type': 'Organization',
      name: 'UDBHAV Foundation',
      url: METADATA.BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'UDBHAV Foundation',
      logo: {
        '@type': 'ImageObject',
        url: `${METADATA.BASE_URL}/icon.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${METADATA.BASE_URL}/index/${initiative.slug}`,
    },
  };

  const breadcrumbsLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: METADATA.BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Programs & Initiatives',
        item: `${METADATA.BASE_URL}/index`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: initiative.title,
        item: `${METADATA.BASE_URL}/index/${initiative.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, breadcrumbsLd]) }}
      />
      <InitiativeDetailClient
        initiative={initiative}
        related={related}
        adjacent={adjacent}
      />
    </>
  );
}
