import { recordActivity, type ActivityInput } from "@/lib/market/activity";
import { audit } from "@/lib/market/audit";
import {
  addMember,
  getCampaign,
  getMember,
  listMembers,
  MemberConflictError,
  upsertCampaign,
} from "@/lib/market/campaigns";
import { resolveContact } from "@/lib/market/contacts";
import { funnelOf, recomputeCampaign, type Funnel } from "@/lib/market/results";
import { TLTF_CAMPAIGN, TLTF_SLUG, type ImportIssue, type ImportPlan } from "@/lib/market/tltf-import";

/**
 * Write a TLTF import plan (task 050) to storage: the campaign, then per
 * person the contact, the member and their activities, then the results.
 * Safe to run again: contacts are found by email, members are updated in
 * place without resetting their status, and activities are written once per
 * source ID.
 */

export type RunResult = {
  campaign: "created" | "dates set" | "kept";
  contacts: { created: number; found: number; skipped: number };
  members: { added: number; updated: number; failed: number };
  activities: { recorded: number; duplicate: number; skipped: number };
  funnel: Funnel;
  issues: ImportIssue[];
};

export async function runTltfImport(plan: ImportPlan, who: string, now = new Date()): Promise<RunResult> {
  const issues: ImportIssue[] = [];

  let campaignState: RunResult["campaign"] = "kept";
  const existing = await getCampaign(TLTF_SLUG);
  if (!existing) {
    const created = await upsertCampaign({ ...TLTF_CAMPAIGN, ...plan.window }, now);
    if (!created) throw new Error("Storage is not configured");
    campaignState = "created";
  } else if (!existing.startDate && plan.window) {
    // Imported activities count only inside the campaign's dates (results.ts); keep everything else as edited.
    await upsertCampaign({ slug: existing.slug, name: existing.name, ...plan.window }, now);
    campaignState = "dates set";
  }
  if (existing && existing.visibility !== "investor") {
    issues.push({ where: "campaign", reason: "visibility is not investor; left as it is" });
  }

  const byEmail = new Map<string, ActivityInput[]>();
  for (const a of plan.activities) {
    const list = byEmail.get(a.email!) ?? [];
    list.push(a);
    byEmail.set(a.email!, list);
  }

  const contacts = { created: 0, found: 0, skipped: 0 };
  const members = { added: 0, updated: 0, failed: 0 };
  const activities = { recorded: 0, duplicate: 0, skipped: 0 };

  for (const m of plan.members) {
    const acts = byEmail.get(m.email) ?? [];
    const r = await resolveContact(
      { email: m.email, ...m.hints },
      { visibility: TLTF_CAMPAIGN.visibility, source: acts[0]?.type, now },
    );
    if (r.status !== "created" && r.status !== "found") {
      contacts.skipped += 1;
      activities.skipped += acts.length;
      issues.push({ where: `contact ${m.code ?? m.group ?? "member"}`, reason: r.status });
      continue;
    }
    contacts[r.status] += 1;
    const contactId = r.contact.id;

    const before = await getMember(TLTF_SLUG, contactId);
    try {
      await addMember(
        {
          campaignSlug: TLTF_SLUG,
          contactId,
          code: m.code,
          briefKey: m.briefKey,
          briefLabel: m.briefLabel,
          // A Summit pass never relabels someone who is on the outreach list.
          group: before && !m.code ? undefined : m.group,
          templateLabel: m.templateLabel,
        },
        now,
      );
      if (before) members.updated += 1;
      else members.added += 1;
    } catch (err) {
      members.failed += 1;
      const reason = err instanceof MemberConflictError ? `${err.message} belongs to another contact` : "member not saved";
      issues.push({ where: `member ${m.code ?? m.group ?? ""}`.trim(), reason });
      if (!(err instanceof MemberConflictError)) throw err;
    }

    for (const a of acts) {
      const res = await recordActivity({ ...a, email: undefined, contactHints: undefined, contactId, memberId: contactId });
      if (res.status === "recorded") activities.recorded += 1;
      else if (res.status === "duplicate") activities.duplicate += 1;
      else {
        activities.skipped += 1;
        issues.push({ where: `${a.type} ${a.sourceId.split(":")[0]}`, reason: res.reason });
      }
    }
  }

  await recomputeCampaign(TLTF_SLUG, { now });
  const funnel = funnelOf(await listMembers(TLTF_SLUG));

  // Counts only: the audit never holds the people themselves.
  await audit(
    {
      who,
      action: "import.tltf",
      entity: "campaign",
      entityId: TLTF_SLUG,
      after: { campaign: campaignState, ...prefix("contacts", contacts), ...prefix("members", members), ...prefix("activities", activities) },
    },
    now,
  );

  return { campaign: campaignState, contacts, members, activities, funnel, issues };
}

function prefix(name: string, o: Record<string, number>): Record<string, number> {
  return Object.fromEntries(Object.entries(o).map(([k, v]) => [`${name}.${k}`, v]));
}
