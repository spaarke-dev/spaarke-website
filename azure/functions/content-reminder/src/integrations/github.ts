/**
 * GitHub integration for the content-reminder Function.
 *
 * Pure module: token is passed in by the caller (orchestrator reads KV
 * and supplies the value). No memoization — caller instantiates Octokit
 * once per invocation, which is fine for a daily timer trigger.
 *
 * See projects/content-orchestration/spec.md §4.1.
 */

// `@octokit/rest` v21 is ESM-only; this project compiles to CommonJS
// (tsconfig `module: node16`, no `"type": "module"` in package.json).
// We use dynamic `import()` so tsc emits a real ESM import call rather
// than a CJS `require()` (which would fail at runtime). Under node16
// resolution, a `typeof import()` for an ESM module from a CJS file
// requires the `resolution-mode: "import"` import attribute.
type OctokitCtor = typeof import(
  "@octokit/rest",
  { with: { "resolution-mode": "import" } }
).Octokit;
let _OctokitCtor: OctokitCtor | undefined;

async function getOctokitCtor(): Promise<OctokitCtor> {
  if (!_OctokitCtor) {
    const mod = await import("@octokit/rest");
    _OctokitCtor = mod.Octokit;
  }
  return _OctokitCtor;
}

/**
 * Fetch `content-platform/calendar.md` from the given repo via the
 * GitHub Contents API and return the decoded markdown string.
 *
 * @param token  GitHub PAT (fine-grained or classic) with `contents:read`
 *               on the target repo.
 * @param owner  Repo owner. Defaults to `spaarke-dev`.
 * @param repo   Repo name. Defaults to `spaarke-website`.
 * @param ref    Git ref (branch, tag, or SHA). Defaults to `main`.
 * @returns      The decoded calendar markdown.
 * @throws       If the response shape is not a single file (e.g. the
 *               path resolved to a directory or symlink).
 */
export async function fetchCalendar(
  token: string,
  owner = "spaarke-dev",
  repo = "spaarke-website",
  ref = "main",
): Promise<string> {
  const Octokit = await getOctokitCtor();
  const octokit = new Octokit({ auth: token });

  const { data } = await octokit.repos.getContent({
    owner,
    repo,
    ref,
    path: "content-platform/calendar.md",
  });

  if (Array.isArray(data)) {
    throw new Error(
      "Unexpected response shape from GitHub Contents API: " +
        "path resolved to a directory, expected a single file.",
    );
  }

  if (data.type !== "file") {
    throw new Error(
      `Unexpected response shape from GitHub Contents API: ` +
        `expected type "file", got "${data.type}".`,
    );
  }

  // `content` on a file response is always base64-encoded.
  return Buffer.from(data.content, "base64").toString("utf-8");
}

/**
 * Check PAT expiry by reading the `github-authentication-token-expiration`
 * response header from a lightweight `GET /` call.
 *
 * - Fine-grained PATs and SAT tokens emit the header as an RFC3339
 *   timestamp (e.g. `2026-08-12 23:59:59 UTC`).
 * - Classic PATs that never expire omit the header — we return `null`.
 *
 * Used in the digest footer per spec §9 #5 to warn before expiry.
 *
 * @param token  GitHub PAT.
 * @returns      `{ daysUntilExpiry }` — rounded integer days, or `null`
 *               if the header is absent.
 */
export async function checkPatExpiry(
  token: string,
): Promise<{ daysUntilExpiry: number | null }> {
  const Octokit = await getOctokitCtor();
  const octokit = new Octokit({ auth: token });

  // `GET /` is the lightest authenticated endpoint — returns the API
  // root with rate-limit headers and the expiry header (when present).
  const response = await octokit.request("GET /");

  // Octokit lowercases response header names.
  const expiryHeader =
    response.headers["github-authentication-token-expiration"];

  if (!expiryHeader || typeof expiryHeader !== "string") {
    return { daysUntilExpiry: null };
  }

  const expiryDate = new Date(expiryHeader);
  if (Number.isNaN(expiryDate.getTime())) {
    // Header present but unparseable — treat as unknown rather than throw.
    return { daysUntilExpiry: null };
  }

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysUntilExpiry = Math.round(
    (expiryDate.getTime() - Date.now()) / msPerDay,
  );

  return { daysUntilExpiry };
}
