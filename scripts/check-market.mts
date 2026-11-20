// Checks for the market access store and admin guard (projects/market-access,
// tasks 002 and 010 to 013).
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
  assert.equal(idempotencyKey("ContactSubmissions", "row-1"), idempotencyKey("ContactSubmissions", "row-1"));
  assert.notEqual(idempotencyKey("ContactSubmissions", "row-1"), idempotencyKey("DemoRequests", "row-1"));
  assert.equal(SUMMARY_MAX, 280);
  ok("idempotency keys depend on source and source ID");
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
