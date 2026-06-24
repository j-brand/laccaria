import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import Container from '@/components/ui/Container';

export default async function Footer() {
  const t = await getTranslations('Footer');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-10 text-sm text-muted">
      <Container className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p>
          © {year} Laccaria. {t('rights')}
        </p>
        <nav className="flex items-center gap-6">
          <Link href="/imprint" className="hover:text-foreground">
            {t('imprint')}
          </Link>
          <Link href="/privacy" className="hover:text-foreground">
            {t('privacy')}
          </Link>
        </nav>
      </Container>
    </footer>
  );
}
