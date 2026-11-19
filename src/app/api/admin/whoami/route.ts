import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { TableClient } from "@azure/data-tables";
import { decodePrincipal, swaHeaderNames } from "@/lib/market/spike-principal";

/**
 * Auth spike (task 001): a route handler guarded only by the SWA route rule.
 *
 *   GET /api/admin/whoami          the decoded principal as SWA delivered it
 *   GET /api/admin/whoami?probe=1  also times one Table Storage write and
 *                                  delete in a MaSpike table, to size the
 *                                  recordActivity timeout (question 7)
 */
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };

async function probeTableWrite(): Promise<Record<string, unknown>> {
  const cs = process.env.STORAGE_ACCOUNT_CONNECTION;
  if (!cs) return { skipped: "STORAGE_ACCOUNT_CONNECTION not set" };
  const client = TableClient.fromConnectionString(cs, "MaSpike");
  const t0 = performance.now();
  try {
    await client.createTable();
  } catch (err) {
    const code = (err as { statusCode?: number }).statusCode;
    if (code && code !== 409) throw err;
  }
  const t1 = performance.now();
  const rowKey = `${Date.now()}`;
  await client.upsertEntity({ partitionKey: "probe", rowKey, note: "auth spike timing" });
  const t2 = performance.now();
  await client.upsertEntity({ partitionKey: "probe", rowKey, note: "auth spike timing, second write" });
  const t3 = performance.now();
  await client.deleteEntity("probe", rowKey);
  const t4 = performance.now();
  return {
    createTableMs: Math.round(t1 - t0),
    firstUpsertMs: Math.round(t2 - t1),
    secondUpsertMs: Math.round(t3 - t2),
    deleteMs: Math.round(t4 - t3),
  };
}

export async function GET(request: NextRequest) {
  const raw = request.headers.get("x-ms-client-principal");
  const body: Record<string, unknown> = {
    route: "/api/admin/whoami (route handler)",
    hasPrincipalHeader: Boolean(raw),
    principal: decodePrincipal(raw),
    swaHeaders: swaHeaderNames(request.headers),
  };
  if (request.nextUrl.searchParams.get("probe") === "1") {
    try {
      body.tableTiming = await probeTableWrite();
    } catch (err) {
      body.tableTiming = { error: (err as Error).message };
    }
  }
  return NextResponse.json(body, { headers: NO_STORE });
}
