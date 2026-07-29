import { revalidatePath } from 'next/cache';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { listEvents, deleteEvent } from '@/features/events/actions';

export const dynamic = 'force-dynamic';

export default async function AdminEventsPage(props: { searchParams: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams;
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const result = await listEvents({ page, limit: 50 });
  const events = result.success && result.data ? result.data.data : [];

  async function handleDelete(id: string) {
    'use server';
    await deleteEvent(id);
    revalidatePath('/admin/dashboard/events');
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-sm text-gray-500">Manage foundation events, workshops, and seminars.</p>
        </div>
        <Link href="/admin/dashboard/events/new">
          <Button>Create Event</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="p-4 font-semibold text-sm text-gray-600">Code</th>
              <th className="p-4 font-semibold text-sm text-gray-600">Title</th>
              <th className="p-4 font-semibold text-sm text-gray-600">Date</th>
              <th className="p-4 font-semibold text-sm text-gray-600">Status</th>
              <th className="p-4 font-semibold text-sm text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No events found.
                </td>
              </tr>
            ) : (
              events.map((evt) => (
                <tr key={evt.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 text-sm font-mono text-gray-600">{evt.event_code}</td>
                  <td className="p-4">
                    <div className="font-semibold text-gray-900">{evt.title}</div>
                    <div className="text-xs text-gray-500 truncate max-w-md">{evt.slug}</div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {evt.start_time ? new Date(evt.start_time).toLocaleDateString() : 'TBA'}
                  </td>
                  <td className="p-4">
                    <Badge variant={evt.status === 'Published' || evt.status === 'Ongoing' ? 'default' : 'secondary'}>
                      {evt.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Link href={`/admin/dashboard/events/${evt.id}/edit`}>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                    <form action={handleDelete.bind(null, evt.id)} className="inline-block">
                      <Button variant="destructive" size="sm" type="submit">Delete</Button>
                    </form>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
