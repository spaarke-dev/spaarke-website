// scripts/linkedin-publish.ts
//
// The LinkedIn publish CLI. End-to-end: validates the slug, resolves
// commentary + image, refreshes tokens inline, uploads the image,
// posts to LinkedIn, writes local records.
//
// Invoked by the `/publish-linkedin` skill after the chat-based
// approval gate. The skill is responsible for writing the approved
// commentary to `content-platform/published/linkedin-posts/<slug>.md`
// before invocation; this script writes the canonical record back
// only after the API call succeeds.
//
// See projects/linkedin-publishing/spec.md §6 and tasks/011 for the
// full contract.

import * as fs from "node:fs";
import * as path from "node:path";
import matter from "gray-matter";

import {
  type App,
  type LinkedInTokens,
  LinkedInApiError,
  LinkedInAuthError,
  LinkedInConfigError,
} from "./linkedin-shared.ts";
import { refreshIfNeeded } from "./linkedin-refresh-token.ts";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const LINKEDIN_API_VERSION = "202604";
const POSTS_ENDPOINT = "https://api.linkedin.com/rest/posts";
const IMAGES_INIT_ENDPOINT =
  "https://api.linkedin.com/rest/images?action=initializeUpload";
const SITE_BASE_URL = "https://www.spaarke.com/why-spaarke";

const REPO_ROOT = process.cwd();
const CACHE_DIR = path.join(REPO_ROOT, ".linkedin-cache");
const BLOG_DIR = path.join(REPO_ROOT, "content", "blog");
const LINKEDIN_POSTS_DIR = path.join(
  REPO_ROOT,
  "content-platform",
  "published",
  "linkedin-posts",
);
const CALENDAR_PATH = path.join(
  REPO_ROOT,
  "content-platform",
  "calendar.md",
);

const COMMENTARY_HARD_LIMIT = 3000;
const COMMENTARY_WARN_LIMIT = 2700;
const IMAGE_MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const DESCRIPTION_MAX_LEN = 200;
const REFRESH_WINDOW_DAYS = 0.0035; // ~5 minutes

/* ------------------------------------------------------------------ */
/*  Arg parsing                                                        */
/* ------------------------------------------------------------------ */

interface CliArgs {
  slug: string;
  target: "personal" | "company";
  dryRun: boolean;
  commentary: string | null;
  imagePath: string | null;
}

function parseArgs(argv: string[]): CliArgs {
  let slug: string | null = null;
  let target: string | null = null;
  let dryRun = false;
  let commentary: string | null = null;
  let imagePath: string | null = null;

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry-run") {
      dryRun = true;
      continue;
    }
    if (a.startsWith("--slug=")) {
      slug = a.slice("--slug=".length);
      continue;
    }
    if (a === "--slug") {
      slug = argv[++i] ?? null;
      continue;
    }
    if (a.startsWith("--target=")) {
      target = a.slice("--target=".length);
      continue;
    }
    if (a === "--target") {
      target = argv[++i] ?? null;
      continue;
    }
    if (a.startsWith("--commentary=")) {
      commentary = a.slice("--commentary=".length);
      continue;
    }
    if (a === "--commentary") {
      commentary = argv[++i] ?? null;
      continue;
    }
    if (a.startsWith("--image=")) {
      imagePath = a.slice("--image=".length);
      continue;
    }
    if (a === "--image") {
      imagePath = argv[++i] ?? null;
      continue;
    }
  }

  if (!slug) {
    throw new LinkedInConfigError(
      "Missing required --slug. Usage: linkedin:publish --slug=<slug> --target=personal|company [--dry-run] [--commentary '<text>'] [--image <path>]",
    );
  }
  if (target !== "personal" && target !== "company") {
    throw new LinkedInConfigError(
      "Missing or invalid --target. Must be 'personal' or 'company'.",
    );
  }

  return { slug, target, dryRun, commentary, imagePath };
}

function targetToApp(target: "personal" | "company"): App {
  return target === "personal" ? "member" : "org";
}

/* ------------------------------------------------------------------ */
/*  Article frontmatter                                                */
/* ------------------------------------------------------------------ */

interface ArticleMeta {
  filePath: string;
  title: string;
  summary: string;
  description: string;
}

function findArticleFile(slug: string): string {
  if (!fs.existsSync(BLOG_DIR)) {
    throw new LinkedInConfigError(
      `Blog directory not found: ${BLOG_DIR}`,
    );
  }
  const entries = fs.readdirSync(BLOG_DIR);
  // Pattern: <YYYY-MM-DD>-<slug>.mdx
  const datePrefix = /^\d{4}-\d{2}-\d{2}-/;
  const match = entries.find((name) => {
    if (!name.endsWith(".mdx")) return false;
    if (!datePrefix.test(name)) return false;
    const withoutDate = name.replace(datePrefix, "").replace(/\.mdx$/, "");
    return withoutDate === slug;
  });
  if (!match) {
    throw new LinkedInConfigError(
      `No article found in ${BLOG_DIR} matching slug '${slug}'. Expected file like <YYYY-MM-DD>-${slug}.mdx`,
    );
  }
  return path.join(BLOG_DIR, match);
}

function loadArticleMeta(slug: string): ArticleMeta {
  const filePath = findArticleFile(slug);
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = matter(raw);
  const data = parsed.data as Record<string, unknown>;
  const title = typeof data.title === "string" ? data.title : "";
  const summary = typeof data.summary === "string" ? data.summary : "";
  const description =
    typeof data.description === "string" ? data.description : "";
  if (!title) {
    throw new LinkedInConfigError(
      `Article ${filePath} has no 'title' in frontmatter.`,
    );
  }
  return { filePath, title, summary, description };
}

/* ------------------------------------------------------------------ */
/*  Commentary + image resolution                                       */
/* ------------------------------------------------------------------ */

function linkedInPostFilePath(slug: string): string {
  return path.join(LINKEDIN_POSTS_DIR, `${slug}.md`);
}

function loadCommentary(slug: string, override: string | null): string {
  if (override !== null && override.length > 0) {
    return override;
  }
  const candidate = linkedInPostFilePath(slug);
  if (!fs.existsSync(candidate)) {
    throw new LinkedInConfigError(
      `No commentary found. Provide --commentary or write to ${candidate} before running. The skill is expected to write this file before invoking the CLI.`,
    );
  }
  const raw = fs.readFileSync(candidate, "utf8");
  const parsed = matter(raw);
  const body = parsed.content.trim();
  if (!body) {
    throw new LinkedInConfigError(
      `Commentary file ${candidate} has empty body.`,
    );
  }
  return body;
}

function validateCommentary(commentary: string): void {
  if (commentary.length > COMMENTARY_HARD_LIMIT) {
    throw new LinkedInConfigError(
      `Commentary is ${commentary.length} chars (> ${COMMENTARY_HARD_LIMIT} hard limit). LinkedIn will reject this post; shorten the commentary.`,
    );
  }
  if (commentary.length > COMMENTARY_WARN_LIMIT) {
    console.warn(
      `[warn] Commentary is ${commentary.length} chars (over ${COMMENTARY_WARN_LIMIT}). LinkedIn truncates feed previews around 210 chars; long copy reduces engagement.`,
    );
  }
}

function resolveImagePath(slug: string, override: string | null): string {
  const candidate =
    override && override.length > 0
      ? path.resolve(REPO_ROOT, override)
      : path.join(
          REPO_ROOT,
          "public",
          "articles",
          slug,
          "linkedin-1920x1080.png",
        );
  if (!fs.existsSync(candidate)) {
    throw new LinkedInConfigError(
      `Image not found: ${candidate}. Provide --image <path> or place a 1920×1080 PNG at public/articles/${slug}/linkedin-1920x1080.png.`,
    );
  }
  const ext = path.extname(candidate).toLowerCase();
  if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
    throw new LinkedInConfigError(
      `Image must be PNG or JPG: got ${ext} (${candidate}).`,
    );
  }
  const stat = fs.statSync(candidate);
  if (stat.size > IMAGE_MAX_BYTES) {
    throw new LinkedInConfigError(
      `Image ${candidate} is ${stat.size} bytes (> ${IMAGE_MAX_BYTES} = 8 MB LinkedIn limit).`,
    );
  }
  return candidate;
}

function imageContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  return "image/png";
}

/* ------------------------------------------------------------------ */
/*  Pending-marker partial-state safety                                */
/* ------------------------------------------------------------------ */

interface PendingMarker {
  slug: string;
  target: "personal" | "company";
  authorUrn: string;
  timestamp: string;
}

function ensureCacheDir(): void {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

function pendingMarkerPath(slug: string): string {
  return path.join(CACHE_DIR, `${slug}-pending.json`);
}

function writePendingMarker(marker: PendingMarker): void {
  ensureCacheDir();
  fs.writeFileSync(
    pendingMarkerPath(marker.slug),
    JSON.stringify(marker, null, 2),
    "utf8",
  );
}

function clearPendingMarker(slug: string): void {
  const p = pendingMarkerPath(slug);
  if (fs.existsSync(p)) fs.unlinkSync(p);
}

function readPendingMarker(slug: string): PendingMarker | null {
  const p = pendingMarkerPath(slug);
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, "utf8")) as PendingMarker;
  } catch {
    return null;
  }
}

async function recoverFromPendingMarker(
  marker: PendingMarker,
  tokens: LinkedInTokens,
): Promise<void> {
  console.warn(
    `[recover] Found pending marker from ${marker.timestamp}. ` +
      `A prior run started a post for slug='${marker.slug}' target='${marker.target}' but may have crashed before recording the result.`,
  );
  const url = new URL("https://api.linkedin.com/rest/posts");
  url.searchParams.set("author", marker.authorUrn);
  url.searchParams.set("q", "author");
  url.searchParams.set("count", "5");
  url.searchParams.set("sortBy", "LAST_MODIFIED");
  const res = await fetch(url, {
    method: "GET",
    headers: linkedinHeaders(tokens.accessToken),
  });
  if (!res.ok) {
    console.warn(
      `[recover] Could not query recent posts (HTTP ${res.status}). Continue manually: visit the LinkedIn feed for the author URN and check the most recent post.`,
    );
  } else {
    const body = await res.text();
    console.warn(
      `[recover] Recent posts for ${marker.authorUrn}:\n${body}\n` +
        `Inspect the list above. If the prior post is already live, copy its URN and write a record manually to ${linkedInPostFilePath(marker.slug)}, then delete the marker at ${pendingMarkerPath(marker.slug)}. To proceed anyway (will create a NEW post), re-run without the marker present.`,
    );
  }
  throw new LinkedInConfigError(
    `Pending marker detected at ${pendingMarkerPath(marker.slug)}. Resolve manually before retrying (see message above).`,
  );
}

/* ------------------------------------------------------------------ */
/*  LinkedIn API calls                                                  */
/* ------------------------------------------------------------------ */

function linkedinHeaders(accessToken: string): Record<string, string> {
  return {
    Authorization: `Bearer ${accessToken}`,
    "LinkedIn-Version": LINKEDIN_API_VERSION,
    "X-Restli-Protocol-Version": "2.0.0",
  };
}

interface InitializeUploadResponse {
  value: {
    uploadUrl: string;
    image: string;
    uploadUrlExpiresAt?: number;
    uploadToken?: string;
  };
}

async function uploadImage(
  imagePath: string,
  tokens: LinkedInTokens,
): Promise<string> {
  // Step 1: initializeUpload
  const initRes = await fetch(IMAGES_INIT_ENDPOINT, {
    method: "POST",
    headers: {
      ...linkedinHeaders(tokens.accessToken),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      initializeUploadRequest: { owner: tokens.authorUrn },
    }),
  });
  if (!initRes.ok) {
    await mapAndThrow(initRes, "image initializeUpload");
  }
  const initData = (await initRes.json()) as InitializeUploadResponse;
  const uploadUrl = initData.value?.uploadUrl;
  const imageUrn = initData.value?.image;
  if (!uploadUrl || !imageUrn) {
    throw new LinkedInApiError(
      "LinkedIn initializeUpload response missing uploadUrl/image fields.",
      initRes.status,
      JSON.stringify(initData),
    );
  }

  // Step 2: PUT binary
  const binary = fs.readFileSync(imagePath);
  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${tokens.accessToken}`,
      "Content-Type": imageContentType(imagePath),
    },
    body: new Uint8Array(binary),
  });
  if (!putRes.ok) {
    const body = await putRes.text().catch(() => "<unreadable>");
    throw new LinkedInApiError(
      `LinkedIn image binary upload failed (HTTP ${putRes.status}).`,
      putRes.status,
      body,
    );
  }
  return imageUrn;
}

interface PostBody {
  author: string;
  commentary: string;
  visibility: "PUBLIC";
  distribution: {
    feedDistribution: "MAIN_FEED";
    targetEntities: never[];
    thirdPartyDistributionChannels: never[];
  };
  content: {
    article: {
      source: string;
      thumbnail: string;
      title: string;
      description: string;
    };
  };
  lifecycleState: "PUBLISHED";
  isReshareDisabledByAuthor: boolean;
}

function buildPostBody(args: {
  authorUrn: string;
  commentary: string;
  slug: string;
  thumbnailUrn: string;
  title: string;
  summary: string;
}): PostBody {
  const description = (args.summary || "").slice(0, DESCRIPTION_MAX_LEN);
  return {
    author: args.authorUrn,
    commentary: args.commentary,
    visibility: "PUBLIC",
    distribution: {
      feedDistribution: "MAIN_FEED",
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
    content: {
      article: {
        source: `${SITE_BASE_URL}/${args.slug}`,
        thumbnail: args.thumbnailUrn,
        title: args.title,
        description,
      },
    },
    lifecycleState: "PUBLISHED",
    isReshareDisabledByAuthor: false,
  };
}

interface CreatePostResult {
  postUrn: string;
  postUrl: string;
}

async function createPost(
  body: PostBody,
  tokens: LinkedInTokens,
): Promise<CreatePostResult> {
  const res = await fetch(POSTS_ENDPOINT, {
    method: "POST",
    headers: {
      ...linkedinHeaders(tokens.accessToken),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (res.status !== 201 && !res.ok) {
    await mapAndThrow(res, "create post");
  }
  const postUrn = res.headers.get("x-restli-id");
  if (!postUrn) {
    const respBody = await res.text().catch(() => "<unreadable>");
    throw new LinkedInApiError(
      "LinkedIn create-post response missing 'x-restli-id' header.",
      res.status,
      respBody,
    );
  }
  return {
    postUrn,
    postUrl: `https://www.linkedin.com/feed/update/${postUrn}/`,
  };
}

/**
 * Maps an HTTP error response from LinkedIn to a typed error per spec §6.4.
 * Always throws; the `Promise<never>` return type lets callers `await`
 * it as the last statement of an error branch.
 */
async function mapAndThrow(res: Response, operation: string): Promise<never> {
  const body = await res.text().catch(() => "<unreadable>");
  if (res.status === 401) {
    throw new LinkedInAuthError(
      "LinkedIn token rejected — run `npm run linkedin:auth --app=<member|org>` to re-auth.",
    );
  }
  if (res.status === 403) {
    throw new LinkedInApiError(
      "LinkedIn permission denied. For company posts you must be ADMINISTRATOR on the Spaarke Company Page. For personal posts, the access token must include `w_member_social` scope.",
      res.status,
      body,
    );
  }
  if (res.status === 422) {
    throw new LinkedInApiError(
      "LinkedIn rejected the post body. Most common cause: commentary > 3000 chars or invalid mention syntax.",
      res.status,
      body,
    );
  }
  if (res.status === 429) {
    throw new LinkedInApiError(
      "LinkedIn rate-limited — wait 5 min and retry. (Daily quota is ~150 posts.)",
      res.status,
      body,
    );
  }
  throw new LinkedInApiError(
    `LinkedIn ${operation} failed (HTTP ${res.status}).`,
    res.status,
    body,
  );
}

/* ------------------------------------------------------------------ */
/*  Local records                                                       */
/* ------------------------------------------------------------------ */

function writeLinkedInPostRecord(args: {
  slug: string;
  target: "personal" | "company";
  postUrl: string;
  commentary: string;
}): void {
  if (!fs.existsSync(LINKEDIN_POSTS_DIR)) {
    fs.mkdirSync(LINKEDIN_POSTS_DIR, { recursive: true });
  }
  const filePath = linkedInPostFilePath(args.slug);
  const frontmatter: Record<string, string> = {
    posted_url: args.postUrl,
    posted_at: new Date().toISOString(),
    target: args.target,
  };
  // Preserve any extra frontmatter fields the skill wrote (e.g., voice
  // used, draft notes). Only overwrite the three fields above.
  let mergedData: Record<string, unknown> = { ...frontmatter };
  if (fs.existsSync(filePath)) {
    try {
      const existing = matter(fs.readFileSync(filePath, "utf8"));
      mergedData = { ...existing.data, ...frontmatter };
    } catch {
      // ignore parse errors; fall back to fresh frontmatter
    }
  }
  const fmYaml = Object.entries(mergedData)
    .map(([k, v]) => `${k}: ${yamlScalar(v)}`)
    .join("\n");
  const out = `---\n${fmYaml}\n---\n\n${args.commentary.trim()}\n`;
  fs.writeFileSync(filePath, out, "utf8");
}

function yamlScalar(v: unknown): string {
  if (v === null || v === undefined) return '""';
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  const s = String(v);
  // Quote if it contains characters that would confuse a YAML scalar.
  if (/[:#\n"'\\]/.test(s) || /^\s|\s$/.test(s)) {
    return JSON.stringify(s);
  }
  return s;
}

function appendCalendarLine(args: {
  slug: string;
  target: "personal" | "company";
  postUrl: string;
}): void {
  const today = new Date().toISOString().slice(0, 10);
  const line = `- LinkedIn (${args.target}) ${today} — ${args.slug} — ${args.postUrl}\n`;
  // Task 043 will define the canonical column/row format. For now we
  // append a single line at end-of-file so nothing existing is
  // disturbed. The operator (or task 043) can re-home it later.
  try {
    fs.appendFileSync(CALENDAR_PATH, line, "utf8");
  } catch (err) {
    console.warn(
      `[warn] Could not append to calendar at ${CALENDAR_PATH}: ${(err as Error).message}. Post was still published successfully.`,
    );
  }
}

/* ------------------------------------------------------------------ */
/*  Main                                                                */
/* ------------------------------------------------------------------ */

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const app = targetToApp(args.target);

  // 4. Load article frontmatter.
  const article = loadArticleMeta(args.slug);

  // 5. Load commentary.
  const commentary = loadCommentary(args.slug, args.commentary);

  // 6. Validate commentary length.
  validateCommentary(commentary);

  // 7. Resolve image (validated).
  const imagePath = resolveImagePath(args.slug, args.imagePath);

  // 8. Refresh tokens (5-minute window).
  const tokens = await refreshIfNeeded(app, REFRESH_WINDOW_DAYS);

  // 16. Partial-state safety: check for stale pending marker BEFORE
  // doing anything destructive. If present, surface the recovery
  // path and bail out — let the operator resolve manually.
  const existingMarker = readPendingMarker(args.slug);
  if (existingMarker) {
    await recoverFromPendingMarker(existingMarker, tokens);
    return; // unreachable — recoverFromPendingMarker throws.
  }

  // 9. Dry-run: build the body and print it. Skip API calls.
  if (args.dryRun) {
    const previewBody = buildPostBody({
      authorUrn: tokens.authorUrn,
      commentary,
      slug: args.slug,
      thumbnailUrn: "<image URN — populated at post time>",
      title: article.title,
      summary: article.summary || article.description,
    });
    console.log("DRY RUN — no API calls will be made.");
    console.log(`Article:    ${article.filePath}`);
    console.log(`Target:     ${args.target} (app=${app})`);
    console.log(`Author URN: ${tokens.authorUrn}`);
    console.log(`Image:      ${imagePath}`);
    console.log(`Link:       ${previewBody.content.article.source}`);
    console.log(`Title:      ${previewBody.content.article.title}`);
    console.log(
      `Description: ${previewBody.content.article.description}`,
    );
    console.log(`Char count: ${commentary.length} / ${COMMENTARY_HARD_LIMIT}`);
    console.log("Request body:");
    console.log(JSON.stringify(previewBody, null, 2));
    return;
  }

  // 10. Upload image.
  const imageUrn = await uploadImage(imagePath, tokens);

  // Build the post body before writing the marker so a body-build
  // error doesn't leave a marker behind.
  const postBody = buildPostBody({
    authorUrn: tokens.authorUrn,
    commentary,
    slug: args.slug,
    thumbnailUrn: imageUrn,
    title: article.title,
    summary: article.summary || article.description,
  });

  // 16. Write pending marker BEFORE the POST.
  writePendingMarker({
    slug: args.slug,
    target: args.target,
    authorUrn: tokens.authorUrn,
    timestamp: new Date().toISOString(),
  });

  let result: CreatePostResult;
  try {
    // 11–12. Create post, extract URN.
    result = await createPost(postBody, tokens);
  } catch (err) {
    // Leave the marker so the next run can recover. Image is
    // GC'd by LinkedIn after a window per spec §6.3.
    throw err;
  }

  // 13. Persist results — write the canonical record + calendar
  // line. We do this BEFORE clearing the marker, so a crash here
  // still surfaces on the next run via the marker.
  writeLinkedInPostRecord({
    slug: args.slug,
    target: args.target,
    postUrl: result.postUrl,
    commentary,
  });
  appendCalendarLine({
    slug: args.slug,
    target: args.target,
    postUrl: result.postUrl,
  });

  // Clear pending marker — success.
  clearPendingMarker(args.slug);

  // 14. Stdout: post URL (skill captures this).
  console.log(result.postUrl);
}

/* ------------------------------------------------------------------ */
/*  Entry point                                                         */
/* ------------------------------------------------------------------ */

main().catch((err: unknown) => {
  if (err instanceof LinkedInAuthError) {
    console.error(`[auth] ${err.message}`);
    process.exit(2);
  }
  if (err instanceof LinkedInConfigError) {
    console.error(`[config] ${err.message}`);
    process.exit(3);
  }
  if (err instanceof LinkedInApiError) {
    console.error(`[api ${err.httpStatus}] ${err.message}`);
    if (err.responseBody) {
      console.error(`Response body:\n${err.responseBody}`);
    }
    process.exit(4);
  }
  const e = err as Error;
  console.error(`[error] ${e?.message ?? String(err)}`);
  if (e?.stack) console.error(e.stack);
  process.exit(1);
});
