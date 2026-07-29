"use client";

import {
  ArrowLeft,
  ArrowRight,
  HeartHandshake,
  Camera,
  Calendar,
  MapPin,
  TrendingUp,
  Target,
  Users,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useMemo } from "react";

import { AccessibleLightbox } from "@/components/index-page/AccessibleLightbox";
import {
  IndexProgrammeDetail,
  ProgrammeEventItem,
  ProgrammePhotoItem,
} from "@/types/index-programme";

interface ProgrammeDetailViewProps {
  programme: IndexProgrammeDetail;
  events: ProgrammeEventItem[];
  photos: ProgrammePhotoItem[];
  relatedProgrammes: IndexProgrammeDetail[];
}

export function ProgrammeDetailView({
  programme,
  events,
  photos,
  relatedProgrammes,
}: ProgrammeDetailViewProps) {
  const [eventFilter, setEventFilter] = useState<"all" | "upcoming" | "completed">("all");
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);

  const filteredEvents = useMemo(() => {
    const sorted = [...events].sort((a, b) =>
      b.eventDate.localeCompare(a.eventDate)
    );
    if (eventFilter === "all") return sorted;
    return sorted.filter((e) => e.status === eventFilter);
  }, [events, eventFilter]);

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

  return (
    <div className="bg-[#FCFCF8]">
      {/* A. PROGRAMME HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#172B6B] via-[#101F55] to-[#12245F] text-white py-12 sm:py-16 md:py-20 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-6">
            <Link
              href="/programmes"
              className="inline-flex items-center gap-2 text-sm font-heading font-semibold text-white/80 hover:text-[#439B25] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Programmes & Initiatives Index
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Info */}
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3.5 py-1 rounded-full text-xs font-heading font-bold uppercase bg-[#439B25] text-white">
                  Programme {programme.programmeNumber}
                </span>
                <span className="px-3.5 py-1 rounded-full text-xs font-heading font-semibold bg-white/15 text-white/90">
                  {programme.category}
                </span>
                {programme.partnerText && (
                  <span className="text-xs font-medium text-[#EAF3FF]/80">
                    {programme.partnerText}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-white leading-tight mb-3">
                {programme.title}
              </h1>

              <p className="text-sm sm:text-base font-semibold text-[#439B25] uppercase tracking-wide mb-6">
                {programme.tagline}
              </p>

              <p className="text-base sm:text-lg text-white/85 leading-relaxed mb-8 max-w-2xl">
                {programme.fullDescription}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/volunteers"
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-heading font-semibold text-sm sm:text-base text-white bg-[#439B25] hover:bg-[#348a1e] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  <HeartHandshake className="w-5 h-5" />
                  Become a Volunteer
                </Link>

                <button
                  type="button"
                  onClick={scrollToGallery}
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-heading font-semibold text-sm sm:text-base text-white bg-white/15 hover:bg-white/25 border border-white/20 transition-all cursor-pointer"
                >
                  <Camera className="w-5 h-5 text-[#439B25]" />
                  View Programme Gallery
                </button>
              </div>
            </div>

            {/* Right Hero Cover Photo & Impact Badge */}
            <div className="lg:col-span-5">
              <div className="relative h-72 sm:h-96 rounded-3xl overflow-hidden bg-black/40 border border-white/15 shadow-2xl">
                <Image
                  src={programme.coverImageUrl}
                  alt={programme.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 450px"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between p-4 rounded-2xl bg-black/60 border border-white/15 backdrop-blur-md">
                  <div>
                    <span className="text-xs text-[#439B25] font-bold uppercase tracking-wider block">
                      Primary Outcome
                    </span>
                    <span className="text-base sm:text-lg font-heading font-bold text-white">
                      {programme.impactPreview}
                    </span>
                  </div>
                  <TrendingUp className="w-6 h-6 text-[#439B25]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* B. ABOUT THE PROGRAMME */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3C9D23]/15 text-[#3C9D23] text-xs font-heading font-bold uppercase tracking-wider mb-3">
            ABOUT THIS INITIATIVE
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#172B6B]">
            Purpose, Need & Grassroots Approach
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-gray-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#EAF3FF] text-[#172B6B] flex items-center justify-center mb-4">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-lg text-[#172B6B] mb-2">
              Programme Purpose
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {programme.purpose}
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-gray-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#F1F9ED] text-[#3C9D23] flex items-center justify-center mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-lg text-[#172B6B] mb-2">
              Community Need Addressed
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {programme.communityNeed}
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-gray-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#EAF3FF] text-[#172B6B] flex items-center justify-center mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-lg text-[#172B6B] mb-2">
              Programme Approach
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {programme.approach}
            </p>
          </div>
        </div>

        {/* Beneficiaries & Activities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#EAF3FF]/60 border border-[#172B6B]/15">
            <h4 className="font-heading font-bold text-base sm:text-lg text-[#172B6B] mb-4">
              Target Beneficiaries
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-700">
              {programme.targetBeneficiaries.map((b, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#3C9D23] mt-1.5 shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-[#F1F9ED] border border-[#3C9D23]/25">
            <h4 className="font-heading font-bold text-base sm:text-lg text-[#172B6B] mb-4">
              Major Activities Conducted
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-700">
              {programme.majorActivities.map((act, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#172B6B] mt-1.5 shrink-0" />
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* C. PROGRAMME IMPACT */}
      <section className="py-14 sm:py-16 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3C9D23]/15 text-[#3C9D23] text-xs font-heading font-bold uppercase tracking-wider mb-2">
              MEASURABLE OUTCOMES
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#172B6B]">
              Impact at a Glance
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {programme.impactStats.map((stat) => (
              <div
                key={stat.id}
                className="p-6 sm:p-8 rounded-2xl bg-[#EAF3FF] border border-[#172B6B]/10 flex flex-col justify-between"
              >
                <div className="text-3xl sm:text-4xl font-heading font-extrabold text-[#172B6B] mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-gray-700">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* D. PROGRAMME EVENTS AND ACTIVITIES */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3C9D23]/15 text-[#3C9D23] text-xs font-heading font-bold uppercase tracking-wider mb-2">
              ON-GROUND ACTION
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#172B6B]">
              Programme Activities
            </h2>
          </div>

          {/* Event Filter Tabs */}
          <div className="flex items-center gap-2">
            {(["all", "upcoming", "completed"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setEventFilter(tab)}
                className={`px-4 py-2 rounded-full text-xs font-heading font-semibold uppercase cursor-pointer transition-colors ${
                  eventFilter === tab
                    ? "bg-[#172B6B] text-white"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className="rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div className="relative h-48 w-full bg-gray-100">
                  <Image
                    src={evt.coverImageUrl}
                    alt={evt.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase text-white ${
                        evt.status === "upcoming"
                          ? "bg-[#3C9D23]"
                          : "bg-[#172B6B]"
                      }`}
                    >
                      {evt.status}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#3C9D23]" />
                        {evt.eventDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#3C9D23]" />
                        {evt.location}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-base text-[#172B6B] mb-2">
                      {evt.title}
                    </h3>

                    <p className="text-xs text-gray-600 leading-relaxed mb-4">
                      {evt.shortDescription}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs">
                    <span className="text-gray-500">
                      {evt.photoCount} Photos
                    </span>
                    <span className="font-semibold text-[#3C9D23]">
                      Verified Activity
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-white border border-dashed border-gray-300">
            <p className="text-sm sm:text-base font-medium text-gray-600">
              Programme activities will be published here soon.
            </p>
          </div>
        )}
      </section>

      {/* E. PROGRAMME PHOTO GALLERY */}
      <section
        id="gallery"
        className="py-16 sm:py-20 bg-[#FCFCF8] border-t border-gray-200 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3C9D23]/15 text-[#3C9D23] text-xs font-heading font-bold uppercase tracking-wider mb-2">
              COMMUNITY DOCUMENTATION
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#172B6B]">
              Moments From This Programme
            </h2>
          </div>

          {photos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {photos.map((photo, idx) => (
                <div
                  key={photo.id}
                  onClick={() => openLightbox(idx)}
                  className="group cursor-pointer rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="relative h-60 w-full overflow-hidden">
                    <Image
                      src={photo.thumbnailUrl}
                      alt={photo.altText}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Desktop Hover Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#172B6B]/90 via-[#172B6B]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                      <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#3C9D23] text-white w-fit mb-2">
                        {programme.title}
                      </span>
                      <h4 className="font-heading font-bold text-sm sm:text-base leading-snug mb-1">
                        {photo.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-white/80">
                        {photo.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#3C9D23]" />
                            {photo.location}
                          </span>
                        )}
                        {photo.photoDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#3C9D23]" />
                            {photo.photoDate}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Visible Metadata on Mobile / Below image */}
                  <div className="p-4 sm:hidden">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#3C9D23] text-white mb-1.5">
                      {programme.title}
                    </span>
                    <h4 className="font-heading font-bold text-sm text-[#172B6B]">
                      {photo.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-white border border-dashed border-gray-300">
              <p className="text-sm sm:text-base font-medium text-gray-600">
                Photo stories from this programme will appear here.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AccessibleLightbox
        photos={photos}
        initialIndex={selectedPhotoIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />

      {/* F. RELATED PROGRAMMES */}
      {relatedProgrammes.length > 0 && (
        <section className="py-16 sm:py-20 bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#172B6B] mb-8">
              You May Also Explore
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProgrammes.map((rp) => (
                <div
                  key={rp.id}
                  className="rounded-2xl bg-[#FCFCF8] border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <div className="relative h-44 w-full bg-gray-100">
                    <Image
                      src={rp.coverImageUrl}
                      alt={rp.title}
                      fill
                      sizes="33vw"
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-[#172B6B] text-white">
                        {rp.programmeNumber}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="font-heading font-bold text-base text-[#172B6B] mb-1">
                        {rp.title}
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-2 mb-4">
                        {rp.shortDescription}
                      </p>
                    </div>

                    <Link
                      href={`/programmes/${rp.slug}`}
                      className="inline-flex items-center justify-between w-full px-4 py-2 rounded-xl font-heading text-xs font-semibold text-[#172B6B] bg-[#EAF3FF] hover:bg-[#172B6B] hover:text-white transition-all"
                    >
                      <span>Explore Programme</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
