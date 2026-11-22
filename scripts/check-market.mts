// Checks for the market access store and admin guard (projects/market-access,
// tasks 002, 010 to 013, 020 to 022, 030, 031, 033 and 053).
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
    act("brief.read", "2026-03-04", "spring"),
    act("email.received", "2026-03-05", "other"), // another campaign's reply
    act("note", "2026-03-06"),
    act("email.received", "2026-05-20"), // inside 60 days after the end
    act("meeting.booked", "2026-06-15"), // after the window
  ];
  const counted = results.memberActivities(campaign, member, acts);
  assert.deepEqual(
    counted.map((a: { type: string }) => a.type),
    ["email.sent", "brief.read", "email.received"],
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
