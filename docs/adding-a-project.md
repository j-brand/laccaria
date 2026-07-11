# Adding a new project

Projects live in the `/projects` section. Each one is **two MDX files** — a German
and an English version — that share a single `<slug>`.

> Tip: the `add-project` skill scaffolds these files for you. This page is the
> quick manual reference.

## 1. Pick a slug

URL-safe, kebab-case, e.g. `acme-shop`. It becomes the URL:
`/projects/acme-shop` (German) and `/en/projects/acme-shop` (English).

## 2. Create both MDX files

```
content/projects/<slug>.de.mdx
content/projects/<slug>.en.mdx
```

Both files must have the **exact same frontmatter keys** — only translate the prose
values.

## 3. Frontmatter

```mdx
---
title: "Acme Online-Shop"
summary: "Ein blitzschneller Headless-Shop auf Next.js mit Stripe-Checkout."
year: 2025
stack: ["Next.js", "TypeScript", "Stripe", "Tailwind CSS"]
cover: "/projects/acme-shop/cover.webp"
url: "https://acme.example"           # live site (optional)
repo: "https://github.com/.../acme"   # source (optional)
featured: true                         # show in landing-page slider
kind: "Headless Commerce"              # mono eyebrow / category
tagline: "Ein schneller Headless-Shop, gebaut auf Next.js."
gradient: "linear-gradient(135deg,#8A6A12,#E8C24E)"   # banner
role: "Frontend-Lead"
timeline: "3 Monate"
client: "Acme Inc."
results:
  - metric: "0,7s"
    label: "Largest Contentful Paint"
  - metric: "+18%"
    label: "Conversion-Rate"
hero: "/projects/acme-shop/hero.png"          # 16:9 shot in the browser-chrome hero
shots:                                          # responsive pair (both optional)
  desktop: "/projects/acme-shop/desktop.png"
  mobile: "/projects/acme-shop/mobile.png"
gallery:                                         # detail gallery mosaic (click to enlarge)
  - src: "/projects/acme-shop/gallery/home.webp"        # full (often tall) screenshot
    thumb: "/projects/acme-shop/gallery/home_thumb.webp" # cropped preview tile (optional)
    width: 1500                                          # intrinsic px of `src` (optional)
    height: 4200
    eyebrow: "Startseite"                                # mono caption eyebrow (optional)
    alt: "Startseite mit Suche"                          # caption title + a11y alt
---
```

| field    | type              | required | notes                                   |
|----------|-------------------|----------|-----------------------------------------|
| title    | string            | yes      | localized                               |
| summary  | string            | yes      | localized, used on cards                |
| year     | number            | yes      | sort order + banner year badge          |
| stack    | string[]          | yes      | tech tags                               |
| cover    | string            | yes      | absolute path under `/public`           |
| url      | string            | no       | live deployment                         |
| repo     | string            | no       | source repository                       |
| featured | boolean           | no       | include in landing-page slider          |
| kind     | string            | no       | mono eyebrow / category                 |
| tagline  | string            | no       | lead line under the detail title        |
| gradient | string            | no       | CSS banner gradient (defaults to green) |
| role     | string            | no       | meta row on detail page                 |
| timeline | string            | no       | meta row on detail page                 |
| client   | string            | no       | meta row on detail page                 |
| results  | {metric,label}[]  | no       | headline metrics on detail sidebar      |
| hero     | string            | no       | 16:9 screenshot in the browser-chrome hero (falls back to `gradient`) |
| shots    | {desktop?,mobile?}| no       | responsive pair (desktop + overlapping phone); section hidden if absent |
| gallery  | {src,alt,thumb?,width?,height?,eyebrow?}[] | no | mixed-size mosaic (Look Book style); a tile opens a scrollable lightbox |

**Translate:** `title`, `summary`, `tagline`, `kind`, `role`, `timeline`, `client`,
each `results[].label`, each `gallery[].alt`, and the body.
**Keep identical:** `stack`, `year`, `cover`, `url`, `repo`, `featured`, `gradient`,
`hero`, `shots`, each `gallery[].src` / `.thumb` / `.width` / `.height`, and each
`results[].metric`. **Translate** each `gallery[].eyebrow` and `gallery[].alt`.

## 4. Write the body

Use localized headings plus a pull-quote:

```mdx
## Überblick
Kurzer Überblick …

## Die Herausforderung
Was schwierig war …

## Der Ansatz
Wie ich es gelöst habe …

> Ein prägnantes Zitat als Pull-Quote.
```

(English file: `## Overview`, `## The challenge`, `## The approach`.)

## 5. Add images

Place assets under `public/projects/<slug>/` and reference them from the
frontmatter above. The detail page has three image slots, all optional:

- **`hero`** — a 16:9 screenshot shown inside a browser-window frame (with the
  `url` domain in the fake address bar). When omitted, the hero falls back to the
  `gradient` banner, so a project with no images still looks finished.
- **`shots.desktop` / `shots.mobile`** — a large desktop shot with a phone shot
  overlapping its corner. The section only renders when at least one is set.
- **`gallery`** — a **mixed-size mosaic** (the Black Beetle Look Book "Image
  gallery": chamfered tiles, tile 0 a 2×2 feature, that lift and reveal a gold
  caption on hover/focus). Clicking a tile opens a lightbox that shows the full
  `src` at readable width and **scrolls vertically**, ideal for tall full-page
  captures. Optional per image:
  - **`thumb`** — a cropped preview for the tile (falls back to `src`). Tiles are
    `object-cover`, so a short landscape crop reads better than a tall full shot.
  - **`width` / `height`** — the intrinsic pixels of `src`; when both are set the
    lightbox uses `next/image` (no layout shift), otherwise a plain `<img>`.
  - **`eyebrow`** — a short mono label above the caption title (localized).
  Keep `alt` and `eyebrow` localized. Put files in `public/projects/<slug>/gallery/`.

Use raster formats (`.png`/`.webp`/`.jpg`) — `next/image` optimizes them. `cover`
is still used by the cards, so keep it set.

## Checklist

- [ ] Both `<slug>.de.mdx` and `<slug>.en.mdx` exist with identical frontmatter keys.
- [ ] Cover image present under `public/projects/<slug>/`.
- [ ] Renders at `/de/projects/<slug>` and `/en/projects/<slug>`.
- [ ] If `featured: true`, it shows in the landing-page Featured Projects slider.
