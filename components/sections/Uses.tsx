import {getTranslations} from 'next-intl/server';
import Section from '@/components/ui/Section';

// Tool/stack names are proper nouns and stay untranslated.
const STACK = [
  'TypeScript',
  'React',
  'Next.js',
  'Node.js',
  'Tailwind CSS',
  'PostgreSQL',
  'Prisma',
  'Vercel',
  'Figma',
  'Git'
];

export default async function Uses() {
  const t = await getTranslations('Uses');

  return (
    <Section
      id="uses"
      title={t('title')}
      subtitle={t('subtitle')}
      className="border-t border-border"
    >
      <ul className="flex flex-wrap gap-3">
        {STACK.map((tool) => (
          <li
            key={tool}
            className="rounded-lg border border-border px-4 py-2 text-sm"
          >
            {tool}
          </li>
        ))}
      </ul>
    </Section>
  );
}
