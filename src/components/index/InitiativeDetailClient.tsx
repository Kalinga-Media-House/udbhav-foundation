'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Tag,
  Users,
  Award,
  Clock,
  Briefcase,
  Sparkles,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect, useCallback } from 'react';

import type { IndexInitiativeWithMedia } from '@/features/index/repository';

interface InitiativeDetailClientProps {
  initiative: IndexInitiativeWithMedia;
  related: IndexInitiativeWithMedia[];
  adjacent: {
    prev: IndexInitiativeWithMedia | null;
    next: IndexInitiativeWithMedia | null;
  };
}

export function InitiativeDetailClient({ initiative, related, adjacent }: InitiativeDetailClientProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const gallery = initiative.gallery || [];
  const coverUrl = initiative.cover_image_url || '/hero/hero-01.png';

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevImage = useCallback(() => {
    if (lightboxIndex === null || gallery.length === 0) return;
    setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : gallery.length - 1));
  }, [lightboxIndex, gallery.length]);
  const nextImage = useCallback(() => {
    if (lightboxIndex === null || gallery.length === 0) return;
    setLightboxIndex((prev) => (prev! < gallery.length - 1 ? prev! + 1 : 0));
  }, [lightboxIndex, gallery.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, closeLightbox, prevImage, nextImage]);

  const highlights = [
    { label: 'Date', value: initiative.year.toString(), icon: Calendar, show: true },
    { label: 'Venue', value: initiative.location, icon: MapPin, show: Boolean(initiative.location) },
    { label: 'Beneficiaries', value: initiative.beneficiaries, icon: Users, show: Boolean(initiative.beneficiaries) },
    { label: 'Volunteers', value: initiative.volunteers, icon: UserCheck, show: Boolean(initiative.volunteers) },
    { label: 'Chief Guest', value: initiative.chief_guest, icon: Award, show: Boolean(initiative.chief_guest) },
    { label: 'Duration', value: initiative.duration, icon: Clock, show: Boolean(initiative.duration) },
    { label: 'Partner', value: initiative.partner_name, icon: Briefcase, show: Boolean(initiative.partner_name) },
    { label: 'Outcome', value: initiative.outcome, icon: Sparkles, show: Boolean(initiative.outcome) },
  ].filter((h) => h.show && Boolean(h.value));

  return (
    <main className="min-h-screen bg-[#FCFCF8] text-gray-900">
      {/* 1. Large Edge-to-Edge Hero */}
      <section className="relative w-full h-[55vh] min-h-[420px] max-h-[620px] bg-[#121B2A] overflow-hidden">
        <Image
          src={coverUrl}
          alt={initiative.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 max-w-5xl mx-auto px-6 pb-12 z-10 text-white">
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center text-xs font-semibold uppercase tracking-wider text-gray-300">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2 text-gray-500">/</span>
            <Link href="/index" className="hover:text-[#439B25] transition-colors text-[#439B25]">Programs & Initiatives</Link>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-white line-clamp-1 flex-1" aria-current="page">{initiative.title}</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-[#FCFCF8] max-w-3xl leading-tight">
            {initiative.title}
          </h1>
        </div>
      </section>

      {/* 2. Quick Information Chips */}
      <section className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 py-3 flex flex-wrap items-center gap-4 text-xs sm:text-sm font-medium text-gray-700">
          <span className="inline-flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full">
            <Calendar className="w-3.5 h-3.5 text-[#439B25]" />
            {initiative.year}
          </span>
          {initiative.location && (
            <span className="inline-flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full">
              <MapPin className="w-3.5 h-3.5 text-[#439B25]" />
              {initiative.location}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 bg-[#439B25]/10 text-[#439B25] px-3 py-1 rounded-full">
            <Tag className="w-3.5 h-3.5" />
            {initiative.initiative_type}
          </span>
        </div>
      </section>

      {/* 3. "The Story" */}
      <section className="max-w-3xl mx-auto px-6 py-14 sm:py-16">
        <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#439B25] mb-2 font-sans">
          The Story
        </h2>
        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mb-6 leading-snug">
          {initiative.short_summary}
        </h3>
        <div className="prose prose-lg max-w-none text-gray-700 font-serif leading-relaxed space-y-6">
          {(initiative.description || initiative.short_summary)
            .split('\n\n')
            .map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
        </div>
      </section>

      {/* 4. "At a Glance" Panels */}
      {highlights.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-12 sm:py-16 border-t border-gray-200/70">
          <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#439B25] mb-2 font-sans">
            At a Glance
          </h2>
          <h3 className="text-2xl font-serif font-bold text-gray-900 mb-8">
            Key Highlights of the Initiative
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {highlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start gap-4"
                >
                  <div className="p-3 bg-[#439B25]/10 rounded-xl text-[#439B25] shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                      {item.label}
                    </p>
                    <p className="text-sm sm:text-base font-serif font-semibold text-gray-900 leading-snug">
                      {item.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 5. "Moments from the Initiative" (Photo Exhibition Gallery) */}
      <section className="max-w-6xl mx-auto px-6 py-14 sm:py-16 border-t border-gray-200/70">
        <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#439B25] mb-2 font-sans">
          Moments from the Initiative
        </h2>
        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-8">
          Photo Exhibition
        </h3>

        {gallery.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <p className="text-base font-serif text-gray-700">No photographs have been added yet.</p>
            <p className="text-xs text-gray-400 mt-1 font-sans">
              Moments from this initiative will be published shortly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {gallery.map((photo, idx) => {
              const url = photo.public_url || '/hero/hero-02.png';
              return (
                <div
                  key={photo.id}
                  onClick={() => setLightboxIndex(idx)}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 cursor-pointer border border-gray-100 shadow-sm"
                >
                  <Image
                    src={url}
                    alt={photo.alt_text || photo.caption || `Initiative Photo ${idx + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <Maximize2 className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  {photo.caption && (
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-6 text-white text-xs font-sans line-clamp-1">
                      {photo.caption}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && gallery[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 sm:p-8"
          >
            <button
              onClick={closeLightbox}
              aria-label="Close photo viewer"
              className="absolute top-6 right-6 text-white/80 hover:text-white p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
            >
              <X className="w-6 h-6" />
            </button>

            {gallery.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  aria-label="Previous photo"
                  className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  aria-label="Next photo"
                  className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <div className="relative max-w-5xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center">
              <div className="relative w-full h-full max-h-[75vh]">
                <Image
                  src={gallery[lightboxIndex]!.public_url || '/hero/hero-02.png'}
                  alt={gallery[lightboxIndex]!.alt_text || gallery[lightboxIndex]!.caption || 'Initiative Photo'}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
              {gallery[lightboxIndex]!.caption && (
                <p className="text-white/90 text-sm font-sans mt-4 text-center max-w-2xl px-4">
                  {gallery[lightboxIndex]!.caption}
                </p>
              )}
              <p className="text-white/50 text-xs mt-2 font-sans">
                {lightboxIndex + 1} of {gallery.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. "Explore More Initiatives" */}
      <section className="max-w-6xl mx-auto px-6 py-14 sm:py-16 border-t border-gray-200/70">
        <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#439B25] mb-2 font-sans">
          Explore More Initiatives
        </h2>
        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-8">
          You May Also Like
        </h3>

        {related.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm">
            <p className="text-sm font-serif text-gray-600">More initiatives will be added soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {related.map((item) => (
              <article
                key={item.id}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300"
              >
                <Link href={`/index/${item.slug}`} className="flex flex-col h-full">
                  <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
                    <Image
                      src={item.cover_image_url || '/hero/hero-01.png'}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <p className="text-[11px] font-semibold text-[#439B25] uppercase tracking-wider mb-1">
                        {item.initiative_type} &bull; {item.year}
                      </p>
                      <h4 className="text-base font-serif font-bold text-gray-900 group-hover:text-[#439B25] transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* 7. Large Previous / Next Navigation Cover Cards */}
      <section className="max-w-6xl mx-auto px-6 py-14 sm:py-16 border-t border-gray-200/70">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {adjacent.prev ? (
            <Link
              href={`/index/${adjacent.prev.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-gray-900 aspect-[16/7] flex items-center p-6 sm:p-8 text-white border border-gray-800 shadow-sm"
            >
              <Image
                src={adjacent.prev.cover_image_url || '/hero/hero-01.png'}
                alt={adjacent.prev.title}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover object-center opacity-30 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="relative z-10">
                <span className="text-xs uppercase tracking-widest text-[#439B25] font-semibold block mb-1">
                  &larr; Previous Initiative
                </span>
                <h4 className="text-lg sm:text-xl font-serif font-bold text-white group-hover:underline line-clamp-2">
                  {adjacent.prev.title}
                </h4>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {adjacent.next ? (
            <Link
              href={`/index/${adjacent.next.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-gray-900 aspect-[16/7] flex items-center justify-end text-right p-6 sm:p-8 text-white border border-gray-800 shadow-sm"
            >
              <Image
                src={adjacent.next.cover_image_url || '/hero/hero-02.png'}
                alt={adjacent.next.title}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover object-center opacity-30 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="relative z-10">
                <span className="text-xs uppercase tracking-widest text-[#439B25] font-semibold block mb-1">
                  Next Initiative &rarr;
                </span>
                <h4 className="text-lg sm:text-xl font-serif font-bold text-white group-hover:underline line-clamp-2">
                  {adjacent.next.title}
                </h4>
              </div>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </section>
    </main>
  );
}
