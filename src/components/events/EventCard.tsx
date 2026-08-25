import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import type { EventRow } from '@/features/events/repository';
import { mediaService } from '@/features/media/service';

export interface EventCardProps {
  event: EventRow;
}

export async function EventCard({ event }: EventCardProps) {
  let imageUrl: string | null = null;
  if (event.cover_image_id) {
    const mediaRes = await mediaService.getById(event.cover_image_id);
    if (mediaRes.success && mediaRes.data) {
      imageUrl = mediaRes.data.cdn_url;
    }
  }

  const isRegistrationOpen = event.status === 'Registration Open' || event.status === 'registration_open';

  return (
    <Link href={`/events/${event.slug}`} className="group block h-full">
      <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
        <div className="h-48 bg-gray-100 relative overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={event.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <svg className="w-12 h-12 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          <div className="absolute inset-0 bg-[#172B6B]/10 group-hover:bg-[#172B6B]/0 transition-colors pointer-events-none" />
          
          {isRegistrationOpen && (
            <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              Registration Open
            </div>
          )}
        </div>
        
        <div className="p-6 flex-grow flex flex-col">
          <div className="text-sm font-semibold text-[#8B1A1A] mb-2">
            {event.start_time ? format(new Date(event.start_time), 'MMMM d, yyyy') : 'TBA'}
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#172B6B] transition-colors line-clamp-2">
            {event.title}
          </h2>
          
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {event.subtitle || event.description || ''}
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
  );
}
