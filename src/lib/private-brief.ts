import { TableClient } from "@azure/data-tables";
import { isBriefKey } from "@/lib/ask-ai";

/**
 * Private briefs: text shared through an unlisted link rather than published.
 *
 * Each brief is one row in the PrivateBriefs table: PartitionKey "brief",
 * RowKey the key that appears in /brief/<key>, `text` the markdown to add to
 * the material, `label` a name for reports (for example "tltf-2026"), and
 * `active`. Setting `active` to false, or deleting the row, turns the link off
 * without a deploy. The text never lives in this repository, which is public.
 *
 * Rows written from a campaign (phase 2 FR-04) also carry `campaign`, the
 * slug, and `audience`: "general" briefs are framed for any reader, and a
 * row without an audience (the TLTF rows) stays framed for investors.
 */

const TABLE = "PrivateBriefs";
const PARTITION = "brief";

export type BriefAudience = "investor" | "general";
export type PrivateBrief = { label: string; text: string; audience: BriefAudience };

type BriefEntity = {
  partitionKey: string;
  rowKey: string;
  text?: string;
  label?: string;
  active?: boolean;
  campaign?: string;
  audience?: string;
};

let client: TableClient | null = null;

function table(): TableClient | null {
  if (client) return client;
  const conn = process.env.STORAGE_ACCOUNT_CONNECTION;
  if (!conn) return null;
  client = TableClient.fromConnectionString(conn, TABLE);
  return client;
}

/** The brief for this key, or null when the key is malformed, unknown or switched off. */
export async function getPrivateBrief(key: string): Promise<PrivateBrief | null> {
  if (!isBriefKey(key)) return null;
  const t = table();
  if (!t) return null;
  try {
    const row = await t.getEntity<BriefEntity>(PARTITION, key);
    if (row.active === false || typeof row.text !== "string" || !row.text.trim()) return null;
    return { label: row.label ?? "unlabeled", text: row.text, audience: row.audience === "general" ? "general" : "investor" };
  } catch {
    return null;
  }
}

/** One campaign's brief row, as the admin area reads it. The key is the secret in the link. */
export type CampaignBriefRow = { key: string; label: string; text: string; active: boolean; audience: BriefAudience };

let ensured = false;

/** The admin reads and writes below create the table on first use, so a fresh emulator works. */
async function writable(): Promise<TableClient | null> {
  const t = table();
  if (!t) return null;
  if (!ensured) {
    try {
      await t.createTable();
    } catch (err) {
      if ((err as { statusCode?: number }).statusCode !== 409) throw err;
    }
    ensured = true;
  }
  return t;
}

/** Create a brief row for a new key. Fails when the key exists, so a key is never reused. */
export async function putBrief(
  key: string,
  row: { label: string; text: string; active: boolean; campaign: string; audience: BriefAudience },
): Promise<boolean> {
  if (!isBriefKey(key)) throw new Error("Invalid brief key");
  const t = await writable();
  if (!t) return false;
  await t.createEntity({ partitionKey: PARTITION, rowKey: key, ...row });
  return true;
}

/** Change a brief row's text, audience or state. */
export async function updateBrief(
  key: string,
  patch: Partial<{ text: string; active: boolean; audience: BriefAudience }>,
): Promise<void> {
  if (!isBriefKey(key)) throw new Error("Invalid brief key");
  const t = await writable();
  if (!t) return;
  await t.updateEntity({ partitionKey: PARTITION, rowKey: key, ...patch }, "Merge");
}

/** Turn one link off or on. */
export async function setBriefActive(key: string, active: boolean): Promise<void> {
  await updateBrief(key, { active });
}

/** Every row a campaign wrote. Rows from elsewhere (the TLTF script) are not listed. */
export async function listCampaignBriefRows(campaign: string): Promise<CampaignBriefRow[]> {
  if (!/^[a-z0-9][a-z0-9-]{0,62}$/.test(campaign)) return [];
  const t = await writable();
  if (!t) return [];
  const out: CampaignBriefRow[] = [];
  for await (const e of t.listEntities<BriefEntity>({
    queryOptions: { filter: `PartitionKey eq '${PARTITION}' and campaign eq '${campaign}'` },
  })) {
    out.push({
      key: e.rowKey,
      label: e.label ?? "",
      text: e.text ?? "",
      active: e.active !== false,
      audience: e.audience === "general" ? "general" : "investor",
    });
  }
  return out;
}
