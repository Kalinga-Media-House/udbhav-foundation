/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';

import { listAuditLogsAction } from '@/features/audit_logs/actions';
import type { Pagination } from '@/types';

export function ActivityTimeline() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const pagination: Pagination = { page: 1, limit: 20 };
        const res = await listAuditLogsAction(pagination);
        if (res.success && res.data) {
          setLogs(res.data.data as any);
        }
      } catch (error) {
        console.error('Failed to fetch activity logs:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flow-root">
          <ul role="list" className="-mb-8">
            {logs.length === 0 ? (
              <li className="py-8 text-center text-gray-500 dark:text-gray-400">No recent activity found.</li>
            ) : logs.map((log, logIdx) => (
              <li key={log.id || logIdx}>
                <div className="relative pb-8">
                  {logIdx !== logs.length - 1 ? (
                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                        <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p className="text-sm text-gray-800 dark:text-gray-200">
                          <span className="font-medium">{log.action || 'Performed action'}</span>
                          {' '}on{' '}
                          <span className="font-medium">{log.entityType || 'Resource'}</span>
                        </p>
                        {log.details && (
                          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                            <pre className="whitespace-pre-wrap font-mono text-xs">
                              {typeof log.details === 'object' ? JSON.stringify(log.details, null, 2) : log.details}
                            </pre>
                          </div>
                        )}
                      </div>
                      <div className="whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400 font-medium">
                        <time dateTime={log.createdAt}>
                          {log.createdAt ? new Date(log.createdAt).toLocaleString() : 'Unknown date'}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
