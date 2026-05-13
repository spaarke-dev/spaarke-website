// scripts/linkedin-test-kv.ts
//
// Smoke-test for Key Vault access. Reads `linkedin-member-client-id`
// and prints its length only — no secret values. Exits non-zero on
// any error so CI can rely on this for health gating.

import { pingKv } from "./linkedin-shared.ts";

pingKv()
  .then((n) => {
    console.log(`KV reachable, client-id length: ${n}`);
  })
  .catch((err: unknown) => {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`ERROR: ${msg}`);
    process.exit(1);
  });
