import type {MDXComponents} from 'mdx/types';

// Styling for MDX-rendered project content (no Tailwind typography plugin needed).
export const mdxComponents: MDXComponents = {
  h2: (props) => (
    <h2 className="mt-10 text-2xl font-semibold tracking-tight" {...props} />
  ),
  h3: (props) => (
    <h3 className="mt-8 text-xl font-semibold tracking-tight" {...props} />
  ),
  p: (props) => <p className="mt-4 leading-relaxed text-foreground/90" {...props} />,
  ul: (props) => (
    <ul className="mt-4 list-disc space-y-2 pl-6 text-foreground/90" {...props} />
  ),
  ol: (props) => (
    <ol className="mt-4 list-decimal space-y-2 pl-6 text-foreground/90" {...props} />
  ),
  a: (props) => <a className="text-accent hover:underline" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="mt-6 border-l-2 border-accent pl-4 italic text-muted"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="rounded bg-foreground/10 px-1.5 py-0.5 text-sm"
      {...props}
    />
  )
};
