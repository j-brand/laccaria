import type {MDXComponents} from 'mdx/types';

// Styling for MDX-rendered project content (no Tailwind typography plugin needed).
export const mdxComponents: MDXComponents = {
  h2: (props) => (
    <h2
      className="mb-3.5 mt-9 font-display text-[22px] font-semibold tracking-[-0.01em] text-fg first:mt-0"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mb-2 mt-7 font-display text-lg font-semibold tracking-[-0.01em] text-fg"
      {...props}
    />
  ),
  p: (props) => (
    <p className="mb-5 text-[16.5px] leading-[1.7] text-fg-muted" {...props} />
  ),
  ul: (props) => (
    <ul
      className="mb-5 list-disc space-y-2 pl-6 text-[16.5px] leading-[1.7] text-fg-muted"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="mb-5 list-decimal space-y-2 pl-6 text-[16.5px] leading-[1.7] text-fg-muted"
      {...props}
    />
  ),
  a: (props) => (
    <a className="text-primary underline underline-offset-2 hover:text-accent" {...props} />
  ),
  blockquote: (props) => (
    <blockquote
      className="my-8 border-l-[3px] border-accent pl-5 font-display text-[19px] font-medium leading-relaxed text-fg [&>p]:m-0 [&>p]:text-fg"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="rounded bg-sunken px-1.5 py-0.5 font-mono text-[0.9em] text-fg"
      {...props}
    />
  ),
  img: ({alt = '', ...props}) => (
    // Native lazy-loading; MDX images have no known dimensions so next/image
    // (which needs width/height or fill) isn't a clean fit here.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      loading="lazy"
      decoding="async"
      className="chamfer-md my-6 h-auto w-full"
      {...props}
    />
  )
};
