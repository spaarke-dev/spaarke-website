"use client";

import {
  BookOpen16Regular,
  CalendarArrowRight16Regular,
  CalendarCancel16Regular,
  CalendarLtr16Regular,
  Call16Regular,
  Chat16Regular,
  CheckmarkCircle16Regular,
  DocumentText16Regular,
  MailArrowUp16Regular,
  MailInbox16Regular,
  MailWarning16Regular,
  Note16Regular,
  People16Regular,
  PersonAdd16Regular,
  Sparkle16Regular,
} from "@fluentui/react-icons";
import type { FluentIcon } from "@fluentui/react-icons";

// Fluent icons read React context, so they render as client components. The
// admin pages are server components and import icons from here.
export { ArrowLeft20Regular, ArrowRight20Regular, Search20Regular } from "@fluentui/react-icons";

// One tint per group, so the kind of entry reads at a glance.
const TINT = {
  form: "bg-[#fdf3e1] text-[#8a5a00]",
  meeting: "bg-[#e6f4ea] text-[#1e6b34]",
  email: "bg-[#e8eefb] text-[#2f4fa8]",
  bounce: "bg-[#fdecea] text-[#a4262c]",
  engagement: "bg-[#f1eafb] text-[#6b3fa0]",
  linkedin: "bg-[#e5f2fa] text-[#0a5a8a]",
  touch: "bg-[#eef0f2] text-[#44505c]",
  done: "bg-[#e3f4f1] text-[#0f6b5e]",
} as const;

const ICONS: Record<string, [FluentIcon, keyof typeof TINT]> = {
  "meeting.booked": [CalendarLtr16Regular, "meeting"],
  "meeting.rescheduled": [CalendarArrowRight16Regular, "meeting"],
  "meeting.cancelled": [CalendarCancel16Regular, "meeting"],
  "meeting.in_person": [People16Regular, "meeting"],
  "brief.read": [BookOpen16Regular, "engagement"],
  "ask_ai.click": [Sparkle16Regular, "engagement"],
  "email.sent": [MailArrowUp16Regular, "email"],
  "email.received": [MailInbox16Regular, "email"],
  "email.bounced": [MailWarning16Regular, "bounce"],
  "linkedin.lead": [PersonAdd16Regular, "linkedin"],
  "linkedin.message": [Chat16Regular, "linkedin"],
  note: [Note16Regular, "touch"],
  call: [Call16Regular, "touch"],
  "followup.done": [CheckmarkCircle16Regular, "done"],
  "list.import": [PersonAdd16Regular, "touch"],
};

/** A small tinted circle for a timeline entry. Decorative: the entry's label says the same. */
export function ActivityIcon({ type }: { type: string }) {
  const [Icon, tint] = ICONS[type] ?? (type.startsWith("form.") ? [DocumentText16Regular, "form" as const] : [Note16Regular, "touch" as const]);
  return (
    <span aria-hidden="true" className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${TINT[tint]}`}>
      <Icon />
    </span>
  );
}
