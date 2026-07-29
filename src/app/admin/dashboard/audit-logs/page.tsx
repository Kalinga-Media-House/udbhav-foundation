import { Metadata } from 'next';
import React from 'react';

import { AuditLogViewer } from '@/components/admin/audit-logs/AuditLogViewer';

export const metadata: Metadata = {
  title: 'Audit Logs | Admin Dashboard',
  description: 'Enterprise activity ledger and audit logs.',
};

export default function AuditLogsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">System Audit Logs</h1>
        <p className="text-zinc-500 mt-1">
          Review enterprise activity, track user actions, and monitor system events.
        </p>
      </div>

      <AuditLogViewer />
    </div>
  );
}
