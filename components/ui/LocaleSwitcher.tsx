'use client';

import {useTransition} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import type {CSSProperties} from 'react';
import {usePathname, useRouter} from '@/i18n/navigation';

const track = {'--c': '6px'} as CSSProperties;
const knob = {'--c': '5px'} as CSSProperties;

export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isEn = locale === 'en';
  const next = isEn ? 'de' : 'en';

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
      aria-pressed={isEn}
      style={{...track, background: 'var(--line-strong)'}}
      className="focus-ring chamfer-quad relative h-8 w-14.5 transition-colors disabled:opacity-70"
    >
      <span
        style={{
          ...knob,
          background: 'var(--card)',
          transform: isEn ? 'translateX(26px)' : 'translateX(0)'
        }}
        className="chamfer-quad absolute left-1 top-1 grid size-6 place-items-center transition-transform duration-300"
      >
        <span className="font-mono text-[10px] font-semibold text-fg">
          {locale.toUpperCase()}
        </span>
      </span>
    </button>
  );
}
