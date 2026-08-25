'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { toast } from 'sonner';

import { getAdminRevenueChartAction } from '@/features/dashboard/actions';
import type { RevenueDataPoint } from '@/features/dashboard/admin.repository';

export function RevenueChartWidget() {
  const [data, setData] = useState<RevenueDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [months, setMonths] = useState(7);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchRevenue = async () => {
      setLoading(true);
      try {
        const result = await getAdminRevenueChartAction(months);
        if (result.success && result.data && isMounted) {
          setData(result.data);
          setError(false);
        } else if (isMounted) {
          setError(true);
        }
      } catch (e) {
        console.error(e);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchRevenue();
    return () => { isMounted = false; };
  }, [months]);

  const hasData = data.some(d => d.revenue > 0);

  return (
    <div className="flex h-[250px] md:h-96 flex-col p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base md:text-lg font-semibold text-zinc-900 dark:text-zinc-50">Donation Revenue</h3>
        <select 
          value={months}
          onChange={(e) => setMonths(Number(e.target.value))}
          className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs md:text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
        >
          <option value={7}>Last 7 Months</option>
          <option value={12}>Last Year</option>
        </select>
      </div>
      
      <div className="flex-1 relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full" />
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center text-red-500 text-sm">
            Unable to load donation statistics.
          </div>
        ) : !hasData ? (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-500 dark:text-zinc-400 text-sm">
            No donation revenue recorded yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#71717a' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#71717a' }}
                tickFormatter={(value) => value >= 1000 ? `₹${value / 1000}k` : `₹${value}`}
              />
              <Tooltip
                formatter={((value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']) as any}
                labelClassName="text-zinc-900 dark:text-zinc-50"
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#6366f1"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
