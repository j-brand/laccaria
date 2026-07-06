import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['de', 'en'],

  // Used when no locale matches
  defaultLocale: 'de',

  // Don't prefix the default locale: German (primary audience, .de domain) is
  // served at the root (`/`, `/contact`), English under `/en/...`. Prefixed
  // default-locale URLs (`/de/...`) 308-redirect to their unprefixed form.
  localePrefix: 'as-needed'
});
