/**
 * Pure URL builders for the three link types surfaced in each digest row:
 * workspace, issue search, and "Continue in Claude" deep link.
 *
 * No side effects, no I/O, no external dependencies. Template strings +
 * `encodeURIComponent` only. See projects/content-orchestration/spec.md §5.4.
 */

const DEFAULT_OWNER = "spaarke-dev";
const DEFAULT_REPO = "spaarke-website";

/**
 * Build the URL to the article workspace directory on GitHub.
 *
 * @example
 * buildWorkspaceUrl("the-iq-stack")
 * // => "https://github.com/spaarke-dev/spaarke-website/tree/main/content-platform/articles/the-iq-stack"
 */
export function buildWorkspaceUrl(
  slug: string,
  owner: string = DEFAULT_OWNER,
  repo: string = DEFAULT_REPO,
): string {
  return `https://github.com/${owner}/${repo}/tree/main/content-platform/articles/${slug}`;
}

/**
 * Build a GitHub issue search URL for the given slug. Uses search (not a
 * direct issue URL) per spec decision #1 — we don't know the issue number
 * at digest-build time and the search lands on the right issue reliably.
 *
 * @example
 * buildIssueSearchUrl("the-iq-stack")
 * // => "https://github.com/spaarke-dev/spaarke-website/issues?q=is%3Aissue+the-iq-stack"
 */
export function buildIssueSearchUrl(
  slug: string,
  owner: string = DEFAULT_OWNER,
  repo: string = DEFAULT_REPO,
): string {
  return `https://github.com/${owner}/${repo}/issues?q=is%3Aissue+${encodeURIComponent(slug)}`;
}

/**
 * Build a "Continue in Claude" deep link that opens claude.ai/new with the
 * prompt prefilled. The prompt is hard-coded here — if claude.ai/new?q=
 * ever stops working as a prefill mechanism, this is the one function that
 * needs updating.
 *
 * @example
 * buildContinueInClaudeUrl("the-iq-stack")
 * // => "https://claude.ai/new?q=Continue%20work%20on%20articles%2Fthe-iq-stack%2F%20..."
 */
export function buildContinueInClaudeUrl(slug: string): string {
  const prompt = `Continue work on articles/${slug}/ in the spaarke-website repo. Read CLAUDE.md and tasks.md to orient before doing anything else.`;
  return `https://claude.ai/new?q=${encodeURIComponent(prompt)}`;
}

/**
 * Convenience helper that bundles all three link builders for a single slug.
 * Saves the digest template a few lines.
 */
export function buildAllLinksFor(slug: string): {
  workspace: string;
  issueSearch: string;
  continueInClaude: string;
} {
  return {
    workspace: buildWorkspaceUrl(slug),
    issueSearch: buildIssueSearchUrl(slug),
    continueInClaude: buildContinueInClaudeUrl(slug),
  };
}
