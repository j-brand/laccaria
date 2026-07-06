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
      id="work"
      number="03"
      eyebrow={t('eyebrow')}
      title={t('title')}
      subtitle={t('subtitle')}
    >
      <ProjectSlider
        projects={projects}
        viewProjectLabel={t('viewProject')}
        a11y={{
          containerRoleDescriptionMessage: t('a11y.carousel'),
          prevSlideMessage: t('a11y.prev'),
          nextSlideMessage: t('a11y.next'),
          paginationBulletMessage: t('a11y.goToSlide'),
          slideLabelMessage: t('a11y.slideLabel')
        }}
      />
      <div className="mt-4">
        <Button href="/projects" variant="secondary">
          {t('viewAll')}
        </Button>
      </div>
    </Section>
  );
}
