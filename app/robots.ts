import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/marketing/siteUrl';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/home/', '/history/', '/profile/', '/api/'],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/'),
  };
}
