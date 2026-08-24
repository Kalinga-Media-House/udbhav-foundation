import { ShieldAlert } from 'lucide-react';
import React from 'react';

import { Container } from '@/components/shared/Container';
import { ROLES } from '@/constants/roles';
import { requireAuth } from '@/contracts/actions';
import { systemSettingsRepository } from '@/features/system_settings/repository';
import { getActiveGoverningBodyMembers } from '@/features/governing-body/repository';
import AdminAboutPageClient from './AdminAboutPageClient';

export default async function AdminAboutPage() {
  const session = await requireAuth();
  
  if (!session || (session.role !== ROLES.ADMIN && session.role !== ROLES.SUPER_ADMIN)) {
    return (
      <Container className="py-12">
        <div className="flex flex-col items-center justify-center text-center p-8 bg-red-50 text-red-900 rounded-xl">
          <ShieldAlert className="h-12 w-12 mb-4" />
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p>You do not have permission to manage About Page content.</p>
        </div>
      </Container>
    );
  }

  // Fetch all public settings
  const publicSettings = await systemSettingsRepository.getPublicSettings();
  
  // Extract the specific settings for About page
  const aboutSettings = {
    about_who_we_are_image: publicSettings.about_who_we_are_image || '/hero/hero-02.png',
    about_what_we_do_image: publicSettings.about_what_we_do_image || '/hero/hero-05.png',
    about_when_we_started_image: publicSettings.about_when_we_started_image || '/hero/hero-08.png',
    about_why_work_matters_image: publicSettings.about_why_work_matters_image || '/hero/hero-07.png',
  };

  // Get founder image separately
  const members = await getActiveGoverningBodyMembers();
  const founder = members.find((m) => m.full_name.toLowerCase().includes('jaysuraj'));
  const founderImage = founder?.photo_url || null;
  const founderId = founder?.id || null;

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight">
            About Page Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage the photographs displayed on the UDBHAV Foundation About page.
          </p>
        </div>
      </div>
      <div className="px-4 sm:px-6 md:px-8 pb-12">
        <AdminAboutPageClient 
          initialSettings={aboutSettings}
          founderId={founderId}
          founderImage={founderImage}
        />
      </div>
    </div>
  );
}
