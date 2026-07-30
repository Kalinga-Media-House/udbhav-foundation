'use client';

import {
  ArrowRight,
  BookOpen,
  Calendar,
  FolderOpen,
  MapPin,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import React, { useState, useMemo } from 'react';

import { AnimatedCardWrapper } from '@/components/shared/AnimatedCardWrapper';
import { Container } from '@/components/shared/Container';
import { LazyImage } from '@/components/shared/LazyImage';
import { NEWS_POSTS } from '@/data/news-data';
import type { ArticleWithMedia } from '@/features/news/repository';
import { NewsCategory, NewsPostItem } from '@/types/news';

const CATEGORIES: ('All' | NewsCategory)[] = [
  'All',
  'Daily Updates',
  'Programme Activities',
  'Announcements',
  'Achievements',
  'Community Stories',
  'Media Coverage',
];

interface LatestUpdatesSectionProps {
  articles?: ArticleWithMedia[];
}

export function LatestUpdatesSection({ articles }: LatestUpdatesSectionProps = {}) {
  const [selectedCategory, setSelectedCategory] = useState<'All' | NewsCategory>('All');
  const [activeCategory, setActiveCategory] = useState<'All' | NewsCategory>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSearch, setActiveSearch] = useState<string>('');
  const [sortOption, setSortOption] = useState<'latest' | 'oldest' | 'featured' | 'viewed'>(
    'latest'
  );
  const [activeSort, setActiveSort] = useState<'latest' | 'oldest' | 'featured' | 'viewed'>(
    'latest'
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  React.useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  const sourcePosts: NewsPostItem[] = useMemo(() => {
    if (articles && articles.length > 0) {
      return articles.map((a) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        excerpt: a.summary || a.subtitle || '',
        content: a.content,
        coverImageUrl: a.cover_image?.cdn_url || '/images/default-news-cover.jpg',
        category: a.category || 'Daily Updates',
        location: 'Odisha, India',
        activityDate: a.published_at
          ? new Date(a.published_at).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
          : new Date(a.created_at).toLocaleDateString('en-IN'),
        activityTime: '',
        publishedAt: a.published_at || a.created_at,
        readingTime: `${a.reading_time || 1} min read`,
        author: a.author_name || 'UDBHAV Foundation',
        isFeatured: a.is_featured,
      }));
    }
    return NEWS_POSTS;
  }, [articles]);

  const filteredPosts = useMemo(() => {
    let list = [...sourcePosts];

    if (activeCategory !== 'All') {
      list = list.filter((p) => p.category === activeCategory);
    }

    if (activeSearch.trim() !== '') {
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
      if (activeSort === 'featured') {
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      } else if (activeSort === 'oldest') {
        return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
      } else {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
    });

    return list;
  }, [sourcePosts, activeCategory, activeSearch, activeSort]);

  const handleFilterChange = (
    newCategory: 'All' | NewsCategory,
    newSearch: string,
    newSort: 'latest' | 'oldest' | 'featured' | 'viewed'
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
      className="border-soft-border/40 w-full border-b bg-[#FDFCF8] py-12 sm:py-16 md:py-20"
    >
      <Container>
        {/* Section Header */}
        <div
          className={`ease-[cubic-bezier(0.22,1,0.36,1)] mb-8 max-w-3xl transition-all duration-500 sm:mb-10 ${
            isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
          }`}
        >
          <span
            className="eyebrow-label mb-3 inline-block rounded-full border border-[#439B25]/25 bg-[#EEF8E9] px-3 py-1 font-heading text-xs font-bold uppercase tracking-widest sm:text-sm"
            style={{ color: '#439B25' }}
          >
            LATEST UPDATES
          </span>
          <h2
            id="latest-updates-heading"
            className="font-heading text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl"
            style={{ color: '#12245F' }}
          >
            News, Activities & Community Updates
          </h2>
          <p className="mt-2 text-sm sm:text-base" style={{ color: '#5E6B63' }}>
            Follow our daily programmes, field activities, announcements, achievements, and moments
            of community impact.
          </p>
        </div>

        {/* Category Filters */}
        <div
          className={`ease-[cubic-bezier(0.22,1,0.36,1)] mb-6 transition-all delay-100 duration-500 ${
            isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
          }`}
        >
          <div
            role="tablist"
            aria-label="Filter news and updates by category"
            className="scrollbar-none flex select-none items-center gap-2 overflow-x-auto pb-2"
            style={{
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
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
                  className={`inline-flex shrink-0 cursor-pointer items-center whitespace-nowrap rounded-full px-4 py-2 font-heading text-xs font-semibold transition-all duration-200 sm:px-5 sm:py-2.5 sm:text-sm ${
                    isActive
                      ? 'scale-[1.02] text-white shadow-md'
                      : 'bg-pure-white border border-[#439B25]/25 text-[#12245F] hover:border-[#439B25] hover:bg-[#EEF8E9]/50'
                  }`}
                  style={{
                    background: isActive ? '#439B25' : undefined,
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
          className={`bg-pure-white ease-[cubic-bezier(0.22,1,0.36,1)] mb-8 flex flex-col items-stretch justify-between gap-4 rounded-2xl border border-[#12245F]/10 p-4 shadow-sm transition-all delay-200 duration-500 sm:mb-10 sm:flex-row sm:items-center ${
            isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
          }`}
        >
          {/* Search Input */}
          <div className="relative max-w-xl flex-1">
            <Search className="w-4.5 h-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5E6B63]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleFilterChange(selectedCategory, searchQuery, sortOption);
                }
              }}
              onBlur={() => handleFilterChange(selectedCategory, searchQuery, sortOption)}
              placeholder="Search news, programmes, stories or locations…"
              aria-label="Search news, programmes, stories or locations"
              className="w-full rounded-xl border border-[#12245F]/15 bg-[#FDFCF8] py-2.5 pl-10 pr-4 text-sm font-medium text-[#17231D] transition-colors placeholder:text-[#5E6B63]/70 focus:border-[#439B25] focus:outline-none"
            />
          </div>

          {/* Sort Controls */}
          <div className="flex items-center justify-end gap-3 sm:shrink-0">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-[#5E6B63] sm:text-sm">
              <SlidersHorizontal className="h-4 w-4 text-[#439B25]" />
              <span>Sort:</span>
            </div>
            <select
              value={sortOption}
              onChange={(e) =>
                handleFilterChange(
                  selectedCategory,
                  searchQuery,
                  e.target.value as 'latest' | 'oldest' | 'featured' | 'viewed'
                )
              }
              aria-label="Sort updates"
              className="cursor-pointer rounded-xl border border-[#12245F]/15 bg-[#FDFCF8] px-3.5 py-2 text-xs font-semibold text-[#12245F] focus:border-[#439B25] focus:outline-none sm:text-sm"
            >
              <option value="latest">Latest First</option>
              <option value="featured">Featured First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* News Grid */}
        <div
          className={`ease-[cubic-bezier(0.22,1,0.36,1)] transition-all duration-300 ${
            isTransitioning ? 'scale-[0.98] opacity-0' : 'scale-100 opacity-100'
          }`}
        >
          {filteredPosts.length === 0 ? (
            <div className="bg-pure-white w-full rounded-3xl border border-[#12245F]/10 px-4 py-16 text-center">
              <BookOpen className="mx-auto mb-3 h-12 w-12 text-[#439B25]" />
              <h3 className="font-heading text-xl font-bold text-[#12245F]">
                No updates match your selected filter.
              </h3>
              <p className="mt-1 text-sm text-[#5E6B63]">
                Try clearing your search query or switching to &ldquo;All&rdquo; categories.
              </p>
              <button
                type="button"
                onClick={() => handleFilterChange('All', '', 'latest')}
                className="mt-4 cursor-pointer rounded-xl bg-[#439B25] px-6 py-2.5 font-heading text-sm font-semibold text-white transition-colors hover:bg-[#38841F]"
              >
                Show All Updates
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredPosts.map((post, index) => {
                return (
                  <AnimatedCardWrapper
                    key={`${activeCategory}-${activeSort}-${post.id}`}
                    index={index}
                    href={`/news-and-stories/${post.slug}`}
                    className="flex transform flex-col overflow-hidden rounded-[14px] border border-gray-100 bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.08)]"
                  >
                    {/* Image Header */}
                    <div className="relative h-36 w-full overflow-hidden bg-gray-50 sm:h-40">
                      <LazyImage
                        src={post.coverImageUrl}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        priority={index < 4}
                      />

                      {/* Category Badge */}
                      <div className="absolute left-2.5 top-2.5 z-10">
                        <span className="rounded bg-black/60 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-white backdrop-blur-md">
                          {post.category}
                        </span>
                      </div>

                      {/* Programme Badge */}
                      {post.programmeTitle && (
                        <div className="absolute bottom-2.5 left-2.5 z-10">
                          <span className="inline-flex items-center gap-1 rounded bg-[#439B25]/90 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-white backdrop-blur-md">
                            <FolderOpen className="h-2.5 w-2.5" />
                            {post.programmeTitle}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4">
                      <div>
                        {/* Meta Date & Reading Time */}
                        <div className="mb-2 flex items-center justify-between text-[11px] font-medium text-gray-400">
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar className="h-3 w-3" />
                            {post.activityDate}
                          </span>
                          <span>{post.readingTime}</span>
                        </div>

                        {/* Title */}
                        <h3 className="mb-1.5 line-clamp-2 font-heading text-[15px] font-bold leading-snug text-[#12245F] transition-colors group-hover:text-[#439B25] sm:text-base">
                          {post.title}
                        </h3>

                        {/* Short Description (2 lines clamp) */}
                        <p className="mb-4 line-clamp-2 text-[12px] leading-relaxed text-gray-500 sm:text-[13px]">
                          {post.excerpt}
                        </p>
                      </div>

                      {/* Footer Info */}
                      <div className="flex items-center justify-between border-t border-gray-50 pt-3 text-[11px]">
                        <div className="flex max-w-[65%] items-center gap-1.5 truncate font-medium text-gray-500">
                          <MapPin className="h-3 w-3 shrink-0 text-gray-400" />
                          <span className="truncate">{post.location}</span>
                        </div>

                        <span className="inline-flex items-center gap-1 font-heading font-bold text-[#439B25] transition-transform group-hover:translate-x-1">
                          Read Story
                          <ArrowRight className="h-3 w-3" />
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
