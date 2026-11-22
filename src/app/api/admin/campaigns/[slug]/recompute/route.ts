import { NextResponse } from "next/server";
import { campaignRequest, changed, fail, json } from "@/lib/market/admin-api";
import { recomputeCampaign } from "@/lib/market/results";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ slug: string }> };

/** Derive member statuses from the log now, rather than waiting for them to go stale. */
export async function POST(request: Request, { params }: Ctx) {
  const ctx = await campaignRequest(request, (await params).slug, { body: false });
  if (ctx instanceof NextResponse) return ctx;
  try {
    const summary = await recomputeCampaign(ctx.campaign.slug);
    changed();
    return summary ? json({ ok: true, ...summary }) : fail(404, "No such campaign");
  } catch (err) {
    console.error("[admin] recompute failed:", (err as Error).message);
    return fail(500, "The statuses were not updated");
  }
}
