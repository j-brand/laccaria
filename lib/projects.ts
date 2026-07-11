import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import {routing} from '@/i18n/routing';

export {DEFAULT_GRADIENT} from './gradients';

export type ProjectResult = {metric: string; label: string};

export type ProjectImage = {
  /** Full-resolution (often tall) screenshot shown scrollable in the lightbox. */
  src: string;
  alt: string;
  /** Small mono eyebrow shown above the caption title in the slider (optional). */
  eyebrow?: string;
  /** Cropped preview for the slider tile; falls back to `src` when omitted. */
  thumb?: string;
  /** Intrinsic px of the full image — enables next/image in the lightbox (no CLS). */
  width?: number;
  height?: number;
  /** Tall phone screenshot — shown at half width in the lightbox to stay readable. */
  portrait?: boolean;
};

export type ProjectFrontmatter = {
  title: string;
  summary: string;
  year: number;
  /**
   * ISO date (`YYYY-MM-DD`) of the last meaningful change to this case study.
   * Feeds the sitemap `lastModified` and the JSON-LD `dateModified`. Optional —
   * falls back to Jan 1 of {@link year} when omitted (see `projectLastModified`).
   */
  updated?: string;
  stack: string[];
  cover: string;
  url?: string;
  repo?: string;
  featured?: boolean;
  /** Short category shown as the mono eyebrow, e.g. "Booking platform". */
  kind?: string;
  /** One-line lead under the title on the detail page. */
  tagline?: string;
  /** CSS gradient used for the banner/card visual (fallback when no hero image). */
  gradient?: string;
  role?: string;
  timeline?: string;
  client?: string;
  /** Headline metrics for the detail-page sidebar. */
  results?: ProjectResult[];
  /** 16:9 desktop screenshot shown in the browser-chrome hero. */
  hero?: string;
  /**
   * Responsive pair: a desktop shot with an overlapping phone shot. `desktop`/
   * `mobile` are the cropped previews shown in the tiles; `desktopFull`/
   * `mobileFull` are the full-page screenshots loaded in the lightbox on click
   * (each falls back to its preview when omitted).
   */
  shots?: {
    desktop?: string;
    desktopFull?: string;
    mobile?: string;
    mobileFull?: string;
  };
  /** Detail gallery grid (click a thumb to enlarge). */
  gallery?: ProjectImage[];
};

export type Project = ProjectFrontmatter & {slug: string};

const CONTENT_DIR = path.join(process.cwd(), 'content', 'projects');

function fileFor(slug: string, locale: string) {
  return path.join(CONTENT_DIR, `${slug}.${locale}.mdx`);
}

/** Unique project slugs derived from `<slug>.<locale>.mdx` files. */
export function getProjectSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const slugs = new Set<string>();
  for (const file of fs.readdirSync(CONTENT_DIR)) {
    const match = file.match(/^(.+)\.(de|en)\.mdx$/);
    if (match) slugs.add(match[1]);
  }
  return [...slugs];
}

/** A single project's frontmatter + MDX body, falling back to the default locale. */
export function getProject(
  slug: string,
  locale: string
): {meta: Project; content: string} | null {
  let file = fileFor(slug, locale);
  if (!fs.existsSync(file)) {
    file = fileFor(slug, routing.defaultLocale);
    if (!fs.existsSync(file)) return null;
  }
  const {data, content} = matter(fs.readFileSync(file, 'utf8'));
  return {meta: {slug, ...(data as ProjectFrontmatter)}, content};
}

/** All projects for a locale, newest first. */
export function getAllProjects(locale: string): Project[] {
  return getProjectSlugs()
    .map((slug) => getProject(slug, locale)?.meta)
    .filter((meta): meta is Project => Boolean(meta))
    .sort((a, b) => b.year - a.year);
}

/** Projects flagged `featured: true` (for the landing-page slider). */
export function getFeaturedProjects(locale: string): Project[] {
  return getAllProjects(locale).filter((project) => project.featured);
}

/**
 * Best-known last-modified date for a project: the explicit `updated`
 * frontmatter date when set, otherwise Jan 1 of its `year`. Content-derived
 * and stable across rebuilds (unlike a build-time `new Date()`).
 */
export function projectLastModified(project: Project): Date {
  return new Date(project.updated ?? `${project.year}-01-01T00:00:00Z`);
}
