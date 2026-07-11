/**
 * Minimal append-only file logger for the contact form. Writes one JSON line
 * per submission outcome to `logs/contact.log` so mail failures are visible
 * without scrolling server stdout. Server-only (uses `node:fs`) — never import
 * from a Client Component. Best-effort: a logging failure must never break a
 * request, so all errors here are swallowed (with a stderr fallback).
 */

import {appendFile, mkdir} from 'node:fs/promises';
import path from 'node:path';

const LOG_DIR = path.join(process.cwd(), 'logs');
const LOG_FILE = path.join(LOG_DIR, 'contact.log');

export type ContactLogEntry = {
  /** Submission outcome. */
  status: 'sent' | 'validation' | 'rate' | 'send';
  /** Visitor email, kept for follow-up; message body is intentionally omitted. */
  email?: string;
  /** Error detail for a failed send (e.g. nodemailer message / SMTP code). */
  error?: string;
};

/**
 * Append a timestamped JSON line describing a contact submission. Never throws:
 * on failure it falls back to `console.error` and returns.
 */
export async function logContact(entry: ContactLogEntry): Promise<void> {
  const line =
    JSON.stringify({time: new Date().toISOString(), ...entry}) + '\n';
  try {
    await mkdir(LOG_DIR, {recursive: true});
    await appendFile(LOG_FILE, line, 'utf8');
  } catch (err) {
    console.error('Failed to write contact log:', err, '| entry:', line.trim());
  }
}
