import { NextResponse } from "next/server";
import { campaignRequest, changed, fail, json, who } from "@/lib/market/admin-api";
import { bulkCreate, FollowUpError, parseBulk } from "@/lib/market/followup-admin";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ slug: string }> };

/** One follow-up for each selected member of a campaign (task 034). Running it again adds none. */
export async function POST(request: Request, { params }: Ctx) {
  const ctx = await campaignRequest(request, (await params).slug, { body: true });
  if (ctx instanceof NextResponse) return ctx;
  try {
    const result = await bulkCreate(ctx.campaign.slug, parseBulk(ctx.body), ctx.principal.roles, who(ctx.principal));
    changed();
    return json({ ok: true, ...result });
  } catch (err) {
    if (err instanceof FollowUpError) return fail(err.status, err.message);
    console.error("[admin] bulk follow-ups failed:", (err as Error).message);
    return fail(500, "The follow-ups were not all added; run it again. Ones already added are not doubled.");
  }
}
