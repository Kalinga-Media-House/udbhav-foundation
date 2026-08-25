import { LayoutTemplate } from 'lucide-react';
import React from 'react';

import { GalleryHeroManager } from '@/components/admin/hero/GalleryHeroManager';
import { getSettingByKey } from '@/features/system_settings/actions';

export const dynamic = 'force-dynamic';

export default async function GalleryHeroSettingsPage() {
  const result = await getSettingByKey('gallery_hero_background_image');
  let currentImage: string | null = null;
  
  if (result.success && result.data && result.data.value) {
    // Parse value as string, since settings value is typically JSON stringified
    try {
      currentImage = JSON.parse(result.data.value);
    } catch {
      currentImage = result.data.value;
    }
  }

  // Ensure it's empty if it's just quotes
  if (currentImage === '""' || currentImage === '') {
    currentImage = null;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
            <LayoutTemplate className="h-8 w-8 text-primary" />
            Gallery Hero Background
          </h1>
          <p className="mt-1 text-gray-500">
            Manage the background image displayed behind the carousel on the public Gallery page.
          </p>
        </div>
      </div>

      <GalleryHeroManager initialImage={currentImage} />
    </div>
  );
}
