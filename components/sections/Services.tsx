import {getTranslations} from 'next-intl/server';
import Section from '@/components/ui/Section';

const ITEMS = ['webApps', 'websites', 'consulting'] as const;

export default async function Services() {
  const t = await getTranslations('Services');

  return (
    <Section
      id="services"
      title={t('title')}
      subtitle={t('subtitle')}
      className="border-t border-border"
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((key) => (
          <div
            key={key}
            className="rounded-xl border border-border p-6"
          >
            <h3 className="text-lg font-semibold">
              {t(`items.${key}.title`)}
            </h3>
            <p className="mt-2 text-sm text-muted">
              {t(`items.${key}.description`)}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
