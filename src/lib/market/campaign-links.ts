import { askLink, siteUrl } from "@/lib/ask-ai";
import { audit } from "@/lib/market/audit";
import { listMembers, type Campaign } from "@/lib/market/campaigns";
import { briefLabelFor } from "@/lib/market/codes";
import { LINK_PROVIDERS, type LinkProvider, type MemberLinks } from "@/lib/market/links-csv";
import { loadContacts } from "@/lib/market/queries";
import { listCampaignBriefRows } from "@/lib/private-brief";

/**
 * Each coded member's links (phase 2 FR-05): the private brief, Ask AI for
 * each provider, and a tagged link to a site page. Every link carries the
 * member's code or brief key, so a read or click counts for that member.
 */

const SITE_HOSTS = new Set(["spaarke.com", "www.spaarke.com"]);
const PATH_RE = /^\/[A-Za-z0-9\-._~/%]*$/;
/** Tags the export sets itself; any already in the entered address are dropped. */
const OWN_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "src", "k"];

export class LinksError extends Error {
  constructor(message: string, readonly status = 400) {
    super(message);
    this.name = "LinksError";
  }
}

/**
 * The site page for the tagged link: a path ("/platform") or a spaarke.com
 * address. Anything else is refused, so the export never carries a link to
 * another site. Returns the path and query, or null when none was entered.
 */
export function parsePagePath(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value !== "string") throw new LinksError("The page must be text");
  const raw = value.trim();
  if (!raw) return null;
  if (raw.length > 300) throw new LinksError("The page address is too long");
  let url: URL;
  try {
    url = new URL(raw, "https://www.spaarke.com");
  } catch {
    throw new LinksError("Enter a spaarke.com page, such as /platform");
  }
  if (url.protocol !== "https:" || !SITE_HOSTS.has(url.hostname) || url.username || url.password || url.port) {
    throw new LinksError("Enter a spaarke.com page, such as /platform");
  }
  if (!PATH_RE.test(url.pathname) || url.pathname.startsWith("//")) throw new LinksError("Enter a spaarke.com page, such as /platform");
  for (const p of OWN_PARAMS) url.searchParams.delete(p);
  const q = url.searchParams.toString();
  return `${url.pathname}${q ? `?${q}` : ""}`;
}

/** The page link for one member, tagged for the campaign and the member's code. */
export function taggedPageUrl(path: string, slug: string, code: string): string {
  const url = new URL(path, `${siteUrl()}/`);
  url.searchParams.set("utm_source", "email");
  url.searchParams.set("utm_medium", "outreach");
  url.searchParams.set("utm_campaign", slug);
  url.searchParams.set("src", code);
  return url.toString();
}

/**
 * The links for every coded member the user may see, sorted by name. A
 * member without an active brief row gets no brief link, and Ask AI then
 * carries the code alone. The export is audited with the count only.
 */
export async function campaignLinks(
  campaign: Campaign,
  roles: readonly string[],
  page: string | null,
  who: string,
  now = new Date(),
): Promise<MemberLinks[]> {
  const slug = campaign.slug;
  const [members, contacts, briefs] = await Promise.all([
    listMembers(slug),
    loadContacts(roles),
    listCampaignBriefRows(slug),
  ]);
  const byId = new Map(contacts.map((c) => [c.id, c]));
  const keyByLabel = new Map(briefs.filter((b) => b.active).map((b) => [b.label, b.key]));
  const site = siteUrl();
  const out: MemberLinks[] = [];

  for (const m of members) {
    if (!m.code) continue;
    const c = byId.get(m.contactId);
    if (!c) continue; // not visible to this user, or deleted
    const label = m.briefLabel ?? briefLabelFor(slug, m.code);
    const key = keyByLabel.get(label);
    const ask = Object.fromEntries(
      LINK_PROVIDERS.map((p) => [p, `${site}${askLink(p, m.code!, key)}`]),
    ) as Record<LinkProvider, string>;
    out.push({
      contactId: m.contactId,
      email: c.email,
      name: c.name,
      organization: c.organizationName,
      group: m.group,
      templateLabel: m.templateLabel,
      code: m.code,
      briefUrl: key ? `${site}/brief/${key}` : undefined,
      ask,
      pageUrl: page ? taggedPageUrl(page, slug, m.code) : undefined,
    });
  }
  out.sort((a, b) => (a.name ?? a.email).localeCompare(b.name ?? b.email) || a.code.localeCompare(b.code));

  await audit({ who, action: "campaign.export", entity: "campaign", entityId: slug, after: { links: out.length } }, now);
  return out;
}
