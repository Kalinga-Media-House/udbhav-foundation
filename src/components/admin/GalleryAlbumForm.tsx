'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createAlbum, updateAlbum } from '@/features/gallery/actions';
import type { AlbumRow } from '@/features/gallery/repository';
import type { CreateAlbumDTO } from '@/features/gallery/validators';
import { uploadMedia } from '@/features/media/actions';

interface GalleryAlbumFormProps {
  initialData?: AlbumRow;
  programs: { id: string; title: string }[];
  events: { id: string; title: string }[];
}

export function GalleryAlbumForm({ initialData, programs, events }: GalleryAlbumFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState<Partial<CreateAlbumDTO>>({
    album_code: initialData?.album_code || '',
    slug: initialData?.slug || '',
    title: initialData?.title || '',
    description: initialData?.description || '',
    visibility: (initialData?.visibility as 'public' | 'members' | 'private' | 'hidden') || 'public',
    cover_image_id: initialData?.cover_image_id || null,
    program_id: initialData?.program_id || null,
    event_id: initialData?.event_id || null,
    is_featured: initialData?.is_featured || false,
    display_order: initialData?.display_order || 0,
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      setError(null);
      const data = new FormData();
      data.append('file', file);
      data.append('folder', 'gallery-covers');

      const result = await uploadMedia(data);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to upload cover image');
      }

      setFormData((prev) => ({ ...prev, cover_image_id: result.data!.id }));
    } catch (err: any) {
      setError(err.message || 'Error uploading cover image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const payload: CreateAlbumDTO = {
          album_code: formData.album_code || `GAL-${Date.now().toString().slice(-6)}`,
          slug: formData.slug || formData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || '',
          title: formData.title || '',
          description: formData.description || null,
          visibility: (formData.visibility as 'public' | 'members' | 'private' | 'hidden') || 'public',
          cover_image_id: formData.cover_image_id || null,
          program_id: formData.program_id ? formData.program_id : null,
          event_id: formData.event_id ? formData.event_id : null,
          is_featured: Boolean(formData.is_featured),
          display_order: Number(formData.display_order) || 0,
        };

        let result;
        if (initialData) {
          result = await updateAlbum(initialData.id, payload);
        } else {
          result = await createAlbum(payload);
        }

        if (!result.success) {
          setError(result.error || 'Failed to save album');
          return;
        }

        router.push('/admin/dashboard/gallery');
        router.refresh();
      } catch (err: any) {
        setError(err.message || 'An error occurred while saving the album');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl bg-white p-6 rounded-lg shadow">
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="album_code">Album Code</Label>
          <Input
            id="album_code"
            value={formData.album_code || ''}
            onChange={(e) => setFormData({ ...formData, album_code: e.target.value.toUpperCase() })}
            placeholder="GAL-001"
            disabled={!!initialData || isPending}
            required
          />
        </div>

        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={formData.slug || ''}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="annual-gala-2026"
            disabled={isPending}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title || ''}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Annual Charity Gala 2026"
          disabled={isPending}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Detailed summary of the album..."
          disabled={isPending}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="program_id">Associated Program (Optional)</Label>
          <select
            id="program_id"
            value={formData.program_id || ''}
            onChange={(e) => setFormData({ ...formData, program_id: e.target.value || null })}
            className="w-full px-3 py-2 border rounded-md"
            disabled={isPending}
          >
            <option value="">None</option>
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="event_id">Associated Event (Optional)</Label>
          <select
            id="event_id"
            value={formData.event_id || ''}
            onChange={(e) => setFormData({ ...formData, event_id: e.target.value || null })}
            className="w-full px-3 py-2 border rounded-md"
            disabled={isPending}
          >
            <option value="">None</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="visibility">Visibility</Label>
          <select
            id="visibility"
            value={formData.visibility || 'public'}
            onChange={(e) => setFormData({ ...formData, visibility: e.target.value as any })}
            className="w-full px-3 py-2 border rounded-md"
            disabled={isPending}
          >
            <option value="public">Public</option>
            <option value="members">Members</option>
            <option value="private">Private</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>

        <div>
          <Label htmlFor="display_order">Display Order</Label>
          <Input
            id="display_order"
            type="number"
            min={0}
            value={formData.display_order || 0}
            onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value, 10) || 0 })}
            disabled={isPending}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_featured"
          checked={formData.is_featured || false}
          onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
          disabled={isPending}
          className="rounded border-gray-300"
        />
        <Label htmlFor="is_featured">Feature this album on public gallery homepage</Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cover_image">Cover Image</Label>
        <Input
          id="cover_image"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={isPending || uploadingImage}
        />
        {uploadingImage && <p className="text-sm text-gray-500">Uploading image to R2 storage...</p>}
        {formData.cover_image_id && (
          <p className="text-sm text-green-600">Cover image uploaded (ID: {formData.cover_image_id})</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/dashboard/gallery')}
          disabled={isPending || uploadingImage}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending || uploadingImage}>
          {isPending ? 'Saving...' : initialData ? 'Update Album' : 'Create Album'}
        </Button>
      </div>
    </form>
  );
}
