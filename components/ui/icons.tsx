import type {SVGProps} from 'react';

/** Lucide-style stroke icons matching the Black Beetle mockups. */
function Base({
  size = 20,
  strokeWidth = 2,
  children,
  ...props
}: SVGProps<SVGSVGElement> & {size?: number}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const ArrowRight = (p: SVGProps<SVGSVGElement> & {size?: number}) => (
  <Base strokeWidth={2.4} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Base>
);

export const Menu = (p: SVGProps<SVGSVGElement> & {size?: number}) => (
  <Base {...p}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </Base>
);

export const Close = (p: SVGProps<SVGSVGElement> & {size?: number}) => (
  <Base {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Base>
);

export const ArrowLeft = (p: SVGProps<SVGSVGElement> & {size?: number}) => (
  <Base strokeWidth={2.4} {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </Base>
);

export const Code = (p: SVGProps<SVGSVGElement> & {size?: number}) => (
  <Base {...p}>
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </Base>
);

export const Server = (p: SVGProps<SVGSVGElement> & {size?: number}) => (
  <Base {...p}>
    <rect x="2" y="3" width="20" height="6" rx="1" />
    <rect x="2" y="9" width="20" height="6" rx="1" />
    <rect x="2" y="15" width="20" height="6" rx="1" />
    <path d="M6 6h.01M6 12h.01M6 18h.01" />
  </Base>
);

export const Layers = (p: SVGProps<SVGSVGElement> & {size?: number}) => (
  <Base {...p}>
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </Base>
);

export const Pen = (p: SVGProps<SVGSVGElement> & {size?: number}) => (
  <Base {...p}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </Base>
);

export const Chart = (p: SVGProps<SVGSVGElement> & {size?: number}) => (
  <Base {...p}>
    <path d="M12 20v-6M6 20v-4M18 20v-9" />
    <path d="M3 8l6-4 5 3 7-4" />
  </Base>
);

export const Mail = (p: SVGProps<SVGSVGElement> & {size?: number}) => (
  <Base {...p}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 5L2 7" />
  </Base>
);

export const Check = (p: SVGProps<SVGSVGElement> & {size?: number}) => (
  <Base strokeWidth={2.6} {...p}>
    <polyline points="20 6 9 17 4 12" />
  </Base>
);

export const Send = (p: SVGProps<SVGSVGElement> & {size?: number}) => (
  <Base strokeWidth={2.4} {...p}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </Base>
);

export const GitHub = ({
  size = 20,
  ...props
}: SVGProps<SVGSVGElement> & {size?: number}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    {...props}
  >
    <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.93-2.35 4.79-4.58 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .26.18.59.69.48A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
  </svg>
);

export const LinkedIn = ({
  size = 20,
  ...props
}: SVGProps<SVGSVGElement> & {size?: number}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    {...props}
  >
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.64h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21H9V9Z" />
  </svg>
);
