import { Image as ImageIcon } from 'lucide-react';
import React from 'react';

import { HeroManager } from '@/components/admin/hero/HeroManager';
import { AboutHeroManager } from '@/components/admin/hero/AboutHeroManager';
import { getAdminHeroImages } from '@/features/hero/repository';
import { systemSettingsRepository } from '@/features/system_settings/repository';

export const metadata = {
  title: 'Hero Images | Admin Dashboard',
};

export default async function HeroDashboardPage() {
  const homeHeroImages = await getAdminHeroImages('home_hero');
  const programmesHeroImages = await getAdminHeroImages('programmes_hero');

  const publicSettings = await systemSettingsRepository.getPublicSettings();
  let aboutHeroBgImage = publicSettings.about_hero_background_image || null;

  if (typeof aboutHeroBgImage === 'string' && aboutHeroBgImage.startsWith('"') && aboutHeroBgImage.endsWith('"')) {
    aboutHeroBgImage = aboutHeroBgImage.substring(1, aboutHeroBgImage.length - 1);
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <ImageIcon className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Hero Images</h1>
        </div>
        <p className="text-gray-500 max-w-2xl">
          Manage the dynamic background images for the main website hero sections.
          Changes made here will instantly reflect on the public website.
        </p>
      </div>

      <div className="space-y-8">
        <HeroManager
          section="home_hero"
          initialImages={homeHeroImages}
          title="Home Page Hero"
        />

        <AboutHeroManager initialImage={aboutHeroBgImage} />

        <HeroManager
          section="programmes_hero"
          initialImages={programmesHeroImages}
          title="Programmes & Initiatives Hero"
        />
      </div>
    </div>
  );
}
