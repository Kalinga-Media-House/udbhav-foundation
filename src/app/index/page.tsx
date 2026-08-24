import type { Metadata } from 'next';
import React from 'react';

import { IndexArchiveClient } from '@/components/index/IndexArchiveClient';
import { IndexHeroSection } from '@/components/index/IndexHeroSection';
import { listIndexInitiatives } from '@/features/index/actions';

export const metadata: Metadata = {
  title: 'Community Impact & Initiatives',
  description: 'Explore UDBHAV Foundation community action initiatives advancing education, inclusion, environmental responsibility and social empowerment.',
  openGraph: {
    title: 'Community Impact & Initiatives',
    description: 'Explore UDBHAV Foundation community action initiatives advancing education, inclusion, environmental responsibility and social empowerment.',
    url: 'https://udbhavfoundation.org/index',
    type: 'website',
    images: ['/hero/hero-01.png'],
  },
  alternates: {
    canonical: 'https://udbhavfoundation.org/index',
  },
};

export const dynamic = 'force-dynamic';

export default async function IndexArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const page = typeof sp.page === 'string' ? parseInt(sp.page, 10) : 1;
  const limit = 12;
  const search = typeof sp.search === 'string' ? sp.search : undefined;
  const yearStr = typeof sp.year === 'string' ? sp.year : 'all';
  const categoryStr = typeof sp.category === 'string' ? sp.category : 'all';
  const sort = typeof sp.sort === 'string' ? sp.sort : 'newest';

  let sortParam: { column: string; order: 'asc' | 'desc' } | undefined = undefined;
  if (sort === 'newest') sortParam = { column: 'year', order: 'desc' };
  else if (sort === 'oldest') sortParam = { column: 'year', order: 'asc' };
  else if (sort === 'featured') sortParam = { column: 'display_order', order: 'asc' };
  else if (sort === 'alphabetical') sortParam = { column: 'title', order: 'asc' };

  const filters: Record<string, unknown> = { status: 'Published' };
  if (yearStr !== 'all' && !isNaN(parseInt(yearStr, 10))) filters.year = parseInt(yearStr, 10);
  if (categoryStr !== 'all') filters.initiative_type = categoryStr;

  const result = await listIndexInitiatives({ page, limit }, filters, search, sortParam);
  const initiatives = result.success && result.data ? result.data.data : [];
  const total = result.success && result.data ? result.data.total : 0;
  const totalPages = Math.ceil(total / limit) || 1;

  // We need to fetch all years and types for the filters since we are paginating
  // So we pass available options derived from a lean query, or hardcode them
  // Given UDBHAV booklet size, we can fetch unique years/types from a separate query,
  // but let's pass down a list of common ones for now to avoid an extra query, or we can add a specific action.
  // We'll let IndexArchiveClient handle it or we can pass them.

  return (
    <main className="min-h-screen bg-[#FCFCF8]">
      <IndexHeroSection />
      <IndexArchiveClient 
        initiatives={initiatives} 
        totalItems={total}
        totalPages={totalPages}
        currentPage={page}
        searchQuery={search || ''}
        selectedYear={yearStr}
        selectedType={categoryStr}
        selectedSort={sort}
      />
    </main>
  );
}
