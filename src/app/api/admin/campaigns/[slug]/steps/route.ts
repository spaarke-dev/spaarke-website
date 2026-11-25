import { NextResponse } from "next/server";
import { campaignRequest, changed, fail, json, who } from "@/lib/market/admin-api";
import { StepError, createStep, parseStep } from "@/lib/market/steps";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ slug: string }> };

/** Add a follow-up step to the campaign (phase 2 FR-09). */
export async function POST(request: Request, { params }: Ctx) {
  const ctx = await campaignRequest(request, (await params).slug, { body: true });
  if (ctx instanceof NextResponse) return ctx;
  try {
    const step = await createStep(ctx.campaign.slug, parseStep(ctx.body), who(ctx.principal));
    changed();
    return json({ ok: true, step }, 201);
  } catch (err) {
    if (err instanceof StepError) return fail(err.status, err.message);
    console.error("[admin] step create failed:", (err as Error).message);
    return fail(500, "The step was not saved");
  }
}
