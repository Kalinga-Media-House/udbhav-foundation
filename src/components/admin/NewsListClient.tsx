'use client';

import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Star,
  CheckCircle,
  Archive,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  publishArticle,
  archiveArticle,
  setFeaturedArticle,
  deleteArticle,
} from '@/features/news/actions';
import type { ArticleWithMedia } from '@/features/news/repository';
import { getEventLifecycle } from '@/features/news/utils';

interface NewsListClientProps {
  initialArticles: ArticleWithMedia[];
}

export function NewsListClient({ initialArticles }: NewsListClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [eventLifecycleFilter, setEventLifecycleFilter] = useState<string>('ALL');
  const [error, setError] = useState<string | null>(null);

  const filteredArticles = initialArticles.filter((article) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      article.title.toLowerCase().includes(searchLower) ||
      article.article_code.toLowerCase().includes(searchLower) ||
      (article.summary && article.summary.toLowerCase().includes(searchLower)) ||
      (article.event_location && article.event_location.toLowerCase().includes(searchLower)) ||
      (article.content && article.content.toLowerCase().includes(searchLower));

    let matchesCategory = true;
    if (categoryFilter === 'NEWS_AND_STORIES') {
      matchesCategory = article.category !== 'Event' && article.category !== 'Podcast';
    } else if (categoryFilter !== 'ALL') {
      matchesCategory = article.category === categoryFilter;
    }
    const matchesStatus = statusFilter === 'ALL' || article.status === statusFilter;

    let matchesLifecycle = true;
    if (eventLifecycleFilter !== 'ALL') {
      if (article.category !== 'Event') {
        matchesLifecycle = false;
      } else {
        matchesLifecycle = getEventLifecycle(article) === eventLifecycleFilter;
      }
    }

    return matchesSearch && matchesCategory && matchesStatus && matchesLifecycle;
  }).sort((a, b) => {
    // Determine sort order
    if (eventLifecycleFilter === 'UPCOMING') {
      // Soonest first
      const dateA = a.event_date ? new Date(a.event_date).getTime() : new Date(a.published_at || a.created_at).getTime();
      const dateB = b.event_date ? new Date(b.event_date).getTime() : new Date(b.published_at || b.created_at).getTime();
      return dateA - dateB;
    } else if (eventLifecycleFilter === 'PAST') {
      // Most recent first
      const dateA = a.event_date ? new Date(a.event_date).getTime() : new Date(a.published_at || a.created_at).getTime();
      const dateB = b.event_date ? new Date(b.event_date).getTime() : new Date(b.published_at || b.created_at).getTime();
      return dateB - dateA;
    } else {
      // Default: Newest first
      return new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime();
    }
  });

  const handleTogglePublish = (id: string, currentStatus: string) => {
    setError(null);
    startTransition(async () => {
      try {
        if (currentStatus === 'Published') {
          await archiveArticle(id);
        } else {
          await publishArticle(id);
        }
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Action failed');
      }
    });
  };

  const handleToggleFeature = (id: string, currentFeatured: boolean) => {
    setError(null);
    startTransition(async () => {
      try {
        await setFeaturedArticle(id, !currentFeatured);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Action failed');
      }
    });
  };

  const handleDelete = (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    setError(null);
    startTransition(async () => {
      try {
        await deleteArticle(id);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Deletion failed');
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => { setCategoryFilter('ALL'); setEventLifecycleFilter('ALL'); }}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg ${categoryFilter === 'ALL' && eventLifecycleFilter === 'ALL' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
        >
          All
        </button>
        <button
          onClick={() => { setCategoryFilter('NEWS_AND_STORIES'); setEventLifecycleFilter('ALL'); }}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg ${categoryFilter === 'NEWS_AND_STORIES' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
        >
          News & Stories
        </button>
        <button
          onClick={() => { setCategoryFilter('Event'); setEventLifecycleFilter('UPCOMING'); }}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg ${categoryFilter === 'Event' && eventLifecycleFilter === 'UPCOMING' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Upcoming Events
        </button>
        <button
          onClick={() => { setCategoryFilter('Event'); setEventLifecycleFilter('PAST'); }}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg ${categoryFilter === 'Event' && eventLifecycleFilter === 'PAST' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Past Events
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:flex-row">
        <div className="relative w-full flex-1 md:w-auto">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by title, code, or summary..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9"
          />
        </div>

        <div className="flex w-full items-center gap-3 md:w-auto">
          <Filter className="hidden h-4 w-4 text-gray-400 md:inline" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="ALL">All Categories</option>
            <option value="News">News</option>
            <option value="Story">Story</option>
            <option value="Event">Event</option>
            <option value="Press Release">Press Release</option>
            <option value="Announcement">Announcement</option>
            <option value="Blog">Blog</option>
            <option value="Report">Report</option>
            <option value="Update">Update</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="ALL">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="In Review">In Review</option>
            <option value="Published">Published</option>
            <option value="Archived">Archived</option>
          </select>

          <select
            value={eventLifecycleFilter}
            onChange={(e) => {
              setEventLifecycleFilter(e.target.value);
              if (e.target.value !== 'ALL') {
                setCategoryFilter('Event');
              }
            }}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="ALL">All Events Lifecycle</option>
            <option value="UPCOMING">Upcoming Events</option>
            <option value="PAST">Past Events</option>
          </select>

          <Link href="/admin/news/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Article
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Articles Table */}
      <div className="overflow-hidden md:rounded-lg md:border md:border-gray-200 bg-transparent md:bg-white md:shadow-sm">
        {filteredArticles.length === 0 ? (
          <div className="py-12 text-center text-gray-500 bg-white rounded-lg border border-gray-200">
            No news articles found matching your criteria.
          </div>
        ) : (
          <div className="w-full">
            <table className="w-full border-collapse text-left block md:table">
              <thead className="hidden md:table-header-group">
                <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-600">
                  <th className="px-6 py-3">Article</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Event Status</th>
                  <th className="px-6 py-3">Publication Status</th>
                  <th className="px-6 py-3">Featured</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm block md:table-row-group">
                {filteredArticles.map((article) => (
                  <tr key={article.id} className="transition-colors hover:bg-gray-50/80 block md:table-row border border-gray-200 md:border-none rounded-xl mb-4 md:mb-0 p-4 md:p-0 shadow-sm md:shadow-none bg-white md:bg-transparent">
                    <td data-label="Article" className="px-0 md:px-6 py-2 md:py-4 block md:table-cell before:content-[attr(data-label)] before:font-semibold before:text-gray-500 before:text-xs before:uppercase before:mb-1 before:block md:before:hidden">
                      <div className="font-semibold text-gray-900">{article.title}</div>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-400">
                        <span>{article.article_code}</span>
                        <span>•</span>
                        <span>By {article.author_name || 'UDBHAV'}</span>
                        {article.status === 'Published' && (
                          <Link
                            href={`/news-and-stories/${article.slug}`}
                            target="_blank"
                            className="inline-flex items-center gap-0.5 text-primary hover:underline"
                          >
                            View <ExternalLink className="h-3 w-3" />
                          </Link>
                        )}
                      </div>
                    </td>
                    <td data-label="Type" className="px-0 md:px-6 py-2 md:py-4 block md:table-cell before:content-[attr(data-label)] before:font-semibold before:text-gray-500 before:text-xs before:uppercase before:mb-1 before:block md:before:hidden">
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                        {article.category || 'News'}
                      </span>
                    </td>
                    <td data-label="Event Status" className="px-0 md:px-6 py-2 md:py-4 block md:table-cell before:content-[attr(data-label)] before:font-semibold before:text-gray-500 before:text-xs before:uppercase before:mb-1 before:block md:before:hidden">
                      {article.category === 'Event' ? (
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getEventLifecycle(article) === 'UPCOMING' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'}`}>
                          {getEventLifecycle(article) === 'UPCOMING' ? 'Upcoming' : 'Past'}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td data-label="Publication Status" className="px-0 md:px-6 py-2 md:py-4 block md:table-cell before:content-[attr(data-label)] before:font-semibold before:text-gray-500 before:text-xs before:uppercase before:mb-1 before:block md:before:hidden">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          article.status === 'Published'
                            ? 'bg-blue-100 text-blue-800'
                            : article.status === 'Archived'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {article.status}
                      </span>
                    </td>
                    <td data-label="Featured" className="px-0 md:px-6 py-2 md:py-4 block md:table-cell before:content-[attr(data-label)] before:font-semibold before:text-gray-500 before:text-xs before:uppercase before:mb-1 before:block md:before:hidden">
                      <button
                        type="button"
                        onClick={() => handleToggleFeature(article.id, article.is_featured)}
                        disabled={isPending}
                        title={article.is_featured ? 'Unfeature article' : 'Feature article'}
                        className={`rounded p-1.5 transition-colors ${
                          article.is_featured
                            ? 'text-amber-500 hover:bg-amber-50'
                            : 'text-gray-300 hover:text-gray-400'
                        }`}
                      >
                        <Star className="h-4 w-4 fill-current" />
                      </button>
                    </td>
                    <td data-label="Date" className="px-0 md:px-6 py-2 md:py-4 text-xs text-gray-500 block md:table-cell before:content-[attr(data-label)] before:font-semibold before:text-gray-500 before:text-xs before:uppercase before:mb-1 before:block md:before:hidden">
                      {article.category === 'Event' && article.event_date ? (
                        <span>
                          <span className="font-semibold text-gray-700">Event:</span>{' '}
                          {new Date(article.event_date).toLocaleDateString('en-IN')}
                        </span>
                      ) : article.published_at ? (
                        new Date(article.published_at).toLocaleDateString('en-IN')
                      ) : (
                        new Date(article.created_at).toLocaleDateString('en-IN')
                      )}
                    </td>
                    <td className="space-x-2 px-0 md:px-6 py-3 md:py-4 text-left md:text-right block md:table-cell">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(article.id, article.status)}
                        disabled={isPending}
                        title={
                          article.status === 'Published' ? 'Archive article' : 'Publish article'
                        }
                        className="rounded p-1.5 text-gray-500 hover:text-gray-900"
                      >
                        {article.status === 'Published' ? (
                          <Archive className="h-4 w-4" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </button>

                      <Link href={`/admin/news/${article.id}/edit`}>
                        <button
                          type="button"
                          title="Edit article"
                          className="rounded p-1.5 text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDelete(article.id, article.title)}
                        disabled={isPending}
                        title="Delete article"
                        className="rounded p-1.5 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
