import { NextResponse } from "next/server";
import { adminRequest, changed, fail, json, who } from "@/lib/market/admin-api";
import { acceptSender, dismissSender, linkSender, TriageError } from "@/lib/market/triage";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

/**
 * Act on one sender in triage (task 043). The ID is the sender's email hash.
 *
 *   { "action": "accept" }
 *   { "action": "link", "email": "<an existing contact's address>" }
 *   { "action": "dismiss", "scope": "sender" | "domain" }
 */
export async function POST(request: Request, { params }: Ctx) {
  const ctx = await adminRequest(request, { body: true });
  if (ctx instanceof NextResponse) return ctx;
  const id = (await params).id;
  const body = (ctx.body && typeof ctx.body === "object" ? ctx.body : {}) as Record<string, unknown>;
  const roles = ctx.principal.roles;
  try {
    if (body.action === "accept") {
      const r = await acceptSender(id, roles, who(ctx.principal));
      changed();
      return json({ ok: true, ...r });
    }
    if (body.action === "link") {
      if (typeof body.email !== "string" || !body.email.trim()) return fail(400, "Enter the contact's email address");
      const r = await linkSender(id, body.email, roles, who(ctx.principal));
      changed();
      return json({ ok: true, ...r });
    }
    if (body.action === "dismiss") {
      if (body.scope !== "sender" && body.scope !== "domain") return fail(400, "scope must be sender or domain");
      const r = await dismissSender(id, body.scope, roles, who(ctx.principal));
      return json({ ok: true, ...r });
    }
    return fail(400, "action must be accept, link or dismiss");
  } catch (err) {
    if (err instanceof TriageError) return fail(err.status, err.message);
    console.error("[admin] triage action failed:", (err as Error).message);
    return fail(500, "The triage action did not finish");
  }
}
