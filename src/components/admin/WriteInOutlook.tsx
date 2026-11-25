import { mailtoHref } from "@/lib/market/mailto";

/** Opens a new message to the contact with the follow-up title as the subject (phase 2 FR-11). */
export function WriteInOutlook({ email, title, who }: { email: string; title: string; who?: string }) {
  return (
    <a
      href={mailtoHref(email, title)}
      className="text-xs text-fg underline underline-offset-2 hover:no-underline"
      aria-label={`Write in Outlook: ${title}${who ? `, to ${who}` : ""}`}
    >
      Write in Outlook
    </a>
  );
}
