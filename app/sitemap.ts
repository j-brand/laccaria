import type {MetadataRoute} from 'next';
import {LOCALES, DEFAULT_LOCALE} from '@/lib/site';
import {absoluteUrl, pathFor} from '@/lib/seo';
import {getAllProjects, projectLastModified} from '@/lib/projects';

type SitemapEntry = {
  path: string;
  lastModified: Date;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
};

export default function sitemap(): MetadataRoute.Sitemap {
  // Static pages have no content date, so they carry the build time. Project
  // detail pages carry their own `updated`/`year`-derived date instead.
  const buildTime = new Date();

  const staticRoutes: SitemapEntry[] = (
    [
      {path: '', changeFrequency: 'monthly', priority: 1},
      {path: '/projects', changeFrequency: 'weekly', priority: 0.8},
      {path: '/contact', changeFrequency: 'yearly', priority: 0.7},
      {path: '/imprint', changeFrequency: 'yearly', priority: 0.2},
      {path: '/privacy', changeFrequency: 'yearly', priority: 0.2},
      {path: '/accessibility', changeFrequency: 'yearly', priority: 0.2}
    ] as const
  ).map((r) => ({...r, lastModified: buildTime}));

  // Locale is irrelevant to the modified date, so read the default locale.
  const projectRoutes: SitemapEntry[] = getAllProjects(DEFAULT_LOCALE).map(
    (project) => ({
      path: `/projects/${project.slug}`,
      lastModified: projectLastModified(project),
      changeFrequency: 'monthly',
      priority: 0.6
    })
  );

  const entries = [...staticRoutes, ...projectRoutes];

  // One entry per (locale, path) with the bilingual pair declared via
  // `alternates.languages` so Google links the de/en versions.
  return entries.flatMap(({path, lastModified, changeFrequency, priority}) => {
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
