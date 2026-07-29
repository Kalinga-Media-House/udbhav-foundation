'use client';

import React, { useEffect, useState } from 'react';

import { fetchCRMHelpdeskMetricsAction } from '@/features/analytics/actions';
import type { CRMHelpdeskMetric } from '@/features/analytics/types';

export const CRMResolutionWidget: React.FC = () => {
  const [metrics, setMetrics] = useState<CRMHelpdeskMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadCRM() {
      setLoading(true);
      const res = await fetchCRMHelpdeskMetricsAction();
      if (!mounted) return;
      setMetrics(res.data || []);
      setLoading(false);
    }
    loadCRM();
    return () => {
      mounted = false;
    };
  }, []);

  const totalTickets = metrics.reduce((acc, m) => acc + m.totalTickets, 0);
  const totalResolved = metrics.reduce((acc, m) => acc + m.resolvedTickets, 0);
  const totalEscalated = metrics.reduce((acc, m) => acc + m.escalatedTickets, 0);
  const overallAvgHours =
    metrics.length > 0
      ? (metrics.reduce((acc, m) => acc + m.avgResolutionHours, 0) / metrics.length).toFixed(1)
      : '0.0';

  const resolutionRate = totalTickets > 0 ? Math.round((totalResolved / totalTickets) * 100) : 100;

  return (
    <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            CRM & Helpdesk SLA
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Resolution efficiency and escalation monitoring
          </p>
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            resolutionRate >= 80
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
          }`}
        >
          {resolutionRate}% SLA Resolved
        </span>
      </div>

      {loading ? (
        <div className="my-4 flex h-40 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
        </div>
      ) : metrics.length === 0 ? (
        <div className="my-4 flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 p-4 text-center dark:border-gray-800">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            No support inquiries recorded
          </p>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            Helpdesk SLAs will appear once contact inquiries are processed.
          </p>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-3 gap-2 border-b border-gray-100 pb-4 dark:border-gray-800">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 dark:text-white">{totalTickets}</div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400">Total Inquiries</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {overallAvgHours}h
              </div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400">Avg Resolution</div>
            </div>
            <div className="text-center">
              <div
                className={`text-lg font-bold ${
                  totalEscalated > 0
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {totalEscalated}
              </div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400">Escalated</div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {metrics.slice(0, 4).map((metric, idx) => (
              <div
                key={`${metric.department}-${idx}`}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {metric.department}
                  </span>
                  <span className="text-[10px] text-gray-400">({metric.category})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 dark:text-gray-400">
                    {metric.resolvedTickets}/{metric.totalTickets} resolved
                  </span>
                  <span className="font-mono text-[11px] font-semibold text-gray-900 dark:text-white">
                    {metric.avgResolutionHours}h
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
