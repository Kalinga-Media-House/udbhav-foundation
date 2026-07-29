import { notFound } from 'next/navigation';

import { GalleryAlbumForm } from '@/components/admin/GalleryAlbumForm';
import { listEvents } from '@/features/events/actions';
import { getAlbumById } from '@/features/gallery/actions';
import { listPrograms } from '@/features/programs/actions';

export const dynamic = 'force-dynamic';

export default async function EditGalleryAlbumPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const [albumResult, programsResult, eventsResult] = await Promise.all([
    getAlbumById(params.id),
    listPrograms({ page: 1, limit: 100 }),
    listEvents({ page: 1, limit: 100 }),
  ]);

  if (!albumResult.success || !albumResult.data) {
    notFound();
  }

  const programs = programsResult.success && programsResult.data
    ? programsResult.data.data.map((p) => ({ id: p.id, title: p.title }))
    : [];

  const events = eventsResult.success && eventsResult.data
    ? eventsResult.data.data.map((e) => ({ id: e.id, title: e.title }))
    : [];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Gallery Album</h1>
        <p className="text-sm text-gray-500">Update metadata and settings for {albumResult.data.title}.</p>
      </div>

      <GalleryAlbumForm
        initialData={albumResult.data}
        programs={programs}
        events={events}
      />
    </div>
  );
}
