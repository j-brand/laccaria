---
name: add-page
description: Add a new localized route to the Laccaria site under app/[locale], wired with navigation and translations for both German and English. Use when creating a new page.
---

# add-page

Add a new page so it works in both locales with a localized nav entry. Routes are
**English in both locales** (e.g. `/de/services`, `/en/services`) — do not add
localized pathnames.

## Steps
1. Create the route file under the locale segment:
   `app/[locale]/<route>/page.tsx`
   (for nested routes mirror the folder structure, e.g. `app/[locale]/services/page.tsx`).
2. Write the page as a **Server Component** using `getTranslations`:

```tsx
import {getTranslations, setRequestLocale} from 'next-intl/server';

export default async function ServicesPage({
  params
}: PageProps<'/[locale]/services'>) {
  const {locale} = await params;
  setRequestLocale(locale); // enable static rendering
  const t = await getTranslations('Services');

  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-3xl font-bold">{t('title')}</h1>
    </main>
  );
}
```

3. Add an SEO `generateMetadata` if the page should have a custom title/description
   (pull from translations too).
4. Add the page's strings to **both** `messages/de.json` and `messages/en.json`
   under a new namespace (use the **add-translation** skill).
5. Add a **nav entry**: add a label key under the `Nav` namespace in both message
   files, and link it in the header/footer using `Link` from `@/i18n/navigation`:

```tsx
import {Link} from '@/i18n/navigation';
// ...
<Link href="/services">{t('services')}</Link>
```

## Checklist
- [ ] `app/[locale]/<route>/page.tsx` created as a Server Component.
- [ ] `setRequestLocale(locale)` called for static rendering.
- [ ] Page strings added to both locale files (add-translation).
- [ ] Nav label added to `Nav` namespace in both files and linked via `@/i18n/navigation`.
- [ ] Page reachable at `/de/<route>` and `/en/<route>`; `npm run lint` passes.
