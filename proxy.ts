import createMiddleware from 'next-intl/middleware';
import {NextRequest} from 'next/server';
import {routing} from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

const isDev = process.env.NODE_ENV !== 'production';

/**
 * Builds the Content-Security-Policy.
 *
 * Production is strict and nonce-based:
 * - `script-src` uses a per-request nonce plus `strict-dynamic`: only scripts we
 *   explicitly trust (the nonced ones) run, and any script they load inherits
 *   that trust — no `'unsafe-inline'`, no host allowlist. This is the strongest
 *   XSS mitigation available.
 * - `style-src` keeps `'unsafe-inline'`: React inline styles and `next/font`
 *   emit inline styles that nonces can't cover, and style injection is low-risk.
 * - Everything defaults to `'self'`; `object-src`/`frame-ancestors`/`base-uri`
 *   are locked down and mixed content is upgraded.
 *
 * Development relaxes `script-src`/`connect-src`: Next's dev runtime and
 * Turbopack HMR evaluate modules via `eval()`, inject inline scripts, and open
 * a websocket for fast refresh. A `strict-dynamic` + nonce policy blocks all of
 * that (and browsers ignore `'unsafe-inline'` once a nonce is present), so dev
 * uses a permissive script policy. None of this ships — production stays strict.
 */
function buildCsp(nonce: string): string {
  const scriptSrc = isDev
    ? `script-src 'self' 'unsafe-inline' 'unsafe-eval'`
    : `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`;

  const directives = [
    `default-src 'self'`,
    scriptSrc,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob:`,
    `font-src 'self'`,
    isDev ? `connect-src 'self' ws: wss:` : `connect-src 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `frame-src 'none'`,
    `base-uri 'self'`,
    `object-src 'none'`,
    `manifest-src 'self'`,
    `worker-src 'self' blob:`,
    `upgrade-insecure-requests`
  ];
  return directives.join('; ');
}

function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}

export default function proxy(request: NextRequest) {
  const nonce = generateNonce();
  const csp = buildCsp(nonce);

  // Forward the nonce + CSP on the *request* so Next.js stamps its own inline
  // hydration scripts with the nonce, and so the layout can read `x-nonce` to
  // stamp our inline theme script. next-intl carries these forward on its
  // rewrite to the localized route.
  request.headers.set('x-nonce', nonce);
  request.headers.set('content-security-policy', csp);

  const response = handleI18nRouting(request);

  // And set the CSP on the response the browser actually enforces.
  response.headers.set('content-security-policy', csp);

  return response;
}

export const config = {
  // Match all pathnames except for
  // - API routes, Next.js internals and Vercel internals
  // - files with an extension (e.g. favicon.ico, images)
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)'
};
