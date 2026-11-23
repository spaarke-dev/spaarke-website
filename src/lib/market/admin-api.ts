import { NextResponse } from "next/server";
import { requireAdminApi, type Principal } from "@/lib/market/auth";
import { visibleContact, clearQueryCache, type ContactRow } from "@/lib/market/queries";
import { isMarketConfigured } from "@/lib/market/tables";
import { getCampaign, type Campaign } from "@/lib/market/campaigns";
import { isVisibleTo } from "@/lib/market/visibility";
import { visibleOrganization } from "@/lib/market/org-admin";
import type { Organization } from "@/lib/market/types";

/**
 * Shared steps for the admin API routes: the role check, a same-site check
 * for anything that changes data, the JSON body, and finding a contact the
 * user may see. A contact the user may not see is reported as not found, so
 * the response does not reveal that an investor record exists.
 */

const HEADERS = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };

export function json(body: unknown, status = 200): NextResponse {
  return NextResponse.json(body, { status, headers: HEADERS });
}

export function fail(status: number, error: string): NextResponse {
  return json({ error }, status);
}

/**
 * A change must come from the admin pages themselves. Browsers set
 * Sec-Fetch-Site and a page cannot forge it; behind Static Web Apps the Host
 * header may not be the public host, so Origin is compared only as a fallback
 * for clients that do not send Sec-Fetch-Site.
 */
export function sameSite(headers: Headers): boolean {
  const site = headers.get("sec-fetch-site");
  if (site) return site === "same-origin";
  const origin = headers.get("origin");
  if (!origin) return true;
  try {
    const host = new URL(origin).host;
    return [headers.get("x-forwarded-host"), headers.get("host")].some((h) => h === host);
  } catch {
    return false;
  }
}

export type AdminRequest = { principal: Principal; body: unknown };
export type AdminContext = AdminRequest & { contact: ContactRow };

/**
 * The checks every admin route runs: role, same site for a change, storage,
 * and a JSON body when one is expected. Returns the context, or the response
 * to send when a check fails.
 */
export async function adminRequest(request: Request, opts: { body: boolean }): Promise<AdminRequest | NextResponse> {
  const auth = requireAdminApi(request);
  if (!auth.ok) return auth.response;
  if (request.method !== "GET" && !sameSite(request.headers)) return fail(403, "Cross-site request refused");
  if (!isMarketConfigured()) return fail(503, "Storage is not configured");

  let body: unknown = undefined;
  if (opts.body) {
    if (!(request.headers.get("content-type") ?? "").toLowerCase().startsWith("application/json")) {
      return fail(415, "Send JSON");
    }
    try {
      body = await request.json();
    } catch {
      return fail(400, "The body is not valid JSON");
    }
  }
  return { principal: auth.principal, body };
}

/** adminRequest, plus a contact the user may see (or 404). */
export async function contactRequest(
  request: Request,
  contactId: string,
  opts: { body: boolean },
): Promise<AdminContext | NextResponse> {
  const ctx = await adminRequest(request, opts);
  if (ctx instanceof NextResponse) return ctx;
  const contact = await visibleContact(contactId, ctx.principal.roles);
  if (!contact) return fail(404, "No such contact");
  return { ...ctx, contact };
}

/** adminRequest, plus a campaign the user may see (or 404). */
export async function campaignRequest(
  request: Request,
  slug: string,
  opts: { body: boolean },
): Promise<(AdminRequest & { campaign: Campaign }) | NextResponse> {
  const ctx = await adminRequest(request, opts);
  if (ctx instanceof NextResponse) return ctx;
  const campaign = await getCampaign(slug);
  if (!campaign || !isVisibleTo(campaign, ctx.principal.roles)) return fail(404, "No such campaign");
  return { ...ctx, campaign };
}

/** adminRequest, plus an organization the user may see (or 404). */
export async function organizationRequest(
  request: Request,
  id: string,
  opts: { body: boolean },
): Promise<(AdminRequest & { organization: Organization }) | NextResponse> {
  const ctx = await adminRequest(request, opts);
  if (ctx instanceof NextResponse) return ctx;
  const organization = await visibleOrganization(id, ctx.principal.roles);
  if (!organization) return fail(404, "No such organization");
  return { ...ctx, organization };
}

/** The audit's `who`: the signed-in address. */
export function who(principal: Principal): string {
  return principal.userDetails || principal.userId;
}

/** Lists read through a short cache; drop it after a change so the next page view is current. */
export function changed(): void {
  clearQueryCache();
}
