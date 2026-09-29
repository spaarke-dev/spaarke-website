import { TableClient, odata } from "@azure/data-tables";

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

    if (leads.length === 0 && contacts.length === 0) {
      lines.push("No evaluation requests, no contact form submissions.");
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
// Who visited, from Microsoft Clarity
// ---------------------------------------------------------------------------

type ClarityMetric = {
  metricName?: string;
  information?: Array<Record<string, string>>;
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
    const rows = traffic?.information ?? [];

    const total = rows.reduce((n, r) => n + (Number(r.totalSessionCount) || 0), 0);
    const bots = rows.reduce((n, r) => n + (Number(r.totalBotSessionCount) || 0), 0);
    const users = rows.reduce((n, r) => n + (Number(r.distinctUserCount) || 0), 0);
    lines.push(`${plural(total, "session")}, ${users} distinct visitors, ${bots} of them bots.`);

    // Top pages, which is the "articles accessed" question. Clarity keys these
    // by URL, so the article slug is the tail.
    const pages = rows
      .filter((r) => r.URL)
      .map((r) => ({ url: String(r.URL), n: Number(r.totalSessionCount) || 0 }))
      .sort((a, b) => b.n - a.n)
      .slice(0, 10);

    if (pages.length > 0) {
      lines.push("");
      lines.push("Most visited:");
      for (const p of pages) lines.push(`  ${String(p.n).padStart(4)}  ${p.url}`);
    }

    for (const name of ["ScrollDepth", "EngagementTime"]) {
      const m = metrics.find((x) => x.metricName === name);
      const first = m?.information?.[0];
      if (!first) continue;
      const pairs = Object.entries(first)
        .filter(([k]) => k !== "URL")
        .map(([k, v]) => `${k} ${v}`)
        .join(", ");
      if (pairs) lines.push(`${name}: ${pairs}`);
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

export async function buildDailyReport(options: {
  connectionString?: string;
  clarityToken?: string;
  /** Whole days back. Clarity allows at most 3. */
  days?: number;
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
  }

  sections.push(await claritySection(options.clarityToken, days));

  // A day with nothing in it is a real result for a feature that is a bet on
  // engagement, so it is said in the subject line rather than left to be
  // inferred from an empty mail.
  const quiet = sections.every(
    (s) => s.problem !== undefined || s.lines.length === 0 || /^No |^No questions/.test(s.lines[0] ?? ""),
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
  out.push("traffic from Microsoft Clarity. Alerts cover failures separately.");
  return out.join("\n");
}
