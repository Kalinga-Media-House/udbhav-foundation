'use client';

import { Image as ImageIcon, MapPin, Tag } from 'lucide-react';
import Image from 'next/image';

import { Container } from '@/components/shared/Container';
import type { AdminPhotoItem } from '@/features/gallery/repository';

interface PhotoGridSectionProps {
  photos: AdminPhotoItem[];
}

export function PhotoGridSection({ photos }: PhotoGridSectionProps) {
  return (
    <section className="py-16 bg-gray-50/50">
      <Container>
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Community Photos
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Browse authentic moments from our programs, events, and community initiatives across Odisha.
            </p>
          </div>
        </div>

        {photos.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">No Photos Published Yet</h3>
            <p className="text-sm text-gray-500 mt-1">
              Check back soon for new photo stories from our initiatives.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {photos.map((photo) => {
              const title = photo.caption || photo.album?.title || 'Untitled';
              const location = photo.location || photo.album?.location;
              
              return (
                <div
                  key={photo.id}
                  className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-64 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    {photo.media?.cdn_url ? (
                      <Image
                        src={photo.media.cdn_url}
                        alt={photo.media.alt_text || title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    ) : (
                      <ImageIcon className="w-12 h-12 text-gray-300" />
                    )}
                    
                    {/* Overlay gradient for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-1" title={title}>
                      {title}
                    </h3>
                    
                    {photo.description && (
                      <p className="mt-1.5 text-sm text-gray-600 line-clamp-2">
                        {photo.description}
                      </p>
                    )}
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      {location && (
                        <div className="flex items-center text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md font-medium">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span className="truncate max-w-[120px]">{location}</span>
                        </div>
                      )}
                      
                      {(photo.album?.program_id || photo.album?.event_id) && (
                        <div className="flex items-center text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded-md font-medium">
                          <Tag className="w-3 h-3 mr-1" />
                          <span>Initiative</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}
