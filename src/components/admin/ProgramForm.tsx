/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition, useEffect } from 'react';

import { ImageUploader } from '@/components/admin/ImageUploader';
import type { UploadStatus } from '@/components/admin/ImageUploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createProgram, updateProgram } from '@/features/programs/actions';
import type { ProgramRow } from '@/features/programs/repository';
import type { CreateProgramDTO } from '@/features/programs/validators';

interface ProgramFormProps {
  initialData?: ProgramRow;
}

export function ProgramForm({ initialData }: ProgramFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [submitPending, setSubmitPending] = useState(false);
  const [statusText, setStatusText] = useState('');

  // Form State
  const [formData, setFormData] = useState<Partial<CreateProgramDTO>>({
    title: initialData?.title || '',
    short_description: initialData?.short_description || '',
    full_description: initialData?.full_description || '',
    status: (initialData?.status as any) || 'draft',
    visibility: (initialData?.visibility as any) || 'public',
    program_type: (initialData?.program_type as any) || 'General',
    is_featured: initialData?.is_featured || false,
    sort_order: initialData?.sort_order || 0,
    cover_image_id: initialData?.cover_image_id || undefined,
    start_date: initialData?.start_date || new Date().toISOString().split('T')[0],
    location: initialData?.location || '',
  });

  // ImageUploader handles its own state, we just receive the ID when it completes
  const handleUploadComplete = (result: any) => {
    setFormData((prev) => ({ ...prev, cover_image_id: result.id }));
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
    setSubmitPending(true);
  };

  // Effect to handle progressive states and wait for upload completion
  useEffect(() => {
    if (!submitPending) return;

    if (uploadStatus === 'error') {
      setError('Image upload failed. Please try again.');
      setSubmitPending(false);
      return;
    }

    if (uploadStatus === 'requesting' || uploadStatus === 'uploading') {
      setStatusText('Uploading image...');
      return;
    }

    if (uploadStatus === 'processing') {
      setStatusText('Optimizing image...');
      return;
    }

    if (uploadStatus === 'idle' || uploadStatus === 'success') {
      setStatusText(initialData ? 'Updating program...' : 'Creating program...');
      
      startTransition(async () => {
        try {
          const payload: CreateProgramDTO = {
            title: formData.title || '',
            short_description: formData.short_description || '', 
            full_description: formData.full_description || '', 
            status: formData.status as any,
            visibility: formData.visibility as any,
            program_type: formData.program_type as any,
            is_featured: formData.is_featured || false,
            sort_order: formData.sort_order || 0,
            cover_image_id: formData.cover_image_id || null,
            start_date: formData.start_date || new Date().toISOString().split('T')[0],
            location: formData.location || '',
            metadata: (initialData?.metadata as Record<string, unknown>) || {},
          };

          let res;
          if (initialData) {
            res = await updateProgram(initialData.id, payload);
          } else {
            res = await createProgram(payload);
          }

          if (!res.success) {
            throw new Error(res.error || 'Failed to save program');
          }

          setStatusText('Redirecting...');
          router.push('/admin/programs');
          // router.refresh() removed for faster navigation
        } catch (err: any) {
          setError(err.message || 'An error occurred while saving the program.');
          setSubmitPending(false);
        }
      });
      
      setSubmitPending(false);
    }
  }, [submitPending, uploadStatus, formData, initialData, router]);

  const isFormDisabled = isPending || submitPending || uploadStatus === 'requesting' || uploadStatus === 'uploading' || uploadStatus === 'processing';

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

      <div className="space-y-2">
        <Label htmlFor="title">Program Name *</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Program Name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="program_type">Category *</Label>
        <select
          id="program_type"
          name="program_type"
          value={formData.program_type}
          onChange={handleChange}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          required
        >
          <option value="Education">Education</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Environment">Environment</option>
          <option value="Community">Community</option>
          <option value="Youth">Youth</option>
          <option value="Women">Women</option>
          <option value="Research">Research</option>
          <option value="Training">Training</option>
          <option value="Campaign">Campaign</option>
          <option value="Fundraising">Fundraising</option>
          <option value="Emergency">Emergency</option>
          <option value="General">General</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="short_description">Subtitle / Tagline</Label>
        <Input
          id="short_description"
          name="short_description"
          value={formData.short_description || ''}
          onChange={handleChange}
          placeholder="Short tagline for the program"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="start_date">Program Date *</Label>
          <Input
            id="start_date"
            name="start_date"
            type="date"
            value={
              formData.start_date instanceof Date
                ? formData.start_date.toISOString().split('T')[0]
                : (formData.start_date as string) || ''
            }
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Program Location *</Label>
          <Input
            id="location"
            name="location"
            value={formData.location || ''}
            onChange={handleChange}
            placeholder="e.g. Bhubaneswar, Odisha"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="full_description">Full Description</Label>
        <textarea
          id="full_description"
          name="full_description"
          value={formData.full_description || ''}
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
          <Label htmlFor="sort_order">Display Order</Label>
          <Input
            id="sort_order"
            name="sort_order"
            type="number"
            min={0}
            value={formData.sort_order}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-2 border-t border-gray-100 pt-4">
        <Label htmlFor="cover_image">Cover Image Upload</Label>
        <ImageUploader folder="programs" onUploadComplete={handleUploadComplete} onStatusChange={setUploadStatus} />
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
          disabled={isFormDisabled}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isFormDisabled}>
          {isPending || submitPending ? statusText || 'Saving...' : initialData ? 'Update Program' : 'Create Program'}
        </Button>
      </div>
    </form>
  );
}
