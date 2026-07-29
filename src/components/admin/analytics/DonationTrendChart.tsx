'use client';

import React, { useEffect, useState } from 'react';

import { fetchDonationTimeSeriesAction } from '@/features/analytics/actions';
import type { TimeRange, TimeSeriesPoint } from '@/features/analytics/types';

interface DonationTrendChartProps {
  timeRange: TimeRange;
}

export const DonationTrendChart: React.FC<DonationTrendChartProps> = ({ timeRange }) => {
  const [data, setData] = useState<TimeSeriesPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadSeries() {
      setLoading(true);
      const res = await fetchDonationTimeSeriesAction(timeRange);
      if (!mounted) return;
      if (res.data) {
        setData(res.data);
      } else {
        setData([]);
      }
      setLoading(false);
    }
    loadSeries();
    return () => {
      mounted = false;
    };
  }, [timeRange]);

  const maxValue = data.length > 0 ? Math.max(...data.map((d) => d.value), 1) : 1000;

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Donation Inflow Trend
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Monthly aggregated contributions (INR)
          </p>
        </div>
        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
          Monthly Inflows
        </span>
      </div>

      {loading ? (
        <div className="my-6 flex h-48 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
        </div>
      ) : data.length === 0 ? (
        <div className="my-6 flex h-48 flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 p-4 text-center dark:border-gray-800">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            No donation records in this time period
          </p>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            Donation data will appear here automatically once transactions occur.
          </p>
        </div>
      ) : (
        <div className="mt-6">
          <div className="flex h-48 items-end gap-2 border-b border-gray-200 pb-2 dark:border-gray-800">
            {data.map((point, idx) => {
              const heightPct = Math.max(
                Math.round((point.value / maxValue) * 100),
                4 // minimum bar height 4%
              );
              return (
                <div
                  key={point.period || idx}
                  className="group relative flex h-full flex-1 flex-col items-center justify-end"
                >
                  <div
                    className="w-full rounded-t-md bg-emerald-600 transition-all duration-300 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400"
                    style={{ height: `${heightPct}%` }}
                    aria-label={`${point.label}: ${formatINR(point.value)}`}
                  />
                  {/* Tooltip on hover */}
                  <div className="pointer-events-none absolute bottom-full z-10 mb-2 hidden whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white shadow-md group-hover:block dark:bg-gray-800">
                    <div className="font-semibold">{formatINR(point.value)}</div>
                    <div className="text-[10px] text-gray-300">
                      {point.secondaryValue ? `${point.secondaryValue} donations` : point.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-gray-500 dark:text-gray-400">
            {data.map((point, idx) => (
              <span key={idx} className="flex-1 truncate text-center">
                {point.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
