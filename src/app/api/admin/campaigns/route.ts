import { NextResponse } from "next/server";
import { adminRequest, changed, fail, json, who } from "@/lib/market/admin-api";
import { CampaignError, createCampaign, parseCampaign } from "@/lib/market/campaign-admin";
import { canSeeInvestor } from "@/lib/market/auth";

export const dynamic = "force-dynamic";

/** Create a campaign (task 033). */
export async function POST(request: Request) {
  const ctx = await adminRequest(request, { body: true });
  if (ctx instanceof NextResponse) return ctx;
  try {
    const input = parseCampaign(ctx.body);
    if (input.visibility === "investor" && !canSeeInvestor(ctx.principal)) {
      return fail(403, "Investor campaigns need the investor role");
    }
    const campaign = await createCampaign(input, who(ctx.principal));
    changed();
    return json({ ok: true, campaign }, 201);
  } catch (err) {
    if (err instanceof CampaignError) return fail(err.status, err.message);
    console.error("[admin] campaign create failed:", (err as Error).message);
    return fail(500, "The campaign was not saved");
  }
}
