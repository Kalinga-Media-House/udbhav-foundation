export type IndexProgrammeSlug =
  | "udbhav-siksha-samman"
  | "free-civil-services-coaching"
  | "plantation-drive"
  | "climate-action-run"
  | "books-study-materials-distribution"
  | "cyber-safety-awareness"
  | "mental-health-awareness"
  | "health-checkup-camps"
  | "sanitation-dengue-awareness"
  | "blood-donation-camp"
  | "emergency-blood-donation";

export interface IndexProgramme {
  id: string;
  title: string;
  slug: IndexProgrammeSlug;
  icon?: string;
  accentColor?: string;
  category: "Education" | "Environment" | "Health" | "Community";
}

export interface GalleryEvent {
  id: string;
  title: string;
  slug: string;
  location: string;
  eventDate: string; // ISO format or human readable
  startTime?: string;
  endTime?: string;
}

export interface GalleryPhoto {
  id: string;
  imageUrl: string;
  thumbnailUrl?: string;
  title: string;
  caption?: string;
  altText: string;
  photographerName?: string;
  aspectRatio: "landscape" | "portrait" | "square";
  createdAt: string;
  event: GalleryEvent;
  programme: IndexProgramme;
}
