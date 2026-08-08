'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { ImageUploader } from '@/components/admin/ImageUploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createAlbum, updateAlbum } from '@/features/gallery/actions';
import type { AlbumRow } from '@/features/gallery/repository';
import type { CreateAlbumDTO } from '@/features/gallery/validators';

interface GalleryAlbumFormProps {
  initialData?: AlbumRow;
  programs: { id: string; title: string }[];
  events: { id: string; title: string }[];
}

export function GalleryAlbumForm({ initialData, programs, events }: GalleryAlbumFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<CreateAlbumDTO>>({
    title: initialData?.title || '',
    location: initialData?.location || '',
    description: initialData?.description || '',
    visibility: (initialData?.visibility as any) || 'Public',
    cover_image_id: initialData?.cover_image_id || null,
    program_id: initialData?.program_id || null,
    event_id: initialData?.event_id || null,
    is_featured: initialData?.is_featured || false,
    display_order: initialData?.display_order || 0,
  });

  const handleUploadComplete = (result: any) => {
    setFormData((prev) => ({ ...prev, cover_image_id: result.id }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const payload: CreateAlbumDTO = {
          title: formData.title || '',
          location: formData.location || '',
          description: formData.description || null,
          visibility: (formData.visibility as any) || 'Public',
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

        router.push('/admin/gallery');
        router.refresh();
      } catch (err: any) {
        setError(err.message || 'An error occurred while saving the album');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6 rounded-lg bg-white p-6 shadow">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
      )}



      <div>
        <Label htmlFor="title">Title *</Label>
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
          className="w-full rounded-md border px-3 py-2"
          placeholder="Detailed summary of the album..."
          disabled={isPending}
        />
      </div>

      <div>
        <Label htmlFor="location">Location *</Label>
        <Input
          id="location"
          value={formData.location || ''}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="e.g. Bhubaneswar, Odisha"
          disabled={isPending}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="program_id">Associated Program (Optional)</Label>
          <select
            id="program_id"
            value={formData.program_id || ''}
            onChange={(e) => setFormData({ ...formData, program_id: e.target.value || null })}
            className="w-full rounded-md border px-3 py-2"
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
            className="w-full rounded-md border px-3 py-2"
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
            className="w-full rounded-md border px-3 py-2"
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
            onChange={(e) =>
              setFormData({ ...formData, display_order: parseInt(e.target.value, 10) || 0 })
            }
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
        <ImageUploader folder="gallery-covers" onUploadComplete={handleUploadComplete} />
        {formData.cover_image_id && (
          <p className="text-sm text-green-600">
            Cover image uploaded (ID: {formData.cover_image_id})
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 border-t pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/gallery')}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : initialData ? 'Update Album' : 'Create Album'}
        </Button>
      </div>
    </form>
  );
}
