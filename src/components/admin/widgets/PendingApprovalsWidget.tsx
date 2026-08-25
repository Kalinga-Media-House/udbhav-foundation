'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { getAdminPendingApprovalsAction, approveVolunteerApplicationAction } from '@/features/dashboard/actions';
import type { PendingApproval } from '@/features/dashboard/admin.repository';

export function PendingApprovalsWidget() {
  const [approvals, setApprovals] = useState<PendingApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const fetchApprovals = async () => {
    try {
      const result = await getAdminPendingApprovalsAction();
      if (result.success && result.data) {
        setApprovals(result.data);
        setError(false);
      } else {
        setError(true);
      }
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleApprove = async (item: PendingApproval) => {
    if (item.type !== 'volunteer_application') return;
    
    setApprovingId(item.id);
    try {
      const result = await approveVolunteerApplicationAction(item.realId);
      if (result.success) {
        toast.success(`${item.title} approved successfully`);
        await fetchApprovals(); // refresh
      } else {
        toast.error(result.error || 'Failed to approve');
      }
    } catch (e: any) {
      toast.error(e.message || 'An error occurred');
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="p-4 md:p-6 h-[300px] md:h-96 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base md:text-lg font-semibold text-zinc-900 dark:text-zinc-50">Pending Approvals</h3>
        {!loading && !error && (
          <span className="bg-rose-100 text-rose-700 text-xs font-semibold px-2 py-1 rounded-full dark:bg-rose-900/30 dark:text-rose-400">
            {approvals.length} items
          </span>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-3 relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full" />
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center text-red-500 text-sm">
            Unable to load pending approvals.
          </div>
        ) : approvals.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-500 text-sm">
            No pending approvals
          </div>
        ) : (
          approvals.map((item) => (
            <div key={item.id} className="p-3 border border-zinc-100 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
              <h4 className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">{item.title}</h4>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">By {item.user} • {item.date}</span>
                <div className="space-x-2 flex">
                  <Link href={item.actionUrl}>
                    <Button variant="outline" size="sm" className="h-7 text-xs">Review</Button>
                  </Link>
                  {item.canApprove && (
                    <Button 
                      size="sm" 
                      className="h-7 text-xs" 
                      onClick={() => handleApprove(item)}
                      disabled={approvingId === item.id}
                    >
                      {approvingId === item.id ? '...' : 'Approve'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
