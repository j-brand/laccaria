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
summary: "Headless E-Commerce mit Next.js und Stripe."
year: 2025
stack: ["Next.js", "TypeScript", "Stripe", "Tailwind"]
cover: "/projects/acme-shop/cover.webp"
url: "https://acme.example"        # live site (optional)
repo: "https://github.com/.../acme" # source (optional)
featured: true                       # show in landing-page Swiper slider
---

## Überblick

Projektbeschreibung in Markdown ...
```

4. Keep the frontmatter **keys identical** across both files; only translate
   `title`, `summary`, and the body prose. `stack`, `year`, `cover`, `url`, `repo`,
   and `featured` stay the same.
5. Place images under `public/projects/<slug>/` and reference them with absolute
   paths (e.g. `/projects/<slug>/cover.webp`).
6. If `featured: true`, the project appears in the landing page Featured Projects
   slider — confirm the cover image exists so the slide renders.

## Frontmatter schema (typed in the project loader)
| field    | type       | required | notes                                  |
|----------|------------|----------|----------------------------------------|
| title    | string     | yes      | localized                              |
| summary  | string     | yes      | localized, used on cards               |
| year     | number     | yes      | sort order on the index                |
| stack    | string[]   | yes      | tech tags                              |
| cover    | string     | yes      | absolute path under /public            |
| url      | string     | no       | live deployment                        |
| repo     | string     | no       | source repository                      |
| featured | boolean    | no       | include in landing-page slider         |

## Checklist
- [ ] Both `<slug>.de.mdx` and `<slug>.en.mdx` exist with identical frontmatter keys.
- [ ] Cover image present under `public/projects/<slug>/`.
- [ ] Renders at `/de/projects/<slug>` and `/en/projects/<slug>`.
