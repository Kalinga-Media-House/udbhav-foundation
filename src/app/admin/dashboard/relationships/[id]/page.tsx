import { ArrowLeft, Edit, MoreVertical, MapPin, Mail, Phone, Building2 } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ContactAvatar } from '@/components/frm/ContactAvatar';
import { StatusBadge, ContactBadge } from '@/components/frm/ContactBadge';
import { ContactTabs } from '@/components/frm/ContactTabs';
import { NotesPanel } from '@/components/frm/NotesPanel';
import { OrganizationCard } from '@/components/frm/OrganizationCard';
import { RelationshipGraph } from '@/components/frm/RelationshipGraph';
import { Timeline } from '@/components/frm/Timeline';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { contactsService } from '@/features/contacts/service';

export const metadata: Metadata = {
  title: 'Contact Profile | UDBHAV Foundation',
  description: 'View and manage a foundation relationship.',
};

export default async function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch contact data
  const result = await contactsService.getContact(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const contact = result.data;

  // Mock timeline data for now
  const timelineEvents = [
    {
      type: 'created' as const,
      title: 'Contact Created',
      timestamp: contact.created_at,
      actorName: 'System User',
    },
    {
      type: 'relationship' as const,
      title: 'Assigned as Volunteer',
      timestamp: new Date(new Date(contact.created_at).getTime() + 86400000).toISOString(),
      actorName: 'Admin User',
    },
  ];

  // Mock relationship nodes
  const graphNodes = [
    { id: contact.id, type: 'contact' as const, label: contact.full_name, url: '#' },
    {
      id: 'org-1',
      type: 'organization' as const,
      label: 'Tech For Good',
      sublabel: 'Partner NGO',
      url: '/admin/dashboard/organizations/org-1',
    },
    {
      id: 'prog-1',
      type: 'program' as const,
      label: 'Digital Literacy Initiative',
      sublabel: 'Active Program',
      url: '/admin/programs/prog-1',
    },
  ];

  return (
    <div className="-m-8 flex min-h-[calc(100vh-theme(spacing.16))] flex-col bg-zinc-50 dark:bg-zinc-900/20">
      {/* Profile Header */}
      <div className="relative overflow-hidden border-b border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 md:p-8 lg:px-12">
        {/* Background Accent */}
        <div className="from-primary/10 via-primary/5 dark:from-primary/5 dark:via-primary/5 absolute left-0 right-0 top-0 -z-10 h-32 bg-gradient-to-r to-transparent"></div>

        <div className="mb-6 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-4 bg-white/50 text-zinc-500 backdrop-blur-sm"
            asChild
          >
            <Link href="/admin/dashboard/relationships">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to Relationships</span>
            </Link>
          </Button>
        </div>

        <div className="z-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="relative">
              <ContactAvatar
                name={contact.full_name}
                photoUrl={contact.photo_media_id}
                size="xl"
                className="border-4 border-white shadow-md dark:border-zinc-950"
              />
              <div className="absolute bottom-1 right-1">
                <StatusBadge status={contact.status} />
              </div>
            </div>

            <div>
              <div className="mb-1 flex items-center gap-3">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                  {contact.full_name}
                </h1>
              </div>

              {contact.designation && (
                <p className="mb-2 text-lg text-zinc-600 dark:text-zinc-400">
                  {contact.designation}
                  {contact.organization_id && ' at Organization'}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
                {contact.email && (
                  <div className="flex items-center">
                    <Mail className="mr-1.5 h-4 w-4 opacity-70" />
                    <a
                      href={`mailto:${contact.email}`}
                      className="transition-colors hover:text-primary"
                    >
                      {contact.email}
                    </a>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center">
                    <Phone className="mr-1.5 h-4 w-4 opacity-70" />
                    <a
                      href={`tel:${contact.phone}`}
                      className="transition-colors hover:text-primary"
                    >
                      {contact.phone}
                    </a>
                  </div>
                )}
                {(contact.city || contact.country) && (
                  <div className="flex items-center">
                    <MapPin className="mr-1.5 h-4 w-4 opacity-70" />
                    {[contact.city, contact.country].filter(Boolean).join(', ')}
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {/* Normally these would be populated from contact_types / contact_tag_assignments */}
                <ContactBadge label="Volunteer" variant="info" />
                <ContactBadge label="Donor" variant="success" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-end">
            <Button variant="outline" asChild>
              <Link href={`/admin/dashboard/relationships/${contact.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>Log Interaction</DropdownMenuItem>
                <DropdownMenuItem>Merge Contact</DropdownMenuItem>
                <DropdownMenuItem>Export Data</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-900/20">
                  Delete Contact
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Profile Body */}
      <div className="flex-1 p-6 md:p-8 lg:px-12">
        <ContactTabs>
          {(activeTab) => (
            <div className="duration-300 animate-in fade-in slide-in-from-bottom-2">
              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                  <div className="space-y-8 lg:col-span-2">
                    {/* Notes Snippet */}
                    {contact.notes && (
                      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                          Internal Remarks
                        </h3>
                        <p className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
                          {contact.notes}
                        </p>
                      </div>
                    )}

                    {/* Basic Info Box */}
                    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                      <h3 className="mb-6 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                        Contact Information
                      </h3>
                      <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
                        <div>
                          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-zinc-500">
                            Full Name
                          </p>
                          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {contact.full_name}
                          </p>
                        </div>
                        <div>
                          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-zinc-500">
                            Email
                          </p>
                          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {contact.email || '-'}
                          </p>
                        </div>
                        <div>
                          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-zinc-500">
                            Phone
                          </p>
                          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {contact.phone || '-'}
                          </p>
                        </div>
                        <div>
                          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-zinc-500">
                            Alternate Phone
                          </p>
                          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {contact.alternate_phone || '-'}
                          </p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-zinc-500">
                            Address
                          </p>
                          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {[
                              contact.address,
                              contact.city,
                              contact.district,
                              contact.state,
                              contact.country,
                            ]
                              .filter(Boolean)
                              .join(', ') || '-'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Sidebar Widgets */}
                  <div className="space-y-6">
                    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                        Linked Organization
                      </h3>
                      {contact.organization_id ? (
                        <OrganizationCard
                          id={contact.organization_id}
                          name="Tech For Good"
                          type="NGO Partner"
                          status="Active"
                        />
                      ) : (
                        <p className="text-sm italic text-zinc-500">No organization linked.</p>
                      )}
                    </div>

                    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                        Preferences
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <p className="mb-1 text-xs text-zinc-500">Contact Method</p>
                          <p className="text-sm font-medium">
                            {contact.preferred_contact_method || 'Email'}
                          </p>
                        </div>
                        <div>
                          <p className="mb-1 text-xs text-zinc-500">Language</p>
                          <p className="text-sm font-medium">
                            {contact.preferred_language || 'English'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TIMELINE TAB */}
              {activeTab === 'timeline' && (
                <div className="max-w-3xl">
                  <Timeline items={timelineEvents} />
                </div>
              )}

              {/* RELATIONSHIPS TAB */}
              {activeTab === 'relationships' && (
                <div className="relative flex min-h-[500px] items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                  <div className="relative z-10 w-full">
                    <RelationshipGraph nodes={graphNodes} />
                  </div>
                </div>
              )}

              {/* NOTES TAB */}
              {activeTab === 'notes' && (
                <div className="max-w-3xl">
                  <NotesPanel contactId={contact.id} notes={[]} />
                </div>
              )}

              {/* Placeholder for other tabs */}
              {[
                'organizations',
                'programs',
                'events',
                'volunteering',
                'donations',
                'documents',
                'audit',
              ].includes(activeTab) && (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 p-16 text-center dark:border-zinc-700 dark:bg-zinc-900/20">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <Building2 className="h-8 w-8 text-zinc-400" />
                  </div>
                  <h3 className="text-xl font-medium capitalize text-zinc-900 dark:text-zinc-100">
                    {activeTab} Management
                  </h3>
                  <p className="mt-2 max-w-md text-zinc-500">
                    This module connects to the <strong>{activeTab}</strong> subsystem. Records will
                    automatically appear here when this contact interacts with that subsystem.
                  </p>
                </div>
              )}
            </div>
          )}
        </ContactTabs>
      </div>
    </div>
  );
}
