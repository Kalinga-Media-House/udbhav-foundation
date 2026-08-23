/* eslint-disable */
'use client';

import React, { useState } from 'react';

import {
  fetchDonationsAction,
  fetchContactsAction,
  fetchVolunteersAction,
  fetchUsersAction,
} from '@/features/reports/actions';
import { exportToCSV } from '@/lib/utils/csv-export';

const REPORT_TYPES = [
  {
    id: 'donations',
    title: 'Donations Export',
    description: 'Export all donation records, including donor details, amounts, and statuses.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    action: fetchDonationsAction,
  },
  {
    id: 'contacts',
    title: 'Contacts Export',
    description: 'Export contact submissions, inquiries, and feedback forms.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    action: fetchContactsAction,
  },
  {
    id: 'volunteers',
    title: 'Volunteers Export',
    description: 'Export registered volunteers, their interests, and availability.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    action: fetchVolunteersAction,
  },
  {
    id: 'users',
    title: 'Users Export',
    description: 'Export all registered users, roles, and status.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    action: fetchUsersAction,
  },
];

export const ReportsDashboard = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async (report: any) => {
    setLoading(report.id);
    setError(null);
    try {
      const response = await report.action();
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        exportToCSV(response.data, report.id);
      } else {
        setError('No data found for this report');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during export');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports &amp; Exports</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Generate and download CSV reports for different modules.
        </p>
        {error && (
          <div className="mt-4 rounded-lg bg-red-100 p-4 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
        {REPORT_TYPES.map((report) => (
          <div
            key={report.id}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className={`rounded-lg p-3 ${report.bg} ${report.color}`}>{report.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {report.title}
                  </h3>
                  <p className="mt-1 max-w-[250px] text-sm text-gray-500 dark:text-gray-400">
                    {report.description}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end border-t border-gray-100 pt-4 dark:border-gray-700/50">
              <button
                onClick={() => handleExport(report)}
                disabled={loading !== null}
                className="flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900"
              >
                {loading === report.id ? (
                  <svg
                    className="-ml-1 mr-2 h-4 w-4 animate-spin text-gray-700 dark:text-gray-200"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                )}
                {loading === report.id ? 'Exporting...' : 'Export CSV'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
