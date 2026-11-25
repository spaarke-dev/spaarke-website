import { NextResponse } from "next/server";
import { campaignRequest, changed, fail, json, who } from "@/lib/market/admin-api";
import { StepError, deleteStep, editStep, parseStep } from "@/lib/market/steps";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ slug: string; id: string }> };

/** Edit a step, or switch it on or off with `{ enabled }` (phase 2 FR-09). */
export async function PATCH(request: Request, { params }: Ctx) {
  const { slug, id } = await params;
  const ctx = await campaignRequest(request, slug, { body: true });
  if (ctx instanceof NextResponse) return ctx;
  try {
    const step = await editStep(ctx.campaign.slug, id, parseStep(ctx.body, { partial: true }), who(ctx.principal));
    if (!step) return fail(404, "No such step");
    changed();
    return json({ ok: true, step });
  } catch (err) {
    if (err instanceof StepError) return fail(err.status, err.message);
    console.error("[admin] step edit failed:", (err as Error).message);
    return fail(500, "The step was not saved");
  }
}

/** Remove a step. The follow-ups it already made stay. */
export async function DELETE(request: Request, { params }: Ctx) {
  const { slug, id } = await params;
  const ctx = await campaignRequest(request, slug, { body: false });
  if (ctx instanceof NextResponse) return ctx;
  try {
    if (!(await deleteStep(ctx.campaign.slug, id, who(ctx.principal)))) return fail(404, "No such step");
    changed();
    return json({ ok: true });
  } catch (err) {
    if (err instanceof StepError) return fail(err.status, err.message);
    console.error("[admin] step delete failed:", (err as Error).message);
    return fail(500, "The step was not removed");
  }
}
