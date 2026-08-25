'use client';

import { UserPlus, Image as ImageIcon, MessageSquare, AlertCircle, Activity } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { getAdminRecentActivityAction } from '@/features/dashboard/actions';

export function RecentActivityWidget() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchActivity = async () => {
      try {
        const result = await getAdminRecentActivityAction();
        if (result.success && result.data && isMounted) {
          setActivities(result.data);
          setError(false);
        } else if (isMounted) {
          setError(true);
        }
      } catch (e) {
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchActivity();
    return () => { isMounted = false; };
  }, []);

  const getIconAndColor = (type: string) => {
    if (type.includes('volunteer')) {
      return { icon: UserPlus, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' };
    }
    if (type.includes('gallery') || type.includes('media')) {
      return { icon: ImageIcon, color: 'text-green-500 bg-green-50 dark:bg-green-900/20' };
    }
    if (type.includes('comment') || type.includes('enquiry')) {
      return { icon: MessageSquare, color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' };
    }
    if (type.includes('system') || type.includes('webhook')) {
      return { icon: AlertCircle, color: 'text-rose-500 bg-rose-50 dark:bg-rose-900/20' };
    }
    return { icon: Activity, color: 'text-zinc-500 bg-zinc-50 dark:bg-zinc-900/20' };
  };

  return (
    <div className="p-4 md:p-6 h-[300px] md:h-96 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base md:text-lg font-semibold text-zinc-900 dark:text-zinc-50">Recent Activity</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full" />
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center text-red-500 text-sm">
            Unable to load activity logs.
          </div>
        ) : activities.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-500 text-sm">
            No recent activity
          </div>
        ) : (
          activities.map((activity) => {
            const { icon: Icon, color } = getIconAndColor(activity.type);
            return (
              <div key={activity.id} className="flex items-start space-x-4">
                <div className={`p-2 rounded-full ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{activity.content}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{activity.time}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
