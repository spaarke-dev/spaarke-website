import { calendarWindow, listCalendarView, type CalendarEvent } from "@/lib/market/graph-calendar";
import { loadCalendarStates, pruneCalendarStates, type CalendarState } from "@/lib/market/calendar-state";
import type { MailDeps, MailSettings } from "@/lib/market/graph-mail";
import type { Mailbox } from "@/lib/market/mailboxes";

/**
 * The calendar part of a sync run (phase 2 FR-06 and FR-07), for a mailbox
 * with Read calendar on. It runs after the mailbox's mail, inside the same
 * deadline, and its failure never fails the mail: the sync records it apart.
 *
 * Task 030 reads the window and keeps the state table tidy; task 031 turns
 * events with a known contact into entries.
 */

export type CalendarSummary = {
  ok: boolean;
  error?: string;
  /** Events read in the window. */
  events: number;
  /** State rows for events that ended more than 30 days ago, removed this run. */
  pruned: number;
  /** False when the deadline stopped it; the next run reads the whole window again. */
  complete: boolean;
};

export type CalendarOptions = MailDeps & {
  settings: MailSettings;
  deadline: number;
  now?: Date;
  /** Events per run (default 1,000). */
  maxEvents?: number;
};

/** What one run works with: the events read and the rows stored. */
export type CalendarRun = { events: CalendarEvent[]; states: Map<string, CalendarState> };

/** Read the window, then remove old rows. Throws on a Graph or storage failure; the sync records it. */
export async function syncCalendar(mailbox: Mailbox, opts: CalendarOptions): Promise<CalendarSummary> {
  const now = opts.now ?? new Date();
  const s: CalendarSummary = { ok: true, events: 0, pruned: 0, complete: true };
  const run: CalendarRun = { events: [], states: await loadCalendarStates(mailbox.id) };
  for await (const e of listCalendarView(opts.settings, mailbox.address, calendarWindow(now), { ...opts, max: opts.maxEvents })) {
    run.events.push(e);
    s.events++;
    if (Date.now() >= opts.deadline) {
      s.complete = false;
      break;
    }
  }
  s.pruned = await pruneCalendarStates(mailbox.id, now, run.states);
  return s;
}
