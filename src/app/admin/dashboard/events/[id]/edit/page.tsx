import { notFound } from 'next/navigation';

import { EventForm } from '@/components/admin/EventForm';
import { getEventById } from '@/features/events/actions';
import { listPrograms } from '@/features/programs/actions';

export const dynamic = 'force-dynamic';

export default async function EditEventPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const eventResult = await getEventById(params.id);
  
  if (!eventResult.success || !eventResult.data) {
    notFound();
  }

  // Fetch programs to allow the admin to select an associated program
  const programsResult = await listPrograms({ page: 1, limit: 100 });
  const programs = programsResult.success && programsResult.data ? programsResult.data.data : [];
  const programOptions = programs.map(p => ({ id: p.id, title: p.title }));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Event</h1>
        <p className="text-sm text-gray-500">Update the details for this event.</p>
      </div>

      <EventForm initialData={eventResult.data} programs={programOptions} />
    </div>
  );
}
