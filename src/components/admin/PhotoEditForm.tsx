/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition, useEffect } from 'react';

import { ImageUploader } from '@/components/admin/ImageUploader';
import type { UploadStatus, UploadedImage } from '@/components/admin/ImageUploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updatePhotoAction } from '@/features/gallery/actions';
import type { UpdatePhotoDTO } from '@/features/gallery/validators';

interface PhotoEditFormProps {
  initialData: any; // Using any for simplicity as it comes from the DB directly
  programs: { id: string; title: string }[];
  events: { id: string; title: string }[];
}

export function PhotoEditForm({ initialData, programs, events }: PhotoEditFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [submitPending, setSubmitPending] = useState(false);
  const [statusText, setStatusText] = useState('');

  const album = initialData.album || {};
  
  const [formData, setFormData] = useState<Partial<UpdatePhotoDTO>>({
    title: initialData.title || album.title || '',
    location: initialData.location || album.location || '',
    description: initialData.description || album.description || '',
    visibility: album.visibility || 'Public',
    program_id: album.program_id || null,
    event_id: album.event_id || null,
    is_featured: initialData.is_featured || album.is_featured || false,
    media_id: undefined,
  });

  const handleUploadComplete = (result: UploadedImage | UploadedImage[]) => {
    const resultsArray = Array.isArray(result) ? result : [result];
    if (resultsArray.length > 0) {
      setFormData((prev) => ({ ...prev, media_id: resultsArray[0].id }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitPending(true);
  };

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
      setStatusText('Updating photo...');
      
      startTransition(async () => {
        try {
          const payload: UpdatePhotoDTO = {
            title: formData.title || '',
            location: formData.location || null,
            description: formData.description || null,
            visibility: (formData.visibility as any) || 'Public',
            program_id: formData.program_id ? formData.program_id : null,
            event_id: formData.event_id ? formData.event_id : null,
            is_featured: Boolean(formData.is_featured),
            media_id: formData.media_id,
          };

          const result = await updatePhotoAction(initialData.id, payload);

          if (!result.success) {
            setError(result.error || 'Failed to update photo');
            setSubmitPending(false);
            return;
          }

          setStatusText('Redirecting...');
          router.push('/admin/gallery');
        } catch (err: any) {
          setError(err.message || 'An error occurred while updating the photo');
          setSubmitPending(false);
        }
      });
      
      setSubmitPending(false);
    }
  }, [submitPending, uploadStatus, formData, initialData.id, router]);

  const isFormDisabled = isPending || submitPending || uploadStatus === 'requesting' || uploadStatus === 'uploading' || uploadStatus === 'processing';

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
          placeholder="e.g., Annual Charity Gala 2026"
          disabled={isPending}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full rounded-md border px-3 py-2"
          placeholder="Detailed description..."
          disabled={isPending}
        />
      </div>

      <div>
        <Label htmlFor="location">Location (Optional)</Label>
        <Input
          id="location"
          value={formData.location || ''}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="e.g., Bhubaneswar, Odisha"
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
            value={formData.visibility || 'Public'}
            onChange={(e) => setFormData({ ...formData, visibility: e.target.value as any })}
            className="w-full rounded-md border px-3 py-2"
            disabled={isPending}
          >
            <option value="Public">Public</option>
            <option value="Members">Members</option>
            <option value="Private">Private</option>
            <option value="Hidden">Hidden</option>
          </select>
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
        <Label htmlFor="is_featured">Feature this photo</Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cover_image">Replace Photo (Optional)</Label>
        <ImageUploader 
          folder="gallery-photos" 
          multiple={false}
          onUploadComplete={handleUploadComplete} 
          onStatusChange={setUploadStatus} 
        />
        {formData.media_id && (
          <p className="text-sm text-green-600 font-medium mt-2">
            New photo ready to be saved.
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 border-t pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/gallery')}
          disabled={isFormDisabled}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isFormDisabled}>
          {isPending || submitPending ? statusText || 'Saving...' : 'Update Photo'}
        </Button>
      </div>
    </form>
  );
}
