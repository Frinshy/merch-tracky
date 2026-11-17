/**
 * Production replacement for `dev-toolbar.tsx`, swapped in by the alias in
 * next.config.mjs so the real toolbar's code never reaches the bundle.
 */
export function DevToolbar() {
  return null;
}
