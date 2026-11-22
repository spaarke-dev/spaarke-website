import { NextResponse } from "next/server";
import { adminRequest, fail, json } from "@/lib/market/admin-api";
import { checkAccess, getMailbox, MailboxError } from "@/lib/market/mailboxes";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

/** Check whether Graph can read the mailbox yet (task 041). Reads metadata of at most one message. */
export async function POST(request: Request, { params }: Ctx) {
  const ctx = await adminRequest(request, { body: false });
  if (ctx instanceof NextResponse) return ctx;
  try {
    const mailbox = await getMailbox((await params).id);
    if (!mailbox) return fail(404, "No such mailbox");
    return json(await checkAccess(mailbox));
  } catch (err) {
    if (err instanceof MailboxError) return fail(err.status, err.message);
    console.error("[admin] mailbox check failed:", (err as Error).message);
    return fail(500, "The check did not run");
  }
}
