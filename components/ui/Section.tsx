import Container from './Container';

type Props = {
  id?: string;
  /** Two-digit index shown in accent mono, e.g. "01". */
  number?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  /** First section on a page omits the top divider. */
  divider?: boolean;
  className?: string;
};

export default function Section({
  id,
  number,
  eyebrow,
  title,
  subtitle,
  children,
  divider = true,
  className = ''
}: Props) {
  return (
    <section
      id={id}
      className={`scroll-mt-20 py-16 ${divider ? 'border-t border-line' : ''} ${className}`}
    >
      <Container>
        {(eyebrow || title || subtitle) && (
          <div className="mb-9">
            {eyebrow && (
              <div className="mb-2 flex items-baseline gap-4">
                {number && (
                  <span className="font-mono text-sm text-accent">{number}</span>
                )}
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-fg-subtle">
                  {eyebrow}
                </span>
              </div>
            )}
            {title && (
              <h2 className="font-display text-[clamp(1.7rem,3.4vw,2.35rem)] font-semibold tracking-[-0.02em] text-fg">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-2 max-w-[56ch] leading-relaxed text-fg-muted">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
