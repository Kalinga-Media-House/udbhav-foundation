import { X, ExternalLink, MapPin, Mail, Phone, Calendar } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { ContactAvatar } from './ContactAvatar';
import { StatusBadge } from './ContactBadge';

interface ContactPreviewPanelProps {
  contact: any | null;
  onClose: () => void;
  isLoading?: boolean;
}

export function ContactPreviewPanel({ contact, onClose, isLoading }: ContactPreviewPanelProps) {
  if (isLoading) {
    return (
      <div className="h-full w-full bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 p-6 flex flex-col space-y-6 animate-pulse">
        <div className="flex justify-end">
          <div className="w-8 h-8 bg-zinc-100 dark:bg-zinc-900 rounded-md"></div>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-900 rounded-full mb-4"></div>
          <div className="w-48 h-6 bg-zinc-100 dark:bg-zinc-900 rounded-md mb-2"></div>
          <div className="w-32 h-4 bg-zinc-100 dark:bg-zinc-900 rounded-md"></div>
        </div>
        <div className="space-y-4 pt-6 border-t border-zinc-100 dark:border-zinc-800">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-full h-12 bg-zinc-50 dark:bg-zinc-900/50 rounded-md"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="h-full w-full bg-zinc-50/50 dark:bg-zinc-950/50 border-l border-zinc-200 dark:border-zinc-800 p-6 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-4">
          <span className="text-zinc-400 dark:text-zinc-600">?</span>
        </div>
        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">No Contact Selected</h3>
        <p className="text-sm text-zinc-500 mt-1 max-w-[250px]">
          Select a contact from the list to view their quick details.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Quick Preview</h2>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <Link href={`/admin/dashboard/relationships/${contact.id}`}>
              <ExternalLink className="h-4 w-4 text-zinc-500" />
              <span className="sr-only">View full profile</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4 text-zinc-500" />
            <span className="sr-only">Close preview</span>
          </Button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="flex flex-col items-center text-center p-6 pb-4">
        <ContactAvatar
          name={contact.full_name}
          photoUrl={contact.photo_media_id}
          size="xl"
          className="mb-4 shadow-sm"
        />
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
          {contact.full_name}
        </h3>
        {contact.designation && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
            {contact.designation}
            {contact.organization_id && (
              <span className="mx-1">• Organization Linked</span>
            )}
          </p>
        )}
        <StatusBadge status={contact.status} className="mb-4" />

        <div className="flex gap-2 w-full mt-2">
          <Button className="flex-1" asChild>
            <Link href={`/admin/dashboard/relationships/${contact.id}`}>View Profile</Link>
          </Button>
        </div>
      </div>

      {/* Details List */}
      <div className="px-6 py-4 space-y-4">
        <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
          Contact Details
        </h4>
        
        {contact.email && (
          <div className="flex items-start space-x-3">
            <Mail className="w-4 h-4 text-zinc-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{contact.email}</p>
              <p className="text-xs text-zinc-500">Email Address</p>
            </div>
          </div>
        )}

        {contact.phone && (
          <div className="flex items-start space-x-3">
            <Phone className="w-4 h-4 text-zinc-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{contact.phone}</p>
              <p className="text-xs text-zinc-500">Phone Number</p>
            </div>
          </div>
        )}

        {(contact.city || contact.country) && (
          <div className="flex items-start space-x-3">
            <MapPin className="w-4 h-4 text-zinc-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {[contact.city, contact.state, contact.country].filter(Boolean).join(', ')}
              </p>
              <p className="text-xs text-zinc-500">Location</p>
            </div>
          </div>
        )}

        <div className="flex items-start space-x-3">
          <Calendar className="w-4 h-4 text-zinc-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {new Date(contact.created_at).toLocaleDateString()}
            </p>
            <p className="text-xs text-zinc-500">Added to System</p>
          </div>
        </div>
      </div>
      
      {/* Quick Notes snippet */}
      {contact.notes && (
        <div className="px-6 py-4 mt-auto border-t border-zinc-100 dark:border-zinc-800">
          <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
            Internal Note
          </h4>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 line-clamp-3">
            {contact.notes}
          </p>
        </div>
      )}
    </div>
  );
}
