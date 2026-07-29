import { GalleryAlbumForm } from '@/components/admin/GalleryAlbumForm';
import { listEvents } from '@/features/events/actions';
import { listPrograms } from '@/features/programs/actions';

export const dynamic = 'force-dynamic';

export default async function NewGalleryAlbumPage() {
  const [programsResult, eventsResult] = await Promise.all([
    listPrograms({ page: 1, limit: 100 }),
    listEvents({ page: 1, limit: 100 }),
  ]);

  const programs = programsResult.success && programsResult.data
    ? programsResult.data.data.map((p) => ({ id: p.id, title: p.title }))
    : [];

  const events = eventsResult.success && eventsResult.data
    ? eventsResult.data.data.map((e) => ({ id: e.id, title: e.title }))
    : [];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create Gallery Album</h1>
        <p className="text-sm text-gray-500">Add a new photo album to the foundation website.</p>
      </div>

      <GalleryAlbumForm programs={programs} events={events} />
    </div>
  );
}
