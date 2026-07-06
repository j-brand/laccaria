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
  /** Heading level for the title. Defaults to h2; use h1 for a page's main title. */
  titleAs?: 'h1' | 'h2';
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
  titleAs: TitleTag = 'h2',
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
                  <span className="font-mono text-sm text-accent-text">{number}</span>
                )}
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-fg-subtle">
                  {eyebrow}
                </span>
              </div>
            )}
            {title && (
              <TitleTag className="font-display text-[clamp(1.7rem,3.4vw,2.35rem)] font-semibold tracking-[-0.02em] text-fg">
                {title}
              </TitleTag>
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
