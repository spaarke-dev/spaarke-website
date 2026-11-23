import { NextResponse } from "next/server";
import { adminRequest, fail, json, who } from "@/lib/market/admin-api";
import { editMailbox, MailboxError, parseMailboxPatch, removeMailbox } from "@/lib/market/mailboxes";
import { canSeeInvestor } from "@/lib/market/auth";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

/** Edit, pause or resume a mailbox (task 041). */
export async function PATCH(request: Request, { params }: Ctx) {
  const ctx = await adminRequest(request, { body: true });
  if (ctx instanceof NextResponse) return ctx;
  try {
    const patch = parseMailboxPatch(ctx.body);
    if (patch.visibility && !canSeeInvestor(ctx.principal)) return fail(403, "Visibility needs the investor role");
    const mailbox = await editMailbox((await params).id, patch, who(ctx.principal));
    return json({ ok: true, mailbox });
  } catch (err) {
    if (err instanceof MailboxError) return fail(err.status, err.message);
    console.error("[admin] mailbox edit failed:", (err as Error).message);
    return fail(500, "The edit was not saved");
  }
}

/** Remove a mailbox from the registry; logged activities stay (task 041). */
export async function DELETE(request: Request, { params }: Ctx) {
  const ctx = await adminRequest(request, { body: false });
  if (ctx instanceof NextResponse) return ctx;
  try {
    const mailbox = await removeMailbox((await params).id, who(ctx.principal));
    return json({ ok: true, removed: mailbox.id });
  } catch (err) {
    if (err instanceof MailboxError) return fail(err.status, err.message);
    console.error("[admin] mailbox remove failed:", (err as Error).message);
    return fail(500, "The mailbox was not removed");
  }
}
