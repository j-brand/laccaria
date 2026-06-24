import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import Container from '@/components/ui/Container';
import LocaleSwitcher from '@/components/ui/LocaleSwitcher';

export default async function Header() {
  const t = await getTranslations('Nav');

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="text-lg font-bold tracking-tight">
          Laccaria
        </Link>
        <nav
          aria-label={t('ariaLabel')}
          className="flex items-center gap-6 text-sm"
        >
          <Link href="/projects" className="text-muted hover:text-foreground">
            {t('projects')}
          </Link>
          <Link href="/contact" className="text-muted hover:text-foreground">
            {t('contact')}
          </Link>
          <LocaleSwitcher />
        </nav>
      </Container>
    </header>
  );
}
