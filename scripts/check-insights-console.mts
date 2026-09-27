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
  groupExchanges,
  historyFor,
  newAssistantTurn,
  paragraphIsGeneral,
  PROVENANCE_LABEL,
  turnText,
} = await import("@/components/ArticleInsights/transcript");
const { libraryOptions, validateQuestion } = await import("@/lib/insights/questions");

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

// ------------------------------------------------- questions and their answers
console.log("\nthe question and its answer are one unit");
{
  // The console pins the current question to the top of the pane and lets the
  // answer fill below it, so the thing that gets measured and scrolled to is the
  // pair. A mis-grouping here puts the wrong question above an answer, which is
  // worse than any scrolling bug.
  const answered = (id: string) =>
    applyEvent(newAssistantTurn(id), { type: "text", text: "An answer. ", general: false });

  const grouped = groupExchanges([
    { role: "reader", id: "q1", text: "First" },
    answered("a1"),
    { role: "reader", id: "q2", text: "Second" },
    answered("a2"),
  ]);
  check(grouped.length === 2, "two questions make two exchanges", `got ${grouped.length}`);
  check(
    grouped[0].reader?.text === "First" && grouped[0].assistant?.id === "a1",
    "each answer stays with the question that asked it",
  );

  // The state between asking and the first sentence arriving, which is two to
  // three seconds and is what the reader looks at most often.
  const pending = groupExchanges([
    { role: "reader", id: "q1", text: "First" },
    answered("a1"),
    { role: "reader", id: "q2", text: "Second" },
  ]);
  check(pending.length === 2, "a question with no answer yet is still an exchange");
  check(pending[1].assistant === null, "with nothing in its answer half");

  check(groupExchanges([]).length === 0, "an empty transcript has no exchanges");
}

// ------------------------------------------------------------ the library entry
console.log("\nthe library surface");
{
  const options = libraryOptions();
  check(options.length >= 6, "the library has six questions, so three can rotate", `${options.length}`);
  const bad = options.flatMap((o) => validateQuestion(o.text).map((p) => `${o.text}: ${p}`));
  check(bad.length === 0, "held to the same bar as the generated ones", bad.join(" | "));
  check(
    options.every((o) => o.kind === "question"),
    "and no summarize option, which for the whole library is the page itself",
  );
  // The surface exists because a question can reach every article at once, so an
  // entry question only one article answers would waste it.
  check(
    options.some((o) => /articles|department|legal operations/i.test(o.text)),
    "the questions reach across the corpus rather than into one piece",
  );
}

// ---------------------------------------------------- one console, three frames
console.log("\nthe surfaces share a console rather than forking it");
{
  // Source-level assertions, which are usually a weak kind of test and are the
  // right kind here. The failure this guards against is not a wrong value at
  // runtime, it is somebody answering a mobile bug by copying the panel. Task 031
  // says it in as many words: two implementations diverge, and the mobile one
  // always falls behind.
  const { readFileSync } = await import("node:fs");
  const read = (f: string) => readFileSync(`src/components/ArticleInsights/${f}`, "utf8");
  const panel = read("InsightsPanel.tsx");
  const sheet = read("MobileSheet.tsx");
  const body = read("ConsoleBody.tsx");
  const button = read("FloatingButton.tsx");

  check(panel.includes("<ConsoleBody"), "the desktop panel renders the shared console");
  check(sheet.includes("<ConsoleBody"), "the mobile sheet renders the same one");
  check(body.includes("<Disclaimer"), "the disclaimer is in the shared console, so both carry it");
  check(body.includes("options.map"), "and so is the entry card");

  // A sheet sized in `vh` keeps its height when the on-screen keyboard opens, so
  // the composer ends up underneath it and the reader types blind. This is the
  // detail the task says gets missed.
  check(sheet.includes("dvh"), "the sheet is sized in dvh, so the keyboard shrinks it");
  check(!/max-h-\[\d+vh\]/.test(sheet), "and not in vh, which the keyboard does not affect");

  // The sheet traps focus and the panel does not, and that difference is
  // deliberate rather than an oversight in one of them.
  check(sheet.includes('aria-modal="true"'), "the sheet is a modal dialog");
  check(sheet.includes('e.key !== "Tab"') || sheet.includes('"Tab"'), "and traps Tab inside itself");
  // The attribute, not the word: the panel's comment explains at length why it is
  // not a modal, and matching that would pass for the wrong reason.
  check(!panel.includes("aria-modal="), "the panel is not a modal, so the article stays reachable");

  check(sheet.includes('e.key === "Escape"'), "escape closes the sheet");
  check(sheet.includes("onClick={close}"), "and so does a tap on the backdrop");
  check(sheet.includes('document.body.style.overflow = "hidden"'), "the article cannot scroll behind it");

  check(button.includes("lg:hidden"), "the floating button is hidden where the rail exists");
  check(panel.includes("lg:flex"), "and the panel is shown only where it does");
  check(button.includes("fixed bottom-") && button.includes("right-"), "the button is fixed bottom right");
  check(button.includes("safe-area-inset-bottom"), "and clear of the home indicator");

  // Following a citation used to navigate away, which cost the reader the
  // conversation they were in the middle of.
  const reader = read("ArticleReader.tsx");
  const chip = read("CitationChip.tsx");

  check(chip.includes("openReader("), "a citation opens the article beside the console");
  check(chip.includes("href={citation.href}"), "and the chip is still a real link");
  check(
    chip.includes("event.metaKey") && chip.includes("event.ctrlKey"),
    "so a modified click still opens a tab",
  );
  check(chip.includes("READER_MIN_WIDTH"), "the reader is desktop only");
  // The two kinds of citation do two different things, so they cannot look the
  // same. One scrolls the page the reader is on; the other opens an article they
  // have not seen and, until this was split, did not even name.
  const answer = read("AnswerBody.tsx");
  check(chip.includes("function InPageChip"), "a citation into this page is its own kind of chip");
  check(chip.includes("function OtherArticleChip"), "and a citation elsewhere is another");
  check(
    !chip.slice(chip.indexOf("function InPageChip")).split("function OtherArticleChip")[0].includes("openReader("),
    "the in-page chip cannot reach the reader",
  );
  check(
    chip.includes("citation.title") &&
      chip.indexOf("citation.title") < chip.indexOf("citation.heading.length > 0 && ("),
    "the other-article chip leads with the article's title",
    "which is the thing the reader cannot guess",
  );
  check(chip.includes("OpensIcon"), "and carries a mark saying it opens something");
  check(
    answer.includes("In this article") && answer.includes("From other articles"),
    "the two kinds are labelled when both are present",
  );
  check(answer.includes("bothKinds"), "and unlabelled when there is nothing to tell apart");

  check(
    reader.includes("data-article-full"),
    "the reader lifts the whole article out of the rendered page",
    "rather than running a second markdown pipeline that could drift",
  );
  check(
    !reader.includes("Open the full article"),
    "and offers no link out, because the whole article is already here",
  );
  check(reader.includes("scrollbar-width:none"), "with the scrollbar hidden");
  check(
    chip.includes("pinInPage"),
    "a citation into the article on screen scrolls the page and marks the heading",
    "rather than opening a copy of the page over itself",
  );
  check(reader.includes("DOMParser"), "parsed inert, so nothing in the fetched page runs");
  check(!reader.includes("aria-modal"), "and it is not a modal, so the conversation stays usable");
  check(
    panel.includes("reader === null"),
    "escape closes the reader before the console",
    "one press must not close both",
  );

  // Every surface is fixed-position but still inherits its colour tokens from
  // whatever it is mounted inside. On the library page that is outside the light
  // slab, so the console came out dark against a light page. Carrying the tone
  // makes a surface look the same wherever it is mounted.
  const sheet2 = read("MobileSheet.tsx");
  check(panel.includes('data-tone="light"'), "the panel carries its own light tone");
  check(sheet2.includes('data-tone="light"'), "so does the sheet");
  check(reader.includes('data-tone="light"'), "and so does the reader");

  // Prose at the full width of a wide screen is about a hundred and forty
  // characters a line, which is not a reading surface.
  check(!reader.includes("absolute inset-4"), "the reader is a column rather than a window");
  check(/w-\[min\(\d+px/.test(reader), "with a bounded width");

  // `offsetTop` is relative to the nearest positioned ancestor, which is the card
  // rather than the scroller, so it landed a header's height out.
  check(
    reader.includes("getBoundingClientRect") && !reader.includes("target.offsetTop"),
    "and lands on the cited heading, measured against the scroller",
  );

  // The entry point sits in a row of filter controls. Matched to them it
  // disappeared into the row, which is the wrong place for the one control here
  // that does something the reader has not seen before.
  const libraryButton = read("LibraryAskButton.tsx");
  check(libraryButton.includes("bg-fg text-bg"), "the library entry is dark against a light row");
  check(libraryButton.includes("shadow-md"), "and raised off it");
  for (const token of ["px-3", "py-2.5", "text-sm"]) {
    check(libraryButton.includes(token), `while still lining up with the filters on ${token}`);
  }

  const librarySection = read("../sections/WhySpaarkeLibrary.tsx");
  check(
    librarySection.indexOf("<LibraryAskButton />") > librarySection.lastIndexOf("label=\"Audience\""),
    "and sits last in the row rather than first",
  );

  // Always the same three read as a fixed menu. Six are generated and three are
  // drawn each load, with the first render deliberately not random so it matches
  // what the server sent.
  const provider = read("InsightsProvider.tsx");
  check(provider.includes("pickQuestions"), "the entry questions rotate");
  check(
    provider.includes("pickQuestions(options, false)"),
    "with a first render that is not random, so hydration matches",
  );
  check(
    provider.includes("...chosen.slice(0, VISIBLE_QUESTIONS), ...rest"),
    "and summarize still last, which is what FR-04 asks for",
  );

  // A hardcoded offset put the panel's close button under the site header on a
  // viewport where that header came out taller.
  const chrome = read("chrome.tsx");
  check(chrome.includes("useSurfaceTop"), "the surfaces measure the site header");
  check(chrome.includes("ResizeObserver"), "and re-measure when it changes");
  check(!panel.includes("top: 100"), "rather than assuming a height");
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

  // FR-12. The mobile entry point has to be in the page rather than appearing
  // after some interaction, since it is the only way in below the rail breakpoint.
  check(
    html.includes("Ask about this") && html.includes("aria-haspopup=\"dialog\""),
    "the mobile entry point is in the first paint",
  );

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

      // The reader lifts `[data-article-body]` out of this page, so an anchor that
      // exists on the page but outside that element would scroll to nothing.
      // Position is the cheap way to tell the two apart without a DOM.
      const bodyStart = body.indexOf("data-article-full");
      check(bodyStart !== -1, `article hook present: ${path}`);

      if (!anchor) {
        check(true, `chip lands: ${path}`, "whole article");
        continue;
      }
      const at = body.indexOf(`id="${anchor}"`);
      check(at !== -1, `chip lands: ${path}#${anchor}`, at === -1 ? "not on the rendered page" : "");
      check(
        at > bodyStart,
        `and inside the article body: #${anchor}`,
        at > bodyStart ? "" : "the reader would scroll to nothing",
      );
    }
  }
}

// ------------------------------------------------------------- the library page
if (base) {
  console.log("\nthe library page");
  const res = await fetch(`${base}/why-spaarke`);
  check(res.ok, "the library renders", `${res.status}`);
  const html = await res.text();

  check(html.includes("Ask these articles a question"), "the assistant is in the filter bar");
  // The owner's call: keyword search over twenty-four articles matches titles and
  // excerpts, and a question reaches the whole corpus and cites the piece that
  // answers it. The search box is still in the component and renders when the
  // assistant is switched off, so this is a swap rather than a deletion.
  check(
    !html.includes('placeholder="Search all resources"'),
    "and has taken the search box's place rather than sitting beside it",
  );
  check(html.includes("Content Type") && html.includes("Topic"), "the filters are untouched");
  check(html.includes("Ask the library"), "the panel heading says library rather than piece");

  // Counted as rendered buttons rather than as strings in the page. All six
  // travel in the payload, because the client needs them to rotate; only three
  // are rendered, and that is the thing worth asserting.
  const rendered = [...html.matchAll(/<button[^>]*>([^<]{12,200})<\/button>/g)]
    .map((m) => m[1].trim())
    .filter((text) => libraryOptions().some((o) => o.text === text));
  check(
    rendered.length === 3,
    "three of the library's six questions are rendered",
    `${rendered.length}`,
  );
}

console.log(failures === 0 ? "\nall checks passed." : `\n${failures} check(s) failed.`);
if (failures > 0) process.exit(1);
