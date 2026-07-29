'use client';

import { UserPlus, Image as ImageIcon, MessageSquare, AlertCircle } from 'lucide-react';
import React from 'react';

const activities = [
  { id: 1, type: 'volunteer', content: 'New volunteer application from Sarah Jenkins', time: '10 mins ago', icon: UserPlus, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
  { id: 2, type: 'gallery', content: 'Rahul uploaded 12 new photos to "Annual Meet 2026"', time: '1 hour ago', icon: ImageIcon, color: 'text-green-500 bg-green-50 dark:bg-green-900/20' },
  { id: 3, type: 'comment', content: 'New comment on "Impact of Education" story', time: '2 hours ago', icon: MessageSquare, color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
  { id: 4, type: 'system', content: 'Failed webhook delivery from payment gateway', time: '5 hours ago', icon: AlertCircle, color: 'text-rose-500 bg-rose-50 dark:bg-rose-900/20' },
];

export function RecentActivityWidget() {
  return (
    <div className="p-6 h-96 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Recent Activity</h3>
        <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">View All</button>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start space-x-4">
              <div className={`p-2 rounded-full ${activity.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{activity.content}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
