import { Mic, Edit3, CheckCircle, Clock } from 'lucide-react';
import React from 'react';

import { PodcastListClient } from '@/components/admin/PodcastListClient';
import { listPodcasts } from '@/features/podcasts/actions';

export const dynamic = 'force-dynamic';

export default async function AdminPodcastPage(props: { searchParams: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams;
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const result = await listPodcasts({ page, limit: 100 });
  const podcasts = result.success && result.data ? result.data.data : [];

  // Calculate statistics
  const totalPodcasts = podcasts.length;
  const drafts = podcasts.filter((p: any) => p.status === 'Draft').length;
  const published = podcasts.filter((p: any) => p.status === 'Published').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Podcast Management</h1>
        <p className="mt-1 text-gray-500">
          Manage podcast episodes published by UDBHAV Foundation.
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="flex items-center gap-4 overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="rounded-lg bg-indigo-50 p-3">
            <Mic className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <p className="truncate text-sm font-medium text-gray-500">Total Episodes</p>
            <p className="text-2xl font-bold text-gray-900">{totalPodcasts}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="rounded-lg bg-amber-50 p-3">
            <Edit3 className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="truncate text-sm font-medium text-gray-500">Drafts</p>
            <p className="text-2xl font-bold text-gray-900">{drafts}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="rounded-lg bg-green-50 p-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="truncate text-sm font-medium text-gray-500">Published</p>
            <p className="text-2xl font-bold text-gray-900">{published}</p>
          </div>
        </div>
      </div>

      <PodcastListClient initialPodcasts={podcasts} />
    </div>
  );
}
