import { Building, Mail, Phone } from 'lucide-react';
import Link from 'next/link';

import { ContactAvatar } from './ContactAvatar';
import { StatusBadge } from './ContactBadge';

interface ContactCardProps {
  id: string;
  name: string;
  designation?: string | null;
  organizationName?: string | null;
  email?: string | null;
  phone?: string | null;
  status: string;
  photoUrl?: string | null;
}

export function ContactCard({
  id,
  name,
  designation,
  organizationName,
  email,
  phone,
  status,
  photoUrl,
}: ContactCardProps) {
  return (
    <div className="group relative bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/30">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <ContactAvatar name={name} photoUrl={photoUrl} size="lg" />
          <div>
            <Link
              href={`/admin/dashboard/relationships/${id}`}
              className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 hover:text-primary transition-colors focus:outline-none focus-visible:underline"
            >
              {name}
            </Link>
            {(designation || organizationName) && (
              <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                <Building className="w-4 h-4 mr-1.5 opacity-70" />
                <span>
                  {designation}
                  {designation && organizationName ? ' at ' : ''}
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    {organizationName}
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/50 flex flex-col space-y-2">
        {email && (
          <div className="flex items-center text-sm text-zinc-600 dark:text-zinc-400">
            <Mail className="w-4 h-4 mr-2 opacity-60" />
            <a href={`mailto:${email}`} className="hover:text-primary hover:underline">
              {email}
            </a>
          </div>
        )}
        {phone && (
          <div className="flex items-center text-sm text-zinc-600 dark:text-zinc-400">
            <Phone className="w-4 h-4 mr-2 opacity-60" />
            <a href={`tel:${phone}`} className="hover:text-primary hover:underline">
              {phone}
            </a>
          </div>
        )}
      </div>

      <Link
        href={`/admin/dashboard/relationships/${id}`}
        className="absolute inset-0 z-0 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        aria-label={`View ${name}'s profile`}
      />
    </div>
  );
}
