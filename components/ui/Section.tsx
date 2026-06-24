import Container from './Container';

type Props = {
  id?: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
};

export default function Section({
  id,
  title,
  subtitle,
  children,
  className = ''
}: Props) {
  return (
    <section id={id} className={`py-16 sm:py-24 ${className}`}>
      <Container>
        {(title || subtitle) && (
          <div className="mb-10 max-w-2xl">
            {title && (
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {title}
              </h2>
            )}
            {subtitle && <p className="mt-3 text-muted">{subtitle}</p>}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
