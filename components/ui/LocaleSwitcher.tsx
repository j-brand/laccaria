'use client';

import {useTransition} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {usePathname, useRouter} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';

export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function onSelect(nextLocale: string) {
    startTransition(() => {
      // `pathname` is locale-agnostic; the router re-applies the new locale.
      router.replace(pathname, {locale: nextLocale});
    });
  }

  return (
    <div
      className="inline-flex items-center gap-1 text-sm"
      aria-label={t('label')}
    >
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => onSelect(loc)}
          disabled={isPending || loc === locale}
          aria-current={loc === locale}
          className={`rounded px-2 py-1 uppercase transition-colors ${
            loc === locale
              ? 'font-semibold text-foreground'
              : 'text-muted hover:text-foreground'
          }`}
        >
          {loc}
        </button>
      ))}
    </div>
  );
}
