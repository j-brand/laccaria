'use client';

import {useState} from 'react';
import Image from 'next/image';
import type {ProjectImage} from '@/lib/projects';
import Lightbox from './Lightbox';

/**
 * Responsive pair: a large desktop screenshot with a phone screenshot (in a white
 * bezel) overlapping its bottom-right corner. Renders only when at least one shot
 * is provided; each is optional. Clicking either opens the shared {@link Lightbox}.
 */
export default function ResponsiveShots({
  desktop,
  desktopFull,
  mobile,
  mobileFull,
  heading,
  title,
  closeLabel
}: {
  desktop?: string;
  desktopFull?: string;
  mobile?: string;
  mobileFull?: string;
  heading: string;
  title: string;
  closeLabel: string;
}) {
  const [active, setActive] = useState<ProjectImage | null>(null);

  if (!desktop && !mobile) return null;

  return (
    <section className="mt-16">
      <p className="mb-4.5 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">
        {heading}
      </p>
      <div className="relative pb-11">
        {desktop && (
          <button
            type="button"
            onClick={() =>
              setActive({src: desktopFull ?? desktop, alt: `${title} — desktop`})
            }
            aria-label={`${title} — desktop`}
            className="focus-ring cut-frame chamfer-lg lift block aspect-[16/10] w-full cursor-zoom-in sm:w-[82%]"
          >
            <span className="cut-inner chamfer-lg relative block h-full w-full overflow-hidden bg-sunken">
              <Image
                src={desktop}
                alt={`${title} — desktop`}
                fill
                quality={90}
                sizes="(min-width: 920px) 750px, 100vw"
                className="object-cover object-top"
              />
            </span>
          </button>
        )}
        {mobile && (
          <button
            type="button"
            onClick={() =>
              setActive({
                src: mobileFull ?? mobile,
                alt: `${title} — mobile`,
                portrait: true
              })
            }
            aria-label={`${title} — mobile`}
            className="focus-ring chamfer-md lift absolute bottom-0 right-0 block aspect-[9/19] w-[26%] max-w-[190px] cursor-zoom-in bg-[#E8EDE7] p-1"
          >
            <span className="chamfer-sm relative block h-full w-full overflow-hidden bg-card">
              <Image
                src={mobile}
                alt={`${title} — mobile`}
                fill
                quality={90}
                sizes="190px"
                className="object-cover object-top"
              />
            </span>
          </button>
        )}
      </div>

      <Lightbox
        image={active}
        closeLabel={closeLabel}
        onClose={() => setActive(null)}
      />
    </section>
  );
}
