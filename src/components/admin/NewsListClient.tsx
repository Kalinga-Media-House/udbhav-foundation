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

interface NewsListClientProps {
  initialArticles: ArticleWithMedia[];
}

export function NewsListClient({ initialArticles }: NewsListClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [error, setError] = useState<string | null>(null);

  const filteredArticles = initialArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.article_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.summary && article.summary.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      categoryFilter === 'ALL' || article.category === categoryFilter;

    const matchesStatus =
      statusFilter === 'ALL' || article.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
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
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex-1 w-full md:w-auto relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by title, code, or summary..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="h-4 w-4 text-gray-400 hidden md:inline" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="ALL">All Categories</option>
            <option value="News">News</option>
            <option value="Story">Story</option>
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

          <Link href="/admin/dashboard/news/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Article
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Articles Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No news articles found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <th className="px-6 py-3">Article</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Featured</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {filteredArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{article.title}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                        <span>{article.article_code}</span>
                        <span>•</span>
                        <span>By {article.author_name || 'UDBHAV'}</span>
                        {article.status === 'Published' && (
                          <Link
                            href={`/news-and-stories/${article.slug}`}
                            target="_blank"
                            className="text-primary hover:underline inline-flex items-center gap-0.5"
                          >
                            View <ExternalLink className="h-3 w-3" />
                          </Link>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                        {article.category || 'News'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          article.status === 'Published'
                            ? 'bg-green-100 text-green-800'
                            : article.status === 'Archived'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {article.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => handleToggleFeature(article.id, article.is_featured)}
                        disabled={isPending}
                        title={article.is_featured ? 'Unfeature article' : 'Feature article'}
                        className={`p-1.5 rounded transition-colors ${
                          article.is_featured ? 'text-amber-500 hover:bg-amber-50' : 'text-gray-300 hover:text-gray-400'
                        }`}
                      >
                        <Star className="h-4 w-4 fill-current" />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {article.published_at
                        ? new Date(article.published_at).toLocaleDateString('en-IN')
                        : new Date(article.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(article.id, article.status)}
                        disabled={isPending}
                        title={article.status === 'Published' ? 'Archive article' : 'Publish article'}
                        className="p-1.5 text-gray-500 hover:text-gray-900 rounded"
                      >
                        {article.status === 'Published' ? (
                          <Archive className="h-4 w-4" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </button>

                      <Link href={`/admin/dashboard/news/${article.id}/edit`}>
                        <button
                          type="button"
                          title="Edit article"
                          className="p-1.5 text-blue-600 hover:text-blue-800 rounded"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDelete(article.id, article.title)}
                        disabled={isPending}
                        title="Delete article"
                        className="p-1.5 text-red-600 hover:text-red-800 rounded"
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
