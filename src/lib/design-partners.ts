/**
 * The Design Partner Program application: its fields and the one set of
 * rules the form and the API route both enforce.
 *
 * Kept in one module for the reason `contact.ts` gives: when the form and the
 * validator held separate lists they drifted, and visitors were rejected for
 * choices the form had offered them.
 */

export const ORGANIZATION_TYPES = ["Law department", "Law firm", "Other"] as const;
export type OrganizationType = (typeof ORGANIZATION_TYPES)[number];

export const STARTING_DECISION_MAX = 500;

export interface DesignPartnerApplication {
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  role: string;
  organizationType: OrganizationType;
  startingDecision?: string;
  consent: boolean;
}

export type DesignPartnerFieldErrors = Partial<
  Record<keyof DesignPartnerApplication, string>
>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Trims every text field and coerces the rest, so client and server validate the same values. */
export function normalizeApplication(
  raw: Partial<Record<keyof DesignPartnerApplication, unknown>>,
): DesignPartnerApplication {
  const text = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  return {
    firstName: text(raw.firstName),
    lastName: text(raw.lastName),
    email: text(raw.email),
    organization: text(raw.organization),
    role: text(raw.role),
    organizationType: text(raw.organizationType) as OrganizationType,
    startingDecision: text(raw.startingDecision) || undefined,
    consent: raw.consent === true,
  };
}

export function validateApplication(
  data: DesignPartnerApplication,
): DesignPartnerFieldErrors | null {
  const errors: DesignPartnerFieldErrors = {};

  if (!data.firstName || data.firstName.length > 100) {
    errors.firstName = "First name is required (1-100 characters).";
  }
  if (!data.lastName || data.lastName.length > 100) {
    errors.lastName = "Last name is required (1-100 characters).";
  }
  if (
    !data.email ||
    data.email.length < 3 ||
    data.email.length > 254 ||
    !EMAIL_RE.test(data.email)
  ) {
    errors.email = "A valid work email address is required.";
  }
  if (!data.organization || data.organization.length > 200) {
    errors.organization = "Organization is required (1-200 characters).";
  }
  if (!data.role || data.role.length > 100) {
    errors.role = "Role or title is required (1-100 characters).";
  }
  if (!ORGANIZATION_TYPES.includes(data.organizationType)) {
    errors.organizationType = "Please select an organization type.";
  }
  if ((data.startingDecision ?? "").length > STARTING_DECISION_MAX) {
    errors.startingDecision = `Please keep this to ${STARTING_DECISION_MAX} characters.`;
  }
  if (!data.consent) {
    errors.consent = "You must agree to the terms of service and privacy policy.";
  }

  return Object.keys(errors).length > 0 ? errors : null;
}
