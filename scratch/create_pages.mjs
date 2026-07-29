import fs from 'fs';
import path from 'path';

const appDir = 'c:/Projects/udbhav-foundation/src/app/admin/dashboard';

// --- Contact Types ---
const ctDir = path.join(appDir, 'contact-types');
fs.mkdirSync(ctDir, { recursive: true });

const ctContent = `import { Metadata } from 'next';
import { Settings, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { contactsService } from '@/features/contacts/service';

export const metadata: Metadata = {
  title: 'Contact Types | UDBHAV Foundation',
  description: 'Manage types of contacts.',
};

export const dynamic = 'force-dynamic';

export default async function ContactTypesPage() {
  const result = await contactsService.listContactTypes();
  const types = result.success && result.data ? result.data : [];

  return (
    <div className="flex flex-col min-h-[calc(100vh-theme(spacing.16))] -m-8 bg-zinc-50 dark:bg-zinc-900/20">
      <div className="flex items-center justify-between p-6 md:p-8 lg:px-12 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Settings className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Contact Types</h1>
            <p className="text-sm text-zinc-500">Configure core contact classifications.</p>
          </div>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" />Add Type</Button>
      </div>

      <div className="p-6 md:p-8 lg:px-12">
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 font-medium">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {types.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-zinc-500">No contact types found.</td></tr>
              )}
              {types.map((t: any) => (
                <tr key={t.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                  <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">{t.name}</td>
                  <td className="px-6 py-4 text-zinc-500">{t.slug}</td>
                  <td className="px-6 py-4">
                    <span className={\`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium \${t.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400'}\`}>
                      {t.is_active ? 'Active' : 'Inactive'}
                    </span>
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
`;
fs.writeFileSync(path.join(ctDir, 'page.tsx'), ctContent);


// --- Tags ---
const tagsDir = path.join(appDir, 'tags');
fs.mkdirSync(tagsDir, { recursive: true });

const tagsContent = `import { Metadata } from 'next';
import { Tags, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { contactsService } from '@/features/contacts/service';

export const metadata: Metadata = {
  title: 'Tags | UDBHAV Foundation',
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
`;
fs.writeFileSync(path.join(tagsDir, 'page.tsx'), tagsContent);


// --- Interactions ---
const interactionsDir = path.join(appDir, 'interactions');
fs.mkdirSync(interactionsDir, { recursive: true });

const interactionsContent = `import { Metadata } from 'next';
import { Activity } from 'lucide-react';
import { contactsService } from '@/features/contacts/service';

export const metadata: Metadata = {
  title: 'Interactions | UDBHAV Foundation',
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
`;
fs.writeFileSync(path.join(interactionsDir, 'page.tsx'), interactionsContent);

console.log('Pages created.');
