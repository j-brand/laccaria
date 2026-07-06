import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import Container from '@/components/ui/Container';

// Next automatically emits `noindex` for not-found routes, so no metadata
// export is needed here.

export default async function NotFound() {
  const t = await getTranslations('NotFound');

  return (
    <Container className="py-28 text-center">
      <h1 className="font-display text-3xl font-bold tracking-tight text-fg">
        {t('title')}
      </h1>
      <p className="mt-3 text-fg-muted">{t('body')}</p>
      <Link
        href="/"
        className="mt-6 inline-block font-semibold text-primary hover:text-accent"
      >
        {t('home')}
      </Link>
    </Container>
  );
}
