import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import Section from '@/components/ui/Section';
import ContactForm from '@/components/ContactForm';
import ContactLinks from '@/components/ContactLinks';
import {buildAlternates, buildOpenGraph} from '@/lib/seo';

const PATH = '/contact';

export async function generateMetadata(props: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await props.params;
  const t = await getTranslations({locale, namespace: 'Contact'});
  const title = t('title');
  const description = t('subtitle');
  return {
    title,
    description,
    alternates: buildAlternates(locale, PATH),
    openGraph: buildOpenGraph({locale, title, description, path: PATH})
  };
}

export default async function ContactPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Contact');

  return (
    <Section
      title={t('title')}
      subtitle={t('subtitle')}
      divider={false}
      className="pt-10 pb-20"
    >
      <div className="grid items-start gap-6 md:grid-cols-2">
        <ContactForm />
        <ContactLinks />
      </div>
    </Section>
  );
}
