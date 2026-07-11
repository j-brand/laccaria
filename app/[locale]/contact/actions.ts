'use server';

/**
 * Contact form Server Action. Validates the submission, applies a lightweight
 * honeypot + per-IP rate limit, and — on success — sends the notification via
 * SMTP (`lib/mail.ts`). Signature is compatible with React's `useActionState`.
 */

import {headers} from 'next/headers';
import {sendContactMail} from '@/lib/mail';
import {logContact} from '@/lib/log';

export type ContactState = {
  ok: boolean;
  error?: 'validation' | 'rate' | 'send';
};

const MAX_NAME = 100;
const MAX_EMAIL = 200;
const MAX_MESSAGE = 5000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// In-memory rate limit: N submissions per window, keyed by client IP.
// NOTE: per-instance only — fine for a single-node / personal site. A
// multi-instance serverless deploy would need a shared store (Redis, etc.).
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

async function clientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown';
}

export async function submitContact(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  // Honeypot: real users never fill the hidden `company` field. Pretend success
  // so bots get no signal, but send nothing.
  if ((formData.get('company') as string)?.trim()) {
    return {ok: true};
  }

  const name = (formData.get('name') as string | null)?.trim() ?? '';
  const email = (formData.get('email') as string | null)?.trim() ?? '';
  const message = (formData.get('message') as string | null)?.trim() ?? '';

  if (
    !name ||
    name.length > MAX_NAME ||
    !email ||
    email.length > MAX_EMAIL ||
    !EMAIL_RE.test(email) ||
    !message ||
    message.length > MAX_MESSAGE
  ) {
    await logContact({status: 'validation', email: email || undefined});
    return {ok: false, error: 'validation'};
  }

  if (isRateLimited(await clientIp())) {
    await logContact({status: 'rate', email});
    return {ok: false, error: 'rate'};
  }

  try {
    await sendContactMail({name, email, message});
  } catch (err) {
    console.error('Contact mail failed to send:', err);
    await logContact({
      status: 'send',
      email,
      error: err instanceof Error ? err.message : String(err)
    });
    return {ok: false, error: 'send'};
  }

  await logContact({status: 'sent', email});
  return {ok: true};
}
