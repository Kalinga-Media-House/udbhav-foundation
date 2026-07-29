'use client';

import { motion } from 'framer-motion';
import { Search, ArrowUpRight, Calendar, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

import type { IndexInitiativeWithMedia } from '@/features/index/repository';

interface IndexArchiveClientProps {
  initiatives: IndexInitiativeWithMedia[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  searchQuery: string;
  selectedYear: string;
  selectedType: string;
  selectedSort: string;
}

export function IndexArchiveClient({
  initiatives,
  totalPages,
  currentPage,
  searchQuery,
  selectedYear,
  selectedType,
  selectedSort,
}: IndexArchiveClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local state for fast typing in search
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset to page 1 when filters change
    if (key !== 'page') {
      params.delete('page');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters('search', localSearch.trim() || null);
  };

  // Common options (could be passed from server if dynamic)
  const availableYears = ['2026', '2025', '2024', '2023', '2022', '2021'];
  const availableTypes = [
    'Education',
    'Health',
    'Environment',
    'Blood Donation',
    'Awareness Campaign',
    'Community Support',
    'Women Empowerment',
    'Youth Development',
  ];

  return (
    <div className="w-full bg-[#FCFCF8] pb-24">
      {/* Minimal Floating Search Bar */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-7 relative z-20 mb-14">
        <form
          onSubmit={handleSearchSubmit}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-3"
        >
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search initiatives by title..."
              className="w-full pl-11 pr-4 py-2 text-sm text-gray-800 placeholder-gray-400 bg-gray-50/70 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#439B25]/20 transition-all font-sans"
            />
            <button type="submit" className="hidden">
              Submit
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedYear}
              onChange={(e) => updateFilters('year', e.target.value)}
              aria-label="Filter by Year"
              className="text-xs sm:text-sm font-medium text-gray-700 bg-gray-50/80 hover:bg-gray-100 border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#439B25]/20 transition-all cursor-pointer"
            >
              <option value="all">All Years</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => updateFilters('category', e.target.value)}
              aria-label="Filter by Category"
              className="text-xs sm:text-sm font-medium text-gray-700 bg-gray-50/80 hover:bg-gray-100 border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#439B25]/20 transition-all cursor-pointer"
            >
              <option value="all">All Categories</option>
              {availableTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <select
              value={selectedSort}
              onChange={(e) => updateFilters('sort', e.target.value)}
              aria-label="Sort by"
              className="text-xs sm:text-sm font-medium text-gray-700 bg-gray-50/80 hover:bg-gray-100 border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#439B25]/20 transition-all cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="featured">Featured</option>
              <option value="alphabetical">A-Z</option>
            </select>
          </div>
        </form>
      </div>

      {/* Programs & Initiatives Magazine Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {initiatives.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 px-4 max-w-md mx-auto"
          >
            <p className="text-lg font-serif text-gray-800 mb-1">No initiatives matched your search.</p>
            <p className="text-sm text-gray-500 font-sans">
              Try adjusting your filters or search terms.
            </p>
            <button
              type="button"
              onClick={() => {
                setLocalSearch('');
                router.push(pathname);
              }}
              className="mt-6 inline-flex items-center px-4 py-2 text-xs font-semibold text-[#439B25] bg-[#439B25]/10 rounded-full hover:bg-[#439B25]/20 transition-all"
            >
              Reset Filters
            </button>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {initiatives.map((item, idx) => {
                const coverUrl = item.cover_image_url || '/hero/hero-01.png';
                const displayDate = item.year.toString();
                return (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.03 }}
                    className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300"
                  >
                    <Link href={`/index/${item.slug}`} className="flex flex-col h-full focus:outline-none focus:ring-2 focus:ring-[#439B25]">
                      {/* 16:9 Cover Image */}
                      <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
                        <Image
                          src={coverUrl}
                          alt={item.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="inline-block px-2.5 py-1 text-[11px] font-semibold text-white bg-black/60 backdrop-blur-sm rounded-full">
                            {item.initiative_type}
                          </span>
                        </div>
                      </div>

                      {/* Editorial Card Content */}
                      <div className="p-5 flex flex-col flex-1 justify-between">
                        <div>
                          {/* Date and Location Metadata */}
                          <div className="flex items-center gap-3 text-[11px] font-medium text-gray-500 mb-2">
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-[#439B25]" />
                              {displayDate}
                            </span>
                            {item.location && (
                              <span className="inline-flex items-center gap-1 line-clamp-1">
                                <MapPin className="w-3 h-3 text-[#439B25]" />
                                {item.location}
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <h2 className="text-base sm:text-lg font-serif font-bold text-gray-900 group-hover:text-[#439B25] transition-colors line-clamp-2 leading-snug mb-2">
                            {item.title}
                          </h2>

                          {/* One-Line Summary */}
                          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
                            {item.short_summary}
                          </p>
                        </div>

                        {/* View Details CTA with Arrow Animation */}
                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-xs font-semibold text-[#439B25] group-hover:underline">
                            View Details
                          </span>
                          <ArrowUpRight className="w-4 h-4 text-[#439B25] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                );
              })}
            </div>

            {/* Traditional Pagination UI */}
            {totalPages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => updateFilters('page', String(currentPage - 1))}
                  disabled={currentPage <= 1}
                  className="p-2 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-800 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => updateFilters('page', String(pageNum))}
                    className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                      currentPage === pageNum
                        ? 'bg-[#439B25] text-white'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => updateFilters('page', String(currentPage + 1))}
                  disabled={currentPage >= totalPages}
                  className="p-2 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-800 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
