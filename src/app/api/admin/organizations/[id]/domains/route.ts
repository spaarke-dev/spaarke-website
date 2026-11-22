import { NextResponse } from "next/server";
import { changed, fail, json, organizationRequest, who } from "@/lib/market/admin-api";
import { addDomain, OrgError, removeDomain } from "@/lib/market/org-admin";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

function domainOf(body: unknown): unknown {
  return body && typeof body === "object" && !Array.isArray(body) ? (body as { domain?: unknown }).domain : undefined;
}

async function run(request: Request, { params }: Ctx, action: typeof addDomain) {
  const ctx = await organizationRequest(request, (await params).id, { body: true });
  if (ctx instanceof NextResponse) return ctx;
  try {
    const result = await action(ctx.organization.id, domainOf(ctx.body), ctx.principal.roles, who(ctx.principal));
    changed();
    return json({ ok: true, ...result });
  } catch (err) {
    if (err instanceof OrgError) return fail(400, err.message);
    console.error("[admin] organization domain change failed:", (err as Error).message);
    return fail(500, "The change did not finish; run it again");
  }
}

/** Point a domain at this organization and move its contacts here (FR-04). */
export function POST(request: Request, ctx: Ctx) {
  return run(request, ctx, addDomain);
}

/** Remove a domain override; its contacts go back to an organization of their own. */
export function DELETE(request: Request, ctx: Ctx) {
  return run(request, ctx, removeDomain);
}
