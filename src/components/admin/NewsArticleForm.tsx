'use client';

import { Edit3, Eye, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { ImageUploader } from '@/components/admin/ImageUploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createArticle, updateArticle } from '@/features/news/actions';
import type { ArticleWithMedia } from '@/features/news/repository';
import type { CreateArticleDTO } from '@/features/news/validators';

interface NewsArticleFormProps {
  initialData?: ArticleWithMedia;
  programs: { id: string; title: string }[];
  events: { id: string; title: string }[];
}

export function NewsArticleForm({ initialData, programs, events }: NewsArticleFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [tagInput, setTagInput] = useState('');

  const [formData, setFormData] = useState<Partial<CreateArticleDTO>>({
    article_code: initialData?.article_code || `ART-${Date.now().toString().slice(-6)}`,
    slug: initialData?.slug || '',
    title: initialData?.title || '',
    subtitle: initialData?.subtitle || '',
    summary: initialData?.summary || '',
    content: initialData?.content || '',
    cover_image_id: initialData?.cover_image_id || null,
    status: (initialData?.status as 'Draft' | 'In Review' | 'Published' | 'Archived') || 'Draft',
    visibility: (initialData?.visibility as 'public' | 'private') || 'public',
    is_featured: initialData?.is_featured || false,
    metadata: {
      category: (initialData?.category || 'News') as
        'News' | 'Story' | 'Press Release' | 'Announcement' | 'Blog' | 'Report' | 'Update',
      tags: initialData?.tags || [],
      author_name: initialData?.author_name || 'UDBHAV Foundation',
      program_id: initialData?.program_id || null,
      event_id: initialData?.event_id || null,
      seo_title:
        (((initialData?.metadata || {}) as Record<string, unknown>).seo_title as string) || '',
      seo_description:
        (((initialData?.metadata || {}) as Record<string, unknown>).seo_description as string) ||
        '',
      canonical_url:
        (((initialData?.metadata || {}) as Record<string, unknown>).canonical_url as string) || '',
    },
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    setFormData((prev) => ({
      ...prev,
      title,
      slug: !initialData ? slug : prev.slug,
    }));
  };

  const handleUploadComplete = (result: any) => {
    setFormData((prev) => ({
      ...prev,
      cover_image_id: result.id,
    }));
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const currentTags = formData.metadata?.tags || [];
    if (!currentTags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        metadata: {
          ...prev.metadata!,
          tags: [...currentTags, tagInput.trim()],
        },
      }));
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = formData.metadata?.tags || [];
    setFormData((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata!,
        tags: currentTags.filter((t) => t !== tagToRemove),
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        if (initialData) {
          await updateArticle(initialData.id, formData);
        } else {
          await createArticle(formData as CreateArticleDTO);
        }
        router.push('/admin/dashboard/news');
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while saving.');
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Mode Tabs: Edit vs Preview */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex gap-2">
          <Button
            type="button"
            variant={activeTab === 'edit' ? 'default' : 'outline'}
            onClick={() => setActiveTab('edit')}
            className="flex items-center gap-2"
          >
            <Edit3 className="h-4 w-4" />
            Edit Article
          </Button>
          <Button
            type="button"
            variant={activeTab === 'preview' ? 'default' : 'outline'}
            onClick={() => setActiveTab('preview')}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Live Preview
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {activeTab === 'preview' ? (
        <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center gap-2">
            <span className="bg-primary/10 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              {formData.metadata?.category || 'News'}
            </span>
            {formData.is_featured && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                Featured
              </span>
            )}
            <span className="text-xs text-gray-500">
              {formData.status} • {formData.visibility}
            </span>
          </div>

          <h1 className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
            {formData.title || 'Untitled Article'}
          </h1>

          {formData.subtitle && <p className="text-lg italic text-gray-600">{formData.subtitle}</p>}

          <div className="flex items-center gap-4 border-b border-gray-100 pb-4 text-sm text-gray-500">
            <span>By {formData.metadata?.author_name || 'UDBHAV Foundation'}</span>
            <span>•</span>
            <span>
              {new Date().toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>

          {formData.summary && (
            <div className="rounded border-l-4 border-primary bg-gray-50 p-4 font-medium text-gray-700">
              {formData.summary}
            </div>
          )}

          <div className="prose max-w-none whitespace-pre-wrap leading-relaxed text-gray-800">
            {formData.content || 'No article content provided yet.'}
          </div>

          {(formData.metadata?.tags || []).length > 0 && (
            <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4">
              {(formData.metadata?.tags || []).map((t) => (
                <span key={t} className="rounded-md bg-gray-100 px-2.5 py-1 text-xs text-gray-700">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <Label htmlFor="article_code">Article Code</Label>
              <Input
                id="article_code"
                value={formData.article_code}
                onChange={(e) => setFormData({ ...formData, article_code: e.target.value })}
                placeholder="e.g. ART-001"
                required
                disabled={!!initialData}
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={formData.metadata?.category || 'News'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    metadata: {
                      ...formData.metadata!,
                      category: e.target.value as
                        | 'News'
                        | 'Story'
                        | 'Press Release'
                        | 'Announcement'
                        | 'Blog'
                        | 'Report'
                        | 'Update',
                    },
                  })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="News">News</option>
                <option value="Story">Story</option>
                <option value="Press Release">Press Release</option>
                <option value="Announcement">Announcement</option>
                <option value="Blog">Blog</option>
                <option value="Report">Report</option>
                <option value="Update">Update</option>
              </select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as 'Draft' | 'In Review' | 'Published' | 'Archived',
                  })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="Draft">Draft</option>
                <option value="In Review">In Review</option>
                <option value="Published">Published</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="title">Article Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. UDBHAV Launches New Girls Scholarship Program"
                required
              />
            </div>
            <div>
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g. udbhav-launches-new-girls-scholarship"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="subtitle">Subtitle (Optional)</Label>
              <Input
                id="subtitle"
                value={formData.subtitle || ''}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="Brief secondary headline"
              />
            </div>
            <div>
              <Label htmlFor="author_name">Author Name</Label>
              <Input
                id="author_name"
                value={formData.metadata?.author_name || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    metadata: { ...formData.metadata!, author_name: e.target.value },
                  })
                }
                placeholder="e.g. Priya Sharma"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="summary">Summary / Excerpt (Optional)</Label>
            <textarea
              id="summary"
              rows={2}
              value={formData.summary || ''}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Short summary displayed on cards and search results (max 1000 chars)"
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <div>
            <Label htmlFor="content">Full Article Content (Markdown / Rich Text)</Label>
            <textarea
              id="content"
              rows={12}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write full article content here. Supports headings (#, ##), bullet points, and paragraphs..."
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm"
              required
            />
          </div>

          {/* Cover Image Upload */}
          <div className="space-y-3 rounded-md border border-gray-200 bg-gray-50 p-4">
            <Label>Cover Image</Label>
            <ImageUploader folder="news-covers" onUploadComplete={handleUploadComplete} />
            {formData.cover_image_id && (
              <span className="block text-xs font-medium text-green-600">
                ✓ Cover Image Attached ({formData.cover_image_id})
              </span>
            )}
          </div>

          {/* Tags Manager */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex items-center gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="e.g. Education, Odisha, Grassroots"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={handleAddTag}>
                <Plus className="mr-1 h-4 w-4" /> Add Tag
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {(formData.metadata?.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Program & Event Associations */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="program_id">Associated Program (Optional)</Label>
              <select
                id="program_id"
                value={formData.metadata?.program_id || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    metadata: { ...formData.metadata!, program_id: e.target.value || null },
                  })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">-- No Program Associated --</option>
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="event_id">Associated Event (Optional)</Label>
              <select
                id="event_id"
                value={formData.metadata?.event_id || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    metadata: { ...formData.metadata!, event_id: e.target.value || null },
                  })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">-- No Event Associated --</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Visibility & Featured Toggle */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            <div className="flex items-center gap-4">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-gray-700">
                  Featured Article (show on home & banners)
                </span>
              </label>
            </div>
            <div>
              <Label htmlFor="visibility" className="mr-2 text-sm">
                Visibility:
              </Label>
              <select
                id="visibility"
                value={formData.visibility}
                onChange={(e) =>
                  setFormData({ ...formData, visibility: e.target.value as 'public' | 'private' })
                }
                className="rounded-md border border-input bg-background px-3 py-1 text-sm"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/dashboard/news')}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : initialData ? 'Update Article' : 'Create Article'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
