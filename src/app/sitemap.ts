import type { MetadataRoute } from 'next';
import { siteOrigin } from '@/lib/site';

// Explicit allowlist: never derive URLs from the private learning catalog.
// / is login, worlds/tasks/profile require a session, and shared achievements
// are intentionally noindex. Add only public editorial pages.
const publicIndexablePaths = ['/sobre'];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicIndexablePaths.map(path => ({ url: new URL(path, siteOrigin).href }));
}
