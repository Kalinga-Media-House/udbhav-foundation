'use client';

import { Users, Banknote, Calendar, CheckCircle2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export function OverviewStatsWidget() {
  const [data, setData] = useState<{
    donations: string;
    volunteers: string;
    events: string;
    programs: string;
  }>({
    donations: '₹0',
    volunteers: '0',
    events: '0',
    programs: '0'
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation this would fetch from a Server Action
    // For now we simulate loading stats
    setTimeout(() => {
      setData({
        donations: '₹14,50,000',
        volunteers: '1,240',
        events: '12 Active',
        programs: '8 Active'
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="p-6 h-40 flex items-center justify-center">
        <div className="animate-spin h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-6">Key Performance Indicators</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Banknote className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Total Donations</p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{data.donations}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Volunteers</p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{data.volunteers}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Events</p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{data.events}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Programs</p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{data.programs}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
