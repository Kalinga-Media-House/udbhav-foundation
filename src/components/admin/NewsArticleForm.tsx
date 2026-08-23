'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Edit3, Eye, ChevronDown, ChevronRight } from 'lucide-react';
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
  const [showAdvanced, setShowAdvanced] = useState(false);

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
        | 'News'
        | 'Story'
        | 'Event'
        | 'Press Release'
        | 'Announcement'
        | 'Blog'
        | 'Report'
        | 'Update',
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
    event_date: (initialData as any)?.event_date || null,
    event_start_time: (initialData as any)?.event_start_time || null,
    event_end_time: (initialData as any)?.event_end_time || null,
    event_location: (initialData as any)?.event_location || null,
    event_address: (initialData as any)?.event_address || null,
    registration_url: (initialData as any)?.registration_url || null,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        let result;
        if (initialData) {
          result = await updateArticle(initialData.id, formData as any);
        } else {
          result = await createArticle(formData as CreateArticleDTO);
        }
        
        if (result.success) {
          router.push('/admin/news');
          router.refresh();
        } else {
          setError(result.error || 'An error occurred while saving.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while saving.');
      }
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Mode Tabs */}
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
            Preview
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

          {formData.summary && (
            <div className="rounded border-l-4 border-primary bg-gray-50 p-4 font-medium text-gray-700">
              {formData.summary}
            </div>
          )}

          <div className="prose max-w-none whitespace-pre-wrap leading-relaxed text-gray-800">
            {formData.content || 'No article content provided yet.'}
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:p-8"
        >
          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-base font-semibold">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="Enter article title"
              required
              className="mt-1.5"
            />
          </div>

          {/* Type / Category */}
          <div>
            <Label htmlFor="category" className="text-base font-semibold">Type *</Label>
            <select
              id="category"
              value={formData.metadata?.category || 'News'}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  metadata: {
                    ...formData.metadata!,
                    category: e.target.value as any,
                  },
                })
              }
              className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              required
            >
              <option value="News">News</option>
              <option value="Story">Story</option>
              <option value="Event">Event</option>
              <option value="Announcement">Announcement</option>
              <option value="Press Release">Press Release</option>
            </select>
          </div>

          {/* Short Description */}
          <div>
            <Label htmlFor="summary" className="text-base font-semibold">Short Description</Label>
            <p className="mb-2 text-xs text-gray-500">A brief summary shown on article cards and search results.</p>
            <textarea
              id="summary"
              rows={2}
              value={formData.summary || ''}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Write a short summary of this article..."
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          {/* Event Details (Conditional) */}
          {formData.metadata?.category === 'Event' && (
            <div className="space-y-4 rounded-md border border-gray-200 bg-gray-50 p-5">
              <h3 className="text-base font-semibold">Event Details</h3>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="event_date" className="text-sm font-medium">Event Date *</Label>
                  <Input
                    id="event_date"
                    type="date"
                    value={(formData as any).event_date || ''}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value } as any)}
                    required
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="event_start_time" className="text-sm font-medium">Start Time</Label>
                  <Input
                    id="event_start_time"
                    type="time"
                    value={(formData as any).event_start_time || ''}
                    onChange={(e) => setFormData({ ...formData, event_start_time: e.target.value } as any)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="event_end_time" className="text-sm font-medium">End Time</Label>
                  <Input
                    id="event_end_time"
                    type="time"
                    value={(formData as any).event_end_time || ''}
                    onChange={(e) => setFormData({ ...formData, event_end_time: e.target.value } as any)}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="event_location" className="text-sm font-medium">Location (e.g. City)</Label>
                  <Input
                    id="event_location"
                    value={(formData as any).event_location || ''}
                    onChange={(e) => setFormData({ ...formData, event_location: e.target.value } as any)}
                    placeholder="Bhubaneswar"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="event_address" className="text-sm font-medium">Full Address</Label>
                  <Input
                    id="event_address"
                    value={(formData as any).event_address || ''}
                    onChange={(e) => setFormData({ ...formData, event_address: e.target.value } as any)}
                    placeholder="123 Main St..."
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="registration_url" className="text-sm font-medium">Registration URL</Label>
                <Input
                  id="registration_url"
                  type="url"
                  value={(formData as any).registration_url || ''}
                  onChange={(e) => setFormData({ ...formData, registration_url: e.target.value } as any)}
                  placeholder="https://..."
                  className="mt-1.5"
                />
              </div>
            </div>
          )}

          {/* Article Content */}
          <div>
            <Label htmlFor="content" className="text-base font-semibold">Article Content *</Label>
            <textarea
              id="content"
              rows={16}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write your article here..."
              className="mt-1.5 flex w-full rounded-md border border-input bg-background px-4 py-3 font-mono text-sm leading-relaxed"
              required
            />
          </div>

          {/* Cover Image Upload */}
          <div className="space-y-2 rounded-md border border-gray-100 bg-gray-50 p-5">
            <Label className="text-base font-semibold">Cover Image</Label>
            <p className="mb-3 text-xs text-gray-500">Recommended landscape image for article previews.</p>
            <div className="max-w-xs">
              <ImageUploader folder="news-covers" onUploadComplete={handleUploadComplete} />
            </div>
            {formData.cover_image_id && (
              <span className="mt-2 block text-xs font-medium text-green-600">
                ✓ Cover Image Attached
              </span>
            )}
          </div>

          {/* Advanced Options Toggle */}
          <div className="border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              {showAdvanced ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              Advanced Options
            </button>
            
            {showAdvanced && (
              <div className="mt-4 grid grid-cols-1 gap-5 rounded-md bg-gray-50 p-5 md:grid-cols-2">
                <div>
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="mt-1 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="visibility">Visibility</Label>
                  <select
                    id="visibility"
                    value={formData.visibility}
                    onChange={(e) =>
                      setFormData({ ...formData, visibility: e.target.value as 'public' | 'private' })
                    }
                    className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="program_id">Associated Program</Label>
                  <select
                    id="program_id"
                    value={formData.metadata?.program_id || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        metadata: { ...formData.metadata!, program_id: e.target.value || null },
                      })
                    }
                    className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">-- No Program --</option>
                    {programs.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="event_id">Associated Event</Label>
                  <select
                    id="event_id"
                    value={formData.metadata?.event_id || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        metadata: { ...formData.metadata!, event_id: e.target.value || null },
                      })
                    }
                    className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">-- No Event --</option>
                    {events.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Publishing Controls */}
          <div className="flex flex-col gap-4 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-6">
              <div>
                <Label htmlFor="status" className="sr-only">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as 'Draft' | 'Published',
                    })
                  }
                  className="flex h-10 w-36 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium"
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-[#439B25] focus:ring-[#439B25]"
                />
                <span className="text-sm font-medium text-gray-700">
                  Feature this article
                </span>
              </label>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/news')}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isPending}
                className="bg-[#439B25] hover:bg-[#367d1d] text-white"
              >
                {isPending ? 'Saving...' : formData.status === 'Draft' ? 'Save Draft' : 'Publish Article'}
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
