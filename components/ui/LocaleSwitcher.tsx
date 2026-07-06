'use client';

import {useTransition} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import type {CSSProperties} from 'react';
import {usePathname, useRouter} from '@/i18n/navigation';

const chamfer = {'--c': '6px'} as CSSProperties;

export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const next = locale === 'en' ? 'de' : 'en';

  function onSelect() {
    startTransition(() => {
      // `pathname` is locale-agnostic; the router re-applies the new locale.
      router.replace(pathname, {locale: next});
    });
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={isPending}
      aria-label={t('label')}
      style={chamfer}
      className="chamfer-quad grid h-[34px] w-10 place-items-center font-mono text-xs font-semibold text-fg-muted shadow-[inset_0_0_0_1px_var(--line-strong)] transition-colors hover:text-fg"
    >
      {next.toUpperCase()}
    </button>
  );
}
