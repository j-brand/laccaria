---
name: add-project
description: Scaffold a new portfolio project for the Laccaria site as localized MDX (German + English) with the standard frontmatter. Use when adding an entry to /projects.
---

# add-project

Create a new project for the `/projects` section. Each project is **two MDX files**
(one per locale) sharing the same `<slug>`.

## Steps
1. Pick a URL-safe **slug** (kebab-case), e.g. `acme-shop`.
2. Create both files:
   - `content/projects/<slug>.de.mdx`
   - `content/projects/<slug>.en.mdx`
3. Fill the **frontmatter** (same shape in both; translate the prose values):

```mdx
---
title: "Acme Online-Shop"
summary: "Ein blitzschneller Headless-Shop auf Next.js mit Stripe-Checkout."
year: 2025
updated: "2025-06-14"                  # last change (optional) — sitemap + JSON-LD date
stack: ["Next.js", "TypeScript", "Stripe", "Tailwind CSS"]
cover: "/projects/acme-shop/cover.webp"
url: "https://acme.example"          # live site (optional)
repo: "https://github.com/.../acme"  # source (optional)
featured: true                        # show in landing-page Swiper slider
kind: "Headless Commerce"             # mono eyebrow / category
tagline: "Ein schneller Headless-Shop, gebaut auf Next.js."  # lead under the title
gradient: "linear-gradient(135deg,#8A6A12,#E8C24E)"          # banner (no image yet)
role: "Frontend-Lead"
timeline: "3 Monate"
client: "Acme Inc."
results:                              # headline metrics on the detail sidebar
  - metric: "0,7s"
    label: "Largest Contentful Paint"
  - metric: "+18%"
    label: "Conversion-Rate"
---

## Überblick

Kurzer Überblick ...

## Die Herausforderung

Was schwierig war ...

## Der Ansatz

Wie ich es gelöst habe ...

> Ein prägnantes Zitat als Pull-Quote.
```

4. Keep the frontmatter **keys identical** across both files; only translate the
   prose values (`title`, `summary`, `tagline`, `kind`, `role`, `timeline`, `client`,
   the `results[].label`, and the body). `stack`, `year`, `updated`, `cover`,
   `url`, `repo`, `featured`, `gradient`, and `results[].metric` stay the same.
5. Place images under `public/projects/<slug>/` and process them to WebP (see
   **Images** below). Point `cover` and `hero` at the same 16:9 hero WebP — the card
   banner (`ProjectCard`) and the detail `BrowserFrame` both read `hero`, and `cover`
   is used for SEO/OG metadata. When there is no hero image, drop `hero` and let the
   `gradient` render the banner.
6. Author the body with `## Overview` / `## The challenge` / `## The approach`
   headings (localized) plus a `>` blockquote pull-quote — the detail page renders
   the MDX body as the main column and reads the sidebar/banner from frontmatter.
7. If `featured: true`, the project appears in the landing page Featured Projects
   slider.

## Frontmatter schema (typed in the project loader)
| field    | type                        | required | notes                                  |
|----------|-----------------------------|----------|----------------------------------------|
| title    | string                      | yes      | localized                              |
| summary  | string                      | yes      | localized, used on cards               |
| year     | number                      | yes      | sort order + banner year badge         |
| stack    | string[]                    | yes      | tech tags                              |
| cover    | string                      | yes      | absolute path under /public            |
| url      | string                      | no       | live deployment                        |
| repo     | string                      | no       | source repository                      |
| featured | boolean                     | no       | include in landing-page slider         |
| kind     | string                      | no       | mono eyebrow / category                |
| tagline  | string                      | no       | lead line under the detail title       |
| gradient | string                      | no       | CSS banner gradient (defaults to green)|
| role     | string                      | no       | meta row on detail page                |
| timeline | string                      | no       | meta row on detail page                |
| client   | string                      | no       | meta row on detail page                |
| results  | {metric,label}[]            | no       | headline metrics on detail sidebar     |
| hero     | string                      | no       | 16:9 screenshot in the browser-chrome hero (falls back to `gradient`) |
| shots    | {desktop?,desktopFull?,mobile?,mobileFull?} | no | responsive pair: cropped previews (`desktop`/`mobile`) + full-page images opened in the lightbox (`desktopFull`/`mobileFull`) |
| gallery  | {src,alt,thumb?,width?,height?,eyebrow?}[] | no | mixed-size **mosaic** (Look Book style); a tile opens a scrollable lightbox |

**Gallery images:** `src` is the full (often tall) screenshot shown scrollable in
the lightbox; `thumb` is an optional cropped preview for the tile (falls back to
`src`; tiles are `object-cover`); `width`/`height` are the intrinsic pixels of
`src` (both set → lightbox uses `next/image`, no layout shift); `eyebrow` is an
optional short mono caption label. Translate `alt` and `eyebrow`; keep `src`,
`thumb`, `width`, `height` identical across locales.

## Images

Drop the source PNG/JPG screenshots into `public/projects/<slug>/`, then convert
them to WebP with the bundled sharp helper (`npm run webp` → `scripts/to-webp.mjs`).
Originals are always kept in place — delete them once you've checked the output.
Give files clean, kebab-case names first (no spaces/brackets); the helper writes
`<name>.webp` alongside each source.

Every tile/preview renders with `object-cover object-top`, so previews want a crop
from the **top** of the page, not a squished full-height downscale.

- **Hero + card** (`hero`, `cover`): one ~16:9 image. Convert at higher quality:
  `npm run webp -- public/projects/<slug>/hero.png -q 88`
- **Responsive shots** (`shots`): each of the desktop and mobile full-page grabs
  becomes two files — the **full** image for the lightbox (`desktopFull`/`mobileFull`)
  and a **top-cropped** preview for the tile (`desktop`/`mobile`). Full-page grabs are
  extremely tall, so a plain `--thumb` collapses to a sliver — use `--crop <W:H>`
  (implies a `_thumb.webp`; `--max` is the target width in crop mode):
  ```bash
  npm run webp -- public/projects/<slug>/desktop.png            # → desktop.webp (desktopFull)
  npm run webp -- public/projects/<slug>/desktop.png --crop 16:10 --max 1200  # → desktop_thumb.webp (desktop)
  npm run webp -- public/projects/<slug>/mobile.png             # → mobile.webp (mobileFull)
  npm run webp -- public/projects/<slug>/mobile.png  --crop 9:19 --max 520     # → mobile_thumb.webp (mobile)
  ```
- **Gallery** (`gallery[]`): full WebP as `src`, plus a `--thumb` preview as `thumb`.
  Set `width`/`height` to the **full** image's intrinsic pixels (avoids layout shift
  in the lightbox):
  ```bash
  npm run webp -- public/projects/<slug>/questionnaire.png public/projects/<slug>/dashboard.png --thumb --max 800
  ```
  Read intrinsic pixels with
  `node -e 'require("sharp")(f).metadata().then(m=>console.log(m.width,m.height))'`.

The mosaic makes the tile at index `0` and index `total-2` double-height features —
order the gallery so a visually rich screenshot lands in each of those slots.

## Checklist
- [ ] Both `<slug>.de.mdx` and `<slug>.en.mdx` exist with identical frontmatter keys.
- [ ] Images converted to WebP under `public/projects/<slug>/`; every path in the
      frontmatter (`cover`, `hero`, `shots.*`, `gallery[].src`/`.thumb`) resolves.
- [ ] `gallery[].width`/`height` match each full `src` image's intrinsic pixels.
- [ ] Renders at `/de/projects/<slug>` and `/en/projects/<slug>`.
