/**
 * The bits every surface needs, kept out of any of them.
 *
 * The close icon and the panel width used to live in `InsightsPanel`, which meant
 * the sheet and the reader imported from the panel, the panel imported the
 * provider, and the provider imported the sheet and the reader. That cycle
 * resolved only because every use happened at render time. Cycles that work by
 * accident stop working by accident.
 */

/** The desktop panel's width. `shiftArticle` and the reader both measure against it. */
export const PANEL_WIDTH = 420;

/** Clears the sticky site header, which is about 100px tall. */
export const SURFACE_TOP = 100;

export function CloseIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}
