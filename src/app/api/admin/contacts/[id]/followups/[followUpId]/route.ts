import { NextResponse } from "next/server";
import { changed, contactRequest, fail, json, who } from "@/lib/market/admin-api";
import { changeFollowUp, FollowUpError, parseFollowUpPatch, removeFollowUp } from "@/lib/market/followup-admin";
import { isFollowUpId } from "@/lib/market/followups";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string; followUpId: string }> };

/** Edit a follow-up or change its status (task 034). */
export async function PATCH(request: Request, { params }: Ctx) {
  const { id, followUpId } = await params;
  const ctx = await contactRequest(request, id, { body: true });
  if (ctx instanceof NextResponse) return ctx;
  if (!isFollowUpId(followUpId)) return fail(404, "No such follow-up");
  try {
    const followUp = await changeFollowUp(ctx.contact.id, followUpId, parseFollowUpPatch(ctx.body), who(ctx.principal));
    if (!followUp) return fail(404, "No such follow-up");
    changed();
    return json({ ok: true, followUp });
  } catch (err) {
    if (err instanceof FollowUpError) return fail(err.status, err.message);
    console.error("[admin] follow-up edit failed:", (err as Error).message);
    return fail(500, "The change was not saved");
  }
}

export async function DELETE(request: Request, { params }: Ctx) {
  const { id, followUpId } = await params;
  const ctx = await contactRequest(request, id, { body: false });
  if (ctx instanceof NextResponse) return ctx;
  if (!isFollowUpId(followUpId)) return fail(404, "No such follow-up");
  try {
    if (!(await removeFollowUp(ctx.contact.id, followUpId, who(ctx.principal)))) return fail(404, "No such follow-up");
    changed();
    return json({ ok: true });
  } catch (err) {
    console.error("[admin] follow-up delete failed:", (err as Error).message);
    return fail(500, "The follow-up was not deleted");
  }
}
