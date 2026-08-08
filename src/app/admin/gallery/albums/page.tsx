import { Metadata } from 'next';
import { listAdminAlbumsAction } from '@/features/gallery/actions';
import { AlbumManagementTable } from '@/components/admin/gallery/AlbumManagementTable';
import { ShieldAlert, Info } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Album Management - Udbhav Foundation',
  description: 'Internal maintenance tool for managing gallery albums.',
};

export default async function AlbumManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string }>;
}) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page ?? '1', 10);
  const limit = parseInt(resolvedParams.limit ?? '20', 10);

  const result = await listAdminAlbumsAction({ page, limit });
  const albums = result.success && result.data ? result.data.data : [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-red-500" />
            Album Management (Internal)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            System tool for inspecting, repairing, and removing background albums.
          </p>
        </div>
        <Link href="/admin/gallery">
          <Button variant="outline">Return to Photos</Button>
        </Link>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3 text-sm text-blue-800">
        <Info className="h-5 w-5 shrink-0 text-blue-600 mt-0.5" />
        <div>
          <strong className="font-semibold block mb-1">About Album Management</strong>
          Albums are created automatically when photos are uploaded. This page allows you to view these internal groups and delete legacy/demo records if needed. 
          Deleting an album here is a <strong>Hard Delete</strong> that will permanently remove all associated photos and media files.
        </div>
      </div>

      <AlbumManagementTable albums={albums} />
    </div>
  );
}
