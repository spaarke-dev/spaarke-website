import { NextResponse } from "next/server";
import { campaignRequest, fail, json, who } from "@/lib/market/admin-api";
import { CampaignError, overrideStatus, parseOverride, stopMemberSteps } from "@/lib/market/campaign-admin";
import { visibleContact } from "@/lib/market/queries";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ slug: string; contactId: string }> };

/**
 * Set or clear a member's status override (FR-09, NFR-06), body `{ status: <status> | null }`,
 * or stop or restart step follow-ups (phase 2 FR-09), body `{ stopSteps: boolean }`.
 */
export async function PATCH(request: Request, { params }: Ctx) {
  const { slug, contactId } = await params;
  const ctx = await campaignRequest(request, slug, { body: true });
  if (ctx instanceof NextResponse) return ctx;
  if (!(await visibleContact(contactId, ctx.principal.roles))) return fail(404, "No such member");
  try {
    const body = ctx.body as Record<string, unknown> | null;
    if (body && typeof body === "object" && "stopSteps" in body) {
      if (typeof body.stopSteps !== "boolean") return fail(400, "stopSteps must be true or false");
      const member = await stopMemberSteps(ctx.campaign.slug, contactId, body.stopSteps, who(ctx.principal));
      return member ? json({ ok: true, member }) : fail(404, "No such member");
    }
    const member = await overrideStatus(ctx.campaign.slug, contactId, parseOverride(ctx.body), who(ctx.principal));
    return member ? json({ ok: true, member }) : fail(404, "No such member");
  } catch (err) {
    if (err instanceof CampaignError) return fail(err.status, err.message);
    console.error("[admin] status override failed:", (err as Error).message);
    return fail(500, "The status was not saved");
  }
}
