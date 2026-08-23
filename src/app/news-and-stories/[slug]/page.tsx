import { format } from 'date-fns';
import {
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  MapPin,
} from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react';

import { ArticleShareButton } from '@/components/news-and-stories/ArticleShareButton';
import { Container } from '@/components/shared/Container';
import { getArticleBySlug } from '@/features/news/actions';

export const dynamic = 'force-dynamic';

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

  const siteUrl = 'https://udbhavfoundation.org';
  const seoTitle = ((article.metadata || {}) as Record<string, unknown>).seo_title as string || `${article.title} | UDBHAV FOUNDATION`;
  const seoDesc = ((article.metadata || {}) as Record<string, unknown>).seo_description as string || article.summary || article.subtitle || 'Read this story on UDBHAV FOUNDATION.';
  
  const rawCanonical = ((article.metadata || {}) as Record<string, unknown>).canonical_url as string;
  const canonicalUrl = rawCanonical
    ? (rawCanonical.startsWith('http') ? rawCanonical : `${siteUrl}${rawCanonical}`)
    : `${siteUrl}/news-and-stories/${article.slug}`;

  let imageUrl = article.cover_image?.cdn_url || `${siteUrl}/images/default-news-cover.jpg`;
  if (imageUrl.startsWith('/')) {
    imageUrl = `${siteUrl}${imageUrl}`;
  }

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
  const isEvent = article.category === 'Event';



  // Generate Article JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': isEvent ? 'Event' : 'NewsArticle',
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
    ...(isEvent && article.event_date ? {
      startDate: `${article.event_date}T${article.event_start_time || '00:00:00'}`,
      endDate: `${article.event_date}T${article.event_end_time || '23:59:59'}`,
      location: {
        '@type': 'Place',
        name: article.event_location || 'TBA',
        address: article.event_address || undefined
      }
    } : {})
  };

  const publishDate = article.published_at 
    ? format(new Date(article.published_at), 'dd MMMM yyyy')
    : format(new Date(article.created_at), 'dd MMMM yyyy');

  return (
    <main className="min-h-screen bg-[#F8FAF7] pb-16 md:pb-24 overflow-hidden relative">
      {/* Inject Article JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Container>
        {/* Editorial Layout Wrapper */}
        <div className="max-w-[800px] mx-auto pt-10 md:pt-16">
          
          {/* Header Section */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
            <Link
              href="/news-and-stories"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#4FAF32] transition-colors mb-6 md:mb-8"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to News & Stories
            </Link>

            <div className="mb-4 flex items-center justify-between gap-4">
              <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest text-[#4FAF32] border border-[#4FAF32]/30 bg-[#4FAF32]/5">
                {article.category || 'News'}
              </span>
              <ArticleShareButton title={article.title} slug={article.slug} contentType={article.category || 'News'} />
            </div>

            <h1 className="text-3xl md:text-[40px] lg:text-[48px] leading-[1.15] font-heading font-bold text-[#20256F] mb-6">
              {article.title}
            </h1>

            {article.subtitle && (
              <p className="text-lg md:text-xl text-gray-500 mb-6 font-medium">
                {article.subtitle}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-8 md:mb-12 font-medium">
              <span>By <span className="text-[#20256F] font-semibold">{article.author_name || 'UDBHAV Foundation'}</span></span>
              <span>·</span>
              <span>{publishDate}</span>
              <span>·</span>
              <span>{article.reading_time || 1} min read</span>
            </div>
          </div>

          {/* Hero Image */}
          {article.cover_image?.cdn_url && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 ease-out fill-mode-both mb-8 md:mb-12">
              <div className="relative w-full aspect-[16/9] md:aspect-[1.8/1] rounded-[18px] md:rounded-[24px] overflow-hidden shadow-sm group">
                <Image
                  src={article.cover_image.cdn_url}
                  alt={article.cover_image.alt_text || article.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
              </div>
              {article.cover_image.caption && (
                <p className="text-xs text-center text-gray-400 mt-3 italic">
                  {article.cover_image.caption}
                </p>
              )}
            </div>
          )}

          {/* Event Details Panel (Compact) */}
          {isEvent && article.event_date && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 ease-out fill-mode-both mb-10 md:mb-14 bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1 grid grid-cols-2 md:flex md:flex-wrap md:items-center gap-y-4 gap-x-8">
                
                {/* Date */}
                <div>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Date</span>
                  <div className="flex items-center gap-2 text-[#20256F] font-semibold text-sm">
                    <Calendar className="w-4 h-4 text-[#4FAF32]" />
                    {format(new Date(article.event_date), 'dd MMM yyyy')}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Location</span>
                  <div className="flex items-center gap-2 text-[#20256F] font-semibold text-sm">
                    <MapPin className="w-4 h-4 text-[#4FAF32]" />
                    <span className="truncate max-w-[120px] md:max-w-none">{article.event_location || 'TBA'}</span>
                  </div>
                </div>

                {/* Time */}
                <div className="col-span-2 md:col-span-1">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Time</span>
                  <div className="flex items-center gap-2 text-[#20256F] font-semibold text-sm">
                    <Clock className="w-4 h-4 text-[#4FAF32]" />
                    {article.event_start_time ? format(new Date(`1970-01-01T${article.event_start_time}`), 'hh:mm a') : 'TBA'}
                    {article.event_end_time && ` – ${format(new Date(`1970-01-01T${article.event_end_time}`), 'hh:mm a')}`}
                  </div>
                </div>

              </div>

              {/* Action */}
              {article.registration_url && (
                <div className="md:border-l md:border-gray-100 md:pl-6 shrink-0">
                  <Link
                    href={article.registration_url}
                    target="_blank"
                    className="group inline-flex items-center justify-center w-full md:w-auto px-6 py-2.5 rounded-full bg-[#4FAF32] text-white font-semibold text-sm hover:bg-[#3d8c25] transition-colors"
                  >
                    Register for Event
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Article Summary (If present and not just redundant) */}
          {article.summary && !article.subtitle && (
            <div className="mb-10 text-lg md:text-xl text-gray-700 font-medium leading-relaxed border-l-2 border-[#4FAF32] pl-4 md:pl-6">
              {article.summary}
            </div>
          )}

          {/* Main Content */}
          <article className="prose prose-lg prose-slate prose-headings:font-heading prose-headings:text-[#20256F] prose-headings:font-bold prose-a:text-[#4FAF32] prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl max-w-none mb-12">
            <div className="text-gray-700 space-y-6 leading-relaxed whitespace-pre-wrap">
              {article.content}
            </div>
          </article>

          {/* Article Tags */}
          {(article.tags || []).length > 0 && (
            <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 pt-8 mb-12">
              <span className="text-sm font-semibold text-gray-400 mr-2 uppercase tracking-wider">Tags</span>
              {(article.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white border border-gray-100 text-gray-500 text-xs font-semibold rounded-full shadow-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

        </div>
      </Container>


    </main>
  );
}
