/**
 * Follow-up step words (phase 2 FR-09), with no server imports so the admin
 * pages' client components can use them.
 */

export const STEP_ANCHORS = ["first-email", "first-meeting"] as const;
export type StepAnchor = (typeof STEP_ANCHORS)[number];

export const STEP_AUDIENCES = ["no-reply", "engaged-no-meeting", "met", "everyone"] as const;
export type StepAudience = (typeof STEP_AUDIENCES)[number];

export const STEP_DAYS_MAX = 365;

export const ANCHOR_TEXT: Record<StepAnchor, string> = { "first-email": "first email", "first-meeting": "first meeting" };
export const AUDIENCE_TEXT: Record<StepAudience, string> = {
  "no-reply": "no reply",
  "engaged-no-meeting": "engaged, no meeting",
  met: "met",
  everyone: "everyone",
};

/** "7 days after first email, no reply, group Tier A". */
export function describeStep(s: { days: number; anchor: StepAnchor; audience: StepAudience; group?: string }): string {
  const days = s.days === 1 ? "1 day" : `${s.days} days`;
  return [`${days} after ${ANCHOR_TEXT[s.anchor]}`, AUDIENCE_TEXT[s.audience], s.group ? `group ${s.group}` : null]
    .filter(Boolean)
    .join(", ");
}
