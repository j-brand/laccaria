import {getTranslations} from 'next-intl/server';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

export default async function ContactCTA() {
  const t = await getTranslations('ContactCTA');

  return (
    <section className="border-t border-border py-20">
      <Container className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {t('title')}
          </h2>
          <p className="mt-3 text-muted">{t('subtitle')}</p>
        </div>
        <Button href="/contact">{t('cta')}</Button>
      </Container>
    </section>
  );
}
