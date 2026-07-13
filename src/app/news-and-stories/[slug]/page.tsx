import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  FolderOpen,
  BookOpen,
} from "lucide-react";
import { Container } from "@/components/shared/Container";
import { NEWS_POSTS, IMPACT_STORIES } from "@/data/news-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post =
    NEWS_POSTS.find((p) => p.slug === slug) ||
    IMPACT_STORIES.find((s) => s.slug === slug);

  if (!post) {
    return {
      title: "Story Not Found | UDBHAV FOUNDATION",
    };
  }

  return {
    title: `${post.title} | UDBHAV FOUNDATION`,
    description: post.excerpt,
  };
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params;

  const newsPost = NEWS_POSTS.find((p) => p.slug === slug);
  const impactStory = IMPACT_STORIES.find((s) => s.slug === slug);

  const item = newsPost || impactStory;

  if (!item) {
    notFound();
  }

  return (
    <main className="min-h-screen py-12 sm:py-16 md:py-20 bg-pure-white">
      <Container>
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/news-and-stories"
            className="inline-flex items-center gap-2 text-sm font-heading font-semibold text-[#12245F] hover:text-[#439B25] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to News & Stories
          </Link>
        </div>

        {/* Article Header */}
        <div className="max-w-4xl mx-auto mb-8 sm:mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className="px-3.5 py-1 rounded-full text-xs font-heading font-bold uppercase tracking-wider text-white"
              style={{ background: "#439B25" }}
            >
              {"category" in item ? item.category : "Community Story"}
            </span>

            {"programmeTitle" in item && item.programmeTitle && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-semibold bg-[#EAF3FF] text-[#12245F]">
                <FolderOpen className="w-3.5 h-3.5 text-[#439B25]" />
                {item.programmeTitle}
              </span>
            )}
          </div>

          <h1
            className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-5"
            style={{ color: "#12245F" }}
          >
            {item.title}
          </h1>

          {/* Meta Info Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-soft-border/40 text-xs sm:text-sm text-[#5E6B63]">
            <div className="flex flex-wrap items-center gap-5">
              {"author" in item && (
                <span className="font-semibold text-[#12245F]">
                  By {item.author}
                </span>
              )}
              {impactStory && "personName" in impactStory && (
                <span className="font-semibold text-[#12245F]">
                  Featured Changemaker: {impactStory.personName}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#439B25]" />
                {"activityDate" in item
                  ? item.activityDate
                  : item.publishedAt}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#439B25]" />
                {item.location}
              </span>
              {"readingTime" in item && (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#439B25]" />
                  {item.readingTime}
                </span>
              )}
            </div>

            <Link
              href="/volunteers"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EEF8E9] text-[#439B25] font-heading text-xs font-bold hover:bg-[#E5F4DF] transition-colors"
            >
              Volunteer With This Initiative
            </Link>
          </div>
        </div>

        {/* Cover Image */}
        <div className="max-w-4xl mx-auto mb-10 sm:mb-12">
          <div className="relative h-64 sm:h-96 md:h-110 w-full rounded-3xl overflow-hidden shadow-lg border border-[#12245F]/10 bg-[#EAF3FF]">
            <Image
              src={
                "coverImageUrl" in item ? item.coverImageUrl : item.imageUrl
              }
              alt={item.title}
              fill
              sizes="(max-width: 1024px) 100vw, 900px"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Article Content */}
        <article className="max-w-3xl mx-auto prose prose-lg">
          <div className="text-base sm:text-lg leading-relaxed text-[#17231D] space-y-6 whitespace-pre-line">
            {item.content}
          </div>

          {/* Call to Action Box */}
          <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-[#EEF8E9] border border-[#439B25]/30 text-center">
            <BookOpen className="w-8 h-8 text-[#439B25] mx-auto mb-3" />
            <h3 className="font-heading text-xl font-bold text-[#12245F] mb-2">
              Inspired by This Story?
            </h3>
            <p className="text-sm text-[#5E6B63] max-w-md mx-auto mb-5">
              Join UDBHAV FOUNDATION as a volunteer, mentor, or contributor to
              make a direct impact in rural and underserved communities across
              Odisha.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/volunteers"
                className="px-6 py-2.5 rounded-xl font-heading text-sm font-semibold text-white bg-[#439B25] hover:bg-[#38841F] transition-colors"
              >
                Become a Volunteer
              </Link>
              <Link
                href="/donate"
                className="px-6 py-2.5 rounded-xl font-heading text-sm font-semibold text-[#12245F] bg-pure-white border border-[#12245F]/20 hover:bg-[#EAF3FF] transition-colors"
              >
                Support Our Mission
              </Link>
            </div>
          </div>
        </article>
      </Container>
    </main>
  );
}
