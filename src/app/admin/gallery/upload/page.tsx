import { PhotosUploadForm } from '@/components/admin/PhotosUploadForm';
import { listEvents } from '@/features/events/actions';
import { listPrograms } from '@/features/programs/actions';

export const dynamic = 'force-dynamic';

export default async function AdminUploadPhotosPage() {
  const [programsResult, eventsResult] = await Promise.all([
    listPrograms({ page: 1, limit: 100 }),
    listEvents({ page: 1, limit: 100 })
  ]);
  
  const programs = programsResult.success && programsResult.data ? programsResult.data.data : [];
  const events = eventsResult.success && eventsResult.data ? eventsResult.data.data : [];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Upload Photos</h1>
        <p className="mt-1 text-gray-500">
          Upload one or multiple photos to the gallery.
        </p>
      </div>

      <PhotosUploadForm programs={programs} events={events} />
    </div>
  );
}
