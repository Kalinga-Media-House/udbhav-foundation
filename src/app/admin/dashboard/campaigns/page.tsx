import Link from 'next/link';
import React from 'react';

import { CampaignsTable } from '@/components/donations/admin';
import { Button } from '@/components/ui/button';

export default function AdminCampaignsPage() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns Management</h1>
          <p className="text-sm text-gray-500">Create, edit, and track progress for fundraising campaigns.</p>
        </div>
        <Link href="/admin/dashboard/campaigns/new">
          <Button>Create Campaign</Button>
        </Link>
      </div>

      <CampaignsTable />
    </div>
  );
}
