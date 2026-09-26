import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { articleBySlug } from "@/lib/corpus";
import { getIpHash } from "@/lib/ip-hash";
import { checkRateLimit } from "@/lib/rate-limit";
import { trackEvent, trackException, flushTelemetry } from "@/lib/logger";
import { foundryClient, foundryConfig, isUpstreamRateLimit } from "@/lib/insights/client";
import { buildMessageRequest } from "@/lib/insights/prompt";
import { guardRequest } from "@/lib/insights/guard";
import { countersAvailable } from "@/lib/insights/rate-limit-durable";
import { recordSpend } from "@/lib/insights/ceiling";
import { recordTurn } from "@/lib/insights/capture";
import {
  AnswerAssembler,
  encodeEvent,
  ERROR_COPY,
  type InsightsErrorCode,
  type InsightsEvent,
} from "@/lib/insights/stream";
import type { InsightsTurn } from "@/lib/insights/types";

/**
 * The article insights assistant endpoint.
 *
 * Everything a reader experiences passes through here, and the two things that
 * must not be got wrong are the cache and the timeout.
 *
 * The cache is the cost model. A cached turn measured $0.032 and a cache miss
 * $0.379, so the request is composed by `buildMessageRequest` and nothing
 * per-request is allowed into the cached blocks.
 *
 * The timeout is the lesson from the contact form on 2026-09-25: two awaits with
 * no timeout, a promise that never settled, and a visitor who reasonably
 * concluded their message had sent. This call is slower and likelier to hang, so
 * there is a deadline on the first token and a deadline on the whole stream, and
 * every failure has copy that names what happened.
 *
 * **The endpoint is off unless INSIGHTS_ENABLED is set.** The defences of task 021
 * are in place, so the switch is no longer about exposure; it is that no
 * interface calls this yet, and a public route that spends money should come on
 * with the thing that uses it rather than before it. Turn it on with task 030.
 */

/**
 * Deadline for the first token. Cold starts and cache writes both live here: a
 * cache miss measured 4.6 seconds and a cold function adds to it.
 *
 * Both deadlines are overridable by app setting, for two reasons. Measured time
 * to first token can be tightened once there is production data, and a deadline
 * that cannot be forced cannot be tested, which is how the contact form shipped
 * with none.
 */
function deadlineMs(name: string, fallback: number): number {
  const parsed = Number(process.env[name]);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}
const FIRST_TOKEN_TIMEOUT_MS = () => deadlineMs("INSIGHTS_FIRST_TOKEN_TIMEOUT_MS", 30_000);
/** Deadline for the whole answer, measured from the first token. */
const STREAM_TIMEOUT_MS = () => deadlineMs("INSIGHTS_STREAM_TIMEOUT_MS", 120_000);

const MAX_QUESTION_CHARS = 1_000;
const MAX_HISTORY_TURNS = 12;
/** Bounds what a long conversation can cost, since history is billed uncached. */
const MAX_HISTORY_CHARS = 24_000;

type InsightsRequestBody = {
  question?: unknown;
  articleSlug?: unknown;
  history?: unknown;
  sessionId?: unknown;
  captchaToken?: unknown;
};

type ValidRequest = {
  question: string;
  articleSlug: string | null;
  history: InsightsTurn[];
  sessionId: string;
};

function validate(body: InsightsRequestBody): { ok: true; value: ValidRequest } | { ok: false; why: string } {
  const question = typeof body.question === "string" ? body.question.trim() : "";
  if (question.length === 0) return { ok: false, why: "empty question" };
  if (question.length > MAX_QUESTION_CHARS) return { ok: false, why: "question too long" };

  let articleSlug: string | null = null;
  if (typeof body.articleSlug === "string" && body.articleSlug.length > 0) {
    // Checked against the manifest rather than trusted, so the prompt cannot be
    // pointed at an article that does not exist.
    if (!articleBySlug(body.articleSlug)) return { ok: false, why: "unknown article" };
    articleSlug = body.articleSlug;
  }

  const history: InsightsTurn[] = [];
  if (Array.isArray(body.history)) {
    if (body.history.length > MAX_HISTORY_TURNS * 2) return { ok: false, why: "conversation too long" };
    let chars = 0;
    for (const turn of body.history) {
      const role = (turn as InsightsTurn)?.role;
      const content = (turn as InsightsTurn)?.content;
      if (role !== "user" && role !== "assistant") return { ok: false, why: "bad turn role" };
      if (typeof content !== "string" || content.length === 0) return { ok: false, why: "bad turn content" };
      chars += content.length;
      if (chars > MAX_HISTORY_CHARS) return { ok: false, why: "conversation too long" };
      history.push({ role, content });
    }
  }

  const sessionId =
    typeof body.sessionId === "string" && /^[A-Za-z0-9_-]{8,64}$/.test(body.sessionId)
      ? body.sessionId
      : "";
  if (!sessionId) return { ok: false, why: "missing session id" };

  return { ok: true, value: { question, articleSlug, history, sessionId } };
}

function errorResponse(code: InsightsErrorCode, status: number, extra?: Record<string, string>) {
  return NextResponse.json(
    { ok: false, error: code, message: ERROR_COPY[code] },
    { status, headers: extra },
  );
}

export async function POST(request: NextRequest) {
  if (process.env.INSIGHTS_ENABLED !== "true") {
    return errorResponse("DISABLED", 503);
  }

  const config = foundryConfig();
  if (!config) {
    trackEvent("insights.misconfigured");
    await flushTelemetry();
    return errorResponse("UPSTREAM_ERROR", 503);
  }

  let body: InsightsRequestBody;
  try {
    body = (await request.json()) as InsightsRequestBody;
  } catch {
    return errorResponse("VALIDATION_ERROR", 400);
  }

  const validation = validate(body);
  if (!validation.ok) {
    trackEvent("insights.validation_failed", { why: validation.why });
    await flushTelemetry();
    return errorResponse("VALIDATION_ERROR", 400);
  }
  const { question, articleSlug, history, sessionId } = validation.value;

  const ipHash = await getIpHash();

  // Four defences, because no single one holds. The captcha stops a script with
  // no browser, the per-IP counters stop one address, the per-session cap stops
  // one conversation, and the spend ceiling stops all of them together.
  //
  // They fail closed. If the counters cannot be read or written, the request is
  // refused: an unmetered call to a frontier model is the failure this is here to
  // prevent, so a few minutes without the feature is the better outcome. The one
  // exception is development with no storage connection, which falls back to the
  // in-process limiter and says so.
  const durable = countersAvailable();
  if (!durable) {
    if (process.env.NODE_ENV === "production") {
      trackEvent("insights.blocked.counters_unavailable");
      await flushTelemetry();
      return errorResponse("INTERNAL_ERROR", 503);
    }
    console.warn(
      "[insights] STORAGE_ACCOUNT_CONNECTION is not set, so the durable counters, the captcha check and the spend ceiling are all inactive. Development only.",
    );
    const rate = checkRateLimit(ipHash);
    if (!rate.allowed) {
      return errorResponse("RATE_LIMITED", 429, { "Retry-After": String(rate.retryAfter) });
    }
  }

  if (durable) {
    const guard = await guardRequest({
      ipHash,
      sessionId,
      isFirstTurn: history.length === 0,
      captchaToken: typeof body.captchaToken === "string" ? body.captchaToken : "",
    });
    if (!guard.ok) {
      trackEvent(`insights.blocked.${guard.defence}`, {
        slug: articleSlug ?? "none",
        turns: String(history.length),
        detail: guard.detail ?? "",
      });
      await flushTelemetry();
      return errorResponse(guard.code, guard.status, guard.headers);
    }
  }

  const client = foundryClient(config);
  const assembler = new AnswerAssembler();
  const started = Date.now();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      const send = (event: InsightsEvent) => controller.enqueue(encoder.encode(encodeEvent(event)));

      // One controller for both deadlines. Whichever fires first aborts the
      // upstream call, which is what turns a hang into a visible error.
      const abort = new AbortController();
      let firstTokenAt: number | null = null;
      let failed: InsightsErrorCode | null = null;

      const firstTokenTimer = setTimeout(() => {
        if (firstTokenAt === null) {
          failed = "TIMEOUT";
          abort.abort();
        }
      }, FIRST_TOKEN_TIMEOUT_MS());
      const totalTimer = setTimeout(() => {
        failed = "TIMEOUT";
        abort.abort();
      }, FIRST_TOKEN_TIMEOUT_MS() + STREAM_TIMEOUT_MS());

      const usage = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 };

      try {
        const upstream = await client.messages.stream(
          buildMessageRequest({
            model: config.deployment,
            request: { question, articleSlug, history },
          }) as never,
          { signal: abort.signal },
        );

        for await (const event of upstream) {
          const kind = (event as { type?: string }).type;

          if (kind === "content_block_delta") {
            const delta = (event as { delta?: { text?: string } }).delta?.text ?? "";
            if (delta.length === 0) continue;
            if (firstTokenAt === null) {
              firstTokenAt = Date.now();
              clearTimeout(firstTokenTimer);
            }
            for (const out of assembler.push(delta)) send(out);
            continue;
          }

          if (kind === "message_start") {
            const u = (event as { message?: { usage?: Record<string, number> } }).message?.usage ?? {};
            usage.input = u.input_tokens ?? 0;
            usage.cacheRead = u.cache_read_input_tokens ?? 0;
            usage.cacheWrite = u.cache_creation_input_tokens ?? 0;
          }
          if (kind === "message_delta") {
            const u = (event as { usage?: Record<string, number> }).usage ?? {};
            usage.output = u.output_tokens ?? usage.output;
          }
        }

        for (const out of assembler.flush()) send(out);
      } catch (err) {
        // A timeout has already aborted the call, so the exception it throws is
        // the consequence rather than the cause and is not worth logging twice.
        const timedOut = failed === "TIMEOUT";
        if (!timedOut) {
          const code: InsightsErrorCode = isUpstreamRateLimit(err) ? "UPSTREAM_BUSY" : "UPSTREAM_ERROR";
          failed = code;
          trackException(err instanceof Error ? err : new Error(String(err)), {
            step: "upstream",
            code,
          });
        }
      } finally {
        clearTimeout(firstTokenTimer);
        clearTimeout(totalTimer);
      }

      const answer = assembler.assembled();

      // An empty reply is a real failure mode here, not a theoretical one: with
      // extended thinking enabled the deployment returned nothing at all on 11 of
      // 40 evaluation cases. The request builder disables thinking, and this is
      // the belt.
      if (!failed && answer.text.length === 0) failed = "EMPTY_ANSWER";

      if (failed) {
        send({ type: "error", code: failed, message: ERROR_COPY[failed] });
        trackEvent("insights.error", {
          code: failed,
          slug: articleSlug ?? "none",
          ms: String(Date.now() - started),
        });
      } else {
        send({
          type: "done",
          provenance: answer.provenance,
          repairs: answer.repairs,
          usage,
        });
        trackEvent("insights.answer", {
          slug: articleSlug ?? "none",
          provenance: answer.provenance,
          citedSlugs: answer.citedSlugs.join(","),
          citationCount: String(answer.citedSlugs.length),
          askedBack: String(Boolean(answer.askedQuestion)),
          turns: String(history.length),
          chars: String(answer.text.length),
          // Token counts per request, which is how the cost log is built.
          inputTokens: String(usage.input),
          outputTokens: String(usage.output),
          cacheReadTokens: String(usage.cacheRead),
          cacheWriteTokens: String(usage.cacheWrite),
          // A cache write on a turn that should have read is the expensive
          // failure, so it is queryable rather than buried in a number.
          cacheMiss: String(usage.cacheWrite > 0),
          repairs: `${answer.repairs.citationsCorrected}/${answer.repairs.quotationsDemoted}/${answer.repairs.dashesNormalized}`,
          firstTokenMs: String(firstTokenAt ? firstTokenAt - started : -1),
          totalMs: String(Date.now() - started),
          session: sessionId,
        });
      }

      // The ceiling counts money rather than requests, and the money is only
      // known once the API has reported its tokens. Awaited, because the function
      // can be frozen the moment this stream closes, and an unrecorded cost is a
      // ceiling that never arrives.
      if (countersAvailable() && (usage.output > 0 || usage.cacheWrite > 0 || usage.cacheRead > 0)) {
        try {
          await recordSpend(usage);
        } catch (err) {
          trackException(err instanceof Error ? err : new Error(String(err)), { step: "spend" });
        }
      }

      // What the reader asked, and whether the articles could answer it. The
      // provenance is the column that matters: a question answered from general
      // knowledge is a subject the library does not cover, which makes this log
      // the brief for the next article. See notes/conversation-schema.md.
      //
      // Awaited for the same reason as the flush, and it never throws, because a
      // capture failure must not cost the reader their answer.
      await recordTurn({
        question,
        articleSlug,
        provenance: answer.provenance,
        citedSlugs: answer.citedSlugs,
        continued: history.length > 0,
        askedBack: Boolean(answer.askedQuestion),
        sessionId,
        answerChars: answer.text.length,
        errorCode: failed,
      });

      // Telemetry is batched and the function can be frozen the moment this
      // resolves, so the flush is awaited before the stream closes.
      await flushTelemetry();
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      // Asks intermediaries not to buffer. Whether Azure Static Web Apps honours
      // it is what the probe below is for.
      "X-Accel-Buffering": "no",
    },
  });
}

/**
 * Probes that call no model and cost nothing.
 *
 * `probe=stream` emits six chunks half a second apart. It settled the question
 * task 020 was told to answer before anything was built on top of it, and the
 * answer was no: **Azure Static Web Apps buffers the response.** Against the
 * deployed site all six chunks arrive together, about two seconds after the last
 * was written, and the response carries `Content-Length` rather than
 * `Transfer-Encoding: chunked`, which means the platform collected the whole body
 * before sending any of it. `X-Accel-Buffering: no` is passed through and ignored.
 *
 * The same build served by `next start` locally streams correctly and reports
 * chunked encoding, so this is the platform rather than Next.
 *
 * `probe=slow` streams for a minute, to find where the platform gives up. That
 * matters more now rather than less: if a reader waits for the whole answer, the
 * platform's own limit is the real deadline and not the ones configured above.
 *
 *   curl -N https://spaarke.com/api/article-insights?probe=stream
 *   curl -N https://spaarke.com/api/article-insights?probe=slow
 */
export async function GET(request: NextRequest) {
  const probe = request.nextUrl.searchParams.get("probe");
  if (probe !== "stream" && probe !== "slow") {
    return NextResponse.json(
      { error: "Method not allowed" },
      { status: 405, headers: { Allow: "POST" } },
    );
  }

  const chunks = probe === "slow" ? 12 : 6;
  const gapMs = probe === "slow" ? 5_000 : 500;

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const started = Date.now();
      for (let i = 1; i <= chunks; i += 1) {
        controller.enqueue(
          encoder.encode(
            `${JSON.stringify({ chunk: i, elapsedMs: Date.now() - started, at: new Date().toISOString() })}\n`,
          ),
        );
        await new Promise((resolve) => setTimeout(resolve, gapMs));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}

export function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405, headers: { Allow: "POST" } });
}

export function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405, headers: { Allow: "POST" } });
}
