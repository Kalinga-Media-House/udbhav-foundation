import { EventForm } from '@/components/admin/EventForm';
import { listPrograms } from '@/features/programs/actions';

export const dynamic = 'force-dynamic';

export default async function NewEventPage() {
  // Fetch programs to allow the admin to select an associated program
  const result = await listPrograms({ page: 1, limit: 100 });
  const programs = result.success && result.data ? result.data.data : [];
  
  // Extract id and title for the dropdown
  const programOptions = programs.map(p => ({ id: p.id, title: p.title }));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create Event</h1>
        <p className="text-sm text-gray-500">Add a new event, workshop, or seminar to the platform.</p>
      </div>

      <EventForm programs={programOptions} />
    </div>
  );
}
