import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - API routes, Next.js internals and Vercel internals
  // - `og` (the social-image route handler — must not be locale-redirected)
  // - files with an extension (e.g. favicon.ico, images)
  matcher: '/((?!api|og|_next|_vercel|.*\\..*).*)'
};
