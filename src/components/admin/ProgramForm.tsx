'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createProgram, updateProgram, uploadProgramImage } from '@/features/programs/actions';
import type { ProgramRow } from '@/features/programs/repository';
import type { CreateProgramDTO } from '@/features/programs/validators';

interface ProgramFormProps {
  initialData?: ProgramRow;
}

export function ProgramForm({ initialData }: ProgramFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<CreateProgramDTO>>({
    program_code: initialData?.program_code || '',
    slug: initialData?.slug || '',
    title: initialData?.title || '',
    subtitle: initialData?.subtitle || '',
    description: initialData?.description || '',
    status: (initialData?.status as any) || 'draft',
    visibility: (initialData?.visibility as any) || 'public',
    is_featured: initialData?.is_featured || false,
    display_order: initialData?.display_order || 0,
    cover_image_id: initialData?.cover_image_id || undefined,
  });

  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);

      const res = await uploadProgramImage(formData);
      if (!res.success || !res.data) throw new Error(res.error || 'Upload failed');
      setFormData((prev) => ({ ...prev, cover_image_id: res.data }));
    } catch (err: any) {
      setError(err.message || 'Image upload failed.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const payload: CreateProgramDTO = {
          program_code: formData.program_code || '',
          slug: formData.slug || undefined, // undefined will auto-generate in service
          title: formData.title || '',
          subtitle: formData.subtitle || undefined,
          description: formData.description || undefined,
          status: formData.status as any,
          visibility: formData.visibility as any,
          is_featured: formData.is_featured || false,
          display_order: formData.display_order || 0,
          cover_image_id: formData.cover_image_id || null,
          metadata: (initialData?.metadata as Record<string, unknown>) || {},
        };

        let res;
        if (initialData) {
          // Edit
          res = await updateProgram(initialData.id, payload);
        } else {
          // Create
          res = await createProgram(payload);
        }

        if (!res.success) {
          throw new Error(res.error || 'Failed to save program');
        }

        router.push('/admin/programs');
        router.refresh();
      } catch (err: any) {
        setError(err.message || 'An error occurred while saving the program.');
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl space-y-6 rounded-lg border border-gray-100 bg-white p-8 shadow-sm"
    >
      {error && (
        <div className="rounded-md border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="program_code">Program Code *</Label>
          <Input
            id="program_code"
            name="program_code"
            value={formData.program_code}
            onChange={handleChange}
            placeholder="e.g. EDU-2026-01"
            required
            disabled={!!initialData} // Cannot edit code after creation based on typical constraints
          />
          <p className="text-xs text-gray-500">Unique alphanumeric code with hyphens.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug (Optional)</Label>
          <Input
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="e.g. udbhav-siksha-samman"
          />
          <p className="text-xs text-gray-500">Leave blank to auto-generate from title.</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Program Title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subtitle">Subtitle / Tagline</Label>
        <Input
          id="subtitle"
          name="subtitle"
          value={formData.subtitle || ''}
          onChange={handleChange}
          placeholder="Short tagline for the program"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Full Description</Label>
        <textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          rows={6}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Detailed description of the program..."
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="draft">Draft</option>
            <option value="upcoming">Upcoming</option>
            <option value="active">Published (Active)</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="visibility">Visibility</Label>
          <select
            id="visibility"
            name="visibility"
            value={formData.visibility}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="members">Members Only</option>
            <option value="internal">Internal</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="display_order">Display Order</Label>
          <Input
            id="display_order"
            name="display_order"
            type="number"
            min={0}
            value={formData.display_order}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-2 border-t border-gray-100 pt-4">
        <Label htmlFor="cover_image">Cover Image Upload</Label>
        <Input
          id="cover_image"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploadingImage || isPending}
        />
        {uploadingImage && <p className="text-sm text-blue-600">Uploading image...</p>}
        {formData.cover_image_id && (
          <p className="text-sm text-green-600">Image attached successfully.</p>
        )}
      </div>

      <div className="flex items-center gap-2 border-t border-gray-100 pt-4">
        <input
          type="checkbox"
          id="is_featured"
          name="is_featured"
          checked={formData.is_featured}
          onChange={handleChange}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
        />
        <Label htmlFor="is_featured" className="cursor-pointer">
          Feature on Homepage / Directory
        </Label>
      </div>

      <div className="flex justify-end gap-4 border-t border-gray-100 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/programs')}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : initialData ? 'Update Program' : 'Create Program'}
        </Button>
      </div>
    </form>
  );
}
