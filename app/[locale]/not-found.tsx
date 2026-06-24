import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import Container from '@/components/ui/Container';

export default async function NotFound() {
  const t = await getTranslations('NotFound');

  return (
    <Container className="py-24 text-center">
      <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
      <p className="mt-3 text-muted">{t('body')}</p>
      <Link
        href="/"
        className="mt-6 inline-block text-accent hover:underline"
      >
        {t('home')}
      </Link>
    </Container>
  );
}
