/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tags, Plus } from 'lucide-react';
import { Metadata } from 'next';

import { Button } from '@/components/ui/button';
import { contactsService } from '@/features/contacts/service';

export const metadata: Metadata = {
  title: 'Tags',
  description: 'Manage relationship tags.',
};

export const dynamic = 'force-dynamic';

export default async function TagsPage() {
  const result = await contactsService.listTags();
  const tags = result.success && result.data ? result.data : [];

  return (
    <div className="flex flex-col min-h-[calc(100vh-theme(spacing.16))] -m-8 bg-zinc-50 dark:bg-zinc-900/20">
      <div className="flex items-center justify-between p-6 md:p-8 lg:px-12 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Tags className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Tags</h1>
            <p className="text-sm text-zinc-500">Manage tags for segmenting contacts.</p>
          </div>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" />Add Tag</Button>
      </div>

      <div className="p-6 md:p-8 lg:px-12">
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 font-medium">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Color</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {tags.length === 0 && (
                <tr><td colSpan={3} className="px-6 py-8 text-center text-zinc-500">No tags found.</td></tr>
              )}
              {tags.map((t: any) => (
                <tr key={t.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                  <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">{t.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: t.color || '#e4e4e7' }} />
                      {t.color || 'Default'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
