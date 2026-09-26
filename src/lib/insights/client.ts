import AnthropicFoundry from "@anthropic-ai/foundry-sdk";

/**
 * The Foundry client for the article insights assistant.
 *
 * Claude in Microsoft Foundry, not the public Anthropic API, so this uses
 * `@anthropic-ai/foundry-sdk` with an `x-api-key` against the resource's
 * `/anthropic` base URL. The deployment is website-specific so that marketing
 * traffic cannot consume the product's quota (spec KD-02).
 *
 * The key lives in Azure Static Web Apps app settings and in `.env.local` for
 * development. It is read here, server side, and never reaches a client bundle.
 */

let client: AnthropicFoundry | null = null;

export type FoundryConfig = {
  baseUrl: string;
  apiKey: string;
  deployment: string;
};

/** Null when the app settings are absent, which is how the route reports 503. */
export function foundryConfig(): FoundryConfig | null {
  const baseUrl = process.env.FOUNDRY_BASE_URL;
  const apiKey = process.env.FOUNDRY_API_KEY;
  const deployment = process.env.FOUNDRY_DEPLOYMENT;
  if (!baseUrl || !apiKey || !deployment) return null;
  return { baseUrl, apiKey, deployment };
}

export function foundryClient(config: FoundryConfig): AnthropicFoundry {
  client ??= new AnthropicFoundry({
    apiKey: config.apiKey,
    baseURL: config.baseUrl,
    // The SDK's own default is 10 minutes, which is far past the point where a
    // reader has given up. The route's deadlines are the real control; this is
    // the floor under them.
    timeout: 150_000,
    // The route applies its own timeouts and its own error copy, so the SDK is
    // told not to retry. A silent retry on a 25 second call is a minute of
    // unexplained silence for the reader, and it doubles the spend.
    maxRetries: 0,
  });
  return client;
}

/** True when the upstream failure is Foundry rate limiting us rather than breaking. */
export function isUpstreamRateLimit(err: unknown): boolean {
  const status = (err as { status?: number; statusCode?: number })?.status
    ?? (err as { statusCode?: number })?.statusCode;
  return status === 429;
}
