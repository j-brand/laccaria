'use client';

import {useEffect, useRef} from 'react';
import Image from 'next/image';
import type {ProjectImage} from '@/lib/projects';

/**
 * Full-screen image preview shared by ProjectGallery and ResponsiveShots. Shows
 * one full-resolution (often very tall) screenshot at readable width and lets you
 * scroll through it; closes on backdrop click, Esc, or the close button, locking
 * body scroll and trapping focus, then restores focus to the opener. Renders
 * nothing when `image` is null.
 */
export default function Lightbox({
  image,
  closeLabel,
  onClose
}: {
  image: ProjectImage | null;
  closeLabel: string;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const isOpen = image !== null;

  // While open: focus the close button, close on Esc, trap Tab within the
  // dialog, lock body scroll, and restore focus to the opener on close.
  useEffect(() => {
    if (!isOpen) return;
    lastFocus.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusables = dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const activeEl = document.activeElement;
      if (e.shiftKey && activeEl === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && activeEl === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', onKey);

    const {overflow} = document.body.style;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      lastFocus.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!image) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={image.alt}
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-black/80"
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
        className="focus-ring chamfer-sm fixed right-4 top-4 z-10 flex size-10 items-center justify-center bg-card text-fg"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>

      <div className="flex min-h-full items-start justify-center p-4 sm:p-6">
        <figure
          onClick={(e) => e.stopPropagation()}
          className={image.portrait ? 'w-1/2 max-w-sm' : 'w-full max-w-3xl'}
        >
          {image.width && image.height ? (
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              quality={90}
              sizes="(min-width: 768px) 768px, 100vw"
              className="chamfer-md h-auto w-full"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image.src}
              alt={image.alt}
              className="chamfer-md h-auto w-full"
            />
          )}
          {image.alt && (
            <figcaption className="mt-3 text-center font-mono text-[11px] tracking-[0.06em] text-white/70">
              {image.alt}
            </figcaption>
          )}
        </figure>
      </div>
    </div>
  );
}
