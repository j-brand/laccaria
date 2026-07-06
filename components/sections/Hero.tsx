import {getTranslations} from 'next-intl/server';
import type {CSSProperties} from 'react';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

const STATS = [
  {n: 'stat1n', l: 'stat1l'},
  {n: 'stat2n', l: 'stat2l'},
  {n: 'stat3n', l: 'stat3l'}
] as const;

const badge: CSSProperties = {
  '--c': '7px',
  background: 'color-mix(in oklab, var(--primary) 12%, var(--card))'
} as CSSProperties;

export default async function Hero() {
  const t = await getTranslations('Hero');

  return (
    <section id="top">
      <Container className="grid items-center gap-14 py-20 md:grid-cols-2">
        <div>
          <div
            className="chamfer-tr mb-5 inline-flex items-center gap-2 px-3 py-1.5"
            style={badge}
          >
            <span
              className="size-2 rounded-full bg-accent"
              style={{
                boxShadow:
                  '0 0 0 3px color-mix(in oklab, var(--accent) 30%, transparent)'
              }}
            />
            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-primary">
              {t('status')}
            </span>
          </div>

          <p className="mb-4 font-mono text-xs uppercase tracking-[0.16em] text-accent-text">
            {t('eyebrow')}
          </p>
          <h1 className="max-w-[16ch] font-display text-[clamp(2.4rem,5.4vw,3.9rem)] font-bold leading-[1.04] tracking-[-0.025em] text-fg">
            {t('title')}
          </h1>
          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-fg-muted">
            {t('sub')}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/#work" arrow>
              {t('cta1')}
            </Button>
            <Button href="/contact" variant="secondary">
              {t('cta2')}
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap gap-10 border-t border-line pt-8">
            {STATS.map(({n, l}) => (
              <div key={n}>
                <div className="font-display text-3xl font-bold text-fg">
                  {t(n)}
                </div>
                <div className="max-w-[14ch] text-[13px] leading-tight text-fg-muted">
                  {t(l)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <HeroCodeWindow />
      </Container>
    </section>
  );
}

function HeroCodeWindow() {
  return (
    <div className="w-full justify-self-center md:max-w-[420px]">
      <div className="cut-frame chamfer-lg lift">
        <div className="cut-inner chamfer-lg overflow-hidden">
          <div className="flex items-center gap-[7px] border-b border-line px-4 py-3.5">
            <span className="size-[11px] rounded-full bg-secondary" />
            <span className="size-[11px] rounded-full bg-accent" />
            <span className="size-[11px] rounded-full bg-primary" />
            <span className="ml-1.5 font-mono text-[11px] text-fg-subtle">
              johannes.ts
            </span>
          </div>
          <pre className="m-0 overflow-x-auto px-5 py-5 font-mono text-[13px] leading-[1.7] text-fg-muted">
            <span className="text-secondary">const</span>{' '}
            <span className="text-fg">dev</span> ={' {\n'}
            {'  name: '}
            <span className="text-primary">&apos;Johannes Brand&apos;</span>
            {',\n'}
            {'  stack: ['}
            <span className="text-primary">&apos;react&apos;</span>,{' '}
            <span className="text-primary">&apos;node&apos;</span>,{' '}
            <span className="text-primary">&apos;ts&apos;</span>
            {'],\n'}
            {'  ships: '}
            <span className="text-accent-text">true</span>
            {',\n'}
            {'  filler: '}
            <span className="text-accent-text">false</span>
            {',\n'}
            {'};\n\n'}
            <span className="text-secondary">export default</span> dev;
          </pre>
        </div>
      </div>
    </div>
  );
}
