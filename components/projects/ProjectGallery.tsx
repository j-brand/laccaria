'use client';

import {useCallback, useState} from 'react';
import type {CSSProperties, ReactNode} from 'react';
import Image from 'next/image';
import type {ProjectImage} from '@/lib/projects';
import Lightbox from './Lightbox';

// Look Book "Image gallery" caption wash (docs/Black Beetle - Look Book.html §11):
// a dark #0b130e gradient that fades a gold eyebrow + white title up from the
// bottom on hover/focus.
const capStyle = {
  background:
    'linear-gradient(transparent 45%, color-mix(in oklab, #0b130e 72%, transparent))'
} as CSSProperties;

/**
 * Ordered render list with per-tile grid spans. Portrait (phone) shots come first
 * as narrow, two-row-tall tiles; the landscape shots follow in a mixed-size
 * mosaic — the first tile (and the second-to-last) is a 2×2 feature, the rest are
 * wide 2-col tiles. Portrait-free galleries reduce to the plain landscape mosaic.
 */
function layout(images: ProjectImage[]): Array<{img: ProjectImage; span: string}> {
  const portraits = images.filter((img) => img.portrait);
  const landscapes = images.filter((img) => !img.portrait);
  const total = landscapes.length;
  return [
    ...portraits.map((img) => ({img, span: 'col-span-1 row-span-2'})),
    ...landscapes.map((img, index) => ({
      img,
      span:
        index === 0 || index === total - 2
          ? 'col-span-2 row-span-2'
          : 'col-span-2'
    }))
  ];
}

/**
 * Detail gallery styled after the Black Beetle Look Book "Image gallery": hover
 * (or focus) a tile to lift it and reveal a gold caption. Clicking a tile opens
 * the shared {@link Lightbox} on the full — often very tall — screenshot.
 *
 * Phones lead as narrow two-row-tall tiles, then the landscape shots fill the
 * mixed-size mosaic. Renders nothing when empty.
 */
export default function ProjectGallery({
  images,
  heading,
  closeLabel
}: {
  images: ProjectImage[];
  heading: string;
  closeLabel: string;
}) {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);

  if (images.length === 0) return null;

  const active = open !== null ? images[open] : null;

  /** One chamfered, zoomable gallery tile. `cls` sets its span/aspect. */
  const tile = (img: ProjectImage, cls: string, sizes: string): ReactNode => (
    <button
      key={img.src}
      type="button"
      onClick={() => setOpen(images.indexOf(img))}
      aria-label={img.alt}
      className={`focus-ring cut-frame chamfer-lg group block cursor-zoom-in transition duration-200 will-change-transform hover:-translate-y-[3px] hover:drop-shadow-[0_10px_22px_rgba(35,33,24,0.18)] dark:hover:drop-shadow-[0_12px_26px_rgba(0,0,0,0.5)] ${cls}`}
    >
      <span className="cut-inner chamfer-lg relative block h-full w-full overflow-hidden bg-sunken">
        <Image
          src={img.thumb ?? img.src}
          alt={img.alt}
          fill
          quality={90}
          sizes={sizes}
          className="object-cover object-top"
        />
        {/* caption — eyebrow + title, revealed on hover/focus */}
        <span
          aria-hidden="true"
          style={capStyle}
          className="pointer-events-none absolute inset-0 flex flex-col justify-end gap-0.5 p-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          {img.eyebrow && (
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
              {img.eyebrow}
            </span>
          )}
          <span className="font-display text-[15px] font-semibold text-white">
            {img.alt}
          </span>
        </span>
      </span>
    </button>
  );

  return (
    <section className="mt-14">
      <p className="mb-4.5 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">
        {heading}
      </p>

      {/* Look Book image gallery — a mixed-size mosaic of chamfered tiles. */}
      <div className="grid grid-cols-2 gap-3 [grid-auto-rows:148px] sm:grid-cols-4 sm:[grid-auto-rows:168px]">
        {layout(images).map(({img, span}) =>
          tile(
            img,
            span,
            // Gallery lives in `Container narrow` (≤872px content), so tiles cap at
            // ~430px (col-span-2) / ~209px (col-span-1) — keep `sizes` honest so
            // Next doesn't fetch oversized variants and upscale the thumb.
            img.portrait
              ? '(min-width: 920px) 210px, (min-width: 640px) 23vw, 50vw'
              : '(min-width: 920px) 430px, (min-width: 640px) 47vw, 100vw'
          )
        )}
      </div>

      <Lightbox image={active} closeLabel={closeLabel} onClose={close} />
    </section>
  );
}
