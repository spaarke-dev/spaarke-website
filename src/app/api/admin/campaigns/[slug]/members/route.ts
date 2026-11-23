import { NextResponse } from "next/server";
import { campaignRequest, changed, fail, json, who } from "@/lib/market/admin-api";
import { addMembers, CampaignError, parseAddMembers } from "@/lib/market/campaign-admin";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ slug: string }> };

/** Add existing contacts to a campaign by email or contact ID (task 033). */
export async function POST(request: Request, { params }: Ctx) {
  const ctx = await campaignRequest(request, (await params).slug, { body: true });
  if (ctx instanceof NextResponse) return ctx;
  try {
    const input = parseAddMembers(ctx.body);
    const result = await addMembers(ctx.campaign.slug, input, ctx.principal.roles, who(ctx.principal));
    changed();
    return json({ ok: true, ...result });
  } catch (err) {
    if (err instanceof CampaignError) return fail(err.status, err.message);
    console.error("[admin] add members failed:", (err as Error).message);
    return fail(500, "The members were not all added; run it again");
  }
}
