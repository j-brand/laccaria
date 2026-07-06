/**
 * Client-safe project constants (no `node:fs`), so they can be imported into
 * client components like ProjectCard without pulling the filesystem loader in.
 */

/** Fallback banner gradient for projects without an explicit `gradient`. */
export const DEFAULT_GRADIENT = 'linear-gradient(135deg,#1B3524,#3A7150)';
