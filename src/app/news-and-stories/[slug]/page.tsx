import {
  Calendar,
  Clock,
  ArrowLeft,
  BookOpen,
  FolderOpen,
  CalendarDays,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react';

import { Container } from '@/components/shared/Container';
import { listEvents } from '@/features/events/actions';
import { getArticleBySlug, listPublicArticles } from '@/features/news/actions';
import { listPrograms } from '@/features/programs/actions';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getArticleBySlug(slug);
  const article = result.success ? result.data : null;

  if (!article) {
    return {
      title: 'Article Not Found | UDBHAV FOUNDATION',
    };
  }

  const seoTitle = ((article.metadata || {}) as Record<string, unknown>).seo_title as string || `${article.title} | UDBHAV FOUNDATION`;
  const seoDesc = ((article.metadata || {}) as Record<string, unknown>).seo_description as string || article.summary || article.subtitle || 'Read this story on UDBHAV FOUNDATION.';
  const canonicalUrl = ((article.metadata || {}) as Record<string, unknown>).canonical_url as string || `/news-and-stories/${article.slug}`;
  const imageUrl = article.cover_image?.cdn_url || '/images/default-news-cover.jpg';

  return {
    title: seoTitle,
    description: seoDesc,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: seoTitle,
      description: seoDesc,
      type: 'article',
      url: canonicalUrl,
      images: [
        {
          url: imageUrl,
          alt: article.cover_image?.alt_text || article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDesc,
      images: [imageUrl],
    },
  };
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const articleResult = await getArticleBySlug(slug);

  if (!articleResult.success || !articleResult.data) {
    notFound();
  }

  const article = articleResult.data;

  // Fetch related content (Articles, Programs, Events)
  const [articlesResult, programsResult, eventsResult] = await Promise.all([
    listPublicArticles({ page: 1, limit: 6 }, { category: article.category }),
    listPrograms({ page: 1, limit: 3 }),
    listEvents({ page: 1, limit: 3 }),
  ]);

  const relatedArticles =
    articlesResult.success && articlesResult.data
      ? articlesResult.data.data.filter((a) => a.id !== article.id).slice(0, 3)
      : [];

  const relatedPrograms =
    programsResult.success && programsResult.data
      ? programsResult.data.data.slice(0, 3)
      : [];

  const relatedEvents =
    eventsResult.success && eventsResult.data
      ? eventsResult.data.data.slice(0, 3)
      : [];

  // Generate Article JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.summary || article.subtitle || '',
    image: article.cover_image?.cdn_url ? [article.cover_image.cdn_url] : [],
    datePublished: article.published_at || article.created_at,
    dateModified: article.updated_at,
    author: {
      '@type': 'Organization',
      name: article.author_name || 'UDBHAV Foundation',
    },
    publisher: {
      '@type': 'Organization',
      name: 'UDBHAV Foundation',
      url: 'https://udbhavfoundation.org',
    },
  };

  return (
    <main className="min-h-screen py-12 sm:py-16 md:py-20 bg-pure-white">
      {/* Inject Article JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Container>
        {/* Back Navigation */}
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
              style={{ background: '#439B25' }}
            >
              {article.category || 'News'}
            </span>

            {article.is_featured && (
              <span className="px-3 py-1 rounded-full text-xs font-heading font-bold bg-amber-100 text-amber-800">
                Featured
              </span>
            )}
          </div>

          <h1
            className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-5"
            style={{ color: '#12245F' }}
          >
            {article.title}
          </h1>

          {article.subtitle && (
            <p className="text-lg sm:text-xl text-gray-600 italic mb-4">
              {article.subtitle}
            </p>
          )}

          {/* Meta Info Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-soft-border/40 text-xs sm:text-sm text-[#5E6B63]">
            <div className="flex flex-wrap items-center gap-5">
              <span className="font-semibold text-[#12245F]">
                By {article.author_name || 'UDBHAV Foundation'}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#439B25]" />
                {article.published_at
                  ? new Date(article.published_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })
                  : new Date(article.created_at).toLocaleDateString('en-IN')}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#439B25]" />
                {article.reading_time || 1} min read
              </span>
            </div>

            <Link
              href="/volunteers"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EEF8E9] text-[#439B25] font-heading text-xs font-bold hover:bg-[#E5F4DF] transition-colors"
            >
              Volunteer With UDBHAV
            </Link>
          </div>
        </div>

        {/* Hero Cover Image */}
        {article.cover_image?.cdn_url && (
          <div className="max-w-4xl mx-auto mb-10 sm:mb-12">
            <div className="relative h-64 sm:h-96 md:h-110 w-full rounded-3xl overflow-hidden shadow-lg border border-[#12245F]/10 bg-[#EAF3FF]">
              <Image
                src={article.cover_image.cdn_url}
                alt={article.cover_image.alt_text || article.title}
                fill
                sizes="(max-width: 1024px) 100vw, 900px"
                className="object-cover"
                priority
              />
            </div>
            {article.cover_image.caption && (
              <p className="text-xs text-center text-gray-500 mt-2 italic">
                {article.cover_image.caption}
              </p>
            )}
          </div>
        )}

        {/* Article Summary Excerpt */}
        {article.summary && (
          <div className="max-w-3xl mx-auto mb-8 p-6 rounded-2xl bg-[#EAF3FF]/60 border-l-4 border-[#12245F] text-gray-800 font-medium text-base sm:text-lg">
            {article.summary}
          </div>
        )}

        {/* Main Article Content */}
        <article className="max-w-3xl mx-auto prose prose-lg">
          <div className="text-base sm:text-lg leading-relaxed text-[#17231D] space-y-6 whitespace-pre-wrap">
            {article.content}
          </div>

          {/* Tags Display */}
          {(article.tags || []).length > 0 && (
            <div className="mt-10 pt-6 border-t border-gray-200 flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-gray-700 mr-2">Tags:</span>
              {(article.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Call to Action Box */}
          <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-[#EEF8E9] border border-[#439B25]/30 text-center">
            <BookOpen className="w-8 h-8 text-[#439B25] mx-auto mb-3" />
            <h3 className="font-heading text-xl font-bold text-[#12245F] mb-2">
              Inspired by This Story?
            </h3>
            <p className="text-sm text-[#5E6B63] max-w-md mx-auto mb-5">
              Join UDBHAV FOUNDATION as a volunteer, mentor, or supporter to make
              a direct impact in rural and underserved communities across Odisha.
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

        {/* RELATED CONTENT SECTIONS */}
        <div className="max-w-5xl mx-auto mt-20 space-y-16 border-t border-gray-200 pt-16">
          {/* 1. Related Articles */}
          {relatedArticles.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#439B25]">
                    More From UDBHAV
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#12245F]">
                    Related Articles & Stories
                  </h2>
                </div>
                <Link
                  href="/news-and-stories"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[#12245F] hover:text-[#439B25]"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/news-and-stories/${rel.slug}`}
                    className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {rel.cover_image?.cdn_url && (
                        <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                          <Image
                            src={rel.cover_image.cdn_url}
                            alt={rel.title}
                            fill
                            sizes="300px"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-5 space-y-3">
                        <span className="px-2.5 py-0.5 bg-[#EEF8E9] text-[#439B25] text-xs font-bold rounded-full uppercase">
                          {rel.category || 'News'}
                        </span>
                        <h3 className="font-bold text-lg text-[#12245F] group-hover:text-[#439B25] transition-colors line-clamp-2">
                          {rel.title}
                        </h3>
                        {rel.summary && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {rel.summary}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="px-5 pb-5 pt-2 flex items-center justify-between text-xs text-gray-400 border-t border-gray-50">
                      <span>{rel.author_name || 'UDBHAV'}</span>
                      <span>{rel.reading_time || 1} min read</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 2. Related Programs */}
          {relatedPrograms.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#439B25]">
                    Initiatives
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#12245F]">
                    Related Programmes
                  </h2>
                </div>
                <Link
                  href="/programmes"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[#12245F] hover:text-[#439B25]"
                >
                  Explore All Programmes <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPrograms.map((prog) => (
                  <Link
                    key={prog.id}
                    href={`/programmes/${prog.slug}`}
                    className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#439B25] uppercase">
                        <FolderOpen className="w-4 h-4" />
                        <span>Programme</span>
                      </div>
                      <h3 className="font-bold text-lg text-[#12245F] group-hover:text-[#439B25] transition-colors">
                        {prog.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {prog.short_description}
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-xs font-semibold text-[#12245F] group-hover:text-[#439B25]">
                      <span>Learn more</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 3. Related Upcoming Events */}
          {relatedEvents.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#439B25]">
                    Get Involved
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#12245F]">
                    Upcoming Events
                  </h2>
                </div>
                <Link
                  href="/events"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[#12245F] hover:text-[#439B25]"
                >
                  View Events <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedEvents.map((ev) => (
                  <Link
                    key={ev.id}
                    href={`/events/${ev.slug}`}
                    className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#439B25] uppercase">
                        <CalendarDays className="w-4 h-4" />
                        <span>
                          {ev.start_time
                            ? new Date(ev.start_time).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })
                            : 'Upcoming'}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg text-[#12245F] group-hover:text-[#439B25] transition-colors">
                        {ev.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {ev.description}
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-xs font-semibold text-[#12245F] group-hover:text-[#439B25]">
                      <span>Register / View details</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}
