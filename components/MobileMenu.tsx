'use client';

import {useEffect, useRef, useState} from 'react';
import type {CSSProperties} from 'react';
import {Link} from '@/i18n/navigation';
import {Menu, Close} from '@/components/ui/icons';

type NavItem = {href: string; label: string};

type MobileMenuProps = {
  items: readonly NavItem[];
  hireHref: string;
  hireLabel: string;
  openLabel: string;
  closeLabel: string;
  navLabel: string;
};

const DRAWER_ID = 'mobile-menu';

const toggleChamfer = {'--c': '6px'} as CSSProperties;
const ctaChamfer = {'--c': '7px'} as CSSProperties;

export default function MobileMenu({
  items,
  hireHref,
  hireLabel,
  openLabel,
  closeLabel,
  navLabel
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const lastToggleAt = useRef(0);

  // One tap can dispatch two clicks on touch devices (the real click plus a
  // synthesized "ghost" click). For a toggle that fires close→open and looks
  // like an instant re-open, so collapse activations within a short window.
  function toggleMenu() {
    const now = Date.now();
    if (now - lastToggleAt.current < 350) return;
    lastToggleAt.current = now;
    setOpen((value) => !value);
  }

  // While open: close on Escape, lock body scroll, move focus into the drawer,
  // trap Tab within it, and restore focus to the toggle on close.
  useEffect(() => {
    if (!open) return;
    const drawer = drawerRef.current;
    const toggle = toggleRef.current;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (event.key !== 'Tab' || !drawer) return;

      const focusables = drawer.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', onKeyDown);

    // Move focus into the drawer so keyboard/AT users land inside it.
    // `preventScroll` stops the browser from jump-scrolling to the focused link,
    // which otherwise reads as a flicker when toggling quickly.
    drawer
      ?.querySelector<HTMLElement>('a[href], button')
      ?.focus({preventScroll: true});

    const {overflow} = document.body.style;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      // Only pull focus back to the toggle if it's still inside the drawer we're
      // tearing down — during rapid toggling the user may have moved on, and
      // stealing focus here causes visible flicker.
      if (drawer?.contains(document.activeElement)) {
        toggle?.focus({preventScroll: true});
      }
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={toggleRef}
        type="button"
        onClick={toggleMenu}
        aria-label={open ? closeLabel : openLabel}
        aria-expanded={open}
        aria-controls={DRAWER_ID}
        style={toggleChamfer}
        className={`focus-ring chamfer-quad grid size-9 touch-manipulation place-items-center transition-colors ${
          open
            ? 'bg-primary text-primary-fg'
            : 'bg-sunken text-fg hover:brightness-95'
        }`}
      >
        {open ? <Close size={18} /> : <Menu size={18} />}
      </button>

      {open && (
        <>
          {/* Backdrop — click to close */}
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="menu-backdrop fixed inset-x-0 bottom-0 top-16 z-20 cursor-default bg-black/40"
          />

          <div
            ref={drawerRef}
            id={DRAWER_ID}
            role="dialog"
            aria-modal="true"
            aria-label={navLabel}
            className="menu-drawer absolute inset-x-0 top-16 z-30 border-b border-line bg-bg backdrop-blur-md"
          >
            <nav
              aria-label={navLabel}
              className="mx-auto flex max-w-[1080px] flex-col gap-1 px-6 py-3"
            >
              <ul className="flex flex-col gap-1">
                {items.map(({href, label}) => (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      className="block px-3 py-2.5 text-sm font-medium text-fg transition-colors hover:text-primary-text"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>

              <Link
                href={hireHref}
                onClick={() => setOpen(false)}
                style={ctaChamfer}
                className="focus-ring chamfer-quad mt-2 bg-primary px-[15px] py-2.5 text-center text-sm font-semibold text-primary-fg transition hover:brightness-110"
              >
                {hireLabel}
              </Link>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
