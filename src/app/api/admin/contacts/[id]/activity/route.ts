import { NextResponse } from "next/server";
import { changed, contactRequest, fail, json } from "@/lib/market/admin-api";
import { isLoggableType, logActivity, PatchError } from "@/lib/market/contact-admin";
import { SUMMARY_MAX } from "@/lib/market/activity";

export const dynamic = "force-dynamic";

/**
 * Log a note, in-person meeting or LinkedIn message by hand (FR-15).
 * Body: { type, summary, occurredAt? }.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const ctx = await contactRequest(request, (await params).id, { body: true });
  if (ctx instanceof NextResponse) return ctx;
  const body = (ctx.body ?? {}) as { type?: unknown; summary?: unknown; occurredAt?: unknown };
  if (!isLoggableType(body.type)) return fail(400, "Unknown activity type");
  if (typeof body.summary !== "string") return fail(400, "Write something first");
  if (body.summary.length > SUMMARY_MAX) return fail(400, `Keep it under ${SUMMARY_MAX} characters`);
  if (body.occurredAt !== undefined && typeof body.occurredAt !== "string") return fail(400, "The date is not valid");
  try {
    const result = await logActivity(ctx.contact.id, {
      type: body.type,
      summary: body.summary,
      occurredAt: body.occurredAt || undefined,
    });
    changed();
    return result.status === "recorded" ? json({ ok: true, activityId: result.activityId }) : fail(409, "Not recorded");
  } catch (err) {
    if (err instanceof PatchError) return fail(400, err.message);
    console.error("[admin] log activity failed:", (err as Error).message);
    return fail(500, "The activity was not saved");
  }
}
