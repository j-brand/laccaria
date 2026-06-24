import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import Section from '@/components/ui/Section';

export async function generateMetadata(props: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await props.params;
  const t = await getTranslations({locale, namespace: 'Imprint'});
  return {title: t('title')};
}

export default async function ImprintPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Imprint');

  return (
    <Section title={t('title')}>
      <div className="max-w-2xl space-y-4 text-muted">
        <p>{t('intro')}</p>
        {/* TODO: Add your legal details (name, address, contact, VAT id). */}
        <address className="not-italic">
          <p>Johannes Mustermann</p>
          <p>Musterstraße 1</p>
          <p>12345 Musterstadt</p>
          <p>johannes@blackbeetle.de</p>
        </address>
      </div>
    </Section>
  );
}
