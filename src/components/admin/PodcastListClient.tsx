'use client';

import { Edit, Trash2, Plus, Search, Eye, EyeOff, Mic } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { publishPodcast, unpublishPodcast, deletePodcast } from '@/features/podcasts/actions';

export function PodcastListClient({ initialPodcasts }: { initialPodcasts: any[] }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isTogglingStatus, setIsTogglingStatus] = useState<string | null>(null);

  const filteredPodcasts = initialPodcasts.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    setIsTogglingStatus(id);
    try {
      if (currentStatus === 'Published') {
        const res = await unpublishPodcast(id);
        if (res.success) alert('Podcast unpublished');
        else throw new Error(res.error || 'Failed');
      } else {
        const res = await publishPodcast(id);
        if (res.success) alert('Podcast published');
        else throw new Error(res.error || 'Failed');
      }
      router.refresh();
    } catch {
      alert('Failed to change status');
    } finally {
      setIsTogglingStatus(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this podcast episode?')) return;
    setIsDeleting(id);
    try {
      const res = await deletePodcast(id);
      if (res.success) alert('Podcast deleted successfully');
      else throw new Error(res.error || 'Failed');
      router.refresh();
    } catch {
      alert('Failed to delete podcast');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search podcasts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="All">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
        <Link
          href="/admin/podcast/new"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <Plus className="h-4 w-4" />
          New Podcast
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Episode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredPodcasts.length > 0 ? (
                filteredPodcasts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-400">
                          <Mic className="h-5 w-5" />
                        </div>
                        <div className="ml-4 max-w-sm">
                          <div className="truncate text-sm font-medium text-gray-900">
                            {p.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {p.episode_number ? `Episode ${p.episode_number}` : 'No episode number'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          p.status === 'Published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {p.release_date
                        ? new Date(p.release_date).toLocaleDateString()
                        : new Date(p.created_at).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(p.id, p.status)}
                          disabled={isTogglingStatus === p.id}
                          className="text-gray-400 hover:text-indigo-600 disabled:opacity-50"
                          title={p.status === 'Published' ? 'Unpublish' : 'Publish'}
                        >
                          {p.status === 'Published' ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                        <Link
                          href={`/admin/podcast/${p.id}/edit`}
                          className="text-gray-400 hover:text-blue-600"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={isDeleting === p.id}
                          className="text-gray-400 hover:text-red-600 disabled:opacity-50"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500">
                    <Mic className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-lg font-medium text-gray-900">No podcast episodes yet.</p>
                    <p className="mt-1">Create your first podcast episode to get started.</p>
                    <Link
                      href="/admin/podcast/new"
                      className="mt-4 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-500"
                    >
                      <Plus className="h-4 w-4" />
                      New Podcast
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
