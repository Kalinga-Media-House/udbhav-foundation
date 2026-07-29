'use client';

import React, { useState } from 'react';

import { refreshMaterializedViewsAction } from '@/features/analytics/actions';
import type { TimeRange } from '@/features/analytics/types';

import { CRMResolutionWidget } from './CRMResolutionWidget';
import { DonationTrendChart } from './DonationTrendChart';
import { KPIOverviewCards } from './KPIOverviewCards';
import { ProgramImpactTable } from './ProgramImpactTable';

const TIME_RANGES: { label: string; value: TimeRange }[] = [
  { label: '7 Days', value: '7d' },
  { label: '30 Days', value: '30d' },
  { label: '90 Days', value: '90d' },
  { label: '1 Year', value: '1y' },
  { label: 'All Time', value: 'all' },
];

export const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('1y');
  const [refreshing, setRefreshing] = useState(false);
  const [refreshStatus, setRefreshStatus] = useState<string | null>(null);

  const handleRefresh = async () => {
    setRefreshing(true);
    setRefreshStatus(null);
    try {
      const res = await refreshMaterializedViewsAction();
      if (res.error) {
        setRefreshStatus(res.error);
      } else {
        setRefreshStatus('Analytics views refreshed successfully.');
      }
    } catch {
      setRefreshStatus('Failed to trigger refresh.');
    } finally {
      setRefreshing(false);
      setTimeout(() => setRefreshStatus(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar with Time Range Selector & Refresh Action */}
      <div className="flex flex-col justify-between gap-4 border-b border-gray-200 pb-5 dark:border-gray-800 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Enterprise Analytics & BI
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Real-time organizational KPIs aggregated via PostgreSQL materialized views.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Time Range Tabs */}
          <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1 dark:border-gray-800 dark:bg-gray-900">
            {TIME_RANGES.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setTimeRange(tab.value)}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                  timeRange === tab.value
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white'
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Refresh Action */}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            {refreshing ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-600 border-t-transparent dark:border-gray-300" />
                <span>Refreshing...</span>
              </>
            ) : (
              <>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>Refresh Views</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status banner if present */}
      {refreshStatus && (
        <div
          className={`rounded-lg border px-4 py-2.5 text-xs font-medium ${
            refreshStatus.includes('success')
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300'
              : 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300'
          }`}
        >
          {refreshStatus}
        </div>
      )}

      {/* 1. Executive KPIs */}
      <KPIOverviewCards timeRange={timeRange} />

      {/* 2. Charts & SLAs Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DonationTrendChart timeRange={timeRange} />
        <CRMResolutionWidget />
      </div>

      {/* 3. Program Reach & Impact Table */}
      <ProgramImpactTable />
    </div>
  );
};
