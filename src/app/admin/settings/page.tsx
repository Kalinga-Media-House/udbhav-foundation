import { ShieldCheck, PlayCircle, Info, Building, Link2, DollarSign, Mail, Search } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { DynamicSettingsForm } from '@/components/admin/settings/DynamicSettingsForm';
import { SecuritySettings } from '@/components/admin/settings/SecuritySettings';
import { SocialMediaSettings } from '@/components/admin/settings/SocialMediaSettings';
import { YouTubeSettings } from '@/components/admin/settings/YouTubeSettings';
import { Button } from '@/components/ui/button';
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
              <Building className="h-4 w-4" /> Foundation
            </Link>
            <Link
              href="?section=social"
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${section === 'social' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <Link2 className={`h-4 w-4 ${section === 'social' ? 'text-indigo-700' : 'text-gray-400'}`} /> Social Links
            </Link>
            <Link
              href="?section=donation"
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${section === 'donation' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <DollarSign className={`h-4 w-4 ${section === 'donation' ? 'text-indigo-700' : 'text-gray-400'}`} /> Donation
            </Link>
            <Link
              href="?section=email"
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${section === 'email' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <Mail className={`h-4 w-4 ${section === 'email' ? 'text-indigo-700' : 'text-gray-400'}`} /> Email
            </Link>
            <Link
              href="?section=seo"
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${section === 'seo' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <Search className={`h-4 w-4 ${section === 'seo' ? 'text-indigo-700' : 'text-gray-400'}`} /> SEO
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
            <DynamicSettingsForm 
              title="Foundation Details" 
              description="Basic organization information displayed publicly."
              settings={settings.filter(s => 
                (s.category === 'General' || s.category === 'Contact') && 
                s.key_name !== 'default_language' && 
                s.key_name !== 'default_timezone'
              )} 
            />
          )}
          {section === 'donation' && (
            <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">Donation Settings</h2>
              </div>
              <div className="p-8 text-center flex flex-col items-center justify-center">
                <DollarSign className="w-12 h-12 text-indigo-200 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Donation System — Coming Soon</h3>
                <p className="text-gray-500 max-w-sm">
                  Payment gateway integration and automatic 80G receipt generation are currently under development.
                </p>
              </div>
            </section>
          )}
          {section === 'email' && (
            <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">Email Settings</h2>
              </div>
              <div className="p-8 text-center flex flex-col items-center justify-center">
                <Mail className="w-12 h-12 text-indigo-200 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Email Service Not Configured</h3>
                <p className="text-gray-500 max-w-sm">
                  There is currently no active SMTP or transactional email provider integration available to configure.
                </p>
              </div>
            </section>
          )}
          {section === 'seo' && (
            <>
              <DynamicSettingsForm 
                title="SEO Preferences" 
                settings={settings.filter(s => s.category === 'SEO')} 
              />
              <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                  <h2 className="text-lg font-semibold text-gray-900">Analytics</h2>
                </div>
                <div className="p-6">
                  <div className="flex gap-4 items-start rounded-md bg-blue-50 p-4 border border-blue-100">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-blue-900">Vercel Analytics is Active</h3>
                      <p className="mt-1 text-sm text-blue-700">
                        This project is currently using Vercel Analytics for privacy-friendly web vitals and visitor tracking. Google Analytics integration is disabled.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}
          {section === 'security' && <SecuritySettings />}
        </div>
      </div>
    </div>
  );
}


