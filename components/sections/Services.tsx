import {getTranslations} from 'next-intl/server';
import type {CSSProperties} from 'react';
import Section from '@/components/ui/Section';
import {Code, Server, Layers, Pen, Chart} from '@/components/ui/icons';

const ITEMS = [
  {key: 'frontend', Icon: Code},
  {key: 'backend', Icon: Server},
  {key: 'fullstack', Icon: Layers},
  {key: 'wordpress', Icon: Pen},
  {key: 'performance', Icon: Chart}
] as const;

const iconBox: CSSProperties = {
  '--c': '8px',
  background: 'color-mix(in oklab, var(--primary) 12%, var(--card))'
} as CSSProperties;

export default async function Services() {
  const t = await getTranslations('Services');

  return (
    <Section
      id="services"
      number="02"
      eyebrow={t('eyebrow')}
      title={t('title')}
      subtitle={t('subtitle')}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map(({key, Icon}) => (
          <div key={key} className="cut-frame chamfer-md">
            <div className="cut-inner chamfer-md h-full p-6">
              <span
                className="chamfer-quad mb-4 grid size-[42px] place-items-center text-primary-text"
                style={iconBox}
              >
                <Icon size={21} />
              </span>
              <h3 className="mb-2 font-display text-[17px] font-semibold text-fg">
                {t(`items.${key}.title`)}
              </h3>
              <p className="text-sm leading-relaxed text-fg-muted">
                {t(`items.${key}.description`)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
