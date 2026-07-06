import type {Metadata} from 'next';
import type {CSSProperties} from 'react';
import {notFound} from 'next/navigation';
import {MDXRemote} from 'next-mdx-remote/rsc';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';
import Container from '@/components/ui/Container';
import {ArrowLeft, ArrowRight} from '@/components/ui/icons';
import {mdxComponents} from '@/components/mdx-components';
import JsonLd from '@/components/seo/JsonLd';
import {breadcrumbLd, projectLd} from '@/lib/structured-data';
import {buildAlternates, buildOpenGraph} from '@/lib/seo';
import {
  DEFAULT_GRADIENT,
  getAllProjects,
  getProject,
  getProjectSlugs
} from '@/lib/projects';

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
  const {title, summary} = project.meta;
  const path = `/projects/${slug}`;
  return {
    title,
    description: summary,
    alternates: buildAlternates(locale, path),
    openGraph: buildOpenGraph({
      locale,
      title,
      description: summary,
      path,
      type: 'article'
    })
  };
}

const chipFrame = {'--c': '6px', '--bd': 'var(--line-strong)'} as CSSProperties;

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
  const t = await getTranslations('Project');
  const tp = await getTranslations('Projects');
  const gradient = meta.gradient ?? DEFAULT_GRADIENT;

  const breadcrumb = breadcrumbLd(locale, [
    {name: tp('title'), path: '/projects'},
    {name: meta.title, path: `/projects/${meta.slug}`}
  ]);
  const creativeWork = projectLd(locale, meta);

  const metaRow = [
    {k: t('roleKey'), v: meta.role},
    {k: t('timelineKey'), v: meta.timeline},
    {k: t('clientKey'), v: meta.client}
  ].filter((row) => Boolean(row.v));

  const others = getAllProjects(locale)
    .filter((p) => p.slug !== meta.slug)
    .slice(0, 3);

  return (
    <Container narrow>
      <JsonLd data={[breadcrumb, creativeWork]} />
      {/* back */}
      <Link
        href="/projects"
        className="jb-back mt-8 inline-flex items-center gap-2 text-sm font-semibold text-fg-muted hover:text-fg"
      >
        <span className="ic transition-transform">
          <ArrowLeft size={16} />
        </span>
        {t('back')}
      </Link>

      {/* title block */}
      <div className="mb-3.5 mt-6 flex flex-wrap items-baseline gap-3 font-mono text-[11px]">
        {meta.kind && (
          <span className="uppercase tracking-[0.14em] text-accent">
            {meta.kind}
          </span>
        )}
        {meta.kind && <span className="text-fg-subtle">·</span>}
        <span className="text-fg-subtle">{meta.year}</span>
      </div>
      <h1 className="font-display text-[clamp(2.2rem,5.2vw,3.4rem)] font-bold leading-[1.05] tracking-[-0.025em] text-fg">
        {meta.title}
      </h1>
      <p className="mt-4 max-w-[56ch] text-[19px] leading-relaxed text-fg-muted">
        {meta.tagline ?? meta.summary}
      </p>

      {/* banner */}
      <div
        className="chamfer-xl lift relative mt-9 h-[280px] overflow-hidden"
        style={{background: gradient}}
      >
        <span className="absolute bottom-6 left-6 font-display text-[clamp(2.4rem,7vw,4.4rem)] font-bold leading-none tracking-[-0.03em] text-white/15">
          {meta.title}
        </span>
      </div>

      {/* meta row */}
      {metaRow.length > 0 && (
        <div className="mt-9 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-px bg-line shadow-[0_0_0_1px_var(--line)]">
          {metaRow.map(({k, v}) => (
            <div key={k} className="bg-card px-5 py-4.5">
              <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-fg-subtle">
                {k}
              </p>
              <p className="text-sm font-semibold text-fg">{v}</p>
            </div>
          ))}
        </div>
      )}

      {/* body */}
      <div className="mt-14 grid grid-cols-1 items-start gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,300px)]">
        <div>
          <MDXRemote source={content} components={mdxComponents} />
        </div>

        <aside className="flex flex-col gap-7">
          <div className="cut-frame chamfer-md">
            <div className="cut-inner chamfer-md bg-sunken p-6">
              <p className="mb-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">
                {t('builtWithHeading')}
              </p>
              <div className="flex flex-wrap gap-2">
                {meta.stack.map((tech) => (
                  <span
                    key={tech}
                    className="cut-frame chamfer-sm inline-block"
                    style={chipFrame}
                  >
                    <span className="cut-inner chamfer-sm block px-[11px] py-1.5 text-[13px] font-medium text-fg-muted">
                      {tech}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {meta.results && meta.results.length > 0 && (
            <div className="cut-frame chamfer-md">
              <div className="cut-inner chamfer-md p-6">
                <p className="mb-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">
                  {t('resultsHeading')}
                </p>
                <div className="flex flex-col gap-3.5">
                  {meta.results.map((r) => (
                    <div key={r.label} className="flex items-baseline gap-3">
                      <span className="min-w-14 shrink-0 font-display text-xl font-bold text-accent">
                        {r.metric}
                      </span>
                      <span className="text-[13.5px] leading-snug text-fg-muted">
                        {r.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* CTA */}
      <div
        className="chamfer-lg mt-16 flex flex-wrap items-center justify-between gap-5 bg-primary p-10"
      >
        <div>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            {t('ctaEyebrow')}
          </p>
          <h3 className="font-display text-2xl font-semibold tracking-[-0.01em] text-white">
            {t('ctaTitle')}
          </h3>
        </div>
        <Link
          href="/#contact"
          style={{'--c': '8px'} as CSSProperties}
          className="chamfer-quad inline-flex items-center gap-2 bg-accent px-[22px] py-3 text-[15px] font-semibold text-[#232118] transition hover:brightness-105"
        >
          {t('ctaButton')}
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* more projects */}
      {others.length > 0 && (
        <div className="mb-4 mt-14">
          <p className="mb-4.5 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">
            {t('moreHeading')}
          </p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3.5">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/projects/${o.slug}`}
                className="cut-frame chamfer-md block"
              >
                <div className="cut-inner chamfer-md overflow-hidden">
                  <div
                    className="h-[76px]"
                    style={{background: o.gradient ?? DEFAULT_GRADIENT}}
                  />
                  <div className="px-4 py-3.5">
                    {o.kind && (
                      <p className="mb-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-accent">
                        {o.kind}
                      </p>
                    )}
                    <p className="font-display text-[15px] font-semibold text-fg">
                      {o.title}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}
