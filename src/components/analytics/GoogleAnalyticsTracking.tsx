'use client';

/**
 * Google Analytics Tracking Component.
 * Injects the official gtag.js script ONLY when:
 * - A valid GA4 Measurement ID (G-XXXXXXXXXX) is provided
 * - The current page is NOT an admin, login, or auth route
 *
 * Uses next/script for optimal loading.
 * Never loads duplicate scripts.
 */
import { usePathname } from 'next/navigation';
import Script from 'next/script';

interface GoogleAnalyticsTrackingProps {
  /** The GA4 Measurement ID (e.g. "G-XXXXXXXXXX") */
  measurementId: string | null;
}

/** Routes where GA tracking should NOT load */
const EXCLUDED_PREFIXES = ['/admin', '/login', '/auth', '/volunteers/dashboard'];

export function GoogleAnalyticsTracking({ measurementId }: GoogleAnalyticsTrackingProps) {
  const pathname = usePathname();

  // Don't render if no measurement ID
  if (!measurementId || !measurementId.startsWith('G-')) {
    return null;
  }

  // Don't render on admin/auth routes
  if (EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
}
