import { Metadata } from 'next';
import React from 'react';

import { AnalyticsDashboard } from '@/components/admin/analytics/AnalyticsDashboard';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Enterprise Analytics & BI | UDBHAV Foundation',
  description:
    'Real-time organizational KPIs aggregated via PostgreSQL materialized views with time-series filtering.',
};

export default function AdminAnalyticsPage() {
  return (
    <div className="p-6 md:p-8">
      <AnalyticsDashboard />
    </div>
  );
}
