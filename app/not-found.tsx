import type {Metadata} from 'next';
import Link from 'next/link';
import {SITE_URL} from '@/lib/site';
import '@/app/globals.css';

// No locale layout runs for this route, so set its own base + noindex here.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  robots: {index: false}
};

// Global fallback for paths that don't match a locale. Renders its own
// document because there is no root layout above the `[locale]` segment.
export default function GlobalNotFound() {
  return (
    <html lang="de">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-3xl font-bold text-fg">
          404 — Seite nicht gefunden
        </h1>
        <p className="text-fg-muted">Page not found.</p>
        <Link href="/" className="font-semibold text-primary hover:text-accent-text">
          Start / Home
        </Link>
      </body>
    </html>
  );
}
