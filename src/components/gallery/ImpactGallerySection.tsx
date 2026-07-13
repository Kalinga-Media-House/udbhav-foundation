"use client";

import React, { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Calendar,
  Clock,
  FolderOpen,
  Camera,
  RefreshCw,
} from "lucide-react";
import { Container } from "@/components/shared/Container";
import {
  ALL_GALLERY_PHOTOS,
  INDEX_PROGRAMMES,
  filterAndSortGalleryPhotos,
  SortOption,
} from "@/data/gallery-data";
import { GalleryPhoto } from "@/types/gallery";
import { GalleryLightboxModal } from "./GalleryLightboxModal";

export function ImpactGallerySection() {
  const [selectedProgrammeSlug, setSelectedProgrammeSlug] =
    useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [visibleCount, setVisibleCount] = useState<number>(16);

  // Lightbox modal state
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  // Filter and sort gallery photos
  const filteredPhotos = useMemo(() => {
    return filterAndSortGalleryPhotos(
      ALL_GALLERY_PHOTOS,
      selectedProgrammeSlug,
      searchQuery,
      sortOption
    );
  }, [selectedProgrammeSlug, searchQuery, sortOption]);

  const displayedPhotos = useMemo(() => {
    return filteredPhotos.slice(0, visibleCount);
  }, [filteredPhotos, visibleCount]);

  const handleProgrammeChange = useCallback((slug: string) => {
    setSelectedProgrammeSlug(slug);
    setVisibleCount(16);
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
      setVisibleCount(16);
    },
    []
  );

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSortOption(e.target.value as SortOption);
      setVisibleCount(16);
    },
    []
  );

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + 12);
  }, []);

  const handlePhotoClick = useCallback(
    (photoId: string) => {
      const idx = filteredPhotos.findIndex((p) => p.id === photoId);
      if (idx >= 0) {
        setLightboxIndex(idx);
        setLightboxOpen(true);
      }
    },
    [filteredPhotos]
  );

  const filterTabs = useMemo(() => {
    return [
      { slug: "all", title: "All Programmes" },
      ...INDEX_PROGRAMMES.map((p) => ({
        slug: p.slug,
        title: p.title,
      })),
    ];
  }, []);

  const getAspectClass = (ratio: GalleryPhoto["aspectRatio"]) => {
    switch (ratio) {
      case "portrait":
        return "aspect-[3/4]";
      case "square":
        return "aspect-square";
      case "landscape":
      default:
        return "aspect-[4/3]";
    }
  };

  return (
    <section
      id="impact-gallery-grid"
      aria-labelledby="gallery-section-heading"
      className="w-full py-10 sm:py-14 md:py-18 bg-[#FDFCF8]"
    >
      <Container>
        {/* Programme Filter Tabs — Horizontally Scrollable Pills */}
        <div className="mb-6 sm:mb-8">
          <div
            role="tablist"
            aria-label="Filter photos by UDBHAV Foundation programme"
            className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto scrollbar-none pb-2 select-none"
            style={{
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
            }}
          >
            {filterTabs.map((tab) => {
              const isActive = selectedProgrammeSlug === tab.slug;
              return (
                <button
                  key={tab.slug}
                  role="tab"
                  aria-selected={isActive}
                  type="button"
                  onClick={() => handleProgrammeChange(tab.slug)}
                  className={`inline-flex items-center whitespace-nowrap px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-heading text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0 cursor-pointer ${
                    isActive
                      ? "text-white shadow-md scale-[1.02]"
                      : "bg-pure-white text-[#12245F] border border-[#439B25]/25 hover:border-[#439B25] hover:bg-[#EEF8E9]/50"
                  }`}
                  style={{
                    background: isActive ? "#439B25" : undefined,
                  }}
                >
                  {tab.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search and Sort Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-pure-white border border-[#12245F]/10 shadow-sm mb-8 sm:mb-10">
          {/* Search Input */}
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#5E6B63]" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search photos, events, programmes or locations…"
              aria-label="Search photos, events, programmes or locations"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FDFCF8] border border-[#12245F]/15 text-sm font-medium text-[#17231D] placeholder:text-[#5E6B63]/70 focus:outline-none focus:border-[#439B25] transition-colors"
            />
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-3 sm:shrink-0 justify-end">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#5E6B63]">
              <SlidersHorizontal className="w-4 h-4 text-[#439B25]" />
              <span>Sort:</span>
            </div>
            <select
              value={sortOption}
              onChange={handleSortChange}
              aria-label="Sort photos"
              className="px-3.5 py-2 rounded-xl bg-[#FDFCF8] border border-[#12245F]/15 text-xs sm:text-sm font-semibold text-[#12245F] focus:outline-none focus:border-[#439B25] cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="recently-added">Recently Added</option>
              <option value="event-name-az">Event Name A–Z</option>
            </select>
          </div>
        </div>

        {/* Dynamic Masonry-Style Photo Gallery */}
        {filteredPhotos.length === 0 ? (
          /* Empty State */
          <div className="w-full py-16 sm:py-20 rounded-3xl bg-pure-white border border-[#12245F]/10 text-center px-4">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#EEF8E9] flex items-center justify-center text-[#439B25]">
              <Camera className="w-7 h-7" />
            </div>
            <h3
              className="font-heading text-xl sm:text-2xl font-bold mb-2"
              style={{ color: "#12245F" }}
            >
              No photos are available for this programme yet.
            </h3>
            <p
              className="text-sm sm:text-base max-w-md mx-auto mb-6"
              style={{ color: "#5E6B63" }}
            >
              Photos from UDBHAV Foundation programmes and community initiatives
              will appear here as events are published.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedProgrammeSlug("all");
                setSearchQuery("");
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-heading text-sm font-semibold text-white bg-[#439B25] hover:bg-[#38841F] transition-all shadow-sm cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              View All Photos
            </button>
          </div>
        ) : (
          <>
            {/* Masonry Columns */}
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6">
              {displayedPhotos.map((photo) => {
                return (
                  <div
                    key={photo.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`View photo details: ${photo.title}`}
                    onClick={() => handlePhotoClick(photo.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handlePhotoClick(photo.id);
                      }
                    }}
                    className={`break-inside-avoid mb-4 sm:mb-6 rounded-2xl overflow-hidden relative group border border-[#12245F]/10 bg-pure-white shadow-sm transition-all duration-300 hover:shadow-xl cursor-pointer ${getAspectClass(
                      photo.aspectRatio
                    )}`}
                  >
                    {/* Responsive Next.js Image */}
                    <Image
                      src={photo.imageUrl}
                      alt={photo.altText}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    />

                    {/* Mobile Compact Always-Visible Badge */}
                    <div className="absolute top-3 left-3 z-10 lg:hidden">
                      <span
                        className="inline-block px-2.5 py-1 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider shadow-sm"
                        style={{ background: "#439B25", color: "#FFFFFF" }}
                      >
                        {photo.programme.title}
                      </span>
                    </div>

                    {/* Rich Information Overlay (Bottom-up dark gradient) */}
                    <div className="absolute inset-0 z-20 flex flex-col justify-end p-4 sm:p-5 bg-gradient-to-t from-[#12245F]/95 via-[#12245F]/65 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      {/* Programme Badge */}
                      <div className="mb-2">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-heading font-bold uppercase tracking-wider"
                          style={{ background: "#439B25", color: "#FFFFFF" }}
                        >
                          <FolderOpen className="w-3 h-3" />
                          {photo.programme.title}
                        </span>
                      </div>

                      {/* Photo Title */}
                      <h3 className="font-heading text-sm sm:text-base font-bold text-white leading-snug mb-2">
                        {photo.title}
                      </h3>

                      {/* Location & Date */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/90">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#439B25]" />
                          {photo.event.location}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#439B25]" />
                          {photo.event.eventDate}
                        </span>
                        {photo.event.startTime && (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#439B25]" />
                            {photo.event.startTime}
                          </span>
                        )}
                      </div>

                      <div className="mt-2 pt-2 border-t border-white/15 text-[11px] text-white/75 font-medium truncate">
                        From: {photo.event.title}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Status & Load More Button */}
            <div className="mt-10 sm:mt-14 flex flex-col items-center justify-center gap-3">
              <span className="text-xs sm:text-sm font-medium text-[#5E6B63]">
                Showing {displayedPhotos.length} of {filteredPhotos.length}{" "}
                photos
              </span>

              {displayedPhotos.length < filteredPhotos.length && (
                <button
                  type="button"
                  onClick={handleLoadMore}
                  className="px-7 py-3 rounded-xl font-heading text-sm sm:text-base font-semibold text-white transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
                  style={{ background: "#439B25" }}
                >
                  Load More Photos
                </button>
              )}
            </div>
          </>
        )}
      </Container>

      {/* Accessible Full-Screen Photo Details Lightbox Modal */}
      <GalleryLightboxModal
        photos={filteredPhotos}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
      />
    </section>
  );
}

export default ImpactGallerySection;
