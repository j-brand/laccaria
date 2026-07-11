/**
 * Standalone SMTP credential check. Verifies the SMTP_* env vars can actually
 * authenticate against the mail server — independent of Next.js / the contact
 * form. Run on the server where the vars are set:
 *
 *   node scripts/smtp-test.mjs
 *
 * Prints "SMTP auth OK" on success, or the exact server error on failure.
 * Sends nothing; only performs the login handshake (transporter.verify()).
 */
import nodemailer from 'nodemailer';

const {SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS} = process.env;

for (const [k, v] of Object.entries({SMTP_HOST, SMTP_USER, SMTP_PASS})) {
  if (!v) {
    console.error(`Missing env var: ${k}`);
    process.exit(1);
  }
}

const port = Number(SMTP_PORT ?? '587');
const secure = SMTP_SECURE === 'true' || port === 465;

console.log(
  `Connecting host=${SMTP_HOST} port=${port} secure=${secure} user=${SMTP_USER} passLen=${SMTP_PASS.length}`
);

const transport = nodemailer.createTransport({
  host: SMTP_HOST,
  port,
  secure,
  auth: {user: SMTP_USER, pass: SMTP_PASS}
});

try {
  await transport.verify();
  console.log('SMTP auth OK');
} catch (err) {
  console.error('SMTP auth FAILED:', err instanceof Error ? err.message : err);
  process.exit(1);
}
