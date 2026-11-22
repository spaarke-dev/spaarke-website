import { NextResponse } from "next/server";
import { changed, contactRequest, fail, json, who } from "@/lib/market/admin-api";
import { MergeError, mergeContacts, previewMerge } from "@/lib/market/contact-admin";
import { findContactByEmail } from "@/lib/market/contacts";
import { visibleContact } from "@/lib/market/queries";

export const dynamic = "force-dynamic";

/**
 * Merge another contact into this one (task 031).
 * Body: { other: email or contact ID, confirm?: true }. Without `confirm` it
 * only returns what would move, for the confirmation step.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const ctx = await contactRequest(request, (await params).id, { body: true });
  if (ctx instanceof NextResponse) return ctx;
  const body = (ctx.body ?? {}) as { other?: unknown; confirm?: unknown };
  if (typeof body.other !== "string" || !body.other.trim()) return fail(400, "Enter the other contact's email");

  const ref = body.other.trim();
  const found = /^[0-9a-f]{64}$/.test(ref) ? { id: ref } : await findContactByEmail(ref);
  const other = found ? await visibleContact(found.id, ctx.principal.roles) : null;
  if (!other) return fail(404, "No contact with that email");

  try {
    if (body.confirm !== true) {
      const preview = await previewMerge(ctx.contact.id, other.id);
      return json({
        ok: true,
        preview,
        other: { id: other.id, name: other.name ?? null, email: other.email, organization: other.organizationName ?? null },
      });
    }
    const summary = await mergeContacts(ctx.contact.id, other.id, who(ctx.principal));
    changed();
    return json({ ok: true, summary });
  } catch (err) {
    if (err instanceof MergeError) return fail(400, err.message);
    console.error("[admin] merge failed:", (err as Error).message);
    return fail(500, "The merge did not finish; run it again");
  }
}
