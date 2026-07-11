import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import Section from '@/components/ui/Section';
import ProjectCard from '@/components/ProjectCard';
import JsonLd from '@/components/seo/JsonLd';
import {breadcrumbLd} from '@/lib/structured-data';
import {buildAlternates, buildOpenGraph} from '@/lib/seo';
import {getAllProjects} from '@/lib/projects';

const PATH = '/projects';

export async function generateMetadata(props: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await props.params;
  const t = await getTranslations({locale, namespace: 'Projects'});
  const title = t('title');
  const description = t('subtitle');
  return {
    title,
    description,
    alternates: buildAlternates(locale, PATH),
    openGraph: buildOpenGraph({locale, title, description, path: PATH})
  };
}

export default async function ProjectsPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Projects');
  const tf = await getTranslations('FeaturedProjects');
  const projects = getAllProjects(locale);

  const breadcrumb = breadcrumbLd(locale, [
    {name: t('title'), path: PATH}
  ]);

  return (
    <Section title={t('title')} titleAs="h1" subtitle={t('subtitle')} divider={false} className="pt-10">
      <JsonLd data={breadcrumb} />
      {projects.length === 0 ? (
        <p className="text-fg-muted">{t('empty')}</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              viewProjectLabel={tf('viewProject')}
              titleAs="h2"
            />
          ))}
        </div>
      )}
    </Section>
  );
}
