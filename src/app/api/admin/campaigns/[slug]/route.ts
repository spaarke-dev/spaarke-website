import { NextResponse } from "next/server";
import { campaignRequest, changed, fail, json, who } from "@/lib/market/admin-api";
import { CampaignError, parseCampaign, updateCampaign } from "@/lib/market/campaign-admin";
import { canSeeInvestor } from "@/lib/market/auth";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ slug: string }> };

/** Edit a campaign's details (task 033). */
export async function PATCH(request: Request, { params }: Ctx) {
  const ctx = await campaignRequest(request, (await params).slug, { body: true });
  if (ctx instanceof NextResponse) return ctx;
  try {
    const patch = parseCampaign(ctx.body);
    if (patch.visibility && patch.visibility !== ctx.campaign.visibility && !canSeeInvestor(ctx.principal)) {
      return fail(403, "Visibility needs the investor role");
    }
    const campaign = await updateCampaign(ctx.campaign.slug, patch, who(ctx.principal));
    if (!campaign) return fail(404, "No such campaign");
    changed();
    return json({ ok: true, campaign });
  } catch (err) {
    if (err instanceof CampaignError) return fail(err.status, err.message);
    console.error("[admin] campaign edit failed:", (err as Error).message);
    return fail(500, "The edit was not saved");
  }
}
