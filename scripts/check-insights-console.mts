// Check the console's logic, its failure copy, and what it renders on first paint.
//
// Task 030. The visual layer needs a person to look at it. What does not need a
// person is the part with the edge cases: how runs of prose become paragraphs,
// which passages are marked as general knowledge, what history a follow-up sends,
// and whether every failure the endpoint can return has copy and the right offer
// of a retry. That is all pure, so it is tested here rather than described.
//
//   npx tsx scripts/check-insights-console.mts
//   npx tsx scripts/check-insights-console.mts --base http://localhost:3000
//
// The first form costs nothing and needs no server. With --base it also fetches a
// rendered article and asserts the entry card, the three questions and the
// disclaimer are in the first paint rather than appearing after a first answer.

import type { Citation } from "@/lib/insights/types";
import type { InsightsErrorCode, InsightsEvent } from "@/lib/insights/stream";
import type { Turn } from "@/components/ArticleInsights/transcript";

// Dynamic, because this file is strict ESM and the modules it reaches transpile to
// CommonJS, where a named `export const` is not always visible to the interop
// layer. The same reason `check-insights-defences.mts` does it.
const { ERROR_COPY } = await import("@/lib/insights/stream");
const {
  appendRun,
  applyEvent,
  failTurn,
  historyFor,
  newAssistantTurn,
  paragraphIsGeneral,
  PROVENANCE_LABEL,
  turnText,
} = await import("@/components/ArticleInsights/transcript");

const argv = process.argv.slice(2);
const baseFlag = argv.indexOf("--base");
const base = baseFlag === -1 ? null : argv[baseFlag + 1];

let failures = 0;
function check(ok: boolean, label: string, detail = "") {
  if (!ok) failures += 1;
  console.log(`${ok ? "  pass" : "  FAIL"}  ${label}${detail ? `  ${detail}` : ""}`);
}

const citation = (slug: string, anchor?: string): Citation => ({
  slug,
  title: "An article",
  heading: anchor ? "A section" : "",
  anchor,
  href: anchor ? `/why-spaarke/${slug}#${anchor}` : `/why-spaarke/${slug}`,
});

// --------------------------------------------------------------- paragraphs
console.log("runs of prose becoming paragraphs");
{
  // The assembler flushes by sentence and keeps the trailing newline, so a
  // paragraph arrives as several runs and the break arrives inside one of them.
  let ps = appendRun([], "First sentence. ", false);
  ps = appendRun(ps, "Second sentence.\n\n", false);
  ps = appendRun(ps, "A new paragraph. ", false);
  check(ps.length === 2, "two paragraphs from three runs", `got ${ps.length}`);
  check(
    ps[0].runs.map((r) => r.text).join("") === "First sentence. Second sentence.",
    "the first paragraph holds both its sentences",
  );
  check(ps[1].runs.map((r) => r.text).join("").trim() === "A new paragraph.", "and the second holds the third");
  check(ps[0].runs.length === 1, "adjacent runs with the same provenance merge", `got ${ps[0].runs.length}`);
}
{
  // A single run carrying two breaks, which is what a short answer looks like.
  const ps = appendRun([], "One.\n\nTwo.\n\nThree.", false);
  check(ps.length === 3, "one run with two breaks gives three paragraphs", `got ${ps.length}`);
}
{
  // The shape that actually comes off the wire, and the one that was wrong first
  // time. The assembler breaks a unit at every newline and drops the whitespace-only
  // unit, so a paragraph boundary arrives as a single trailing newline.
  let ps = appendRun([], "End of the first paragraph.\n", false);
  ps = appendRun(ps, "Start of the second. ", false);
  ps = appendRun(ps, "And more of it.\n", false);
  ps = appendRun(ps, "A third.", false);
  check(ps.length === 3, "a single trailing newline ends a paragraph", `got ${ps.length}`);
  check(
    ps[1].runs.map((r) => r.text).join("") === "Start of the second. And more of it.",
    "and the paragraph before it keeps both its runs",
  );
  check(
    ps.every((p) => p.runs.length > 0),
    "with no empty paragraph left behind",
  );
}
{
  const ps = appendRun(appendRun([], "From the article. ", false), "And from outside it. ", true);
  check(ps.length === 1, "a change of provenance mid paragraph does not split it");
  check(ps[0].runs.length === 2, "it splits the runs instead", `got ${ps[0].runs.length}`);
  check(!paragraphIsGeneral(ps[0]), "a paragraph with one corpus run is not general");
  const allGeneral = appendRun([], "Outside knowledge. ", true);
  check(paragraphIsGeneral(allGeneral[0]), "a paragraph whose every run is general is general");
}

// -------------------------------------------------------------------- events
console.log("\napplying events to a turn");
{
  let turn = newAssistantTurn("a1");
  check(turn.status === "waiting", "a new turn is waiting, not streaming");

  const events: InsightsEvent[] = [
    { type: "provenance", value: "mixed" },
    { type: "text", text: "Spend analytics reports. ", general: false },
    { type: "citation", citation: citation("blind-spot", "why") },
    // The same citation again, which either path can deliver.
    { type: "citation", citation: citation("blind-spot", "why") },
    { type: "text", text: "Beyond the articles, this is common. ", general: true },
    { type: "question", text: "Which system do you treat as authoritative?" },
    { type: "question", text: "A second question, which must not replace the first." },
  ];
  for (const e of events) turn = applyEvent(turn, e);

  check(turn.provenance === "mixed", "the provenance label is taken");
  check(turn.status === "streaming", "the turn is streaming");
  check(turn.citations.length === 1, "an identical citation is not chipped twice", `got ${turn.citations.length}`);
  check(turn.asked === "Which system do you treat as authoritative?", "the first question back is kept");
  check(turn.paragraphs.length === 1, "both sentences are in one paragraph");
  check(turn.paragraphs[0].runs.length === 2, "with the general passage as its own run");
  check(
    PROVENANCE_LABEL.mixed === "From the articles, and beyond them",
    "mixed has a label",
  );
  check(PROVENANCE_LABEL.contact === null, "contact has none, because nothing was answered");

  const done = applyEvent(turn, {
    type: "done",
    provenance: "mixed",
    repairs: { citationsCorrected: 0, quotationsDemoted: 0, dashesNormalized: 0 },
    usage: { input: 1, output: 1, cacheRead: 1, cacheWrite: 0 },
  });
  check(done.status === "done", "done ends the turn");

  // A connection dying after prose arrived. The prose stays, because it is a real
  // answer and blanking it would be the worse lie.
  const died = failTurn(turn, "UPSTREAM_ERROR", "gone");
  check(died.status === "failed", "a failure marks the turn failed");
  check(died.paragraphs.length === 1, "and keeps the prose that already arrived");
  check(died.error?.retryable === true, "an upstream error offers a retry");
}

// ------------------------------------------------------------------- copy
console.log("\nevery failure has copy, and the right offer");
{
  const codes: InsightsErrorCode[] = [
    "DISABLED",
    "VALIDATION_ERROR",
    "RATE_LIMITED",
    "CAPTCHA_REQUIRED",
    "CAPTCHA_FAILED",
    "DAILY_CEILING",
    "TIMEOUT",
    "UPSTREAM_BUSY",
    "UPSTREAM_ERROR",
    "EMPTY_ANSWER",
    "INTERNAL_ERROR",
  ];
  const missing = codes.filter((c) => !ERROR_COPY[c] || ERROR_COPY[c].length < 20);
  check(missing.length === 0, "all eleven codes have reader-facing copy", missing.join(", "));
  const generic = codes.filter((c) => /error occurred|something went wrong/i.test(ERROR_COPY[c]));
  check(generic.length === 0, "and none of it is a generic failure message", generic.join(", "));

  // Retrying a spend ceiling or a rate limit is useless, and retrying a failed
  // captcha needs a reload rather than a button.
  const noRetry: InsightsErrorCode[] = ["RATE_LIMITED", "DAILY_CEILING", "CAPTCHA_FAILED", "DISABLED"];
  const wrong = noRetry.filter((c) => failTurn(newAssistantTurn("x"), c, "m").error?.retryable);
  check(wrong.length === 0, "the four that cannot be retried offer no retry", wrong.join(", "));
  const shouldRetry: InsightsErrorCode[] = ["TIMEOUT", "UPSTREAM_BUSY", "UPSTREAM_ERROR", "EMPTY_ANSWER"];
  const notOffered = shouldRetry.filter((c) => !failTurn(newAssistantTurn("x"), c, "m").error?.retryable);
  check(notOffered.length === 0, "and the four that can, do", notOffered.join(", "));
}

// ----------------------------------------------------------------- history
console.log("\nwhat a follow-up sends");
{
  const answered = (id: string, text: string) => {
    let t = newAssistantTurn(id);
    t = applyEvent(t, { type: "text", text, general: false });
    return applyEvent(t, {
      type: "done",
      provenance: "corpus",
      repairs: { citationsCorrected: 0, quotationsDemoted: 0, dashesNormalized: 0 },
      usage: { input: 1, output: 1, cacheRead: 1, cacheWrite: 0 },
    });
  };

  const turns: Turn[] = [
    { role: "reader", id: "q1", text: "First question" },
    answered("a1", "First answer. "),
    { role: "reader", id: "q2", text: "Second question" },
    failTurn(newAssistantTurn("a2"), "TIMEOUT", "stopped"),
  ];
  const history = historyFor(turns);
  check(history.length === 2, "a failed pair is left out entirely", `got ${history.length}`);
  check(history[0].role === "user" && history[1].role === "assistant", "and the roles alternate");
  check(history[0].content === "First question", "the reader's words are sent as written");
  check(history[1].content === "First answer.", "and the answer's prose without its markers");

  const empty = historyFor([{ role: "reader", id: "q1", text: "Only a question" }]);
  check(empty.length === 0, "a first question sends no history, which is what gates the captcha");

  check(turnText(answered("a3", "Some prose.\n\n")) === "Some prose.", "turnText trims the trailing break");
}

// ------------------------------------------------------- what is on first paint
if (base) {
  console.log(`\nfirst paint, against ${base}`);
  const slug = argv[argv.indexOf("--slug") + 1] ?? "the-20b-blind-spot-in-legal-operations";
  const res = await fetch(`${base}/why-spaarke/${slug}`);
  check(res.ok, `the article renders`, `${res.status}`);
  const html = await res.text();

  check(html.includes("Ask about this piece"), "the entry card is in the rail");
  check(
    html.includes("Not legal advice") || html.includes("Not legal\nadvice"),
    "the disclaimer is present before any answer",
    "FR-10",
  );
  check(
    html.includes("Put a question to the whole library"),
    "the card says the question reaches the library rather than the page",
  );

  const summarize = html.indexOf("Summarize this article");
  check(summarize !== -1, "the summarize option is offered");

  // FR-04: three extending questions, and summarize is never first.
  const buttons = [...html.matchAll(/<button[^>]*>([^<]{12,200})<\/button>/g)].map((m) => m[1].trim());
  const offered = buttons.filter((b) => b.endsWith("?") || b.startsWith("Summarize this article"));
  check(offered.length >= 4, "four options are rendered", `found ${offered.length}: ${offered.length ? offered[0].slice(0, 40) : ""}`);
  check(
    offered.length > 0 && !offered[0].startsWith("Summarize"),
    "and summarize is not the first of them",
    offered[0]?.slice(0, 40) ?? "",
  );
  check(
    offered.filter((b) => b.startsWith("Summarize")).length === 1 &&
      offered[offered.length - 1].startsWith("Summarize"),
    "it is last",
  );

  // The manifest is 500 kB and has no business in the page.
  // `keyTakeaways` is a blog frontmatter field and legitimately on the page, so the
  // manifest's own field name is what to look for here. The build-time grep over
  // .next/static/chunks is the other half of this check.
  check(!html.includes("suggestedQuestions"), "the corpus manifest did not travel with the page");

  // ------------------------------------------------------- a real turn, and its links
  if (argv.includes("--live")) {
    console.log("\none real turn through the client, and where its chips go");

    // `poll-client` posts to relative paths, because in a browser that is correct.
    const real = globalThis.fetch;
    globalThis.fetch = ((input: string | URL | Request, init?: RequestInit) => {
      const url = String(typeof input === "string" ? input : input instanceof URL ? input.href : input.url);
      return real(url.startsWith("/") ? base + url : url, init);
    }) as typeof fetch;

    const { askInsights } = await import("@/lib/insights/poll-client");
    const events: InsightsEvent[] = [];
    let turn = newAssistantTurn("live");
    const outcome = await askInsights({
      question:
        argv[argv.indexOf("--question") + 1] && argv.includes("--question")
          ? argv[argv.indexOf("--question") + 1]
          : "How does an ontology change what a legal operations team can ask?",
      articleSlug: slug,
      history: [],
      sessionId: "consolechecksession",
      onEvent: (e) => {
        events.push(e);
        turn = applyEvent(turn, e);
      },
    });
    globalThis.fetch = real;

    check(outcome.status === "answered", "the turn answered", JSON.stringify(outcome).slice(0, 120));
    check(turn.paragraphs.length > 0, "prose arrived", `${turn.paragraphs.length} paragraph(s)`);
    check(turn.provenance !== null, "and it is labeled", turn.provenance ?? "none");
    // Citations are required of an answer that rests on the articles and wrong for
    // one that does not. A question the library does not cover has nothing to link,
    // and inventing a chip for it would be the failure rather than the fix.
    if (turn.provenance === "corpus" || turn.provenance === "mixed") {
      check(turn.citations.length > 0, "an answer from the articles carries citations", `${turn.citations.length}`);
    } else {
      check(
        turn.citations.length === 0,
        "an answer from outside the articles cites nothing",
        `${turn.citations.length}`,
      );
    }

    const words = turnText(turn).split(/\s+/).length;
    check(words <= 280, "the answer is the length the instructions ask for", `${words} words`);

    // An answer resting on outside knowledge has to be marked, because the labeling
    // is the whole of what stands in for a refusal. Only asserted when the answer
    // says it went outside, since a corpus answer correctly marks nothing.
    if (turn.provenance === "general" || turn.provenance === "mixed") {
      const marked = turn.paragraphs.some((pp) => pp.runs.some((r) => r.general));
      check(marked, "a general or mixed answer carries marked passages", turn.provenance);
    } else {
      console.log(`  note  provenance was ${turn.provenance}, so there is nothing to mark`);
    }

    // The chips are the product's claim. A chip that looks right and lands
    // nowhere is worse than no chip, so every href is fetched and its anchor
    // looked for in the rendered page rather than in the manifest that produced it.
    const pages = new Map<string, string>();
    for (const c of turn.citations) {
      const [path, anchor] = c.href.split("#");
      if (!pages.has(path)) {
        const page = await fetch(`${base}${path}`);
        pages.set(path, page.ok ? await page.text() : "");
      }
      const body = pages.get(path) ?? "";
      if (body.length === 0) {
        check(false, `chip page loads: ${path}`);
        continue;
      }
      if (!anchor) {
        check(true, `chip lands: ${path}`, "whole article");
        continue;
      }
      check(
        body.includes(`id="${anchor}"`),
        `chip lands: ${path}#${anchor}`,
        body.includes(`id="${anchor}"`) ? "" : "the anchor is not on the rendered page",
      );
    }
  }
}

console.log(failures === 0 ? "\nall checks passed." : `\n${failures} check(s) failed.`);
if (failures > 0) process.exit(1);
