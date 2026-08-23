import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { APPLICATION } from '@/constants/application';
import { METADATA } from '@/constants/metadata';
import { systemSettingsRepository } from '@/features/system_settings/repository';
import { RootProviders } from '@/providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await systemSettingsRepository.getPublicSettings();
  
  const siteTitle = settings.seo_default_title || METADATA.DEFAULT_TITLE;
  const siteDesc = settings.seo_default_desc || METADATA.DEFAULT_DESCRIPTION;

  return {
    title: {
      default: siteTitle,
      template: METADATA.TITLE_TEMPLATE,
    },
    description: siteDesc,
    applicationName: APPLICATION.BRAND_NAME,
    openGraph: {
      type: 'website',
      locale: 'en_IN',
      url: METADATA.BASE_URL,
      siteName: APPLICATION.BRAND_NAME,
      title: siteTitle,
      description: siteDesc,
    },
    twitter: {
      card: 'summary_large_image',
      title: siteTitle,
      description: siteDesc,
    },
    icons: {
      icon: '/icon.svg',
    },
    metadataBase: new URL(METADATA.BASE_URL),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await systemSettingsRepository.getPublicSettings();
  const contactPhone = settings.contact_phone || '+91 63705 08606';
  const contactEmail = settings.contact_email || 'admin@udbhavfoundation.in';
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} min-h-screen bg-background font-sans antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-background focus:p-4 focus:text-foreground"
        >
          Skip to main content
        </a>
        <RootProviders>
          <Header contactPhone={contactPhone} contactEmail={contactEmail} />
          <div id="main-content" className="relative flex flex-1 flex-col">
            {children}
          </div>
          <Footer />
        </RootProviders>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
