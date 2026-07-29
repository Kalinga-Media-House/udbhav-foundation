import { MetadataRoute } from 'next';

import { METADATA } from '@/constants/metadata';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: `${METADATA.BASE_URL}/sitemap.xml`,
  };
}
