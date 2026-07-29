/**
 * @file gallery.ts
 * @description Re-export of domain gallery types and view model types for gallery displays.
 */

export * from './domain/gallery';

export interface IndexProgramme {
  id: string;
  title: string;
  slug: string;
  category: string;
  accentColor?: string;
}

export interface GalleryPhotoEvent {
  id: string;
  title: string;
  slug: string;
  location: string;
  eventDate: string;
  startTime?: string;
  endTime?: string;
}

export interface GalleryPhoto {
  id: string;
  imageUrl: string;
  title: string;
  caption: string;
  altText: string;
  photographerName?: string;
  aspectRatio?: 'portrait' | 'landscape' | 'square' | string;
  createdAt: string;
  programme: IndexProgramme;
  event: GalleryPhotoEvent;
}
