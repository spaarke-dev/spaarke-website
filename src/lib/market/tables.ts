import { TableClient } from "@azure/data-tables";

/**
 * Table access for market access. One cached client per table, created once
 * per process, the same pattern as src/lib/meet/store.ts.
 *
 * MA_TABLE_SUFFIX appends a suffix to every table name (for example `Dev`), so
 * local runs and checks never touch the live tables. MA_TABLES_ENDPOINT is for
 * local checks against an emulator and is ignored when unset.
 */

export const TABLES = {
  contacts: "MaContacts",
  organizations: "MaOrganizations",
  activities: "MaActivities",
  activityByMonth: "MaActivityByMonth",
  campaigns: "MaCampaigns",
  members: "MaMembers",
  followUps: "MaFollowUps",
  mailboxes: "MaMailboxes",
  triage: "MaTriage",
  syncState: "MaSyncState",
  audit: "MaAudit",
  tombstones: "MaTombstones",
  steps: "MaSteps",
  calendarEvents: "MaCalendarEvents",
  stepRuns: "MaStepRuns",
} as const;

export type TableKey = keyof typeof TABLES;

const clients = new Map<string, TableClient>();
const ensured = new Set<string>();

function suffix(): string {
  const s = process.env.MA_TABLE_SUFFIX?.trim() ?? "";
  // Table names are alphanumeric only.
  return /^[A-Za-z0-9]*$/.test(s) ? s : "";
}

export function tableName(key: TableKey): string {
  return `${TABLES[key]}${suffix()}`;
}

function connectionString(): string | undefined {
  return process.env.STORAGE_ACCOUNT_CONNECTION?.trim() || undefined;
}

export function isMarketConfigured(): boolean {
  return Boolean(connectionString());
}

/** The client for a table, created on first use, or null without storage. */
export async function getTable(key: TableKey): Promise<TableClient | null> {
  const cs = connectionString();
  if (!cs) return null;
  const name = tableName(key);

  let client = clients.get(name);
  if (!client) {
    client = TableClient.fromConnectionString(cs, name, {
      // Plain http only for a local emulator; the live connection is https.
      allowInsecureConnection: cs.includes("UseDevelopmentStorage=true") || /TableEndpoint=http:\/\//i.test(cs),
    });
    clients.set(name, client);
  }
  if (!ensured.has(name)) {
    try {
      await client.createTable();
    } catch (err) {
      const code = (err as { statusCode?: number }).statusCode;
      if (code && code !== 409) throw err;
    }
    ensured.add(name);
  }
  return client;
}

/** Table Storage status code from an SDK error, if any. */
export function statusOf(err: unknown): number | undefined {
  return (err as { statusCode?: number })?.statusCode;
}

/** Forget cached clients. For check scripts that change settings mid-run. */
export function resetTableClients(): void {
  clients.clear();
  ensured.clear();
}
