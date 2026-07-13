"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Calendar, FolderOpen, MapPin, Search, SlidersHorizontal } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { LazyImage } from "@/components/shared/LazyImage";
import { AnimatedCardWrapper } from "@/components/shared/AnimatedCardWrapper";
import { NEWS_POSTS } from "@/data/news-data";
import { NewsCategory } from "@/types/news";

const CATEGORIES: ("All" | NewsCategory)[] = [
  "All",
  "Daily Updates",
  "Programme Activities",
  "Announcements",
  "Achievements",
  "Community Stories",
  "Media Coverage",
];

export function LatestUpdatesSection() {
  const [selectedCategory, setSelectedCategory] = useState<"All" | NewsCategory>("All");
  const [activeCategory, setActiveCategory] = useState<"All" | NewsCategory>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeSearch, setActiveSearch] = useState<string>("");
  const [sortOption, setSortOption] = useState<"latest" | "oldest" | "featured" | "viewed">("latest");
  const [activeSort, setActiveSort] = useState<"latest" | "oldest" | "featured" | "viewed">("latest");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  React.useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  const filteredPosts = useMemo(() => {
    let list = [...NEWS_POSTS];

    if (activeCategory !== "All") {
      list = list.filter((p) => p.category === activeCategory);
    }

    if (activeSearch.trim() !== "") {
      const q = activeSearch.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          (p.programmeTitle && p.programmeTitle.toLowerCase().includes(q))
      );
    }

    list.sort((a, b) => {
      if (activeSort === "featured") {
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      } else if (activeSort === "oldest") {
        return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
      } else {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
    });

    return list;
  }, [activeCategory, activeSearch, activeSort]);

  const handleFilterChange = (
    newCategory: "All" | NewsCategory,
    newSearch: string,
    newSort: "latest" | "oldest" | "featured" | "viewed"
  ) => {
    if (isTransitioning) return;
    
    setSelectedCategory(newCategory);
    setSearchQuery(newSearch);
    setSortOption(newSort);
    setIsTransitioning(true);
    
    setTimeout(() => {
      setActiveCategory(newCategory);
      setActiveSearch(newSearch);
      setActiveSort(newSort);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <section
      id="latest-updates"
      aria-labelledby="latest-updates-heading"
      className="w-full py-12 sm:py-16 md:py-20 bg-[#FDFCF8] border-b border-soft-border/40"
    >
      <Container>
        {/* Section Header */}
        <div 
          className={`max-w-3xl mb-8 sm:mb-10 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          <span
            className="eyebrow-label font-heading text-xs sm:text-sm font-bold tracking-widest uppercase inline-block px-3 py-1 rounded-full bg-[#EEF8E9] border border-[#439B25]/25 mb-3"
            style={{ color: "#439B25" }}
          >
            LATEST UPDATES
          </span>
          <h2
            id="latest-updates-heading"
            className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight"
            style={{ color: "#12245F" }}
          >
            News, Activities & Community Updates
          </h2>
          <p
            className="text-sm sm:text-base mt-2"
            style={{ color: "#5E6B63" }}
          >
            Follow our daily programmes, field activities, announcements,
            achievements, and moments of community impact.
          </p>
        </div>

        {/* Category Filters */}
        <div 
          className={`mb-6 transition-all duration-500 delay-100 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          <div
            role="tablist"
            aria-label="Filter news and updates by category"
            className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 select-none"
            style={{
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
            }}
          >
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={isActive}
                  type="button"
                  onClick={() => handleFilterChange(cat, searchQuery, sortOption)}
                  className={`inline-flex items-center whitespace-nowrap px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-heading text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0 cursor-pointer ${
                    isActive
                      ? "text-white shadow-md scale-[1.02]"
                      : "bg-pure-white text-[#12245F] border border-[#439B25]/25 hover:border-[#439B25] hover:bg-[#EEF8E9]/50"
                  }`}
                  style={{
                    background: isActive ? "#439B25" : undefined,
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search and Sort Toolbar */}
        <div 
          className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-pure-white border border-[#12245F]/10 shadow-sm mb-8 sm:mb-10 transition-all duration-500 delay-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          {/* Search Input */}
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#5E6B63]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleFilterChange(selectedCategory, searchQuery, sortOption);
                }
              }}
              onBlur={() => handleFilterChange(selectedCategory, searchQuery, sortOption)}
              placeholder="Search news, programmes, stories or locations…"
              aria-label="Search news, programmes, stories or locations"
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
              onChange={(e) =>
                handleFilterChange(
                  selectedCategory,
                  searchQuery,
                  e.target.value as "latest" | "oldest" | "featured" | "viewed"
                )
              }
              aria-label="Sort updates"
              className="px-3.5 py-2 rounded-xl bg-[#FDFCF8] border border-[#12245F]/15 text-xs sm:text-sm font-semibold text-[#12245F] focus:outline-none focus:border-[#439B25] cursor-pointer"
            >
              <option value="latest">Latest First</option>
              <option value="featured">Featured First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* News Grid */}
        <div 
          className={`transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isTransitioning ? "opacity-0 scale-[0.98]" : "opacity-100 scale-100"
          }`}
        >
          {filteredPosts.length === 0 ? (
            <div className="w-full py-16 rounded-3xl bg-pure-white border border-[#12245F]/10 text-center px-4">
              <BookOpen className="w-12 h-12 text-[#439B25] mx-auto mb-3" />
              <h3 className="font-heading text-xl font-bold text-[#12245F]">
                No updates match your selected filter.
              </h3>
              <p className="text-sm text-[#5E6B63] mt-1">
                Try clearing your search query or switching to &ldquo;All&rdquo;
                categories.
              </p>
              <button
                type="button"
                onClick={() => handleFilterChange("All", "", "latest")}
                className="mt-4 px-6 py-2.5 rounded-xl font-heading text-sm font-semibold text-white bg-[#439B25] hover:bg-[#38841F] transition-colors cursor-pointer"
              >
                Show All Updates
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPosts.map((post, index) => {
                return (
                  <AnimatedCardWrapper
                    key={`${activeCategory}-${activeSort}-${post.id}`}
                    index={index}
                    href={`/news-and-stories/${post.slug}`}
                    className="flex flex-col rounded-2xl bg-pure-white border border-[#12245F]/10 overflow-hidden"
                  >
                    {/* Image Header */}
                    <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-[#EAF3FF]">
                      <LazyImage
                        src={post.coverImageUrl}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-[1.025]"
                        priority={index < 4}
                      />

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="px-3 py-1 rounded-full text-[11px] font-heading font-bold uppercase tracking-wider bg-[#12245F]/90 text-white backdrop-blur-sm shadow-sm">
                          {post.category}
                        </span>
                      </div>

                      {/* Programme Badge */}
                      {post.programmeTitle && (
                        <div className="absolute bottom-3 left-3 z-10">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-heading font-bold uppercase tracking-wider bg-[#439B25] text-white shadow-sm">
                            <FolderOpen className="w-3 h-3" />
                            {post.programmeTitle}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Meta Date & Reading Time */}
                        <div className="flex items-center justify-between text-xs font-medium text-[#5E6B63] mb-2.5">
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#439B25]" />
                            {post.activityDate}
                          </span>
                          <span>{post.readingTime}</span>
                        </div>

                        {/* Title */}
                        <h3 className="font-heading text-base sm:text-lg font-bold text-[#12245F] leading-snug mb-2 group-hover:text-[#439B25] transition-colors">
                          {post.title}
                        </h3>

                        {/* Short Description (3 lines clamp) */}
                        <p className="text-xs sm:text-sm text-[#5E6B63] leading-relaxed line-clamp-3 mb-4">
                          {post.excerpt}
                        </p>
                      </div>

                      {/* Footer Info */}
                      <div className="pt-3 border-t border-soft-border/40 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-[#17231D] font-medium truncate max-w-[65%]">
                          <MapPin className="w-3.5 h-3.5 text-[#439B25] shrink-0" />
                          <span className="truncate">{post.location}</span>
                        </div>

                        <span className="font-heading font-bold text-[#439B25] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                          Read Full Story
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </AnimatedCardWrapper>
                );
              })}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

export default LatestUpdatesSection;
