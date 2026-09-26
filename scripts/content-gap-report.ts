// What readers asked that the articles could not answer.
//
// Task 022. The report the conversation log exists for: a question answered from
// general knowledge is a subject the library does not cover, and grouped by the
// article the reader was on it is the brief for the next piece. The other three
// sections are context for reading that one, not the point of it.
//
//   npx tsx scripts/content-gap-report.ts             the last 30 days
//   npx tsx scripts/content-gap-report.ts --days 90   the whole retention window
//
// Reads STORAGE_ACCOUNT_CONNECTION from .env.local. Question text older than 90
// days has been purged by then, so a long window reports counts with no text
// against the oldest days, which is the retention promise working as intended.

import { readFileSync } from "node:fs";
import { TableClient, odata } from "@azure/data-tables";

/** Kept in step with src/lib/insights/capture.ts by hand. There is one table. */
const TABLE_NAME = "InsightsConversations";

const DAY_MS = 86_400_000;
const WRAP = 78;

type TurnRow = {
  partitionKey: string;
  rowKey: string;
  question?: string;
  articleSlug?: string;
  sessionId?: string;
  provenance?: string;
  continued?: boolean;
  askedBack?: boolean;
  answerChars?: number;
  errorCode?: string;
  purged?: boolean;
  createdAt?: string;
};

function days(): number {
  const at = process.argv.indexOf("--days");
  if (at === -1) return 30;
  const parsed = Number(process.argv[at + 1]);
  if (!Number.isFinite(parsed) || parsed < 1) {
    console.error("--days takes a positive number of days.");
    process.exit(2);
  }
  return Math.floor(parsed);
}

function loadEnv(): void {
  let contents = "";
  try {
    contents = readFileSync(".env.local", "utf8");
  } catch {
    // The connection may come from the shell instead, so a missing file is not
    // fatal here. A missing connection string is, and is reported below.
    return;
  }
  for (const line of contents.split("\n")) {
    const m = /^([A-Z_]+)=(.*)$/.exec(line.trim());
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

function utcDate(at: Date): string {
  return at.toISOString().slice(0, 10);
}

/** Wrapped and indented, because the useful lines here are whole questions. */
function wrap(text: string, indent: string): string {
  const words = text.replace(/\s+/g, " ").trim().split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    if (line && line.length + word.length + 1 > WRAP) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines.map((l) => indent + l).join("\n");
}

function pad(text: string, width: number): string {
  return text.length >= width ? text : text + " ".repeat(width - text.length);
}

function share(n: number, total: number): string {
  return total === 0 ? "" : `${Math.round((n / total) * 100)}%`;
}

/** Descending by count, then by name so a tie reads the same way twice. */
function ranked(counts: Map<string, number>): [string, number][] {
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

function tally(counts: Map<string, number>, key: string): void {
  counts.set(key, (counts.get(key) ?? 0) + 1);
}

async function read(client: TableClient, since: string): Promise<TurnRow[] | null> {
  const rows: TurnRow[] = [];
  try {
    for await (const row of client.listEntities<TurnRow>({
      queryOptions: { filter: odata`PartitionKey ge ${since}` },
    })) {
      rows.push(row);
    }
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode;
    if (status === 404) return null;
    throw err;
  }
  return rows;
}

/** The gap itself: questions the corpus did not answer, under the article being read. */
function reportGap(rows: TurnRow[], provenance: string, heading: string, why: string): void {
  const matching = rows.filter((r) => r.provenance === provenance);
  console.log(`\n${heading}`);
  console.log(`  ${why}`);
  if (matching.length === 0) {
    console.log("  Nothing in this window.");
    return;
  }

  const byArticle = new Map<string, TurnRow[]>();
  for (const row of matching) {
    const slug = row.articleSlug || "(no article)";
    const list = byArticle.get(slug) ?? [];
    list.push(row);
    byArticle.set(slug, list);
  }

  const order = [...byArticle.entries()].sort(
    (a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]),
  );
  for (const [slug, turns] of order) {
    const questions = turns.map((t) => (t.question ?? "").trim()).filter(Boolean);
    // A turn past retention still counts, which is the point of keeping the row,
    // so the heading says how many of the group have lost their text.
    const purged = turns.length - questions.length;
    const note = purged > 0 ? `, ${purged} past retention` : "";
    console.log(`\n  ${slug}  (${turns.length}${note})`);
    for (const question of questions) console.log(wrap(question, "    "));
  }
}

async function main(): Promise<void> {
  loadEnv();

  const connectionString = process.env.STORAGE_ACCOUNT_CONNECTION;
  if (!connectionString) {
    console.error(
      "STORAGE_ACCOUNT_CONNECTION is not set, in .env.local or in the environment, so there is nothing to read.",
    );
    process.exit(1);
  }

  const windowDays = days();
  const today = new Date();
  // The first day counted, inclusive, so --days 1 reads today.
  const since = utcDate(new Date(today.getTime() - (windowDays - 1) * DAY_MS));

  const client = TableClient.fromConnectionString(connectionString, TABLE_NAME);
  const rows = await read(client, since);

  console.log(`\nContent gap report, ${windowDays} day(s), ${since} to ${utcDate(today)}`);

  if (rows === null) {
    console.log(
      `\nThe table ${TABLE_NAME} does not exist yet. Nothing has been recorded, which is what a first run looks like.`,
    );
    return;
  }
  if (rows.length === 0) {
    console.log("\nNo turns in this window. Try a longer one with --days.");
    return;
  }

  const provenance = new Map<string, number>();
  const byArticle = new Map<string, number>();
  const errors = new Map<string, number>();
  const sessions = new Set<string>();
  let continued = 0;
  for (const row of rows) {
    tally(provenance, row.provenance || "(unrecorded)");
    tally(byArticle, row.articleSlug || "(no article)");
    if (row.errorCode) tally(errors, row.errorCode);
    if (row.continued) continued += 1;
    if (row.sessionId) sessions.add(row.sessionId);
  }

  console.log(
    `\nTurns: ${rows.length} across ${sessions.size} session(s), of which ${continued} followed an earlier question`,
  );
  for (const [label, n] of ranked(provenance)) {
    console.log(`  ${pad(label, 14)}${pad(String(n), 7)}${share(n, rows.length)}`);
  }

  reportGap(
    rows,
    "general",
    "Answered from general knowledge, by the article the reader was on",
    "Each of these is a question the library could not answer. This is the brief.",
  );
  reportGap(
    rows,
    "mixed",
    "Answered partly from outside the corpus, by the article the reader was on",
    "A weaker signal than the above: the articles covered some of the question.",
  );

  console.log("\nArticles generating the most questions");
  for (const [slug, n] of ranked(byArticle)) {
    console.log(`  ${pad(slug, 56)}${n}`);
  }

  console.log("\nTurns that ended in an error");
  if (errors.size === 0) {
    console.log("  None.");
  } else {
    for (const [code, n] of ranked(errors)) {
      console.log(`  ${pad(code, 20)}${n}`);
    }
  }
  console.log("");
}

main().catch((err) => {
  console.error("\nThe report failed to run:", err);
  process.exit(1);
});
