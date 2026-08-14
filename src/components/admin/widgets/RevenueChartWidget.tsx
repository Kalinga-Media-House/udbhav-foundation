'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Jan', revenue: 40000 },
  { name: 'Feb', revenue: 30000 },
  { name: 'Mar', revenue: 20000 },
  { name: 'Apr', revenue: 27800 },
  { name: 'May', revenue: 18900 },
  { name: 'Jun', revenue: 23900 },
  { name: 'Jul', revenue: 34900 },
];

export function RevenueChartWidget() {
  return (
    <div className="flex h-[250px] md:h-96 flex-col p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base md:text-lg font-semibold text-zinc-900 dark:text-zinc-50">Donation Revenue</h3>
        <select className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs md:text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
          <option>Last 7 Months</option>
          <option>Last Year</option>
        </select>
      </div>
      <div className="flex-1">
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
              tickFormatter={(value) => `₹${value / 1000}k`}
            />
            <Tooltip
              formatter={((value: number) => [`₹${value.toLocaleString()}`, 'Revenue']) as any}
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
      </div>
    </div>
  );
}
