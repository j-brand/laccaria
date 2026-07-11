/**
 * Server-side SMTP mail transport. Builds a Nodemailer transport from the
 * `SMTP_*` environment variables (see `.env.example`) and sends the contact
 * form notification to the site owner. Server-only — only import from the
 * contact Server Action, never from a Client Component.
 */

import nodemailer from 'nodemailer';

export type ContactMessage = {
  name: string;
  email: string;
  message: string;
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/**
 * Strip control chars (incl. CR/LF) so a visitor-supplied name can't inject
 * extra SMTP headers via the `replyTo` display name or `subject`. Nodemailer
 * already folds/encodes header values, so this is defence-in-depth.
 */
function headerSafe(value: string): string {
  return value.replace(/[\x00-\x1f\x7f]/g, ' ').trim();
}

/** Lazily created so a missing config only fails on an actual send, not at import. */
let cachedTransport: nodemailer.Transporter | null = null;

function getTransport(): nodemailer.Transporter {
  if (cachedTransport) return cachedTransport;

  const port = Number(process.env.SMTP_PORT ?? '587');
  // `secure: true` for implicit TLS (465); false uses STARTTLS (587).
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  cachedTransport = nodemailer.createTransport({
    host: requireEnv('SMTP_HOST'),
    port,
    secure,
    auth: {
      user: requireEnv('SMTP_USER'),
      pass: requireEnv('SMTP_PASS')
    }
  });

  return cachedTransport;
}

/**
 * Sends the contact submission to `CONTACT_TO`. The authenticated mailbox
 * (`CONTACT_FROM`) is the `from` so SPF/DMARC pass; the visitor's address is
 * set as `replyTo` so a reply goes straight back to them.
 */
export async function sendContactMail({
  name,
  email,
  message
}: ContactMessage): Promise<void> {
  const to = requireEnv('CONTACT_TO');
  const from = requireEnv('CONTACT_FROM');
  const safeName = headerSafe(name);

  await getTransport().sendMail({
    from,
    to,
    replyTo: `${safeName} <${email}>`,
    subject: `New contact from ${safeName}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}\n`
  });
}
