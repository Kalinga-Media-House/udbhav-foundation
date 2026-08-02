'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createEvent, updateEvent } from '@/features/events/actions';
import { ImageUploader } from '@/components/admin/ImageUploader';
import type { EventRow } from '@/features/events/repository';
import type { CreateEventDTO } from '@/features/events/validators';

interface EventFormProps {
  initialData?: EventRow;
  programs: { id: string; title: string }[];
}

export function EventForm({ initialData, programs }: EventFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const initialMetadata = initialData?.metadata as Record<string, any> || {};

  const [formData, setFormData] = useState<Partial<CreateEventDTO>>({
    event_code: initialData?.event_code || '',
    slug: initialData?.slug || '',
    title: initialData?.title || '',
    subtitle: initialData?.subtitle || '',
    description: initialData?.description || '',
    program_id: initialData?.program_id || (programs.length > 0 ? programs[0].id : ''),
    status: (initialData?.status as 'Draft' | 'Published' | 'Registration Open' | 'Registration Closed' | 'Completed' | 'Cancelled' | 'Archived') || 'Draft',
    visibility: (initialData?.visibility as 'public' | 'private' | 'internal') || 'public',
    event_type: initialData?.event_type || '',
    start_time: initialData?.start_time ? new Date(initialData.start_time).toISOString().slice(0, 16) : '',
    end_time: initialData?.end_time ? new Date(initialData.end_time).toISOString().slice(0, 16) : '',
    venue_name: initialData?.venue_name || '',
    address_line1: initialData?.address_line1 || '',
    address_line2: initialData?.address_line2 || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    postal_code: initialData?.postal_code || '',
    country: initialData?.country || '',
    max_attendees: initialData?.max_attendees || 0,
    cover_image_id: initialData?.cover_image_id || '',
    is_featured: initialData?.is_featured || false,
    is_virtual: initialMetadata.is_virtual || false,
    virtual_link: initialMetadata.virtual_link || '',
    registration_deadline: initialMetadata.registration_deadline ? new Date(initialMetadata.registration_deadline).toISOString().slice(0, 16) : '',
  });

  const handleUploadComplete = (result: any) => {
    setFormData((prev) => ({ ...prev, cover_image_id: result.id }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        const payload: CreateEventDTO = {
          event_code: formData.event_code || '',
          slug: formData.slug || (formData.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
          title: formData.title || '',
          subtitle: formData.subtitle || undefined,
          description: formData.description || undefined,
          program_id: formData.program_id || programs[0]?.id || '',
          status: formData.status as 'Draft' | 'Published' | 'Registration Open' | 'Registration Closed' | 'Completed' | 'Cancelled' | 'Archived',
          visibility: formData.visibility as 'public' | 'private' | 'internal',
          event_type: formData.event_type || 'General',
          start_time: formData.start_time ? new Date(formData.start_time).toISOString() : undefined,
          end_time: formData.end_time ? new Date(formData.end_time).toISOString() : undefined,
          venue_name: formData.venue_name || undefined,
          address_line1: formData.address_line1 || undefined,
          address_line2: formData.address_line2 || undefined,
          city: formData.city || undefined,
          state: formData.state || undefined,
          postal_code: formData.postal_code || undefined,
          country: formData.country || undefined,
          latitude: formData.latitude || undefined,
          longitude: formData.longitude || undefined,
          is_virtual: formData.is_virtual || false,
          virtual_link: formData.virtual_link || undefined,
          max_attendees: formData.max_attendees || undefined,
          registration_deadline: formData.registration_deadline ? new Date(formData.registration_deadline).toISOString() : undefined,
          cover_image_id: formData.cover_image_id || undefined,
          is_featured: formData.is_featured || false,
          metadata: initialData?.metadata || {},
        };

        if (initialData) {
          await updateEvent(initialData.id, payload);
        } else {
          await createEvent(payload);
        }

        router.push('/admin/dashboard/events');
        router.refresh();
      } catch (err: any) {
        setError(err.message || 'An error occurred while saving the event.');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      {error && (
        <div className="p-4 bg-red-50 text-red-700 text-sm rounded-md border border-red-100">
          {error}
        </div>
      )}

      {/* CORE INFORMATION */}
      <h3 className="text-lg font-semibold border-b pb-2">Core Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="event_code">Event Code *</Label>
          <Input id="event_code" name="event_code" value={formData.event_code} onChange={handleChange} placeholder="e.g. EVT-2026-01" required disabled={!!initialData} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="program_id">Associated Program *</Label>
          <select id="program_id" name="program_id" value={formData.program_id} onChange={handleChange} className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" required>
            <option value="" disabled>Select a Program</option>
            {programs.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">Event Title *</Label>
          <Input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="Event Title" required />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="subtitle">Subtitle / Short Description</Label>
          <Input id="subtitle" name="subtitle" value={formData.subtitle || ''} onChange={handleChange} placeholder="Brief summary" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Full Description</Label>
          <textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} rows={5} className="w-full flex rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Detailed description..." />
        </div>
      </div>

      {/* CLASSIFICATION */}
      <h3 className="text-lg font-semibold border-b pb-2 pt-4">Classification</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select id="status" name="status" value={formData.status} onChange={handleChange} className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
            <option value="Registration Open">Registration Open</option>
            <option value="Registration Closed">Registration Closed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="event_type">Event Type *</Label>
          <Input id="event_type" name="event_type" value={formData.event_type} onChange={handleChange} placeholder="e.g. Workshop, Seminar" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="visibility">Visibility</Label>
          <select id="visibility" name="visibility" value={formData.visibility} onChange={handleChange} className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="internal">Internal</option>
          </select>
        </div>
      </div>

      {/* TIMING & REGISTRATION */}
      <h3 className="text-lg font-semibold border-b pb-2 pt-4">Timing & Registration</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="start_time">Start Time</Label>
          <Input type="datetime-local" id="start_time" name="start_time" value={formData.start_time || ''} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_time">End Time</Label>
          <Input type="datetime-local" id="end_time" name="end_time" value={formData.end_time || ''} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="registration_deadline">Registration Deadline</Label>
          <Input type="datetime-local" id="registration_deadline" name="registration_deadline" value={(formData.registration_deadline as string) || ''} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="max_attendees">Capacity (Max Attendees)</Label>
          <Input type="number" min={0} id="max_attendees" name="max_attendees" value={formData.max_attendees || 0} onChange={handleChange} />
        </div>
      </div>

      {/* LOCATION & VENUE */}
      <h3 className="text-lg font-semibold border-b pb-2 pt-4">Location & Virtual</h3>
      <div className="flex items-center gap-2 mb-4">
        <input type="checkbox" id="is_virtual" name="is_virtual" checked={formData.is_virtual} onChange={handleChange} className="h-4 w-4 text-blue-600" />
        <Label htmlFor="is_virtual">This is a virtual/online event</Label>
      </div>

      {formData.is_virtual && (
        <div className="space-y-2 mb-4">
          <Label htmlFor="virtual_link">Virtual Meeting Link</Label>
          <Input type="url" id="virtual_link" name="virtual_link" value={formData.virtual_link as string} onChange={handleChange} placeholder="https://zoom.us/j/123456" />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="venue_name">Venue Name</Label>
          <Input id="venue_name" name="venue_name" value={formData.venue_name || ''} onChange={handleChange} placeholder="e.g. Main Auditorium" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address_line1">Address Line 1</Label>
          <Input id="address_line1" name="address_line1" value={formData.address_line1 || ''} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" value={formData.city || ''} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input id="state" name="state" value={formData.state || ''} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="postal_code">Postal Code</Label>
          <Input id="postal_code" name="postal_code" value={formData.postal_code || ''} onChange={handleChange} />
        </div>
      </div>

      {/* MEDIA */}
      <h3 className="text-lg font-semibold border-b pb-2 pt-4">Media</h3>
      <div className="space-y-2 mb-4">
        <Label htmlFor="cover_image">Cover Image Upload</Label>
        <ImageUploader 
          folder="events" 
          onUploadComplete={handleUploadComplete} 
        />
        {formData.cover_image_id && <p className="text-sm text-green-600">Image attached successfully.</p>}
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
        <input type="checkbox" id="is_featured" name="is_featured" checked={formData.is_featured} onChange={handleChange} className="h-4 w-4" />
        <Label htmlFor="is_featured">Feature on Homepage / Directory</Label>
      </div>

      <div className="pt-4 border-t border-gray-100 flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.push('/admin/dashboard/events')} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : initialData ? 'Update Event' : 'Create Event'}
        </Button>
      </div>
    </form>
  );
}
