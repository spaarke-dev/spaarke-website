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
 */

const TABLE = "PrivateBriefs";
const PARTITION = "brief";

export type PrivateBrief = { label: string; text: string };

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
    const row = await t.getEntity<{ text?: string; label?: string; active?: boolean }>(PARTITION, key);
    if (row.active === false || typeof row.text !== "string" || !row.text.trim()) return null;
    return { label: row.label ?? "unlabeled", text: row.text };
  } catch {
    return null;
  }
}
