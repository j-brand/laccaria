import {getTranslations} from 'next-intl/server';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

export default async function Hero() {
  const t = await getTranslations('Hero');

  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-widest text-accent">
            {t('eyebrow')}
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
            {t('title')}
          </h1>
          <p className="mt-6 text-lg text-muted">{t('subtitle')}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/projects">{t('ctaPrimary')}</Button>
            <Button href="/contact" variant="secondary">
              {t('ctaSecondary')}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
