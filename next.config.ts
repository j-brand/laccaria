import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

/**
 * Static security headers applied to every response. The Content-Security-Policy
 * is intentionally NOT set here — it carries a per-request nonce and is built in
 * `proxy.ts` (the nonce-based CSP). These headers are the parts that are
 * identical on every request.
 */
const securityHeaders = [
  // Force HTTPS for two years, including subdomains, and allow preloading.
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  // Disallow MIME-type sniffing.
  {key: 'X-Content-Type-Options', value: 'nosniff'},
  // Legacy clickjacking protection (CSP `frame-ancestors` is the modern one).
  {key: 'X-Frame-Options', value: 'DENY'},
  // Only send the origin as referrer on cross-origin requests.
  {key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin'},
  // Deny access to powerful browser features the site never uses.
  {
    key: 'Permissions-Policy',
    value: [
      'accelerometer=()',
      'autoplay=()',
      'camera=()',
      'display-capture=()',
      'encrypted-media=()',
      'geolocation=()',
      'gyroscope=()',
      'magnetometer=()',
      'microphone=()',
      'midi=()',
      'payment=()',
      'usb=()',
      'browsing-topics=()',
      'interest-cohort=()'
    ].join(', ')
  },
  // Isolate our browsing context from cross-origin openers/popups.
  {key: 'Cross-Origin-Opener-Policy', value: 'same-origin'},
  // Don't leak DNS prefetches for links the user never follows.
  {key: 'X-DNS-Prefetch-Control', value: 'off'}
];

const nextConfig: NextConfig = {
  // Drop the `X-Powered-By: Next.js` fingerprint.
  poweredByHeader: false,
  // The dev server (Turbopack HMR + internal `/_next/*` requests) otherwise
  // rejects requests whose Origin isn't localhost. When reaching dev through a
  // reverse proxy on a custom host, allow that origin so assets/HMR load and the
  // app hydrates. Dev-only setting — it has no effect on production builds.
  allowedDevOrigins: ['laccaria.blacknectar.de'],
  images: {
    // Project screenshots carry fine UI text that softens at the next/image
    // default re-encode quality (75). Whitelist a higher quality so the hero
    // and card banners stay crisp on high-DPR / 4K displays (opt-in per Image
    // via `quality={90}`; 75 stays available for everything else).
    qualities: [75, 90]
  },
  async headers() {
    return [{source: '/:path*', headers: securityHeaders}];
  }
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
