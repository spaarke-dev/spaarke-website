// Offline checks for Text MEET (projects/text-to-meet/spec.md): the Twilio
// signature check, keyword handling, the SMS link token, the phone hash, the
// settings, and the reply texts (length and GSM-7).
//
//   npm run sms:check
//
// Needs no network, storage, or real secrets: every key here is a fixed test
// value. Reads SITE_URL from the environment or .env.local. Prints no secrets.
// Exits 1 when any case fails.

import { existsSync, readFileSync } from "node:fs";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const m = /^([A-Z_]+)=(.*)$/.exec(line.trim());
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

// The library modules compile as CommonJS under tsx, so named imports are
// taken from dynamic imports, as the other check scripts do.
const { computeSignature, isValidSignature, parseFormBody } = await import("@/lib/sms/twilio-signature");
const { classify } = await import("@/lib/sms/keywords");
const { createManageToken, verifyManageToken, createSmsToken, verifySmsToken, newConversationId, SMS_TOKEN_LENGTH } =
  await import("@/lib/meet/tokens");
const { normalizeE164, phoneHash } = await import("@/lib/sms/phone-hash");
const { getSmsConfig, resolvePlacement, placementLabel, NO_PLACEMENT } = await import("@/lib/sms/config");
const { meetReply, HELP_REPLY, NUDGE_REPLY } = await import("@/lib/sms/messages");
const { siteUrl } = await import("@/lib/ask-ai");

let passed = 0;
const failures: string[] = [];

function check(name: string, ok: boolean, detail?: string) {
  if (ok) {
    passed++;
  } else {
    failures.push(name);
    console.log(`FAIL ${name}${detail ? ` (${detail})` : ""}`);
  }
}

function section(title: string) {
  console.log(`\n${title}`);
}

// ---------------------------------------------------------------------------
section("Signature");

// Twilio's documented example (https://www.twilio.com/docs/usage/webhooks/webhooks-security).
// The page gives the URL and parameters but no auth token; with the token
// "12345", Twilio's own library (twilio@5.4.0, getExpectedTwilioSignature)
// gives the value below.
const DOC_URL = "https://mycompany.com/myapp";
const DOC_PARAMS: [string, string][] = [
  ["CallSid", "CA1234567890ABCDE"],
  ["Caller", "+12349013030"],
  ["Digits", "1234"],
  ["From", "+12349013030"],
  ["To", "+18005551212"],
];
const DOC_TOKEN = "12345";
const DOC_SIGNATURE = "3KI2uRuYyAdhZIJXcpU0izDUzWI=";

check("docs example matches Twilio's library", computeSignature(DOC_TOKEN, DOC_URL, DOC_PARAMS) === DOC_SIGNATURE);
check("docs example passes", isValidSignature(DOC_SIGNATURE, DOC_URL, DOC_PARAMS, [DOC_TOKEN]));
check(
  "parameter order does not matter",
  isValidSignature(DOC_SIGNATURE, DOC_URL, [...DOC_PARAMS].reverse(), [DOC_TOKEN]),
);
check(
  "changed parameter fails",
  !isValidSignature(
    DOC_SIGNATURE,
    DOC_URL,
    DOC_PARAMS.map(([k, v]) => [k, k === "Digits" ? "1235" : v] as [string, string]),
    [DOC_TOKEN],
  ),
);
check(
  "added parameter fails",
  !isValidSignature(DOC_SIGNATURE, DOC_URL, [...DOC_PARAMS, ["Body", "MEET"]], [DOC_TOKEN]),
);
check("changed URL fails", !isValidSignature(DOC_SIGNATURE, "https://mycompany.com/myapp2", DOC_PARAMS, [DOC_TOKEN]));
check("internal host URL fails", !isValidSignature(DOC_SIGNATURE, "http://localhost:8080/myapp", DOC_PARAMS, [DOC_TOKEN]));
check("wrong token fails", !isValidSignature(DOC_SIGNATURE, DOC_URL, DOC_PARAMS, ["54321"]));
check("previous token accepted", isValidSignature(DOC_SIGNATURE, DOC_URL, DOC_PARAMS, ["54321", DOC_TOKEN]));
check("empty token list fails", !isValidSignature(DOC_SIGNATURE, DOC_URL, DOC_PARAMS, []));
check("missing header fails", !isValidSignature(null, DOC_URL, DOC_PARAMS, [DOC_TOKEN]));
check("overlong header fails", !isValidSignature("A".repeat(101), DOC_URL, DOC_PARAMS, [DOC_TOKEN]));

const body = "ToCountry=US&Body=Meet+card2%21&From=%2B12025550199&To=%2B18005550100&MessageSid=SM00000000000000000000000000000000";
const form = parseFormBody(body);
check("form body decoded", form.some(([k, v]) => k === "Body" && v === "Meet card2!") && form.some(([k, v]) => k === "From" && v === "+12025550199"));
const sigForm = computeSignature(DOC_TOKEN, "https://example.test/api/sms/inbound", form);
check("form body round trip", isValidSignature(sigForm, "https://example.test/api/sms/inbound", parseFormBody(body), [DOC_TOKEN]));
check("repeated names kept", parseFormBody("a=1&a=2").length === 2);

// ---------------------------------------------------------------------------
section("Keywords");

const expect = (text: string, kind: string, code?: string, optOutType?: string) => {
  const r = classify(text, optOutType);
  const label = `${JSON.stringify(text)}${optOutType ? ` OptOutType=${optOutType}` : ""} -> ${kind}${code ? ` ${code}` : ""}`;
  check(label, r.kind === kind && r.code === code, `got ${r.kind}${r.code ? ` ${r.code}` : ""}`);
};

expect("meet", "meet");
expect(" Meet! ", "meet");
expect("MEET", "meet");
expect("meet.", "meet");
expect("MEET card2", "meet", "CARD2");
expect("meet, sig", "meet", "SIG");
expect("MEET unknowncode", "meet", "UNKNOWNCODE");
expect("MEET thisistoolongacode", "meet");
expect("meeting", "other");
expect("Let's meet", "other");
for (const w of ["STOP", "stop", "Stop.", "STOPALL", "UNSUBSCRIBE", "CANCEL", "END", "REVOKE", "OPTOUT", "QUIT"]) {
  expect(w, "stop");
}
expect("please stop texting me", "stop");
expect("Don't text me again", "stop");
expect("Don’t text me", "stop");
expect("do not text this number", "stop");
expect("remove me from this list", "stop");
expect("MEET stop", "stop");
expect("Can we meet at the end of the week", "stop"); // stop wins (FR-08), flagged for counsel
for (const w of ["START", "start", "UNSTOP"]) expect(w, "start");
for (const w of ["HELP", "help?", "INFO"]) expect(w, "help");
expect("", "other");
expect("   ", "other");
expect("hello", "other");
expect("😀", "other");
expect("ｍｅｅｔ", "meet"); // full-width letters, NFKC
expect("MEET", "stop", undefined, "STOP");
expect("anything", "start", undefined, "START");
expect("info please", "help", undefined, "HELP");
expect("MEET", "meet", undefined, "");

// classify() uppercases the code, so resolvePlacement sees CARD2, never card2.
check("placement CARD2 known", resolvePlacement("CARD2") === "CARD2" && placementLabel("CARD2") !== NO_PLACEMENT);
check("placement SIG known", resolvePlacement(classify("meet sig").code) === "SIG");
check("placement unknown ignored", resolvePlacement("ZZZ") === NO_PLACEMENT);
check("placement missing", resolvePlacement(undefined) === NO_PLACEMENT);

// ---------------------------------------------------------------------------
section("SMS link token");

const SECRET = "test-link-secret-0123456789abcdef-0123";
const OTHER = "other-link-secret-0123456789abcdef-012";
const now = Date.UTC(2026, 10, 21, 12);
const day = 86_400_000;
const id = newConversationId();
const token = createSmsToken(id, SECRET, now);
const [tId, tExp, tSig] = token.split(".");
const swap = (c: string) => (c === "A" ? "B" : "A");

check("conversation ID is 12 base64url characters", /^[A-Za-z0-9_-]{12}$/.test(id));
check("conversation IDs differ", newConversationId() !== newConversationId());
check("token is 42 characters", token.length === 42 && SMS_TOKEN_LENGTH === 42, `got ${token.length}`);
{
  const r = verifySmsToken(token, SECRET, now);
  check("round trip", r.ok && r.conversationId === id);
}
check("wrong secret", !verifySmsToken(token, OTHER, now).ok);
check("tampered signature", !verifySmsToken(`${tId}.${tExp}.${swap(tSig[0])}${tSig.slice(1)}`, SECRET, now).ok);
check("tampered ID", !verifySmsToken(`${swap(tId[0])}${tId.slice(1)}.${tExp}.${tSig}`, SECRET, now).ok);
check(
  "extended expiry",
  !verifySmsToken(`${tId}.${(Number.parseInt(tExp, 36) + 86_400).toString(36)}.${tSig}`, SECRET, now).ok,
);
check("valid at 29 days", verifySmsToken(token, SECRET, now + 29 * day).ok);
{
  const r = verifySmsToken(token, SECRET, now + 31 * day);
  check("expired at 31 days", !r.ok && r.reason === "expired");
}
const manage = createManageToken(`${now}-0123abcd`, SECRET, now);
check("manage token is not an SMS token", !verifySmsToken(manage, SECRET, now).ok);
check("SMS token is not a manage token", !verifyManageToken(token, SECRET, now).ok);
check("empty token", !verifySmsToken("", SECRET, now).ok);
check("junk token", !verifySmsToken("x".repeat(42), SECRET, now).ok);

// ---------------------------------------------------------------------------
section("Phone hash and settings");

const HASH_SECRET = "test-hash-secret-0123456789abcdef-0123";
const TEST_NUMBER = "+12025550199"; // reserved fictional range
check("E.164 accepted", normalizeE164(TEST_NUMBER) === TEST_NUMBER && normalizeE164(` ${TEST_NUMBER} `) === TEST_NUMBER);
check(
  "other formats refused",
  ["2025550199", "12025550199", "+1 202 555 0199", "+442071234567", "", null, undefined].every(
    (v) => normalizeE164(v) === null,
  ),
);
const hash = phoneHash(TEST_NUMBER, HASH_SECRET);
check("hash is 32 hex characters", /^[0-9a-f]{32}$/.test(hash));
check("hash is stable", hash === phoneHash(TEST_NUMBER, HASH_SECRET));
check("hash is keyed", hash !== phoneHash(TEST_NUMBER, OTHER));
check("hash hides the number", !hash.includes("5550199") && !hash.includes("2025550"));

const SMS_ENV = [
  "SMS_MODE",
  "TWILIO_ACCOUNT_SID",
  "TWILIO_AUTH_TOKEN",
  "TWILIO_AUTH_TOKEN_PREVIOUS",
  "SMS_WEBHOOK_URL",
  "SMS_PUBLIC_NUMBER",
  "SMS_LINK_SECRET",
  "SMS_PHONE_HASH_SECRET",
  "SMS_REPLY_HOURLY_CAP",
  "SMS_REPLY_DAILY_CAP",
] as const;
const savedEnv = Object.fromEntries(SMS_ENV.map((k) => [k, process.env[k]]));
const quiet = console.warn;
console.warn = () => {}; // config logs missing names; expected here
try {
  for (const k of SMS_ENV) delete process.env[k];
  check("settings off when SMS_MODE is unset", getSmsConfig() === null);
  Object.assign(process.env, {
    SMS_MODE: "twilio",
    TWILIO_ACCOUNT_SID: "AC_test",
    TWILIO_AUTH_TOKEN: DOC_TOKEN,
    SMS_WEBHOOK_URL: "https://example.test/api/sms/inbound",
    SMS_PUBLIC_NUMBER: "+18005550100",
    SMS_LINK_SECRET: SECRET,
    SMS_PHONE_HASH_SECRET: HASH_SECRET,
  });
  const cfg = getSmsConfig();
  check("settings on when complete", cfg !== null && cfg.authTokens.length === 1);
  process.env.TWILIO_AUTH_TOKEN_PREVIOUS = "54321";
  check("previous token included", getSmsConfig()?.authTokens.length === 2);
  process.env.SMS_LINK_SECRET = "short";
  check("short secret turns it off", getSmsConfig() === null);
  process.env.SMS_LINK_SECRET = SECRET;
  process.env.SMS_WEBHOOK_URL = "http://example.test/api/sms/inbound";
  check("plain http webhook URL turns it off", getSmsConfig() === null);
} finally {
  console.warn = quiet;
  for (const k of SMS_ENV) {
    if (savedEnv[k] === undefined) delete process.env[k];
    else process.env[k] = savedEnv[k];
  }
}

// ---------------------------------------------------------------------------
section("Reply texts");

// GSM 03.38 basic character set; the extension table costs two septets each.
const GSM7_BASIC = new Set(
  "@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !\"#¤%&'()*+,-./0123456789:;<=>?" +
    "¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà",
);
const GSM7_EXTENSION = new Set("\f^{}\\[~]|€");

/** Septets in a GSM-7 message, or the characters that would force UCS-2. */
function gsm7(text: string): { septets: number; bad: string[] } {
  let septets = 0;
  const bad: string[] = [];
  for (const ch of text) {
    if (GSM7_BASIC.has(ch)) septets += 1;
    else if (GSM7_EXTENSION.has(ch)) septets += 2;
    else bad.push(ch);
  }
  return { septets, bad };
}

/** Segments for a GSM-7 message: 160 in one, 153 each when concatenated. */
function segments(septets: number): number {
  return septets <= 160 ? 1 : Math.ceil(septets / 153);
}

function checkReply(name: string, text: string, maxSegments: number) {
  const { septets, bad } = gsm7(text);
  const codes = bad.map((c) => `U+${c.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0")}`).join(" ");
  check(`${name} is GSM-7`, bad.length === 0, codes && `not GSM-7: ${codes}`);
  check(
    `${name} fits ${maxSegments} segment${maxSegments > 1 ? "s" : ""}`,
    segments(septets) <= maxSegments,
    `${septets} septets, ${segments(septets)} segments`,
  );
  console.log(`  ${name}: ${septets} characters, ${segments(septets)} segment(s)`);
}

const site = siteUrl();
const liveReply = meetReply(`${site}/meet?c=${token}`);
checkReply(`MEET reply on ${site}`, liveReply, 2);
check("MEET reply at most 306 characters", liveReply.length <= 306);
const apexReply = meetReply(`https://spaarke.com/meet?c=${token}`);
check("MEET reply on https://spaarke.com is 216 characters", apexReply.length === 216, `got ${apexReply.length}`);
checkReply("HELP reply", HELP_REPLY, 2);
check("HELP reply is 162 characters (FR-11)", HELP_REPLY.length === 162, `got ${HELP_REPLY.length}`);
checkReply("Nudge", NUDGE_REPLY, 1);
check("Nudge is 103 characters (FR-12)", NUDGE_REPLY.length === 103, `got ${NUDGE_REPLY.length}`);
check("GSM-7 check catches an em dash", gsm7("Book a time — today").bad.length === 1);
check("GSM-7 check catches a curly apostrophe", gsm7("We’ll reply").bad.length === 1);
check("GSM-7 counts the euro sign as two", gsm7("€").septets === 2);

// ---------------------------------------------------------------------------
section("Store (in-memory dev mock)");

// The same in-memory tables `next dev` uses with MEET_DEV_MOCK=1, so these
// cases need no storage account. Task 022 runs the route against real tables.
const savedMock = { NODE_ENV: process.env.NODE_ENV, MEET_DEV_MOCK: process.env.MEET_DEV_MOCK };
Object.assign(process.env, { NODE_ENV: "development", MEET_DEV_MOCK: "1" });
try {
  const store = await import("@/lib/sms/store");
  const at = new Date(Date.UTC(2026, 10, 22, 14, 5));
  const sid = `SM${"0".repeat(31)}1`;

  check("inbound: first claim", await store.claimInbound(sid, at));
  check("inbound: second claim with the same SID refused", !(await store.claimInbound(sid, at)));
  await store.classifyInbound(sid, at, "meet", id);
  let refused = false;
  try {
    await store.claimInbound("SM/../x", at);
  } catch {
    refused = true;
  }
  check("inbound: unsafe row key refused", refused);

  check("sender: none yet", (await store.getSender(hash)) === null);
  const created = await store.updateSender(hash, (c) => c ?? store.newSender(at));
  check("sender: created", created?.optedOut === false && created.firstSeenAt === at.toISOString());
  await store.updateSender(hash, () => ({ optedOut: true, optedOutAt: at.toISOString() }));
  const sender = await store.getSender(hash);
  check(
    "sender: updated, metadata stripped",
    sender?.optedOut === true && !("etag" in sender) && sender.firstSeenAt === at.toISOString(),
  );
  check("sender: no readable number stored", !JSON.stringify(sender).includes("5550199"));
  const racing = await Promise.allSettled(
    Array.from({ length: 6 }, () =>
      store.updateSender(hash, (c) => ({ meetReplyCount: (c?.meetReplyCount ?? 0) + 1 })),
    ),
  );
  const written = racing.filter((r) => r.status === "fulfilled").length;
  check(
    `sender: concurrent updates lose nothing (${written} of 6 written)`,
    (await store.getSender(hash))?.meetReplyCount === written,
  );

  const conv = newConversationId();
  const base = {
    phoneHash: hash,
    keyword: "MEET",
    placement: NO_PLACEMENT,
    createdAt: at.toISOString(),
    linkExpiresAt: at.toISOString(),
  };
  await store.createConversation(conv, base);
  refused = false;
  try {
    await store.createConversation(conv, base);
  } catch {
    refused = true;
  }
  check("conversation: duplicate ID refused", refused);
  await store.recordLinkOpen(conv, at);
  const opened = await store.recordLinkOpen(conv, new Date(at.getTime() + 60_000));
  check(
    "conversation: opens counted, first time kept",
    opened?.status === "opened" && opened.linkOpenCount === 2 && opened.linkOpenedAt === at.toISOString(),
  );
  const booked = await store.markConversationBooked(conv, "1790000000000-0123abcd", at);
  check("conversation: booked", booked?.status === "booked" && booked.bookingId === "1790000000000-0123abcd");
  check("conversation: an open after booking keeps booked", (await store.recordLinkOpen(conv, at))?.status === "booked");
  check(
    "conversation: unknown ID",
    (await store.recordLinkOpen("zzzzzzzzzzzz", at)) === null && (await store.getConversation("bad")) === null,
  );

  check(
    "counter: windows",
    store.counterWindow("hour", at) === "2026-11-22T14" && store.counterWindow("day", at) === "2026-11-22",
  );
  const runs = await Promise.allSettled(Array.from({ length: 12 }, () => store.incrementCounter("hour", at, 5)));
  const settled = runs.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []));
  const allowed = settled.filter((v) => v.allowed).length;
  let alerts = settled.filter((v) => v.alert).length;
  const atCap = await store.incrementCounter("hour", at, 5);
  alerts += atCap.alert ? 1 : 0;
  check(
    `counter: 12 at once against a cap of 5 allow ${allowed}, count ${atCap.count}`,
    allowed === 5 && atCap.count === 5 && !atCap.allowed,
  );
  alerts += (await store.incrementCounter("hour", at, 5)).alert ? 1 : 0;
  check("counter: one alert per window", alerts === 1);
  const fresh = await store.incrementCounter("hour", new Date(at.getTime() + 3_600_000), 5);
  check("counter: next window starts fresh", fresh.allowed && fresh.count === 1);
} finally {
  for (const [k, v] of Object.entries(savedMock)) {
    if (v === undefined) delete process.env[k];
    else Object.assign(process.env, { [k]: v });
  }
}

// ---------------------------------------------------------------------------
section("Inbound route (called directly, dev mock store)");

// The route's POST handler, given built requests: no server, no network, no
// storage account. Task 022 adds the same cases against a running server.
const ROUTE_ENV = {
  NODE_ENV: "development",
  MEET_DEV_MOCK: "1",
  SMS_MODE: "twilio",
  TWILIO_ACCOUNT_SID: "ACtest0000000000000000000000000000",
  TWILIO_AUTH_TOKEN: "route-check-token",
  SMS_WEBHOOK_URL: "https://example.test/api/sms/inbound",
  SMS_PUBLIC_NUMBER: "+18005550100",
  SMS_LINK_SECRET: SECRET,
  SMS_PHONE_HASH_SECRET: HASH_SECRET,
};
const savedRoute = Object.fromEntries(
  [...Object.keys(ROUTE_ENV), "STORAGE_ACCOUNT_CONNECTION", "TWILIO_AUTH_TOKEN_PREVIOUS"].map((k) => [k, process.env[k]]),
);
const quietWarn = console.warn;
console.warn = () => {};
try {
  Object.assign(process.env, ROUTE_ENV);
  delete process.env.TWILIO_AUTH_TOKEN_PREVIOUS;
  const { POST } = await import("@/app/api/sms/inbound/route");
  const { MEET_REPLIES_PER_DAY } = await import("@/lib/sms/inbound");
  // Its own number: the store section above opted TEST_NUMBER out in the same mock tables.
  const ROUTE_NUMBER = "+12025550155";

  let sidCounter = 0;
  const nextSid = () => `SM${(++sidCounter).toString().padStart(32, "0")}`;
  type Send = { sid?: string; from?: string; body?: string; to?: string; account?: string; optOut?: string };
  const fieldsFor = (s: Send): [string, string][] => {
    const f: [string, string][] = [
      ["AccountSid", s.account ?? ROUTE_ENV.TWILIO_ACCOUNT_SID],
      ["MessageSid", s.sid ?? nextSid()],
      ["From", s.from ?? ROUTE_NUMBER],
      ["To", s.to ?? ROUTE_ENV.SMS_PUBLIC_NUMBER],
      ["Body", s.body ?? "MEET"],
      ["NumMedia", "0"],
    ];
    if (s.optOut) f.push(["OptOutType", s.optOut]);
    return f;
  };
  const request = (
    fields: [string, string][],
    o: { url?: string; token?: string; type?: string; signature?: string | null; body?: string } = {},
  ) => {
    const headers: Record<string, string> = { "content-type": o.type ?? "application/x-www-form-urlencoded" };
    const signature =
      o.signature === undefined
        ? computeSignature(o.token ?? ROUTE_ENV.TWILIO_AUTH_TOKEN, o.url ?? ROUTE_ENV.SMS_WEBHOOK_URL, fields)
        : o.signature;
    if (signature !== null) headers["x-twilio-signature"] = signature;
    return new Request("http://localhost:8080/api/sms/inbound", {
      method: "POST",
      headers,
      body: o.body ?? new URLSearchParams(fields).toString(),
    });
  };
  const send = async (s: Send) => {
    const res = await POST(request(fieldsFor(s)));
    const text = await res.text();
    const message = /<Message>([\s\S]*)<\/Message>/.exec(text)?.[1] ?? null;
    return { status: res.status, text, message };
  };
  const isEmpty = (r: { status: number; text: string }) => r.status === 200 && r.text.endsWith("<Response/>");

  // Before the signature
  delete process.env.SMS_MODE;
  check("route: 404 with SMS_MODE unset", (await POST(request(fieldsFor({})))).status === 404);
  process.env.SMS_MODE = "twilio";
  check("route: 400 for JSON", (await POST(request(fieldsFor({}), { type: "application/json" }))).status === 400);
  check("route: 400 over 16 KB", (await POST(request(fieldsFor({ body: "x".repeat(17_000) })))).status === 400);
  const preSid = nextSid();
  check("route: 403 with no signature", (await POST(request(fieldsFor({ sid: preSid }), { signature: null }))).status === 403);
  check("route: 403 with the wrong token", (await POST(request(fieldsFor({ sid: preSid }), { token: "nope" }))).status === 403);
  check(
    "route: 403 when signed over the request's own URL",
    (await POST(request(fieldsFor({ sid: preSid }), { url: "http://localhost:8080/api/sms/inbound" }))).status === 403,
  );
  {
    const f = fieldsFor({ sid: preSid });
    const tampered = new URLSearchParams(f.map(([k, v]) => [k, k === "Body" ? "MEET SIG" : v])).toString();
    check("route: 403 when the body changed after signing", (await POST(request(f, { body: tampered }))).status === 403);
  }
  check("route: 403 for another account", (await send({ sid: preSid, account: "ACother" })).status === 403);
  check("route: 403 for another number", (await send({ sid: preSid, to: "+18005550101" })).status === 403);

  // MEET
  const first = await send({ sid: preSid, body: "Meet card2" });
  check("route: nothing stored before the signature passed (SID still free)", first.status === 200 && first.message !== null);
  check("route: reply is XML escaped", first.text.includes("Msg &amp; data rates"));
  const link = /(https?:\/\/\S+\/meet\?c=)(\S+?)\s/.exec(first.message?.replaceAll("&amp;", "&") ?? "");
  check("route: link uses siteUrl()", link?.[1] === `${siteUrl()}/meet?c=`, link?.[1]);
  const firstToken = verifySmsToken(link?.[2] ?? "", SECRET);
  check("route: link token verifies", firstToken.ok);
  check("route: same MessageSid again gets nothing", isEmpty(await send({ sid: preSid, body: "Meet card2" })));
  const second = await send({ body: "meet" });
  const secondToken = verifySmsToken(/c=(\S+?)\s/.exec(second.message ?? "")?.[1] ?? "", SECRET);
  check(
    "route: a second MEET reuses the conversation",
    firstToken.ok && secondToken.ok && firstToken.conversationId === secondToken.conversationId,
  );
  for (let i = 2; i < MEET_REPLIES_PER_DAY; i++) await send({ body: "MEET" });
  check(`route: MEET number ${MEET_REPLIES_PER_DAY + 1} in a day gets nothing`, isEmpty(await send({ body: "MEET" })));

  // Other text
  const other = "+12025550188";
  const nudge = await send({ from: other, body: "hello?" });
  check("route: unrecognized text gets the nudge", nudge.message === NUDGE_REPLY);
  check("route: a second one that day gets nothing", isEmpty(await send({ from: other, body: "anyone there" })));

  // STOP, START, HELP
  const stopper = "+12025550177";
  check("route: HELP gets nothing from the route", isEmpty(await send({ from: stopper, body: "HELP", optOut: "HELP" })));
  check("route: STOP gets nothing from the route", isEmpty(await send({ from: stopper, body: "STOP", optOut: "STOP" })));
  check("route: MEET after STOP gets nothing", isEmpty(await send({ from: stopper, body: "MEET" })));
  check("route: text after STOP gets no nudge", isEmpty(await send({ from: stopper, body: "hi" })));
  check("route: START gets nothing from the route", isEmpty(await send({ from: stopper, body: "START", optOut: "START" })));
  check("route: MEET after START gets a link", (await send({ from: stopper, body: "MEET" })).message !== null);
  check(
    "route: plain-language stop gets nothing and opts out",
    isEmpty(await send({ from: "+12025550166", body: "please stop texting me" })) &&
      isEmpty(await send({ from: "+12025550166", body: "MEET" })),
  );

  // Region
  check("route: a sender outside +1 gets nothing", isEmpty(await send({ from: "+442071234567", body: "MEET" })));

  // Nothing readable stored
  const mockTables = (globalThis as unknown as { __meetDevMock?: { tables: Map<string, Map<string, unknown>> } })
    .__meetDevMock?.tables;
  const dump = JSON.stringify(
    [...(mockTables?.entries() ?? [])].filter(([name]) => name.startsWith("Sms")).map(([n, t]) => [n, [...t.entries()]]),
  );
  check(
    "route: no number or message text in any SMS table",
    dump.length > 100 && !/5550155|5550188|5550177|5550166|2071234567|hello|anyone there|stop texting/i.test(dump),
  );

  // Errors after the signature
  delete process.env.MEET_DEV_MOCK;
  delete process.env.STORAGE_ACCOUNT_CONNECTION;
  const quietError = console.error;
  console.error = () => {};
  const failed = await send({ from: "+12025550144", body: "MEET" });
  console.error = quietError;
  check("route: a storage failure answers 200 with an empty Response", isEmpty(failed));
} finally {
  console.warn = quietWarn;
  for (const [k, v] of Object.entries(savedRoute)) {
    if (v === undefined) delete process.env[k];
    else Object.assign(process.env, { [k]: v });
  }
}

// ---------------------------------------------------------------------------
console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length > 0) process.exit(1);
