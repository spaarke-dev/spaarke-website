/**
 * Auth spike only (task 001). Decodes the header SWA authentication adds, so
 * the spike routes can show what reached the server. Replaced by
 * src/lib/market/auth.ts in task 002; this branch is never merged.
 */
export function decodePrincipal(raw: string | null): unknown {
  if (!raw) return null;
  try {
    return JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
  } catch {
    return { undecodable: true, length: raw.length };
  }
}

export function swaHeaderNames(headers: Headers): string[] {
  return [...headers.keys()].filter((k) => k.startsWith("x-ms-") || k.startsWith("x-forwarded-")).sort();
}
