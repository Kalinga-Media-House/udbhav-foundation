'use client';

import { Image as ImageIcon, MapPin, Tag, Search, Star, CalendarDays, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect, useTransition } from 'react';

import { Container } from '@/components/shared/Container';
import type { AdminPhotoItem, PublicGalleryFilterOptions } from '@/features/gallery/repository';
import { GalleryLightbox } from './GalleryLightbox';

interface PhotoGridSectionProps {
  initialPhotos: AdminPhotoItem[];
  totalPhotos: number;
  filterOptions: PublicGalleryFilterOptions;
  currentPage: number;
}

export function PhotoGridSection({ initialPhotos, totalPhotos, filterOptions, currentPage }: PhotoGridSectionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSort = searchParams.get('sort') || 'newest';
  const currentProgram = searchParams.get('program') || 'all';
  const currentEvent = searchParams.get('event') || 'all';
  const currentSearch = searchParams.get('search') || '';
  
  const [searchQuery, setSearchQuery] = useState(currentSearch);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  // Update local search if URL changes externally
  useEffect(() => {
    setSearchQuery(currentSearch);
  }, [currentSearch]);

  const [filterMode, setFilterMode] = useState<'All' | 'Programmes' | 'Events'>(
    currentProgram !== 'all' ? 'Programmes' : currentEvent !== 'all' ? 'Events' : 'All'
  );

  const updateURL = (params: Record<string, string | null>) => {
    const url = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === 'all' || value === '') {
        url.delete(key);
      } else {
        url.set(key, value);
      }
    });
    // Ensure page resets to 1 if we change filters/sort, only if we aren't intentionally changing the page
    if (!params.page && url.has('page')) {
      url.delete('page');
    }
    
    startTransition(() => {
      router.push(`${pathname}?${url.toString()}`, { scroll: false });
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL({ search: searchQuery });
  };

  const hasMorePhotos = initialPhotos.length < totalPhotos;

  return (
    <section className="py-12 sm:py-16 bg-gray-50/50 min-h-[500px] relative">
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

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search photos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
              />
              <button type="submit" className="hidden" />
            </form>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
            <div className="flex bg-gray-100 p-1 rounded-lg overflow-x-auto w-full sm:w-auto">
              {(['All Photos', 'Programmes', 'Events'] as const).map(mode => {
                const modeValue = mode === 'All Photos' ? 'All' : mode;
                return (
                  <button
                    key={mode}
                    onClick={() => {
                      setFilterMode(modeValue);
                      if (modeValue === 'All') {
                        updateURL({ program: null, event: null });
                      } else if (modeValue === 'Programmes') {
                        updateURL({ event: null });
                      } else if (modeValue === 'Events') {
                        updateURL({ program: null });
                      }
                    }}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                      filterMode === modeValue 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {mode}
                  </button>
                );
              })}
            </div>

            {filterMode === 'Programmes' && (
              <select
                value={currentProgram}
                onChange={(e) => updateURL({ program: e.target.value, event: null })}
                className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
              >
                <option value="all">All Programmes</option>
                {filterOptions.programs.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            )}

            {filterMode === 'Events' && (
              <select
                value={currentEvent}
                onChange={(e) => updateURL({ event: e.target.value, program: null })}
                className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
              >
                <option value="all">All Events</option>
                {filterOptions.events.map(e => (
                  <option key={e.id} value={e.id}>{e.title}</option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0 justify-end">
            <span className="text-sm text-gray-500 shrink-0">Sort by:</span>
            <select
              value={currentSort}
              onChange={(e) => updateURL({ sort: e.target.value })}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors shrink-0"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="featured">Featured First</option>
            </select>
          </div>
        </div>

        <div className={`transition-opacity duration-300 ${isPending ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          {initialPhotos.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center max-w-2xl mx-auto">
              {currentSearch || currentProgram !== 'all' || currentEvent !== 'all' ? (
                <>
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800">No photos found</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Try changing your search or filter.
                  </p>
                  <button 
                    onClick={() => {
                      setFilterMode('All');
                      setSearchQuery('');
                      updateURL({ program: null, event: null, search: null, sort: null, page: null });
                    }}
                    className="mt-4 text-emerald-600 font-medium text-sm hover:underline"
                  >
                    Clear all filters
                  </button>
                </>
              ) : (
                <>
                  <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800">No Gallery Photos Yet</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    We're preparing moments from UDBHAV Foundation's programmes, events, and community initiatives. Check back soon.
                  </p>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {initialPhotos.map((photo, index) => {
                  const isFallbackTitle = photo.album?.title?.startsWith('Gallery Upload -');
                  let title: string | undefined = photo.caption || undefined;
                  if (!title && !isFallbackTitle) title = photo.album?.title || undefined;
                  
                  const location = photo.location || photo.album?.location;
                  const programTitle = photo.album?.program?.title;
                  const eventTitle = photo.album?.event?.title;
                  const isFeatured = photo.is_featured || photo.album?.is_featured;
                  
                  return (
                    <button
                      key={photo.id}
                      onClick={() => setSelectedIndex(index)}
                      className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full text-left w-full outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2"
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
                    </button>
                  );
                })}
              </div>

              {hasMorePhotos && (
                <div className="mt-12 flex justify-center">
                  <button
                    onClick={() => updateURL({ page: String(currentPage + 1) })}
                    disabled={isPending}
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
                  >
                    {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Load More Photos
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </Container>

      {selectedIndex !== null && (
        <GalleryLightbox
          photos={initialPhotos}
          initialIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </section>
  );
}
