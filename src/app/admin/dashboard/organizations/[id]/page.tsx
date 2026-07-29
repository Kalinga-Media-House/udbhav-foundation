import { ArrowLeft, Edit, Building2, MapPin, Globe, Mail, Users, FileText } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ContactAvatar } from '@/components/frm/ContactAvatar';
import { StatusBadge } from '@/components/frm/ContactBadge';
import { ContactTable, ContactColumn } from '@/components/frm/ContactTable';
import { Button } from '@/components/ui/button';
import { contactsService } from '@/features/contacts/service';

export const metadata: Metadata = {
  title: 'Organization Details | UDBHAV Foundation',
  description: 'View organization details and linked contacts.',
};

export default async function OrganizationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const result = await contactsService.getOrganization(id);
  
  if (!result.success || !result.data) {
    notFound();
  }

  const org = result.data;

  // Mock linked contacts
  const linkedContacts = [
    { id: '1', full_name: 'Jane Doe', email: 'jane@techforgood.org', designation: 'CEO', status: 'Active' },
    { id: '2', full_name: 'John Smith', email: 'john@techforgood.org', designation: 'Partnerships Director', status: 'Active' },
  ];

  const columns: ContactColumn[] = [
    {
      key: 'full_name',
      label: 'Employee Name',
      render: (val, row) => (
        <div className="flex items-center space-x-3">
          <ContactAvatar name={val} size="sm" />
          <div className="flex flex-col">
            <span className="font-medium text-zinc-900 dark:text-zinc-100">{val}</span>
            <span className="text-xs text-zinc-500">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'designation',
      label: 'Designation / Role',
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <StatusBadge status={val as string} />,
    },
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-theme(spacing.16))] -m-8 bg-zinc-50 dark:bg-zinc-900/20">
      
      {/* Profile Header */}
      <div className="bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 p-6 md:p-8 lg:px-12 relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-blue-500/10 via-primary/5 to-transparent dark:from-blue-500/5 dark:via-primary/5 -z-10"></div>
        
        <div className="flex items-center mb-6 z-10">
          <Button variant="ghost" size="icon" className="mr-4 text-zinc-500 bg-white/50 backdrop-blur-sm" asChild>
            <Link href="/admin/dashboard/organizations">
              <ArrowLeft className="w-5 h-5" />
              <span className="sr-only">Back to Organizations</span>
            </Link>
          </Button>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 z-10">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-zinc-100 dark:bg-zinc-900 border-4 border-white dark:border-zinc-950 shadow-md flex items-center justify-center overflow-hidden">
              {org.logo_media_id ? (
                <img src={org.logo_media_id} alt={org.name} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-12 h-12 text-zinc-300 dark:text-zinc-700" />
              )}
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{org.name}</h1>
                <StatusBadge status={org.status} />
              </div>
              
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-3">
                {org.organization_type || 'Organization'}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
                {org.website && (
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-1.5 opacity-70" />
                    <a href={org.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors text-primary">
                      {org.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                {org.email && (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-1.5 opacity-70" />
                    <a href={`mailto:${org.email}`} className="hover:text-primary transition-colors">{org.email}</a>
                  </div>
                )}
                {(org.district || org.country) && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1.5 opacity-70" />
                    {[org.district, org.country].filter(Boolean).join(', ')}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-end">
            <Button variant="outline" asChild>
              <Link href={`/admin/dashboard/organizations/${org.id}/edit`}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Organization
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 md:p-8 lg:px-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
              <h2 className="text-lg font-semibold flex items-center">
                <Users className="w-5 h-5 mr-2 text-primary" />
                Linked Contacts
              </h2>
              <Button size="sm" variant="outline">Link Contact</Button>
            </div>
            
            <div className="p-0">
              <ContactTable data={linkedContacts} columns={columns} />
            </div>
          </div>

        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4 uppercase tracking-wider flex items-center">
              <Building2 className="w-4 h-4 mr-2 text-zinc-500" />
              Company Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs text-zinc-500 mb-1 uppercase tracking-wider font-medium">Headquarters</p>
                <p className="text-sm">
                  {[org.address, org.district, org.state, org.country].filter(Boolean).join(', ') || 'Not provided'}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-zinc-500 mb-1 uppercase tracking-wider font-medium">Main Phone</p>
                <p className="text-sm">{org.phone || 'Not provided'}</p>
              </div>
              

            </div>
          </div>
          
          <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4 uppercase tracking-wider flex items-center">
              <FileText className="w-4 h-4 mr-2 text-zinc-500" />
              Internal Description
            </h3>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              No description provided.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
