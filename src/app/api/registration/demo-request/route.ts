import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIpHash } from "@/lib/ip-hash";
import { checkRateLimit } from "@/lib/rate-limit";
import { trackEvent, trackException } from "@/lib/logger";
import type { Attribution } from "@/lib/attribution";
import { saveDemoRequestLead, markDemoRequestOutcome } from "@/lib/storage";
import { sendDemoRequestFallbackNotification } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * The values the platform can actually parse, not the labels the reader picks.
 *
 * These were the labels until 2026-09-28, which meant this guard confirmed we
 * were sending exactly the strings the BFF cannot read. Its `ParseUseCase`
 * lower-cases and matches "documentmanagement", "aianalysis",
 * "financialintelligence" and "general", with no handling for spaces, so an
 * unparseable value became null and `sprk_usecase` was written empty on every
 * registration request ever created. No error, on either side.
 *
 * Keep in step with `UseCaseOption` in the platform's
 * RegistrationDataverseService, and with the option values in
 * src/components/DemoRequestForm.tsx.
 */
const VALID_USE_CASES = [
  "DocumentManagement",
  "AiAnalysis",
  "FinancialIntelligence",
  "General",
];

const VALID_REFERRAL_SOURCES = [
  "Conference",
  "Website",
  "Referral",
  "Search",
  "Other",
];

interface DemoRequestBody {
  firstName?: string;
  lastName?: string;
  workEmail?: string;
  organization?: string;
  jobTitle?: string;
  phone?: string;
  useCase?: string;
  referralSource?: string;
  notes?: string;
  consent?: boolean;
  captchaToken?: string;
  attribution?: Attribution | null;
}

interface FieldErrors {
  firstName?: string;
  lastName?: string;
  workEmail?: string;
  organization?: string;
  useCase?: string;
  consent?: string;
}

async function verifyCaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    console.warn(
      "[demo-request] RECAPTCHA_SECRET_KEY not set - skipping verification.",
    );
    return true;
  }

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
  });
  const data = await res.json();
  return data.success === true;
}

function validateFields(body: DemoRequestBody): FieldErrors | null {
  const errors: FieldErrors = {};

  const firstName = (body.firstName ?? "").trim();
  if (!firstName || firstName.length > 100) {
    errors.firstName = "First name is required (1-100 characters).";
  }

  const lastName = (body.lastName ?? "").trim();
  if (!lastName || lastName.length > 100) {
    errors.lastName = "Last name is required (1-100 characters).";
  }

  const workEmail = (body.workEmail ?? "").trim();
  if (
    !workEmail ||
    workEmail.length < 3 ||
    workEmail.length > 254 ||
    !EMAIL_RE.test(workEmail)
  ) {
    errors.workEmail = "A valid work email address is required.";
  }

  const organization = (body.organization ?? "").trim();
  if (!organization || organization.length > 200) {
    errors.organization = "Organization is required (1-200 characters).";
  }

  const useCase = (body.useCase ?? "").trim();
  if (!useCase || !VALID_USE_CASES.includes(useCase)) {
    errors.useCase = "Please select a valid use case.";
  }

  if (!body.consent) {
    errors.consent =
      "You must agree to the terms of use and data processing agreement.";
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as DemoRequestBody;

    // Rate limiting
    const ipHash = await getIpHash();
    const rateResult = checkRateLimit(ipHash);
    if (!rateResult.allowed) {
      trackEvent("demo_request.rate_limited", { ipHash });
      return NextResponse.json(
        { ok: false, error: "RATE_LIMITED" },
        {
          status: 429,
          headers: { "Retry-After": String(rateResult.retryAfter) },
        },
      );
    }

    // Verify CAPTCHA
    const captchaToken = (body.captchaToken ?? "").trim();
    if (!captchaToken) {
      return NextResponse.json(
        { ok: false, error: "CAPTCHA_FAILED" },
        { status: 400 },
      );
    }
    const captchaValid = await verifyCaptcha(captchaToken);
    if (!captchaValid) {
      trackEvent("demo_request.captcha_failed", { ipHash });
      return NextResponse.json(
        { ok: false, error: "CAPTCHA_FAILED" },
        { status: 400 },
      );
    }

    // Server-side validation
    const fieldErrors = validateFields(body);
    if (fieldErrors) {
      trackEvent("demo_request.validation_failed", {
        fields: Object.keys(fieldErrors).join(","),
      });
      return NextResponse.json(
        { ok: false, error: "VALIDATION_ERROR", fields: fieldErrors },
        { status: 400 },
      );
    }

    // Sanitize optional fields
    const referralSource = (body.referralSource ?? "").trim();
    const sanitizedReferral =
      referralSource && VALID_REFERRAL_SOURCES.includes(referralSource)
        ? referralSource
        : undefined;

    const attribution = body.attribution ?? null;

    // Build payload for BFF API (map website field names to BFF DTO names)
    const payload = {
      firstName: (body.firstName ?? "").trim(),
      lastName: (body.lastName ?? "").trim(),
      email: (body.workEmail ?? "").trim(),
      organization: (body.organization ?? "").trim(),
      jobTitle: (body.jobTitle ?? "").trim() || undefined,
      phone: (body.phone ?? "").trim() || undefined,
      useCase: (body.useCase ?? "").trim(),
      referralSource: sanitizedReferral,
      notes: (body.notes ?? "").trim() || undefined,
      consentAccepted: body.consent,
      recaptchaToken: captchaToken,
      attribution,
    };

    // Capture the lead here BEFORE anything is forwarded.
    //
    // The BFF is the system of record: it writes Dataverse, de-duplicates, and
    // drives approval and provisioning. This row is a receipt, so that a
    // backend outage costs a reconciliation step rather than a customer. On
    // 2026-09-28 BFF_API_URL pointed at a deleted App Service, every submission
    // threw, and the details of everyone who filled in the form went nowhere.
    //
    // Deliberately before the fetch. A row written after a call that never
    // returned is a row that was never written.
    const leadRowKey = await saveDemoRequestLead(
      {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        organization: payload.organization,
        jobTitle: payload.jobTitle,
        phone: payload.phone,
        useCase: payload.useCase,
        referralSource: payload.referralSource,
        notes: payload.notes,
        consentAccepted: body.consent,
      },
      ipHash,
      attribution,
    );

    /**
     * The backend did not take it, and the fault is ours rather than the
     * visitor's. Tell them it worked, because we are holding their request, and
     * raise an alert so a person forwards it. Telling them to try again would
     * ask them to retype seven fields into the same broken path, and would
     * duplicate the lead if the backend recovered in between.
     *
     * If the lead reached neither the BFF nor storage, say so honestly: at that
     * point nothing holds it and a success message would be a lie.
     */
    async function fallback(reason: string) {
      trackEvent("demo_request.fallback_captured", {
        reason,
        stored: leadRowKey ? "true" : "false",
      });
      if (leadRowKey) {
        await markDemoRequestOutcome(leadRowKey, "orphaned", { detail: reason });
      }

      const notice = await sendDemoRequestFallbackNotification({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        organization: payload.organization,
        jobTitle: payload.jobTitle,
        phone: payload.phone,
        useCase: payload.useCase,
        notes: payload.notes,
        reason,
        rowKey: leadRowKey,
      });

      // Nothing holds this request. Do not claim success.
      if (!leadRowKey && !notice.sent) {
        console.error("[demo-request] Lead lost: no BFF, no storage, no mail.", reason);
        return NextResponse.json(
          { ok: false, error: "INTERNAL_ERROR" },
          { status: 500 },
        );
      }

      return NextResponse.json({ ok: true, captured: true });
    }

    // Proxy to BFF API
    const bffApiUrl = process.env.BFF_API_URL;
    if (!bffApiUrl) {
      console.warn(
        "[demo-request] BFF_API_URL not set - cannot forward request.",
      );
      return await fallback("BFF_API_URL is not configured");
    }

    const bffUrl = `${bffApiUrl.replace(/\/+$/, "")}/api/registration/demo-request`;

    let bffRes: Response;
    try {
      bffRes = await fetch(bffUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        // A backend that never answers must not hold the visitor on a spinner
        // until the platform's own timeout decides for us.
        signal: AbortSignal.timeout(15_000),
      });
    } catch (err) {
      // Unreachable: DNS failure, refused, TLS, or timed out. This is the case
      // that lost submissions, because the throw fell through to a bare 500.
      const reason = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
      console.error("[demo-request] BFF unreachable:", reason);
      trackException(err instanceof Error ? err : new Error(reason), {
        step: "demo-request.bff-unreachable",
      });
      return await fallback(`BFF unreachable: ${reason}`);
    }

    // A backend that answers with something other than JSON is a backend that
    // is not working. Parsing must not throw its way into the generic 500.
    let bffData: { error?: string; message?: string; trackingId?: string; id?: string } = {};
    try {
      bffData = await bffRes.json();
    } catch {
      if (bffRes.ok) {
        // Accepted, but we cannot read the tracking id. It is still forwarded.
        if (leadRowKey) await markDemoRequestOutcome(leadRowKey, "forwarded");
        return NextResponse.json({ ok: true });
      }
      return await fallback(`BFF returned ${bffRes.status} with a non-JSON body`);
    }

    if (!bffRes.ok) {
      console.error("[demo-request] BFF API error:", bffRes.status, bffData);
      trackEvent("demo_request.bff_error", { status: String(bffRes.status) });

      // A 5xx is the backend failing, so hold the lead and alert. A 4xx is the
      // backend working and saying no, for instance a duplicate email, and the
      // visitor should hear that rather than be told it worked.
      if (bffRes.status >= 500) {
        return await fallback(`BFF returned ${bffRes.status}`);
      }

      if (leadRowKey) {
        await markDemoRequestOutcome(leadRowKey, "rejected", {
          detail: `${bffRes.status} ${bffData.error ?? ""}`,
        });
      }
      return NextResponse.json(
        {
          ok: false,
          error: bffData.error ?? "UPSTREAM_ERROR",
          message: bffData.message ?? "The request could not be processed.",
        },
        { status: bffRes.status },
      );
    }

    const trackingId = bffData.trackingId ?? bffData.id ?? undefined;
    if (leadRowKey) {
      await markDemoRequestOutcome(leadRowKey, "forwarded", { trackingId });
    }

    trackEvent("demo_request.success", {
      email: (body.workEmail ?? "").replace(/@.*/, "@***"),
      useCase: payload.useCase,
      entry_referrer: attribution?.entry_referrer ?? "",
      ai_source: attribution?.ai_source ?? "",
    });

    return NextResponse.json({ ok: true, trackingId });
  } catch (err) {
    console.error("[demo-request] Unexpected error:", err);
    trackException(
      err instanceof Error ? err : new Error(String(err)),
      { step: "demo-request" },
    );
    return NextResponse.json(
      { ok: false, error: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}

export function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405, headers: { Allow: "POST" } },
  );
}

export function PUT() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405, headers: { Allow: "POST" } },
  );
}

export function DELETE() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405, headers: { Allow: "POST" } },
  );
}
