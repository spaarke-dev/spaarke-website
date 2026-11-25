import { audit } from "@/lib/market/audit";
import {
  addMember,
  getMember,
  listCampaigns,
  listMembers,
  MemberConflictError,
  type Campaign,
  type Member,
} from "@/lib/market/campaigns";
import { getContact } from "@/lib/market/contacts";
import { mapLimit } from "@/lib/market/results";
import { getTable, statusOf } from "@/lib/market/tables";
import { canSeeInvestor, isVisibleTo } from "@/lib/market/visibility";

/**
 * Member codes (phase 2 FR-03). "Give everyone a code" gives each member
 * without one the next `<prefix>-NNN` and the brief label `<slug>:<code>`.
 *
 *   MaCampaigns  partition: counter   row key: slug   next: the next number
 *
 * Numbers are claimed from the counter row with an ETag check, so two runs at
 * once never give out the same number. Codes are written through addMember,
 * whose code index refuses a code that already belongs to someone else, in
 * this campaign or another; such a number is skipped. Members that already
 * have a code (the TLTF codes among them) are left alone.
 */

/** Members coded per request, so one request stays well inside the time limit. */
export const CODE_CHUNK = 200;

const COUNTER_PARTITION = "counter";
// With "-" and up to 7 digits, a code stays within the 32 characters isMemberCode allows.
const PREFIX_RE = /^[A-Za-z0-9][A-Za-z0-9_-]{0,23}$/;
const CLAIM_TRIES = 20;
const CLASH_TRIES = 50;

export function isCodePrefix(value: unknown): value is string {
  return typeof value === "string" && PREFIX_RE.test(value) && !value.endsWith("-");
}

/** The slug cut to 12 characters, without a trailing dash. */
export function defaultCodePrefix(slug: string): string {
  return slug.slice(0, 12).replace(/-+$/, "");
}

export function codePrefixOf(c: Pick<Campaign, "slug" | "codePrefix">): string {
  return c.codePrefix ?? defaultCodePrefix(c.slug);
}

export function formatCode(prefix: string, n: number): string {
  return `${prefix}-${String(n).padStart(3, "0")}`;
}

export function briefLabelFor(slug: string, code: string): string {
  return `${slug}:${code}`;
}

type CounterEntity = { partitionKey: string; rowKey: string; next: number; etag?: string };

/** How many numbers the campaign has given out (0 when none). */
export async function codesIssued(slug: string): Promise<number> {
  const table = await getTable("campaigns");
  if (!table) return 0;
  try {
    const e = await table.getEntity<CounterEntity>(COUNTER_PARTITION, slug);
    return Math.max(0, (Number(e.next) || 1) - 1);
  } catch (err) {
    if (statusOf(err) === 404) return 0;
    throw err;
  }
}

/** Claim `count` numbers in a row and return the first. */
export async function claimNumbers(slug: string, count: number): Promise<number> {
  const table = (await getTable("campaigns"))!;
  for (let attempt = 0; attempt < CLAIM_TRIES; attempt++) {
    let current: CounterEntity | null = null;
    try {
      current = await table.getEntity<CounterEntity>(COUNTER_PARTITION, slug);
    } catch (err) {
      if (statusOf(err) !== 404) throw err;
    }
    try {
      if (!current) {
        await table.createEntity({ partitionKey: COUNTER_PARTITION, rowKey: slug, next: 1 + count });
        return 1;
      }
      const first = Number(current.next) || 1;
      await table.updateEntity({ partitionKey: COUNTER_PARTITION, rowKey: slug, next: first + count }, "Replace", {
        etag: current.etag,
      });
      return first;
    } catch (err) {
      // Another run claimed first: read the counter again.
      if (statusOf(err) === 409 || statusOf(err) === 412) continue;
      throw err;
    }
  }
  throw new Error("The code counter is busy");
}

/** True once a member has a code or the counter has given out a number; the prefix is then fixed. */
export async function codesExist(slug: string, members?: readonly Member[]): Promise<boolean> {
  if ((await codesIssued(slug)) > 0) return true;
  return (members ?? (await listMembers(slug))).some((m) => Boolean(m.code));
}

/** Another campaign whose codes would start the same way. */
async function prefixInUse(campaign: Campaign, prefix: string): Promise<boolean> {
  const others = (await listCampaigns()).filter((c) => c.slug !== campaign.slug);
  return others.some((c) => codePrefixOf(c).toLowerCase() === prefix.toLowerCase());
}

/**
 * Check a new prefix for a campaign. Returns a message when it cannot be used,
 * or null. The message never names another campaign, which the user may not see.
 */
export async function checkPrefixChange(campaign: Campaign, prefix: string | null): Promise<string | null> {
  const next = prefix ?? defaultCodePrefix(campaign.slug);
  if (next === codePrefixOf(campaign)) return null;
  if (!isCodePrefix(next)) return "The code prefix takes letters, digits, - and _, up to 24 characters, and cannot end in -";
  if (await codesExist(campaign.slug)) return "The code prefix is fixed once codes exist";
  if (await prefixInUse(campaign, next)) return "Another campaign uses this code prefix";
  return null;
}

export type CodeRun =
  | { status: "ok"; coded: number; clashes: number; more: boolean }
  | { status: "prefix-in-use" };

/**
 * Give up to CODE_CHUNK members without a code the next numbers, earliest
 * member first. `coded` counts only members the user may see; `more` says
 * another request is needed.
 */
export async function assignCodes(
  campaign: Campaign,
  roles: readonly string[],
  who: string,
  now = new Date(),
): Promise<CodeRun> {
  const slug = campaign.slug;
  const prefix = codePrefixOf(campaign);
  const members = await listMembers(slug);
  const uncoded = members
    .filter((m) => !m.code)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.contactId.localeCompare(b.contactId));
  if (!uncoded.length) return { status: "ok", coded: 0, clashes: 0, more: false };
  if (!(await codesExist(slug, members)) && (await prefixInUse(campaign, prefix))) return { status: "prefix-in-use" };

  const batch = uncoded.slice(0, CODE_CHUNK);
  const first = await claimNumbers(slug, batch.length);
  const seesAll = canSeeInvestor(roles);
  let coded = 0;
  let visible = 0;
  let clashes = 0;

  await mapLimit(
    batch.map((m, i) => ({ m, n: first + i })),
    8,
    async ({ m, n }) => {
      let number = n;
      for (let attempt = 0; attempt < CLASH_TRIES; attempt++) {
        // Read again: a run at the same moment may have coded this member already.
        const fresh = await getMember(slug, m.contactId);
        if (!fresh || fresh.code) return;
        const code = formatCode(prefix, number);
        try {
          await addMember({ campaignSlug: slug, contactId: m.contactId, code, briefLabel: briefLabelFor(slug, code) }, now);
        } catch (err) {
          if (!(err instanceof MemberConflictError)) throw err;
          clashes += 1;
          number = await claimNumbers(slug, 1);
          continue;
        }
        coded += 1;
        if (seesAll) visible += 1;
        else {
          const contact = await getContact(m.contactId);
          if (contact && isVisibleTo(contact, roles)) visible += 1;
        }
        return;
      }
      throw new Error("Too many codes already taken; set a different code prefix");
    },
  );

  if (coded || clashes) {
    await audit(
      { who, action: "campaign.codes", entity: "campaign", entityId: slug, after: { coded, clashes, prefix } },
      now,
    );
  }
  return { status: "ok", coded: visible, clashes, more: uncoded.length > batch.length };
}
