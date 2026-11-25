import { sha256 } from "@/lib/market/keys";
import { getTable, statusOf } from "@/lib/market/tables";
import { getContact } from "@/lib/market/contacts";
import { listCampaigns, listMembers, type Campaign, type Member } from "@/lib/market/campaigns";
import { activitiesSince, campaignWindow, effectiveStatus, isStale, memberActivities, recomputeCampaign } from "@/lib/market/results";
import { createFollowUp, todayKey } from "@/lib/market/followups";
import { listSteps, type Step } from "@/lib/market/steps";
import type { Activity, ActivityType } from "@/lib/market/types";

/**
 * The daily follow-up job (phase 2 FR-10, task 041). For each campaign with
 * steps switched on, it works out each member's anchor day, adds the step's
 * days, and creates an ordinary follow-up on the day it falls due, once.
 *
 *   MaStepRuns  partition: campaign slug   row key: <step ID>|<contact ID>
 *
 * The follow-up's ID comes from the campaign, step and contact, so a second
 * run the same day finds it and creates nothing. A due day up to 7 days past
 * is caught up; an older one is skipped and recorded once, so it is counted
 * once. Stopped members are not recorded: if the stop goes away while the
 * step is still in its 7 days, the follow-up is made then.
 *
 * Days are counted in the host's time zone, the zone the admin pages show.
 */

export const CATCH_UP_DAYS = 7;

const FIRST_MEETING: ReadonlySet<ActivityType> = new Set(["calendar.held", "meeting.booked", "meeting.in_person"]);

export type StepRunSummary = {
  campaigns: number;
  steps: number;
  created: number;
  /** Follow-ups an earlier run had already made. */
  already: number;
  /** Due more than 7 days ago when first seen: skipped, counted once. */
  late: number;
  /** Bounced, done, replied (for no-reply and engaged steps), Stop steps, or a deleted contact. */
  stopped: number;
  /** Members whose status does not match the step's "who" today. */
  notMatched: number;
  recomputed: number;
};

// ---- Pure helpers ----

/** A yyyy-mm-dd day plus `days`. Pure. */
export function addDays(day: string, days: number): string {
  return new Date(Date.parse(`${day}T00:00:00Z`) + days * 86_400_000).toISOString().slice(0, 10);
}

/** Whole days from `from` to `to`, both yyyy-mm-dd. Pure. */
export function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);
}

/** The first activity time of the anchor's kind among a member's counted activities. Pure. */
export function anchorTime(anchor: Step["anchor"], activities: readonly Pick<Activity, "type" | "occurredAt">[]): string | undefined {
  const match = (a: Pick<Activity, "type">) => (anchor === "first-email" ? a.type === "email.sent" : FIRST_MEETING.has(a.type));
  return activities.filter(match).map((a) => a.occurredAt).sort()[0];
}

export type Verdict = "match" | "stop" | "no";

/** Whether a step applies to a member today, from the member's effective status. Pure. */
export function audienceVerdict(
  audience: Step["audience"],
  member: Pick<Member, "status" | "statusOverride" | "reached" | "stopSteps">,
): Verdict {
  const status = effectiveStatus(member);
  if (member.stopSteps || status === "bounced" || status === "done") return "stop";
  const met = status === "meeting" || member.reached.includes("meeting");
  switch (audience) {
    case "no-reply":
      if (status === "replied") return "stop";
      return status === "sent" ? "match" : "no";
    case "engaged-no-meeting":
      if (status === "replied") return "stop";
      return status === "engaged" && !met ? "match" : "no";
    case "met":
      return met ? "match" : "no";
    case "everyone":
      return status === "planned" ? "no" : "match";
  }
}

/** The follow-up a step makes for a member: one ID per campaign, step and contact. Pure. */
export function stepFollowUpId(slug: string, stepId: string, contactId: string): string {
  return sha256(`step|${slug}|${stepId}|${contactId}`).slice(0, 32);
}

// ---- Run records ----

type RunEntity = { partitionKey: string; rowKey: string; outcome: "created" | "late"; dueDate: string; followUpId?: string; at: string };

async function getRun(slug: string, stepId: string, contactId: string): Promise<RunEntity | null> {
  const t = await getTable("stepRuns");
  if (!t) return null;
  try {
    return await t.getEntity<RunEntity>(slug, `${stepId}|${contactId}`);
  } catch (err) {
    if (statusOf(err) === 404) return null;
    throw err;
  }
}

async function saveRun(slug: string, stepId: string, contactId: string, row: Omit<RunEntity, "partitionKey" | "rowKey">): Promise<void> {
  const t = await getTable("stepRuns");
  if (!t) return;
  await t.upsertEntity<RunEntity>({ partitionKey: slug, rowKey: `${stepId}|${contactId}`, ...row }, "Replace");
}

// ---- The run ----

async function runCampaign(campaign: Campaign, steps: Step[], s: StepRunSummary, now: Date): Promise<void> {
  const today = todayKey(now);
  for (const m of await listMembers(campaign.slug)) {
    const contact = await getContact(m.contactId);
    const activities = contact ? memberActivities(campaign, m, await activitiesSince(m.contactId, campaignWindow(campaign, m).from)) : [];
    for (const step of steps) {
      if (step.group && m.group !== step.group) continue;
      if (!contact) {
        s.stopped++;
        continue;
      }
      const anchor = anchorTime(step.anchor, activities);
      if (!anchor) continue;
      const due = addDays(todayKey(new Date(anchor)), step.days);
      if (due > today) continue;
      const run = await getRun(campaign.slug, step.id, m.contactId);
      if (run) {
        if (run.outcome === "created") s.already++;
        continue;
      }
      if (daysBetween(due, today) > CATCH_UP_DAYS) {
        await saveRun(campaign.slug, step.id, m.contactId, { outcome: "late", dueDate: due, at: now.toISOString() });
        s.late++;
        continue;
      }
      const verdict = audienceVerdict(step.audience, m);
      if (verdict === "stop") {
        s.stopped++;
        continue;
      }
      if (verdict === "no") {
        s.notMatched++;
        continue;
      }
      const id = stepFollowUpId(campaign.slug, step.id, m.contactId);
      const r = await createFollowUp(
        { contactId: m.contactId, title: step.name, dueDate: due, campaignSlug: campaign.slug, visibility: contact.visibility, id },
        now,
      );
      if (!r) continue;
      await saveRun(campaign.slug, step.id, m.contactId, { outcome: "created", dueDate: due, followUpId: id, at: now.toISOString() });
      if (r.created) s.created++;
      else s.already++;
    }
  }
}

/** One daily run over every campaign with steps switched on. Statuses are derived first when stale. */
export async function runSteps(now = new Date()): Promise<StepRunSummary> {
  const s: StepRunSummary = { campaigns: 0, steps: 0, created: 0, already: 0, late: 0, stopped: 0, notMatched: 0, recomputed: 0 };
  for (const campaign of await listCampaigns()) {
    const steps = (await listSteps(campaign.slug)).filter((x) => x.enabled);
    if (!steps.length) continue;
    s.campaigns++;
    s.steps += steps.length;
    if (isStale(campaign, now)) {
      const r = await recomputeCampaign(campaign.slug, { now });
      s.recomputed += r?.changed ?? 0;
    }
    await runCampaign(campaign, steps, s, now);
  }
  return s;
}
