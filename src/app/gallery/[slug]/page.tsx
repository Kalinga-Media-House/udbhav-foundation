import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AlbumDetailClient } from '@/components/gallery/AlbumDetailClient';
import { METADATA } from '@/constants/metadata';
import { getAlbumBySlug, listAlbumItems } from '@/features/gallery/actions';
import type { GalleryPhoto } from '@/types/gallery';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const result = await getAlbumBySlug(params.slug);

  if (!result.success || !result.data) {
    return {
      title: 'Album Not Found | UDBHAV Foundation',
    };
  }

  const album = result.data;
  return {
    title: `${album.title} | Impact Gallery | UDBHAV Foundation`,
    description: album.description || `Explore photos from ${album.title} at UDBHAV Foundation.`,
    alternates: {
      canonical: `${METADATA.BASE_URL}/gallery/${album.slug}`,
    },
    openGraph: {
      title: `${album.title} | Impact Gallery | UDBHAV Foundation`,
      description: album.description || `Explore photos from ${album.title} at UDBHAV Foundation.`,
      url: `${METADATA.BASE_URL}/gallery/${album.slug}`,
      siteName: 'UDBHAV Foundation',
      locale: 'en_IN',
      type: 'article',
    },
  };
}

export default async function AlbumDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const albumResult = await getAlbumBySlug(params.slug);

  if (!albumResult.success || !albumResult.data) {
    notFound();
  }

  const album = albumResult.data;
  const itemsResult = await listAlbumItems(album.id, { page: 1, limit: 100 });
  const items = itemsResult.success && itemsResult.data ? itemsResult.data.data : [];

  const initialPhotos: GalleryPhoto[] = items
    .filter((item) => item.media?.cdn_url)
    .map((item) => {
      const width = item.media?.width || 0;
      const height = item.media?.height || 0;
      let aspectRatio: 'landscape' | 'portrait' | 'square' = 'landscape';
      if (width && height) {
        if (width > height) aspectRatio = 'landscape';
        else if (width < height) aspectRatio = 'portrait';
        else aspectRatio = 'square';
      }

      return {
        id: item.id,
        imageUrl: item.media!.cdn_url!,
        title: item.caption || album.title,
        caption: item.caption || item.media?.caption || '',
        altText: item.media?.alt_text || item.caption || album.title,
        photographerName: undefined,
        aspectRatio,
        createdAt: item.created_at,
        programme: {
          id: album.program_id || 'general',
          title: 'UDBHAV Programme',
          slug: 'general',
          category: 'Community',
        },
        event: {
          id: album.event_id || 'event',
          title: album.title,
          slug: album.slug,
          location: 'Odisha, India',
          eventDate: album.created_at,
        },
      };
    });

  return <AlbumDetailClient album={album} initialPhotos={initialPhotos} />;
}
