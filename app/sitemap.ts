import type {MetadataRoute} from 'next';
import {LOCALES, DEFAULT_LOCALE} from '@/lib/site';
import {absoluteUrl, pathFor} from '@/lib/seo';
import {getProjectSlugs} from '@/lib/projects';

/**
 * Static routes (locale-agnostic paths) and their crawl hints. Project detail
 * pages are appended dynamically from the content directory.
 */
const STATIC_ROUTES: {path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number}[] = [
  {path: '', changeFrequency: 'monthly', priority: 1},
  {path: '/projects', changeFrequency: 'weekly', priority: 0.8},
  {path: '/contact', changeFrequency: 'yearly', priority: 0.7},
  {path: '/imprint', changeFrequency: 'yearly', priority: 0.2},
  {path: '/privacy', changeFrequency: 'yearly', priority: 0.2}
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const paths = [
    ...STATIC_ROUTES,
    ...getProjectSlugs().map((slug) => ({
      path: `/projects/${slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.6
    }))
  ];

  // One entry per (locale, path) with the bilingual pair declared via
  // `alternates.languages` so Google links the de/en versions.
  return paths.flatMap(({path, changeFrequency, priority}) => {
    const languages: Record<string, string> = {};
    for (const l of LOCALES) languages[l] = absoluteUrl(pathFor(l, path));
    languages['x-default'] = absoluteUrl(pathFor(DEFAULT_LOCALE, path));

    return LOCALES.map((locale) => ({
      url: absoluteUrl(pathFor(locale, path)),
      lastModified,
      changeFrequency,
      priority,
      alternates: {languages}
    }));
  });
}
