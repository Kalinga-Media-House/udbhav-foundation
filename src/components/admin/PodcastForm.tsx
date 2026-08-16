'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { createPodcast, updatePodcast } from '@/features/podcasts/actions';

export function PodcastForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    episode_number: initialData?.episode_number || '',
    description: initialData?.description || '',
    excerpt: initialData?.excerpt || '',
    youtube_url: initialData?.youtube_url || '',
    status: initialData?.status || 'Draft',
    visibility: initialData?.visibility || 'public',
    release_date: initialData?.release_date ? new Date(initialData.release_date).toISOString().split('T')[0] : '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let res;
      if (initialData?.id) {
        res = await updatePodcast(initialData.id, formData as any);
      } else {
        res = await createPodcast(formData as any);
      }

      if (res.success) {
        alert(initialData?.id ? 'Podcast updated successfully!' : 'Podcast created successfully!');
        router.push('/admin/podcast');
        router.refresh();
      } else {
        throw new Error(res.error || 'Something went wrong');
      }
    } catch (error: any) {
      alert(error.message || 'Failed to save podcast');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Episode Title *</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter podcast title"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Episode Number</label>
            <input
              type="text"
              name="episode_number"
              value={formData.episode_number}
              onChange={handleChange}
              placeholder="e.g. 01, 104"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Release Date</label>
            <input
              type="date"
              name="release_date"
              value={formData.release_date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Short Description</label>
          <textarea
            name="excerpt"
            rows={2}
            value={formData.excerpt}
            onChange={handleChange}
            placeholder="A short summary of this episode..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Detailed Description</label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Full show notes or episode description..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Audio / Podcast URL</label>
          <input
            type="url"
            name="youtube_url"
            value={formData.youtube_url}
            onChange={handleChange}
            placeholder="https://youtube.com/..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">YouTube, Spotify, or external audio URL</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Publication Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Visibility</label>
            <select
              name="visibility"
              value={formData.visibility}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={() => router.push('/admin/podcast')}
          disabled={isSubmitting}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : (initialData?.id ? 'Save Changes' : 'Create Podcast')}
        </button>
      </div>
    </form>
  );
}
