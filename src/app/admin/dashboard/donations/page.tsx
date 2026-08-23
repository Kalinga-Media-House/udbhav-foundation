/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link';
import React from 'react';

import { DonationKPIs, DonationsTable } from '@/components/donations/admin';
import { Button } from '@/components/ui/button';
import { listDonations } from '@/features/donations/actions';

export const dynamic = 'force-dynamic';

export default async function AdminDonationsPage(props: { searchParams: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams;
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  let donations: any[] = [];
  try {
    const result = await listDonations({ page, limit: 50 });
    if (result.success && result.data) {
      donations = result.data.data;
    }
  } catch (error) {
    // If backend isn't ready or throws error, we'll fall back to empty which the component handles with mock data.
    console.error('Failed to fetch donations:', error);
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donations Overview</h1>
          <p className="text-sm text-gray-500">Monitor overall donation KPIs and recent contributions.</p>
        </div>
        <div className="space-x-4">
          <Link href="/admin/dashboard/campaigns">
            <Button variant="outline">Manage Campaigns</Button>
          </Link>
          <Button>Export Data</Button>
        </div>
      </div>

      <DonationKPIs />

      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Donations</h2>
      </div>

      <DonationsTable donations={donations} />
    </div>
  );
}

