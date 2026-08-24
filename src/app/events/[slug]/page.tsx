/* eslint-disable @typescript-eslint/no-explicit-any */
import { format } from 'date-fns';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getEventBySlug } from '@/features/events/actions';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const result = await getEventBySlug(params.slug);
  if (!result.success || !result.data) {
    return { title: 'Event Not Found' };
  }
  return {
    title: `${result.data.title}`,
    description: result.data.subtitle || result.data.description?.substring(0, 160) || 'UDBHAV Foundation Event',
  };
}

import { METADATA } from '@/constants/metadata';

export default async function EventDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const result = await getEventBySlug(params.slug);

  if (!result.success || !result.data) {
    notFound();
  }

  const evt = result.data;
  const meta = (evt.metadata as Record<string, any>) || {};

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: evt.title,
    description: evt.description || evt.subtitle || 'UDBHAV Foundation Event',
    startDate: evt.start_time,
    endDate: evt.end_time || evt.start_time,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: evt.venue_name || 'UDBHAV Foundation',
      address: {
        '@type': 'PostalAddress',
        streetAddress: evt.address_line1 || '',
        addressLocality: evt.city || '',
        addressRegion: evt.state || '',
        postalCode: evt.postal_code || '',
        addressCountry: evt.country || 'IN',
      }
    },
    organizer: {
      '@type': 'Organization',
      name: 'UDBHAV Foundation',
      url: METADATA.BASE_URL,
    }
  };

  return (
    <main className="min-h-screen bg-[#FCFCF8] pt-24 pb-16 px-4 md:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Cover Image Placeholder */}
        <div className="h-64 md:h-96 bg-gray-100 w-full relative">
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            {/* Real implementation would use evt.cover_image_id to fetch CDN url */}
            [Event Cover Image]
          </div>
        </div>

        <div className="p-8 md:p-12">
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span className="bg-[#172B6B]/10 text-[#172B6B] px-3 py-1 rounded-full text-sm font-semibold">
                {evt.event_type || 'Event'}
              </span>
              {evt.status === 'Registration Open' && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  Registration Open
                </span>
              )}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">{evt.title}</h1>
            {evt.subtitle && <p className="text-xl text-gray-600 font-medium">{evt.subtitle}</p>}
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 border-y border-gray-100 py-8">
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Date & Time</h3>
              <p className="text-gray-900 font-medium">
                {evt.start_time ? format(new Date(evt.start_time), 'MMM d, yyyy') : 'TBA'}
              </p>
              <p className="text-gray-600 text-sm">
                {evt.start_time ? format(new Date(evt.start_time), 'h:mm a') : ''}
                {evt.end_time ? ` - ${format(new Date(evt.end_time), 'h:mm a')}` : ''}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Location</h3>
              {meta.is_virtual ? (
                <>
                  <p className="text-gray-900 font-medium">Virtual Event</p>
                  {meta.virtual_link && (
                    <a href={meta.virtual_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                      Join Meeting Link
                    </a>
                  )}
                </>
              ) : (
                <>
                  <p className="text-gray-900 font-medium">{evt.venue_name || 'TBA'}</p>
                  <p className="text-gray-600 text-sm">{evt.city} {evt.state}</p>
                </>
              )}
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Registration</h3>
              {meta.registration_deadline && (
                <p className="text-gray-600 text-sm mb-1">
                  Closes: {format(new Date(meta.registration_deadline), 'MMM d, yyyy')}
                </p>
              )}
              {evt.max_attendees ? (
                <p className="text-gray-600 text-sm">
                  Capacity: {evt.max_attendees} attendees
                </p>
              ) : null}
            </div>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700">
            {evt.description ? (
              <div dangerouslySetInnerHTML={{ __html: evt.description.replace(/\n/g, '<br/>') }} />
            ) : (
              <p>No additional details provided.</p>
            )}
          </div>

          <div className="mt-12 flex justify-center">
            {evt.status === 'Registration Open' ? (
              <button className="bg-[#8B1A1A] hover:bg-[#6b1313] text-white px-8 py-4 rounded-full font-bold text-lg transition-colors">
                Register for Event
              </button>
            ) : (
              <div className="bg-gray-100 text-gray-500 px-8 py-4 rounded-full font-bold text-lg">
                Registration Closed
              </div>
            )}
          </div>
        </div>
      </article>

      <div className="mt-12 text-center">
        <Link href="/events" className="text-[#172B6B] hover:underline font-medium inline-flex items-center">
          <svg className="w-4 h-4 mr-2 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Back to all events
        </Link>
      </div>
    </main>
  );
}
