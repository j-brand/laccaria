import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import Section from '@/components/ui/Section';
import {buildAlternates, buildOpenGraph} from '@/lib/seo';

const PATH = '/accessibility';

export async function generateMetadata(props: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await props.params;
  const t = await getTranslations({locale, namespace: 'Accessibility'});
  const title = t('title');
  const description = t('description');
  return {
    title,
    description,
    alternates: buildAlternates(locale, PATH),
    openGraph: buildOpenGraph({locale, title, description, path: PATH})
  };
}

export default async function AccessibilityPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Accessibility');

  return (
    <Section title={t('title')} divider={false} className="pt-10">
      <div className="max-w-[62ch] space-y-8 leading-relaxed text-fg-muted">
        <div className="space-y-2">
          <p className="text-sm text-fg-subtle">{t('updated')}</p>
          <p>{t('intro')}</p>
        </div>

        <div className="space-y-2">
          <h2 className="font-medium text-fg">{t('conformanceHeading')}</h2>
          <p>{t('conformance')}</p>
        </div>

        <div className="space-y-2">
          <h2 className="font-medium text-fg">{t('limitationsHeading')}</h2>
          <p>{t('limitations')}</p>
        </div>

        <div className="space-y-2">
          <h2 className="font-medium text-fg">{t('contactHeading')}</h2>
          <p>{t('contactIntro')}</p>
          <p>
            {t('emailLabel')}:{' '}
            <a
              href={`mailto:${t('email')}`}
              className="text-accent-text hover:underline"
            >
              {t('email')}
            </a>
          </p>
          <p>{t('responseNote')}</p>
        </div>
      </div>
    </Section>
  );
}
