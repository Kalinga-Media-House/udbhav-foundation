import { Metadata } from 'next';
import React from 'react';

import { SystemSettings } from '@/components/admin/settings/SystemSettings';

export const metadata: Metadata = {
  title: 'System Settings | Admin Dashboard',
  description: 'Enterprise system settings and configuration',
};

export default function SystemSettingsPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">System Settings</h1>
        <p className="text-zinc-500 mt-1">
          Configure branding, SEO, feature flags, and foundation metadata.
        </p>
      </div>

      <SystemSettings />
    </div>
  );
}
