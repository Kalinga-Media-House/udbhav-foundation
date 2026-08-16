import { FileText, Edit3, CheckCircle, Clock, CalendarClock, History } from 'lucide-react';
import React from 'react';

import { NewsListClient } from '@/components/admin/NewsListClient';
import { listArticles } from '@/features/news/actions';
import { getEventLifecycle } from '@/features/news/utils';

export const dynamic = 'force-dynamic';

export default async function AdminNewsPage(props: { searchParams: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams;
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const result = await listArticles({ page, limit: 100 });
  const articles = result.success && result.data ? result.data.data : [];

  // Calculate statistics
  const totalArticles = articles.length;
  const drafts = articles.filter((a) => a.status === 'Draft' || a.status === 'In Review').length;
  const published = articles.filter((a) => a.status === 'Published').length;
  const scheduled = articles.filter(
    (a) =>
      a.status === 'Scheduled' ||
      (a.status === 'Published' && new Date(a.published_at || a.created_at) > new Date())
  ).length;

  const publishedEvents = articles.filter(a => a.category === 'Event' && a.status === 'Published');
  const upcomingEvents = publishedEvents.filter(e => getEventLifecycle(e) === 'UPCOMING').length;
  const pastEvents = publishedEvents.filter(e => getEventLifecycle(e) === 'PAST').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">News Management</h1>
        <p className="mt-1 text-gray-500">
          Manage articles, stories, press releases, and events.
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className="flex items-center gap-4 overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="rounded-lg bg-indigo-50 p-3">
            <FileText className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <p className="truncate text-sm font-medium text-gray-500">Total Articles</p>
            <p className="text-2xl font-bold text-gray-900">{totalArticles}</p>
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

        <div className="flex items-center gap-4 overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="rounded-lg bg-blue-50 p-3">
            <Clock className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="truncate text-sm font-medium text-gray-500">Scheduled</p>
            <p className="text-2xl font-bold text-gray-900">{scheduled}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="rounded-lg bg-emerald-50 p-3">
            <CalendarClock className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <p className="truncate text-sm font-medium text-gray-500">Upcoming Events</p>
            <p className="text-2xl font-bold text-gray-900">{upcomingEvents}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="rounded-lg bg-gray-100 p-3">
            <History className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <p className="truncate text-sm font-medium text-gray-500">Past Events</p>
            <p className="text-2xl font-bold text-gray-900">{pastEvents}</p>
          </div>
        </div>
      </div>

      <NewsListClient initialArticles={articles} />
    </div>
  );
}
