import type {CSSProperties} from 'react';
import Image from 'next/image';

const frame = {'--bd': 'var(--line-strong)'} as CSSProperties;

/** Domain shown in the fake URL bar, e.g. "forsthaus-booking.de". */
function hostname(url?: string): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

/**
 * Hero screenshot framed inside a fake browser window (traffic-light dots +
 * URL bar). Falls back to the project's gradient with a ghosted title when no
 * `src` is provided, preserving the previous banner look.
 */
export default function BrowserFrame({
  src,
  alt,
  url,
  gradient,
  title
}: {
  src?: string;
  alt: string;
  url?: string;
  gradient: string;
  title: string;
}) {
  const host = hostname(url);

  return (
    <div className="cut-frame chamfer-lg lift mt-9" style={frame}>
      <div className="cut-inner chamfer-lg overflow-hidden">
        {/* browser bar */}
        <div className="flex items-center gap-3.5 border-b border-line bg-sunken px-4 py-[11px]">
          <div className="flex gap-[7px]">
            <span className="size-[11px] rounded-full bg-secondary" />
            <span className="size-[11px] rounded-full bg-accent" />
            <span className="size-[11px] rounded-full bg-primary" />
          </div>
          {host && (
            <div className="flex h-6 flex-1 items-center bg-bg px-3 font-mono text-[11px] text-fg-subtle shadow-[inset_0_0_0_1px_var(--line)]">
              {host}
            </div>
          )}
        </div>

        {/* screenshot / gradient fallback */}
        <div className="relative aspect-[16/9] bg-sunken">
          {src ? (
            <Image
              src={src}
              alt={alt}
              fill
              priority
              quality={90}
              sizes="(min-width: 920px) 920px, 100vw"
              className="object-cover object-top"
            />
          ) : (
            <div className="absolute inset-0" style={{background: gradient}}>
              <span className="absolute bottom-6 left-6 font-display text-[clamp(2.4rem,7vw,4.4rem)] font-bold leading-none tracking-[-0.03em] text-white/15">
                {title}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
