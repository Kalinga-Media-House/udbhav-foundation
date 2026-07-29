import { Metadata } from 'next';
import React from 'react';

import { AnalyticsDashboard } from '@/components/admin/analytics/AnalyticsDashboard';
import { ReportsDashboard } from '@/components/admin/reports/ReportsDashboard';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Reports & Analytics | UDBHAV Foundation',
  description: 'Enterprise BI analytics dashboard and offline CSV/PDF report snapshot generator.',
};

export default function ReportsAndAnalyticsPage() {
  return (
    <div className="space-y-12 p-6 md:p-8">
      {/* Primary BI Analytics Dashboard */}
      <AnalyticsDashboard />

      {/* Offline Report Export Section */}
      <div className="border-t border-gray-200 pt-8 dark:border-gray-800">
        <div className="mb-6">
          <h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            Offline CSV Data Snapshots
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Export raw operational data snapshots for external compliance and reporting.
          </p>
        </div>
        <ReportsDashboard />
      </div>
    </div>
  );
}
