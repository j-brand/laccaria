import {getTranslations} from 'next-intl/server';
import type {CSSProperties} from 'react';
import {Mail, GitHub, LinkedIn} from '@/components/ui/icons';

const EMAIL = 'johannes@laccaria.de';

const LINKS = [
  {label: 'Email', value: EMAIL, href: `mailto:${EMAIL}`, Icon: Mail, external: false},
  {
    label: 'GitHub',
    value: 'github.com/johannesbrand',
    href: 'https://github.com/johannesbrand',
    Icon: GitHub,
    external: true
  },
  {
    label: 'LinkedIn',
    value: 'in/johannesbrand',
    href: 'https://linkedin.com/in/johannesbrand',
    Icon: LinkedIn,
    external: true
  }
] as const;

const iconBox: CSSProperties = {
  '--c': '8px',
  background: 'color-mix(in oklab, var(--primary) 12%, var(--card))'
} as CSSProperties;

export default async function ContactLinks() {
  const t = await getTranslations('Contact');

  return (
    <div className="flex flex-col gap-3">
      <p className="mb-1 mt-0.5 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">
        {t('orReach')}
      </p>
      {LINKS.map(({label, value, href, Icon, external}) => (
        <a
          key={label}
          href={href}
          {...(external ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
          className="cut-frame chamfer-md block"
        >
          <div className="cut-inner chamfer-md flex items-center gap-3.5 px-4 py-4">
            <span
              className="chamfer-quad grid size-10 shrink-0 place-items-center text-primary"
              style={iconBox}
            >
              <Icon size={19} />
            </span>
            <span>
              <span className="block font-mono text-[11px] uppercase tracking-[0.1em] text-fg-subtle">
                {label}
              </span>
              <span className="block text-[15px] font-semibold text-fg">
                {value}
              </span>
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}
