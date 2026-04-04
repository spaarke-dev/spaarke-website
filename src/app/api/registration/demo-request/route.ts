import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIpHash } from "@/lib/ip-hash";
import { checkRateLimit } from "@/lib/rate-limit";
import { trackEvent, trackException } from "@/lib/logger";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const VALID_USE_CASES = [
  "Document Management",
  "AI Analysis",
  "Financial Intelligence",
  "General Evaluation",
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

    // Build payload for BFF API
    const payload = {
      firstName: (body.firstName ?? "").trim(),
      lastName: (body.lastName ?? "").trim(),
      workEmail: (body.workEmail ?? "").trim(),
      organization: (body.organization ?? "").trim(),
      jobTitle: (body.jobTitle ?? "").trim() || undefined,
      phone: (body.phone ?? "").trim() || undefined,
      useCase: (body.useCase ?? "").trim(),
      referralSource: sanitizedReferral,
      notes: (body.notes ?? "").trim() || undefined,
      consent: body.consent,
    };

    // Proxy to BFF API
    const bffApiUrl = process.env.BFF_API_URL;
    if (!bffApiUrl) {
      console.warn(
        "[demo-request] BFF_API_URL not set - cannot forward request.",
      );
      return NextResponse.json(
        { ok: false, error: "SERVICE_UNAVAILABLE" },
        { status: 503 },
      );
    }

    const bffUrl = `${bffApiUrl.replace(/\/+$/, "")}/api/registration/demo-request`;
    const bffRes = await fetch(bffUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const bffData = await bffRes.json();

    if (!bffRes.ok) {
      console.error(
        "[demo-request] BFF API error:",
        bffRes.status,
        bffData,
      );
      trackEvent("demo_request.bff_error", {
        status: String(bffRes.status),
      });
      return NextResponse.json(
        {
          ok: false,
          error: bffData.error ?? "UPSTREAM_ERROR",
          message: bffData.message ?? "The request could not be processed.",
        },
        { status: bffRes.status >= 500 ? 502 : bffRes.status },
      );
    }

    trackEvent("demo_request.success", {
      email: (body.workEmail ?? "").replace(/@.*/, "@***"),
      useCase: payload.useCase,
    });

    return NextResponse.json({
      ok: true,
      trackingId: bffData.trackingId ?? bffData.id ?? undefined,
    });
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
