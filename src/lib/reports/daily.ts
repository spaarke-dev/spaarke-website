import { TableClient, odata } from "@azure/data-tables";
import { dueForReport } from "@/lib/market/followup-admin";
import { FAIL_ALERT_STREAK, listMailboxes, type Mailbox } from "@/lib/market/mailboxes";
import { newContacts } from "@/lib/market/queries";
import { INVESTOR_ROLE } from "@/lib/market/visibility";
import { activityLabel, formatDay } from "@/components/admin/format";

/**
 * The daily digest.
 *
 * Three alerts now fire when something breaks. None of them says the assistant
 * went a week without a question, and for a feature that is a bet on engagement
 * that silence is the outcome worth knowing about. This is the other half: a
 * mail every morning that says what happened, including nothing.
 *
 * **It reads storage first and treats everything else as optional.** Questions,
 * spend, leads and errors all come from Table Storage, which this site owns and
 * can read without a second credential. Traffic comes from Microsoft Clarity,
 * which needs a token and a network call, so a Clarity failure costs a section
 * and not the mail.
 *
 * Two sources rather than one is deliberate. Clarity knows who visited and what
 * they read. Only this site knows what they asked.
 */

export type ReportSection = {
  title: string;
  lines: string[];
  /** Set when the section could not be built. The mail still goes. */
  problem?: string;
  /** A health section (mail sync, secret): it says nothing about engagement, so it does not count toward a quiet day. */
  health?: boolean;
};

export type DailyReport = {
  date: string;
  sections: ReportSection[];
  /** True when nothing happened at all, which is itself the finding. */
  quiet: boolean;
};

type TurnRow = {
  question?: string;
  articleSlug?: string;
  provenance?: string;
  citedSlugs?: string;
  sessionId?: string;
  errorCode?: string;
  costUsd?: number;
  cacheMiss?: boolean;
  createdAt?: string;
};

type LeadRow = {
  rowKey: string;
  status?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  organization?: string;
  createdAt?: string;
};

type ContactRow = {
  name?: string;
  email?: string;
  company?: string;
  reason?: string;
  createdAt?: string;
};

type DesignPartnerRow = {
  firstName?: string;
  lastName?: string;
  email?: string;
  organization?: string;
  organizationType?: string;
  createdAt?: string;
};

function table(connectionString: string, name: string): TableClient {
  return TableClient.fromConnectionString(connectionString, name);
}

/** Rows written in the window, read by `createdAt` rather than by partition. */
async function rowsSince<T extends object>(
  client: TableClient,
  since: string,
): Promise<T[]> {
  const out: T[] = [];
  for await (const row of client.listEntities<T>({
    queryOptions: { filter: odata`createdAt ge ${since}` },
  })) {
    out.push(row);
  }
  return out;
}

function plural(n: number, one: string, many = `${one}s`): string {
  return `${n} ${n === 1 ? one : many}`;
}

// ---------------------------------------------------------------------------
// What readers asked
// ---------------------------------------------------------------------------

async function assistantSection(
  connectionString: string,
  since: string,
): Promise<ReportSection> {
  const lines: string[] = [];
  try {
    const turns = await rowsSince<TurnRow>(
      table(connectionString, "InsightsConversations"),
      since,
    );

    if (turns.length === 0) {
      return { title: "The assistant", lines: ["No questions asked."] };
    }

    const sessions = new Set(turns.map((t) => t.sessionId).filter(Boolean)).size;
    const misses = turns.filter((t) => t.cacheMiss === true).length;
    const errors = turns.filter((t) => t.errorCode);

    // Cost was added to the conversation record on 2026-09-28, so rows written
    // before that carry none. Printing $0.00 for them would report absence as
    // spend, which is the failure this whole day was made of. Say so instead.
    const priced = turns.filter((t) => t.costUsd !== undefined && t.costUsd !== null);
    const spend = priced.reduce((n, t) => n + (Number(t.costUsd) || 0), 0);
    const spendText =
      priced.length === 0
        ? "spend not recorded"
        : priced.length < turns.length
          ? `$${spend.toFixed(2)} across the ${priced.length} with cost recorded`
          : `$${spend.toFixed(2)}`;

    lines.push(
      `${plural(turns.length, "question")} across ${plural(sessions, "session")}, ${spendText}.`,
    );
    if (misses > 0) {
      lines.push(
        `${plural(misses, "cold start")} at roughly $0.69 each. Warming these is task 050.`,
      );
    }

    // Provenance is the column that matters. A question answered from general
    // knowledge is a subject the library does not cover.
    const byProvenance = turns.reduce<Record<string, number>>((acc, t) => {
      const key = t.provenance || "unknown";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});
    lines.push(
      "Provenance: " +
        Object.entries(byProvenance)
          .sort((a, b) => b[1] - a[1])
          .map(([k, n]) => `${k} ${n}`)
          .join(", "),
    );

    lines.push("");
    lines.push("Every question, in order:");
    for (const t of turns.sort((a, b) => (a.createdAt ?? "").localeCompare(b.createdAt ?? ""))) {
      const where = t.articleSlug ? ` [${t.articleSlug}]` : " [library]";
      const flag = t.errorCode ? ` !! ${t.errorCode}` : "";
      lines.push(`  (${t.provenance || "?"})${where} ${t.question ?? ""}${flag}`);
    }

    // The brief for the next article, stated as such rather than left to be
    // noticed. This is the reason the question log exists.
    const gaps = turns.filter((t) => t.provenance === "general" || t.provenance === "mixed");
    if (gaps.length > 0) {
      lines.push("");
      lines.push(
        `**${plural(gaps.length, "question")} the articles could not fully answer.** ` +
          "Each one is a subject the library does not cover.",
      );
    }

    const cited = turns
      .flatMap((t) => (t.citedSlugs ?? "").split(",").filter(Boolean))
      .reduce<Record<string, number>>((acc, slug) => {
        acc[slug] = (acc[slug] ?? 0) + 1;
        return acc;
      }, {});
    const topCited = Object.entries(cited).sort((a, b) => b[1] - a[1]).slice(0, 5);
    if (topCited.length > 0) {
      lines.push("");
      lines.push("Articles the assistant leaned on: " + topCited.map(([s, n]) => `${s} (${n})`).join(", "));
    }

    if (errors.length > 0) {
      lines.push("");
      lines.push(`${plural(errors.length, "turn")} failed: ` + errors.map((e) => e.errorCode).join(", "));
    }

    return { title: "The assistant", lines };
  } catch (err) {
    return {
      title: "The assistant",
      lines: [],
      problem: err instanceof Error ? err.message : String(err),
    };
  }
}

// ---------------------------------------------------------------------------
// Who asked for access
// ---------------------------------------------------------------------------

async function leadsSection(
  connectionString: string,
  since: string,
): Promise<ReportSection> {
  const lines: string[] = [];
  try {
    const leads = await rowsSince<LeadRow>(table(connectionString, "DemoRequests"), since);
    const contacts = await rowsSince<ContactRow>(
      table(connectionString, "ContactSubmissions"),
      since,
    );
    // The table is created by the first application, so until then it does not
    // exist, and that is a quiet day rather than a failed section.
    const partners = await rowsSince<DesignPartnerRow>(
      table(connectionString, "DesignPartnerApplications"),
      since,
    ).catch((err: { statusCode?: number }) => {
      if (err.statusCode === 404) return [];
      throw err;
    });

    if (leads.length === 0 && contacts.length === 0 && partners.length === 0) {
      lines.push(
        "No evaluation requests, no contact form submissions, no design partner applications.",
      );
    }

    for (const p of partners) {
      lines.push(
        `  [design partner] ${p.firstName ?? ""} ${p.lastName ?? ""} <${p.email ?? ""}>, ${p.organization ?? ""} (${p.organizationType ?? ""})`,
      );
    }

    for (const l of leads) {
      lines.push(
        `  [${l.status}] ${l.firstName ?? ""} ${l.lastName ?? ""} <${l.email ?? ""}>, ${l.organization ?? ""}`,
      );
    }
    for (const c of contacts) {
      lines.push(`  [contact] ${c.name ?? ""} <${c.email ?? ""}>, ${c.company ?? ""} (${c.reason ?? ""})`);
    }

    // Anything not forwarded is a lead nobody has acted on. It is stated
    // separately because it is the one line in this mail that is a task.
    const waiting = leads.filter((l) => l.status === "orphaned" || l.status === "pending");
    if (waiting.length > 0) {
      lines.push("");
      lines.push(
        `**${plural(waiting.length, "request")} did not reach the platform** and need re-entering. ` +
          "Run: npm run demo-request:orphans",
      );
    }

    return { title: "Leads", lines };
  } catch (err) {
    return { title: "Leads", lines: [], problem: err instanceof Error ? err.message : String(err) };
  }
}

// ---------------------------------------------------------------------------
// Market access: follow-ups due and new contacts (FR-16)
// ---------------------------------------------------------------------------

/**
 * Both sections read the market access tables through their own module, which
 * uses the same storage setting. The mail goes to a list, so investor records
 * appear only as a count: no name, email, firm or title.
 */
const LISTED_MAX = 25;

function dueDay(d: string): string {
  return formatDay(`${d}T12:00:00Z`);
}

export async function followUpsSection(now = new Date()): Promise<ReportSection> {
  try {
    const { rows, hidden } = await dueForReport(now);
    if (rows.length === 0 && hidden === 0) return { title: "Follow-ups", lines: ["No follow-ups due."] };

    const lines = [`${plural(rows.length + hidden, "follow-up")} due today or overdue, oldest first.`];
    for (const r of rows.slice(0, LISTED_MAX)) {
      const when = r.overdue ? `overdue, due ${dueDay(r.dueDate)}` : "today";
      const who = r.contactName ? `${r.contactName} <${r.contactEmail}>` : `<${r.contactEmail}>`;
      const campaign = r.campaignSlug ? ` (${r.campaignSlug})` : "";
      lines.push(`  [${when}] ${r.title}: ${who}${campaign}`);
    }
    if (rows.length > LISTED_MAX) lines.push(`  and ${rows.length - LISTED_MAX} more.`);
    if (hidden) lines.push(`  ${plural(hidden, "investor follow-up")} (hidden).`);
    lines.push("");
    lines.push("Update them at https://spaarke.com/admin");
    return { title: "Follow-ups", lines };
  } catch (err) {
    return { title: "Follow-ups", lines: [], problem: err instanceof Error ? err.message : String(err) };
  }
}

export async function newContactsSection(days: number, now = new Date()): Promise<ReportSection> {
  try {
    // Every contact, so investor ones can be counted; only general ones are named.
    const all = await newContacts(["admin", INVESTOR_ROLE], { now, days });
    const shown = all.filter((c) => c.visibility !== "investor");
    const hidden = all.length - shown.length;
    if (all.length === 0) return { title: "New contacts", lines: ["No new contacts."] };

    const lines = [`${plural(all.length, "new contact")}.`];
    for (const c of shown.slice(0, LISTED_MAX)) {
      const who = c.name ? `${c.name} <${c.email}>` : `<${c.email}>`;
      const org = c.organizationName ? `, ${c.organizationName}` : "";
      const from = c.source ? ` (${activityLabel(c.source)})` : "";
      lines.push(`  ${who}${org}${from}`);
    }
    if (shown.length > LISTED_MAX) lines.push(`  and ${shown.length - LISTED_MAX} more.`);
    if (hidden) lines.push(`  ${plural(hidden, "investor contact")} (hidden).`);
    return { title: "New contacts", lines };
  } catch (err) {
    return { title: "New contacts", lines: [], problem: err instanceof Error ? err.message : String(err) };
  }
}

// ---------------------------------------------------------------------------
// Who visited, from Microsoft Clarity
// ---------------------------------------------------------------------------

/**
 * Clarity returns numbers as numbers and the dimension as `Url`, which is null
 * on its aggregate row. Typed from a real response on 2026-09-29 rather than
 * from the documentation, which is how the first attempt got `URL` wrong and
 * silently dropped every page.
 */
type ClarityMetric = {
  metricName?: string;
  information?: Array<Record<string, string | number | null>>;
};

/**
 * Clarity's Data Export API, which has three constraints worth knowing before
 * reading the numbers.
 *
 * It returns whole days only, at most three of them, and it is limited to ten
 * calls per project per day, so this is not something to poll. It also reports
 * its own bot filtering, which is why the traffic line prints bot sessions
 * separately rather than quietly subtracting them.
 */
async function claritySection(token: string | undefined, days: number): Promise<ReportSection> {
  if (!token) {
    return {
      title: "Traffic",
      lines: [],
      problem:
        "CLARITY_API_TOKEN is not set, so traffic is missing. Generate one in Clarity under Settings, Data Export.",
    };
  }

  try {
    const res = await fetch(
      `https://www.clarity.ms/export-data/api/v1/project-live-insights?numOfDays=${days}&dimension1=URL`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(20_000),
      },
    );

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return {
        title: "Traffic",
        lines: [],
        problem: `Clarity returned ${res.status}. ${body.slice(0, 200)}`,
      };
    }

    const metrics = (await res.json()) as ClarityMetric[];
    if (!Array.isArray(metrics) || metrics.length === 0) {
      return { title: "Traffic", lines: ["Clarity returned no metrics for this window."] };
    }

    const lines: string[] = [];
    const traffic = metrics.find((m) => m.metricName === "Traffic");

    // The dimension key is `Url`, capital U and nothing else. Clarity also
    // returns one row with `Url: null`, which is an aggregate rather than a
    // page, so it is excluded from both the totals and the page list.
    const rows = (traffic?.information ?? []).filter((r) => r.Url);

    const sessions = rows.reduce((n, r) => n + (Number(r.totalSessionCount) || 0), 0);
    const bots = rows.reduce((n, r) => n + (Number(r.totalBotSessionCount) || 0), 0);
    const humans = Math.max(sessions - bots, 0);

    // Distinct users is deliberately a maximum and not a sum. The same person
    // reading three articles appears in three rows, so adding them up invents
    // visitors. The maximum is a floor, and it is labelled as one.
    const users = rows.reduce((n, r) => Math.max(n, Number(r.distinctUserCount) || 0), 0);

    // Said in one line rather than two, because "nobody read the site" next to
    // "4 distinct visitors" reads as a contradiction and teaches you to
    // distrust the report. Clarity's distinct user count includes bots, so it
    // is only worth printing when there were humans to count.
    if (sessions === 0) {
      lines.push("No sessions at all.");
    } else if (humans === 0) {
      lines.push(`${plural(sessions, "session")}, every one a bot. Nobody read the site.`);
    } else {
      lines.push(
        `${plural(humans, "human session")} out of ${sessions} total, ${bots} from bots. ` +
          `At least ${plural(users, "distinct visitor")}, bots included.`,
      );
    }

    // Most visited, which is the "articles accessed" question. Clarity gives
    // whole URLs, so the article slug is the tail.
    const pages = rows
      .map((r) => ({
        url: String(r.Url),
        n: Number(r.totalSessionCount) || 0,
        bots: Number(r.totalBotSessionCount) || 0,
      }))
      .filter((p) => p.n > 0)
      .sort((a, b) => b.n - a.n)
      .slice(0, 10);

    if (pages.length > 0) {
      lines.push("");
      lines.push("Most visited, sessions and how many were bots:");
      for (const p of pages) {
        lines.push(`  ${String(p.n).padStart(4)}  (${p.bots} bot)  ${p.url}`);
      }
    }

    const scroll = metrics.find((x) => x.metricName === "ScrollDepth")?.information?.[0];
    if (scroll?.averageScrollDepth !== undefined) {
      lines.push("");
      lines.push(`Average scroll depth: ${scroll.averageScrollDepth}%`);
    }

    const time = metrics.find((x) => x.metricName === "EngagementTime")?.information?.[0];
    if (time?.activeTime !== undefined) {
      lines.push(`Engagement: ${time.activeTime}s active of ${time.totalTime}s total`);
    }

    return { title: "Traffic", lines };
  } catch (err) {
    return {
      title: "Traffic",
      lines: [],
      problem: err instanceof Error ? `${err.name}: ${err.message}` : String(err),
    };
  }
}

// ---------------------------------------------------------------------------
// Health: the mail sync and the Graph secret (phase 2 FR-13, FR-14)
// ---------------------------------------------------------------------------

/** A sync older than this is worth a warning: runs are every 15 minutes, and GitHub can run them late. */
const SYNC_STALE_MS = 60 * 60_000;

function whenUtc(iso: string): string {
  return `${iso.slice(0, 16).replace("T", " ")} UTC`;
}

/**
 * When the mail sync last worked, and each mailbox that has failed three
 * runs in a row with its error. Mailbox addresses are the team's own.
 */
export async function mailSyncSection(now = new Date(), mailboxes?: readonly Mailbox[]): Promise<ReportSection> {
  try {
    const enabled = (mailboxes ?? (await listMailboxes())).filter((m) => m.enabled);
    if (!enabled.length) return { title: "Mail sync", health: true, lines: ["No mailboxes registered."] };
    const last = enabled.map((m) => m.lastSyncAt ?? "").sort().pop();
    const lines: string[] = [];
    if (!last) lines.push("Warning: no mailbox has synced yet.");
    else if (now.getTime() - Date.parse(last) > SYNC_STALE_MS) {
      lines.push(`Warning: the last successful sync was ${whenUtc(last)}, more than an hour ago.`);
    } else lines.push(`Last successful sync ${whenUtc(last)}.`);
    const failing = enabled.filter((m) => (m.failStreak ?? 0) >= FAIL_ALERT_STREAK);
    for (const m of failing) {
      lines.push(`  ${m.label || m.address} <${m.address}>: failed ${m.failStreak} runs in a row. ${m.lastError ?? ""}`.trimEnd());
    }
    if (failing.length) lines.push("", "Check them at https://spaarke.com/admin/mailboxes");
    return { title: "Mail sync", health: true, lines };
  } catch (err) {
    return { title: "Mail sync", health: true, lines: [], problem: err instanceof Error ? err.message : String(err) };
  }
}

const SECRET_WARN_DAYS = 30;

/**
 * The Graph app secret that /meet and the mail sync share. Its expiry date is
 * set by hand at each rotation, because the site does not read it from Entra.
 */
export function secretSection(value: string | undefined, now = new Date()): ReportSection {
  const title = "Graph secret";
  const v = value?.trim() ?? "";
  const ms = /^\d{4}-\d{2}-\d{2}$/.test(v) ? Date.parse(`${v}T00:00:00Z`) : Number.NaN;
  if (Number.isNaN(ms)) {
    return { title, health: true, lines: ["Secret expiry date unknown. Set MEET_GRAPH_SECRET_EXPIRES (yyyy-mm-dd) on the site."] };
  }
  const days = Math.ceil((ms - now.getTime()) / 86_400_000);
  if (days < 0) return { title, health: true, lines: [`Warning: the secret expired on ${v}. The /meet booking and the mail sync have stopped.`] };
  if (days <= SECRET_WARN_DAYS) {
    return { title, health: true, lines: [`Warning: the secret expires on ${v}, in ${plural(days, "day")}. Rotate it before then.`] };
  }
  return { title, health: true, lines: [`Expires ${v}.`] };
}

// ---------------------------------------------------------------------------

export async function buildDailyReport(options: {
  connectionString?: string;
  clarityToken?: string;
  /** Whole days back. Clarity allows at most 3. */
  days?: number;
  /** MEET_GRAPH_SECRET_EXPIRES, for the checks; read from the settings otherwise. */
  secretExpires?: string;
}): Promise<DailyReport> {
  const days = Math.min(Math.max(options.days ?? 1, 1), 3);
  const since = new Date(Date.now() - days * 86_400_000).toISOString();
  const date = new Date().toISOString().slice(0, 10);

  const sections: ReportSection[] = [];

  if (!options.connectionString) {
    sections.push({
      title: "The assistant",
      lines: [],
      problem: "STORAGE_ACCOUNT_CONNECTION is not set, so questions and leads are missing.",
    });
  } else {
    sections.push(await assistantSection(options.connectionString, since));
    sections.push(await leadsSection(options.connectionString, since));
    sections.push(await followUpsSection());
    sections.push(await newContactsSection(days));
    sections.push(await mailSyncSection());
  }

  sections.push(await claritySection(options.clarityToken, days));
  sections.push(secretSection(options.secretExpires ?? process.env.MEET_GRAPH_SECRET_EXPIRES));

  // A day with nothing in it is a real result for a feature that is a bet on
  // engagement, so it is said in the subject line rather than left to be
  // inferred from an empty mail.
  const quiet = sections.every(
    (s) => s.health || s.problem !== undefined || s.lines.length === 0 || /^No |^No questions/.test(s.lines[0] ?? ""),
  );

  return { date, sections, quiet };
}

/** Plain text, because this is a mail to read on a phone at breakfast. */
export function renderDailyReport(report: DailyReport, days: number): string {
  const out: string[] = [
    `Spaarke, ${report.date}, the last ${plural(days, "day")}.`,
    "",
  ];

  for (const section of report.sections) {
    out.push(`## ${section.title}`);
    if (section.problem) {
      out.push(`  could not be read: ${section.problem}`);
    } else if (section.lines.length === 0) {
      out.push("  Nothing.");
    } else {
      out.push(...section.lines);
    }
    out.push("");
  }

  out.push("---");
  out.push("Questions come from the conversation record, leads from Table Storage,");
  out.push("follow-ups and contacts from the admin records, traffic from Microsoft");
  out.push("Clarity, mail sync health from the mailbox registry. Investor records are counted,");
  out.push("never named. Alerts cover failures separately.");
  return out.join("\n");
}
