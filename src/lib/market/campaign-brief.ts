import { randomBytes } from "node:crypto";
import { audit } from "@/lib/market/audit";
import { addMember, listMembers, type Campaign, type Member } from "@/lib/market/campaigns";
import { briefLabelFor } from "@/lib/market/codes";
import { mapLimit } from "@/lib/market/results";
import {
  listCampaignBriefRows,
  putBrief,
  updateBrief,
  type BriefAudience,
  type CampaignBriefRow,
} from "@/lib/private-brief";

/**
 * One brief text per campaign (phase 2 FR-04, owner decision 2). Each coded
 * member gets their own row in PrivateBriefs with a random key and the
 * member's brief label, so a read of /brief/<key> counts for that member.
 * The member keeps only the key's hash. The text and the keys are never
 * logged or audited.
 */

export const BRIEF_MAX = 20_000;

export class BriefError extends Error {
  constructor(message: string, readonly status = 400) {
    super(message);
    this.name = "BriefError";
  }
}

/** 24 random bytes as base64url: 32 URL-safe characters, which passes isBriefKey. */
export function newBriefKey(): string {
  return randomBytes(24).toString("base64url");
}

export function audienceOf(campaign: Pick<Campaign, "visibility">): BriefAudience {
  return campaign.visibility === "investor" ? "investor" : "general";
}

/** Check a save body: `{ text }`. */
export function parseBriefText(body: unknown): string {
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new BriefError("Expected an object");
  const text = (body as { text?: unknown }).text;
  if (typeof text !== "string") throw new BriefError("Send the brief text");
  const t = text.replace(/\r\n/g, "\n").trim();
  if (!t) throw new BriefError("The brief is empty");
  if (t.length > BRIEF_MAX) throw new BriefError(`The brief is longer than ${BRIEF_MAX.toLocaleString("en-US")} characters`);
  return t;
}

/** Check a switch body: `{ active: boolean }`. */
export function parseBriefActive(body: unknown): boolean {
  const active = body && typeof body === "object" ? (body as { active?: unknown }).active : undefined;
  if (typeof active !== "boolean") throw new BriefError("Send active: true or false");
  return active;
}

export type BriefState = {
  /** The campaign's text, or undefined before the first save. */
  text?: string;
  /** True unless the briefs are turned off. */
  active: boolean;
  /** Labels that have a link, to count against the members a user may see. */
  labels: Set<string>;
};

function labelOf(slug: string, m: Member): string | undefined {
  return m.briefLabel ?? (m.code ? briefLabelFor(slug, m.code) : undefined);
}

/** The campaign's brief as the page shows it. */
export async function campaignBriefState(slug: string): Promise<BriefState> {
  const rows = await listCampaignBriefRows(slug);
  return summarize(rows);
}

function summarize(rows: readonly CampaignBriefRow[]): BriefState {
  // All rows carry the same text and state; the newest save wrote every one.
  const first = rows[0];
  return {
    text: first?.text,
    active: rows.length ? rows.some((r) => r.active) : true,
    labels: new Set(rows.map((r) => r.label)),
  };
}

type Fill = { created: number; updated: number; links: number };

/**
 * Give every coded member without a row a new key and row, and bring the
 * other rows to `text`, the audience and the state. With no `text`, only
 * members without a row are filled, from the text already saved (used after
 * "Give everyone a code"). Returns null when the campaign has no text yet.
 */
async function fill(campaign: Campaign, text: string | undefined, now: Date): Promise<Fill | null> {
  const slug = campaign.slug;
  const rows = await listCampaignBriefRows(slug);
  const state = summarize(rows);
  const body = text ?? state.text;
  if (!body) return null;
  const audience = audienceOf(campaign);
  const byLabel = new Map(rows.map((r) => [r.label, r]));
  const coded = (await listMembers(slug)).filter((m) => m.code);
  let created = 0;
  let updated = 0;

  await mapLimit(coded, 8, async (m) => {
    const label = labelOf(slug, m)!;
    if (byLabel.has(label)) return;
    const key = newBriefKey();
    await putBrief(key, { label, text: body, active: state.active, campaign: slug, audience });
    // The member keeps only the key's hash; the label lets a read find the member.
    await addMember({ campaignSlug: slug, contactId: m.contactId, briefKey: key, briefLabel: label }, now);
    created += 1;
  });
  if (text !== undefined) {
    await mapLimit(rows, 8, async (r) => {
      if (r.text === body && r.audience === audience) return;
      await updateBrief(r.key, { text: body, audience });
      updated += 1;
    });
  }
  return { created, updated, links: rows.length + created };
}

/** Save the campaign's brief text to every coded member's row. */
export async function saveCampaignBrief(campaign: Campaign, text: string, who: string, now = new Date()): Promise<Fill> {
  const coded = (await listMembers(campaign.slug)).filter((m) => m.code).length;
  if (!coded) throw new BriefError("Give members codes first: each coded member gets a private link", 409);
  const r = (await fill(campaign, text, now))!;
  await audit(
    {
      who,
      action: "campaign.brief",
      entity: "campaign",
      entityId: campaign.slug,
      after: { links: r.links, created: r.created, updated: r.updated, characters: text.length },
    },
    now,
  );
  return r;
}

/** Give newly coded members a row from the saved text. Does nothing before the first save. */
export async function fillBriefRows(campaign: Campaign, now = new Date()): Promise<number> {
  return (await fill(campaign, undefined, now))?.created ?? 0;
}

/** Turn every brief link in the campaign off, or on again. */
export async function setCampaignBriefsActive(
  campaign: Campaign,
  active: boolean,
  who: string,
  now = new Date(),
): Promise<{ links: number; changed: number }> {
  const rows = await listCampaignBriefRows(campaign.slug);
  if (!rows.length) throw new BriefError("There are no brief links yet", 409);
  let changed = 0;
  await mapLimit(rows, 8, async (r) => {
    if (r.active === active) return;
    await updateBrief(r.key, { active });
    changed += 1;
  });
  if (changed) {
    await audit(
      { who, action: "campaign.brief_active", entity: "campaign", entityId: campaign.slug, after: { active, links: rows.length } },
      now,
    );
  }
  return { links: rows.length, changed };
}
