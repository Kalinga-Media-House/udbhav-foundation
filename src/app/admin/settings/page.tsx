import { ShieldCheck, PlayCircle, Info, Building, Link2, Search } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { FoundationSeoSettings } from '@/components/admin/settings/FoundationSeoSettings';
import { SecuritySettings } from '@/components/admin/settings/SecuritySettings';
import { SocialMediaSettings } from '@/components/admin/settings/SocialMediaSettings';
import { YouTubeSettings } from '@/components/admin/settings/YouTubeSettings';
import { siteLinksRepository } from '@/features/site-links/repository';
import { socialLinksRepository } from '@/features/social-links/repository';
import { systemSettingsRepository } from '@/features/system_settings/repository';

import type { SocialLinkRow } from '@/features/social-links/repository';

export const dynamic = 'force-dynamic';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function AdminSettingsPage({ searchParams }: Props) {
  const params = await searchParams;
  const section = (params.section as string) || 'foundation';

  let youtubeSetting = null;
  if (section === 'youtube') {
    youtubeSetting = await siteLinksRepository.getBySlug('youtube_channel');
  }

  let socialLinks: SocialLinkRow[] = [];
  if (section === 'social') {
    socialLinks = await socialLinksRepository.getAll();
  }

  // Fetch all system settings to pass down
  const { data: allSettings } = await systemSettingsRepository.listSettings();
  const settings = allSettings || [];

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Platform Settings</h1>
        <p className="mt-1 text-gray-500">
          Configure foundation details, integrations, and global platform preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Settings Navigation */}
        <div className="col-span-1">
          <nav className="flex flex-col space-y-1">
            <Link
              href="?section=foundation"
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${section === 'foundation' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <Building className="h-4 w-4" /> Foundation & SEO
            </Link>
            <Link
              href="?section=social"
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${section === 'social' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <Link2 className={`h-4 w-4 ${section === 'social' ? 'text-indigo-700' : 'text-gray-400'}`} /> Social Links
            </Link>
            <Link
              href="?section=security"
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${section === 'security' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <ShieldCheck className={`h-4 w-4 ${section === 'security' ? 'text-indigo-700' : 'text-gray-400'}`} /> Security
            </Link>
            <Link
              href="?section=youtube"
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${section === 'youtube' ? 'bg-indigo-50 text-red-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <PlayCircle className={`h-4 w-4 ${section === 'youtube' ? 'text-red-600' : 'text-red-500'}`} /> YouTube Channel
            </Link>
          </nav>
        </div>

        {/* Settings Forms */}
        <div className="col-span-1 space-y-8 md:col-span-2">
          {section === 'youtube' && <YouTubeSettings initialData={youtubeSetting} />}
          {section === 'social' && <SocialMediaSettings initialLinks={socialLinks} />}
          {section === 'foundation' && (
            <FoundationSeoSettings settings={settings} />
          )}
          {section === 'security' && <SecuritySettings />}
        </div>
      </div>
    </div>
  );
}


