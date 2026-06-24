import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import Section from '@/components/ui/Section';
import ProjectCard from '@/components/ProjectCard';
import {getAllProjects} from '@/lib/projects';

export async function generateMetadata(props: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await props.params;
  const t = await getTranslations({locale, namespace: 'Projects'});
  return {title: t('title'), description: t('subtitle')};
}

export default async function ProjectsPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Projects');
  const projects = getAllProjects(locale);

  return (
    <Section title={t('title')} subtitle={t('subtitle')}>
      {projects.length === 0 ? (
        <p className="text-muted">{t('empty')}</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}
    </Section>
  );
}
