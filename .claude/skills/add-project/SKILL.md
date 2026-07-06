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
   the `results[].label`, and the body). `stack`, `year`, `cover`, `url`, `repo`,
   `featured`, `gradient`, and `results[].metric` stay the same.
5. Place images under `public/projects/<slug>/`. Banners currently render from the
   `gradient` CSS value; a `cover` image is still used elsewhere, so keep it set.
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

## Checklist
- [ ] Both `<slug>.de.mdx` and `<slug>.en.mdx` exist with identical frontmatter keys.
- [ ] Cover image present under `public/projects/<slug>/`.
- [ ] Renders at `/de/projects/<slug>` and `/en/projects/<slug>`.
