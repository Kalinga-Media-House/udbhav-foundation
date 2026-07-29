'use client';

import React, { useEffect, useState } from 'react';

import { fetchProgramPerformanceAction } from '@/features/analytics/actions';
import type { ProgramPerformanceItem } from '@/features/analytics/types';

export const ProgramImpactTable: React.FC = () => {
  const [items, setItems] = useState<ProgramPerformanceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadPrograms() {
      setLoading(true);
      const res = await fetchProgramPerformanceAction();
      if (!mounted) return;
      setItems(res.data || []);
      setLoading(false);
    }
    loadPrograms();
    return () => {
      mounted = false;
    };
  }, []);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Program Reach & Impact
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Fundraising & volunteer participation across foundation initiatives
          </p>
        </div>
        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950/50 dark:text-blue-400">
          Core Programs
        </span>
      </div>

      {loading ? (
        <div className="my-4 flex h-40 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        </div>
      ) : items.length === 0 ? (
        <div className="my-4 flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 p-4 text-center dark:border-gray-800">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            No operational programs found
          </p>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            Create initiatives in the Programs module to track comparative KPIs.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                <th className="pb-2 font-semibold">Program Title</th>
                <th className="pb-2 font-semibold">Status</th>
                <th className="pb-2 text-right font-semibold">Events</th>
                <th className="pb-2 text-right font-semibold">Volunteers</th>
                <th className="pb-2 text-right font-semibold">Funds Raised</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
              {items.map((item) => (
                <tr key={item.programId} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                  <td className="py-3 font-medium text-gray-900 dark:text-white">{item.title}</td>
                  <td className="py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        item.status.toLowerCase() === 'active'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 text-right text-gray-700 dark:text-gray-300">
                    {item.totalEvents}
                  </td>
                  <td className="py-3 text-right text-gray-700 dark:text-gray-300">
                    {item.totalVolunteers}
                  </td>
                  <td className="py-3 text-right font-semibold text-gray-900 dark:text-white">
                    {formatINR(item.totalFundsRaised)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
