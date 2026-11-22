import { NextResponse } from "next/server";
import { changed, contactRequest, fail, json, who } from "@/lib/market/admin-api";
import { deleteContact, editContact, parsePatch, PatchError } from "@/lib/market/contact-admin";
import { canSeeInvestor } from "@/lib/market/auth";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

/** Edit a contact by hand (task 031). */
export async function PATCH(request: Request, { params }: Ctx) {
  const ctx = await contactRequest(request, (await params).id, { body: true });
  if (ctx instanceof NextResponse) return ctx;
  try {
    const patch = parsePatch(ctx.body);
    // Only a user who can see investor records may change who can see this one.
    if (patch.visibility && !canSeeInvestor(ctx.principal)) return fail(403, "Visibility needs the investor role");
    const contact = await editContact(ctx.contact.id, patch, who(ctx.principal));
    changed();
    return json({ ok: true, contact });
  } catch (err) {
    if (err instanceof PatchError) return fail(400, err.message);
    console.error("[admin] contact edit failed:", (err as Error).message);
    return fail(500, "The edit was not saved");
  }
}

/** Delete a contact and everything about it, leaving a tombstone (FR-17). */
export async function DELETE(request: Request, { params }: Ctx) {
  const ctx = await contactRequest(request, (await params).id, { body: false });
  if (ctx instanceof NextResponse) return ctx;
  try {
    const summary = await deleteContact(ctx.contact.id, who(ctx.principal));
    changed();
    return summary ? json({ ok: true, ...summary }) : fail(404, "No such contact");
  } catch (err) {
    console.error("[admin] contact delete failed:", (err as Error).message);
    return fail(500, "The delete did not finish; run it again");
  }
}
