'use client';

import {useEffect, useState} from 'react';
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
};

const toggleChamfer = {'--c': '6px'} as CSSProperties;
const ctaChamfer = {'--c': '7px'} as CSSProperties;

export default function MobileMenu({
  items,
  hireHref,
  hireLabel,
  openLabel,
  closeLabel
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  // Close on Escape and lock body scroll while the drawer is open.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);

    const {overflow} = document.body.style;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? closeLabel : openLabel}
        aria-expanded={open}
        style={toggleChamfer}
        className={`chamfer-quad grid size-9 place-items-center transition-colors ${
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

          <div className="absolute inset-x-0 top-16 z-30 border-b border-line bg-bg backdrop-blur-md">
            <nav className="mx-auto flex max-w-[1080px] flex-col gap-1 px-6 py-3">
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
                className="chamfer-quad mt-2 bg-primary px-[15px] py-2.5 text-center text-sm font-semibold text-primary-fg transition hover:brightness-110"
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
