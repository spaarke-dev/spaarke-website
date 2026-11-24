/**
 * Shapes for the market access store (projects/market-access/spec.md).
 *
 * Table Storage holds flat rows, so lists (tags, edited fields) are stored as
 * JSON strings and converted at the edge of the store. These are the shapes
 * the rest of the code works with.
 */

export const VISIBILITIES = ["general", "investor"] as const;
export type Visibility = (typeof VISIBILITIES)[number];

export const CONTACT_KINDS = [
  "prospect",
  "design_partner",
  "customer",
  "investor",
  "partner",
  "press",
  "other",
] as const;
export type ContactKind = (typeof CONTACT_KINDS)[number];

export const CONTACT_STAGES = [
  "new",
  "engaged",
  "conversation",
  "opportunity",
  "active",
  "closed",
] as const;
export type ContactStage = (typeof CONTACT_STAGES)[number];

export const ACTIVITY_TYPES = [
  "form.contact",
  "form.demo",
  "form.design_partner",
  "form.early_release",
  "form.investor_overview",
  "meeting.booked",
  "meeting.rescheduled",
  "meeting.cancelled",
  "meeting.in_person",
  "brief.read",
  "ask_ai.click",
  "email.sent",
  "email.received",
  "email.bounced",
  "linkedin.lead",
  "linkedin.message",
  "call",
  "note",
  "followup.done",
] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export function isActivityType(value: unknown): value is ActivityType {
  return typeof value === "string" && (ACTIVITY_TYPES as readonly string[]).includes(value);
}

export type Utm = {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
};

/** Optional details a writer or import knows about the person. */
export type ContactHints = {
  name?: string;
  title?: string;
  organizationName?: string;
  linkedinUrl?: string;
  phone?: string;
  kind?: ContactKind;
};

/** Contact fields that hints can fill when empty. */
export const HINT_FIELDS = ["name", "title", "linkedinUrl", "phone"] as const;

export type Contact = {
  /** SHA-256 of the primary normalized email. Never changes, even on merge. */
  id: string;
  email: string;
  name?: string;
  title?: string;
  organizationId?: string;
  linkedinUrl?: string;
  phone?: string;
  kind: ContactKind;
  stage: ContactStage;
  tags: string[];
  owner?: string;
  visibility: Visibility;
  /** The type of the first activity that created the contact. */
  source?: string;
  createdAt: string;
  updatedAt: string;
  lastActivityAt?: string;
  /** Fields a person changed by hand, which writers and imports never overwrite. */
  editedFields: string[];
};

export type Organization = {
  /** The email domain it was created from, or a chosen ID for a manual one. */
  id: string;
  name: string;
  domain?: string;
  website?: string;
  kind?: string;
  notes?: string;
  visibility: Visibility;
  createdAt: string;
  updatedAt: string;
};

export type Activity = {
  /** Row key: inverted time plus a slice of the idempotency hash. */
  id: string;
  contactId: string;
  type: ActivityType;
  source: string;
  sourceId: string;
  occurredAt: string;
  recordedAt: string;
  visibility: Visibility;
  campaignSlug?: string;
  memberId?: string;
  utm?: Utm;
  summary?: string;
  subject?: string;
  webLink?: string;
  mailbox?: string;
  /**
   * An Ask AI click whose recipient code matched no member while its brief key
   * did: a mail gateway rewrote the link. A link scanner, never a person (task 051).
   */
  codeRewritten?: boolean;
};
