import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIpHash } from "@/lib/ip-hash";
import { checkRateLimit } from "@/lib/rate-limit";
import { saveTourFeedback } from "@/lib/storage";
import { sendTourFeedbackNotification } from "@/lib/email";
import { trackEvent, trackException } from "@/lib/logger";

const MAX_TOUR_SLUG = 80;
const MAX_SECTION_ID = 80;
const MAX_STEP_ID = 120;
const MAX_COMMENT = 2000;

const VALID_SENTIMENTS = new Set(["up", "down"]);

type RawBody = {
  tourSlug?: unknown;
  sectionId?: unknown;
  stepId?: unknown;
  sentiment?: unknown;
  comment?: unknown;
};

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as RawBody;

    const tourSlug = asString(body.tourSlug);
    const sectionId = asString(body.sectionId);
    const stepId = asString(body.stepId);
    const commentRaw = asString(body.comment);
    const sentimentRaw =
      typeof body.sentiment === "string" ? body.sentiment.trim() : null;

    // Rate limit by hashed IP — tour feedback can fire 3x per step
    // (up/down/comment) so we lean on a generous burst. checkRateLimit
    // is a single 60s window helper; with RATE_LIMIT_PER_MINUTE
    // defaulted to 5, multiply effective allowance by raising bucket.
    const ipHash = await getIpHash();
    const rateResult = checkRateLimit(ipHash);
    if (!rateResult.allowed) {
      trackEvent("tour.feedback_rate_limited", { ipHash });
      return NextResponse.json(
        { ok: false, error: "RATE_LIMITED" },
        {
          status: 429,
          headers: { "Retry-After": String(rateResult.retryAfter) },
        },
      );
    }

    // Validate inputs
    if (!tourSlug || tourSlug.length > MAX_TOUR_SLUG) {
      return NextResponse.json(
        {
          ok: false,
          error: "VALIDATION_ERROR",
          message: "tourSlug is required.",
        },
        { status: 400 },
      );
    }
    if (!sectionId || sectionId.length > MAX_SECTION_ID) {
      return NextResponse.json(
        {
          ok: false,
          error: "VALIDATION_ERROR",
          message: "sectionId is required.",
        },
        { status: 400 },
      );
    }
    if (!stepId || stepId.length > MAX_STEP_ID) {
      return NextResponse.json(
        {
          ok: false,
          error: "VALIDATION_ERROR",
          message: "stepId is required.",
        },
        { status: 400 },
      );
    }

    let sentiment: "up" | "down" | null = null;
    if (sentimentRaw && sentimentRaw !== "null") {
      if (!VALID_SENTIMENTS.has(sentimentRaw)) {
        return NextResponse.json(
          {
            ok: false,
            error: "VALIDATION_ERROR",
            message: "sentiment must be 'up', 'down', or null.",
          },
          { status: 400 },
        );
      }
      sentiment = sentimentRaw as "up" | "down";
    }

    const comment = commentRaw.slice(0, MAX_COMMENT);
    if (commentRaw.length > MAX_COMMENT) {
      return NextResponse.json(
        {
          ok: false,
          error: "VALIDATION_ERROR",
          message: `comment exceeds ${MAX_COMMENT} characters.`,
        },
        { status: 400 },
      );
    }

    // Require at least one signal — pure empty submissions get rejected.
    if (!sentiment && !comment) {
      return NextResponse.json(
        {
          ok: false,
          error: "VALIDATION_ERROR",
          message: "Provide a sentiment or a comment.",
        },
        { status: 400 },
      );
    }

    const sessionToken = request.cookies.get("tour_session")?.value;
    const userAgent = request.headers.get("user-agent") ?? undefined;
    const submittedAt = new Date().toISOString();

    await saveTourFeedback({
      tourSlug,
      sectionId,
      stepId,
      sentiment,
      comment: comment || undefined,
      sessionToken,
      ipHash,
      userAgent,
      submittedAt,
    });

    // Email only when the user took the time to type a comment — a bare
    // up/down vote isn't worth interrupting the inbox for.
    if (comment) {
      await sendTourFeedbackNotification({
        tourSlug,
        sectionId,
        stepId,
        sentiment,
        comment,
        sessionToken,
      }).catch((err) => {
        console.error("[tour-feedback] Email notification failed:", err);
        trackException(
          err instanceof Error ? err : new Error(String(err)),
          { step: "email" },
        );
      });
    }

    trackEvent("tour.feedback_submitted", {
      tourSlug,
      sectionId,
      stepId,
      sentiment: sentiment ?? "none",
      hasComment: comment ? "true" : "false",
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[tour-feedback] Unexpected error:", err);
    trackException(
      err instanceof Error ? err : new Error(String(err)),
      { step: "tour-feedback" },
    );
    return NextResponse.json(
      { ok: false, error: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
