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
console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length > 0) process.exit(1);
