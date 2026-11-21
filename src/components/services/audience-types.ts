/**
 * Audience types and the parameter check, kept out of the "use client"
 * module so the server page can call `isAudience` directly.
 */
export type Audience = "firm" | "corporate";
export type ByAudience<T> = Record<Audience, T>;

export function isAudience(v: unknown): v is Audience {
  return v === "firm" || v === "corporate";
}
