import React from 'react';
import { getAllPartners } from '@/features/partners/repository';
import PartnersAdmin from '@/components/admin/partners/PartnersAdmin';

export const metadata = {
  title: 'Manage Partners - Admin Dashboard',
};

export default async function PartnersAdminPage() {
  const partners = await getAllPartners();

  return (
    <div className="flex-1 w-full flex flex-col min-h-[calc(100vh-theme(spacing.16))]">
      <div className="flex-1 w-full p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Partners</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage UDBHAV Foundation partners displayed on the homepage.
          </p>
        </div>

        <PartnersAdmin initialPartners={partners} />
      </div>
    </div>
  );
}
