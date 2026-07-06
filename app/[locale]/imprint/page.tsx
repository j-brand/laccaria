import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import Section from '@/components/ui/Section';
import {buildAlternates, buildOpenGraph} from '@/lib/seo';

const PATH = '/imprint';

export async function generateMetadata(props: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await props.params;
  const t = await getTranslations({locale, namespace: 'Imprint'});
  const title = t('title');
  const description = t('description');
  return {
    title,
    description,
    alternates: buildAlternates(locale, PATH),
    openGraph: buildOpenGraph({locale, title, description, path: PATH})
  };
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
    <Section title={t('title')} divider={false} className="pt-10">
      <div className="max-w-[62ch] space-y-4 leading-relaxed text-fg-muted">
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
