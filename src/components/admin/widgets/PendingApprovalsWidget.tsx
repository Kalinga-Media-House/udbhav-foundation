'use client';

import React from 'react';

import { Button } from '@/components/ui/button';

const approvals = [
  { id: 1, title: 'Medical Camp Volunteer Badge', user: 'Amit Kumar', date: 'Today' },
  { id: 2, title: 'Press Release: Scholarship 2026', user: 'Priya Sharma', date: 'Yesterday' },
  { id: 3, title: 'Donation Receipt #8921', user: 'System', date: 'Yesterday' },
];

export function PendingApprovalsWidget() {
  return (
    <div className="p-4 md:p-6 h-[300px] md:h-96 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base md:text-lg font-semibold text-zinc-900 dark:text-zinc-50">Pending Approvals</h3>
        <span className="bg-rose-100 text-rose-700 text-xs font-semibold px-2 py-1 rounded-full dark:bg-rose-900/30 dark:text-rose-400">
          {approvals.length} items
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-3">
        {approvals.map((item) => (
          <div key={item.id} className="p-3 border border-zinc-100 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
            <h4 className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">{item.title}</h4>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">By {item.user}</span>
              <div className="space-x-2">
                <Button variant="outline" size="sm" className="h-7 text-xs">Review</Button>
                <Button size="sm" className="h-7 text-xs">Approve</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
