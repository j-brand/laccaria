import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {MDXRemote} from 'next-mdx-remote/rsc';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';
import Container from '@/components/ui/Container';
import {getProject, getProjectSlugs} from '@/lib/projects';
import {mdxComponents} from '@/components/mdx-components';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getProjectSlugs().map((slug) => ({locale, slug}))
  );
}

export async function generateMetadata(props: {
  params: Promise<{locale: string; slug: string}>;
}): Promise<Metadata> {
  const {locale, slug} = await props.params;
  const project = getProject(slug, locale);
  if (!project) return {};
  return {title: project.meta.title, description: project.meta.summary};
}

export default async function ProjectDetailPage({
  params
}: {
  params: Promise<{locale: string; slug: string}>;
}) {
  const {locale, slug} = await params;
  setRequestLocale(locale);

  const project = getProject(slug, locale);
  if (!project) notFound();

  const {meta, content} = project;
  const t = await getTranslations('Projects');

  return (
    <article className="py-16 sm:py-24">
      <Container className="max-w-3xl">
        <Link
          href="/projects"
          className="text-sm text-muted hover:text-foreground"
        >
          ← {t('backToProjects')}
        </Link>

        <header className="mt-6">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {meta.title}
          </h1>
          <p className="mt-3 text-lg text-muted">{meta.summary}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted">
            <span>{meta.year}</span>
            {meta.url && (
              <a
                href={meta.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Live
              </a>
            )}
            {meta.repo && (
              <a
                href={meta.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Code
              </a>
            )}
          </div>
          <ul className="mt-4 flex flex-wrap gap-2">
            {meta.stack.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted"
              >
                {tech}
              </li>
            ))}
          </ul>
        </header>

        <div className="mt-10">
          <MDXRemote source={content} components={mdxComponents} />
        </div>
      </Container>
    </article>
  );
}
