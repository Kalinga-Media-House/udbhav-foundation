import { format } from 'date-fns';
import type { Metadata } from 'next';
import Link from 'next/link';

import { listEvents } from '@/features/events/actions';
import { EventCard } from '@/components/events/EventCard';
export const metadata: Metadata = {
  title: 'Events & Workshops',
  description: 'Join UDBHAV Foundation events, workshops and community programmes.',
};

export const dynamic = 'force-dynamic';

export default async function EventsIndexPage() {
  const result = await listEvents({ page: 1, limit: 100 }, { visibility: 'public' });
  if (!result.success || !result.data) {
    throw new Error(result.error ?? 'Failed to load events');
  }

  // Filter out Drafts/Archived if necessary, or let service filter
  const activeEvents = result.data.data.filter(e => !['Draft', 'Archived', 'Cancelled'].includes(e.status));

  return (
    <main className="min-h-screen bg-[#FCFCF8] pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#172B6B] mb-4">Upcoming Events</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join our community initiatives, workshops, and awareness programs. Register for upcoming events and make an impact.
          </p>
        </header>

        {activeEvents.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xl text-gray-500">No upcoming events at the moment.</h3>
            <p className="mt-2 text-gray-400">Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeEvents.map(evt => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
