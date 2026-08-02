'use client';

import { Eye, Edit3, Upload, Loader2, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUploader } from '@/components/admin/ImageUploader';
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
      category: ((initialData?.category || 'News') as 'News' | 'Story' | 'Press Release' | 'Announcement' | 'Blog' | 'Report' | 'Update'),
      tags: initialData?.tags || [],
      author_name: initialData?.author_name || 'UDBHAV Foundation',
      program_id: initialData?.program_id || null,
      event_id: initialData?.event_id || null,
      seo_title: ((initialData?.metadata || {}) as Record<string, unknown>).seo_title as string || '',
      seo_description: ((initialData?.metadata || {}) as Record<string, unknown>).seo_description as string || '',
      canonical_url: ((initialData?.metadata || {}) as Record<string, unknown>).canonical_url as string || '',
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
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
          {error}
        </div>
      )}

      {activeTab === 'preview' ? (
        <div className="border border-gray-200 rounded-lg p-6 md:p-8 bg-white shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
              {formData.metadata?.category || 'News'}
            </span>
            {formData.is_featured && (
              <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                Featured
              </span>
            )}
            <span className="text-xs text-gray-500">
              {formData.status} • {formData.visibility}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            {formData.title || 'Untitled Article'}
          </h1>

          {formData.subtitle && (
            <p className="text-lg text-gray-600 italic">
              {formData.subtitle}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-500 border-b border-gray-100 pb-4">
            <span>By {formData.metadata?.author_name || 'UDBHAV Foundation'}</span>
            <span>•</span>
            <span>{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>

          {formData.summary && (
            <div className="p-4 bg-gray-50 border-l-4 border-primary rounded text-gray-700 font-medium">
              {formData.summary}
            </div>
          )}

          <div className="prose max-w-none text-gray-800 whitespace-pre-wrap leading-relaxed">
            {formData.content || 'No article content provided yet.'}
          </div>

          {(formData.metadata?.tags || []).length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
              {(formData.metadata?.tags || []).map((t) => (
                <span key={t} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      category: e.target.value as 'News' | 'Story' | 'Press Release' | 'Announcement' | 'Blog' | 'Report' | 'Update',
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
                  setFormData({ ...formData, status: e.target.value as 'Draft' | 'In Review' | 'Published' | 'Archived' })
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
              required
            />
          </div>

          {/* Cover Image Upload */}
          <div className="border border-gray-200 rounded-md p-4 bg-gray-50 space-y-3">
            <Label>Cover Image</Label>
            <ImageUploader 
              folder="news-covers" 
              onUploadComplete={handleUploadComplete} 
            />
            {formData.cover_image_id && (
              <span className="text-xs text-green-600 font-medium block">✓ Cover Image Attached ({formData.cover_image_id})</span>
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
                <Plus className="h-4 w-4 mr-1" /> Add Tag
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {(formData.metadata?.tags || []).map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  #{tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="text-gray-400 hover:text-red-600">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Program & Event Associations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                />
                <span className="text-sm font-medium text-gray-700">Featured Article (show on home & banners)</span>
              </label>
            </div>
            <div>
              <Label htmlFor="visibility" className="mr-2 text-sm">Visibility:</Label>
              <select
                id="visibility"
                value={formData.visibility}
                onChange={(e) => setFormData({ ...formData, visibility: e.target.value as 'public' | 'private' })}
                className="rounded-md border border-input bg-background px-3 py-1 text-sm"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
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
