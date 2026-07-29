import { Building2, Users, MapPin } from 'lucide-react';
import Link from 'next/link';

import { StatusBadge } from './ContactBadge';

interface OrganizationCardProps {
  id: string;
  name: string;
  type: string;
  location?: string | null;
  contactCount?: number;
  status: string;
  logoUrl?: string | null;
}

export function OrganizationCard({
  id,
  name,
  type,
  location,
  contactCount = 0,
  status,
  logoUrl,
}: OrganizationCardProps) {
  return (
    <div className="group relative bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/30 flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-200 dark:border-zinc-700">
            {logoUrl ? (
              <img src={logoUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-6 h-6 text-zinc-400" />
            )}
          </div>
          <div>
            <Link
              href={`/admin/dashboard/organizations/${id}`}
              className="text-base font-semibold text-zinc-900 dark:text-zinc-100 hover:text-primary transition-colors focus:outline-none focus-visible:underline line-clamp-1"
            >
              {name}
            </Link>
            <p className="text-xs text-zinc-500 mt-0.5 font-medium">{type}</p>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/50">
        <div className="flex items-center space-x-4 text-xs text-zinc-600 dark:text-zinc-400">
          <div className="flex items-center" title="Linked Contacts">
            <Users className="w-3.5 h-3.5 mr-1.5 opacity-70" />
            {contactCount}
          </div>
          {location && (
            <div className="flex items-center truncate max-w-[120px]" title={location}>
              <MapPin className="w-3.5 h-3.5 mr-1.5 opacity-70" />
              <span className="truncate">{location}</span>
            </div>
          )}
        </div>
        <StatusBadge status={status} />
      </div>

      <Link
        href={`/admin/dashboard/organizations/${id}`}
        className="absolute inset-0 z-0 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        aria-label={`View ${name}'s details`}
      />
    </div>
  );
}
