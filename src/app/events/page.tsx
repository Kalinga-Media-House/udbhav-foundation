import { format } from 'date-fns';
import type { Metadata } from 'next';
import Link from 'next/link';

import { listEvents } from '@/features/events/actions';

export const metadata: Metadata = {
  title: 'Events & Workshops | UDBHAV FOUNDATION',
  description: 'Join UDBHAV Foundation events, workshops, and community programs.',
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
              <Link key={evt.id} href={`/events/${evt.slug}`} className="group block">
                <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
                  {/* Image Placeholder or R2 URL */}
                  <div className="h-48 bg-gray-100 relative">
                    {/* In a real scenario, map cover_image_id to CDN url via service. Using placeholder for now */}
                    <div className="absolute inset-0 bg-[#172B6B]/10 group-hover:bg-[#172B6B]/0 transition-colors" />
                    {evt.status === 'Registration Open' && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Registration Open
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="text-sm font-semibold text-[#8B1A1A] mb-2">
                      {evt.start_time ? format(new Date(evt.start_time), 'MMMM d, yyyy') : 'TBA'}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#172B6B] transition-colors line-clamp-2">
                      {evt.title}
                    </h2>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {evt.subtitle || evt.description || ''}
                    </p>
                    <div className="mt-auto pt-4 border-t border-gray-50 text-sm font-medium text-[#172B6B] flex items-center">
                      View Details
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
