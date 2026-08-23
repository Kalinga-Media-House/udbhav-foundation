'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { uploadPhotosBatchAction } from '@/features/gallery/actions';
import type { UploadPhotosDTO } from '@/features/gallery/validators';

import { ImageUploader, type UploadedImage, type UploadStatus } from './ImageUploader';

interface PhotosUploadFormProps {
  programs: Array<{ id: string; title: string }>;
  events: Array<{ id: string; title: string }>;
}

export function PhotosUploadForm({ programs, events }: PhotosUploadFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState<Partial<UploadPhotosDTO>>({
    visibility: 'Public',
    program_id: null,
    event_id: null,
    is_featured: false,
    media_ids: [],
  });

  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [submitPending, setSubmitPending] = useState(false);
  const [clearTrigger, setClearTrigger] = useState(0);

  const [completedUploadCount, setCompletedUploadCount] = useState<number | null>(null);

  useEffect(() => {
    if (completedUploadCount !== null && completedUploadCount > 0) {
      const timer = setTimeout(() => {
        router.push('/admin/gallery');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [completedUploadCount, router]);

  const handleUploadComplete = (result: UploadedImage | UploadedImage[]) => {
    const resultsArray = Array.isArray(result) ? result : [result];
    const newMediaIds = resultsArray.map(r => r.id);
    setFormData((prev) => {
      const existing = prev.media_ids || [];
      const uniqueNew = newMediaIds.filter(id => !existing.includes(id));
      return { 
        ...prev, 
        media_ids: [...existing, ...uniqueNew] 
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.media_ids || formData.media_ids.length === 0) {
      if (uploadStatus === 'error') {
        setError('Please remove or retry failed images before submitting.');
      } else {
        setError('Please select at least one photo to upload.');
      }
      return;
    }
    setError(null);
    setSubmitPending(true);
  };

  useEffect(() => {
    if (!submitPending) return;

    if (uploadStatus === 'error') {
      setError('Some image uploads failed. Please retry or remove failed images.');
      setSubmitPending(false);
      return;
    }

    if (uploadStatus === 'idle' || uploadStatus === 'success') {
      startTransition(async () => {
        try {
          const payload: UploadPhotosDTO = {
            visibility: (formData.visibility as any) || 'Public',
            program_id: formData.program_id ? formData.program_id : null,
            event_id: formData.event_id ? formData.event_id : null,
            is_featured: Boolean(formData.is_featured),
            media_ids: formData.media_ids || [],
          };

          const result = await uploadPhotosBatchAction(payload);

          if (!result.success) {
            setError(result.error || 'Failed to save photos');
            setSubmitPending(false);
            return;
          }

          const numUploaded = payload.media_ids.length;
          setCompletedUploadCount(numUploaded);
          
          setClearTrigger(t => t + 1);
          setFormData(prev => ({ ...prev, media_ids: [] }));
          
          router.refresh();
        } catch (err: any) {
          setError(err.message || 'An error occurred while saving the photos');
          setSubmitPending(false);
        }
      });
    }
  }, [submitPending, uploadStatus, formData, router]);

  const isFormDisabled = isPending || submitPending || uploadStatus === 'requesting' || uploadStatus === 'uploading' || uploadStatus === 'processing';

  if (completedUploadCount !== null && completedUploadCount > 0) {
    return (
      <div className="max-w-md mx-auto space-y-6 rounded-xl border border-gray-100 bg-white p-8 text-center shadow-lg transform transition-all duration-500 ease-in-out">
        <div className="flex justify-center">
          <div className="rounded-full bg-emerald-50 p-4 animate-[pulse_2s_ease-in-out_infinite]">
            <CheckCircle className="h-16 w-16 text-emerald-500" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Upload Complete</h2>
          <p className="text-lg font-medium text-gray-600">
            {completedUploadCount} {completedUploadCount === 1 ? 'Photo' : 'Photos'} Uploaded Successfully
          </p>
        </div>
        <p className="text-sm text-gray-500 animate-pulse pt-4">
          Redirecting to Gallery...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6 rounded-lg bg-white p-6 shadow">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
      )}

      <div className="space-y-2">
        <Label htmlFor="photos">Photos *</Label>
        <ImageUploader 
          folder="gallery-photos" 
          multiple={true} 
          maxFiles={50}
          onUploadComplete={handleUploadComplete} 
          onStatusChange={setUploadStatus} 
          clearSuccessfulTrigger={clearTrigger}
        />
        {formData.media_ids && formData.media_ids.length > 0 && (
          <p className="text-sm text-green-600 font-medium mt-2">
            {formData.media_ids.length} photo(s) ready for upload.
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 border-t pt-4">
        <div>
          <Label htmlFor="program_id">Associated Program (Optional)</Label>
          <select
            id="program_id"
            value={formData.program_id || ''}
            onChange={(e) => setFormData({ ...formData, program_id: e.target.value || null })}
            className="w-full rounded-md border px-3 py-2"
            disabled={isFormDisabled}
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
            disabled={isFormDisabled}
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
            disabled={isFormDisabled}
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
          disabled={isFormDisabled}
          className="rounded border-gray-300"
        />
        <Label htmlFor="is_featured">Feature these photos</Label>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t pt-6 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            const numReady = formData.media_ids?.length || 0;
            if (numReady > 0) {
              if (!window.confirm('You have photos ready to upload. Leave without uploading?')) return;
            }
            router.push('/admin/gallery');
          }}
          disabled={isFormDisabled}
          className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isFormDisabled || !formData.media_ids || formData.media_ids.length === 0}
          className={`w-full sm:w-auto transition-all ${
            isFormDisabled || !formData.media_ids || formData.media_ids.length === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-70 border border-gray-200'
              : 'bg-[#439B25] hover:bg-[#347A1D] text-white shadow-sm focus-visible:ring-2 focus-visible:ring-[#439B25] focus-visible:ring-offset-2 cursor-pointer'
          }`}
        >
          {(() => {
            const isUploaderBusy = uploadStatus === 'requesting' || uploadStatus === 'uploading' || uploadStatus === 'processing';
            const isSaving = isPending || submitPending;
            const numReady = formData.media_ids?.length || 0;
            
            if (isUploaderBusy) return 'Uploading...';
            if (isSaving) return 'Saving...';
            if (error && numReady > 0) return 'Retry Upload';
            if (numReady > 0) return `Upload ${numReady} Photo${numReady > 1 ? 's' : ''}`;
            return 'Upload Photos';
          })()}
        </Button>
      </div>
    </form>
  );
}
