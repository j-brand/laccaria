/**
 * schema.org JSON-LD builders. All URLs are absolute (required by search
 * engines for structured data). Kept framework-agnostic so pages just call a
 * builder and pass the result to `<JsonLd>`.
 */

import {SITE_URL, SITE_NAME, AUTHOR, SOCIAL} from '@/lib/site';
import {absoluteUrl, pathFor} from '@/lib/seo';
import type {Project} from '@/lib/projects';

type Ld = Record<string, unknown>;

/** Stable `@id` for the one Person that represents the whole site. */
const PERSON_ID = `${SITE_URL}/#person`;

/** The site owner as a schema.org Person. `knowsAbout` describes expertise. */
export function personLd(knowsAbout: string[] = []): Ld {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: AUTHOR.name,
    jobTitle: AUTHOR.jobTitle,
    email: `mailto:${AUTHOR.email}`,
    url: SITE_URL,
    sameAs: [...SOCIAL],
    ...(knowsAbout.length > 0 ? {knowsAbout} : {}),
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Leipzig',
      addressCountry: 'DE'
    }
  };
}

/** The site itself, authored by the Person. */
export function websiteLd(locale: string): Ld {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: absoluteUrl(pathFor(locale)),
    inLanguage: locale,
    author: {'@id': PERSON_ID},
    publisher: {'@id': PERSON_ID}
  };
}

/** Breadcrumb trail. Home is prepended automatically. */
export function breadcrumbLd(
  locale: string,
  crumbs: {name: string; path: string}[]
): Ld {
  const items = [{name: SITE_NAME, path: ''}, ...crumbs];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absoluteUrl(pathFor(locale, c.path))
    }))
  };
}

/** A portfolio project as a CreativeWork authored by the Person. */
export function projectLd(locale: string, project: Project): Ld {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.summary,
    url: absoluteUrl(pathFor(locale, `/projects/${project.slug}`)),
    inLanguage: locale,
    author: {'@id': PERSON_ID},
    creator: {'@id': PERSON_ID},
    dateCreated: String(project.year),
    keywords: project.stack.join(', '),
    ...(project.hero || project.cover
      ? {image: absoluteUrl(project.hero ?? project.cover)}
      : {}),
    ...(project.client
      ? {sourceOrganization: {'@type': 'Organization', name: project.client}}
      : {})
  };
}
