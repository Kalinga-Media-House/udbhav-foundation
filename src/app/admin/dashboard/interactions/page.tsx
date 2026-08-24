/* eslint-disable @typescript-eslint/no-explicit-any */
import { Activity } from 'lucide-react';
import { Metadata } from 'next';

import { contactsService } from '@/features/contacts/service';

export const metadata: Metadata = {
  title: 'Interactions',
  description: 'Global view of contact interactions.',
};

export const dynamic = 'force-dynamic';

export default async function InteractionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = typeof params.page === 'string' ? parseInt(params.page) : 1;
  const limit = typeof params.limit === 'string' ? parseInt(params.limit) : 50;

  const result = await contactsService.listInteractions({ page, limit });
  const interactions = result.success && result.data ? result.data.data : [];

  return (
    <div className="flex flex-col min-h-[calc(100vh-theme(spacing.16))] -m-8 bg-zinc-50 dark:bg-zinc-900/20">
      <div className="flex items-center justify-between p-6 md:p-8 lg:px-12 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Interactions Feed</h1>
            <p className="text-sm text-zinc-500">Global audit trail of all CRM activity.</p>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 lg:px-12">
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 font-medium">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {interactions.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-zinc-500">No interactions recorded yet.</td></tr>
              )}
              {interactions.map((i: any) => (
                <tr key={i.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                  <td className="px-6 py-4 text-zinc-500">{new Date(i.interaction_date).toLocaleString()}</td>
                  <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">{i.contacts?.full_name || 'Unknown Contact'}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                      {i.interaction_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-500 truncate max-w-[300px]">{i.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

