/**
 * The signed-in user as Azure Static Web Apps reports it (FR-01).
 *
 * SWA authentication adds a base64 JSON `x-ms-client-principal` header to
 * every request from a signed-in user and strips any value a visitor sends
 * (see projects/market-access/notes/auth-spike.md, question 4), so the header
 * can be trusted. This module has no Next.js imports, so the check script can
 * load it; the guards that redirect or respond live in auth.ts.
 */

export const ADMIN_ROLE = "admin";

export interface Principal {
  userId: string;
  userDetails: string;
  identityProvider: string;
  roles: string[];
}

export type AdminStatus = "signed-out" | "forbidden" | "ok";

interface HeaderSource {
  get(name: string): string | null;
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
}

/** Decodes and validates the header value; null for anything malformed. */
export function decodePrincipal(raw: string | null | undefined): Principal | null {
  if (!raw || raw.length > 8192) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object") return null;
  const p = parsed as Record<string, unknown>;
  if (
    typeof p.userId !== "string" ||
    !p.userId ||
    typeof p.userDetails !== "string" ||
    typeof p.identityProvider !== "string" ||
    !isStringArray(p.userRoles) ||
    !p.userRoles.includes("authenticated")
  ) {
    return null;
  }
  return {
    userId: p.userId,
    userDetails: p.userDetails,
    identityProvider: p.identityProvider,
    roles: p.userRoles.filter((r) => r !== "anonymous"),
  };
}

/**
 * Local development only: `MA_DEV_PRINCIPAL=admin,investor` signs in a made-up
 * user with those roles. `next build` replaces NODE_ENV with "production", so
 * this branch is removed from production bundles.
 */
function devPrincipal(): Principal | null {
  if (process.env.NODE_ENV !== "development") return null;
  const roles = process.env.MA_DEV_PRINCIPAL;
  if (!roles) return null;
  return {
    userId: "dev",
    userDetails: "dev@localhost",
    identityProvider: "dev",
    roles: ["authenticated", ...roles.split(",").map((r) => r.trim()).filter(Boolean)],
  };
}

export function readPrincipal(headers: HeaderSource): Principal | null {
  return decodePrincipal(headers.get("x-ms-client-principal")) ?? devPrincipal();
}

export function adminStatus(principal: Principal | null): AdminStatus {
  if (!principal) return "signed-out";
  return principal.roles.includes(ADMIN_ROLE) ? "ok" : "forbidden";
}
