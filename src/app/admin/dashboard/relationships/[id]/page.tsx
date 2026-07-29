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
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { contactsService } from '@/features/contacts/service';

export const metadata: Metadata = {
  title: 'Contact Profile | UDBHAV Foundation',
  description: 'View and manage a foundation relationship.',
};

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  // Fetch contact data
  const result = await contactsService.getContact(id);
  
  if (!result.success || !result.data) {
    notFound();
  }

  const contact = result.data;

  // Mock timeline data for now
  const timelineEvents = [
    { type: 'created' as const, title: 'Contact Created', timestamp: contact.created_at, actorName: 'System User' },
    { type: 'relationship' as const, title: 'Assigned as Volunteer', timestamp: new Date(new Date(contact.created_at).getTime() + 86400000).toISOString(), actorName: 'Admin User' }
  ];

  // Mock relationship nodes
  const graphNodes = [
    { id: contact.id, type: 'contact' as const, label: contact.full_name, url: '#' },
    { id: 'org-1', type: 'organization' as const, label: 'Tech For Good', sublabel: 'Partner NGO', url: '/admin/dashboard/organizations/org-1' },
    { id: 'prog-1', type: 'program' as const, label: 'Digital Literacy Initiative', sublabel: 'Active Program', url: '/admin/dashboard/programs/prog-1' }
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-theme(spacing.16))] -m-8 bg-zinc-50 dark:bg-zinc-900/20">
      
      {/* Profile Header */}
      <div className="bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 p-6 md:p-8 lg:px-12 relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent dark:from-primary/5 dark:via-primary/5 -z-10"></div>
        
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" className="mr-4 text-zinc-500 bg-white/50 backdrop-blur-sm" asChild>
            <Link href="/admin/dashboard/relationships">
              <ArrowLeft className="w-5 h-5" />
              <span className="sr-only">Back to Relationships</span>
            </Link>
          </Button>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 z-10">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="relative">
              <ContactAvatar 
                name={contact.full_name} 
                photoUrl={contact.photo_media_id} 
                size="xl" 
                className="border-4 border-white dark:border-zinc-950 shadow-md"
              />
              <div className="absolute bottom-1 right-1">
                <StatusBadge status={contact.status} />
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{contact.full_name}</h1>
              </div>
              
              {contact.designation && (
                <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-2">
                  {contact.designation} 
                  {contact.organization_id && ' at Organization'}
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
                {contact.email && (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-1.5 opacity-70" />
                    <a href={`mailto:${contact.email}`} className="hover:text-primary transition-colors">{contact.email}</a>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-1.5 opacity-70" />
                    <a href={`tel:${contact.phone}`} className="hover:text-primary transition-colors">{contact.phone}</a>
                  </div>
                )}
                {(contact.city || contact.country) && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1.5 opacity-70" />
                    {[contact.city, contact.country].filter(Boolean).join(', ')}
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {/* Normally these would be populated from contact_types / contact_tag_assignments */}
                <ContactBadge label="Volunteer" variant="info" />
                <ContactBadge label="Donor" variant="success" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-end">
            <Button variant="outline" asChild>
              <Link href={`/admin/dashboard/relationships/${contact.id}/edit`}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Link>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>Log Interaction</DropdownMenuItem>
                <DropdownMenuItem>Merge Contact</DropdownMenuItem>
                <DropdownMenuItem>Export Data</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20">
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
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    {/* Notes Snippet */}
                    {contact.notes && (
                      <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Internal Remarks</h3>
                        <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">{contact.notes}</p>
                      </div>
                    )}
                    
                    {/* Basic Info Box */}
                    <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-6">Contact Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                        <div>
                          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Full Name</p>
                          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{contact.full_name}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Email</p>
                          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{contact.email || '-'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Phone</p>
                          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{contact.phone || '-'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Alternate Phone</p>
                          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{contact.alternate_phone || '-'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Address</p>
                          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {[contact.address, contact.city, contact.district, contact.state, contact.country].filter(Boolean).join(', ') || '-'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Sidebar Widgets */}
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4 uppercase tracking-wider">Linked Organization</h3>
                      {contact.organization_id ? (
                        <OrganizationCard 
                          id={contact.organization_id} 
                          name="Tech For Good" 
                          type="NGO Partner" 
                          status="Active" 
                        />
                      ) : (
                        <p className="text-sm text-zinc-500 italic">No organization linked.</p>
                      )}
                    </div>
                    
                    <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4 uppercase tracking-wider">Preferences</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-zinc-500 mb-1">Contact Method</p>
                          <p className="text-sm font-medium">{contact.preferred_contact_method || 'Email'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500 mb-1">Language</p>
                          <p className="text-sm font-medium">{contact.preferred_language || 'English'}</p>
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
                <div className="bg-white dark:bg-zinc-950 p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm min-h-[500px] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                  <div className="relative z-10 w-full">
                    <RelationshipGraph nodes={graphNodes} />
                  </div>
                </div>
              )}

              {/* NOTES TAB */}
              {activeTab === 'notes' && (
                <div className="max-w-3xl">
                  <NotesPanel 
                    contactId={contact.id} 
                    notes={[]} 
                  />
                </div>
              )}

              {/* Placeholder for other tabs */}
              {['organizations', 'programs', 'events', 'volunteering', 'donations', 'documents', 'audit'].includes(activeTab) && (
                <div className="flex flex-col items-center justify-center p-16 text-center border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/20">
                  <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                    <Building2 className="w-8 h-8 text-zinc-400" />
                  </div>
                  <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 capitalize">
                    {activeTab} Management
                  </h3>
                  <p className="mt-2 text-zinc-500 max-w-md">
                    This module connects to the <strong>{activeTab}</strong> subsystem. Records will automatically appear here when this contact interacts with that subsystem.
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
