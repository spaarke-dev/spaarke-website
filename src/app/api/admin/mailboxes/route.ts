import { NextResponse } from "next/server";
import { adminRequest, fail, json, who } from "@/lib/market/admin-api";
import { addMailbox, MailboxError, parseNewMailbox } from "@/lib/market/mailboxes";
import { canSeeInvestor } from "@/lib/market/auth";

export const dynamic = "force-dynamic";

/** Register a mailbox for the mail sync (task 041). This does not grant Exchange access. */
export async function POST(request: Request) {
  const ctx = await adminRequest(request, { body: true });
  if (ctx instanceof NextResponse) return ctx;
  try {
    const input = parseNewMailbox(ctx.body);
    if (input.visibility === "investor" && !canSeeInvestor(ctx.principal)) {
      return fail(403, "Investor visibility needs the investor role");
    }
    const mailbox = await addMailbox(input, who(ctx.principal));
    return json({ ok: true, mailbox }, 201);
  } catch (err) {
    if (err instanceof MailboxError) return fail(err.status, err.message);
    console.error("[admin] mailbox add failed:", (err as Error).message);
    return fail(500, "The mailbox was not saved");
  }
}
