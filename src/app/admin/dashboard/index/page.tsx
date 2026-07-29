import React from 'react';

import { AdminInitiativeManagerClient } from '@/components/admin/index/AdminInitiativeManagerClient';
import { listIndexInitiatives } from '@/features/index/actions';

export const dynamic = 'force-dynamic';

export default async function AdminIndexInitiativesPage() {
  const result = await listIndexInitiatives({ page: 1, limit: 100 });
  const initiatives = result.success && result.data ? result.data.data : [];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <AdminInitiativeManagerClient initialInitiatives={initiatives} />
    </div>
  );
}
