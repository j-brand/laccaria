import {Link} from '@/i18n/navigation';
import type {ComponentProps} from 'react';

type Variant = 'primary' | 'secondary';

const base =
  'inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-white hover:opacity-90',
  secondary: 'border border-border text-foreground hover:bg-foreground/5'
};

type Props = {
  href: ComponentProps<typeof Link>['href'];
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
};

export default function Button({
  href,
  variant = 'primary',
  children,
  className = ''
}: Props) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
