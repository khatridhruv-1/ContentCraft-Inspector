import type { MetadataRoute } from 'next';
import { BLOG_POSTS } from '@/lib/marketing/blogPosts';
import { PUBLIC_MARKETING_PATHS } from '@/lib/marketing/landingSeo';
import { absoluteUrl } from '@/lib/marketing/siteUrl';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const marketingEntries = PUBLIC_MARKETING_PATHS.map(path => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency: path === '/' ? ('weekly' as const) : ('monthly' as const),
    priority: path === '/' ? 1 : path === '/help' || path === '/integrate' ? 0.8 : 0.6,
  }));

  const blogEntries = BLOG_POSTS.map(post => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...marketingEntries, ...blogEntries];
}
