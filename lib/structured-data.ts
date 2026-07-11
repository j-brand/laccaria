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

/** Stable `@id` for the WebSite node (see {@link websiteLd}). */
const WEBSITE_ID = `${SITE_URL}/#website`;

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
    image: absoluteUrl('/me.webp'),
    sameAs: [...SOCIAL],
    ...(knowsAbout.length > 0 ? {knowsAbout} : {}),
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Leipzig',
      addressCountry: 'DE'
    },
    // Local-SEO signals: where the work happens, and the occupation tied to
    // the city (schema.org's pattern for "web developer in Leipzig").
    workLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Leipzig',
        addressCountry: 'DE'
      }
    },
    hasOccupation: {
      '@type': 'Occupation',
      name: AUTHOR.jobTitle,
      occupationLocation: {'@type': 'City', name: 'Leipzig'}
    }
  };
}

/** The site itself, authored by the Person. */
export function websiteLd(locale: string): Ld {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE_NAME,
    url: absoluteUrl(pathFor(locale)),
    inLanguage: locale,
    author: {'@id': PERSON_ID},
    publisher: {'@id': PERSON_ID}
  };
}

/**
 * The landing page as a ProfilePage about the Person — Google's rich-result
 * type for personal profile/homepage documents. Emit alongside
 * {@link personLd} + {@link websiteLd} so `mainEntity` resolves by `@id`.
 */
export function profilePageLd(locale: string): Ld {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: absoluteUrl(pathFor(locale)),
    inLanguage: locale,
    isPartOf: {'@id': WEBSITE_ID},
    mainEntity: {'@id': PERSON_ID}
  };
}

/**
 * The project index as an ordered list of works, so search engines see the
 * portfolio as a collection rather than unrelated pages.
 */
export function projectListLd(locale: string, projects: Project[]): Ld {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: projects.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.title,
      url: absoluteUrl(pathFor(locale, `/projects/${p.slug}`))
    }))
  };
}

/** The contact page, typed as such and pointing back at the Person. */
export function contactPageLd(locale: string, name: string): Ld {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name,
    url: absoluteUrl(pathFor(locale, '/contact')),
    inLanguage: locale,
    isPartOf: {'@id': WEBSITE_ID},
    about: {'@id': PERSON_ID}
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
    ...(project.updated ? {dateModified: project.updated} : {}),
    keywords: project.stack.join(', '),
    ...(project.hero || project.cover
      ? {image: absoluteUrl(project.hero ?? project.cover)}
      : {}),
    ...(project.client
      ? {sourceOrganization: {'@type': 'Organization', name: project.client}}
      : {})
  };
}
