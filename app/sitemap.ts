import type { MetadataRoute } from 'next';
import { PUBLIC_MARKETING_PATHS } from '@/lib/marketing/landingSeo';
import { absoluteUrl } from '@/lib/marketing/siteUrl';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return PUBLIC_MARKETING_PATHS.map(path => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : path === '/help' || path === '/integrate' ? 0.8 : 0.6,
  }));
}
