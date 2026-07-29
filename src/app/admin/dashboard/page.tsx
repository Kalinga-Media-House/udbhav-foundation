import { Metadata } from 'next';
import React from 'react';

import { UnifiedAdminDashboard } from '@/components/admin/UnifiedAdminDashboard';

export const metadata: Metadata = {
  title: 'Admin Dashboard | UDBHAV Foundation',
  description: 'Enterprise administrative portal',
};

export default function AdminDashboardPage() {
  return (
    <UnifiedAdminDashboard />
  );
}
