import { NextResponse } from "next/server";
import { campaignRequest, changed, fail, json, who } from "@/lib/market/admin-api";
import { BriefError, parseBriefActive, setCampaignBriefsActive } from "@/lib/market/campaign-brief";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ slug: string }> };

/** Turn every brief link in the campaign off, or on again (phase 2 FR-04). */
export async function POST(request: Request, { params }: Ctx) {
  const ctx = await campaignRequest(request, (await params).slug, { body: true });
  if (ctx instanceof NextResponse) return ctx;
  try {
    const active = parseBriefActive(ctx.body);
    await setCampaignBriefsActive(ctx.campaign, active, who(ctx.principal));
    changed();
    return json({ ok: true, active });
  } catch (err) {
    if (err instanceof BriefError) return fail(err.status, err.message);
    console.error("[admin] brief switch failed:", (err as Error).message);
    return fail(500, "The briefs were not changed");
  }
}
