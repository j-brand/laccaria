import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import Section from '@/components/ui/Section';

export async function generateMetadata(props: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await props.params;
  const t = await getTranslations({locale, namespace: 'Privacy'});
  return {title: t('title')};
}

export default async function PrivacyPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Privacy');

  return (
    <Section title={t('title')}>
      <div className="max-w-2xl space-y-4 text-muted">
        <p>{t('intro')}</p>
        {/* TODO: Add your full privacy policy (GDPR / DSGVO compliant). */}
      </div>
    </Section>
  );
}
