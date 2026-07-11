import {Link} from '@/i18n/navigation';
import type {ComponentProps, CSSProperties} from 'react';
import {ArrowRight} from './icons';

type Variant = 'primary' | 'secondary' | 'accent';

type Props = {
  href: ComponentProps<typeof Link>['href'];
  variant?: Variant;
  arrow?: boolean;
  children: React.ReactNode;
  className?: string;
};

const chamfer = {'--c': '9px'} as CSSProperties;

const solid: Record<'primary' | 'accent', string> = {
  primary: 'bg-primary text-primary-fg hover:brightness-110',
  accent: 'bg-accent text-[#232118] hover:brightness-105'
};

export default function Button({
  href,
  variant = 'primary',
  arrow = false,
  children,
  className = ''
}: Props) {
  const inner = (
    <>
      {children}
      {arrow && <ArrowRight size={17} />}
    </>
  );

  if (variant === 'secondary') {
    // Outline via the 1px cut-frame / cut-inner border pattern.
    return (
      <Link
        href={href}
        style={chamfer}
        className={`focus-ring cut-frame chamfer-quad inline-block text-base font-semibold transition-transform hover:-translate-y-0.5 ${className}`}
      >
        <span
          style={chamfer}
          className="cut-inner chamfer-quad inline-flex items-center gap-2 px-[1.1rem] py-[0.7rem] text-primary-text"
        >
          {inner}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      style={chamfer}
      className={`focus-ring chamfer-quad inline-flex items-center gap-2 px-[1.2rem] py-3 text-base font-semibold transition hover:-translate-y-0.5 ${solid[variant]} ${className}`}
    >
      {inner}
    </Link>
  );
}
