'use client';

import { Loader2, PlayCircle, Trash2 } from 'lucide-react';
import React, { useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { upsertSiteLink, toggleSiteLink, deleteSiteLink } from '@/features/site-links/actions';
import type { SiteLinkRow } from '@/features/site-links/repository';

interface YouTubeSettingsProps {
  initialData: SiteLinkRow | null;
}

export function YouTubeSettings({ initialData }: YouTubeSettingsProps) {
  const [url, setUrl] = useState(initialData?.url || '');
  const [isActive, setIsActive] = useState(initialData?.is_active ?? false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const validateYouTubeUrl = (urlToTest: string) => {
    if (!urlToTest) return false;
    try {
      const parsed = new URL(urlToTest);
      return parsed.hostname === 'youtube.com' || 
             parsed.hostname === 'www.youtube.com' || 
             parsed.hostname === 'youtu.be';
    } catch {
      return false;
    }
  };

  const handleSave = () => {
    setError(null);
    setSuccess(false);

    if (url && !validateYouTubeUrl(url)) {
      setError('Please enter a valid YouTube channel URL.');
      return;
    }

    startTransition(async () => {
      const result = await upsertSiteLink('youtube_channel', {
        label: 'YouTube Channel',
        url: url.trim(),
        is_active: isActive
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error || 'Failed to save YouTube settings.');
      }
    });
  };

  const handleToggle = (checked: boolean) => {
    setIsActive(checked);
    if (initialData?.id) {
      startTransition(async () => {
        await toggleSiteLink('youtube_channel', checked);
      });
    }
  };

  const handleRemove = () => {
    if (confirm('Are you sure you want to remove the YouTube channel configuration?')) {
      startTransition(async () => {
        const result = await deleteSiteLink('youtube_channel');
        if (result.success) {
          setUrl('');
          setIsActive(false);
        } else {
          setError(result.error || 'Failed to delete configuration.');
        }
      });
    }
  };

  return (
    <section id="youtube" className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm mb-8">
      <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-red-600" />
            Podcast YouTube Channel
          </h2>
          <p className="text-sm text-gray-500">
            Manage the YouTube Channel URL displayed in the Podcast Hero section.
          </p>
        </div>
        {initialData?.id && (
          <Button variant="ghost" size="sm" onClick={handleRemove} className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <Trash2 className="w-4 h-4 mr-2" /> Remove
          </Button>
        )}
      </div>
      
      <div className="space-y-5 p-6">
        {!initialData?.url && (
          <div className="rounded-md bg-yellow-50 p-4 border border-yellow-200">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Configuration Required</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>YouTube Channel URL is not configured. Enter a valid URL below and set it to Active to display the button on the Podcast page.</p>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">YouTube Channel URL</label>
          <Input 
            value={url} 
            onChange={e => setUrl(e.target.value)} 
            placeholder="https://www.youtube.com/@UdbhavFoundation" 
            disabled={isPending}
          />
          {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
          {success && <p className="text-sm text-green-600 mt-1">Successfully saved.</p>}
        </div>
        
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <div>
            <p className="text-sm font-medium text-gray-900">Show on Podcast Page</p>
            <p className="text-xs text-gray-500">
              If active, the "Visit Our YouTube Channel" button will appear on the public podcast page.
            </p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input 
              type="checkbox" 
              checked={isActive} 
              onChange={e => handleToggle(e.target.checked)} 
              disabled={isPending}
              className="peer sr-only" 
            />
            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
          </label>
        </div>
      </div>
      <div className="flex justify-end border-t border-gray-100 bg-gray-50/50 px-6 py-3">
        <Button onClick={handleSave} disabled={isPending || (!url && !initialData)}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </section>
  );
}
