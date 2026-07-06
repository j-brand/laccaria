'use client';

import {useEffect, useRef, useState} from 'react';
import type {CSSProperties} from 'react';
import {Link} from '@/i18n/navigation';
import {Menu, Close} from '@/components/ui/icons';
import LocaleSwitcher from '@/components/ui/LocaleSwitcher';
import ThemeToggle from '@/components/ui/ThemeToggle';

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
    drawer?.querySelector<HTMLElement>('a[href], button')?.focus();

    const {overflow} = document.body.style;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      toggle?.focus();
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? closeLabel : openLabel}
        aria-expanded={open}
        aria-controls={DRAWER_ID}
        style={toggleChamfer}
        className={`focus-ring chamfer-quad grid size-9 place-items-center transition-colors ${
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
            className="fixed inset-x-0 bottom-0 top-16 z-20 cursor-default bg-black/40"
          />

          <div
            ref={drawerRef}
            id={DRAWER_ID}
            className="absolute inset-x-0 top-16 z-30 border-b border-line bg-bg backdrop-blur-md"
          >
            <nav
              aria-label={navLabel}
              className="mx-auto flex max-w-[1080px] flex-col gap-1 px-6 py-3"
            >
              {items.map(({href, label}) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 text-sm font-medium text-fg transition-colors hover:text-primary"
                >
                  {label}
                </Link>
              ))}

              <Link
                href={hireHref}
                onClick={() => setOpen(false)}
                style={ctaChamfer}
                className="focus-ring chamfer-quad mt-2 bg-primary px-[15px] py-2.5 text-center text-sm font-semibold text-primary-fg transition hover:brightness-110"
              >
                {hireLabel}
              </Link>

              <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
                <LocaleSwitcher />
                <ThemeToggle />
              </div>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
