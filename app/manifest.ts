import type {MetadataRoute} from 'next';
import {SITE_NAME, DEFAULT_LOCALE} from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Web Developer`,
    short_name: SITE_NAME,
    description:
      'Freelance web developer building fast, reliable websites and web apps.',
    start_url: `/${DEFAULT_LOCALE}`,
    display: 'standalone',
    theme_color: '#234430',
    background_color: '#234430',
    icons: [
      {
        src: '/icon.svg',
        type: 'image/svg+xml',
        sizes: 'any',
        purpose: 'any'
      }
    ]
  };
}
