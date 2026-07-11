#!/usr/bin/env node
/**
 * Generate the per-project social cards (1200×630) as static PNGs, one per
 * locale, written next to each project's screenshots so they can be inspected
 * in the workspace and committed:
 *
 *   public/projects/<slug>/og.de.png
 *   public/projects/<slug>/og.en.png
 *
 * Run before building (`npm run og`) whenever a project's title, kind, summary,
 * stack, gradient or hero changes. The project detail page references these
 * files for its OpenGraph / Twitter image (see app/[locale]/projects/[slug]).
 *
 * Layout: brand + title + stack on the left, the hero screenshot framed and
 * bleeding off the right edge, over the project's brand gradient.
 *
 * Self-contained (reads MDX frontmatter directly) so it runs under plain
 * `node` without the Next/TS toolchain. Uses `sharp` (decodes the WebP hero,
 * which Satori can't) and `next/og` (Satori + resvg), both already deps.
 */
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import sharp from 'sharp';
import {ImageResponse} from 'next/og.js';
import React from 'react';

const h = React.createElement;

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'content', 'projects');
const PUBLIC_DIR = path.join(ROOT, 'public');
const FONT_DIR = path.join(ROOT, 'assets', 'fonts');

const LOCALES = ['de', 'en'];
const DEFAULT_LOCALE = 'de';
const SIZE = {width: 1200, height: 630};
// Keep in sync with DEFAULT_GRADIENT in lib/gradients.ts.
const DEFAULT_GRADIENT = 'linear-gradient(135deg,#1B3524,#3A7150)';

// Static single-weight WOFFs — Satori can't resolve weights from a variable
// font, so we ship one file per weight we use.
const fonts = [
  {
    name: 'Space Grotesk',
    data: fs.readFileSync(path.join(FONT_DIR, 'SpaceGrotesk-700.woff')),
    weight: 700,
    style: 'normal'
  },
  {
    name: 'Space Grotesk',
    data: fs.readFileSync(path.join(FONT_DIR, 'SpaceGrotesk-500.woff')),
    weight: 500,
    style: 'normal'
  },
  {
    name: 'JetBrains Mono',
    data: fs.readFileSync(path.join(FONT_DIR, 'JetBrainsMono-500.woff')),
    weight: 500,
    style: 'normal'
  }
];

const markDataUri = `data:image/svg+xml;base64,${fs
  .readFileSync(path.join(ROOT, 'app', 'icon.svg'))
  .toString('base64')}`;

/** Unique project slugs from `<slug>.<locale>.mdx` files. */
function projectSlugs() {
  const slugs = new Set();
  for (const file of fs.readdirSync(CONTENT_DIR)) {
    const m = file.match(/^(.+)\.(de|en)\.mdx$/);
    if (m) slugs.add(m[1]);
  }
  return [...slugs];
}

/** Frontmatter for a (slug, locale), falling back to the default locale. */
function frontmatter(slug, locale) {
  let file = path.join(CONTENT_DIR, `${slug}.${locale}.mdx`);
  if (!fs.existsSync(file)) {
    file = path.join(CONTENT_DIR, `${slug}.${DEFAULT_LOCALE}.mdx`);
    if (!fs.existsSync(file)) return null;
  }
  return matter(fs.readFileSync(file, 'utf8')).data;
}

/** Decode a public-relative WebP screenshot to a PNG data URI, or null. */
async function heroDataUri(src) {
  if (!src) return null;
  try {
    const png = await sharp(path.join(PUBLIC_DIR, src))
      .resize({width: 760, withoutEnlargement: true})
      .png()
      .toBuffer();
    return `data:image/png;base64,${png.toString('base64')}`;
  } catch {
    return null;
  }
}

/** Longer titles need a smaller size to stay on ~2 lines within the panel. */
function titleSize(title) {
  if (title.length > 34) return 50;
  if (title.length > 22) return 58;
  return 68;
}

/** Trim to `max` chars on a word boundary, adding an ellipsis when cut. */
function clamp(text, max) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > max * 0.6 ? lastSpace : max).trimEnd()}…`;
}

function card(project, hero) {
  const gradient = project.gradient ?? DEFAULT_GRADIENT;
  const lead = clamp(project.tagline ?? project.summary ?? '', 130);
  const chips = (project.stack ?? []).slice(0, 5);

  return h(
    'div',
    {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        fontFamily: 'Space Grotesk',
        backgroundColor: '#0B130E',
        backgroundImage: `linear-gradient(90deg, rgba(8,13,10,0.94) 0%, rgba(8,13,10,0.72) 34%, rgba(8,13,10,0.18) 58%), ${gradient}`
      }
    },
    // left — text column
    h(
      'div',
      {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '648px',
          height: '100%',
          padding: '60px 56px'
        }
      },
      // brand
      h(
        'div',
        {style: {display: 'flex', alignItems: 'center'}},
        h('img', {src: markDataUri, width: 42, height: 35, alt: ''}),
        h(
          'span',
          {
            style: {
              fontFamily: 'JetBrains Mono',
              fontSize: '23px',
              letterSpacing: '0.01em',
              color: '#E8EDE7',
              marginLeft: '14px'
            }
          },
          'laccaria'
        )
      ),
      // title block
      h(
        'div',
        {style: {display: 'flex', flexDirection: 'column'}},
        project.kind
          ? h(
              'span',
              {
                style: {
                  fontFamily: 'JetBrains Mono',
                  fontSize: '18px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  color: '#E8C24E',
                  marginBottom: '20px'
                }
              },
              project.kind
            )
          : null,
        h(
          'div',
          {
            style: {
              display: 'flex',
              maxWidth: '536px',
              fontSize: `${titleSize(project.title ?? '')}px`,
              fontWeight: 700,
              lineHeight: 1.04,
              letterSpacing: '-0.02em',
              color: '#F3F6F1'
            }
          },
          project.title ?? ''
        ),
        h(
          'div',
          {
            style: {
              display: 'flex',
              maxWidth: '512px',
              marginTop: '22px',
              fontSize: '23px',
              lineHeight: 1.42,
              color: '#9EACA1'
            }
          },
          lead
        )
      ),
      // stack chips
      h(
        'div',
        {style: {display: 'flex', flexWrap: 'wrap'}},
        ...chips.map((tech) =>
          h(
            'span',
            {
              key: tech,
              style: {
                fontFamily: 'JetBrains Mono',
                fontSize: '16px',
                color: '#C6D2C9',
                border: '1px solid #33513E',
                borderRadius: '7px',
                padding: '7px 13px',
                marginRight: '10px',
                marginTop: '10px'
              }
            },
            tech
          )
        )
      )
    ),
    // right — framed hero, bleeding off the right edge
    h(
      'div',
      {
        style: {
          position: 'absolute',
          right: 0,
          top: 0,
          width: '600px',
          height: '630px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end'
        }
      },
      h(
        'div',
        {
          style: {
            display: 'flex',
            width: '600px',
            height: '512px',
            borderTop: '1px solid #33513E',
            borderLeft: '1px solid #33513E',
            borderBottom: '1px solid #33513E',
            borderTopLeftRadius: '18px',
            borderBottomLeftRadius: '18px',
            overflow: 'hidden',
            boxShadow: '0 30px 90px rgba(0,0,0,0.55)'
          }
        },
        hero
          ? h('img', {
              src: hero,
              width: 600,
              height: 512,
              alt: '',
              style: {
                width: '600px',
                height: '512px',
                objectFit: 'cover',
                objectPosition: 'left top'
              }
            })
          : h('div', {
              style: {
                display: 'flex',
                width: '600px',
                height: '512px',
                backgroundImage: gradient
              }
            })
      )
    )
  );
}

async function renderPng(project) {
  const hero = await heroDataUri(project.hero ?? project.cover);
  const res = new ImageResponse(card(project, hero), {...SIZE, fonts});
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  const slugs = projectSlugs().sort();
  let written = 0;
  for (const slug of slugs) {
    for (const locale of LOCALES) {
      const project = frontmatter(slug, locale);
      if (!project) continue;
      const png = await renderPng(project);
      const out = path.join(PUBLIC_DIR, 'projects', slug, `og.${locale}.png`);
      fs.mkdirSync(path.dirname(out), {recursive: true});
      fs.writeFileSync(out, png);
      written += 1;
      console.log(`✓ ${path.relative(ROOT, out)}  (${(png.length / 1024) | 0} KB)`);
    }
  }
  console.log(`\nGenerated ${written} OG card(s) for ${slugs.length} project(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
