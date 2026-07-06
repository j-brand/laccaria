import type {MetadataRoute} from 'next';
import {SITE_URL} from '@/lib/site';
import {absoluteUrl} from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {userAgent: '*', allow: '/'},
    sitemap: absoluteUrl('/sitemap.xml'),
    host: SITE_URL
  };
}
