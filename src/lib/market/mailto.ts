/**
 * "Write in Outlook" (phase 2 FR-11, owner decision 1): a `mailto:` link that
 * opens a new message to the contact with the follow-up's title as the
 * subject. No sending from the admin area. Pure, so client components and the
 * checks can use it.
 */
export function mailtoHref(email: string, subject: string): string {
  // The address keeps its @; everything else is encoded, so a subject with & or # stays whole.
  const to = encodeURIComponent(email.trim()).replace(/%40/g, "@");
  const s = subject.replace(/\s+/g, " ").trim();
  return s ? `mailto:${to}?subject=${encodeURIComponent(s)}` : `mailto:${to}`;
}
