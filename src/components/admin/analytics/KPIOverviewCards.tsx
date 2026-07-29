'use client';

import React, { useEffect, useState } from 'react';

import { fetchExecutiveKPIsAction } from '@/features/analytics/actions';
import type { TimeRange, ExecutiveKPIs } from '@/features/analytics/types';

interface KPIOverviewCardsProps {
  timeRange: TimeRange;
}

export const KPIOverviewCards: React.FC<KPIOverviewCardsProps> = ({ timeRange }) => {
  const [data, setData] = useState<ExecutiveKPIs | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadKPIs() {
      setLoading(true);
      setError(null);
      const res = await fetchExecutiveKPIsAction(timeRange);
      if (!mounted) return;
      if (res.error) {
        setError(res.error);
        setData(null);
      } else {
        setData(res.data || null);
      }
      setLoading(false);
    }
    loadKPIs();
    return () => {
      mounted = false;
    };
  }, [timeRange]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-900"
          />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300">
        Unable to load KPI summary: {error || 'No analytics data available.'}
      </div>
    );
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const cards = [
    {
      title: 'Total Funds Collected',
      value: formatCurrency(data.totalFundsCollected, data.currency),
      badge: `${data.fundsGrowthPercentage >= 0 ? '+' : ''}${data.fundsGrowthPercentage}% MoM`,
      badgeColor:
        data.fundsGrowthPercentage >= 0
          ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800'
          : 'text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800',
      description: 'Lifetime donations collected',
    },
    {
      title: 'Registered Users',
      value: data.totalUsers.toLocaleString(),
      badge: `+${data.newUsersPeriod} new`,
      badgeColor:
        'text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800',
      description: 'Total platform members',
    },
    {
      title: 'Active Volunteers',
      value: data.activeVolunteers.toLocaleString(),
      badge: `${data.volunteerHours.toLocaleString()} hrs`,
      badgeColor:
        'text-purple-700 bg-purple-50 dark:text-purple-400 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800',
      description: 'Total contributed hours',
    },
    {
      title: 'Active Programs',
      value: data.activePrograms.toLocaleString(),
      badge: `${data.openEnquiries} open inquiries`,
      badgeColor:
        data.openEnquiries > 0
          ? 'text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800'
          : 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800 border-gray-200 dark:border-gray-700',
      description: 'Ongoing initiatives & helpdesk',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {card.title}
            </span>
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${card.badgeColor}`}
            >
              {card.badge}
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {card.value}
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{card.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
