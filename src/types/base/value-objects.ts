/**
 * Value object representing a physical address.
 */
export interface Address {
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

/**
 * Value object representing geographical coordinates.
 */
export interface GeoLocation {
  latitude: number;
  longitude: number;
}

/**
 * Value object representing contact information.
 */
export interface ContactInfo {
  email?: string | null;
  phone?: string | null;
  preferred_method?: 'email' | 'phone' | 'whatsapp';
}

/**
 * Value object representing social media links.
 */
export interface SocialLinks {
  facebook?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  instagram?: string | null;
  youtube?: string | null;
  website?: string | null;
}

/**
 * Value object representing SEO metadata.
 */
export interface SEO {
  title: string;
  description: string;
  keywords?: string[];
  og_image?: string | null;
  canonical_url?: string | null;
}

/**
 * Value object representing a URL slug.
 */
export interface Slug {
  slug: string;
}

/**
 * Value object representing arbitrary key-value metadata.
 */
export interface Metadata {
  metadata: Record<string, unknown>;
}

/**
 * Value object representing access visibility level.
 */
export interface Visibility {
  visibility: 'public' | 'private' | 'internal';
}

/**
 * Value object representing a generic state or status string.
 */
export interface Status {
  status: string;
}

/**
 * Value object representing a reference to a media item.
 */
export interface MediaReference {
  media_id: string;
  url: string;
  alt?: string | null;
  caption?: string | null;
}
