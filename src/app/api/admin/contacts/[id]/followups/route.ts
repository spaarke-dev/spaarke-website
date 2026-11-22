import { NextResponse } from "next/server";
import { changed, contactRequest, fail, json, who } from "@/lib/market/admin-api";
import { addFollowUp, FollowUpError, parseNewFollowUp } from "@/lib/market/followup-admin";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

/** Add a follow-up to a contact (task 034). */
export async function POST(request: Request, { params }: Ctx) {
  const ctx = await contactRequest(request, (await params).id, { body: true });
  if (ctx instanceof NextResponse) return ctx;
  try {
    const followUp = await addFollowUp(ctx.contact, parseNewFollowUp(ctx.body), ctx.principal.roles, who(ctx.principal));
    changed();
    return json({ ok: true, followUp });
  } catch (err) {
    if (err instanceof FollowUpError) return fail(err.status, err.message);
    console.error("[admin] follow-up create failed:", (err as Error).message);
    return fail(500, "The follow-up was not saved");
  }
}
