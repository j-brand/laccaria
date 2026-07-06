import type {CSSProperties} from 'react';

type Props = {
  /** Width in px (height derives from the mark's ~1.2:1 ratio). */
  width?: number;
  className?: string;
  'aria-hidden'?: boolean;
};

/**
 * The faceted "mushroom mark". Rendered via the `.jb-mark` CSS helper in
 * globals.css so it swaps between the light/dark SVG with the theme.
 */
export default function Mark({
  width = 36,
  className = '',
  'aria-hidden': ariaHidden
}: Props) {
  const style: CSSProperties = {width, height: Math.round((width / 36) * 30)};
  return (
    <span
      className={`jb-mark block shrink-0 ${className}`}
      style={style}
      role={ariaHidden ? undefined : 'img'}
      aria-label={ariaHidden ? undefined : 'Laccaria'}
      aria-hidden={ariaHidden}
    />
  );
}
