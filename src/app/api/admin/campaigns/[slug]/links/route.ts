import { NextResponse } from "next/server";
import { campaignRequest, fail, json, sameSite, who } from "@/lib/market/admin-api";
import { campaignLinks, LinksError, parsePagePath } from "@/lib/market/campaign-links";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ slug: string }> };

/**
 * Each coded member's links, for the links table and the CSV export (phase 2
 * FR-05). The answer carries brief keys, so it is never cached, and only the
 * admin pages themselves may ask for it.
 */
export async function GET(request: Request, { params }: Ctx) {
  if (!sameSite(request.headers)) return fail(403, "Cross-site request refused");
  const ctx = await campaignRequest(request, (await params).slug, { body: false });
  if (ctx instanceof NextResponse) return ctx;
  try {
    const page = parsePagePath(new URL(request.url).searchParams.get("page"));
    const links = await campaignLinks(ctx.campaign, ctx.principal.roles, page, who(ctx.principal));
    return json({ ok: true, links });
  } catch (err) {
    if (err instanceof LinksError) return fail(err.status, err.message);
    console.error("[admin] links failed:", (err as Error).message);
    return fail(500, "The links were not loaded");
  }
}
