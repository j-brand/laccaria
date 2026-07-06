import {ImageResponse} from 'next/og';
import {SITE_URL} from '@/lib/site';

// Branded social card served at a stable, absolute URL (`/og`). Referenced
// explicitly from metadata (see `lib/seo.ts`) rather than via the
// `opengraph-image` file convention, whose URLs resolve to the request/build
// origin (wrong for self-hosting behind a fixed domain).
export const dynamic = 'force-static';

const SIZE = {width: 1200, height: 630};

// The faceted mushroom mark, inlined as an SVG data URI (Satori renders it via <img>).
const MARK = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 160" width="192" height="160"><g><polygon points="96,110 78,101 78,150 96,158" fill="#F2EEE6"/><polygon points="96,110 114,101 114,150 96,158" fill="#D2CCC0"/><polygon points="20,42 96,80 96,108 4,62" fill="#5A9670"/><polygon points="96,80 172,42 188,62 96,108" fill="#3A7150"/><polygon points="96,26 20,42 96,4" fill="#D9A521"/><polygon points="96,26 96,4 172,42" fill="#E8C24E"/><polygon points="96,26 20,42 96,80" fill="#7FB394"/><polygon points="96,26 96,80 172,42" fill="#5A9670"/></g></svg>'
)}`;

export function GET() {
  const domain = SITE_URL.replace(/^https?:\/\//, '');
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background:
            'linear-gradient(135deg, #1c3626 0%, #234430 55%, #2c5540 100%)',
          padding: '80px',
          color: '#F2EEE6',
          fontFamily: 'sans-serif'
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
          {/* Rendered by Satori inside ImageResponse; next/image is N/A here. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={MARK} width={72} height={60} alt="" />
          <div
            style={{
              fontSize: 26,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#E8C24E'
            }}
          >
            Full-stack Web Developer
          </div>
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
          <div style={{fontSize: 84, fontWeight: 700, lineHeight: 1.05}}>
            Johannes Brand
          </div>
          <div style={{fontSize: 36, color: '#C9D6CD', maxWidth: '900px'}}>
            Websites and web apps, built with intent.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 26,
            color: '#9DB4A5'
          }}
        >
          <div style={{display: 'flex'}}>{domain}</div>
          <div style={{display: 'flex', gap: '18px'}}>
            <span>React</span>
            <span>·</span>
            <span>Next.js</span>
            <span>·</span>
            <span>TypeScript</span>
          </div>
        </div>
      </div>
    ),
    {...SIZE}
  );
}
