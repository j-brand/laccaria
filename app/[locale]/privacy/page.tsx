import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import Section from '@/components/ui/Section';
import {buildAlternates, buildOpenGraph} from '@/lib/seo';

const PATH = '/privacy';

/** Content blocks stored in the Privacy message namespace (rendered generically). */
type Block =
  | {type: 'h3' | 'h4' | 'p'; text: string}
  | {type: 'list'; items: string[]}
  | {type: 'address'; lines: string[]};

type PrivacySection = {heading: string; blocks: Block[]};

export async function generateMetadata(props: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await props.params;
  const t = await getTranslations({locale, namespace: 'Privacy'});
  const title = t('title');
  const description = t('description');
  return {
    title,
    description,
    alternates: buildAlternates(locale, PATH),
    openGraph: buildOpenGraph({locale, title, description, path: PATH})
  };
}

function renderBlock(block: Block, index: number) {
  switch (block.type) {
    case 'h3':
      return (
        <h3 key={index} className="pt-2 font-display text-lg font-semibold text-fg">
          {block.text}
        </h3>
      );
    case 'h4':
      return (
        <h4 key={index} className="font-medium text-fg">
          {block.text}
        </h4>
      );
    case 'p':
      return <p key={index}>{block.text}</p>;
    case 'list':
      return (
        <ul key={index} className="list-disc space-y-2 pl-5">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    case 'address':
      return (
        <address key={index} className="not-italic text-fg">
          {block.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </address>
      );
  }
}

export default async function PrivacyPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Privacy');
  const sections = t.raw('sections') as PrivacySection[];

  return (
    <Section title={t('title')} divider={false} className="pt-10">
      <div className="max-w-[68ch] space-y-10 leading-relaxed text-fg-muted">
        {sections.map((section, s) => (
          <section key={s} className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-fg">
              {section.heading}
            </h2>
            {section.blocks.map((block, b) => renderBlock(block, b))}
          </section>
        ))}
      </div>
    </Section>
  );
}
