import { ShieldAlert } from 'lucide-react';
import type { Metadata } from 'next';

import { requireAuth, requireSuperAdminAuth } from '@/contracts/actions';

import { GoogleIntegrationsClient } from '@/components/admin/integrations/GoogleIntegrationsClient';
import {
  getIntegrationStatuses,
  checkOAuthConfiguration,
} from '@/features/google-integrations';

export const metadata: Metadata = {
  title: 'Google Integrations',
  description: 'Connect UDBHAV Foundation with Google Analytics, Search Console, and Google Ads.',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function GoogleIntegrationsPage() {
  // 1. Enforce Super Admin access at the page level
  const session = await requireAuth();
  try {
    requireSuperAdminAuth(session);
  } catch {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-500 max-w-md">
          You do not have the required Super Admin privileges to manage Google integrations.
        </p>
      </div>
    );
  }

  // 2. Fetch current integration statuses
  const [statusResult, configResult] = await Promise.all([
    getIntegrationStatuses(),
    checkOAuthConfiguration(),
  ]);

  const integrations = statusResult.data || [];
  const config = configResult.data || {
    configured: false,
    hasClientId: false,
    hasClientSecret: false,
    hasEncryptionKey: false,
    hasAdsDevToken: false,
  };

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Google Integrations
        </h1>
        <p className="mt-1 text-gray-500">
          Connect UDBHAV Foundation with Google Analytics, Search Console, and Google Ads.
        </p>
      </div>

      <GoogleIntegrationsClient
        integrations={integrations}
        oauthConfigured={config.configured}
        configStatus={config}
      />
    </div>
  );
}
