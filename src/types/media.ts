/**
 * FUTURE MEDIA ARCHITECTURE SCHEMA
 *
 * Supports local image paths and future remote media URLs (Supabase / Cloudflare R2).
 * Enables internal tracking of temporary AI placeholder assets so that Super Admins
 * can filter, identify, and replace placeholder media without changing source code or layouts.
 */

export type MediaSourceType = "authentic-local" | "ai-placeholder" | "remote-r2" | "remote-supabase";

export interface MediaAsset {
  /** Local path (e.g. /hero/hero-09.png) or remote media URL */
  src: string;
  /** Meaningful, accessible descriptive alt text */
  alt: string;
  /** Natural dimensions for aspect-ratio preservation and responsive sizing */
  width?: number;
  height?: number;
  /** Optional visual caption displayed under composition */
  caption?: string;
  /** Optional photographer or organization attribution */
  credit?: string;
  /** Identifies whether asset is authentic UDBHAV photography or temporary AI placeholder */
  mediaSource?: MediaSourceType;
  /** True if this is a temporary development placeholder awaiting authentic upload */
  isPlaceholder?: boolean;
  /** Optional fallback image path if remote or local asset is unavailable */
  fallbackSrc?: string;
}
