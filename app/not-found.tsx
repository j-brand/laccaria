import Link from 'next/link';
import '@/app/globals.css';

// Global fallback for paths that don't match a locale. Renders its own
// document because there is no root layout above the `[locale]` segment.
export default function GlobalNotFound() {
  return (
    <html lang="de">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-3xl font-bold">404 — Seite nicht gefunden</h1>
        <p className="text-gray-500">Page not found.</p>
        <Link href="/" className="text-indigo-500 hover:underline">
          Start / Home
        </Link>
      </body>
    </html>
  );
}
