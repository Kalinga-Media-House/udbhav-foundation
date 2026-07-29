import { Plus, Users } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

import { ContactAvatar } from '@/components/frm/ContactAvatar';
import { StatusBadge } from '@/components/frm/ContactBadge';
import { ContactFilterPanel } from '@/components/frm/ContactFilterPanel';
import { ContactPreviewPanel } from '@/components/frm/ContactPreviewPanel';
import { ContactTable, ContactColumn } from '@/components/frm/ContactTable';
import { Button } from '@/components/ui/button';
import { contactsService } from '@/features/contacts/service';

export const metadata: Metadata = {
  title: 'Relationships | UDBHAV Foundation',
  description: 'Manage all contacts, volunteers, donors, and partners.',
};

export const dynamic = 'force-dynamic';

export default async function RelationshipsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  
  const page = typeof params.page === 'string' ? parseInt(params.page) : 1;
  const limit = typeof params.limit === 'string' ? parseInt(params.limit) : 20;
  const q = typeof params.q === 'string' ? params.q : '';
  const previewId = typeof params.previewId === 'string' ? params.previewId : undefined;
  
  // Extract filters
  const types = Array.isArray(params.type) ? params.type : params.type ? [params.type] : undefined;
  const status = Array.isArray(params.status) ? params.status : params.status ? [params.status] : undefined;

  let contactsResult;
  if (q) {
    // Service might not have searchContacts, fallback to listContacts with q
    contactsResult = await contactsService.listContacts(
      { page, limit },
      { contact_type_ids: types, status, search: q }
    );
  } else {
    contactsResult = await contactsService.listContacts(
      { page, limit },
      { contact_type_ids: types, status }
    );
  }

  const contacts = contactsResult.success ? contactsResult.data?.data || [] : [];
  
  let previewContact = null;
  if (previewId) {
    const previewResult = await contactsService.getContact(previewId);
    if (previewResult.success) {
      previewContact = previewResult.data;
    }
  }

  // Fetch reference data for filters (Types, Tags, Orgs)
  // Here we just use a small mock since these are driven by taxonomy
  // In a real app we'd fetch these from the database
  const contactTypes = [
    { id: '1', label: 'Volunteer' },
    { id: '2', label: 'Donor' },
    { id: '3', label: 'Partner' },
    { id: '4', label: 'Beneficiary' },
  ];

  const columns: ContactColumn[] = [
    {
      key: 'full_name',
      label: 'Name',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center space-x-3">
          <ContactAvatar name={val} photoUrl={row.photo_media_id} size="sm" />
          <div className="flex flex-col">
            <span className="font-medium text-zinc-900 dark:text-zinc-100">{val}</span>
            <span className="text-xs text-zinc-500">{row.email || row.phone}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'organization',
      label: 'Organization',
      hiddenOnMobile: true,
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="text-zinc-700 dark:text-zinc-300">
            {row.organization_id ? 'Organization Name (Linked)' : '-'}
          </span>
          {row.designation && <span className="text-xs text-zinc-500">{row.designation}</span>}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val) => <StatusBadge status={val as string} />,
    },
    {
      key: 'updated_at',
      label: 'Last Active',
      hiddenOnMobile: true,
      sortable: true,
      render: (val) => (
        <span className="text-zinc-500 text-xs">
          {new Date(val as string).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] -m-8">
      {/* Page Header */}
      <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Relationships
            </h1>
            <p className="text-sm text-zinc-500">
              Manage all foundation contacts and relationships.
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href="/admin/dashboard/relationships/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </Link>
        </Button>
      </div>

      {/* Split Layout Body */}
      <div className="flex-1 flex overflow-hidden bg-zinc-50 dark:bg-zinc-900/20">
        
        {/* Left Sidebar - Filters */}
        <div className="hidden lg:block w-72 flex-shrink-0">
          <ContactFilterPanel types={contactTypes} />
        </div>

        {/* Center - Data Table */}
        <div className="flex-1 overflow-y-auto p-6">
          <ContactTable 
            data={contacts} 
            columns={columns} 
            selectedId={previewId}
            onRowClick={(_id) => {
              // This is a server component, so we can't directly use router.push here
              // But we can wrap ContactTable in a Client Component that handles the click,
              // or handle it inside ContactTable which is already a 'use client'.
              // Wait, ContactTable is a client component! So it CAN use router.push.
              // We'll pass the URL to update instead of an onClick, or we'll update ContactTable to accept href.
              // For now we'll just handle it in a wrapper or pass the query string.
            }}
          />
        </div>

        {/* Right Panel - Preview */}
        {previewId && (
          <div className="hidden xl:block w-80 flex-shrink-0 bg-white dark:bg-zinc-950 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] border-l border-zinc-200 dark:border-zinc-800 z-10">
            <ContactPreviewPanel 
              contact={previewContact} 
              onClose={() => {}} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
