import {getLocale, getTranslations} from 'next-intl/server';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import ProjectSlider from '@/components/ProjectSlider';
import {getFeaturedProjects} from '@/lib/projects';

export default async function FeaturedProjects() {
  const locale = await getLocale();
  const t = await getTranslations('FeaturedProjects');
  const projects = getFeaturedProjects(locale);

  if (projects.length === 0) return null;

  return (
    <Section
      id="projects"
      title={t('title')}
      subtitle={t('subtitle')}
      className="border-t border-border"
    >
      <ProjectSlider projects={projects} />
      <div className="mt-4">
        <Button href="/projects" variant="secondary">
          {t('viewAll')}
        </Button>
      </div>
    </Section>
  );
}
