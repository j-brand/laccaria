import {getTranslations} from 'next-intl/server';
import type {CSSProperties} from 'react';
import Section from '@/components/ui/Section';

// Tool/stack names are proper nouns and stay untranslated.
const GROUPS = [
  {
    label: 'group1',
    items: ['React', 'Vue', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Astro']
  },
  {
    label: 'group2',
    items: [
      'Node.js',
      'PostgreSQL',
      'GraphQL',
      'Prisma',
      'PHP / WordPress',
      'Redis'
    ]
  },
  {
    label: 'group3',
    items: ['Git', 'Docker', 'Vite', 'Playwright', 'Vercel', 'Figma']
  }
] as const;

const chamferSm: CSSProperties = {'--c': '6px'} as CSSProperties;

export default async function Stack() {
  const t = await getTranslations('Stack');

  return (
    <Section
      id="stack"
      number="04"
      eyebrow={t('eyebrow')}
      title={t('title')}
      subtitle={t('subtitle')}
    >
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {GROUPS.map(({label, items}) => (
          <div key={label}>
            <p className="mb-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">
              {t(label)}
            </p>
            <div className="flex flex-wrap gap-2">
              {items.map((tool) => (
                <span
                  key={tool}
                  className="cut-frame chamfer-sm inline-block"
                  style={{...chamferSm, '--bd': 'var(--line-strong)'} as CSSProperties}
                >
                  <span className="cut-inner chamfer-sm block px-[11px] py-1.5 text-[13px] font-medium text-fg-muted">
                    {tool}
                  </span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
