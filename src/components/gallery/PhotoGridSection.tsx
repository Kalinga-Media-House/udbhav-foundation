'use client';

import { Image as ImageIcon, MapPin, Tag, Search, Star, CalendarDays } from 'lucide-react';
import Image from 'next/image';
import { useState, useMemo } from 'react';

import { Container } from '@/components/shared/Container';
import type { AdminPhotoItem } from '@/features/gallery/repository';

interface PhotoGridSectionProps {
  photos: AdminPhotoItem[];
}

export function PhotoGridSection({ photos }: PhotoGridSectionProps) {
  const [filterMode, setFilterMode] = useState<'All' | 'Programmes' | 'Events'>('All');
  const [selectedProgramId, setSelectedProgramId] = useState<string>('all');
  const [selectedEventId, setSelectedEventId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique programs that have photos
  const programs = useMemo(() => {
    const map = new Map<string, { id: string; title: string }>();
    photos.forEach(p => {
      if (p.album?.program) {
        map.set(p.album.program.id, p.album.program);
      }
    });
    return Array.from(map.values()).sort((a, b) => a.title.localeCompare(b.title));
  }, [photos]);

  // Extract unique events that have photos
  const events = useMemo(() => {
    const map = new Map<string, { id: string; title: string }>();
    photos.forEach(p => {
      if (p.album?.event) {
        map.set(p.album.event.id, p.album.event);
      }
    });
    return Array.from(map.values()).sort((a, b) => a.title.localeCompare(b.title));
  }, [photos]);

  // Filter and sort photos
  const displayedPhotos = useMemo(() => {
    let filtered = photos;

    // Apply categorical filters
    if (filterMode === 'Programmes') {
      if (selectedProgramId !== 'all') {
        filtered = filtered.filter(p => p.album?.program?.id === selectedProgramId);
      } else {
        filtered = filtered.filter(p => p.album?.program);
      }
    } else if (filterMode === 'Events') {
      if (selectedEventId !== 'all') {
        filtered = filtered.filter(p => p.album?.event?.id === selectedEventId);
      } else {
        filtered = filtered.filter(p => p.album?.event);
      }
    }

    // Apply text search
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => {
        const title = (p.caption || p.album?.title || '').toLowerCase();
        const location = (p.location || p.album?.location || '').toLowerCase();
        const programTitle = (p.album?.program?.title || '').toLowerCase();
        const eventTitle = (p.album?.event?.title || '').toLowerCase();
        
        // Hide internal auto-generated titles from search indexing if they look like "Gallery Upload -"
        // Actually, we should just not match against the internal title if it's a fallback. But a simple includes is fine.
        return title.includes(query) || 
               location.includes(query) || 
               programTitle.includes(query) || 
               eventTitle.includes(query);
      });
    }

    // Sort: Featured first, then preserve existing ordering (which is by created_at desc)
    return [...filtered].sort((a, b) => {
      const aFeatured = a.is_featured || a.album?.is_featured ? 1 : 0;
      const bFeatured = b.is_featured || b.album?.is_featured ? 1 : 0;
      if (aFeatured !== bFeatured) {
        return bFeatured - aFeatured; // 1 goes before 0
      }
      return 0; // keep original order
    });
  }, [photos, filterMode, selectedProgramId, selectedEventId, searchQuery]);

  return (
    <section className="py-12 sm:py-16 bg-gray-50/50 min-h-[500px]">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Community Photos
            </h2>
            <p className="mt-2 text-sm text-gray-600 max-w-2xl">
              Browse authentic moments from our programs, events, and community initiatives across Odisha.
            </p>
          </div>

          {photos.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search photos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
          )}
        </div>

        {photos.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
            <div className="flex bg-gray-100 p-1 rounded-lg overflow-x-auto w-full sm:w-auto">
              {(['All', 'Programmes', 'Events'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => {
                    setFilterMode(mode);
                    setSearchQuery('');
                  }}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                    filterMode === mode 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {filterMode === 'Programmes' && programs.length > 0 && (
              <select
                value={selectedProgramId}
                onChange={(e) => setSelectedProgramId(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
              >
                <option value="all">All Programmes</option>
                {programs.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            )}

            {filterMode === 'Events' && events.length > 0 && (
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
              >
                <option value="all">All Events</option>
                {events.map(e => (
                  <option key={e.id} value={e.id}>{e.title}</option>
                ))}
              </select>
            )}
          </div>
        )}

        {photos.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center max-w-2xl mx-auto">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">No Gallery Photos Yet</h3>
            <p className="text-sm text-gray-500 mt-1">
              We're preparing moments from UDBHAV Foundation's programmes, events, and community initiatives. Check back soon.
            </p>
          </div>
        ) : displayedPhotos.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center max-w-2xl mx-auto">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">No photos found</h3>
            <p className="text-sm text-gray-500 mt-1">
              No photos match your current filters and search query.
            </p>
            <button 
              onClick={() => {
                setFilterMode('All');
                setSearchQuery('');
              }}
              className="mt-4 text-emerald-600 font-medium text-sm hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedPhotos.map((photo) => {
              // Only fallback to album title if it doesn't look like an auto-generated internal upload title
              const isFallbackTitle = photo.album?.title?.startsWith('Gallery Upload -');
              let title: string | undefined = photo.caption || undefined;
              if (!title && !isFallbackTitle) title = photo.album?.title || undefined;
              
              const location = photo.location || photo.album?.location;
              const programTitle = photo.album?.program?.title;
              const eventTitle = photo.album?.event?.title;
              const isFeatured = photo.is_featured || photo.album?.is_featured;
              
              return (
                <div
                  key={photo.id}
                  className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
                >
                  <div className="relative h-56 sm:h-64 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    {photo.media?.cdn_url ? (
                      <Image
                        src={photo.media.cdn_url}
                        alt={photo.media.alt_text || title || 'Gallery Image'}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      />
                    ) : (
                      <ImageIcon className="w-12 h-12 text-gray-300" />
                    )}
                    
                    {isFeatured && (
                      <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm flex items-center z-10">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Featured
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    {title && (
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-1" title={title}>
                        {title}
                      </h3>
                    )}
                    
                    {photo.description && (
                      <p className={`text-sm text-gray-600 line-clamp-2 ${title ? 'mt-1.5' : ''}`}>
                        {photo.description}
                      </p>
                    )}
                    
                    <div className={`flex flex-wrap gap-2 ${title || photo.description ? 'mt-3 pt-3 border-t border-gray-50' : ''}`}>
                      {programTitle && (
                        <div className="flex items-center text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded-md font-medium" title={programTitle}>
                          <Tag className="w-3 h-3 mr-1 shrink-0" />
                          <span className="truncate max-w-[140px]">{programTitle}</span>
                        </div>
                      )}
                      
                      {eventTitle && (
                        <div className="flex items-center text-xs text-purple-700 bg-purple-50 px-2 py-1 rounded-md font-medium" title={eventTitle}>
                          <CalendarDays className="w-3 h-3 mr-1 shrink-0" />
                          <span className="truncate max-w-[140px]">{eventTitle}</span>
                        </div>
                      )}
                      
                      {location && (
                        <div className="flex items-center text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md font-medium" title={location}>
                          <MapPin className="w-3 h-3 mr-1 shrink-0" />
                          <span className="truncate max-w-[140px]">{location}</span>
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
