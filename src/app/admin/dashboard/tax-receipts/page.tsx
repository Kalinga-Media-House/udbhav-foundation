import React from 'react';

import { TaxReceiptsTable } from '@/components/donations/admin';
import { Button } from '@/components/ui/button';

export default function AdminTaxReceiptsPage() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tax Receipts</h1>
          <p className="text-sm text-gray-500">View and manage generated 80G tax receipts for eligible donations.</p>
        </div>
        <Button variant="outline">Generate Pending Receipts</Button>
      </div>

      <TaxReceiptsTable />
    </div>
  );
}
