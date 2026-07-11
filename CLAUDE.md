# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project overview

**Laccaria** is the personal homepage of Johannes, a web developer. It is a small,
content-light marketing site:

- **Landing page (`/`)** — one rich page composed of sections: Hero, About,
  Services, Uses (tools/stack), and Featured Projects (a Swiper slider).
- **Contact (`/contact`)** — contact form / details.
- **Projects (`/projects`, `/projects/[slug]`)** — index of work plus per-project
  detail pages rendered from MDX.
- **Legal** — `/imprint` (Impressum) and `/privacy` (Datenschutz).

The site is bilingual: **German (default)** and **English**.

## Stack

- **Next.js 16** (App Router) + **React 19**
- **TypeScript** (strict mode)
- **Tailwind CSS v4** (`@tailwindcss/postcss`, `@import "tailwindcss"`)
- **next-intl** — i18n via `[locale]` segments
- **MDX** — project content (`@next/mdx` / `next-mdx-remote` + `gray-matter`)
- **Swiper** — sliders (e.g. Featured Projects)

Package manager: **npm** (`package-lock.json` is the source of truth).
A Nix flake (`flake.nix`) provides Node 22 — run `nix develop` for the dev shell.

## Commands

```bash
npm run dev      # start dev server (http://localhost:3099 serves German at /)
npm run build    # production build
npm run start    # serve production build
npm run lint     # ESLint flat config (eslint .) — `next lint` was removed in Next 16
```

## Environment variables

See `.env.example`. SEO metadata (canonical URLs, hreflang, sitemap, OG images)
is built from a single origin:

- `NEXT_PUBLIC_SITE_URL` — canonical origin, no trailing slash (default `https://laccaria.de`).

Google Search Console verification is handled via a **DNS TXT record**, not an app-level meta tag.

The base URL, brand and social profiles live in `lib/site.ts`; metadata helpers in
`lib/seo.ts`; JSON-LD builders in `lib/structured-data.ts`. `app/sitemap.ts`,
`app/robots.ts` and `app/manifest.ts` are Next file conventions. The site-wide
social card is the static `public/laccaria-og.png`.

**Per-project OG cards** are pre-generated static PNGs, not a runtime route:
`npm run og` (also wired as `prebuild`) renders `scripts/generate-og.mjs` →
`public/projects/<slug>/og.<locale>.png` (title + stack + framed hero, from the
MDX frontmatter). The project detail page references them and falls back to the
site-wide card when a file is missing. Fonts for the cards live in `assets/fonts/`
(static `.woff` — Satori can't use variable fonts). Re-run `npm run og` after
changing a project's title/kind/summary/stack/gradient/hero.

## Folder structure

```
app/
  [locale]/             # ALL routes live here; locale is "de" | "en"
    layout.tsx          # html lang={locale}, NextIntlClientProvider, header/footer
    page.tsx            # landing — composes components/sections/*
    contact/page.tsx
    projects/page.tsx           # index (project cards)
    projects/[slug]/page.tsx    # detail, renders MDX
    imprint/page.tsx            # Impressum
    privacy/page.tsx            # Datenschutz
components/
  ui/                   # primitives: Button, Container, Section, LocaleSwitcher
  sections/             # Hero, About, Services, Uses, FeaturedProjects, ContactCTA
  ProjectSlider.tsx     # Swiper showcase ("use client")
content/
  projects/<slug>.de.mdx
  content/projects/<slug>.en.mdx   # MDX + frontmatter, one file per locale
i18n/
  routing.ts            # defineRouting({ locales: ['de','en'], defaultLocale: 'de' })
  request.ts            # getRequestConfig — loads messages/<locale>.json
  navigation.ts         # createNavigation(routing) -> Link, redirect, useRouter, usePathname
messages/
  de.json  en.json      # translation namespaces (Nav, Hero, About, Services, ...)
proxy.ts                # next-intl locale routing (Next 16 renamed middleware -> proxy)
```

> **Locale prefixing is `as-needed`** (`i18n/routing.ts`): German (default) is
> served **unprefixed** (`/`, `/projects`), English under `/en` (`/en/projects`);
> `/de/*` 308-redirects to the unprefixed form. Route **pathnames are identical
> across locales** — do not add localized pathnames unless explicitly asked.
> Build SEO URLs via `pathFor`/`buildAlternates` in `lib/seo.ts` (they honour
> `localePrefix`); never hardcode `/de` or `/${locale}`.

## Conventions

- **Everything under `app/[locale]/`.** Never create a route outside the locale segment.
- **No hardcoded user-facing strings.** Use `useTranslations` (Client) or
  `getTranslations` (Server) with keys defined in `messages/de.json` **and**
  `messages/en.json`. German is the default; **both files must always have the
  exact same key tree** — never add a key to one without the other.
- **Server Components by default.** Add `"use client"` only when a component needs
  interactivity (Swiper, forms, theme toggles, hooks like `useState`).
- **In the locale layout**, validate the locale (`hasLocale(routing.locales, locale)`
  → `notFound()`) and call `setRequestLocale(locale)` to enable static rendering.
- **Navigation:** import `Link`, `redirect`, `usePathname`, `useRouter` from
  `@/i18n/navigation` (not from `next/link` / `next/navigation`) so locale is handled.
- **TypeScript strict** — no `any`. Type MDX frontmatter explicitly.
- **Styling:** Tailwind utility classes only. Factor repeated patterns into
  primitives in `components/ui/`, not ad-hoc CSS files.

## Do / Don't

- ✅ Add a new route → also add its nav label + page strings to **both** message files.
- ✅ Keep dependencies minimal; prefer the stack above.
- ❌ Don't introduce a CMS or database — content is MDX + message JSON.
- ❌ Don't import from `next/link`/`next/navigation` directly for internal links.
- ❌ Don't leave one locale's translations behind.
- ❌ Don't try to verify visual appearance via a browser plugin/MCP — none is
  installed and none is needed. **Johannes checks the visual appearance himself.**
  Make the change, describe what to look at, and leave the visual review to him.

## Skills

Reusable workflows live in `.claude/skills/`. Prefer them for routine work:

- **add-page** — add a new localized route + nav entry + both translations.
- **add-project** — scaffold a project's `.de.mdx` + `.en.mdx` with frontmatter.
- **add-translation** — add/sync keys across `messages/de.json` and `messages/en.json`.
- **new-component** — create a typed Tailwind component following these conventions.
