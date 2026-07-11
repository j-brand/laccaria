import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import Container from '@/components/ui/Container';
import Mark from '@/components/ui/Mark';
import MobileMenu from '@/components/MobileMenu';

const NAV = [
  {href: '/#work', key: 'work'},
  {href: '/#about', key: 'about'},
  {href: '/#services', key: 'services'},
  {href: '/#stack', key: 'stack'}
] as const;

export default async function Header() {
  const t = await getTranslations('Nav');

  return (
    <header
      className="sticky top-0 z-30 border-b border-line backdrop-blur-md"
      style={{background: 'color-mix(in oklab, var(--bg) 82%, transparent)'}}
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <Mark width={36} />
          <span className="leading-tight">
            <span className="block font-display text-[15px] font-bold tracking-[-0.01em] text-fg">
              Johannes Brand
            </span>
            <span className="block font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg-subtle">
              {t('role')}
            </span>
          </span>
        </Link>

        <nav
          aria-label={t('ariaLabel')}
          className="hidden items-center gap-1 md:flex"
        >
          {NAV.map(({href, key}) => (
            <Link
              key={key}
              href={href}
              className="px-3 py-2 text-sm font-medium text-fg-muted transition-colors hover:text-fg"
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/contact"
            style={{'--c': '7px'} as React.CSSProperties}
            className="focus-ring chamfer-quad bg-primary px-[15px] py-[9px] text-sm font-semibold text-primary-fg transition hover:brightness-110"
          >
            {t('hire')}
          </Link>
        </div>

        <MobileMenu
          items={NAV.map(({href, key}) => ({href, label: t(key)}))}
          hireHref="/contact"
          hireLabel={t('hire')}
          openLabel={t('openMenu')}
          closeLabel={t('closeMenu')}
          navLabel={t('mobileNavLabel')}
        />
      </Container>
    </header>
  );
}
