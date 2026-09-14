import type { MetadataRoute } from 'next';
import { siteOrigin } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*', // Includes Googlebot.
      allow: '/',
      disallow: ['/api/'],
    },
    // Pages excluded from indexing remain crawlable so robots can read noindex.
    sitemap: `${siteOrigin}/sitemap.xml`,
  };
}
