/**
 * Central site metadata — the single source of truth for canonical URL,
 * brand identity and social profiles. Consumed by the SEO helpers
 * (`lib/seo.ts`), structured data (`components/seo/JsonLd.tsx`), the sitemap,
 * robots and manifest. Override the base URL per environment via
 * `NEXT_PUBLIC_SITE_URL` (see `.env.example`).
 */

import {routing} from '@/i18n/routing';

/** Canonical origin, no trailing slash. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://laccaria.de'
).replace(/\/$/, '');

export const SITE_NAME = 'Johannes Brand';

export const AUTHOR = {
  name: 'Johannes Brand',
  /** Not translated — a stable identity label for structured data. */
  jobTitle: 'Web Developer',
  email: 'johannes@laccaria.de'
} as const;

/** Public profiles — used for the Person `sameAs` in structured data. */
export const SOCIAL = [
  'https://github.com/j-brand',
  'https://linkedin.com/in/joh-brand'
] as const;

/** Maps our locale codes to OpenGraph `og:locale` values. */
export const OG_LOCALE: Record<string, string> = {
  de: 'de_DE',
  en: 'en_US'
};

export const DEFAULT_LOCALE = routing.defaultLocale;
export const LOCALES = routing.locales;
