import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { listPrograms } from '@/features/programs/actions';
import { listEvents } from '@/features/events/actions';
import { PhotoEditForm } from '@/components/admin/PhotoEditForm';

export const dynamic = 'force-dynamic';

export default async function AdminEditPhotoPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = params.id;

  const supabase = await createServerSupabaseClient();
  
  const { data: item } = await supabase
    .from('gallery_items')
    .select(`
      *,
      album:gallery_albums!inner(id, title, visibility, program_id, event_id, location, is_deleted)
    `)
    .eq('id', id)
    .single();

  if (!item) {
    notFound();
  }

  const [programsResult, eventsResult] = await Promise.all([
    listPrograms({ page: 1, limit: 100 }),
    listEvents({ page: 1, limit: 100 })
  ]);
  
  const programs = programsResult.success && programsResult.data ? programsResult.data.data : [];
  const events = eventsResult.success && eventsResult.data ? eventsResult.data.data : [];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Edit Photo</h1>
        <p className="mt-1 text-gray-500">
          Update the metadata for this photo.
        </p>
      </div>

      <PhotoEditForm initialData={item} programs={programs} events={events} />
    </div>
  );
}
