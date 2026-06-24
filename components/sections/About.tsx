import {getTranslations} from 'next-intl/server';
import Section from '@/components/ui/Section';

export default async function About() {
  const t = await getTranslations('About');

  return (
    <Section id="about" title={t('title')} className="border-t border-border">
      <p className="max-w-2xl text-lg leading-relaxed text-muted">{t('body')}</p>
    </Section>
  );
}
