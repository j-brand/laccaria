/**
 * TEMPORARY diagnostic route — DELETE after use.
 *
 * Runs a Nodemailer `verify()` against the configured SMTP_* env vars *inside
 * the running app*, so it sees the exact same environment (Plesk panel vars)
 * the contact form uses. Plesk's "Run Script" does NOT inject those vars, which
 * is why the standalone script reports them missing — this route does.
 *
 * Guarded by a token so it can't be probed. Visit:
 *   https://laccaria.de/api/smtp-check?token=laccaria-smtp-2026
 *
 * Reveals only: host/port/secure, the username, and the PASSWORD LENGTH (never
 * the password itself) — enough to spot stray quotes/spaces — plus OK or the
 * raw server error. Remove this file once mail works.
 */
import nodemailer from 'nodemailer';

const TOKEN = 'laccaria-smtp-2026';

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  if (url.searchParams.get('token') !== TOKEN) {
    return new Response('Not found', {status: 404});
  }

  const {SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS} = process.env;
  const port = Number(SMTP_PORT ?? '587');
  const secure = SMTP_SECURE === 'true' || port === 465;

  const info: Record<string, unknown> = {
    host: SMTP_HOST ?? null,
    port,
    secure,
    user: SMTP_USER ?? null,
    passLen: SMTP_PASS ? SMTP_PASS.length : 0
  };

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return Response.json({...info, result: 'MISSING_ENV'}, {status: 200});
  }

  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure,
    auth: {user: SMTP_USER, pass: SMTP_PASS}
  });

  try {
    await transport.verify();
    return Response.json({...info, result: 'AUTH_OK'}, {status: 200});
  } catch (err) {
    return Response.json(
      {...info, result: 'AUTH_FAILED', error: err instanceof Error ? err.message : String(err)},
      {status: 200}
    );
  }
}
