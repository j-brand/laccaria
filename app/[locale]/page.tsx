import {getTranslations, setRequestLocale} from 'next-intl/server';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Services from '@/components/sections/Services';
import Stack from '@/components/sections/Stack';
import FeaturedProjects from '@/components/sections/FeaturedProjects';
import ContactCTA from '@/components/sections/ContactCTA';
import JsonLd from '@/components/seo/JsonLd';
import {personLd, profilePageLd, websiteLd} from '@/lib/structured-data';

const SERVICE_KEYS = [
  'newsite',
  'takeover',
  'visibility',
  'consulting'
] as const;

export default async function HomePage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const ts = await getTranslations('Services');
  const knowsAbout = SERVICE_KEYS.map((k) => ts(`items.${k}.title`));

  return (
    <>
      <JsonLd
        data={[personLd(knowsAbout), websiteLd(locale), profilePageLd(locale)]}
      />
      <Hero />
      <About />
      <Services />
      <FeaturedProjects />
      <Stack />
      <ContactCTA />
    </>
  );
}
