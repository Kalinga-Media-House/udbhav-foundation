'use client';

import { ArrowLeft, Camera, Calendar } from 'lucide-react';
import Link from 'next/link';
import React, { useState, useMemo } from 'react';

import { Container } from '@/components/shared/Container';
import type { AlbumRow } from '@/features/gallery/repository';
import type { GalleryPhoto } from '@/types/gallery';

import { GalleryCard } from './GalleryCard';
import { GalleryLightboxModal } from './GalleryLightboxModal';

interface AlbumDetailClientProps {
  album: AlbumRow;
  initialPhotos: GalleryPhoto[];
}

export function AlbumDetailClient({ album, initialPhotos }: AlbumDetailClientProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(16);

  const displayedPhotos = useMemo(() => {
    return initialPhotos.slice(0, visibleCount);
  }, [initialPhotos, visibleCount]);

  const handlePhotoClick = (photoId: string) => {
    const idx = initialPhotos.findIndex((p) => p.id === photoId);
    if (idx >= 0) {
      setLightboxIndex(idx);
      setLightboxOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Album Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white py-16">
        <Container>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-200 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Albums
          </Link>

          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-700/50 text-emerald-100 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/30">
              {album.album_code}
            </span>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
              {album.title}
            </h1>

            {album.description && (
              <p className="mt-4 text-emerald-100/90 text-base md:text-lg leading-relaxed">
                {album.description}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-emerald-200">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4" />
                <span>{initialPhotos.length} Photos</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(album.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Album Photo Grid */}
      <Container className="mt-12">
        {initialPhotos.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
            <Camera className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">No Photos in This Album Yet</h3>
            <p className="text-sm text-gray-500 mt-1">
              New images are being curated for this album and will appear soon.
            </p>
          </div>
        ) : (
          <>
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {displayedPhotos.map((photo, index) => (
                <div key={photo.id} className="break-inside-avoid">
                  <GalleryCard
                    photo={photo}
                    index={index}
                    onClick={() => handlePhotoClick(photo.id)}
                  />
                </div>
              ))}
            </div>

            {visibleCount < initialPhotos.length && (
              <div className="mt-12 text-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 16)}
                  className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm rounded-lg shadow-sm hover:shadow transition-all"
                >
                  Load More Photos ({initialPhotos.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </Container>

      {/* Lightbox Modal */}
      {initialPhotos.length > 0 && (
        <GalleryLightboxModal
          photos={initialPhotos}
          currentIndex={lightboxIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          onNavigate={(newIdx) => setLightboxIndex(newIdx)}
        />
      )}
    </div>
  );
}
