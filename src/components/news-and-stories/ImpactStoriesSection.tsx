'use client';

import { MapPin, Calendar, FolderOpen, ArrowRight, UserCheck } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { AnimatedCardWrapper } from '@/components/shared/AnimatedCardWrapper';
import { Container } from '@/components/shared/Container';
import { LazyImage } from '@/components/shared/LazyImage';
import { IMPACT_STORIES } from '@/data/news-data';
import type { ArticleWithMedia } from '@/features/news/repository';
import type { ImpactStoryItem } from '@/types/news';

interface ImpactStoriesSectionProps {
  articles?: ArticleWithMedia[];
}

export function ImpactStoriesSection({ articles }: ImpactStoriesSectionProps = {}) {
  const storiesFromDb = React.useMemo(() => {
    if (articles && articles.length > 0) {
      const storyArticles = articles.filter(
        (a) => a.category === 'Story' || a.category === 'Community Stories'
      );
      if (storyArticles.length > 0) {
        return storyArticles.map((a): ImpactStoryItem => ({
          id: a.id,
          title: a.title,
          slug: a.slug,
          excerpt: a.summary || a.subtitle || '',
          content: a.content,
          imageUrl: a.cover_image?.cdn_url || '/images/default-news-cover.jpg',
          category: 'Community Story',
          personName: a.author_name || 'Community Member',
          location: 'Odisha, India',
          publishedAt: a.published_at || a.created_at,
          isFeatured: a.is_featured,
          programmeTitle: undefined,
          programmeSlug: undefined,
        }));
      }
    }
    return null;
  }, [articles]);

  const activeStories = storiesFromDb || IMPACT_STORIES;
  const featuredStory = activeStories.find((s) => s.isFeatured) || activeStories[0];
  const supportingStories = activeStories.filter((s) => s.id !== featuredStory?.id).slice(0, 3);

  if (!featuredStory) return null;

  return (
    <section
      id="impact-stories"
      aria-labelledby="impact-stories-heading"
      className="border-soft-border/40 w-full border-b bg-[#FDFCF8] py-12 sm:py-16 md:py-20"
    >
      <Container>
        {/* Section Header */}
        <div className="mb-10 max-w-3xl sm:mb-12">
          <span
            className="eyebrow-label mb-3 inline-flex items-center gap-2 rounded-full border border-[#439B25]/25 bg-[#EEF8E9] px-3.5 py-1.5 font-heading text-xs font-bold uppercase tracking-widest sm:text-sm"
            style={{ color: '#439B25' }}
          >
            REAL PEOPLE. REAL CHANGE.
          </span>
          <h2
            id="impact-stories-heading"
            className="font-heading text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl"
            style={{ color: '#12245F' }}
          >
            Stories of Hope and Transformation
          </h2>
          <p className="mt-2 text-sm sm:text-base" style={{ color: '#5E6B63' }}>
            Discover the people, journeys, and community experiences that give purpose to every
            UDBHAV initiative.
          </p>
        </div>

        {/* Stories Grid: 1 Large Featured Story + 3 Supporting Stories */}
        <div className="grid grid-cols-1 items-stretch gap-6 sm:gap-8 lg:grid-cols-12">
          {/* Large Featured Story Card (Columns 1-7) */}
          <AnimatedCardWrapper
            index={0}
            className="bg-pure-white flex flex-col overflow-hidden rounded-3xl border border-[#12245F]/15 lg:col-span-7"
          >
            <div className="relative h-64 w-full overflow-hidden bg-[#EAF3FF] sm:h-80 md:h-96">
              <LazyImage
                src={featuredStory.imageUrl}
                alt={featuredStory.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover group-hover:scale-[1.025]"
                priority={true}
              />

              {/* Category Badge */}
              <div className="absolute left-4 top-4 z-10">
                <span className="rounded-full bg-[#439B25] px-3.5 py-1.5 font-heading text-xs font-bold uppercase tracking-wider text-white shadow-md">
                  {featuredStory.category}
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
              <div>
                {/* Person Name & Verified Consent */}
                <div className="mb-3 flex items-center gap-2 text-xs font-bold text-[#12245F] sm:text-sm">
                  <UserCheck className="h-4 w-4 text-[#439B25]" />
                  <span>Verified Impact Story: {featuredStory.personName}</span>
                </div>

                {/* Title */}
                <h3 className="mb-4 font-heading text-xl font-bold leading-tight text-[#12245F] transition-colors group-hover:text-[#439B25] sm:text-2xl md:text-3xl">
                  {featuredStory.title}
                </h3>

                {/* Excerpt */}
                <p className="mb-6 text-sm leading-relaxed text-[#5E6B63] sm:text-base">
                  {featuredStory.excerpt}
                </p>
              </div>

              <div>
                {/* Meta Bar */}
                <div className="border-soft-border/40 mb-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-xs font-medium text-[#5E6B63]">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-3.5 w-3.5 text-[#439B25]" />
                    <span>{featuredStory.programmeTitle}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-[#439B25]" />
                      {featuredStory.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-[#439B25]" />
                      {featuredStory.publishedAt}
                    </span>
                  </div>
                </div>

                {/* Read Their Story Button */}
                <Link
                  href={`/news-and-stories/${featuredStory.slug}`}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl px-6 py-3 font-heading text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg sm:text-base"
                  style={{ background: '#439B25' }}
                >
                  Read Their Story
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </AnimatedCardWrapper>

          {/* Supporting Stories Column (Columns 8-12) */}
          <div className="flex flex-col justify-between gap-6 lg:col-span-5">
            {supportingStories.map((story, index) => {
              return (
                <AnimatedCardWrapper
                  key={story.id}
                  index={index + 1}
                  href={`/news-and-stories/${story.slug}`}
                  className="bg-pure-white flex flex-col items-stretch gap-4 overflow-hidden rounded-2xl border border-[#12245F]/10 p-4 sm:flex-row"
                >
                  {/* Thumbnail */}
                  <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl bg-[#EAF3FF] sm:h-auto sm:w-36">
                    <LazyImage
                      src={story.imageUrl}
                      alt={story.title}
                      fill
                      sizes="150px"
                      className="object-cover group-hover:scale-[1.025]"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
                    <div>
                      <div className="mb-1 font-heading text-[11px] font-bold uppercase tracking-wider text-[#439B25]">
                        {story.category}
                      </div>

                      <h4 className="mb-2 line-clamp-2 font-heading text-base font-bold leading-snug text-[#12245F] transition-colors group-hover:text-[#439B25]">
                        {story.title}
                      </h4>

                      <p className="mb-3 line-clamp-2 text-xs text-[#5E6B63]">{story.excerpt}</p>
                    </div>

                    <div className="border-soft-border/30 flex items-center justify-between border-t pt-2 text-xs font-medium text-[#5E6B63]">
                      <span className="truncate">{story.personName}</span>
                      <span className="inline-flex shrink-0 items-center gap-1 font-heading font-bold text-[#439B25]">
                        Read Story <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </AnimatedCardWrapper>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default ImpactStoriesSection;
