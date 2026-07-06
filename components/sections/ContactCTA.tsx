import {getTranslations} from 'next-intl/server';
import Section from '@/components/ui/Section';
import ContactForm from '@/components/ContactForm';
import ContactLinks from '@/components/ContactLinks';

export default async function ContactCTA() {
  const t = await getTranslations('Contact');

  return (
    <Section
      id="contact"
      number="05"
      eyebrow={t('eyebrow')}
      title={t('title')}
      subtitle={t('subtitle')}
      className="pb-20"
    >
      <div className="grid items-start gap-6 md:grid-cols-2">
        <ContactForm />
        <ContactLinks />
      </div>
    </Section>
  );
}
