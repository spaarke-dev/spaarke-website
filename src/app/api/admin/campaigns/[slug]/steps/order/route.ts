import { NextResponse } from "next/server";
import { campaignRequest, changed, fail, json, who } from "@/lib/market/admin-api";
import { StepError, reorderSteps } from "@/lib/market/steps";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ slug: string }> };

/** Put the campaign's steps in a new order. Body: `{ ids: [every step ID, in order] }`. */
export async function POST(request: Request, { params }: Ctx) {
  const ctx = await campaignRequest(request, (await params).slug, { body: true });
  if (ctx instanceof NextResponse) return ctx;
  try {
    const body = ctx.body as { ids?: unknown } | null;
    const steps = await reorderSteps(ctx.campaign.slug, body?.ids, who(ctx.principal));
    changed();
    return json({ ok: true, steps });
  } catch (err) {
    if (err instanceof StepError) return fail(err.status, err.message);
    console.error("[admin] step order failed:", (err as Error).message);
    return fail(500, "The order was not saved");
  }
}
