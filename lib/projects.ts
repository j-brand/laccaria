import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import {routing} from '@/i18n/routing';

export type ProjectFrontmatter = {
  title: string;
  summary: string;
  year: number;
  stack: string[];
  cover: string;
  url?: string;
  repo?: string;
  featured?: boolean;
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
