import Image from 'next/image';
import {getTranslations} from 'next-intl/server';
import Section from '@/components/ui/Section';

export default async function About() {
  const t = await getTranslations('About');

  const facts = [
    {k: t('factLocationKey'), v: t('factLocationValue'), accent: false},
    {k: t('factFocusKey'), v: t('factFocusValue'), accent: false},
    {k: t('factAvailabilityKey'), v: t('factAvailabilityValue'), accent: true},
    {k: t('factLanguagesKey'), v: t('factLanguagesValue'), accent: false}
  ];

  return (
    <Section id="about" number="01" eyebrow={t('eyebrow')}>
      <div className="grid items-start gap-12 md:grid-cols-2">
        {/* portrait */}
        <div className="cut-frame chamfer-lg lift">
          <div className="cut-inner chamfer-lg relative aspect-[4/5] w-full bg-sunken">
            <Image
              src="/me.webp"
              alt={t('portraitAlt')}
              fill
              quality={90}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div>
          <h2 className="mb-6 max-w-[20ch] font-display text-[clamp(1.7rem,3.4vw,2.35rem)] font-semibold leading-[1.12] tracking-[-0.02em] text-fg">
            {t('title')}
          </h2>
          <p className="mb-4 max-w-[56ch] text-[16.5px] leading-relaxed text-fg-muted">
            {t('p1')}
          </p>
          <p className="mb-7 max-w-[56ch] text-[16.5px] leading-relaxed text-fg-muted">
            {t('p2')}
          </p>

          <div className="cut-frame chamfer-lg">
            <div className="cut-inner chamfer-lg bg-sunken px-7 py-2">
              {facts.map((f, i) => (
                <div
                  key={f.k}
                  className={`flex items-baseline justify-between py-3.5 ${
                    i < facts.length - 1 ? 'border-b border-line' : ''
                  }`}
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-fg-subtle">
                    {f.k}
                  </span>
                  <span
                    className={`text-sm font-semibold ${
                      f.accent ? 'text-primary' : 'text-fg'
                    }`}
                  >
                    {f.v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
