import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIpHash } from "@/lib/ip-hash";
import { trackException } from "@/lib/logger";
import {
  partialAvailable,
  readPartial,
  sweepExpiredPartials,
  validRequestId,
} from "@/lib/insights/partial";

/**
 * The poll route. Reads the sentences of an answer that is still being written.
 *
 * Azure Static Web Apps buffers the POST response, so the answer arrives all at
 * once when the model has finished. This route is how a reader sees it arrive
 * instead. The client generates a request id, posts it, and polls here while the
 * POST is still open.
 *
 * **It reads one partition by id and session, and exposes nothing else.** There is
 * no list, no enumeration, no id that returns anything without the session that
 * wrote it. An unknown id, an expired id, a mismatched session and an answer that
 * has not started all return the same empty result, because a distinguishable
 * error would be an oracle for guessing ids.
 *
 * **No captcha, deliberately.** The gate belongs on the thing that costs money.
 * This route cannot cause a model call; it can only return rows that an already
 * gated POST wrote. Gating it again would mean holding a captcha token for the
 * life of a conversation for no gain.
 */

/**
 * Per-IP polls a minute. Generous on purpose.
 *
 * A reader polling every 400ms uses 150 a minute, and the audience is in-house
 * legal behind corporate NAT, so one address is a whole company rather than one
 * person. This is noise control, not spend control: each poll costs one query
 * against one small partition and cannot reach the model. Sized so a floor of
 * readers can all be mid-answer at once.
 */
function pollsPerMinute(): number {
  const parsed = Number(process.env.INSIGHTS_POLL_PER_MINUTE);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 900;
}

const WINDOW_MS = 60_000;
/** Roughly one poll in this many sweeps expired rows left by a request that died. */
const SWEEP_SAMPLE = 200;

/**
 * In-process, unlike the counters in `rate-limit-durable.ts`. That module is
 * durable because a missed block there costs money and a function recycle would
 * reset the count. Here a missed block costs a table query, so the simple thing
 * is the right thing.
 */
const polls = new Map<string, number[]>();

function allowPoll(ipHash: string): boolean {
  const now = Date.now();
  const recent = (polls.get(ipHash) ?? []).filter((at) => now - at < WINDOW_MS);
  if (recent.length >= pollsPerMinute()) {
    polls.set(ipHash, recent);
    return false;
  }
  recent.push(now);
  polls.set(ipHash, recent);
  // The map is bounded by pruning on read, and a poller that stops polling leaves
  // at most one stale array behind for a minute.
  if (polls.size > 5_000) {
    for (const [key, times] of polls) {
      if (times.every((at) => now - at >= WINDOW_MS)) polls.delete(key);
    }
  }
  return true;
}

const SESSION_PATTERN = /^[A-Za-z0-9_-]{8,64}$/;

export async function GET(request: NextRequest) {
  if (process.env.INSIGHTS_ENABLED !== "true") {
    return NextResponse.json({ ok: false, error: "DISABLED" }, { status: 503 });
  }

  const params = request.nextUrl.searchParams;
  const requestId = validRequestId(params.get("id"));
  const session = params.get("session") ?? "";
  const afterRaw = params.get("after") ?? "0";

  // Malformed parameters are a client bug rather than a missing answer, so they
  // do get an error. What they never get is a different error for a well formed id
  // that does not exist.
  if (!requestId || !SESSION_PATTERN.test(session) || !/^\d{1,6}$/.test(afterRaw)) {
    return NextResponse.json({ ok: false, error: "VALIDATION_ERROR" }, { status: 400 });
  }

  const ipHash = await getIpHash();
  if (!allowPoll(ipHash)) {
    return NextResponse.json(
      { ok: false, error: "RATE_LIMITED" },
      { status: 429, headers: { "Retry-After": "5" } },
    );
  }

  // No storage means no partials were written, which is a site that renders the
  // answer in one piece rather than a site that is broken.
  if (!partialAvailable()) {
    return noStore({ ok: true, events: [], cursor: 0, complete: false, available: false });
  }

  try {
    const read = await readPartial({ requestId, session, after: Number(afterRaw) });

    if (Math.random() < 1 / SWEEP_SAMPLE) {
      await sweepExpiredPartials().catch(() => {
        // Housekeeping. It must not cost the reader a sentence.
      });
    }

    return noStore({ ok: true, available: true, ...read });
  } catch (err) {
    trackException(err instanceof Error ? err : new Error(String(err)), { step: "partial-read" });
    // The POST is still running and still returns the whole answer, so a failure
    // here is reported as nothing new rather than as an error the client has to
    // handle. Progressive rendering stops; the answer does not.
    return noStore({ ok: true, events: [], cursor: Number(afterRaw), complete: false, available: false });
  }
}

function noStore(body: unknown) {
  return NextResponse.json(body, {
    headers: { "Cache-Control": "no-store, no-transform" },
  });
}

export function POST() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405, headers: { Allow: "GET" } });
}
