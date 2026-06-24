import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import Section from '@/components/ui/Section';

export async function generateMetadata(props: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await props.params;
  const t = await getTranslations({locale, namespace: 'Contact'});
  return {title: t('title'), description: t('subtitle')};
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
    <Section title={t('title')} subtitle={t('subtitle')}>
      <form className="max-w-xl space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            {t('nameLabel')}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2 outline-none focus:border-accent"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            {t('emailLabel')}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2 outline-none focus:border-accent"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium">
            {t('messageLabel')}
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2 outline-none focus:border-accent"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          {t('submit')}
        </button>
      </form>
      <p className="mt-8 text-sm text-muted">
        {t('directEmail')}{' '}
        <a
          href="mailto:johannes@blackbeetle.de"
          className="text-accent hover:underline"
        >
          johannes@blackbeetle.de
        </a>
      </p>
    </Section>
  );
}
