---
name: new-component
description: Create a new typed React component for the Laccaria site following Tailwind + Server/Client conventions. Use when adding a UI primitive (components/ui) or a page section (components/sections).
---

# new-component

Create a new component that matches this repo's conventions (see `CLAUDE.md`).

## Decide the location
- **`components/ui/`** — reusable primitive (Button, Container, Section, Card, LocaleSwitcher).
- **`components/sections/`** — a landing-page section (Hero, About, Services, Uses, ...).
- **`components/`** — anything else shared across pages.

## Rules
1. **Server Component by default.** Add `"use client"` at the top **only** if the
   component uses state/effects/handlers or a client lib (Swiper, forms).
2. **No hardcoded user-facing text.** Pull copy via translations:
   - Client component: `const t = useTranslations('Namespace')` from `next-intl`.
   - Server component: `const t = await getTranslations('Namespace')` from `next-intl/server`.
   - If you introduce new strings, run the **add-translation** skill to add the keys
     to both `messages/de.json` and `messages/en.json`.
3. **Typed props.** Define a `type Props = { ... }`; no `any`.
4. **Tailwind only** for styling. Reuse `components/ui` primitives instead of
   duplicating class strings.
5. **Internal links** use `Link` from `@/i18n/navigation`, never `next/link`.

## Template (Server component)
```tsx
import {getTranslations} from 'next-intl/server';

type Props = {
  className?: string;
};

export default async function ExampleSection({className}: Props) {
  const t = await getTranslations('Example');
  return (
    <section className={className}>
      <h2 className="text-2xl font-semibold">{t('title')}</h2>
    </section>
  );
}
```

## Template (Client component)
```tsx
'use client';

import {useTranslations} from 'next-intl';

type Props = {
  className?: string;
};

export default function ExampleWidget({className}: Props) {
  const t = useTranslations('Example');
  return <div className={className}>{t('label')}</div>;
}
```

## Checklist
- [ ] Correct folder (ui vs sections) and PascalCase filename.
- [ ] `"use client"` present only if needed.
- [ ] New strings added to both message files (add-translation).
- [ ] `npm run lint` passes.
