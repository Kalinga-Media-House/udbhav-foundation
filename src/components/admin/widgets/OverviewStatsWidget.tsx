'use client';

import { Users, Banknote, Calendar, CheckCircle2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { getAdminKPIsAction } from '@/features/dashboard/actions';
import type { AdminDashboardKPIs } from '@/features/dashboard/admin.repository';
import { toast } from 'sonner';

export function OverviewStatsWidget() {
  const [data, setData] = useState<AdminDashboardKPIs | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const result = await getAdminKPIsAction();
        if (result.success && result.data) {
          setData(result.data);
          setError(false);
        } else {
          setError(true);
          toast.error('Failed to load KPIs');
        }
      } catch (e) {
        console.error(e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchKPIs();
  }, []);

  if (loading) {
    return (
      <div className="p-6 h-40 flex items-center justify-center">
        <div className="animate-spin h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 h-40 flex items-center justify-center text-red-500 text-sm">
        Unable to load dashboard statistics.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4 md:mb-6">Key Performance Indicators</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Banknote className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Total Donations</p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">₹{data.totalDonations.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Volunteers</p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{data.volunteers.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Events</p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{data.events} Active</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Programs</p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{data.programs} Active</p>
          </div>
        </div>

      </div>
    </div>
  );
}
