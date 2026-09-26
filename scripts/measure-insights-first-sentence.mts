// Time to first visible sentence, measured rather than assumed.
//
// Task 023. The number this task exists to improve is how long a reader stares at
// a blank panel. The POST cannot answer it on Azure Static Web Apps, because the
// platform holds the whole response until the handler finishes, so the poll route
// is the thing under test: it is an ordinary short request, complete before it is
// sent, and therefore unaffected by the buffering that defeats the stream.
//
// This asks one real question and reports two numbers: when the poller saw the
// first sentence, and when the POST delivered anything at all. The gap between
// them is what the reader gains.
//
//   npx tsx scripts/measure-insights-first-sentence.mts
//   npx tsx scripts/measure-insights-first-sentence.mts --base https://spaarke.com
//
// Costs one warm turn, about $0.04. Needs INSIGHTS_ENABLED=true and a storage
// connection on whichever server is being measured. Against a local server it
// also needs the session pre-verified, which it does itself when given the same
// connection string and counter table the server is using.

import { existsSync, readFileSync } from "node:fs";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = /^([A-Z_]+)=(.*)$/.exec(line.trim());
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const argv = process.argv.slice(2);
const flag = (name: string) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? null : argv[i + 1];
};
const base = flag("base") ?? "http://localhost:3000";
const question = flag("question") ?? "What is the difference between spend analytics and legal operations intelligence?";
const slug = flag("slug") ?? null;

const session = `measure${Date.now().toString(36)}`.slice(0, 24);
const requestId = `measure${Date.now().toString(36)}aaaaaaaaaa`.slice(0, 32);

// The captcha gates the first question of a session, and a script has no captcha
// token. Marking the session verified is the same thing the guard does after a
// passing check, so the measurement exercises the real path with the one step a
// browser performs stood in for.
if (process.env.STORAGE_ACCOUNT_CONNECTION) {
  const { markSessionVerified } = await import("@/lib/insights/rate-limit-durable");
  await markSessionVerified(session);
  console.log(`session ${session} marked verified in ${process.env.INSIGHTS_COUNTER_TABLE ?? "InsightsCounters"}`);
} else {
  console.log("no STORAGE_ACCOUNT_CONNECTION here, so the server had better not need a verified session");
}

const started = Date.now();
const since = () => `${((Date.now() - started) / 1000).toFixed(2)}s`;

let firstPolledSentence: number | null = null;
let firstPolledEvent: number | null = null;
let polledSentences = 0;
let pollCount = 0;
let pollComplete = false;

let firstPostByte: number | null = null;
let postEvents = 0;

async function pollLoop() {
  let cursor = 0;
  await new Promise((r) => setTimeout(r, 700));
  while (!pollComplete && Date.now() - started < 150_000) {
    pollCount += 1;
    const res = await fetch(
      `${base}/api/article-insights/partial?id=${requestId}&session=${session}&after=${cursor}`,
      { cache: "no-store" },
    );
    if (!res.ok) {
      console.log(`  poll ${pollCount} refused with ${res.status} at ${since()}`);
      return;
    }
    const body = (await res.json()) as {
      events?: Array<{ type: string }>;
      cursor?: number;
      complete?: boolean;
      available?: boolean;
    };
    if (body.available === false) {
      console.log(`  the server writes no partials, so there is nothing to measure (${since()})`);
      return;
    }
    for (const event of body.events ?? []) {
      firstPolledEvent ??= Date.now() - started;
      if (event.type === "text") {
        polledSentences += 1;
        if (firstPolledSentence === null) {
          firstPolledSentence = Date.now() - started;
          console.log(`  first sentence from the poller at ${since()}`);
        }
      }
    }
    cursor = body.cursor ?? cursor;
    if (body.complete) {
      pollComplete = true;
      console.log(`  poller saw the answer complete at ${since()}, after ${pollCount} poll(s)`);
      return;
    }
    await new Promise((r) => setTimeout(r, 400));
  }
}

async function postRequest() {
  const res = await fetch(`${base}/api/article-insights`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question,
      articleSlug: slug,
      sessionId: session,
      requestId,
      // A second turn, because the first is the one the captcha gates and a script
      // cannot pass it. The prompt and the partial path are identical either way.
      history: [
        { role: "user", content: "What does this article cover?" },
        { role: "assistant", content: "It covers the difference between reporting on spend and reasoning about it." },
      ],
    }),
  });

  console.log(
    `  POST responded ${res.status} at ${since()}, ` +
      `${res.headers.get("transfer-encoding") === "chunked" ? "chunked" : `content-length ${res.headers.get("content-length") ?? "unknown"}`}`,
  );

  if (!res.ok) {
    console.log(`  body: ${(await res.text()).slice(0, 300)}`);
    return;
  }

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (value) {
      firstPostByte ??= Date.now() - started;
      buffer += decoder.decode(value, { stream: true });
    }
    let cut = buffer.indexOf("\n");
    while (cut !== -1) {
      if (buffer.slice(0, cut).trim().length > 0) postEvents += 1;
      buffer = buffer.slice(cut + 1);
      cut = buffer.indexOf("\n");
    }
    if (done) break;
  }
  console.log(`  POST finished at ${since()} with ${postEvents} event(s)`);
}

console.log(`\nmeasuring against ${base}`);
console.log(`question: ${question}\n`);

await Promise.all([pollLoop(), postRequest()]);

const ms = (v: number | null) => (v === null ? "never" : `${(v / 1000).toFixed(2)}s`);
console.log("\n--- result ---");
console.log(`first event from the poller      ${ms(firstPolledEvent)}`);
console.log(`first sentence from the poller   ${ms(firstPolledSentence)}`);
console.log(`sentences delivered by polling   ${polledSentences}`);
console.log(`first byte from the POST         ${ms(firstPostByte)}`);
console.log(`polls made                       ${pollCount}`);

if (firstPolledSentence !== null && firstPostByte !== null) {
  const gain = (firstPostByte - firstPolledSentence) / 1000;
  console.log(
    `\nThe reader sees prose ${gain.toFixed(2)}s before the POST delivers anything. ` +
      "On Azure Static Web Apps the POST figure is the whole answer time, because the platform sends nothing until the handler finishes.",
  );
}
