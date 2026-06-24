import {setRequestLocale} from 'next-intl/server';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Services from '@/components/sections/Services';
import Uses from '@/components/sections/Uses';
import FeaturedProjects from '@/components/sections/FeaturedProjects';
import ContactCTA from '@/components/sections/ContactCTA';

export default async function HomePage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <About />
      <Services />
      <Uses />
      <FeaturedProjects />
      <ContactCTA />
    </>
  );
}
