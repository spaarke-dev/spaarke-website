import type { InsightsEvent, InsightsErrorCode } from "./stream";
import type { InsightsTurn } from "./types";

/**
 * Asking a question, and seeing the answer arrive on a platform that buffers.
 *
 * This runs in the browser, so it imports types and nothing else. `stream.ts` and
 * `citations.ts` reach the corpus manifest, which is half a megabyte and has no
 * business in a page bundle. Every import here is `import type` and erased at
 * compile time. Keep it that way.
 *
 * Two paths deliver the same answer:
 *
 * - **The POST.** Authoritative and complete, and on Azure Static Web Apps it
 *   arrives in one piece when the model has finished, about eleven seconds in.
 * - **The poller.** The same events, read out of storage a sentence at a time
 *   while the POST is still open. It is what the reader actually watches.
 *
 * The POST is not a backup for the poller; it is the other way round. If polling
 * is blocked, slow, or unavailable, the reader loses progressive rendering and
 * still gets the whole answer. That ordering is the reason this design was chosen
 * over moving the endpoint to a platform that streams.
 *
 * **Deduplication is by position, not by content.** Both paths emit the same
 * events in the same order, because the route writes to both from one call, so a
 * count of what has already been delivered is exact. Comparing text would fail on
 * two identical sentences, which an answer citing the same article twice produces
 * more often than it sounds.
 */

/** How often to poll. A sentence takes about a third of a second to produce. */
const POLL_INTERVAL_MS = 400;
/** Nothing can have been written before this, so the first poll waits. */
const POLL_FIRST_DELAY_MS = 700;

export type AskOutcome =
  /** The answer completed and the `done` event was delivered. */
  | { status: "answered" }
  /**
   * Prose reached the reader but the POST never landed, which is what a proxy
   * killing a long-lived connection looks like. The answer on screen is real and
   * may be missing its last sentence.
   */
  | { status: "answered-without-close" }
  | { status: "error"; code: InsightsErrorCode; message: string };

/**
 * A request id for polling.
 *
 * Generated here, before the POST, because the POST does not resolve until the
 * answer is finished and an id learned from its response is an id with nothing
 * left to poll for. Sixteen random bytes, because this and the session id are
 * what stand between one reader's answer and another's.
 */
export function newRequestId(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export type AskInput = {
  question: string;
  articleSlug: string | null;
  history: InsightsTurn[];
  sessionId: string;
  captchaToken?: string;
  /** Called once per event, in order, exactly once, from whichever path got there first. */
  onEvent: (event: InsightsEvent) => void;
  signal?: AbortSignal;
};

export async function askInsights(input: AskInput): Promise<AskOutcome> {
  const requestId = newRequestId();

  let delivered = 0;
  let sawTerminal = false;

  const deliver = (event: InsightsEvent, position: number) => {
    if (position <= delivered) return;
    delivered = position;
    if (event.type === "done" || event.type === "error") sawTerminal = true;
    input.onEvent(event);
  };

  const post = fetch("/api/article-insights", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question: input.question,
      articleSlug: input.articleSlug,
      history: input.history,
      sessionId: input.sessionId,
      captchaToken: input.captchaToken ?? "",
      requestId,
    }),
    signal: input.signal,
  });

  // Started before the POST is awaited, which is the whole point.
  const polling = poll({
    requestId,
    session: input.sessionId,
    signal: input.signal,
    deliver,
    stopped: () => sawTerminal,
  });

  let response: Response;
  try {
    response = await post;
  } catch (err) {
    await polling.stop();
    if (input.signal?.aborted) return { status: "error", code: "INTERNAL_ERROR", message: "Cancelled." };
    // The connection went away. Whatever the poller delivered is real prose the
    // reader is looking at, so this is not reported as a failure.
    if (delivered > 0) return { status: "answered-without-close" };
    return {
      status: "error",
      code: "UPSTREAM_ERROR",
      message: err instanceof Error ? err.message : "The assistant could not be reached.",
    };
  }

  // A refusal is JSON rather than NDJSON: the guards answer before the stream
  // starts, so there is no partial answer to reconcile with.
  if (!response.ok) {
    await polling.stop();
    const body = (await response.json().catch(() => ({}))) as {
      error?: InsightsErrorCode;
      message?: string;
    };
    return {
      status: "error",
      code: body.error ?? "INTERNAL_ERROR",
      message: body.message ?? "Something failed on our side. Nothing was lost.",
    };
  }

  // The authoritative pass. Locally this streams; on Static Web Apps it arrives
  // complete. Same code either way, and events already delivered by the poller are
  // skipped by position.
  let position = 0;
  let failure: { code: InsightsErrorCode; message: string } | null = null;
  try {
    for await (const event of readNdjson(response)) {
      position += 1;
      if (event.type === "error") failure = { code: event.code, message: event.message };
      deliver(event, position);
    }
  } catch {
    await polling.stop();
    if (delivered > 0) return { status: "answered-without-close" };
    return {
      status: "error",
      code: "UPSTREAM_ERROR",
      message: "The answer was interrupted. Asking again usually works.",
    };
  }

  await polling.stop();

  if (failure) return { status: "error", ...failure };
  if (position === 0) {
    return { status: "error", code: "EMPTY_ANSWER", message: "That came back empty. Asking again usually works." };
  }
  return { status: "answered" };
}

// ---------------------------------------------------------------------------

type PollHandle = { stop: () => Promise<void> };

function poll(opts: {
  requestId: string;
  session: string;
  signal?: AbortSignal;
  deliver: (event: InsightsEvent, position: number) => void;
  stopped: () => boolean;
}): PollHandle {
  let cancelled = false;
  let timer: ReturnType<typeof setTimeout> | null = null;
  /**
   * Resolves the sleep the loop is sitting in.
   *
   * Cancelling used to clear the timer and nothing else, which left the promise
   * the loop was awaiting permanently unresolved, so `stop()` never returned and
   * `askInsights` never reported its outcome. Waking the sleeper is the point;
   * clearing the timer is only tidiness.
   */
  let wake: (() => void) | null = null;

  const sleep = (ms: number) =>
    new Promise<void>((resolve) => {
      if (cancelled) return resolve();
      wake = resolve;
      timer = setTimeout(() => {
        wake = null;
        resolve();
      }, ms);
    });

  const loop = (async () => {
    await sleep(POLL_FIRST_DELAY_MS);
    let cursor = 0;

    while (!cancelled && !opts.stopped() && !opts.signal?.aborted) {
      let body: {
        events?: InsightsEvent[];
        cursor?: number;
        complete?: boolean;
        available?: boolean;
      };
      try {
        const res = await fetch(
          `/api/article-insights/partial?id=${encodeURIComponent(opts.requestId)}` +
            `&session=${encodeURIComponent(opts.session)}&after=${cursor}`,
          { signal: opts.signal, cache: "no-store" },
        );
        // A refused or rate limited poll stops polling rather than retrying into
        // the limit. The POST is still coming.
        if (!res.ok) return;
        body = (await res.json()) as typeof body;
      } catch {
        // One failed poll is not worth a retry policy. The POST is the guarantee.
        return;
      }

      // The deployment writes no partials, so there is nothing to poll for and
      // twenty-eight more requests would prove it twenty-eight more times.
      if (body.available === false) return;

      const events = body.events ?? [];
      const next = body.cursor ?? cursor;
      // The cursor is the sequence number of the last row read, and rows are
      // written in emission order, so position is derivable rather than guessed.
      const first = next - events.length;
      for (let i = 0; i < events.length; i += 1) opts.deliver(events[i], first + i + 1);
      cursor = next;

      if (body.complete) return;
      await sleep(POLL_INTERVAL_MS);
    }
  })();

  return {
    stop: async () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      wake?.();
      wake = null;
      await loop.catch(() => {});
    },
  };
}

/** Newline delimited JSON, tolerating a body that arrives in one piece. */
async function* readNdjson(response: Response): AsyncGenerator<InsightsEvent> {
  const reader = response.body?.getReader();
  if (!reader) return;
  const decoder = new TextDecoder();
  let buffer = "";

  for (;;) {
    const { done, value } = await reader.read();
    if (value) buffer += decoder.decode(value, { stream: true });
    let cut = buffer.indexOf("\n");
    while (cut !== -1) {
      const line = buffer.slice(0, cut).trim();
      buffer = buffer.slice(cut + 1);
      if (line.length > 0) yield JSON.parse(line) as InsightsEvent;
      cut = buffer.indexOf("\n");
    }
    if (done) break;
  }
  const last = buffer.trim();
  if (last.length > 0) yield JSON.parse(last) as InsightsEvent;
}
