import type {Metadata} from 'next';
import {Space_Grotesk, Hanken_Grotesk, JetBrains_Mono} from 'next/font/google';
import {headers} from 'next/headers';
import {notFound} from 'next/navigation';
import {hasLocale, NextIntlClientProvider} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {SITE_URL, SITE_NAME, AUTHOR} from '@/lib/site';
import {buildAlternates, buildOpenGraph} from '@/lib/seo';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import '../globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk'
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-hanken'
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains'
});

// Runs before paint to set the theme class, avoiding a flash of the wrong theme.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata(props: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await props.params;
  const t = await getTranslations({locale, namespace: 'Hero'});
  const title = `Johannes Brand — ${t('eyebrow')}`;
  const description = t('sub');
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: '%s — Johannes Brand'
    },
    description,
    applicationName: SITE_NAME,
    authors: [{name: AUTHOR.name, url: SITE_URL}],
    creator: AUTHOR.name,
    publisher: AUTHOR.name,
    alternates: buildAlternates(locale),
    openGraph: buildOpenGraph({locale, title, description}),
    // Only the card type here — Next derives twitter title/description/image
    // from each page's openGraph, so child pages get their own values.
    twitter: {card: 'summary_large_image'},
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1
      }
    },
    verification: process.env.GOOGLE_SITE_VERIFICATION
      ? {google: process.env.GOOGLE_SITE_VERIFICATION}
      : undefined
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Per-request CSP nonce (set in proxy.ts) for our inline theme script.
  const nonce = (await headers()).get('x-nonce') ?? undefined;

  const t = await getTranslations('Nav');

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${hankenGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* The browser clears the `nonce` attribute off inline scripts after
            they run, so React sees an empty value at hydration and would warn
            about a mismatch. The script has already executed — suppress it. */}
        <script
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{__html: themeScript}}
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <NextIntlClientProvider>
          <a href="#main" className="skip-link">
            {t('skipToContent')}
          </a>
          <Header />
          <main id="main" tabIndex={-1} className="flex-1">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
