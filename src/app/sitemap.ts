import { MetadataRoute } from 'next';

import { METADATA } from '@/constants/metadata';
import { createStaticSupabaseClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createStaticSupabaseClient();
  const baseUrl = METADATA.BASE_URL;

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/donate`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/campaigns`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/news-and-stories`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/programmes`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/core-team`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/volunteers`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contributors`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/index`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/podcast`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms-of-use`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  try {
    const [
      { data: newsArticles },
      { data: programs },
      { data: galleryAlbums },
      { data: podcasts },
      { data: indexInitiatives },
      { data: events }
    ] = await Promise.all([
      supabase.from('news_articles').select('slug, updated_at').eq('status', 'Published').eq('is_deleted', false).eq('visibility', 'public'),
      supabase.from('programs').select('slug, updated_at').eq('status', 'active').eq('is_deleted', false).eq('visibility', 'public'),
      supabase.from('gallery_albums').select('slug, updated_at').eq('is_deleted', false).eq('visibility', 'Public'),
      supabase.from('podcast_episodes').select('slug, updated_at').eq('status', 'Published').eq('is_deleted', false),
      supabase.from('index_initiatives').select('slug, updated_at').eq('status', 'Published').eq('is_deleted', false),
      supabase.from('events').select('slug, updated_at').neq('status', 'draft').eq('is_deleted', false).eq('visibility', 'public')
    ]);

    if (newsArticles) {
      newsArticles.forEach((article) => {
        if (article.slug) {
          routes.push({
            url: `${baseUrl}/news-and-stories/${article.slug}`,
            lastModified: article.updated_at ? new Date(article.updated_at) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        }
      });
    }

    if (programs) {
      programs.forEach((program) => {
        if (program.slug) {
          routes.push({
            url: `${baseUrl}/programmes/${program.slug}`,
            lastModified: program.updated_at ? new Date(program.updated_at) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        }
      });
    }

    if (galleryAlbums) {
      galleryAlbums.forEach((album) => {
        if (album.slug) {
          routes.push({
            url: `${baseUrl}/gallery/${album.slug}`,
            lastModified: album.updated_at ? new Date(album.updated_at) : new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
          });
        }
      });
    }

    if (podcasts) {
      podcasts.forEach((podcast) => {
        if (podcast.slug) {
          routes.push({
            url: `${baseUrl}/podcast/${podcast.slug}`,
            lastModified: podcast.updated_at ? new Date(podcast.updated_at) : new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
          });
        }
      });
    }

    if (indexInitiatives) {
      indexInitiatives.forEach((initiative) => {
        if (initiative.slug) {
          routes.push({
            url: `${baseUrl}/index/${initiative.slug}`,
            lastModified: initiative.updated_at ? new Date(initiative.updated_at) : new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
          });
        }
      });
    }

    if (events) {
      events.forEach((event) => {
        if (event.slug) {
          routes.push({
            url: `${baseUrl}/events/${event.slug}`,
            lastModified: event.updated_at ? new Date(event.updated_at) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        }
      });
    }
  } catch (error) {
    console.error('Failed to generate dynamic sitemap routes:', error);
  }

  return routes;
}
