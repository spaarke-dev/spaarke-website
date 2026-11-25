import { NextResponse } from "next/server";
import { campaignRequest, changed, fail, json, who } from "@/lib/market/admin-api";
import { BriefError, parseBriefText, saveCampaignBrief } from "@/lib/market/campaign-brief";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ slug: string }> };

/** Save the campaign's brief text to every coded member's link (phase 2 FR-04). */
export async function PUT(request: Request, { params }: Ctx) {
  const ctx = await campaignRequest(request, (await params).slug, { body: true });
  if (ctx instanceof NextResponse) return ctx;
  try {
    const text = parseBriefText(ctx.body);
    const r = await saveCampaignBrief(ctx.campaign, text, who(ctx.principal));
    changed();
    return json({ ok: true, created: r.created, updated: r.updated });
  } catch (err) {
    if (err instanceof BriefError) return fail(err.status, err.message);
    console.error("[admin] brief save failed:", (err as Error).message);
    return fail(500, "The brief was not saved");
  }
}
