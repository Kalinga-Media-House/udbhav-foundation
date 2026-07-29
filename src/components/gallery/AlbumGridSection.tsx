'use client';

import { Folder, ArrowRight, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

import { Container } from '@/components/shared/Container';
import type { AlbumRow } from '@/features/gallery/repository';

interface AlbumGridSectionProps {
  albums: AlbumRow[];
}

export function AlbumGridSection({ albums }: AlbumGridSectionProps) {
  return (
    <section className="py-16 bg-gray-50/50">
      <Container>
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Featured Collections & Albums
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Browse organized photographic records of our programs, events, and community initiatives.
            </p>
          </div>
        </div>

        {albums.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <Folder className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">No Albums Published Yet</h3>
            <p className="text-sm text-gray-500 mt-1">
              Check back soon for new photo stories and collections from our initiatives across Odisha.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {albums.map((album) => (
              <Link
                key={album.id}
                href={`/gallery/${album.slug}`}
                className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
              >
                <div className="relative h-56 w-full bg-gradient-to-br from-emerald-900 to-emerald-700 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="z-10 flex flex-col items-center justify-center text-white p-6 text-center">
                    <ImageIcon className="w-12 h-12 opacity-80 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs uppercase tracking-wider font-semibold opacity-75">
                      {album.album_code}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                      {album.title}
                    </h3>
                    {album.description && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {album.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
                    <span>View Album</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
