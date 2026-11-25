import { NextResponse } from "next/server";
import { adminRequest, changed, fail, json, who } from "@/lib/market/admin-api";
import { canSeeInvestor } from "@/lib/market/auth";
import { addContactByHand, parseNewContact } from "@/lib/market/contact-add";
import { PatchError } from "@/lib/market/contact-admin";

export const dynamic = "force-dynamic";

/**
 * Add one contact by hand (phase 2 FR-02, task 011). An address that already
 * belongs to a contact creates nothing; the answer says so, with the contact's
 * ID when the user may see it.
 */
export async function POST(request: Request) {
  const ctx = await adminRequest(request, { body: true });
  if (ctx instanceof NextResponse) return ctx;
  try {
    const input = parseNewContact(ctx.body);
    if (input.visibility === "investor" && !canSeeInvestor(ctx.principal)) {
      return fail(403, "Only an admin with the investor role can add an investor contact");
    }
    const r = await addContactByHand(input, ctx.principal.roles, who(ctx.principal));
    switch (r.status) {
      case "created":
        changed();
        return json({ ok: true, created: true, contactId: r.contactId }, 201);
      case "exists":
        return json({ ok: true, created: false, contactId: r.contactId });
      case "deleted":
        return fail(409, "This address belonged to a contact that was deleted, so it is not added back");
      default:
        return fail(503, "Storage is not available; try again");
    }
  } catch (err) {
    if (err instanceof PatchError) return fail(400, err.message);
    console.error("[admin] add contact failed:", (err as Error).message);
    return fail(500, "The contact was not saved");
  }
}
