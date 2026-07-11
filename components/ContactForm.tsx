'use client';

import {useActionState, useEffect, useRef, useState} from 'react';
import type {CSSProperties} from 'react';
import {useTranslations} from 'next-intl';
import {Send, Check} from '@/components/ui/icons';
import {submitContact, type ContactState} from '@/app/[locale]/contact/actions';

const frameBd = {'--bd': 'var(--line-strong)'} as CSSProperties;
const chamferPrimary = {'--c': '10px'} as CSSProperties;

const initialState: ContactState = {ok: false};

function Field({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[13px] font-semibold text-fg">{label}</span>
      <span className="cut-frame chamfer-md" style={frameBd}>
        {children}
      </span>
    </label>
  );
}

const inputClass =
  'focus-ring cut-inner chamfer-md block w-full bg-card px-3.5 py-3 text-sm text-fg outline-none placeholder:text-fg-subtle';

export default function ContactForm() {
  const t = useTranslations('Contact');
  const [state, formAction, pending] = useActionState(
    submitContact,
    initialState
  );
  const [dismissed, setDismissed] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);

  const showSuccess = state.ok && !dismissed;
  const errorKey =
    !state.ok && state.error
      ? state.error === 'rate'
        ? 'form.errorRate'
        : 'form.error'
      : null;
  // Only flag the individual fields as invalid for an actual field-validation
  // failure — not for a rate-limit or mail-server error, which aren't the
  // user's input being wrong.
  const fieldsInvalid = !state.ok && state.error === 'validation';

  // Move focus to the confirmation when the form is replaced, so screen-reader
  // and keyboard users are told the submission succeeded.
  useEffect(() => {
    if (showSuccess) successRef.current?.focus();
  }, [showSuccess]);

  return (
    <div className="cut-frame chamfer-lg">
      <div className="cut-inner chamfer-lg p-7">
        {showSuccess ? (
          <div
            ref={successRef}
            tabIndex={-1}
            role="status"
            className="px-2 py-6 text-center outline-none"
          >
            <span
              className="chamfer-quad mx-auto mb-4 grid size-13 place-items-center bg-primary text-primary-fg"
              style={{'--c': '10px'} as CSSProperties}
            >
              <Check size={26} />
            </span>
            <h3 className="mb-2 font-display text-[19px] font-semibold text-fg">
              {t('sent.title')}
            </h3>
            <p className="mx-auto mb-5 max-w-[40ch] text-sm leading-relaxed text-fg-muted">
              {t('sent.body')}
            </p>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="focus-ring cut-frame chamfer-sm inline-block"
              style={frameBd}
            >
              <span className="cut-inner chamfer-sm block bg-card px-4 py-2.5 text-sm font-semibold text-primary">
                {t('sent.again')}
              </span>
            </button>
          </div>
        ) : (
          <form
            action={(formData) => {
              setDismissed(false);
              formAction(formData);
            }}
            className="flex flex-col gap-4"
          >
            <Field label={t('form.name')}>
              <input
                required
                name="name"
                maxLength={100}
                autoComplete="name"
                placeholder={t('form.namePlaceholder')}
                aria-invalid={fieldsInvalid ? true : undefined}
                aria-describedby={errorKey ? 'contact-error' : undefined}
                className={inputClass}
              />
            </Field>
            <Field label={t('form.email')}>
              <input
                required
                type="email"
                name="email"
                maxLength={200}
                autoComplete="email"
                placeholder={t('form.emailPlaceholder')}
                aria-invalid={fieldsInvalid ? true : undefined}
                aria-describedby={errorKey ? 'contact-error' : undefined}
                className={inputClass}
              />
            </Field>
            <Field label={t('form.message')}>
              <textarea
                required
                name="message"
                rows={4}
                maxLength={5000}
                placeholder={t('form.messagePlaceholder')}
                aria-invalid={fieldsInvalid ? true : undefined}
                aria-describedby={errorKey ? 'contact-error' : undefined}
                className={`${inputClass} resize-y leading-relaxed`}
              />
            </Field>

            {/* Honeypot — hidden from users, tempting to bots. Kept out of the
                tab order and off autofill; a filled value is silently dropped. */}
            <div className="sr-only" aria-hidden="true">
              <label>
                Company
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </label>
            </div>

            {errorKey && (
              <p
                id="contact-error"
                role="alert"
                className="text-sm font-medium text-secondary"
              >
                {t(errorKey)}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              style={chamferPrimary}
              className="focus-ring chamfer-quad inline-flex items-center gap-2 self-start bg-primary px-[22px] py-3 text-[15px] font-semibold text-primary-fg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? t('form.sending') : t('form.submit')}
              <Send size={16} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
