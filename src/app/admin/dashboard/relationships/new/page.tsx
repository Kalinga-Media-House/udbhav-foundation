import { ArrowLeft, UserPlus } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

import { ContactWizard } from '@/components/frm/ContactWizard';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Create Contact',
  description: 'Add a new relationship record to the FRM system.',
};

export default function CreateContactPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-theme(spacing.16))] -m-8 bg-zinc-50 dark:bg-zinc-900/20">
      {/* Page Header */}
      <div className="flex items-center p-6 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <Button variant="ghost" size="icon" className="mr-4 text-zinc-500" asChild>
          <Link href="/admin/dashboard/relationships">
            <ArrowLeft className="w-5 h-5" />
            <span className="sr-only">Back to Relationships</span>
          </Link>
        </Button>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Create New Contact
            </h1>
            <p className="text-sm text-zinc-500">
              Add a new person to the foundation relationship management system.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 md:p-8 lg:p-12">
        <ContactWizard />
      </div>
    </div>
  );
}
