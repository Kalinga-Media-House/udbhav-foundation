"use client";

import {
  ArrowLeft,
  ArrowRight,
  HeartHandshake,
  Camera,
  Calendar,
  MapPin,
  TrendingUp,
  Image as ImageIcon
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import type { IndexProgrammeDetail } from "@/types/index-programme";
import type { AdminPhotoItem } from "@/features/gallery/repository";

const PROGRAM_CARD_THEMES = [
  { bg: 'bg-emerald-50', accent: 'text-emerald-600', hover: 'group-hover:text-emerald-700', text: 'text-emerald-950', border: 'border-emerald-100', divider: 'bg-emerald-200/60', icon: 'text-emerald-500' },
  { bg: 'bg-blue-50', accent: 'text-blue-600', hover: 'group-hover:text-blue-700', text: 'text-blue-950', border: 'border-blue-100', divider: 'bg-blue-200/60', icon: 'text-blue-500' },
  { bg: 'bg-amber-50', accent: 'text-amber-600', hover: 'group-hover:text-amber-700', text: 'text-amber-950', border: 'border-amber-100', divider: 'bg-amber-200/60', icon: 'text-amber-500' },
  { bg: 'bg-indigo-50', accent: 'text-indigo-600', hover: 'group-hover:text-indigo-700', text: 'text-indigo-950', border: 'border-indigo-100', divider: 'bg-indigo-200/60', icon: 'text-indigo-500' },
  { bg: 'bg-teal-50', accent: 'text-teal-600', hover: 'group-hover:text-teal-700', text: 'text-teal-950', border: 'border-teal-100', divider: 'bg-teal-200/60', icon: 'text-teal-500' },
  { bg: 'bg-rose-50', accent: 'text-rose-600', hover: 'group-hover:text-rose-700', text: 'text-rose-950', border: 'border-rose-100', divider: 'bg-rose-200/60', icon: 'text-rose-500' },
  { bg: 'bg-sky-50', accent: 'text-sky-600', hover: 'group-hover:text-sky-700', text: 'text-sky-950', border: 'border-sky-100', divider: 'bg-sky-200/60', icon: 'text-sky-500' },
  { bg: 'bg-fuchsia-50', accent: 'text-fuchsia-600', hover: 'group-hover:text-fuchsia-700', text: 'text-fuchsia-950', border: 'border-fuchsia-100', divider: 'bg-fuchsia-200/60', icon: 'text-fuchsia-500' },
];

function getThemeForId(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PROGRAM_CARD_THEMES.length;
  return PROGRAM_CARD_THEMES[index];
}

interface ProgrammeDetailViewProps {
  programme: IndexProgrammeDetail;
  photos: AdminPhotoItem[];
  relatedProgrammes: IndexProgrammeDetail[];
}

export function ProgrammeDetailView({
  programme,
  photos,
  relatedProgrammes,
}: ProgrammeDetailViewProps) {
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);

  const openLightbox = (idx: number) => {
    setSelectedPhotoIndex(idx);
    setLightboxOpen(true);
  };

  const scrollToGallery = () => {
    const el = document.getElementById("gallery");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const hasPhotos = photos && photos.length > 0;

  return (
    <div className="bg-[#FCFCF8]">
      {/* 1. COMPACT HERO SECTION */}
      <section className="relative bg-gradient-to-br from-[#172B6B] via-[#101F55] to-[#12245F] text-white py-8 sm:py-12 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-6">
            <Link
              href="/programmes"
              className="inline-flex items-center gap-2 text-sm font-heading font-medium text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Programmes
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div>
              {programme.programmeNumber && programme.programmeNumber !== '00' && (
                <div className="mb-3">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-heading font-bold uppercase bg-[#439B25] text-white tracking-widest">
                    PROGRAMME {programme.programmeNumber}
                  </span>
                </div>
              )}
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-white leading-tight mb-2">
                {programme.title}
              </h1>
              
              {programme.tagline && (
                <p className="text-sm sm:text-base font-medium text-[#439B25] uppercase tracking-wide mb-6">
                  {programme.tagline}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/volunteers"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-heading font-semibold text-sm text-white bg-[#439B25] hover:bg-[#348a1e] transition-colors"
                >
                  <HeartHandshake className="w-4 h-4" />
                  Become a Volunteer
                </Link>

                <button
                  type="button"
                  onClick={scrollToGallery}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-heading font-semibold text-sm text-white bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-[#439B25]" />
                  View Gallery
                </button>
              </div>
            </div>

            {/* Right Cover Image */}
            <div className="relative aspect-[16/9] sm:aspect-[3/2] lg:aspect-[16/9] w-full max-w-lg lg:ml-auto rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/20">
              <Image
                src={programme.coverImageUrl}
                alt={programme.title}
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROGRAMME INFORMATION SECTION */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            
            {/* Main Description */}
            <div className="md:col-span-2">
              <h2 className="text-xl font-heading font-bold text-[#172B6B] mb-4">About This Programme</h2>
              <div className="prose prose-sm sm:prose-base prose-gray max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                {programme.fullDescription || programme.shortDescription}
              </div>
              
              {programme.purpose && (
                <div className="mt-8">
                  <h3 className="text-lg font-heading font-bold text-[#172B6B] mb-3">Our Purpose</h3>
                  <p className="text-gray-700">{programme.purpose}</p>
                </div>
              )}
            </div>

            {/* Sidebar Details */}
            <div className="space-y-6 bg-gray-50 p-6 rounded-2xl border border-gray-100 h-fit">
              <h3 className="text-sm font-heading font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">Programme Details</h3>
              
              {(programme.programDate || programme.location) && (
                <div className="space-y-4">
                  {programme.programDate && (
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-[#439B25] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Date</p>
                        <p className="text-sm font-medium text-gray-900">{programme.programDate}</p>
                      </div>
                    </div>
                  )}
                  
                  {programme.location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#439B25] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Location</p>
                        <p className="text-sm font-medium text-gray-900">{programme.location}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {programme.impactPreview && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-[#439B25] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Primary Outcome</p>
                      <p className="text-sm font-bold text-[#172B6B]">{programme.impactPreview}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 3. PROGRAMME PHOTO GALLERY */}
      <section
        id="gallery"
        className="py-16 sm:py-20 bg-[#FCFCF8] border-b border-gray-200 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3C9D23]/15 text-[#3C9D23] text-[11px] font-heading font-bold uppercase tracking-wider mb-2">
                COMMUNITY DOCUMENTATION
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#172B6B]">
                Moments From This Programme
              </h2>
            </div>
            {hasPhotos && (
              <div className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm w-fit">
                {photos.length} Photo{photos.length === 1 ? '' : 's'}
              </div>
            )}
          </div>

          {hasPhotos ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {photos.map((photo, idx) => {
                const imageUrl = photo.media?.cdn_url;
                if (!imageUrl) return null;
                
                const title = photo.caption || photo.album?.title || "Gallery Moment";

                return (
                  <div
                    key={photo.id}
                    onClick={() => openLightbox(idx)}
                    className="group relative cursor-pointer rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm hover:shadow-lg transition-all aspect-[4/3]"
                  >
                    <Image
                      src={imageUrl}
                      alt={photo.media?.alt_text || title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex flex-col justify-end p-4">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                         {/* Very clean minimal overlay - maybe just an icon */}
                         <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center ml-auto">
                            <ImageIcon className="w-4 h-4 text-white" />
                         </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 px-4 text-center rounded-2xl bg-white border border-dashed border-gray-300">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 mb-4 ring-1 ring-gray-100">
                <Camera className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-heading font-bold text-gray-900 mb-1">No photos available yet.</h3>
              <p className="text-sm font-medium text-gray-500 max-w-md mx-auto">
                Photos from this programme will appear here once they are captured and added to our gallery.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Integration */}
      {hasPhotos && lightboxOpen && (
        <GalleryLightbox
          photos={photos}
          initialIndex={selectedPhotoIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      {/* 4. RELATED PROGRAMMES (Redesigned) */}
      {relatedProgrammes.length > 0 && (
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#172B6B] mb-8">
              You May Also Explore
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProgrammes.map((rp) => {
                const theme = getThemeForId(rp.id);
                return (
                  <div
                    key={rp.id}
                    className={`w-full ${theme.bg} rounded-[16px] sm:rounded-[20px] p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 border ${theme.border} group relative overflow-hidden flex flex-col justify-between h-full`}
                  >
                    <div>
                      <h3 className={`font-heading text-lg sm:text-xl font-bold leading-tight ${theme.text} mb-3`}>
                        <Link href={`/programmes/${rp.slug}`}>
                          <span className="absolute inset-0 z-20" aria-hidden="true" />
                          {rp.title}
                        </Link>
                      </h3>
                      
                      <div className={`w-full h-px ${theme.divider} mb-4`} />
                      
                      <p className={`text-sm ${theme.text} opacity-80 mb-6 line-clamp-2`}>
                        {rp.shortDescription}
                      </p>
                    </div>

                    <div className={`flex items-center font-semibold text-sm ${theme.accent} ${theme.hover} transition-colors mt-auto`}>
                      View Details <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
