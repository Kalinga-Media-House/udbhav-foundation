import { Plus, Building2, Search } from 'lucide-react';
import { Metadata } from 'next';

import { OrganizationCard } from '@/components/frm/OrganizationCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { contactsService } from '@/features/contacts/service';

export const metadata: Metadata = {
  title: 'Organizations | UDBHAV Foundation',
  description: 'Manage partner organizations, sponsors, and vendors.',
};

export const dynamic = 'force-dynamic';

export default async function OrganizationsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  
  const page = typeof params.page === 'string' ? parseInt(params.page) : 1;
  const limit = typeof params.limit === 'string' ? parseInt(params.limit) : 20;
  const q = typeof params.q === 'string' ? params.q : '';

  let organizationsResult;
  if (q) {
    organizationsResult = await contactsService.listOrganizations(
      { page, limit },
      { search: q }
    );
  } else {
    organizationsResult = await contactsService.listOrganizations({ page, limit });
  }

  const organizations = organizationsResult.success ? organizationsResult.data?.data || [] : [];

  return (
    <div className="flex flex-col min-h-[calc(100vh-theme(spacing.16))] -m-8 bg-zinc-50 dark:bg-zinc-900/20">
      {/* Page Header */}
      <div className="flex items-center justify-between p-6 md:p-8 lg:px-12 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Organizations
            </h1>
            <p className="text-sm text-zinc-500">
              Manage corporate partners, sponsors, vendors, and institutional relationships.
            </p>
          </div>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Organization
        </Button>
      </div>

      <div className="p-6 md:p-8 lg:px-12">
        {/* Actions Bar */}
        <div className="flex items-center justify-between mb-8">
          <form className="relative w-full max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <Input
              name="q"
              defaultValue={q}
              placeholder="Search organizations..."
              className="pl-10 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
            />
          </form>
          <div className="flex items-center space-x-3">
            {/* Filters could go here */}
          </div>
        </div>

        {/* Grid */}
        {organizations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {organizations.map((org: any) => (
              <OrganizationCard
                key={org.id}
                id={org.id}
                name={org.name}
                type={org.org_type || 'Organization'}
                location={org.city ? `${org.city}${org.country ? `, ${org.country}` : ''}` : undefined}
                contactCount={org.contact_count || 0}
                status={org.status}
                logoUrl={org.logo_media_id}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border rounded-xl bg-white dark:bg-zinc-950 border-dashed border-zinc-200 dark:border-zinc-800">
            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-4">
              <Building2 className="w-8 h-8 text-zinc-300 dark:text-zinc-700" />
            </div>
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">No organizations found</h3>
            <p className="text-sm text-zinc-500 mt-1 mb-6 max-w-md">
              {q ? `No organizations matching "${q}".` : 'You haven\'t added any organizations yet. Start building your network.'}
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Organization
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
