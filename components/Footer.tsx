import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import Container from '@/components/ui/Container';
import Mark from '@/components/ui/Mark';
import LocaleSwitcher from '@/components/ui/LocaleSwitcher';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default async function Footer() {
  const t = await getTranslations('Footer');

  return (
    <footer className="border-t border-line">
      <Container className="flex flex-wrap items-center justify-between gap-3 py-7">
        <span className="inline-flex items-center gap-2.5">
          <Mark width={18} aria-hidden />
          <span className="font-mono text-[11px] tracking-[0.06em] text-fg-subtle">
            {t('rights')}
          </span>
        </span>
        <nav aria-label={t('navLabel')} className="flex items-center gap-5">
          <Link
            href="/imprint"
            className="font-mono text-[11px] tracking-[0.06em] text-fg-subtle hover:text-fg"
          >
            {t('imprint')}
          </Link>
          <Link
            href="/privacy"
            className="font-mono text-[11px] tracking-[0.06em] text-fg-subtle hover:text-fg"
          >
            {t('privacy')}
          </Link>
          <span className="font-mono text-[11px] tracking-[0.06em] text-fg-subtle">
            {t('tagline')}
          </span>
        </nav>
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </Container>
    </footer>
  );
}
