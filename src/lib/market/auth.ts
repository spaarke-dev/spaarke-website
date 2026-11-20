import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { adminStatus, readPrincipal, type Principal } from "@/lib/market/principal";
import { canSeeInvestor as rolesSeeInvestor } from "@/lib/market/visibility";

/**
 * Guards for the admin area (FR-01). The design is in
 * projects/market-access/notes/auth-spike.md:
 *
 * - Pages: SWA route rules on /admin and /admin/* already send signed-out
 *   visitors to sign-in and return 403 without the role. requireAdmin() checks
 *   again. Call it in every admin page that reads data, not only the layout,
 *   because a layout does not re-render on client navigation.
 * - Route handlers under /api/admin have no SWA role rule (so API callers get
 *   JSON, not a sign-in redirect). Every handler must start with
 *   requireAdminApi().
 */

export type { Principal } from "@/lib/market/principal";

export type AdminPageAccess =
  | { status: "ok"; principal: Principal }
  | { status: "forbidden"; principal: Principal };

/**
 * For server components. Redirects to sign-in when signed out; returns
 * "forbidden" when the role is missing so the caller renders a 403 message.
 */
export async function requireAdmin(returnTo = "/admin"): Promise<AdminPageAccess> {
  const principal = readPrincipal(await headers());
  const status = adminStatus(principal);
  if (status === "signed-out" || !principal) {
    const target = returnTo.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/admin";
    redirect(`/.auth/login/aad?post_login_redirect_uri=${encodeURIComponent(target)}`);
  }
  return status === "ok" ? { status: "ok", principal } : { status: "forbidden", principal };
}

const API_HEADERS = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };

/**
 * For route handlers:
 *
 *   const auth = requireAdminApi(request);
 *   if (!auth.ok) return auth.response;
 */
export function requireAdminApi(
  request: Request,
): { ok: true; principal: Principal } | { ok: false; response: NextResponse } {
  const principal = readPrincipal(request.headers);
  const status = adminStatus(principal);
  if (status === "ok" && principal) return { ok: true, principal };
  return {
    ok: false,
    response: NextResponse.json(
      { error: status === "signed-out" ? "Sign in required" : "Admin role required" },
      { status: status === "signed-out" ? 401 : 403, headers: API_HEADERS },
    ),
  };
}

/** FR-02: whether this user may see records marked investor. */
export function canSeeInvestor(principal: Principal): boolean {
  return rolesSeeInvestor(principal.roles);
}
