import { Metadata } from 'next';
import React from 'react';

import { NotificationCenter } from '@/components/admin/notifications/NotificationCenter';

export const metadata: Metadata = {
  title: 'Notification Center | Admin Dashboard',
  description: 'Enterprise Notification Center',
};

export default function NotificationsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Notification Center</h1>
        <p className="text-zinc-500 mt-1">
          Review system alerts, task assignments, and enterprise broadcasts.
        </p>
      </div>

      <NotificationCenter />
    </div>
  );
}
