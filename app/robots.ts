import type {MetadataRoute} from 'next';
import {SITE_URL} from '@/lib/site';
import {absoluteUrl} from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {userAgent: '*', allow: '/'},
    sitemap: absoluteUrl('/sitemap.xml'),
    // The `host` directive expects a bare hostname (not a full URL).
    host: new URL(SITE_URL).host
  };
}
