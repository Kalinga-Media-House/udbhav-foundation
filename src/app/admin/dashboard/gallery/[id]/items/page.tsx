import Link from 'next/link';
import { notFound } from 'next/navigation';

import { GalleryItemManager } from '@/components/admin/GalleryItemManager';
import { Button } from '@/components/ui/button';
import { getAlbumById, listAlbumItems } from '@/features/gallery/actions';

export const dynamic = 'force-dynamic';

export default async function AlbumItemsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const [albumResult, itemsResult] = await Promise.all([
    getAlbumById(params.id),
    listAlbumItems(params.id, { page: 1, limit: 100 }),
  ]);

  if (!albumResult.success || !albumResult.data) {
    notFound();
  }

  const items = itemsResult.success && itemsResult.data
    ? itemsResult.data.data
    : [];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Album Photos</h1>
          <p className="text-sm text-gray-500">
            Album: <span className="font-semibold">{albumResult.data.title}</span> ({albumResult.data.album_code})
          </p>
        </div>
        <div className="space-x-3">
          <Link href={`/admin/dashboard/gallery/${albumResult.data.id}/edit`}>
            <Button variant="outline">Edit Album Info</Button>
          </Link>
          <Link href="/admin/dashboard/gallery">
            <Button variant="outline">Back to Albums</Button>
          </Link>
        </div>
      </div>

      <GalleryItemManager
        albumId={albumResult.data.id}
        albumTitle={albumResult.data.title}
        initialItems={items}
      />
    </div>
  );
}
