/**
 * Shared metadata helpers so every `generateMetadata` stays DRY and consistent.
 * Returns values are relative paths where possible — Next.js resolves them
 * against `metadataBase` (set in the locale layout).
 */

import type {Metadata} from 'next';
import type {Locale} from 'next-intl';
import {SITE_URL, SITE_NAME, OG_LOCALE, LOCALES, DEFAULT_LOCALE} from '@/lib/site';
import {getPathname} from '@/i18n/navigation';

/** Absolute URL for a locale-prefixed or root path (e.g. `/de/contact`). */
export function absoluteUrl(path = ''): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`.replace(
    /\/$/,
    ''
  );
}

/**
 * The site-wide social card, as an absolute URL. Static asset in `public/`.
 * Absolute (not relative) so it never resolves against the request/build origin
 * — important for self-hosting behind a fixed domain.
 */
export const OG_IMAGE = {
  url: absoluteUrl('/laccaria-og.png'),
  width: 1200,
  height: 630,
  alt: 'Johannes Brand — Web Developer'
} as const;

/**
 * Locale-aware path for a page, honouring `localePrefix` from the routing
 * config (single source of truth). With `as-needed`: default locale is
 * unprefixed (`pathFor('de', '/contact')` → `/contact`, `pathFor('de', '')` →
 * `/`), other locales are prefixed (`pathFor('en', '/contact')` → `/en/contact`).
 */
export function pathFor(locale: string, path = ''): string {
  return getPathname({href: path || '/', locale: locale as Locale});
}

/**
 * Canonical + hreflang alternates for a page. `path` is the locale-agnostic
 * route (`''` for home, `'/contact'`, `'/projects/acme-shop'`, …).
 * `x-default` points at the default locale.
 */
export function buildAlternates(
  locale: string,
  path = ''
): NonNullable<Metadata['alternates']> {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = pathFor(l, path);
  languages['x-default'] = pathFor(DEFAULT_LOCALE, path);
  return {canonical: pathFor(locale, path), languages};
}

/** OpenGraph block for a page. Social image comes from `opengraph-image.tsx`. */
export function buildOpenGraph({
  locale,
  title,
  description,
  path = '',
  type = 'website'
}: {
  locale: string;
  title: string;
  description?: string;
  path?: string;
  type?: 'website' | 'article' | 'profile';
}): NonNullable<Metadata['openGraph']> {
  return {
    type,
    title,
    description,
    url: pathFor(locale, path),
    siteName: SITE_NAME,
    locale: OG_LOCALE[locale] ?? OG_LOCALE[DEFAULT_LOCALE],
    alternateLocale: LOCALES.filter((l) => l !== locale).map(
      (l) => OG_LOCALE[l]
    ),
    images: [OG_IMAGE]
  };
}
