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
        <div className="flex flex-col gap-1 font-mono text-[11px] tracking-[0.06em] text-fg-subtle">
          <span>© {new Date().getFullYear()} Laccaria</span>
          <span className="inline-flex items-center gap-1">
            {t('madeWith')}
            <Mark width={14} className="mx-0.5 inline-block" aria-hidden />
            {t('byAuthor')}
          </span>
        </div>
        <nav aria-label={t('navLabel')}>
          <ul className="flex items-center gap-5">
            <li>
              <Link
                href="/imprint"
                className="font-mono text-[11px] tracking-[0.06em] text-fg-subtle hover:text-fg"
              >
                {t('imprint')}
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="font-mono text-[11px] tracking-[0.06em] text-fg-subtle hover:text-fg"
              >
                {t('privacy')}
              </Link>
            </li>
            <li>
              <Link
                href="/accessibility"
                className="font-mono text-[11px] tracking-[0.06em] text-fg-subtle hover:text-fg"
              >
                {t('accessibility')}
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <span className="font-mono text-[11px] tracking-[0.06em] text-fg-subtle">
              {t('language')}
            </span>
            <LocaleSwitcher />
          </span>
          <span className="flex items-center gap-2">
            <span className="font-mono text-[11px] tracking-[0.06em] text-fg-subtle">
              {t('theme')}
            </span>
            <ThemeToggle />
          </span>
        </div>
      </Container>
    </footer>
  );
}
