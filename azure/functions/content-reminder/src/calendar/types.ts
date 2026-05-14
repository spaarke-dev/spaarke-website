// azure/functions/content-reminder/src/calendar/types.ts
//
// Schema of a row in content-platform/calendar.md after parsing.
// The shape mirrors the markdown table headers exactly so the
// parser can do header-name lookups instead of column-index lookups.
//
// See projects/content-orchestration/spec.md §4.3.

export type CalendarStatus =
  | "idea"
  | "brief"
  | "outline"
  | "draft"
  | "review"
  | "scheduled"
  | "published";

export interface CalendarRow {
  slug: string;
  type: string;                       // "blog-post" | "linkedin-post" | "white-paper" | "tweet" | …
  publishDate: string;                // ISO date YYYY-MM-DD. Quarter rows (YYYY-Qn) are filtered out at parse time.
  status: CalendarStatus | string;    // Tolerate unknown statuses; downstream filters drop them.
  author: string;
  campaign: string | null;
  linkedinPersonal: string | null;    // URL extracted from `[YYYY-MM-DD](url)` cell, or null.
  linkedinCompany: string | null;
  notes: string;
}
