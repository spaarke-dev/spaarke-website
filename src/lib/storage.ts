import { TableClient } from "@azure/data-tables";
import { randomBytes } from "crypto";
import type { ContactFormData } from "@/lib/contact";
import type { Attribution } from "@/lib/attribution";

const TABLE_NAME = "ContactSubmissions";
const TOUR_FEEDBACK_TABLE = "TourFeedback";

let tableClient: TableClient | null = null;
let tourFeedbackClient: TableClient | null = null;
let tourFeedbackTableEnsured = false;

function getTableClient(): TableClient | null {
  if (tableClient) return tableClient;

  const connectionString = process.env.STORAGE_ACCOUNT_CONNECTION;
  if (!connectionString) {
    console.warn(
      "[storage] STORAGE_ACCOUNT_CONNECTION not set - skipping Table Storage persistence.",
    );
    return null;
  }

  tableClient = TableClient.fromConnectionString(connectionString, TABLE_NAME);
  return tableClient;
}

function getTourFeedbackClient(): TableClient | null {
  if (tourFeedbackClient) return tourFeedbackClient;

  const connectionString = process.env.STORAGE_ACCOUNT_CONNECTION;
  if (!connectionString) {
    console.warn(
      "[storage] STORAGE_ACCOUNT_CONNECTION not set - skipping TourFeedback persistence.",
    );
    return null;
  }

  tourFeedbackClient = TableClient.fromConnectionString(
    connectionString,
    TOUR_FEEDBACK_TABLE,
  );
  return tourFeedbackClient;
}

export type TourFeedbackPayload = {
  tourSlug: string;
  sectionId: string;
  stepId: string;
  sentiment: "up" | "down" | null;
  comment?: string;
  sessionToken?: string;
  ipHash: string;
  userAgent?: string;
  submittedAt: string;
};

export async function saveTourFeedback(
  data: TourFeedbackPayload,
): Promise<void> {
  const client = getTourFeedbackClient();
  if (!client) return;

  // Best-effort table creation — only attempted once per process.
  if (!tourFeedbackTableEnsured) {
    try {
      await client.createTable();
    } catch (err) {
      // The SDK throws on already-existing tables; that's fine.
      const code = (err as { statusCode?: number }).statusCode;
      if (code && code !== 409) {
        console.warn("[storage] createTable(TourFeedback) failed:", err);
      }
    }
    tourFeedbackTableEnsured = true;
  }

  // RowKey is sortable by submission time and identifies the step so a
  // single (tourSlug, stepId) pair can have many rows over time.
  const rowKey = `${data.submittedAt}__${data.stepId}`;

  try {
    await client.createEntity({
      partitionKey: data.tourSlug,
      rowKey,
      sectionId: data.sectionId,
      stepId: data.stepId,
      sentiment: data.sentiment ?? "",
      comment: data.comment ?? "",
      sessionToken: data.sessionToken ?? "",
      ipHash: data.ipHash,
      userAgent: data.userAgent ?? "",
      submittedAt: data.submittedAt,
    });
  } catch (err) {
    console.error("[storage] Failed to save tour feedback:", err);
    throw err;
  }
}

export async function saveContactSubmission(
  data: ContactFormData,
  ipHash: string,
  attribution?: Attribution | null,
): Promise<void> {
  const client = getTableClient();
  if (!client) return;

  const now = new Date();
  const random = randomBytes(4).toString("hex");
  const rowKey = `${now.getTime()}-${random}`;

  try {
    await client.createEntity({
      partitionKey: "contact",
      rowKey,
      name: data.name,
      email: data.email,
      company: data.company ?? "",
      reason: data.reason ?? "",
      message: data.message,
      ipHash,
      createdAt: now.toISOString(),
      entry_referrer: attribution?.entry_referrer ?? "",
      entry_landing: attribution?.entry_landing ?? "",
      first_visit_at: attribution?.first_visit_at ?? "",
      ai_source: attribution?.ai_source ?? "",
      utm_source: attribution?.utm_source ?? "",
      utm_medium: attribution?.utm_medium ?? "",
      utm_campaign: attribution?.utm_campaign ?? "",
    });
  } catch (err) {
    console.error("[storage] Failed to save contact submission:", err);
    // Re-throw so the caller is aware, but the API route can decide how to handle it
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Demo access requests
// ---------------------------------------------------------------------------

/**
 * Evaluation access requests, written here before they are forwarded.
 *
 * The platform BFF is the system of record: it creates the Dataverse record,
 * de-duplicates, and drives the approve-and-provision pipeline. This table is
 * not a second system of record and must not become one. It is a receipt.
 *
 * It exists because on 2026-09-28 `BFF_API_URL` pointed at an App Service that
 * had been deleted, so every submission threw, returned a 500, and the
 * visitor's details reached nothing at all. A person who filled in seven fields
 * and pressed the button was told to come back later, and their name was gone.
 * A backend outage should cost a reconciliation step, not a customer.
 *
 * Written before the forward is attempted, never after, because a row written
 * after a network call that did not return is a row that does not exist.
 */
const DEMO_REQUEST_TABLE = "DemoRequests";

let demoRequestClient: TableClient | null = null;
let demoRequestTableEnsured = false;

function getDemoRequestClient(): TableClient | null {
  if (demoRequestClient) return demoRequestClient;

  const connectionString = process.env.STORAGE_ACCOUNT_CONNECTION;
  if (!connectionString) {
    console.warn(
      "[storage] STORAGE_ACCOUNT_CONNECTION not set - demo requests will not be captured locally.",
    );
    return null;
  }

  demoRequestClient = TableClient.fromConnectionString(
    connectionString,
    DEMO_REQUEST_TABLE,
  );
  return demoRequestClient;
}

export type DemoRequestLead = {
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  jobTitle?: string;
  phone?: string;
  useCase: string;
  referralSource?: string;
  notes?: string;
  consentAccepted?: boolean;
};

/** What happened to a lead after it was written. */
export type DemoRequestStatus =
  /** Written, not yet forwarded. A row left in this state needs a look. */
  | "pending"
  /** The BFF accepted it. The Dataverse record is the system of record now. */
  | "forwarded"
  /** The BFF refused it on its own terms, for example a duplicate email. */
  | "rejected"
  /** The BFF could not be reached or failed. **This is the reconciliation queue.** */
  | "orphaned";

/**
 * Writes the lead and returns its row key, or null when storage is unavailable.
 *
 * Never throws. The caller uses the return value to decide whether the lead is
 * safe, and a thrown error here would lose the very submission this exists to
 * keep.
 */
export async function saveDemoRequestLead(
  lead: DemoRequestLead,
  ipHash: string,
  attribution?: Attribution | null,
): Promise<string | null> {
  const client = getDemoRequestClient();
  if (!client) return null;

  if (!demoRequestTableEnsured) {
    try {
      await client.createTable();
    } catch (err) {
      const code = (err as { statusCode?: number }).statusCode;
      if (code && code !== 409) {
        console.warn("[storage] createTable(DemoRequests) failed:", err);
      }
    }
    demoRequestTableEnsured = true;
  }

  const now = new Date();
  const rowKey = `${now.getTime()}-${randomBytes(4).toString("hex")}`;

  try {
    await client.createEntity({
      partitionKey: "demo-request",
      rowKey,
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      organization: lead.organization,
      jobTitle: lead.jobTitle ?? "",
      phone: lead.phone ?? "",
      useCase: lead.useCase,
      referralSource: lead.referralSource ?? "",
      notes: lead.notes ?? "",
      consentAccepted: lead.consentAccepted === true,
      ipHash,
      createdAt: now.toISOString(),
      status: "pending" satisfies DemoRequestStatus,
      trackingId: "",
      detail: "",
      entry_referrer: attribution?.entry_referrer ?? "",
      entry_landing: attribution?.entry_landing ?? "",
      first_visit_at: attribution?.first_visit_at ?? "",
      ai_source: attribution?.ai_source ?? "",
      utm_source: attribution?.utm_source ?? "",
      utm_medium: attribution?.utm_medium ?? "",
      utm_campaign: attribution?.utm_campaign ?? "",
    });
    return rowKey;
  } catch (err) {
    console.error("[storage] Failed to capture demo request lead:", err);
    return null;
  }
}

/**
 * Records what became of a lead. Never throws: a row stuck at "pending" is
 * still a lead somebody can act on, which is the whole point, so a failure to
 * annotate it must not fail the request.
 */
export async function markDemoRequestOutcome(
  rowKey: string,
  status: DemoRequestStatus,
  extra: { trackingId?: string; detail?: string } = {},
): Promise<void> {
  const client = getDemoRequestClient();
  if (!client) return;

  try {
    await client.updateEntity(
      {
        partitionKey: "demo-request",
        rowKey,
        status,
        trackingId: extra.trackingId ?? "",
        // Truncated: this is a breadcrumb for a human, not a log sink.
        detail: (extra.detail ?? "").slice(0, 512),
      },
      "Merge",
    );
  } catch (err) {
    // Concise on purpose. The Azure SDK's error object serialises the whole
    // request, headers included, and this path runs after the visitor's fate is
    // already decided, so it is a breadcrumb rather than an incident.
    const code = (err as { statusCode?: number }).statusCode;
    const message = err instanceof Error ? err.message.split("\n")[0] : String(err);
    console.warn(
      `[storage] Could not mark demo request ${rowKey} as ${status}: ${code ?? "?"} ${message}`,
    );
  }
}
