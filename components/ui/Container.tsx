type Props = {
  children: React.ReactNode;
  /** Narrower measure for articles / project detail (920px vs 1120px). */
  narrow?: boolean;
  className?: string;
};

export default function Container({
  children,
  narrow = false,
  className = ''
}: Props) {
  return (
    <div
      className={`mx-auto w-full px-6 ${narrow ? 'max-w-230' : 'max-w-280'} ${className}`}
    >
      {children}
    </div>
  );
}
