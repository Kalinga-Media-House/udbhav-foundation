"use client";

import {
  Heart,
  MapPin,
  Calendar,
  FolderOpen,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import React from "react";

import { AnimatedCardWrapper } from "@/components/shared/AnimatedCardWrapper";
import { Container } from "@/components/shared/Container";
import { LazyImage } from "@/components/shared/LazyImage";
import { IMPACT_STORIES } from "@/data/news-data";
import type { ArticleWithMedia } from "@/features/news/repository";
import type { ImpactStoryItem } from "@/types/news";

interface ImpactStoriesSectionProps {
  articles?: ArticleWithMedia[];
}

export function ImpactStoriesSection({ articles }: ImpactStoriesSectionProps = {}) {
  const storiesFromDb = React.useMemo(() => {
    if (articles && articles.length > 0) {
      const storyArticles = articles.filter(
        (a) => a.category === "Story" || a.category === "Community Stories"
      );
      if (storyArticles.length > 0) {
        return storyArticles.map((a): ImpactStoryItem => ({
          id: a.id,
          title: a.title,
          slug: a.slug,
          excerpt: a.summary || a.subtitle || "",
          content: a.content,
          imageUrl: a.cover_image?.public_url || "/images/default-news-cover.jpg",
          category: "Community Story",
          personName: a.author_name || "Community Member",
          location: "Odisha, India",
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
  const supportingStories = activeStories.filter(
    (s) => s.id !== featuredStory?.id
  ).slice(0, 3);

  if (!featuredStory) return null;

  return (
    <section
      id="impact-stories"
      aria-labelledby="impact-stories-heading"
      className="w-full py-12 sm:py-16 md:py-20 bg-[#FDFCF8] border-b border-soft-border/40"
    >
      <Container>
        {/* Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-12">
          <span
            className="eyebrow-label font-heading text-xs sm:text-sm font-bold tracking-widest uppercase inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF8E9] border border-[#439B25]/25 mb-3"
            style={{ color: "#439B25" }}
          >
            <Heart className="w-4 h-4" />
            REAL PEOPLE. REAL CHANGE.
          </span>
          <h2
            id="impact-stories-heading"
            className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight"
            style={{ color: "#12245F" }}
          >
            Stories of Hope and Transformation
          </h2>
          <p
            className="text-sm sm:text-base mt-2"
            style={{ color: "#5E6B63" }}
          >
            Discover the people, journeys, and community experiences that give
            purpose to every UDBHAV initiative.
          </p>
        </div>

        {/* Stories Grid: 1 Large Featured Story + 3 Supporting Stories */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          {/* Large Featured Story Card (Columns 1-7) */}
          <AnimatedCardWrapper
            index={0}
            className="lg:col-span-7 flex flex-col rounded-3xl bg-pure-white border border-[#12245F]/15 overflow-hidden"
          >
            <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden bg-[#EAF3FF]">
              <LazyImage
                src={featuredStory.imageUrl}
                alt={featuredStory.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover group-hover:scale-[1.025]"
                priority={true}
              />

              {/* Category Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-heading font-bold uppercase tracking-wider bg-[#439B25] text-white shadow-md">
                  {featuredStory.category}
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                {/* Person Name & Verified Consent */}
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#12245F] mb-3">
                  <UserCheck className="w-4 h-4 text-[#439B25]" />
                  <span>Verified Impact Story: {featuredStory.personName}</span>
                </div>

                {/* Title */}
                <h3 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-[#12245F] leading-tight mb-4 group-hover:text-[#439B25] transition-colors">
                  {featuredStory.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm sm:text-base text-[#5E6B63] leading-relaxed mb-6">
                  {featuredStory.excerpt}
                </p>
              </div>

              <div>
                {/* Meta Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-soft-border/40 text-xs font-medium text-[#5E6B63] mb-5">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-3.5 h-3.5 text-[#439B25]" />
                    <span>{featuredStory.programmeTitle}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#439B25]" />
                      {featuredStory.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#439B25]" />
                      {featuredStory.publishedAt}
                    </span>
                  </div>
                </div>

                {/* Read Their Story Button */}
                <Link
                  href={`/news-and-stories/${featuredStory.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-heading text-sm sm:text-base font-semibold text-white transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
                  style={{ background: "#439B25" }}
                >
                  Read Their Story
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </AnimatedCardWrapper>

          {/* Supporting Stories Column (Columns 8-12) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {supportingStories.map((story, index) => {
              return (
                <AnimatedCardWrapper
                  key={story.id}
                  index={index + 1}
                  href={`/news-and-stories/${story.slug}`}
                  className="flex flex-col sm:flex-row items-stretch gap-4 p-4 rounded-2xl bg-pure-white border border-[#12245F]/10 overflow-hidden"
                >
                  {/* Thumbnail */}
                  <div className="relative w-full sm:w-36 h-40 sm:h-auto rounded-xl overflow-hidden shrink-0 bg-[#EAF3FF]">
                    <LazyImage
                      src={story.imageUrl}
                      alt={story.title}
                      fill
                      sizes="150px"
                      className="object-cover group-hover:scale-[1.025]"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between min-w-0 py-1">
                    <div>
                      <div className="text-[11px] font-heading font-bold uppercase tracking-wider text-[#439B25] mb-1">
                        {story.category}
                      </div>

                      <h4 className="font-heading text-base font-bold text-[#12245F] leading-snug line-clamp-2 group-hover:text-[#439B25] transition-colors mb-2">
                        {story.title}
                      </h4>

                      <p className="text-xs text-[#5E6B63] line-clamp-2 mb-3">
                        {story.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#5E6B63] font-medium pt-2 border-t border-soft-border/30">
                      <span className="truncate">{story.personName}</span>
                      <span className="text-[#439B25] font-heading font-bold inline-flex items-center gap-1 shrink-0">
                        Read Story <ArrowRight className="w-3 h-3" />
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
