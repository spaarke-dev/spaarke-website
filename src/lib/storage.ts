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
