'use client';

import {useSyncExternalStore} from 'react';
import {useTranslations} from 'next-intl';
import type {CSSProperties} from 'react';

const track = {'--c': '6px'} as CSSProperties;
const knob = {'--c': '5px'} as CSSProperties;

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });
  return () => observer.disconnect();
}

const isDark = () => document.documentElement.classList.contains('dark');
const serverSnapshot = () => false;

export default function ThemeToggle() {
  const t = useTranslations('ThemeToggle');
  const dark = useSyncExternalStore(subscribe, isDark, serverSnapshot);

  function toggle() {
    const next = !isDark();
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t('label')}
      aria-pressed={dark}
      style={{...track, background: 'var(--line-strong)'}}
      className="chamfer-quad relative h-8 w-14.5 transition-colors"
    >
      <span
        suppressHydrationWarning
        style={{
          ...knob,
          background: 'var(--card)',
          transform: dark ? 'translateX(26px)' : 'translateX(0)'
        }}
        className="chamfer-quad absolute left-1 top-1 grid size-6 place-items-center transition-transform duration-300"
      >
        <span className="font-mono text-[11px] text-fg">{dark ? '☾' : '☀'}</span>
      </span>
    </button>
  );
}
