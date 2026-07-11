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
  const addressLines = t.raw('addressLines') as string[];

  return (
    <Section title={t('title')} divider={false} className="pt-10">
      <div className="max-w-[62ch] space-y-8 leading-relaxed text-fg-muted">
        <div className="space-y-2">
          <h2 className="font-medium text-fg">{t('providerHeading')}</h2>
          <p className="text-sm text-fg-subtle">{t('providerNote')}</p>
          <address className="not-italic">
            <p>{t('name')}</p>
            {addressLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </address>
        </div>

        <div className="space-y-2">
          <h2 className="font-medium text-fg">{t('contactHeading')}</h2>
          <p>
            {t('emailLabel')}:{' '}
            <a href={`mailto:${t('email')}`} className="text-accent-text hover:underline">
              {t('email')}
            </a>
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-medium text-fg">{t('responsibleHeading')}</h2>
          <p className="text-sm text-fg-subtle">{t('responsibleNote')}</p>
          <address className="not-italic">
            <p>{t('name')}</p>
            {addressLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </address>
        </div>

        <div className="space-y-2">
          <h2 className="font-medium text-fg">{t('disputeHeading')}</h2>
          <p>{t('dispute')}</p>
        </div>
      </div>
    </Section>
  );
}
