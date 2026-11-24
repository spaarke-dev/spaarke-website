// Checks for the market access store and admin guard (projects/market-access,
// tasks 002, 010 to 013, 020 to 022, 030 to 034, 040 to 043, 050 to 053 and 060).
//
//   npm run market:check
//
// The pure checks always run. The storage checks run only when both
// STORAGE_ACCOUNT_CONNECTION and MA_TABLE_SUFFIX are set, so they can never
// write to the live tables. Locally, against the Azurite emulator:
//
//   npx azurite-table --inMemoryPersistence &
//   STORAGE_ACCOUNT_CONNECTION="UseDevelopmentStorage=true" MA_TABLE_SUFFIX=Check npm run market:check
//
// Every address is made up, under example.test, with a per-run tag so runs do
// not collide.

import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";

// The library modules compile as CommonJS under tsx, so named imports are
// taken from dynamic imports, as the other check scripts do.
const keys = await import("@/lib/market/keys");
const vis = await import("@/lib/market/visibility");
const principal = await import("@/lib/market/principal");
const camp = await import("@/lib/market/campaigns");
const auditLog = await import("@/lib/market/audit");
const writers = await import("@/lib/market/writers");
const { idempotencyKey, SUMMARY_MAX } = await import("@/lib/market/activity");

let passed = 0;
function ok(name: string) {
  passed++;
  console.log(`  ok  ${name}`);
}

console.log("Pure checks");

{
  const a = keys.normalizeEmail("  Jane.Doe@Example.COM ");
  const b = keys.normalizeEmail("jane.doe@example.com");
  assert.equal(a, "jane.doe@example.com");
  assert.equal(a, b);
  assert.equal(keys.normalizeEmail("mailto:Someone@Example.test"), "someone@example.test");
  for (const bad of ["", "no-at-sign", "a@b", "two@one.test, three@two.test", "x y@z.test", 42, null]) {
    assert.equal(keys.normalizeEmail(bad), null, `should reject ${String(bad)}`);
  }
  ok("normalizeEmail lower-cases, trims and rejects non-addresses");
}

{
  const h = keys.emailHash("jane.doe@example.com");
  assert.match(h, /^[0-9a-f]{64}$/);
  assert.equal(keys.contactKeys(h).partitionKey, h.slice(0, 2));
  assert.equal(keys.aliasKeys(h).partitionKey, `alias-${h.slice(0, 2)}`);
  assert.ok(!keys.contactKeys(h).rowKey.includes("@"));
  ok("contact keys are hashes, never the address");
}

{
  const older = keys.invertedTime(Date.parse("2026-11-01T00:00:00Z"));
  const newer = keys.invertedTime(Date.parse("2026-11-19T00:00:00Z"));
  assert.ok(newer < older, "newer sorts first");
  assert.equal(older.length, 13);
  assert.equal(keys.fromInvertedTime(older), Date.parse("2026-11-01T00:00:00Z"));
  assert.equal(keys.monthKey(Date.parse("2026-11-19T23:59:59Z")), "2026-11");
  ok("inverted time sorts newest first; month keys are UTC");
}

{
  assert.equal(keys.emailDomain("a@sub.example.test"), "sub.example.test");
  assert.ok(keys.isFreeMailDomain("gmail.com"));
  assert.ok(keys.isFreeMailDomain("Outlook.com"));
  assert.ok(!keys.isFreeMailDomain("example-co.test"));
  ok("free-mail domains are recognized");
}

{
  const general = { visibility: "general" as const };
  const investor = { visibility: "investor" as const };
  assert.ok(vis.isVisibleTo(general, ["admin"]));
  assert.ok(!vis.isVisibleTo(investor, ["admin"]));
  assert.ok(vis.isVisibleTo(investor, ["admin", "investor"]));
  assert.ok(!vis.isVisibleTo({}, ["admin"]), "a row without visibility hides");
  assert.deepEqual(vis.filterVisible([general, investor], ["admin"]), [general]);
  assert.equal(vis.visibilityFilter(["admin"]), "visibility eq 'general'");
  assert.equal(vis.visibilityFilter(["admin", "investor"]), undefined);
  assert.equal(vis.widen("general", "investor"), "investor");
  assert.equal(vis.widen("investor", "general"), "investor");
  ok("investor records are hidden without the investor role (FR-02)");
}

{
  const encode = (v: unknown) => Buffer.from(JSON.stringify(v), "utf8").toString("base64");
  const admin = {
    identityProvider: "aad",
    userId: "0123abcd",
    userDetails: "admin@example.test",
    userRoles: ["admin", "anonymous", "authenticated"],
  };
  const h = (raw: string | null) => ({ get: (n: string) => (n === "x-ms-client-principal" ? raw : null) });
  const p = principal.readPrincipal(h(encode(admin)));
  assert.ok(p);
  assert.deepEqual(p.roles, ["admin", "authenticated"]);
  assert.equal(principal.adminStatus(p), "ok");
  const noRole = principal.readPrincipal(h(encode({ ...admin, userRoles: ["anonymous", "authenticated"] })));
  assert.equal(principal.adminStatus(noRole), "forbidden");
  for (const bad of [null, "", "not base64 json", encode({ ...admin, userRoles: "admin" }), encode({ ...admin, userId: "" }), encode({ ...admin, userRoles: ["admin"] }), encode([1, 2])]) {
    assert.equal(principal.readPrincipal(h(bad)), null, `should reject ${String(bad).slice(0, 20)}`);
  }
  assert.equal(principal.adminStatus(null), "signed-out");
  ok("readPrincipal accepts a valid header, rejects malformed ones and needs the admin role (FR-01)");
}

{
  assert.ok(camp.isCampaignSlug("tltf-2026"));
  for (const bad of ["code", "brief", "campaign", "Has Caps", "-lead", "a/b", ""]) assert.ok(!camp.isCampaignSlug(bad), bad);
  assert.ok(camp.isMemberCode("r7Kx2"));
  assert.ok(!camp.isMemberCode("has space"));
  const d = auditLog.diffFields({ name: "Jane", stage: "new", tags: ["a"] }, { name: "Jane", stage: "engaged", tags: ["a", "b"], title: "x".repeat(200) });
  assert.deepEqual(d.map((c) => c.field), ["stage", "tags", "title"]);
  assert.equal(d.find((c) => c.field === "title")?.to?.length, 80);
  assert.equal(d.find((c) => c.field === "title")?.from, undefined);
  ok("campaign slugs avoid the index partitions; audit diffs keep changed fields and short values");
}

{
  const facts = {
    bookingId: "bk1",
    name: "Pat Example",
    email: "Pat@Example.test",
    organization: "Example Co",
    guests: ["guest@example.test", "pat@example.test"],
    start: Date.parse("2026-11-25T15:00:00Z"),
    hostTimeZone: "America/New_York",
    utm_campaign: "tltf",
  };
  const booked = writers.meetingActivities("booked", facts, { occurredAt: 1 });
  assert.equal(booked.length, 2, "the booker's own address in the guest list is not a second activity");
  assert.equal(booked[0].sourceId, "bk1:booked");
  assert.match(booked[1].sourceId, /^bk1:booked:[0-9a-f]{12}$/);
  assert.equal(booked[0].summary, "Meeting booked for Wed, Nov 25, 10:00 AM EST");
  assert.equal(booked[1].summary, "Meeting booked for Wed, Nov 25, 10:00 AM EST (as a guest)");
  assert.equal(booked[0].utm?.campaign, "tltf");
  const moved1 = writers.meetingActivities("rescheduled", facts, { occurredAt: 1000 });
  const moved2 = writers.meetingActivities("rescheduled", facts, { occurredAt: 2000 });
  assert.notEqual(moved1[0].sourceId, moved2[0].sourceId, "a second move is a new activity");
  const added = writers.meetingActivities("booked", facts, { onlyGuests: ["guest@example.test"] });
  assert.equal(added.length, 1);
  assert.equal(added[0].sourceId, booked[1].sourceId, "a guest added later matches the at-booking key");
  ok("meeting events map to one activity per person with stable source IDs (FR-06)");
}

{
  const c = writers.formActivity("contact", {
    rowKey: "1763650000000-ab12cd34",
    email: "Lee@Example.test",
    name: " Lee Example ",
    organization: "Example Co",
    detail: "pricing",
    attribution: { utm_source: "linkedin", utm_medium: "paid", utm_campaign: "dp-2026-12" },
    occurredAt: 5,
  });
  assert.equal(c.type, "form.contact");
  assert.equal(c.source, "ContactSubmissions");
  assert.equal(c.sourceId, "1763650000000-ab12cd34");
  assert.equal(c.visibility, "general");
  assert.equal(c.contactHints?.name, "Lee Example");
  assert.equal(c.summary, "Contact form (pricing)");
  assert.equal(c.utm?.campaign, "dp-2026-12");
  const inv = writers.formActivity("investor_overview", { rowKey: "r1", email: "fund@example.test", detail: "tltf-2026" });
  assert.equal(inv.visibility, "investor");
  assert.equal(inv.contactHints?.kind, "investor");
  assert.equal(inv.source, "InvestorOverviewRequests");
  for (const k of ["demo", "design_partner", "early_release"] as const) assert.equal(writers.formVisibility(k), "general");
  assert.ok(!("message" in c) && !("body" in c), "no message text reaches the log");
  ok("each form maps to its type, source table and row key; only the investor form starts investor-only");
}

{
  assert.equal(idempotencyKey("ContactSubmissions", "row-1"), idempotencyKey("ContactSubmissions", "row-1"));
  assert.notEqual(idempotencyKey("ContactSubmissions", "row-1"), idempotencyKey("DemoRequests", "row-1"));
  assert.equal(SUMMARY_MAX, 280);
  ok("idempotency keys depend on source and source ID");
}

{
  const { filterContacts } = await import("@/lib/market/queries");
  const base = {
    tags: [] as string[],
    editedFields: [] as string[],
    visibility: "general" as const,
    createdAt: "2026-11-01T00:00:00.000Z",
    updatedAt: "2026-11-01T00:00:00.000Z",
  };
  const rows = [
    { ...base, id: "a", email: "jane.doe@acme.test", name: "Jane Doe", kind: "prospect" as const, stage: "new" as const, organizationName: "Acme Widgets", tags: ["TLTF"] },
    { ...base, id: "b", email: "sam@other.test", name: "Sam Lee", kind: "partner" as const, stage: "engaged" as const, organizationName: "Other Co" },
    { ...base, id: "c", email: "pat@acme.test", kind: "prospect" as const, stage: "engaged" as const, organizationName: "Acme Widgets" },
  ];
  const ids = (r: { rows: { id: string }[] }) => r.rows.map((x) => x.id);
  assert.deepEqual(ids(filterContacts(rows, { q: "jan" })), ["a"], "part of a name");
  assert.deepEqual(ids(filterContacts(rows, { q: "SAM@OTH" })), ["b"], "part of an email, any case");
  assert.deepEqual(ids(filterContacts(rows, { q: "widg" })), ["a", "c"], "part of an organization");
  assert.deepEqual(ids(filterContacts(rows, { q: "jane acme" })), ["a"], "every word must match");
  assert.deepEqual(ids(filterContacts(rows, { kind: "prospect", stage: "engaged" })), ["c"]);
  assert.deepEqual(ids(filterContacts(rows, { tag: "tltf" })), ["a"], "tags match without case");
  assert.deepEqual(ids(filterContacts(rows, { campaignMembers: new Set(["b", "c"]) })), ["b", "c"]);
  assert.deepEqual(ids(filterContacts(rows, { campaignMembers: new Set<string>() })), []);
  const paged = filterContacts(rows, { pageSize: 2, page: 9 });
  assert.equal(paged.page, 2, "a page past the end shows the last page");
  assert.equal(paged.pageCount, 2);
  assert.deepEqual(ids(paged), ["c"]);
  assert.equal(paged.total, 3);
  ok("contact search finds part of a name, email or organization; filters and paging (task 030)");
}

{
  const { parsePatch, PatchError } = await import("@/lib/market/contact-admin");
  const p = parsePatch({ name: "  Jane   Doe ", tags: ["TLTF", "tltf", " Summit "], phone: "", kind: "investor" });
  assert.deepEqual(p, { name: "Jane Doe", tags: ["TLTF", "Summit"], phone: null, kind: "investor" });
  for (const bad of [{ email: "x@y.test" }, { kind: "boss" }, { stage: 3 }, { tags: "a,b" }, { linkedinUrl: "https://evil.test/x" }, []]) {
    assert.throws(() => parsePatch(bad), PatchError, JSON.stringify(bad));
  }
  const { sameSite } = await import("@/lib/market/admin-api");
  const h = (o: Record<string, string>) => new Headers(o);
  assert.equal(sameSite(h({ "sec-fetch-site": "same-origin" })), true);
  assert.equal(sameSite(h({ "sec-fetch-site": "cross-site", origin: "https://evil.test" })), false);
  assert.equal(sameSite(h({ "sec-fetch-site": "same-site" })), false);
  assert.equal(sameSite(h({ origin: "https://spaarke.com", host: "spaarke.com" })), true);
  assert.equal(sameSite(h({ origin: "https://evil.test", host: "spaarke.com" })), false);
  ok("contact edits accept only known fields; admin changes refuse cross-site requests (task 031)");
}

{
  const results = await import("@/lib/market/results");
  const t = (iso: string) => `${iso}T12:00:00.000Z`;
  const act = (type: string, day: string, campaignSlug?: string) =>
    ({ id: day + type, contactId: "c", type, source: "check", sourceId: day + type, occurredAt: t(day), recordedAt: t(day), visibility: "general", campaignSlug }) as never;
  const campaign = { slug: "spring", startDate: "2026-03-01", endDate: "2026-03-31" };
  const member = { contactId: "c", createdAt: "2026-04-15T00:00:00.000Z" };

  const acts = [
    act("email.sent", "2026-02-20"), // before the window
    act("email.sent", "2026-03-02"),
    act("brief.read", "2026-03-03"), // untagged brief read: not this campaign's
    act("ask_ai.click", "2026-03-03", "spring"), // the first hit marks delivery: a scanner
    act("brief.read", "2026-03-04", "spring"),
    act("email.received", "2026-03-05", "other"), // another campaign's reply
    act("note", "2026-03-06"),
    act("email.received", "2026-05-20"), // inside 60 days after the end
    act("meeting.booked", "2026-06-15"), // after the window
  ];
  const counted = results.memberActivities(campaign, member, acts);
  assert.deepEqual(
    counted.map((a: { type: string }) => a.type),
    ["email.sent", "ask_ai.click", "brief.read", "email.received"],
  );
  const d = results.deriveMemberStatus(member, counted);
  assert.equal(d.status, "replied", "the furthest stage reached");
  assert.deepEqual(d.reached, ["sent", "engaged", "replied"]);
  assert.equal(d.lastActivityAt, t("2026-05-20"));
  assert.equal(results.deriveMemberStatus(member, []).status, "planned");
  assert.equal(
    results.deriveMemberStatus(member, [act("email.sent", "2026-03-02"), act("email.bounced", "2026-03-02")]).status,
    "bounced",
  );
  // No start date: the window opens when the member was added.
  assert.equal(results.campaignWindow({}, member).from, member.createdAt);

  const f = results.funnelOf([
    { status: "replied", reached: ["sent", "engaged", "replied"] },
    { status: "bounced", reached: ["sent", "bounced"] },
    { status: "bounced", statusOverride: "meeting", reached: ["sent", "bounced"] },
    { status: "planned", statusOverride: "done", reached: [] },
    { status: "planned", reached: [] },
  ] as never);
  assert.deepEqual(f, { members: 5, sent: 4, delivered: 3, engaged: 1, replied: 1, meeting: 1 });

  const admin = await import("@/lib/market/campaign-admin");
  assert.deepEqual(admin.parseCampaign({ slug: "tltf-2026", name: " TLTF  2026 ", startDate: "2026-11-01", notes: "" }), {
    slug: "tltf-2026",
    name: "TLTF 2026",
    startDate: "2026-11-01",
    notes: null,
  });
  for (const bad of [{ slug: "code" }, { slug: "Bad Slug" }, { startDate: "11/01/2026" }, { kind: "ad" }, { name: "" }, { owner: "x" }]) {
    assert.throws(() => admin.parseCampaign(bad), admin.CampaignError, JSON.stringify(bad));
  }
  assert.equal(admin.parseOverride({ status: null }), null);
  assert.equal(admin.parseOverride({ status: "meeting" }), "meeting");
  assert.throws(() => admin.parseOverride({ status: "won" }), admin.CampaignError);
  assert.deepEqual(admin.parseAddMembers({ contacts: "a@x.test\n b@x.test, a@x.test" }).contacts, ["a@x.test", "b@x.test"]);
  ok("member status is the furthest stage in the campaign's window; the funnel counts what the log shows (task 033)");
}

{
  const csvLib = await import("@/lib/market/csv");
  const lead = await import("@/lib/market/linkedin-import");
  const { readFileSync } = await import("node:fs");

  // Quoting, doubled quotes, a line break inside quotes, CRLF and a byte order mark.
  const p = csvLib.parseCsv('﻿a,b,c\r\n"x, y","say ""hi""","two\r\nlines"\r\n\r\n 1 ,2,3\r\n');
  assert.deepEqual(p.headers, ["a", "b", "c"]);
  assert.deepEqual(p.rows, [["x, y", 'say "hi"', "two\r\nlines"], ["1", "2", "3"]]);
  assert.deepEqual(p.lines, [2, 5]);
  assert.deepEqual(csvLib.parseCsv("a\tb\n1\t2").rows, [["1", "2"]], "tab-separated");
  assert.deepEqual(csvLib.parseCsv("a;b\n1;2").rows, [["1", "2"]], "semicolon-separated");
  assert.throws(() => csvLib.parseCsv('a,b\n"open,2'), csvLib.CsvError);
  assert.throws(() => csvLib.parseCsv("  \n\n"), csvLib.CsvError);
  assert.throws(() => csvLib.parseCsv("a\n1\n2\n3", { maxRows: 2 }), csvLib.CsvError);

  // Times: Campaign Manager's export has no zone and is read as UTC.
  const t = csvLib.parseLeadTime;
  assert.equal(t("2026-12-19 15:02:11"), "2026-12-19T15:02:11.000Z");
  assert.equal(t("2026-12-19T15:02:11Z"), "2026-12-19T15:02:11.000Z");
  assert.equal(t("2026-12-19T10:02:11-05:00"), "2026-12-19T15:02:11.000Z");
  assert.equal(t("2026-12-19"), "2026-12-19T00:00:00.000Z");
  assert.equal(t("12/20/2026 9:15 AM"), "2026-12-20T09:15:00.000Z");
  assert.equal(t("12/20/2026 12:05 AM"), "2026-12-20T00:05:00.000Z");
  assert.equal(t("12/20/2026, 21:15"), "2026-12-20T21:15:00.000Z");
  assert.equal(t("Dec 20, 2026 2:03 PM"), "2026-12-20T14:03:00.000Z");
  assert.equal(t("1797800000"), new Date(1797800000 * 1000).toISOString());
  for (const bad of ["sometime next week", "2026-02-30", "13/01/2026", "12/20/2026 13:00 PM", ""]) {
    assert.equal(t(bad), null, `should not read ${bad}`);
  }

  // Default mapping from LinkedIn's headers; extra columns are left alone.
  const fixture = readFileSync("scripts/market/fixtures/linkedin-leads-sample.csv", "utf8");
  const parsed = csvLib.parseCsv(fixture);
  const map = csvLib.defaultMapping(parsed.headers);
  assert.deepEqual(map, {
    email: "Email Address",
    firstName: "First Name",
    lastName: "Last Name",
    company: "Company Name",
    title: "Job Title",
    linkedinUrl: "LinkedIn Profile URL",
    phone: "Phone Number",
    submittedAt: "Submitted At",
    leadId: "Lead ID",
    formName: "Form Name",
  });
  assert.deepEqual(csvLib.defaultMapping(["E-mail", "Email"]), { email: "E-mail" }, "punctuation and case are ignored; the first match wins");
  assert.throws(() => csvLib.checkMapping({ email: "Nope" }, parsed.headers), csvLib.CsvError);
  assert.throws(() => csvLib.checkMapping({ firstName: "First Name" }, parsed.headers), csvLib.CsvError, "email is required");
  assert.throws(() => csvLib.checkMapping({ email: "Email Address", country: "Country" }, parsed.headers), csvLib.CsvError);

  const leads = lead.checkLeads(csvLib.mapRows(parsed, map));
  assert.equal(leads.length, 8);
  assert.deepEqual(
    leads.filter((l) => l.skip).map((l) => [l.line, l.skip]),
    [
      [6, "No email"],
      [7, "Not an email address"],
      [8, "Repeats an earlier row"],
      [10, "Submitted time not understood"],
    ],
  );
  const riley = leads.find((l) => l.leadId === "FAKE-0003")!;
  assert.equal(riley.name, 'Riley O"Test');
  assert.equal(riley.title, "Head of Legal Ops (EMEA)");
  assert.equal(riley.submittedAt, "2026-12-20T09:15:00.000Z");
  // Without a Lead ID, the email and time are the key, so a re-import still matches.
  const noId = lead.checkLeads(csvLib.mapRows(parsed, { ...map, leadId: undefined }));
  assert.equal(noId[1].sourceId, lead.checkLeads(csvLib.mapRows(parsed, { ...map, leadId: undefined }))[1].sourceId);
  assert.match(noId[1].sourceId!, /^h:[0-9a-f]{64}$/);
  assert.ok(!noId[1].sourceId!.includes("@"));

  assert.throws(() => lead.parseImportRequest({ csv: "a" , extra: 1 }), csvLib.CsvError);
  assert.throws(() => lead.parseImportRequest({ csv: "" }), csvLib.CsvError);
  assert.throws(() => lead.parseImportRequest({ csv: "x".repeat(lead.MAX_CSV_CHARS + 1) }), csvLib.CsvError);
  assert.equal(lead.parseImportRequest({ csv: "a" }).confirm, false);
  ok("the CSV reader handles quotes, line breaks and delimiters; LinkedIn headers map by default; bad rows are named (task 053)");
}

{
  const fu = await import("@/lib/market/followups");
  const fa = await import("@/lib/market/followup-admin");
  const sel = await import("@/lib/market/followup-select");

  const id = "a".repeat(64);
  assert.equal(fu.bulkFollowUpId("tltf-2026", "Thank-you after the Summit", id), fu.bulkFollowUpId("tltf-2026", "  thank-you  after the summit ", id));
  assert.notEqual(fu.bulkFollowUpId("tltf-2026", "Thank-you", id), fu.bulkFollowUpId("other", "Thank-you", id));
  assert.match(fu.bulkFollowUpId("x", "y", id), /^[0-9a-f]{32}$/);
  assert.match(fu.newFollowUpId(), /^[0-9a-f]{32}$/);
  assert.match(fu.todayKey(), /^\d{4}-\d{2}-\d{2}$/);
  // 03:00 UTC is still the previous day in New York.
  const prevTz = process.env.MEET_HOST_TIME_ZONE;
  process.env.MEET_HOST_TIME_ZONE = "America/New_York";
  assert.equal(fu.todayKey(new Date("2026-12-02T03:00:00Z")), "2026-12-01");
  if (prevTz === undefined) delete process.env.MEET_HOST_TIME_ZONE;
  else process.env.MEET_HOST_TIME_ZONE = prevTz;

  assert.deepEqual(fa.parseNewFollowUp({ title: "  Thank-you ", dueDate: "2026-12-01", notes: "", campaignSlug: "" }), {
    title: "Thank-you",
    dueDate: "2026-12-01",
    notes: undefined,
    campaignSlug: undefined,
  });
  for (const bad of [{ dueDate: "2026-12-01" }, { title: "x" }, { title: "x", dueDate: "12/01/2026" }, { title: "x", dueDate: "2026-12-01", owner: "y" }]) {
    assert.throws(() => fa.parseNewFollowUp(bad), fa.FollowUpError);
  }
  assert.deepEqual(fa.parseFollowUpPatch({ status: "sent" }), { status: "sent" });
  assert.deepEqual(fa.parseFollowUpPatch({ notes: "" }), { notes: null });
  assert.throws(() => fa.parseFollowUpPatch({ status: "done" }), fa.FollowUpError);
  assert.throws(() => fa.parseFollowUpPatch({}), fa.FollowUpError);
  assert.throws(() => fa.parseBulk({ title: "x", dueDate: "2026-12-01", statuses: ["nope"] }), fa.FollowUpError);
  assert.deepEqual(fa.parseBulk({ title: "x", dueDate: "2026-12-01", statuses: ["sent", "sent"] }).statuses, ["sent"]);

  const m = { status: "meeting" as const, group: "A", tags: ["Summit", "GC"] };
  assert.ok(sel.matchesSelection(m, { statuses: [] }));
  assert.ok(sel.matchesSelection(m, { statuses: ["meeting", "replied"], group: "A", tag: "summit" }));
  assert.ok(!sel.matchesSelection(m, { statuses: ["sent"] }));
  assert.ok(!sel.matchesSelection(m, { statuses: [], group: "B" }));
  assert.ok(!sel.matchesSelection(m, { statuses: [], tag: "press" }));
  ok("follow-up input is checked; bulk IDs are stable per campaign, title and contact; selection by status, group and tag (task 034)");
}

{
  const oa = await import("@/lib/market/org-admin");
  for (const [raw, want] of [
    ["Acme.com", "acme.com"],
    ["@acme.com", "acme.com"],
    ["https://www.acme.com/about", "acme.com"],
    ["jane@sub.acme.co.uk", "sub.acme.co.uk"],
  ] as const) {
    assert.equal(oa.parseDomain(raw), want, raw);
  }
  for (const bad of ["", "acme", "gmail.com", "Outlook.com", "a b.com", "-x.com", 7, null]) {
    assert.throws(() => oa.parseDomain(bad), oa.OrgError, String(bad));
  }
  assert.deepEqual(oa.parseOrgPatch({ name: "  Acme   Widgets ", website: "", kind: "customer", notes: " Met at TLTF " }), {
    name: "Acme Widgets",
    website: null,
    kind: "customer",
    notes: "Met at TLTF",
  });
  for (const bad of [{ name: "" }, { domain: "x.test" }, { kind: "boss" }, { website: "javascript:alert(1)" }, { visibility: "all" }, []]) {
    assert.throws(() => oa.parseOrgPatch(bad), oa.OrgError, JSON.stringify(bad));
  }
  const base = { visibility: "general" as const, createdAt: "", updatedAt: "", contactCount: 0 };
  const rows = [
    { ...base, id: "acme.test", name: "Acme Widgets", domain: "acme.test", otherDomains: ["acme-mail.test"] },
    { ...base, id: "other.test", name: "Other Co", domain: "other.test", otherDomains: [], website: "https://other.test" },
  ];
  const ids = (r: { rows: { id: string }[] }) => r.rows.map((x) => x.id);
  assert.deepEqual(ids(oa.filterOrganizations(rows, { q: "widg" })), ["acme.test"], "part of a name");
  assert.deepEqual(ids(oa.filterOrganizations(rows, { q: "acme-mail" })), ["acme.test"], "an override domain");
  assert.deepEqual(ids(oa.filterOrganizations(rows, {})), ["acme.test", "other.test"]);
  assert.equal(oa.filterOrganizations(rows, { pageSize: 1, page: 9 }).page, 2);
  ok("organization domains are read from what people type; edits are checked; search covers names and domains (task 032)");
}

{
  // Task 040: the Graph mail client, against canned responses (no network).
  const mail = await import("@/lib/market/graph-mail");
  const box = "Owner@Example.test";
  const settings = { tenantId: "t", clientId: "c", clientSecret: "s" };
  const graph = "https://graph.microsoft.com/v1.0";

  const msg = (id: string, at: string, extra: Record<string, unknown> = {}) => ({
    id,
    internetMessageId: `<${id}@mail.example.test>`,
    from: { emailAddress: { address: "Jane.Doe@Acme.test", name: "Jane Doe" } },
    toRecipients: [{ emailAddress: { address: "owner@example.test", name: "owner@example.test" } }],
    ccRecipients: [{ emailAddress: { address: "/O=EXCHANGELABS/OU=X/CN=RECIPIENTS/CN=ABC" } }],
    subject: "  Hello  ",
    receivedDateTime: at,
    sentDateTime: at,
    webLink: "https://outlook.office365.com/owa/?ItemID=x",
    ...extra,
  });

  const calls: { url: string; headers: Record<string, string> }[] = [];
  const pages: Record<string, unknown> = {};
  const fake = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = String(input);
    calls.push({ url, headers: (init?.headers ?? {}) as Record<string, string> });
    const body = Object.entries(pages).find(([k]) => url.includes(k))?.[1];
    if (body === undefined) return new Response(JSON.stringify({ error: { code: "ErrorItemNotFound" } }), { status: 404 });
    if (body instanceof Response) return body;
    return new Response(JSON.stringify(body), { status: 200 });
  }) as typeof fetch;
  const deps = { fetch: fake, token: async () => "token" };

  pages["/mailFolders/inbox/messages?$filter"] = {
    value: [msg("m1", "2026-11-22T10:00:00Z"), { id: "bad" }],
    "@odata.nextLink": `${graph}/users/owner%40example.test/mailFolders/inbox/messages?$skiptoken=p2`,
  };
  pages["$skiptoken=p2"] = { value: [msg("m2", "2026-11-22T11:00:00.0000000")] };

  const got = [];
  for await (const m of mail.listMessagesSince(settings, box, "inbox", "2026-11-22T00:00:00Z", deps)) got.push(m);
  assert.deepEqual(
    got.map((m) => [m.id, m.receivedAt]),
    [
      ["m1", "2026-11-22T10:00:00.000Z"],
      ["m2", "2026-11-22T11:00:00.000Z"],
    ],
    "follows the next link; a message without a time is skipped; Graph's zone-less times read as UTC",
  );
  assert.deepEqual(got[0].from, { address: "jane.doe@acme.test", name: "Jane Doe" });
  assert.deepEqual(got[0].to, [{ address: "owner@example.test" }], "a name that only repeats the address is dropped");
  assert.deepEqual(got[0].cc, [], "an Exchange-internal address is left out");
  assert.equal(got[0].subject, "Hello");
  const first = decodeURIComponent(calls[0].url);
  assert.ok(first.startsWith(`${graph}/users/owner@example.test/mailFolders/inbox/messages?`), first);
  assert.ok(first.includes("$filter=receivedDateTime ge 2026-11-22T00:00:00.000Z"));
  assert.ok(first.includes("$orderby=receivedDateTime asc"));
  assert.ok(!calls[0].url.includes("+"), "spaces are sent as %20");
  const select = /\$select=([^&]+)/.exec(first)![1].split(",");
  assert.ok(!select.includes("body") && !select.includes("bodyPreview") && !select.includes("uniqueBody"), "no body is asked for");

  // A link to anywhere but Graph is not followed.
  calls.length = 0;
  pages["/mailFolders/sentitems/messages?$filter"] = { value: [msg("s1", "2026-11-22T09:00:00Z")], "@odata.nextLink": "https://evil.test/next" };
  let n = 0;
  for await (const _ of mail.listMessagesSince(settings, box, "sentitems", "2026-11-22T00:00:00Z", deps)) n++;
  assert.equal(n, 1);
  assert.equal(calls.length, 1);

  // The cap stops a run early.
  n = 0;
  for await (const _ of mail.listMessagesSince(settings, box, "inbox", "2026-11-22T00:00:00Z", { ...deps, max: 1 })) n++;
  assert.equal(n, 1);

  // A mailbox outside the scope is NoMailboxAccess; other failures keep their status.
  const denied = (async () =>
    new Response(JSON.stringify({ error: { code: "ErrorAccessDenied", message: "Access is denied." } }), { status: 403 })) as typeof fetch;
  await assert.rejects(
    (async () => {
      for await (const _ of mail.listMessagesSince(settings, "other@example.test", "inbox", "2026-11-22T00:00:00Z", { fetch: denied, token: deps.token })) void _;
    })(),
    (err: unknown) => err instanceof mail.NoMailboxAccess && err.mailbox === "other@example.test",
  );
  const missing = mail.graphErrorFor(404, "ErrorInvalidUser", "x", box);
  assert.ok(!(missing instanceof mail.NoMailboxAccess));
  assert.match(missing.message, /No mailbox with this address/);
  const notFound = (async () => new Response(JSON.stringify({ error: { code: "ErrorItemNotFound" } }), { status: 404 })) as typeof fetch;
  await assert.rejects(mail.bounceRecipient(settings, box, "gone", { fetch: notFound, token: deps.token }), (err: unknown) => {
    const m = (err as Error).message;
    return m.includes("/users/{mailbox}/messages/{id}") && !m.includes("example.test");
  });
  assert.equal(mail.graphErrorFor(500, undefined, "x", box).status, 500);

  // One throttled answer is waited out.
  let tries = 0;
  const throttled = (async () => {
    tries++;
    return tries === 1
      ? new Response("", { status: 429, headers: { "Retry-After": "1" } })
      : new Response(JSON.stringify({ value: [msg("t1", "2026-11-22T08:00:00Z")] }), { status: 200 });
  }) as typeof fetch;
  n = 0;
  for await (const _ of mail.listMessagesSince(settings, box, "inbox", "2026-11-22T00:00:00Z", { fetch: throttled, token: deps.token })) n++;
  assert.equal(n, 1);
  assert.equal(tries, 2);

  // Non-delivery reports.
  const inbox = (from: string, subject: string) => ({ folder: "inbox" as const, from: { address: from }, subject });
  assert.ok(mail.isBounce(inbox("postmaster@example.onmicrosoft.com", "Undeliverable: Hello")));
  assert.ok(mail.isBounce(inbox("mailer-daemon@googlemail.com", "Delivery Status Notification (Failure)")));
  assert.ok(mail.isBounce(inbox("someone@acme.test", "Mail delivery failed: returning message to sender")));
  assert.ok(!mail.isBounce(inbox("mailer-daemon@googlemail.com", "Delivery Status Notification (Delay)")), "a delay is not a failure");
  assert.ok(!mail.isBounce(inbox("jane@acme.test", "Re: Undeliverable items in our warehouse")));
  assert.ok(!mail.isBounce({ folder: "sentitems", from: { address: "postmaster@example.test" }, subject: "Undeliverable: x" }));

  const own = "owner@example.test";
  const exchange =
    "Your message to jane.doe@acme.test couldn't be delivered.\n jane.doe wasn't found at acme.test.\n owner Office 365 jane.doe\n Action Required\n postmaster@example.onmicrosoft.com";
  assert.equal(mail.bounceRecipientFromText(exchange, own), "jane.doe@acme.test");
  const gmail = "Address not found\nYour message wasn't delivered to Sam.Lee@Other.test because the address couldn't be found.";
  assert.equal(mail.bounceRecipientFromText(gmail, own), "sam.lee@other.test");
  const postfix = "This is the mail system at host mx.example.test.\n\n<pat@gone.test>: host mx.gone.test[1.2.3.4] said: 550 5.1.1 User unknown";
  assert.equal(mail.bounceRecipientFromText(postfix, own), "pat@gone.test");
  const dsn = "Reporting-MTA: dns; mx.example.test\nFinal-Recipient: rfc822; lee@far.test\nAction: failed";
  assert.equal(mail.bounceRecipientFromText(dsn, own), "lee@far.test");
  assert.equal(
    mail.bounceRecipientFromText("Delivery failed. Contact owner@example.test or postmaster@example.test.", own),
    null,
    "only the mailbox and the reporting system: nothing to report",
  );
  assert.equal(mail.bounceRecipientFromText("Failed for a@one.test and b@two.test", own), null, "two candidates: not sure, so none");

  // The body is fetched as text for a bounce only, and only the address comes back.
  calls.length = 0;
  pages["/messages/nd1?$select=body"] = { body: { contentType: "text", content: exchange } };
  assert.equal(await mail.bounceRecipient(settings, box, "nd1", deps), "jane.doe@acme.test");
  assert.match(calls[0].headers.Prefer, /outlook\.body-content-type="text"/);

  ok("the Graph mail client reads metadata only, pages, waits out throttling, names out-of-scope mailboxes and reads failed addresses from bounces (task 040)");
}

{
  // Task 041: mailbox registry input.
  const mb = await import("@/lib/market/mailboxes");
  const shared = mb.parseNewMailbox({ address: "  Team@Example.test ", kind: "shared" });
  assert.deepEqual(shared, { address: "team@example.test", label: "team@example.test", kind: "shared", mode: "capture-new", visibility: "general" });
  const personal = mb.parseNewMailbox({ address: "me@example.test", label: "  My   mailbox ", mode: "" });
  assert.equal(personal.kind, "personal");
  assert.equal(personal.mode, "known-only", "a personal mailbox defaults to known contacts only");
  assert.equal(personal.label, "My mailbox");
  assert.throws(() => mb.parseNewMailbox({ address: "a@x.test, b@x.test" }), /one mailbox address/);
  assert.throws(() => mb.parseNewMailbox({ address: "a@x.test", mode: "everything" }), /mode must be one of/);
  assert.throws(() => mb.parseNewMailbox({ address: "a@x.test", visibility: "public" }), /visibility/);
  assert.deepEqual(mb.parseMailboxPatch({ enabled: false }), { enabled: false });
  assert.throws(() => mb.parseMailboxPatch({ address: "other@x.test" }), /Not editable: address/);
  assert.throws(() => mb.parseMailboxPatch({ enabled: "no" }), /true or false/);
  assert.throws(() => mb.parseMailboxPatch({}), /Nothing to change/);
  assert.ok(!mb.isMailboxId("team@example.test") && mb.isMailboxId(keys.emailHash("team@example.test")));
  ok("mailbox input: one address, known kinds and modes, kind-based defaults, the address fixed after adding (task 041)");
}

{
  // Task 042: the mail sync's pure rules.
  const sync = await import("@/lib/market/sync");
  const box = "owner@spaarke.example.test";
  const sent = { folder: "sentitems" as const, from: { address: box }, to: [{ address: "a@x.test" }, { address: box }], cc: [{ address: "b@y.test" }, { address: "a@x.test" }] };
  assert.deepEqual(sync.counterparts(sent, box), ["a@x.test", "b@y.test"], "recipients of sent mail, once each, never the mailbox");
  const got = { folder: "inbox" as const, from: { address: "a@x.test" }, to: [{ address: box }, { address: "c@z.test" }], cc: [] };
  assert.deepEqual(sync.counterparts(got, box), ["a@x.test"], "the sender of received mail only");
  assert.deepEqual(sync.counterparts({ ...got, from: { address: box } }, box), []);
  assert.ok(sync.triageable("jane@acme.test", box));
  assert.ok(!sync.triageable("noreply@acme.test", box) && !sync.triageable("no-reply+x@acme.test", box) && !sync.triageable("notifications@acme.test", box));
  assert.ok(!sync.triageable("colleague@spaarke.example.test", box), "mail from the mailbox's own domain is internal");
  const now = new Date("2026-11-23T12:00:00Z");
  assert.equal(sync.startFrom(null, now), "2026-10-24T12:00:00.000Z", "no checkpoint: 30 days back");
  assert.equal(sync.startFrom("2026-11-23T11:00:00.000Z", now), "2026-11-23T10:55:00.000Z", "five minutes of overlap");
  const sid = sync.emailSourceId("email.sent", "k", "a@x.test");
  assert.ok(sid.startsWith("email.sent:k:") && !sid.includes("@"), "no address in a source ID");
  const tri = await import("@/lib/market/triage");
  assert.equal(tri.messageKey("<m@x>", "box1", "g1"), tri.messageKey("<m@x>", "box2", "g2"), "one message in two mailboxes is one key");
  assert.notEqual(tri.messageKey(undefined, "box1", "g1"), tri.messageKey(undefined, "box2", "g1"));
  ok("mail sync: counterparts by direction, triage skips automated and internal senders, overlap and first lookback (task 042)");
}

{
  // Task 043: grouping the triage queue by sender.
  const tri = await import("@/lib/market/triage");
  const row = (pk: string, rk: string, sender: string, at: string, mailboxId: string, name?: string) => ({
    partitionKey: pk,
    rowKey: rk,
    sender,
    name,
    subject: `Subject ${rk}`,
    receivedAt: at,
    mailboxId,
    mailbox: "team@example.test",
    state: "new" as const,
    queuedAt: at,
  });
  const vis = new Map([
    ["general-box", "general" as const],
    ["investor-box", "investor" as const],
  ]);
  const groups = tri.groupBySender(
    [
      row("a", "1", "ann@acme.test", "2026-11-20T10:00:00Z", "general-box"),
      row("a", "2", "ann@acme.test", "2026-11-22T10:00:00Z", "general-box", "Ann Acme"),
      row("b", "3", "bo@fund.test", "2026-11-21T10:00:00Z", "investor-box"),
    ],
    vis,
  );
  assert.deepEqual(groups.map((g) => [g.id, g.messages.length, g.visibility]), [["a", 2, "general"], ["b", 1, "investor"]]);
  assert.equal(groups[0].name, "Ann Acme");
  assert.equal(groups[0].domain, "acme.test");
  assert.equal(groups[0].messages[0].key, "2", "newest message first");
  ok("triage groups queued mail by sender, newest first; a sender from an investor mailbox is investor-only (task 043)");
}

{
  // Task 050: the TLTF import plan, from made-up files.
  const tltf = await import("@/lib/market/tltf-import");
  const { parseCsv } = await import("@/lib/market/csv");

  assert.equal(tltf.zonedToIso("2026-11-17T10:00:00.0000000", "Eastern Standard Time"), "2026-11-17T15:00:00.000Z");
  assert.equal(tltf.zonedToIso("2026-07-01T10:00:00", "Eastern Standard Time"), "2026-07-01T14:00:00.000Z");
  assert.equal(tltf.zonedToIso("2026-11-17T10:00:00", "UTC"), "2026-11-17T10:00:00.000Z");
  assert.throws(() => tltf.ianaZone("Nowhere Standard Time"));
  assert.equal(tltf.localDate("2026-11-14T02:00:00.000Z"), "2026-11-13");

  const outreachCsv = parseCsv(
    [
      "file,group,template,to,email source,check before sending,status,result,reply",
      '"Z1-01 Pat Example (Fund One).eml",1,A,pat@fund-one.example.test,pattern,,sent 2026-11-13,,"Interested, call next week"',
      '"Z1-02 Fund Two.eml",1,B,info@fund-two.example.test,general inbox,,sent 2026-11-13,bounced: address not found,',
      '"Z2-03 Lee Example (Fund Three).eml",2,C,Lee@Fund-Three.example.test,data provider,,sent 2026-11-13,auto-reply,',
      '"Z2-04 Sam Example (Fund Four).eml",2,D,sam@fund-four.example.test,pattern,,not sent (decided not to send),,',
      '"no code here",2,D,x@fund-five.example.test,pattern,,sent 2026-11-13,,',
    ].join("\n"),
  );
  const keysCsv = parseCsv("code,key\nZ1-01,key-one\nZ1-02,key-two\nTEST,key-test\n");
  const people = tltf.parsePeople([
    { match: ["lee@"], name: "Lee Example", title: "Partner", org: "Fund Three", linkedin: "https://www.linkedin.example.test/in/lee", context: "Met at a dinner." },
    { match: ["Robin"], name: "Robin Example", org: "Fund Six", context: "Seed investor." },
  ]);
  const calendar = tltf.parseCalendar([
    { subject: "Coffee with Lee", start: { dateTime: "2026-11-17T10:00:00.0000000", timeZone: "Eastern Standard Time" }, attendees: ["ralph@spaarke.com", "lee@fund-three.example.test"], isCancelled: false },
    { subject: "Robin and team", start: { dateTime: "2026-11-18T11:00:00.0000000", timeZone: "Eastern Standard Time" }, attendees: ["ralph@spaarke.com", "rk@fund-six.example.test"], isCancelled: false },
    { subject: "Internal prep", start: { dateTime: "2026-11-16T08:00:00.0000000", timeZone: "Eastern Standard Time" }, attendees: ["ralph@spaarke.com"], isCancelled: false },
    { subject: "Dropped", start: { dateTime: "2026-11-19T08:00:00.0000000", timeZone: "Eastern Standard Time" }, attendees: ["x@fund-seven.example.test"], isCancelled: true },
  ]);
  assert.equal(calendar.meetings.length, 2);
  assert.equal(calendar.internalOnly, 1);
  assert.equal(calendar.cancelled, 1);
  assert.equal(calendar.meetings[0].start, "2026-11-17T15:00:00.000Z");

  const briefKeys = tltf.parseBriefKeys(keysCsv);
  const outreach = tltf.parseOutreach(outreachCsv, briefKeys, people);
  assert.equal(outreach.entries.length, 3);
  assert.equal(outreach.notSent, 1);
  assert.equal(outreach.autoReplies, 1);
  // The bad file name and the missing brief key for Z2-03.
  assert.equal(outreach.issues.length, 2);
  const [pat, inbox, lee] = outreach.entries;
  assert.equal(pat.hints.name, "Pat Example");
  assert.equal(pat.hints.organizationName, "Fund One");
  assert.equal(inbox.hints.name, undefined, "a general inbox has no person's name");
  assert.equal(inbox.hints.organizationName, "Fund Two");
  assert.equal(lee.email, "lee@fund-three.example.test");
  assert.equal(lee.hints.title, "Partner");
  assert.equal(pat.group, "G1");
  assert.equal(pat.sentAt, "2026-11-14T02:00:00.000Z");

  const plan = tltf.buildPlan(outreach, calendar, people, outreachCsv.rows.length);
  assert.equal(plan.counts.sent, 3);
  assert.equal(plan.counts.bounced, 1);
  assert.equal(plan.counts.replies, 1);
  assert.equal(plan.counts.summitOnly, 1);
  assert.equal(plan.counts.summitAlsoOutreach, 1);
  // Lee by address; Robin by the subject of a one-guest meeting.
  assert.equal(plan.counts.peopleMatched, 2);
  assert.equal(plan.counts.contextNotes, 2);
  assert.deepEqual(plan.window, { startDate: "2026-11-13", endDate: "2026-11-18" });
  assert.equal(plan.members.length, 4);
  const m = new Map(plan.members.map((x) => [x.email, x]));
  assert.equal(m.get("pat@fund-one.example.test")!.code, "tltf-Z1-01");
  assert.equal(m.get("pat@fund-one.example.test")!.briefLabel, "tltf-2026:Z1-01");
  assert.equal(m.get("pat@fund-one.example.test")!.briefKey, "key-one");
  assert.equal(m.get("pat@fund-one.example.test")!.templateLabel, "Template A");
  assert.equal(m.get("lee@fund-three.example.test")!.group, "G2", "the outreach group wins over Summit");
  assert.equal(m.get("rk@fund-six.example.test")!.group, "Summit");
  assert.equal(m.get("rk@fund-six.example.test")!.hints.name, "Robin Example");

  const ids = plan.activities.map((a) => `${a.source}:${a.sourceId}`);
  assert.equal(new Set(ids).size, ids.length, "source IDs are unique");
  assert.ok(plan.activities.every((a) => a.source === "tltf-import" && a.campaignSlug === "tltf-2026" && a.visibility === "investor"));
  assert.deepEqual(
    plan.activities.map((a) => a.type).sort(),
    ["email.bounced", "email.received", "email.sent", "email.sent", "email.sent", "meeting.in_person", "meeting.in_person", "note", "note"],
  );
  // Ids hold codes and hashes, never an address.
  assert.ok(ids.every((id) => !id.includes("@")));
  const again = tltf.buildPlan(outreach, calendar, people, outreachCsv.rows.length);
  assert.deepEqual(again.activities.map((a) => a.sourceId), plan.activities.map((a) => a.sourceId), "a second plan has the same IDs");
  assert.throws(() => tltf.columnMapping(["file", "to"], tltf.OUTREACH_FIELDS), /Missing columns: group/);
  ok("TLTF import: column mapping, file names, sent, bounces, replies, Summit meetings and stable IDs (task 050)");
}

{
  // Task 051: the link scanner filter, ported from track.py. Times in seconds after delivery.
  const eng = await import("@/lib/market/engagement");
  const results = await import("@/lib/market/results");
  const T = Date.parse("2026-11-14T03:00:00Z");
  const s = (sec: number) => T + sec * 1000;
  const click = (sec: number, rewritten?: boolean) => ({ kind: "click" as const, at: s(sec), rewritten });
  const read = (sec: number) => ({ kind: "read" as const, at: s(sec) });
  const at = (hits: { at: number }[]) => hits.map((h) => (h.at - T) / 1000);

  // Delivery: both buttons at once, then the gateway's brief read; nothing counts.
  assert.deepEqual(eng.engagedHits([click(0), click(1), read(3)]), []);
  // A slower gateway's second pass inside the quiet window does not count either.
  assert.deepEqual(eng.engagedHits([click(0), click(1), click(180), read(200)]), []);
  // A person, an hour later: one click, then the brief read their AI made.
  assert.deepEqual(at(eng.engagedHits([click(0), click(1), click(3600), read(3640)])), [3600, 3640]);
  // A burst an hour later is a scanner, and the read 10 seconds after it came from it.
  assert.deepEqual(eng.engagedHits([click(0), click(3600), click(3603), read(3610)]), []);
  // A read alone after the quiet window counts; the first hit never does.
  assert.deepEqual(at(eng.engagedHits([read(0), read(1200)])), [1200]);
  // A click within a second of a rewritten-code click is the same gateway.
  assert.deepEqual(eng.engagedHits([click(0), click(3600.5), click(3600, true)]), []);
  assert.deepEqual(eng.engagedHits([click(0), click(3600)], { rewrittenAt: [s(3601)] }), []);
  // A rewritten click is never the anchor: the next hit is.
  assert.deepEqual(eng.engagedHits([click(-10, true), click(0)]), []);
  // Hits before the email went out are tests.
  assert.deepEqual(at(eng.engagedHits([click(-7200), click(0), read(1800)], { since: s(-60) })), [1800]);
  assert.equal(eng.QUIET_MS, 15 * 60_000);

  // In results: a scanner-only member is sent, not engaged; a person's read makes them engaged.
  const act = (type: string, sec: number, extra: Record<string, unknown> = {}) =>
    ({ id: `${type}${sec}`, contactId: "c", type, source: "check", sourceId: `${type}${sec}`, occurredAt: new Date(s(sec)).toISOString(), recordedAt: "", visibility: "general", campaignSlug: "x", ...extra }) as never;
  const sent = act("email.sent", -60);
  const bot = results.deriveMemberStatus({ contactId: "c" }, [sent, act("ask_ai.click", 0), act("ask_ai.click", 1), act("brief.read", 4)]);
  assert.equal(bot.status, "sent");
  assert.deepEqual(bot.reached, ["sent"]);
  assert.equal(bot.lastActivityAt, new Date(s(-60)).toISOString(), "scanner hits do not move the last activity");
  const person = results.deriveMemberStatus({ contactId: "c" }, [sent, act("ask_ai.click", 0), act("brief.read", 5000)]);
  assert.equal(person.status, "engaged");
  const rewritten = results.deriveMemberStatus({ contactId: "c" }, [sent, act("brief.read", 0), act("ask_ai.click", 5000, { codeRewritten: true })]);
  assert.equal(rewritten.status, "sent");
  // A LinkedIn lead is not a link scanner's doing.
  assert.equal(results.deriveMemberStatus({ contactId: "c" }, [act("linkedin.lead", 0)]).status, "engaged");
  ok("engagement leaves out link scanners: the quiet window, bursts, rewritten codes and tests (FR-10, task 051)");
}

{
  // Task 052: the backfill maps each site table row exactly as its live writer would.
  const bf = await import("@/lib/market/backfill");
  const writers2 = await import("@/lib/market/writers");
  const at = "2026-10-02T15:04:05.000Z";
  const ms = Date.parse(at);
  const utm = { utm_source: "linkedin", utm_medium: "paid", utm_campaign: "fall" };

  const contact = bf.formRowActivity("contact", { rowKey: "1759417445000-ab", name: "Pat Example", email: "pat@example.test", company: "Acme", reason: "demo", createdAt: at, ...utm })!;
  assert.deepEqual(
    contact,
    writers2.formActivity("contact", { rowKey: "1759417445000-ab", email: "pat@example.test", name: "Pat Example", organization: "Acme", detail: "demo", occurredAt: ms, attribution: utm }),
  );
  assert.equal(contact.source, "ContactSubmissions");
  assert.deepEqual(contact.utm, { source: "linkedin", medium: "paid", campaign: "fall" });
  const demo = bf.formRowActivity("demo", { rowKey: "r1", firstName: "Lee", lastName: "Example", email: "lee@example.test", jobTitle: "GC", organization: "Fund", phone: "555", useCase: "Matters", createdAt: at })!;
  assert.equal(demo.contactHints?.name, "Lee Example");
  assert.equal(demo.contactHints?.title, "GC");
  assert.equal(demo.summary, "Demo request (Matters)");
  const early = bf.formRowActivity("early_release", { rowKey: "1759417445000-cd", email: "e@example.test", source: "home", signedUpAt: at })!;
  assert.equal(early.occurredAt, ms);
  const investor = bf.formRowActivity("investor_overview", { partitionKey: "tltf-2026", rowKey: "req1", email: "i@example.test", createdAt: at })!;
  assert.equal(investor.visibility, "investor");
  assert.equal(investor.summary, "Requested the investor overview (tltf-2026)");
  // No time field: the row key's leading milliseconds date it.
  assert.equal(bf.formRowActivity("contact", { rowKey: `${ms}-ef`, email: "x@example.test" })!.occurredAt, ms);
  assert.equal(bf.formRowActivity("contact", { rowKey: "no-time", email: "x@example.test" }), null);

  const booking = {
    rowKey: "bk1",
    status: "cancelled",
    start: "2026-10-09T14:00:00.000Z",
    name: "Morgan Example",
    email: "morgan@example.test",
    organization: "Org",
    role: "CFO",
    guests: JSON.stringify(["guest@example.test", "Morgan@Example.test"]),
    createdAt: at,
    updatedAt: "2026-10-05T10:00:00.000Z",
    movedAt: "2026-10-04T10:00:00.000Z",
    ...utm,
  };
  const b = bf.bookingRowActivities(booking, "America/New_York")!;
  assert.deepEqual(
    b.activities.map((a) => [a.type, a.sourceId.replace(/:[0-9a-f]{12}$/, ":guest")]),
    [
      ["meeting.booked", "bk1:booked"],
      ["meeting.booked", "bk1:booked:guest"],
      ["meeting.cancelled", "bk1:cancelled"],
      ["meeting.cancelled", "bk1:cancelled:guest"],
    ],
    "the booker and the one real guest; the booker listed as a guest is not doubled",
  );
  assert.equal(b.activities[0].occurredAt, ms);
  assert.equal(b.moves[0].sourceId, `bk1:rescheduled:${Date.parse(booking.movedAt)}`);
  assert.equal(bf.bookingRowActivities({ ...booking, status: "failed" }, "UTC"), null);
  assert.equal(bf.bookingRowActivities({ ...booking, status: "booked", movedAt: undefined }, "UTC")!.moves.length, 0);

  const events = bf.parseEvents([
    { timestamp: "2026-11-14T04:00:00.123Z", name: "brief.read", customDimensions: JSON.stringify({ label: "spring:A-01" }) },
    { timestamp: "2026-11-14T04:00:00.123Z", name: "brief.read", customDimensions: { label: "spring:A-01" } }, // the same event from the other source
    { timestamp: "2026-11-14T03:59:00Z", name: "ask_ai.click", customDimensions: { provider: "claude", src: "rc-01" } },
    { timestamp: "2026-11-14T03:59:30Z", name: "ask_ai.click", customDimensions: { provider: "chatgpt", src: "article" } },
    { timestamp: "2026-11-14T03:59:40Z", name: "page.view", customDimensions: {} },
    { timestamp: "not a time", name: "brief.read", customDimensions: {} },
  ]);
  assert.deepEqual(events.map((e) => e.name), ["ask_ai.click", "ask_ai.click", "brief.read"], "sorted, deduplicated, other events dropped");
  assert.deepEqual(bf.eventActivity(events[2]), writers2.briefReadActivity("spring:A-01", Date.parse("2026-11-14T04:00:00.123Z")));
  assert.equal(bf.eventActivity(events[0])!.memberCode, "rc-01");
  assert.equal(bf.eventActivity(events[1]), null, "a site click names no recipient");
  ok("backfill maps form rows, bookings and App Insights events as the live writers do (FR-13, task 052)");
}

const cs = process.env.STORAGE_ACCOUNT_CONNECTION?.trim();
const suffix = process.env.MA_TABLE_SUFFIX?.trim();

if (!cs || !suffix) {
  console.log("\nStorage checks skipped: set STORAGE_ACCOUNT_CONNECTION and MA_TABLE_SUFFIX to run them.");
  console.log(`\n${passed} checks passed.`);
  process.exit(0);
}

console.log(`\nStorage checks (tables suffixed "${suffix}")`);

const { getTable, resetTableClients } = await import("@/lib/market/tables");
const contacts = await import("@/lib/market/contacts");
const orgs = await import("@/lib/market/organizations");
const activity = await import("@/lib/market/activity");

const run = randomBytes(3).toString("hex");
const addr = (local: string, domain = `co-${run}.example.test`) => `${local}@${domain}`;

{
  const first = await contacts.resolveContact(
    { email: `  ${addr("Jane.Doe").toUpperCase()} `, name: "Jane Doe" },
    { source: "form.contact" },
  );
  assert.equal(first.status, "created");
  const second = await contacts.resolveContact({ email: addr("jane.doe"), title: "General Counsel" });
  assert.equal(second.status, "found");
  assert.ok(first.status === "created" && second.status === "found");
  assert.equal(first.contact.id, second.contact.id);
  assert.equal(second.contact.name, "Jane Doe");
  assert.equal(second.contact.title, "General Counsel", "an empty field is filled from a later hint");
  assert.equal(second.contact.source, "form.contact");
  ok("the same email with different capitalization is one contact (FR-03)");
}

{
  const a = await contacts.resolveContact({ email: addr("alex"), organizationName: "Example Co" });
  const b = await contacts.resolveContact({ email: addr("blake") });
  assert.ok(a.status === "created" && b.status === "created");
  assert.ok(a.contact.organizationId);
  assert.equal(a.contact.organizationId, b.contact.organizationId);
  const org = await orgs.getOrganization(a.contact.organizationId!);
  assert.equal(org?.name, "Example Co");
  const free = await contacts.resolveContact({ email: `person-${run}@gmail.com` });
  assert.ok(free.status === "created");
  assert.equal(free.contact.organizationId, undefined);
  ok("contacts at one domain share an organization; free mail creates none (FR-04)");
}

{
  const email = addr("removed");
  const tomb = await getTable("tombstones");
  await tomb!.upsertEntity({ partitionKey: "email", rowKey: keys.emailHash(email) });
  const r = await contacts.resolveContact({ email });
  assert.equal(r.status, "tombstoned");
  assert.equal(await contacts.findContactByEmail(email), null);
  ok("a tombstoned email never becomes a contact (FR-17)");
}

{
  const email = addr("race");
  const results = await Promise.all([1, 2, 3, 4].map(() => contacts.resolveContact({ email })));
  const ids = new Set(results.map((r) => (r.status === "created" || r.status === "found" ? r.contact.id : r.status)));
  assert.equal(ids.size, 1);
  assert.equal(results.filter((r) => r.status === "created").length, 1);
  ok("concurrent resolves of a new email create one contact");
}

{
  const email = addr("investor", `fund-${run}.example.test`);
  const g = await contacts.resolveContact({ email });
  assert.ok(g.status === "created" && g.contact.visibility === "general");
  const i = await contacts.resolveContact({ email }, { visibility: "investor" });
  assert.ok(i.status === "found" && i.contact.visibility === "investor");
  const again = await contacts.resolveContact({ email }, { visibility: "general" });
  assert.ok(again.status === "found" && again.contact.visibility === "investor");
  ok("visibility widens to investor and never narrows on its own");
}

{
  const email = addr("Repeat");
  const input = {
    type: "form.contact" as const,
    source: "ContactSubmissions",
    sourceId: `check-${run}-1`,
    occurredAt: "2026-11-19T15:00:00Z",
    email,
    contactHints: { name: "Repeat Visitor" },
    utm: { source: "linkedin", medium: "paid", campaign: "dp-2026-12" },
    summary: "Contact form: question about pricing",
  };
  const r1 = await activity.recordActivity(input);
  const r2 = await activity.recordActivity(input);
  assert.equal(r1.status, "recorded");
  assert.equal(r2.status, "duplicate");
  assert.ok(r1.status === "recorded" && r2.status === "duplicate");
  assert.equal(r1.activityId, r2.activityId);

  const r3 = await activity.recordActivity({ ...input, email: email.toUpperCase(), sourceId: `check-${run}-2` });
  assert.equal(r3.status, "recorded");
  assert.ok(r3.status === "recorded");
  assert.equal(r3.contactId, r1.contactId);

  const timeline = await activity.listContactActivities(r1.contactId);
  assert.equal(timeline.length, 2);
  assert.equal(timeline[0].utm?.campaign, "dp-2026-12");
  const month = await activity.listActivitiesInMonth("2026-11", 10_000);
  assert.equal(month.filter((a) => a.contactId === r1.contactId).length, 2);

  const c = await contacts.getContact(r1.contactId);
  assert.equal(c?.lastActivityAt, "2026-11-19T15:00:00.000Z");
  ok("re-running a write leaves the count unchanged; two submissions give two activities (FR-03, FR-05)");
}

{
  const email = addr("cutoff");
  const input = {
    type: "note" as const,
    source: "check",
    sourceId: `cutoff-${run}`,
    occurredAt: Date.parse("2026-11-18T09:00:00Z"),
    email,
  };
  const first = await activity.recordActivity(input);
  assert.ok(first.status === "recorded");
  // Simulate a write cut off after the activity row but before the marker.
  const table = await getTable("activities");
  const hash = activity.idempotencyKey(input.source, input.sourceId);
  await table!.deleteEntity(`idem-${hash.slice(0, 2)}`, hash);
  const retry = await activity.recordActivity(input);
  assert.equal(retry.status, "recorded");
  assert.equal((await activity.listContactActivities(first.contactId)).length, 1);
  ok("a retry after a cut-off write does not duplicate the activity");
}

{
  const long = "x".repeat(400);
  const r = await activity.recordActivity({
    type: "note",
    source: "check",
    sourceId: `long-${run}`,
    occurredAt: new Date(),
    email: addr("long"),
    summary: long,
  });
  assert.ok(r.status === "recorded");
  const [a] = await activity.listContactActivities(r.contactId);
  assert.equal(a.summary?.length, 280);
  await assert.rejects(
    activity.recordActivity({ type: "note", source: "check", sourceId: "b", occurredAt: new Date(), email: addr("b"), body: "no" } as never),
  );
  ok("summaries are capped at 280 characters and bodies are refused");
}

{
  const r = await activity.recordActivity({
    type: "brief.read",
    source: "brief",
    sourceId: `nobody-${run}`,
    occurredAt: new Date(),
  });
  assert.deepEqual(r, { status: "skipped", reason: "no_contact" });
  ok("an activity with no email or contact is skipped");
}

{
  const slug = `check-${run}`;
  const campaign = await camp.upsertCampaign({ slug, name: "Check outreach", kind: "outreach", utmCampaign: slug });
  assert.equal(campaign?.visibility, "investor", "a campaign without a visibility is investor-only");
  const people = await Promise.all(
    ["ana", "ben", "cy"].map((n) => contacts.resolveContact({ email: addr(`member-${n}`) }, { source: "check" })),
  );
  const ids = people.map((p) => (p.status === "created" || p.status === "found" ? p.contact.id : ""));
  const label = `brief-${run}`;
  await camp.addMember({ campaignSlug: slug, contactId: ids[0], code: `a${run}`, briefKey: `key-${run}-a`, briefLabel: label, group: "A" });
  await camp.addMember({ campaignSlug: slug, contactId: ids[1], code: `b${run}`, group: "B", templateLabel: "short" });
  await camp.addMember({ campaignSlug: slug, contactId: ids[2], code: `c${run}`, briefLabel: `solo-${run}` });

  const members = await camp.listMembers(slug);
  assert.equal(members.length, 3);
  const ana = members.find((m) => m.contactId === ids[0])!;
  assert.equal(ana.status, "planned");
  assert.equal(ana.briefKeyHash, keys.sha256(`key-${run}-a`));
  assert.ok(!JSON.stringify(members).includes(`key-${run}-a`), "the brief key itself is never stored");

  assert.deepEqual(await camp.findMemberByCode(`b${run}`), { campaignSlug: slug, contactId: ids[1] });
  assert.deepEqual(await camp.findMemberByBriefLabel(`solo-${run}`), { campaignSlug: slug, contactId: ids[2] });
  assert.equal(await camp.findMemberByCode("nope"), null);

  // Re-adding updates details without resetting the status or freeing the code.
  await camp.addMember({ campaignSlug: slug, contactId: ids[1], code: `b${run}`, group: "B2" });
  assert.equal((await camp.getMember(slug, ids[1]))?.group, "B2");
  await assert.rejects(camp.addMember({ campaignSlug: slug, contactId: ids[2], code: `a${run}` }), camp.MemberConflictError);

  // A brief label sent to two people resolves to the campaign only.
  await camp.addMember({ campaignSlug: slug, contactId: ids[1], briefLabel: label });
  assert.deepEqual(await camp.findMemberByBriefLabel(label), { campaignSlug: slug, contactId: undefined });
  ok("a campaign of three members: found by code and brief label, codes unique, brief keys hashed (FR-09)");

  const read = await activity.recordActivity({
    type: "brief.read",
    source: "brief",
    sourceId: `read-${run}`,
    occurredAt: "2026-11-19T16:00:00Z",
    memberCode: `c${run}`,
  });
  assert.ok(read.status === "recorded");
  assert.equal(read.contactId, ids[2]);
  const [a] = await activity.listContactActivities(ids[2]);
  assert.equal(a.campaignSlug, slug);
  assert.equal(a.memberId, ids[2]);
  const shared = await activity.recordActivity({
    type: "brief.read",
    source: "brief",
    sourceId: `shared-${run}`,
    occurredAt: new Date(),
    briefLabel: label,
  });
  assert.deepEqual(shared, { status: "skipped", reason: "no_contact" });
  ok("an activity with a member code resolves the contact and carries the campaign and member links (FR-06)");

  const now = new Date("2026-11-19T17:00:00Z");
  const entry = await auditLog.audit(
    { who: "admin@example.test", action: "member.status_override", entity: "member", entityId: `${slug}/${ids[1]}`, before: { statusOverride: null }, after: { statusOverride: "meeting" } },
    now,
  );
  const log = await auditLog.listAudit("2026-11", 10_000);
  const found = log.find((e) => e.id === entry?.id);
  assert.equal(found?.who, "admin@example.test");
  assert.equal(found?.at, now.toISOString());
  assert.deepEqual(found?.changes, [{ field: "statusOverride", to: "meeting" }]);
  ok("audit rows record who, when and what changed (NFR-06)");
}

{
  const slug = `writers-${run}`;
  await camp.upsertCampaign({ slug, name: "Writers check" });
  const person = await contacts.resolveContact({ email: addr("reader") });
  assert.ok(person.status === "created");
  const label = `label-${run}`;
  const code = `w${run}`;
  await camp.addMember({ campaignSlug: slug, contactId: person.contact.id, code, briefLabel: label });

  const t = Date.parse("2026-11-19T18:00:00Z");
  const r1 = await writers.recordBriefRead(label, t);
  const r2 = await writers.recordBriefRead(label, t + 300);
  assert.equal(r1?.status, "recorded");
  assert.equal(r2?.status, "duplicate", "a retry in the same second is one read");
  assert.equal((await writers.recordBriefRead(label, t + 5000))?.status, "recorded");
  assert.equal((await writers.recordBriefRead(`unknown-${run}`, t))?.status, "skipped");

  const click = await writers.recordAskClick("claude", code, undefined, t);
  assert.equal(click?.status, "recorded");
  assert.equal(await writers.recordAskClick("claude", "article", undefined, t), null, "site clicks are not looked up");
  assert.equal((await writers.recordAskClick("claude", `nobody${run}`, undefined, t))?.status, "skipped");
  assert.equal((await writers.recordAskClick("chatgpt", "direct", label, t))?.status, "recorded");

  const log = await activity.listContactActivities(person.contact.id);
  assert.equal(log.filter((a) => a.type === "brief.read").length, 2);
  assert.equal(log.filter((a) => a.type === "ask_ai.click").length, 2);
  assert.ok(log.every((a) => a.campaignSlug === slug && a.memberId === person.contact.id));
  assert.ok(!JSON.stringify(log).includes(code) && !JSON.stringify(log).includes(label), "neither code nor label is stored");
  ok("brief reads and Ask AI clicks land on the member; unknown codes write nothing (FR-06)");

  // A gateway rewrote the code, but the brief key still finds the member: the click is flagged (task 051).
  const rewritten = await writers.recordAskClick("claude", `gyga-${run}`, label, t + 9000);
  assert.equal(rewritten?.status, "recorded");
  const flagged = (await activity.listContactActivities(person.contact.id)).filter((a) => a.type === "ask_ai.click");
  assert.equal(flagged.filter((a) => a.codeRewritten).length, 1);
  assert.ok(flagged.every((a) => a.codeRewritten || a.occurredAt !== new Date(t + 9000).toISOString()));
  ok("an Ask AI click whose code a gateway rewrote is kept on the member and flagged (task 051)");

  const meeting = {
    bookingId: `bk-${run}`,
    name: "Morgan Meet",
    email: addr("morgan"),
    guests: [addr("guest1")],
    start: Date.parse("2026-11-26T15:00:00Z"),
    hostTimeZone: "America/New_York",
  };
  const first = await writers.recordMeeting("booked", meeting, { occurredAt: t });
  const again = await writers.recordMeeting("booked", meeting, { occurredAt: t });
  assert.deepEqual(first.map((r) => r.status), ["recorded", "recorded"]);
  assert.deepEqual(again.map((r) => r.status), ["duplicate", "duplicate"]);
  await writers.recordMeeting("rescheduled", meeting, { occurredAt: t + 60_000 });
  await writers.recordMeeting("cancelled", meeting, { occurredAt: t + 120_000 });
  const morgan = await contacts.findContactByEmail(meeting.email);
  const types = (await activity.listContactActivities(morgan!.id)).map((a) => a.type);
  assert.deepEqual(types, ["meeting.cancelled", "meeting.rescheduled", "meeting.booked"]);
  const guest = await contacts.findContactByEmail(addr("guest1"));
  assert.equal((await activity.listContactActivities(guest!.id)).length, 3);
  assert.equal(morgan?.name, "Morgan Meet");
  ok("each meeting action writes one activity per person, and a repeat writes none (FR-06)");
}

{
  const email = addr("Former");
  const one = await writers.recordForm("contact", { rowKey: `row-${run}-1`, email: email.toUpperCase(), name: "Form Er", detail: "demo" });
  const two = await writers.recordForm("demo", { rowKey: `row-${run}-2`, email, title: "COO" });
  const again = await writers.recordForm("contact", { rowKey: `row-${run}-1`, email });
  assert.ok(one?.status === "recorded" && two?.status === "recorded");
  assert.equal(again?.status, "duplicate");
  assert.ok(one.status === "recorded" && two.status === "recorded");
  assert.equal(one.contactId, two.contactId);
  assert.equal((await activity.listContactActivities(one.contactId)).length, 2);
  const contact = await contacts.getContact(one.contactId);
  assert.equal(contact?.title, "COO");

  const inv = await writers.recordForm("investor_overview", { rowKey: `inv-${run}`, email: addr("lp", `fund-${run}.example.test`) });
  assert.ok(inv?.status === "recorded");
  const lp = await contacts.getContact(inv.contactId);
  assert.equal(lp?.visibility, "investor");
  assert.equal(lp?.kind, "investor");
  ok("two forms with different capitalization give one contact and two activities; investor form contacts are investor-only (FR-03, FR-06)");
}

{
  const q = await import("@/lib/market/queries");
  const general = ["authenticated", "admin"];
  const investor = ["authenticated", "admin", "investor"];
  q.clearQueryCache();

  const jane = await contacts.findContactByEmail(addr("jane.doe"));
  const lp = await contacts.findContactByEmail(addr("lp", `fund-${run}.example.test`));
  assert.ok(jane && lp);
  assert.equal(lp.visibility, "investor");

  const seen = await q.loadContacts(general);
  const seenAll = await q.loadContacts(investor);
  assert.ok(seen.every((c) => c.visibility === "general"), "no investor contact without the role");
  assert.ok(!seen.some((c) => c.id === lp.id));
  assert.ok(seenAll.some((c) => c.id === lp.id));
  assert.equal(seenAll.length - seen.length, seenAll.filter((c) => c.visibility === "investor").length, "counts leave investor contacts out");
  const lpOrg = seenAll.find((c) => c.id === lp.id)?.organizationName;
  assert.ok(lpOrg, "the investor firm is named for the investor role");
  assert.ok(!seen.some((c) => c.organizationName === lpOrg), "and nowhere for an admin without it");

  const found = q.filterContacts(seen, { q: `co-${run}` }).rows.map((c) => c.id);
  assert.ok(found.includes(jane.id), "search finds a contact by part of its organization");

  const recent = await q.recentActivity(general, { limit: 1000 });
  const recentAll = await q.recentActivity(investor, { limit: 1000 });
  assert.ok(recent.every((a) => a.visibility === "general" && a.contactId !== lp.id));
  assert.ok(recentAll.some((a) => a.contactId === lp.id));
  const fresh = await q.newContacts(general);
  assert.ok(fresh.some((c) => c.id === jane.id) && !fresh.some((c) => c.id === lp.id));
  assert.ok((await q.newContacts(investor)).some((c) => c.id === lp.id));

  await camp.upsertCampaign({ slug: `qg-${run}`, name: "Query check", kind: "outreach", visibility: "general" });
  await camp.upsertCampaign({ slug: `qi-${run}`, name: "Investor query check", kind: "outreach", visibility: "investor" });
  await camp.addMember({ campaignSlug: `qg-${run}`, contactId: jane.id });
  await camp.addMember({ campaignSlug: `qi-${run}`, contactId: jane.id });
  assert.deepEqual([...((await q.campaignMemberIds(`qg-${run}`, general)) ?? [])], [jane.id]);
  assert.equal(await q.campaignMemberIds(`qi-${run}`, general), null, "an investor campaign is not a filter without the role");
  assert.ok(!(await q.visibleCampaigns(general)).some((c) => c.slug === `qi-${run}`));
  assert.ok((await q.visibleCampaigns(investor)).some((c) => c.slug === `qi-${run}`));
  ok("admin lists, counts, recent activity and campaign filters leave investor records out without the role (FR-02, FR-15)");
}

{
  const admin = await import("@/lib/market/contact-admin");
  const who = "admin@example.test";
  const auditRows = async (entityId: string) =>
    (await auditLog.listAudit(keys.monthKey(Date.now()), 5000)).filter((e) => e.entityId === entityId);

  // Edit: a field typed by hand stays when a later form brings a different value.
  const edited = await contacts.resolveContact({ email: addr("edit-me"), name: "Ed" });
  assert.ok(edited.status === "created");
  const after = await admin.editContact(
    edited.contact.id,
    admin.parsePatch({ name: "Edward Example", stage: "engaged", tags: ["VIP"] }),
    who,
  );
  assert.equal(after?.name, "Edward Example");
  assert.ok(after?.editedFields.includes("name") && !after.editedFields.includes("stage"));
  await writers.recordForm("contact", { rowKey: `edit-${run}`, email: addr("edit-me"), name: "Eddie" });
  assert.equal((await contacts.getContact(edited.contact.id))?.name, "Edward Example");
  const editAudit = await auditRows(edited.contact.id);
  assert.equal(editAudit.length, 1);
  assert.equal(editAudit[0].action, "contact.edit");
  assert.equal(editAudit[0].who, who);
  assert.deepEqual(editAudit[0].changes.map((c) => c.field), ["name", "stage", "tags"]);
  await admin.editContact(edited.contact.id, admin.parsePatch({ stage: "engaged" }), who);
  assert.equal((await auditRows(edited.contact.id)).length, 1, "no change, no audit row");

  // Log by hand.
  const logged = await admin.logActivity(edited.contact.id, {
    type: "meeting.in_person",
    summary: "Coffee at the Summit",
    occurredAt: "2026-11-12T15:00:00Z",
  });
  assert.equal(logged.status, "recorded");
  await assert.rejects(admin.logActivity(edited.contact.id, { type: "note", summary: "   " }), admin.PatchError);
  await assert.rejects(
    admin.logActivity(edited.contact.id, { type: "note", summary: "x", occurredAt: "2099-01-01T00:00:00Z" }),
    admin.PatchError,
  );
  ok("an edit by hand is audited and protects the field from later forms; touches can be logged with a date (task 031)");
}

{
  const admin = await import("@/lib/market/contact-admin");
  const who = "admin@example.test";

  // Two records for one person: a work address and a personal one.
  const keep = await writers.recordForm("contact", { rowKey: `m-${run}-1`, email: addr("dup"), name: "Dee Duplicate" });
  const extra = await writers.recordForm("demo", { rowKey: `m-${run}-2`, email: `dee-${run}@gmail.com`, title: "COO" });
  await writers.recordForm("early_release", { rowKey: `m-${run}-3`, email: `dee-${run}@gmail.com` });
  assert.ok(keep?.status === "recorded" && extra?.status === "recorded");
  const survivorId = keep.contactId;
  const otherId = extra.contactId;
  await camp.upsertCampaign({ slug: `merge-${run}`, name: "Merge check", visibility: "general" });
  await camp.addMember({ campaignSlug: `merge-${run}`, contactId: otherId, code: `mg${run}` });
  const fu = (await getTable("followUps"))!;
  await fu.createEntity({ partitionKey: otherId, rowKey: "fu1", contactId: otherId, title: "Thank-you" });
  await fu.createEntity({ partitionKey: "due:2026-12", rowKey: `2026-12-01-${otherId}-fu1`, contactId: otherId });

  const preview = await admin.previewMerge(survivorId, otherId);
  assert.deepEqual([preview.activities, preview.memberships, preview.followUps], [2, 1, 1]);
  const summary = await admin.mergeContacts(survivorId, otherId, who);
  assert.equal(summary.activities, 2);

  assert.equal(await contacts.getContact(otherId), null, "the merged record is gone");
  const timeline = await activity.listContactActivities(survivorId);
  assert.equal(timeline.length, 3, "one contact with every activity from both");
  assert.ok(timeline.every((a) => a.contactId === survivorId));
  assert.equal((await activity.listContactActivities(otherId)).length, 0);
  const month = await activity.listActivitiesInMonth(keys.monthKey(Date.now()), 5000);
  assert.ok(!month.some((a) => a.contactId === otherId), "the month index follows");
  assert.equal((await contacts.findContactByEmail(`DEE-${run}@gmail.com`))?.id, survivorId, "the other email is an alternate");
  assert.equal((await contacts.getContact(survivorId))?.title, "COO", "empty fields filled from the other");
  assert.equal((await camp.findMemberByCode(`mg${run}`))?.contactId, survivorId, "codes find the survivor");
  assert.ok(await camp.getMember(`merge-${run}`, survivorId));
  assert.equal(await camp.getMember(`merge-${run}`, otherId), null);
  assert.equal((await fu.getEntity<{ contactId: string }>(survivorId, "fu1")).contactId, survivorId);
  assert.equal(
    (await fu.getEntity<{ contactId: string }>("due:2026-12", `2026-12-01-${otherId}-fu1`)).contactId,
    survivorId,
  );

  // A repeat of a source event already moved is still a duplicate, not a second row.
  const again = await writers.recordForm("demo", { rowKey: `m-${run}-2`, email: `dee-${run}@gmail.com` });
  assert.equal(again?.status, "duplicate");
  assert.equal((await activity.listContactActivities(survivorId)).length, 3);
  // New activity from the other address lands on the survivor.
  const later = await writers.recordForm("contact", { rowKey: `m-${run}-4`, email: `dee-${run}@gmail.com` });
  assert.ok(later?.status === "recorded" && later.contactId === survivorId);

  const audits = (await auditLog.listAudit(keys.monthKey(Date.now()), 5000)).filter(
    (e) => e.entityId === survivorId || e.entityId === otherId,
  );
  assert.deepEqual(audits.map((e) => e.action).sort(), ["contact.merge", "contact.merged_into"]);
  ok("a merge leaves one contact with every activity, membership, follow-up and email from both, audited (task 031)");
}

{
  const admin = await import("@/lib/market/contact-admin");
  const who = "admin@example.test";
  const gone = await writers.recordForm("contact", { rowKey: `d-${run}-1`, email: addr("forget-me"), name: "Fay Forget" });
  assert.ok(gone?.status === "recorded");
  const id = gone.contactId;
  // A second email, merged in earlier, is tombstoned too.
  const alt = await writers.recordForm("demo", { rowKey: `d-${run}-2`, email: `fay-${run}@gmail.com` });
  assert.ok(alt?.status === "recorded");
  await admin.mergeContacts(id, alt.contactId, who);
  await camp.upsertCampaign({ slug: `del-${run}`, name: "Delete check", visibility: "general" });
  await camp.addMember({ campaignSlug: `del-${run}`, contactId: id, code: `dl${run}`, briefLabel: `del-brief-${run}` });

  const summary = await admin.deleteContact(id, who);
  assert.deepEqual(summary, { activities: 2, memberships: 1, followUps: 0, emails: 2 });
  assert.equal(await contacts.getContact(id), null);
  assert.equal((await activity.listContactActivities(id)).length, 0);
  const month = await activity.listActivitiesInMonth(keys.monthKey(Date.now()), 5000);
  assert.ok(!month.some((a) => a.contactId === id), "gone from the month index");
  assert.equal(await camp.getMember(`del-${run}`, id), null);
  assert.equal(await camp.findMemberByCode(`dl${run}`), null);
  assert.equal(await camp.findMemberByBriefLabel(`del-brief-${run}`), null);

  // Re-running the same writes, or a new form, does not bring the person back (FR-17).
  for (const [kind, rowKey, email] of [
    ["contact", `d-${run}-1`, addr("forget-me")],
    ["demo", `d-${run}-2`, `fay-${run}@gmail.com`],
    ["contact", `d-${run}-3`, addr("Forget-Me").toUpperCase()],
  ] as const) {
    const r = await writers.recordForm(kind, { rowKey, email });
    assert.deepEqual(r, { status: "skipped", reason: "tombstoned" }, `${kind} ${rowKey}`);
  }
  assert.equal(await contacts.findContactByEmail(addr("forget-me")), null);

  const rows = (await auditLog.listAudit(keys.monthKey(Date.now()), 5000)).filter((e) => e.entityId === id);
  const del = rows.find((e) => e.action === "contact.delete");
  assert.ok(del);
  assert.ok(!JSON.stringify(del.changes).includes("@"), "no email in the audit");
  ok("a delete removes the contact, activities, memberships and lookups, and nothing brings it back (FR-17, task 031)");
}

{
  const results = await import("@/lib/market/results");
  const admin = await import("@/lib/market/campaign-admin");
  const who = "admin@example.test";
  const roles = ["admin", "investor"];
  const slug = `results-${run}`;
  const day = (d: string) => `${d}T15:00:00.000Z`;

  const created = await admin.createCampaign(
    admin.parseCampaign({ slug, name: "Results check", startDate: "2026-10-01", endDate: "2026-10-31" }),
    who,
  );
  assert.equal(created.visibility, "general", "the admin form defaults to all admins");
  await assert.rejects(admin.createCampaign({ slug, name: "Again" }, who), admin.CampaignError);

  const people = ["ann", "bob", "cat", "dan", "eve"].map((n) => addr(`res-${n}`));
  for (const email of people) await contacts.resolveContact({ email }, { source: "check" });
  const added = await admin.addMembers(
    slug,
    admin.parseAddMembers({ contacts: [...people, addr("nobody")].join("\n"), group: "Wave 1" }),
    roles,
    who,
  );
  assert.deepEqual(added, { added: 5, updated: 0, notFound: [addr("nobody")] }, "a typo never creates a contact");
  await camp.addMember({ campaignSlug: slug, contactId: (await contacts.findContactByEmail(people[2]))!.id, code: `rc${run}` });

  const rec = (type: string, email: string, when: string, extra: Record<string, unknown> = {}) =>
    activity.recordActivity({ type: type as never, source: "check", sourceId: `${run}-${type}-${email}-${when}`, occurredAt: day(when), email, ...extra });
  // Hand count: ann sent and replied; bob sent and bounced; cat sent and read the brief; dan met; eve nothing in window.
  await rec("email.sent", people[0], "2026-10-02");
  await rec("email.received", people[0], "2026-10-04");
  await rec("email.sent", people[1], "2026-10-02");
  await rec("email.bounced", people[1], "2026-10-02");
  await rec("email.sent", people[2], "2026-10-02");
  await rec("ask_ai.click", people[2], "2026-10-02", { email: undefined, memberCode: `rc${run}` }); // a gateway on delivery
  await rec("brief.read", people[2], "2026-10-03", { email: undefined, memberCode: `rc${run}` });
  await rec("meeting.booked", people[3], "2026-11-10");
  await rec("email.sent", people[4], "2026-09-15"); // before the start
  await rec("email.received", people[4], "2026-10-05", { campaignSlug: "another" }); // another campaign's

  const first = await results.campaignResults(slug, roles, { now: new Date(day("2026-11-21")) });
  assert.ok(first);
  assert.deepEqual(first.funnel, { members: 5, sent: 3, delivered: 2, engaged: 1, replied: 1, meeting: 1 });
  const status = (email: string) => first.rows.find((r) => r.contactEmail === email)?.effective;
  assert.deepEqual(people.map(status), ["replied", "bounced", "engaged", "meeting", "planned"]);
  assert.equal(first.groups.join(), "Wave 1");
  ok("a made-up campaign's funnel matches the hand-counted activities (task 033)");

  // Override: kept through a recompute and shown; audited; clearing goes back to the derived status.
  const bob = (await contacts.findContactByEmail(people[1]))!.id;
  await admin.overrideStatus(slug, bob, "replied", who);
  await results.recomputeCampaign(slug);
  await rec("email.sent", people[1], "2026-10-09"); // new activity, then another recompute
  await results.recomputeCampaign(slug);
  const second = (await results.campaignResults(slug, roles, { recompute: false }))!;
  const bobRow = second.rows.find((r) => r.contactId === bob)!;
  assert.equal(bobRow.statusOverride, "replied");
  assert.equal(bobRow.effective, "replied");
  assert.equal(bobRow.status, "bounced", "the derived status is kept beside the override");
  assert.equal(second.funnel.replied, 2);
  assert.equal(second.funnel.delivered, 3, "an override past bounced counts as delivered");
  const audits = (await auditLog.listAudit(keys.monthKey(Date.now()), 5000)).filter((e) => e.entityId === `${slug}/${bob}`);
  assert.equal(audits.length, 1);
  assert.equal(audits[0].action, "member.status_override");
  assert.deepEqual(audits[0].changes, [{ field: "statusOverride", to: "replied" }]);
  await admin.overrideStatus(slug, bob, null, who);
  assert.equal((await camp.getMember(slug, bob))?.statusOverride, undefined);
  ok("a manual override is kept through recomputes, shown beside the derived status, and audited (task 033)");

  // Edit: dates change the window and force a recompute.
  const edited = await admin.updateCampaign(slug, admin.parseCampaign({ startDate: "2026-09-01", notes: "Moved" }), who);
  assert.equal(edited?.resultsAt, undefined);
  await assert.rejects(admin.updateCampaign(slug, { endDate: "2026-08-01" }, who), admin.CampaignError);
  const third = (await results.campaignResults(slug, roles))!;
  assert.equal(third.rows.find((r) => r.contactEmail === people[4])?.effective, "sent", "an earlier start takes in eve's email");
  // Members of a general campaign whose contact is investor stay hidden without the role.
  const hidden = await contacts.resolveContact({ email: addr("res-lp", `fund-${run}.example.test`) }, { visibility: "investor", source: "check" });
  assert.ok(hidden.status === "created");
  await camp.addMember({ campaignSlug: slug, contactId: hidden.contact.id });
  const general = (await results.campaignResults(slug, ["admin"]))!;
  assert.equal(general.funnel.members, 5);
  assert.equal((await results.campaignResults(slug, roles))!.funnel.members, 6);
  ok("campaign edits are checked and audited; hidden contacts are not counted without the investor role (task 033)");
}

{
  // NFR-04: a campaign of 500 members loads in under 2 seconds.
  const results = await import("@/lib/market/results");
  const slug = `big-${run}`;
  await camp.upsertCampaign({ slug, name: "Big", visibility: "general", startDate: "2026-10-01" });
  const emails = Array.from({ length: 500 }, (_, i) => addr(`big-${i}`));
  await results.mapLimit(emails, 16, async (email) => {
    const r = await activity.recordActivity({ type: "email.sent", source: "check", sourceId: `big-${run}-${email}`, occurredAt: "2026-10-02T15:00:00Z", email });
    assert.ok(r.status === "recorded");
    await camp.addMember({ campaignSlug: slug, contactId: r.contactId, group: `G${email.length % 3}` });
  });
  let t0 = performance.now();
  const cold = await results.campaignResults(slug, ["admin"]);
  const coldMs = performance.now() - t0;
  t0 = performance.now();
  const warm = await results.campaignResults(slug, ["admin"]);
  const warmMs = performance.now() - t0;
  assert.equal(cold?.funnel.sent, 500);
  assert.equal(warm?.rows.length, 500);
  assert.ok(coldMs < 2000, `with a recompute: ${coldMs.toFixed(0)} ms`);
  assert.ok(warmMs < 2000, `stored statuses: ${warmMs.toFixed(0)} ms`);
  ok(`a 500-member campaign loads in ${warmMs.toFixed(0)} ms, ${coldMs.toFixed(0)} ms when it derives statuses first (NFR-04, task 033)`);
}

{
  // FR-14 and success criterion 5: a lead export imports cleanly, and a second import adds nothing.
  const lead = await import("@/lib/market/linkedin-import");
  const results = await import("@/lib/market/results");
  const { readFileSync } = await import("node:fs");
  const csv = readFileSync("scripts/market/fixtures/linkedin-leads-sample.csv", "utf8")
    .replaceAll(".example.test", `-${run}.example.test`)
    .replaceAll("FAKE-", `FAKE-${run}-`);
  const slug = `li-${run}`;
  const campaign = (await camp.upsertCampaign({ slug, name: "LinkedIn leads", kind: "linkedin", visibility: "general", utmCampaign: "dpp" }))!;
  const roles = ["admin"];
  const who = "check@example.test";

  const before = await lead.previewImport(lead.parseImportRequest({ csv }));
  assert.deepEqual(
    { total: before.total, ready: before.ready, alreadyImported: before.alreadyImported, skipped: before.skipped },
    { total: 8, ready: 4, alreadyImported: 0, skipped: 4 },
  );
  assert.equal(before.sample.length, 8);

  const first = await lead.runImport(lead.parseImportRequest({ csv, campaign: slug, confirm: true }), campaign, roles, who);
  assert.deepEqual(
    { imported: first.imported, newContacts: first.newContacts, alreadyImported: first.alreadyImported, skipped: first.skipped, membersAdded: first.membersAdded },
    { imported: 4, newContacts: 3, alreadyImported: 0, skipped: 4, membersAdded: 3 },
  );
  assert.deepEqual(first.skippedRows.map((r) => r.line), [6, 7, 8, 10]);

  const jordan = (await contacts.findContactByEmail(`jordan.placeholder@contoso-${run}.example.test`))!;
  assert.equal(jordan.name, "Jordan Placeholder");
  assert.equal(jordan.title, "Director, Legal Operations");
  assert.equal(jordan.kind, "prospect");
  assert.equal(jordan.source, "linkedin.lead");
  assert.equal((await orgs.getOrganization(jordan.organizationId!))?.name, "Contoso");
  const avery = (await contacts.findContactByEmail(`avery.sample@northwind-${run}.example.test`))!;
  const averyLog = await activity.listContactActivities(avery.id);
  assert.equal(averyLog.length, 2, "two submissions, one contact");
  assert.ok(averyLog.every((a) => a.type === "linkedin.lead" && a.campaignSlug === slug && a.source === "linkedin-csv"));
  assert.deepEqual(averyLog[0].utm, { source: "linkedin", medium: "paid", campaign: "dpp", term: undefined, content: undefined });
  assert.equal(averyLog[1].occurredAt, "2026-12-19T15:02:11.000Z");
  assert.equal(averyLog[1].summary, "LinkedIn lead form: Design Partner Program");

  const res = (await results.campaignResults(slug, roles))!;
  assert.equal(res.funnel.members, 3);
  assert.equal(res.funnel.engaged, 3);

  // Second run: nothing new.
  const again = await lead.previewImport(lead.parseImportRequest({ csv }));
  assert.equal(again.ready, 0);
  assert.equal(again.alreadyImported, 4);
  const second = await lead.runImport(lead.parseImportRequest({ csv, campaign: slug, confirm: true }), campaign, roles, who);
  assert.deepEqual(
    { imported: second.imported, newContacts: second.newContacts, alreadyImported: second.alreadyImported, membersAdded: second.membersAdded },
    { imported: 0, newContacts: 0, alreadyImported: 4, membersAdded: 0 },
  );
  assert.equal((await activity.listContactActivities(avery.id)).length, 2);
  assert.equal((await camp.listMembers(slug)).length, 3);

  // Nothing from the file is stored beyond the mapped fields: an unmapped column's value appears in no table.
  for (const name of ["contacts", "organizations", "activities", "activityByMonth", "members", "campaigns", "audit"] as const) {
    const table = await getTable(name);
    for await (const e of table!.listEntities()) {
      assert.ok(!JSON.stringify(e).includes("Made-up Country"), `${name} holds an unmapped value`);
    }
  }
  const audits = (await auditLog.listAudit(keys.monthKey(Date.now()), 5000)).filter((e) => e.action === "import.linkedin" && e.entityId === slug);
  assert.equal(audits.length, 2);
  assert.ok(!JSON.stringify(audits).includes(`-${run}.example.test`), "the audit holds counts, not lead addresses");
  ok("a LinkedIn lead export imports contacts, activities and members, and a second import adds nothing (FR-14, task 053)");
}

{
  // Timing: 500 leads in one import, as a ceiling for the request time on the live site.
  const lead = await import("@/lib/market/linkedin-import");
  const slug = `li-big-${run}`;
  const campaign = (await camp.upsertCampaign({ slug, name: "Many leads", kind: "linkedin", visibility: "general" }))!;
  const lines = ["Lead ID,Submitted At,First Name,Last Name,Email Address,Company Name"];
  for (let i = 0; i < 500; i++) lines.push(`BIG-${run}-${i},2026-12-2${i % 9} 10:00:00,Lead,${i},lead${i}@big${i % 40}-${run}.example.test,Big ${i % 40}`);
  const t0 = performance.now();
  const r = await lead.runImport(lead.parseImportRequest({ csv: lines.join("\n"), campaign: slug, confirm: true }), campaign, ["admin"], "check@example.test");
  const ms = performance.now() - t0;
  assert.equal(r.imported, 500);
  assert.equal(r.membersAdded, 500);
  ok(`500 leads import in ${(ms / 1000).toFixed(1)} s against the emulator (task 053)`);
}

{
  // FR-11: one follow-up on a contact through its statuses, and the due list on /admin.
  const fu = await import("@/lib/market/followups");
  const fa = await import("@/lib/market/followup-admin");
  const who = "admin@example.test";
  const roles = ["admin"];
  const today = fu.todayKey();
  const r = await contacts.resolveContact({ email: addr("fu-one"), name: "Finn Followup" }, { source: "check" });
  assert.ok(r.status === "created");
  const c = r.contact;

  const past = "2026-01-05";
  const f = await fa.addFollowUp(c, fa.parseNewFollowUp({ title: "Send the deck", dueDate: past, notes: "Line one\nLine two" }), roles, who);
  assert.equal(f.status, "todo");
  assert.equal(f.notes, "Line one\nLine two");
  const later = await fa.addFollowUp(c, fa.parseNewFollowUp({ title: "Check in", dueDate: "2099-01-01" }), roles, who);
  let due = (await fa.dueForHome(roles)).filter((d) => d.contactId === c.id);
  assert.deepEqual(due.map((d) => [d.title, d.overdue]), [["Send the deck", past < today]], "only what is due by today");
  assert.equal(due[0].contactName, "Finn Followup");

  // Moving the due date moves the index row to the new month.
  await fa.changeFollowUp(c.id, f.id, { dueDate: today }, who);
  due = (await fa.dueForHome(roles)).filter((d) => d.contactId === c.id);
  assert.deepEqual(due.map((d) => [d.dueDate, d.overdue]), [[today, false]]);
  const table = (await getTable("followUps"))!;
  await assert.rejects(table.getEntity(`due:${past.slice(0, 7)}`, f.id), "the old index row is gone");

  // Sent closes it: off the due list, closed time set, one timeline entry.
  const sent = await fa.changeFollowUp(c.id, f.id, fa.parseFollowUpPatch({ status: "sent" }), who);
  assert.ok(sent?.closedAt);
  assert.equal((await fa.dueForHome(roles)).filter((d) => d.contactId === c.id).length, 0);
  await fa.changeFollowUp(c.id, f.id, { status: "drafted" }, who);
  assert.equal((await fa.dueForHome(roles)).filter((d) => d.contactId === c.id).length, 1, "reopened, it is due again");
  await fa.changeFollowUp(c.id, f.id, { status: "sent" }, who);
  const done = (await activity.listContactActivities(c.id)).filter((a) => a.type === "followup.done");
  assert.equal(done.length, 1, "sent twice, logged once");
  assert.equal(done[0].summary, "Send the deck (sent)");

  const list = await fu.listContactFollowUps(c.id);
  assert.deepEqual(list.map((x) => x.title), ["Check in", "Send the deck"], "open first");
  assert.ok(await fa.removeFollowUp(c.id, later.id, who));
  assert.equal(await fu.getFollowUp(c.id, later.id), null);
  await assert.rejects(table.getEntity("due:2099-01", later.id));

  const audits = (await auditLog.listAudit(keys.monthKey(Date.now()), 5000)).filter((e) => e.entityId.startsWith(`${c.id}/`));
  assert.deepEqual(
    [...new Set(audits.map((e) => e.action))].sort(),
    ["followup.create", "followup.delete", "followup.edit", "followup.status"],
  );

  // Investor contacts' follow-ups stay off the list without the role.
  const lp = await contacts.resolveContact({ email: addr("fu-lp", `fund-${run}.example.test`) }, { visibility: "investor", source: "check" });
  assert.ok(lp.status === "created");
  await fa.addFollowUp(lp.contact, fa.parseNewFollowUp({ title: "LP update", dueDate: past }), ["admin", "investor"], who);
  assert.equal((await fa.dueForHome(roles)).filter((d) => d.contactId === lp.contact.id).length, 0);
  assert.equal((await fa.dueForHome(["admin", "investor"])).filter((d) => d.contactId === lp.contact.id).length, 1);
  ok("a follow-up moves through its statuses, shows on the due list until closed, and every change is audited (task 034)");
}

{
  // FR-11 acceptance: bulk create adds exactly one per selected member, and a second run adds none.
  const fu = await import("@/lib/market/followups");
  const fa = await import("@/lib/market/followup-admin");
  const cadmin = await import("@/lib/market/contact-admin");
  const who = "admin@example.test";
  const roles = ["admin"];
  const slug = `fu-${run}`;
  await camp.upsertCampaign({ slug, name: "Follow-up check", visibility: "general", startDate: "2026-11-01" });
  const people = ["met-a", "met-b", "met-c", "quiet-d"].map((p) => addr(p));
  const ids: string[] = [];
  for (const [i, email] of people.entries()) {
    const rec = await activity.recordActivity({
      type: i < 3 ? "meeting.in_person" : "email.sent",
      source: "check",
      sourceId: `fu-${run}-${i}`,
      occurredAt: "2026-11-12T15:00:00Z",
      email,
      campaignSlug: slug,
    });
    assert.ok(rec.status === "recorded");
    ids.push(rec.contactId);
    await camp.addMember({ campaignSlug: slug, contactId: rec.contactId, group: i === 2 ? "Speakers" : "Attendees" });
  }
  await cadmin.editContact(ids[0], cadmin.parsePatch({ tags: ["Summit"] }), who);
  const { clearQueryCache } = await import("@/lib/market/queries");
  clearQueryCache();

  const input = fa.parseBulk({ title: "Thank-you after the Summit", dueDate: "2026-11-25", statuses: ["meeting"] });
  const first = await fa.bulkCreate(slug, input, roles, who);
  assert.deepEqual(first, { matched: 3, created: 3, existing: 0 });
  const second = await fa.bulkCreate(slug, fa.parseBulk({ title: "thank-you after the summit", dueDate: "2026-11-26", statuses: ["meeting"] }), roles, who);
  assert.deepEqual(second, { matched: 3, created: 0, existing: 3 });
  for (const id of ids.slice(0, 3)) assert.equal((await fu.listContactFollowUps(id)).length, 1, "exactly one each");
  assert.equal((await fu.listContactFollowUps(ids[3])).length, 0, "a member not selected gets none");
  assert.equal((await fu.listContactFollowUps(ids[0]))[0].dueDate, "2026-11-25", "the second run changed nothing");

  assert.deepEqual(await fa.bulkCreate(slug, fa.parseBulk({ title: "Speaker note", dueDate: "2026-11-25", group: "Speakers" }), roles, who), { matched: 1, created: 1, existing: 0 });
  assert.deepEqual(await fa.bulkCreate(slug, fa.parseBulk({ title: "Tagged", dueDate: "2026-11-25", tag: "summit" }), roles, who), { matched: 1, created: 1, existing: 0 });
  const bulkAudit = (await auditLog.listAudit(keys.monthKey(Date.now()), 5000)).filter((e) => e.action === "followup.bulk_create" && e.entityId === slug);
  assert.equal(bulkAudit.length, 4);

  // A merge carries follow-ups and their due rows to the survivor; a delete removes them.
  const thanks = fu.bulkFollowUpId(slug, "Thank-you after the Summit", ids[1]);
  await cadmin.mergeContacts(ids[0], ids[1], who);
  assert.ok(await fu.getFollowUp(ids[0], thanks), "moved to the survivor");
  const due = await fu.dueFollowUps("2026-11-30");
  assert.equal(due.find((d) => d.id === thanks)?.contactId, ids[0], "the due row follows");
  await cadmin.deleteContact(ids[2], who);
  assert.equal((await fu.dueFollowUps("2026-11-30")).filter((d) => d.contactId === ids[2]).length, 0);
  ok("bulk follow-ups: one per selected member, none added on a second run; merge and delete keep them consistent (FR-11, task 034)");
}

{
  // FR-16: the morning report lists follow-ups due and new contacts, and names no investor record.
  const fa = await import("@/lib/market/followup-admin");
  const daily = await import("@/lib/reports/daily");
  const { clearQueryCache } = await import("@/lib/market/queries");
  const who = "admin@example.test";
  const both = ["admin", "investor"];

  const g = await contacts.resolveContact({ email: addr("rep-gen"), name: "Gale General" }, { source: "form.contact" });
  const i = await contacts.resolveContact(
    { email: addr("rep-lp", `fund-${run}.example.test`), name: "Ivy Investor" },
    { visibility: "investor", source: "form.investor_overview" },
  );
  assert.ok(g.status === "created" && i.status === "created");
  await fa.addFollowUp(g.contact, fa.parseNewFollowUp({ title: "Report check overdue", dueDate: "2026-01-02" }), both, who);
  await fa.addFollowUp(i.contact, fa.parseNewFollowUp({ title: "Report check LP", dueDate: "2026-01-02" }), both, who);
  clearQueryCache();

  const fus = await daily.followUpsSection();
  assert.equal(fus.problem, undefined);
  const fuText = fus.lines.join("\n");
  assert.match(fuText, /\[overdue, due Jan 2\] Report check overdue: Gale General </);
  assert.match(fuText, /investor follow-ups? \(hidden\)/);
  assert.ok(!fuText.includes("Report check LP"), "an investor follow-up's title is not shown");

  const nc = await daily.newContactsSection(1);
  assert.equal(nc.problem, undefined);
  const ncText = nc.lines.join("\n");
  assert.match(ncText, new RegExp(`Gale General <rep-gen@co-${run}\\.example\\.test>, [^\\n]* \\(Contact form\\)`));
  assert.match(ncText, /investor contacts? \(hidden\)/);

  const text = daily.renderDailyReport({ date: "2026-11-22", sections: [fus, nc], quiet: false }, 1);
  for (const secret of ["Ivy Investor", `rep-lp@fund-${run}`, `fund-${run}`, "Report check LP"]) {
    assert.ok(!text.includes(secret), `the report must not show ${secret}`);
  }
  ok("the morning report lists due follow-ups and new contacts, and counts investor records without naming them (FR-16, task 060)");
}

{
  // FR-04 and task 032: organizations by domain, counts, edits and domain overrides.
  const oa = await import("@/lib/market/org-admin");
  const { clearQueryCache } = await import("@/lib/market/queries");
  const who = "admin@example.test";
  const both = ["admin", "investor"];
  const main = `org-${run}.example.test`;
  const alt = `orgalt-${run}.example.test`;

  const a = await contacts.resolveContact(
    { email: addr("ann", main), name: "Ann Main", organizationName: "Main Co" },
    { source: "form.contact" },
  );
  const b = await contacts.resolveContact({ email: addr("bo", main), name: "Bo Main" }, { source: "form.demo" });
  const c = await contacts.resolveContact({ email: addr("cy", alt), name: "Cy Alt" }, { source: "form.contact" });
  const lp = await contacts.resolveContact(
    { email: addr("lp", alt), name: "Lee Partner" },
    { visibility: "investor", source: "form.investor_overview" },
  );
  assert.ok(a.status === "created" && b.status === "created" && c.status === "created" && lp.status === "created");
  assert.equal(a.contact.organizationId, main);
  assert.equal(b.contact.organizationId, main);
  for (const x of [a, b, c, lp]) {
    await activity.recordActivity({
      type: "note",
      source: "check",
      sourceId: `org-${run}-${x.contact.id.slice(0, 8)}`,
      occurredAt: new Date(),
      contactId: x.contact.id,
      summary: "Org check note",
    });
  }
  clearQueryCache();

  let list = await oa.loadOrganizations(both);
  assert.equal(list.find((o) => o.id === main)?.contactCount, 2, "two contacts at one domain list under one organization");
  assert.equal(list.find((o) => o.id === main)?.name, "Main Co");
  assert.equal(list.find((o) => o.id === alt)?.contactCount, 2);
  const general = await oa.loadOrganizations(["admin"]);
  assert.equal(general.find((o) => o.id === alt)?.contactCount, 1, "an investor contact is not counted without the role");

  const edited = await oa.editOrganization(
    main,
    oa.parseOrgPatch({ website: "https://main.example.test", notes: "Met at TLTF" }),
    who,
  );
  assert.equal(edited?.website, "https://main.example.test");
  assert.equal((await orgs.getOrganization(main))?.notes, "Met at TLTF");
  await oa.editOrganization(alt, oa.parseOrgPatch({ kind: "customer" }), who);

  // Point the alternate domain at Main Co: its contacts move and its own organization folds in.
  const added = await oa.addDomain(main, `@${alt.toUpperCase()}`, both, who);
  assert.equal(added.domain, alt);
  assert.equal(added.moved, 2);
  assert.ok(added.removedOrganization);
  assert.equal(await orgs.getOrganization(alt), null, "the emptied organization is removed");
  assert.equal((await contacts.getContact(c.contact.id))?.organizationId, main);
  assert.equal((await contacts.getContact(lp.contact.id))?.organizationId, main);
  assert.equal((await orgs.getOrganization(main))?.kind, "customer", "an empty field is filled from the folded organization");
  const later = await contacts.resolveContact({ email: addr("di", alt), name: "Di Alt" }, { source: "form.contact" });
  assert.equal(later.contact.organizationId, main, "a new contact at the domain joins the chosen organization");
  await assert.rejects(oa.addDomain(main, alt, both, who), oa.OrgError, "adding it again is refused");
  await assert.rejects(oa.addDomain(main, main, both, who), oa.OrgError, "its own domain is refused");
  clearQueryCache();
  list = await oa.loadOrganizations(both);
  const row = list.find((o) => o.id === main);
  assert.equal(row?.contactCount, 5);
  assert.deepEqual(row?.otherDomains, [alt]);
  const detail = await oa.organizationDetail(main, both);
  assert.equal(detail?.contacts.length, 5);
  assert.ok(detail!.activity.length >= 4, "recent activity spans the organization's contacts");
  assert.equal(
    (await oa.organizationDetail(main, ["admin"]))?.contacts.length,
    4,
    "the investor contact is left out without the role",
  );

  // Removing the override sends the domain's contacts back to an organization of their own.
  const removed = await oa.removeDomain(main, alt, both, who);
  assert.equal(removed.moved, 3);
  for (const id of [c.contact.id, lp.contact.id, later.contact.id]) {
    assert.equal((await contacts.getContact(id))?.organizationId, alt);
  }
  assert.equal((await contacts.getContact(a.contact.id))?.organizationId, main, "the main domain's contacts stay");
  assert.equal(
    (await orgs.getOrganization(alt))?.visibility,
    "general",
    "the recreated organization is general once a general contact joins",
  );
  await assert.rejects(oa.removeDomain(main, alt, both, who), oa.OrgError);

  // An investor organization is hidden, and an admin without the role cannot move its domain.
  const fund = `vc-${run}.example.test`;
  await contacts.resolveContact(
    { email: addr("gp", fund), name: "Gil Fund" },
    { visibility: "investor", source: "form.investor_overview" },
  );
  assert.ok(await oa.visibleOrganization(fund, both));
  assert.equal(await oa.visibleOrganization(fund, ["admin"]), null);
  await assert.rejects(oa.addDomain(main, fund, ["admin"], who), oa.OrgError);
  await assert.rejects(oa.addDomain(fund, alt, ["admin"], who), oa.OrgError, "an organization the user cannot see");

  const log = await auditLog.listAudit(keys.monthKey(Date.now()), 10_000);
  const actions = log.filter((e) => e.entityId === main || e.entityId === alt).map((e) => e.action);
  for (const want of ["organization.edit", "organization.domain_add", "organization.merged_into", "organization.domain_remove"]) {
    assert.ok(actions.includes(want), `audited: ${want}`);
  }
  assert.ok(!log.some((e) => JSON.stringify(e).includes(`ann@${main}`)), "the audit holds no email address");
  ok("contacts at one domain list under one organization; an override moves a domain's contacts and can be undone, audited (FR-04, task 032)");
}

{
  // Task 041: the mailbox registry.
  const mb = await import("@/lib/market/mailboxes");
  const who = "admin@example.test";
  const address = addr("inbox", `mb-${run}.example.test`);

  const m = await mb.addMailbox(mb.parseNewMailbox({ address: address.toUpperCase(), kind: "shared", label: "Team" }), who);
  assert.equal(m.id, keys.emailHash(address), "the row key is the address hash");
  assert.equal(m.enabled, true);
  await assert.rejects(mb.addMailbox(mb.parseNewMailbox({ address }), who), (e: unknown) => e instanceof mb.MailboxError && e.status === 409);
  assert.ok((await mb.listMailboxes()).some((x) => x.id === m.id));

  const paused = await mb.editMailbox(m.id, { enabled: false }, who);
  assert.equal(paused.enabled, false);
  assert.ok(!(await mb.enabledMailboxes()).some((x) => x.id === m.id), "a paused mailbox is not synced");
  await mb.editMailbox(m.id, { enabled: true }, who);
  const edited = await mb.editMailbox(m.id, { label: "", mode: "known-only" }, who);
  assert.equal(edited.label, address, "an emptied label falls back to the address");
  assert.equal(edited.mode, "known-only");
  await assert.rejects(mb.editMailbox("0".repeat(64), { enabled: false }, who), (e: unknown) => e instanceof mb.MailboxError && e.status === 404);

  // The sync's outcome: an error keeps the last good time; a success clears the error.
  await mb.recordSync(m.id, {}, new Date("2026-11-22T10:00:00Z"));
  await mb.recordSync(m.id, { error: "This mailbox is not in the Exchange access scope yet." }, new Date("2026-11-22T10:30:00Z"));
  let got = await mb.getMailbox(m.id);
  assert.equal(got?.lastSyncAt, "2026-11-22T10:00:00.000Z");
  assert.equal(got?.lastError, "This mailbox is not in the Exchange access scope yet.");
  assert.equal(got?.label, address, "recording a sync keeps the admin's fields");
  await mb.recordSync(m.id, {}, new Date("2026-11-22T11:00:00Z"));
  got = await mb.getMailbox(m.id);
  assert.equal(got?.lastSyncAt, "2026-11-22T11:00:00.000Z");
  assert.equal(got?.lastError, undefined);

  // Check access, against canned Graph answers.
  const settings = { tenantId: "t", clientId: "c", clientSecret: "s" };
  const token = async () => "token";
  const denied = (async () =>
    new Response(JSON.stringify({ error: { code: "ErrorAccessDenied", message: "Access is denied." } }), { status: 403 })) as typeof fetch;
  const fine = (async () => new Response(JSON.stringify({ value: [] }), { status: 200 })) as typeof fetch;
  const down = (async () => {
    throw new TypeError("fetch failed");
  }) as typeof fetch;
  assert.deepEqual(await mb.checkAccess(got!, { settings, fetch: denied, token }), {
    ok: false,
    error: "This mailbox is not in the Exchange access scope yet.",
  });
  assert.equal((await mb.getMailbox(m.id))?.checkError, "This mailbox is not in the Exchange access scope yet.");
  assert.equal((await mb.getMailbox(m.id))?.lastError, undefined, "a check does not touch the sync's error");
  assert.equal((await mb.checkAccess(got!, { settings, fetch: down, token })).ok, false);
  assert.deepEqual(await mb.checkAccess(got!, { settings, fetch: fine, token }), { ok: true });
  got = await mb.getMailbox(m.id);
  assert.ok(got?.checkedAt && got.checkError === undefined);
  await assert.rejects(mb.checkAccess(got!, { settings: null }), (e: unknown) => e instanceof mb.MailboxError && e.status === 503);

  await mb.removeMailbox(m.id, who);
  assert.equal(await mb.getMailbox(m.id), null);
  await mb.recordSync(m.id, {});
  assert.equal(await mb.getMailbox(m.id), null, "a sync finishing after a removal does not bring the mailbox back");

  const actions = (await auditLog.listAudit(keys.monthKey(Date.now()), 2000)).filter((e) => e.entityId === m.id).map((e) => e.action);
  for (const a of ["mailbox.add", "mailbox.pause", "mailbox.resume", "mailbox.edit", "mailbox.remove"]) assert.ok(actions.includes(a), a);
  ok("mailboxes add, pause, resume, edit and remove with an audit entry each; sync and access-check outcomes are kept apart (task 041)");
}

{
  // Task 042: one sync run against canned Graph answers.
  const mb = await import("@/lib/market/mailboxes");
  const sync = await import("@/lib/market/sync");
  const fu = await import("@/lib/market/followups");
  const tri = await import("@/lib/market/triage");
  const who = "admin@example.test";
  const dom = `sync-${run}.example.test`;
  const own = `ralph@own-${run}.example.test`;
  const team = `team@own-${run}.example.test`;
  const denied = `nobody@own-${run}.example.test`;

  const known = await contacts.resolveContact({ email: addr("known", dom), name: "Known Person" }, { source: "form.contact" });
  assert.ok(known.status === "created");
  const kid = known.contact.id;
  const now = new Date();
  const ago = (min: number) => new Date(now.getTime() - min * 60_000).toISOString();
  const f = await fu.createFollowUp({ contactId: kid, title: "Write back", dueDate: "2026-12-01", visibility: "general" }, new Date(ago(48 * 60)));
  assert.ok(f?.created);

  const personal = await mb.addMailbox(mb.parseNewMailbox({ address: own, kind: "personal" }), who);
  const shared = await mb.addMailbox(mb.parseNewMailbox({ address: team, kind: "shared" }), who);
  const deniedBox = await mb.addMailbox(mb.parseNewMailbox({ address: denied, kind: "personal" }), who);

  const msg = (id: string, at: string, from: string, to: string[], subject: string) => ({
    id,
    internetMessageId: `<${id}-${run}@mail.example.test>`,
    from: { emailAddress: { address: from } },
    toRecipients: to.map((a) => ({ emailAddress: { address: a } })),
    ccRecipients: [],
    subject,
    receivedDateTime: at,
    sentDateTime: at,
    webLink: "https://outlook.office365.com/owa/?ItemID=x",
  });
  const pages: Record<string, unknown[]> = {
    [`${own}/mailFolders/sentitems`]: [msg("s1", ago(60), own, [addr("known", dom), addr("stranger", dom)], "Hello")],
    [`${own}/mailFolders/inbox`]: [
      msg("r1", ago(30), addr("known", dom), [own], "Re: Hello"),
      msg("u1", ago(25), addr("unknown", dom), [own], "Personal note"),
      msg("n1", ago(20), "postmaster@own.example.test", [own], "Undeliverable: Hello"),
    ],
    [`${team}/mailFolders/inbox`]: [
      msg("t1", ago(15), addr("newlead", dom), [team], "Question about Spaarke"),
      msg("t2", ago(14), `noreply@${dom}`, [team], "Your receipt"),
      msg("t3", ago(13), addr("known", dom), [team], "Also writing here"),
    ],
  };
  const ndr = `Your message to ${addr("known", dom)} could not be delivered to the following recipients: ${addr("known", dom)}.`;
  const fake = (async (input: string | URL | Request) => {
    const url = decodeURIComponent(String(input));
    if (url.includes(denied)) return new Response(JSON.stringify({ error: { code: "ErrorAccessDenied" } }), { status: 403 });
    if (url.includes("/messages/n1?$select=body")) return new Response(JSON.stringify({ body: { content: ndr } }), { status: 200 });
    const key = Object.keys(pages).find((k) => url.includes(k));
    return new Response(JSON.stringify({ value: key ? pages[key] : [] }), { status: 200 });
  }) as typeof fetch;
  const settings = { tenantId: "t", clientId: "c", clientSecret: "s" };
  const opts = { settings, fetch: fake, token: async () => "token", deadline: Date.now() + 60_000, now };

  const first = await sync.syncAll(opts);
  const p = first.mailboxes.find((m) => m.id === personal.id)!;
  const s = first.mailboxes.find((m) => m.id === shared.id)!;
  const d = first.mailboxes.find((m) => m.id === deniedBox.id)!;
  assert.deepEqual([p.sent, p.received, p.bounced, p.triaged, p.followUpsClosed], [1, 1, 1, 0, 2], JSON.stringify(p));
  assert.deepEqual([s.received, s.triaged], [1, 1], "the shared inbox logs the known sender and queues only the new, human one");
  assert.equal(d.ok, false);
  assert.equal(d.error, "This mailbox is not in the Exchange access scope yet.");
  assert.equal((await mb.getMailbox(deniedBox.id))?.lastError, "This mailbox is not in the Exchange access scope yet.");
  assert.ok((await mb.getMailbox(personal.id))?.lastSyncAt, "the others still synced");

  const timeline = await activity.listContactActivities(kid);
  assert.deepEqual(
    timeline.map((a) => a.type).sort(),
    ["email.bounced", "email.received", "email.received", "email.sent", "followup.done"],
    "one followup.done when it closes as sent; the move to replied is in the audit log",
  );
  assert.ok(timeline.filter((a) => a.source === "graph").every((a) => a.mailbox), "each email activity names its mailbox");
  assert.equal(await contacts.findContactByEmail(addr("stranger", dom)), null, "known-only: an unknown recipient creates nothing");
  assert.equal(await contacts.findContactByEmail(addr("unknown", dom)), null);
  assert.equal(await contacts.findContactByEmail(addr("newlead", dom)), null, "triage does not create a contact");
  assert.equal((await fu.getFollowUp(kid, f!.followUp.id))?.status, "replied", "sent on the outgoing email, replied on the answer");

  const triTable = await getTable("triage");
  const queued: unknown[] = [];
  const filter = `PartitionKey eq '${keys.emailHash(addr("newlead", dom))}'`;
  for await (const e of triTable!.listEntities({ queryOptions: { filter } })) queued.push(e);
  assert.equal(queued.length, 1);
  assert.ok(!(await tri.isBlocked(addr("newlead", dom))));

  // A second run over the same messages adds nothing.
  const again = await sync.syncAll({ ...opts, deadline: Date.now() + 60_000 });
  const p2 = again.mailboxes.find((m) => m.id === personal.id)!;
  assert.deepEqual([p2.sent, p2.received, p2.bounced, p2.followUpsClosed], [0, 0, 0, 0]);
  assert.equal((await activity.listContactActivities(kid)).length, timeline.length, "re-running the sync leaves the count unchanged");
  assert.equal(again.mailboxes.find((m) => m.id === shared.id)!.triaged, 0);
  assert.ok(await sync.getCheckpoint(personal.id, "inbox"));

  // A deadline already passed: nothing starts and the mailboxes wait for the next run.
  const late = await sync.syncAll({ ...opts, deadline: Date.now() - 1 });
  assert.equal(late.mailboxes.length, 0);
  assert.ok(late.deferred >= 3);

  for (const m of [personal, shared, deniedBox]) await mb.removeMailbox(m.id, who);
  ok("mail sync logs known-contact mail once, logs bounces, queues new senders only for a shared inbox, closes follow-ups, and a failing mailbox does not stop the others (task 042)");
}

{
  // Task 043: accept, link, dismiss and clean up the triage queue.
  const mb = await import("@/lib/market/mailboxes");
  const tri = await import("@/lib/market/triage");
  const mk = await import("@/lib/market/mail-keys");
  const who = "admin@example.test";
  const both = ["admin", "investor"];
  const general = ["admin"];
  const dom = `tri-${run}.example.test`;
  const other = `trio-${run}.example.test`;

  const team = await mb.addMailbox(mb.parseNewMailbox({ address: `team@own3-${run}.example.test`, kind: "shared" }), who);
  const lp = await mb.addMailbox(mb.parseNewMailbox({ address: `lp@own3-${run}.example.test`, kind: "shared", visibility: "investor" }), who);
  const at = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();
  const q = (sender: string, key: string, h: number, box = team, name?: string) =>
    tri.queueTriage({ sender, name, subject: `About ${key}`, receivedAt: at(h), mailboxId: box.id, mailbox: box.address, messageKey: `${key}-${run}` });
  const sid = (email: string) => keys.emailHash(email);

  assert.ok(await q(addr("lead", dom), "m1", 5, team, "Lea Lead"));
  assert.ok(await q(addr("lead", dom), "m2", 4));
  assert.equal(await q(addr("lead", dom), "m2", 4), false, "a message is queued once");
  await q(addr("alias", dom), "m3", 3);
  await q(addr("spam1", other), "m4", 2);
  await q(addr("spam2", other), "m5", 2);
  await q(`someone-${run}@gmail.com`, "m6", 1);
  await q(addr("fund", dom), "m7", 1, lp);

  let list = await tri.listTriage(both);
  const mine = (l: typeof list) => l.filter((s) => [dom, other].includes(s.domain) || s.sender.endsWith(`-${run}@gmail.com`));
  assert.equal(mine(list).length, 6);
  assert.ok(!mine(await tri.listTriage(general)).some((s) => s.sender === addr("fund", dom)), "an investor mailbox's sender is hidden without the role");
  await assert.rejects(tri.acceptSender(sid(addr("fund", dom)), general, who), (e: unknown) => e instanceof tri.TriageError && e.status === 404);

  // Accept: one contact, one activity per queued message, the queue emptied.
  const acc = await tri.acceptSender(sid(addr("lead", dom)), both, who);
  assert.ok(acc.created);
  assert.equal(acc.activities, 2);
  const lead = await contacts.findContactByEmail(addr("lead", dom));
  assert.equal(lead?.name, "Lea Lead");
  assert.equal(lead?.source, "email.received");
  const acts = await activity.listContactActivities(acc.contactId);
  assert.deepEqual(acts.map((a) => a.type), ["email.received", "email.received"]);
  assert.ok(acts.every((a) => a.mailbox === team.address && a.subject?.startsWith("About")));
  const again = await activity.recordActivity({
    type: "email.received",
    source: mk.SYNC_SOURCE,
    sourceId: mk.emailSourceId("email.received", `m1-${run}`, addr("lead", dom)),
    occurredAt: at(5),
    contactId: acc.contactId,
  });
  assert.equal(again.status, "duplicate", "the sync seeing the same message later logs nothing new");
  await assert.rejects(tri.acceptSender(sid(addr("lead", dom)), both, who), (e: unknown) => e instanceof tri.TriageError && e.status === 404);

  // Investor mailbox: the accepted contact is investor-only.
  const fund = await tri.acceptSender(sid(addr("fund", dom)), both, who);
  assert.equal((await contacts.getContact(fund.contactId))?.visibility, "investor");

  // Link: the sender becomes another address of an existing contact.
  await assert.rejects(tri.linkSender(sid(addr("alias", dom)), addr("nobody", dom), both, who), (e: unknown) => e instanceof tri.TriageError && e.status === 404);
  const linked = await tri.linkSender(sid(addr("alias", dom)), addr("lead", dom), both, who);
  assert.equal(linked.contactId, acc.contactId);
  assert.equal(linked.activities, 1);
  assert.equal((await contacts.findContactByEmail(addr("alias", dom)))?.id, acc.contactId, "the alias now finds the contact");

  // Dismiss: a sender, then a domain; a free-mail domain only as a sender.
  await assert.rejects(tri.dismissSender(sid(`someone-${run}@gmail.com`), "domain", both, who), (e: unknown) => e instanceof tri.TriageError && e.status === 400);
  const ds = await tri.dismissSender(sid(`someone-${run}@gmail.com`), "sender", both, who);
  assert.equal(ds.dismissed, 1);
  assert.ok(await tri.isBlocked(`someone-${run}@gmail.com`));
  assert.ok(!(await tri.isBlocked(`another-${run}@gmail.com`)), "dismissing a sender does not block their provider");
  const dd = await tri.dismissSender(sid(addr("spam1", other)), "domain", both, who);
  assert.deepEqual([dd.domain, dd.dismissed], [other, 2], "both waiting senders at the domain are dismissed");
  assert.ok(await tri.isBlocked(addr("someone-new", other)), "a new sender at a dismissed domain is blocked");
  assert.equal(mine(await tri.listTriage(both)).length, 0, "nothing of this run is left waiting");
  assert.equal(await contacts.findContactByEmail(addr("spam1", other)), null, "dismissing creates no contact");

  // Cleanup after 30 days: the dismissed entries go; the blocks stay.
  const t = await getTable("triage");
  const dismissedRows = async () => {
    let n = 0;
    for (const pk of [sid(addr("spam1", other)), sid(addr("spam2", other)), sid(`someone-${run}@gmail.com`)]) {
      for await (const _ of t!.listEntities({ queryOptions: { filter: `PartitionKey eq '${pk}'` } })) n++;
    }
    return n;
  };
  assert.equal(await dismissedRows(), 3);
  await tri.cleanupDismissed(new Date(Date.now() + 29 * 86_400_000));
  assert.equal(await dismissedRows(), 3, "kept for 30 days");
  await tri.cleanupDismissed(new Date(Date.now() + 31 * 86_400_000));
  assert.equal(await dismissedRows(), 0);
  assert.ok(await tri.isBlocked(addr("spam2", other)));

  const actions = (await auditLog.listAudit(keys.monthKey(Date.now()), 5000)).map((e) => e.action);
  for (const a of ["triage.accept", "triage.link", "triage.dismiss_sender", "triage.dismiss_domain"]) assert.ok(actions.includes(a), a);

  for (const m of [team, lp]) await mb.removeMailbox(m.id, who);
  ok("triage accepts a sender into one contact with their mail, links one to an existing contact, dismisses a sender or a domain for good, and deletes dismissed entries after 30 days (task 043)");
}

{
  // Task 050: run a made-up TLTF import twice. The campaign slug is fixed, so
  // codes and addresses carry the run tag and the counts are this run's members.
  const tltf = await import("@/lib/market/tltf-import");
  const { runTltfImport } = await import("@/lib/market/tltf-run");
  const { parseCsv } = await import("@/lib/market/csv");
  const results = await import("@/lib/market/results");
  const contactsLib = await import("@/lib/market/contacts");
  const activity = await import("@/lib/market/activity");

  const c = (n: string) => `K${run}-${n}`;
  const dom = `tltf-${run}.example.test`;
  const outreachCsv = parseCsv(
    [
      "file,group,template,to,email source,check before sending,status,result,reply",
      `"${c("01")} Pat Example (Fund One).eml",1,A,pat@${dom},pattern,,sent 2026-11-13,,"Interested"`,
      `"${c("02")} Fund Two.eml",1,B,info@${dom},general inbox,,sent 2026-11-13,bounced: address not found,`,
      `"${c("03")} Lee Example (Fund Three).eml",2,C,lee@${dom},pattern,,sent 2026-11-13,,`,
    ].join("\n"),
  );
  const keysCsv = parseCsv(`code,key\n${c("01")},key-${run}-1\n${c("02")},key-${run}-2\n${c("03")},key-${run}-3\n`);
  const people = tltf.parsePeople([{ match: [`lee@${dom}`], title: "Partner", context: "Met at a dinner." }]);
  const calendar = tltf.parseCalendar([
    { subject: "Coffee", start: { dateTime: "2026-11-17T10:00:00", timeZone: "Eastern Standard Time" }, attendees: ["ralph@spaarke.com", `lee@${dom}`, `robin@${dom}`], isCancelled: false },
  ]);
  const plan = tltf.buildPlan(tltf.parseOutreach(outreachCsv, tltf.parseBriefKeys(keysCsv), people), calendar, people, 3);

  const first = await runTltfImport(plan, "check");
  assert.ok(["created", "kept", "dates set"].includes(first.campaign));
  assert.deepEqual(first.contacts, { created: 4, found: 0, skipped: 0 });
  assert.deepEqual(first.members, { added: 4, updated: 0, failed: 0 });
  assert.deepEqual(first.activities, { recorded: plan.activities.length, duplicate: 0, skipped: 0 });

  const campaign = await camp.getCampaign("tltf-2026");
  assert.equal(campaign!.visibility, "investor");
  assert.ok(campaign!.startDate, "the campaign has dates, so the imported history counts");

  const ids = new Set(["pat", "info", "lee", "robin"].map((l) => keys.emailHash(`${l}@${dom}`)));
  const mine = async () => (await camp.listMembers("tltf-2026")).filter((m) => ids.has(m.contactId));
  const f1 = results.funnelOf(await mine());
  assert.deepEqual(f1, { members: 4, sent: 3, delivered: 2, engaged: 0, replied: 1, meeting: 2 });

  const lee = await camp.getMember("tltf-2026", keys.emailHash(`lee@${dom}`));
  assert.equal(lee!.group, "G2", "the Summit pass keeps the outreach group");
  assert.equal(lee!.code, `tltf-${c("03")}`);
  assert.equal(lee!.briefKeyHash, keys.sha256(`key-${run}-3`));
  assert.equal(lee!.status, "meeting");
  const robin = await camp.getMember("tltf-2026", keys.emailHash(`robin@${dom}`));
  assert.equal(robin!.group, "Summit");
  assert.deepEqual(await camp.findMemberByCode(`tltf-${c("01")}`), { campaignSlug: "tltf-2026", contactId: keys.emailHash(`pat@${dom}`) });
  assert.equal((await camp.findMemberByBriefLabel(`tltf-2026:${c("02")}`))!.contactId, keys.emailHash(`info@${dom}`));

  const leeContact = await contactsLib.getContact(keys.emailHash(`lee@${dom}`));
  assert.equal(leeContact!.visibility, "investor");
  assert.equal(leeContact!.kind, "investor");
  assert.equal(leeContact!.title, "Partner");
  const timeline = await activity.listContactActivities(leeContact!.id);
  assert.deepEqual(timeline.map((a) => a.type).sort(), ["email.sent", "meeting.in_person", "note"]);
  assert.ok(timeline.every((a) => a.campaignSlug === "tltf-2026" && a.memberId === leeContact!.id && a.visibility === "investor"));

  // A status override (a meeting that did not happen) survives a second run.
  await camp.setStatusOverride("tltf-2026", keys.emailHash(`robin@${dom}`), "planned");
  const second = await runTltfImport(plan, "check");
  assert.deepEqual(second.contacts, { created: 0, found: 4, skipped: 0 });
  assert.deepEqual(second.members, { added: 0, updated: 4, failed: 0 });
  assert.deepEqual(second.activities, { recorded: 0, duplicate: plan.activities.length, skipped: 0 });
  const after = await mine();
  assert.equal(after.find((m) => m.contactId === keys.emailHash(`robin@${dom}`))!.statusOverride, "planned");
  assert.equal(results.funnelOf(after).sent, 3, "a second run changes no counts");
  assert.equal(results.funnelOf(after).replied, 1);
  ok("TLTF import writes contacts, members and history once, and a second run changes nothing (task 050)");
}

{
  // Task 052: backfill made-up rows twice, beside writes the live writers already made.
  const bf = await import("@/lib/market/backfill");
  const contactAdmin = await import("@/lib/market/contact-admin");
  const at = (iso: string) => ({ createdAt: iso });
  const who = (n: string) => addr(`bf-${n}`);

  // A form the live writer already logged, and a person since deleted.
  await writers.recordForm("contact", { rowKey: `live-${run}`, email: who("live"), occurredAt: Date.parse("2026-11-21T10:00:00Z") });
  const gone = await contacts.resolveContact({ email: who("gone") });
  assert.ok(gone.status === "created");
  await contactAdmin.deleteContact(gone.contact.id, "check");

  // A member whose click was logged live, with the label the export lacks.
  const slug = `bf-${run}`;
  await camp.upsertCampaign({ slug, name: "Backfill check", startDate: "2026-11-01" });
  const reader = await contacts.resolveContact({ email: who("reader") });
  assert.ok(reader.status === "created");
  await camp.addMember({ campaignSlug: slug, contactId: reader.contact.id, code: `bf${run}`, briefLabel: `${slug}:R-01` });
  const liveClick = Date.parse("2026-11-21T12:00:00.400Z");
  await writers.recordAskClick("claude", `bf${run}`, `${slug}:R-01`, liveClick);

  const input = {
    forms: {
      contact: [
        { rowKey: `c1-${run}`, name: "Pat", email: who("pat"), reason: "demo", ...at("2026-10-01T10:00:00Z"), utm_source: "linkedin" },
        { rowKey: `live-${run}`, email: who("live"), ...at("2026-11-21T10:00:00Z") },
        { rowKey: `c3-${run}`, email: who("gone"), ...at("2026-10-03T10:00:00Z") },
        { rowKey: `c4-${run}`, email: `tester-${run}@spaarke.com`, ...at("2026-10-03T11:00:00Z") },
      ],
      early_release: [{ rowKey: `e1-${run}`, email: who("early"), source: "home", signedUpAt: "2026-10-04T10:00:00Z" }],
    },
    bookings: [
      { rowKey: `bkf-${run}`, status: "rescheduled", start: "2026-10-20T14:00:00Z", name: "M", email: who("meet"), guests: JSON.stringify([who("guest")]), ...at("2026-10-05T10:00:00Z"), movedAt: "2026-10-06T10:00:00Z" },
      { rowKey: `bkf2-${run}`, status: "failed", start: "2026-10-20T14:00:00Z", email: who("failed"), ...at("2026-10-05T10:00:00Z") },
    ],
    events: bf.parseEvents([
      { timestamp: "2026-11-14T04:00:00Z", name: "brief.read", customDimensions: { label: `${slug}:R-01` } },
      // The live click, a second later in App Insights: already logged.
      { timestamp: "2026-11-21T12:00:01.100Z", name: "ask_ai.click", customDimensions: { provider: "claude", src: `bf${run}` } },
      { timestamp: "2026-11-14T05:00:00Z", name: "ask_ai.click", customDimensions: { provider: "chatgpt", src: `bf${run}` } },
      { timestamp: "2026-11-14T05:00:00Z", name: "ask_ai.click", customDimensions: { provider: "claude", src: `gyga-${run}` } },
      { timestamp: "2026-11-14T05:00:00Z", name: "ask_ai.click", customDimensions: { provider: "claude", src: "article" } },
    ]),
    hostTimeZone: "America/New_York",
  };

  const dry = await bf.runBackfill(input, { write: false });
  assert.deepEqual(dry.ContactSubmissions, { rows: 4, activities: 4, added: 1, already: 1, skipped: { "deleted contact": 1, "a Spaarke address": 1 } });
  const first = await bf.runBackfill(input, { write: true, who: "check" });
  assert.deepEqual(first.ContactSubmissions, dry.ContactSubmissions, "the dry run counts what the run does");
  assert.deepEqual(first.EarlyReleaseSignups, { rows: 1, activities: 1, added: 1, already: 0, skipped: {} });
  assert.deepEqual(first.MeetingBookings, { rows: 2, activities: 4, added: 4, already: 0, skipped: { "not a held booking": 1 } });
  assert.deepEqual(first["brief.read"], { rows: 1, activities: 1, added: 1, already: 0, skipped: {} });
  assert.deepEqual(first["ask_ai.click"], {
    rows: 4,
    activities: 3,
    added: 1,
    already: 1,
    skipped: { "no member for the code or label": 1, "a site click, not a recipient": 1 },
  });

  const pat = (await contacts.findContactByEmail(who("pat")))!;
  const [form] = await activity.listContactActivities(pat.id);
  assert.equal(form.occurredAt, "2026-10-01T10:00:00.000Z", "the original time");
  assert.equal(form.utm?.source, "linkedin");
  assert.equal(form.source, "ContactSubmissions");
  assert.equal(await contacts.findContactByEmail(who("gone")), null, "a deleted contact stays deleted");
  assert.equal(await contacts.findContactByEmail(`tester-${run}@spaarke.com`), null, "the team's own tests make no contact");
  const readerLog = await activity.listContactActivities(reader.contact.id);
  assert.equal(readerLog.filter((a) => a.type === "ask_ai.click").length, 2, "the live click plus the earlier one, not three");
  assert.ok(readerLog.every((a) => a.campaignSlug === slug));
  const meetLog = await activity.listContactActivities((await contacts.findContactByEmail(who("meet")))!.id);
  assert.deepEqual(meetLog.map((a) => a.type).sort(), ["meeting.booked", "meeting.rescheduled"]);

  const second = await bf.runBackfill(input, { write: true, who: "check" });
  for (const [source, c] of Object.entries(second)) {
    assert.equal(c.added, 0, `${source}: a second run adds nothing`);
  }
  ok("backfill keeps times and UTM, skips what the live writers logged, deleted contacts and Spaarke addresses, and a second run adds nothing (FR-13, task 052)");
}

{
  // A table endpoint that never answers: the safe call must give up on time.
  process.env.STORAGE_ACCOUNT_CONNECTION =
    "TableEndpoint=http://10.255.255.1:10002/devstoreaccount1;SharedAccessSignature=sv=2020-08-04&sig=unused";
  resetTableClients();
  const started = Date.now();
  const r = await activity.recordActivitySafe(
    { type: "form.contact", source: "check", sourceId: `down-${run}`, occurredAt: new Date(), email: addr("down") },
    800,
  );
  const took = Date.now() - started;
  assert.deepEqual(r, { status: "failed", reason: "timeout" });
  assert.ok(took < 1500, `took ${took} ms`);

  delete process.env.STORAGE_ACCOUNT_CONNECTION;
  resetTableClients();
  const none = await activity.recordActivitySafe({
    type: "form.contact",
    source: "check",
    sourceId: `none-${run}`,
    occurredAt: new Date(),
    email: addr("none"),
  });
  assert.deepEqual(none, { status: "skipped", reason: "unavailable" });
  ok("recordActivitySafe gives up on time when storage hangs, and is a no-op without storage (FR-06)");
}

console.log(`\n${passed} checks passed.`);
// The abandoned request to the unreachable endpoint would otherwise hold the process open.
process.exit(0);
