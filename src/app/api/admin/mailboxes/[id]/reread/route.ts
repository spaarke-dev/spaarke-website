import { NextResponse } from "next/server";
import { adminRequest, fail, json, who } from "@/lib/market/admin-api";
import { getMailbox } from "@/lib/market/mailboxes";
import { parseRereadFrom, rereadFrom } from "@/lib/market/sync";
import { audit } from "@/lib/market/audit";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

/**
 * Read a mailbox's mail again from a date, on the next sync runs. Use it after
 * an import adds contacts, so earlier mail with them reaches their timelines.
 * Body: { from: "yyyy-mm-dd" }.
 */
export async function POST(request: Request, { params }: Ctx) {
  const ctx = await adminRequest(request, { body: true });
  if (ctx instanceof NextResponse) return ctx;
  const id = (await params).id;
  const now = new Date();
  const from = parseRereadFrom((ctx.body as { from?: unknown } | null)?.from, now);
  if (typeof from === "string") return fail(400, from);
  try {
    const mailbox = await getMailbox(id);
    if (!mailbox) return fail(404, "No such mailbox");
    const moved = await rereadFrom(mailbox.id, from);
    await audit(
      { who: who(ctx.principal), action: "mailbox.reread", entity: "mailbox", entityId: mailbox.id, after: { from: from.toISOString(), folders: moved.join(",") } },
      now,
    );
    return json({ ok: true, from: from.toISOString(), folders: moved });
  } catch (err) {
    console.error("[admin] mailbox reread failed:", (err as Error).message);
    return fail(500, "The mailbox was not set to read again");
  }
}
