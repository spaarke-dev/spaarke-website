const STORAGE_KEY = "spk_attribution_v1";
const EXPIRES_KEY = "spk_attribution_expires_at";
const TTL_MS = 90 * 24 * 60 * 60 * 1000; // 90 days
const SESSION_KEY = "spk_session";

export type Attribution = {
  entry_referrer: string;
  entry_landing: string;
  first_visit_at: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  ai_source?: string;
};

export type SessionInfo = {
  session_started_at: string;
  pages_viewed: number;
};

export function readAttribution(): Attribution | null {
  if (typeof window === "undefined") return null;
  try {
    const expires = Number(localStorage.getItem(EXPIRES_KEY) ?? 0);
    if (expires && Date.now() > expires) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(EXPIRES_KEY);
      return null;
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : null;
  } catch {
    return null;
  }
}

export function ensureAttribution(
  detectAiSource: (referrer: string) => string | undefined,
): Attribution {
  const existing = readAttribution();
  if (existing) return existing;

  const params = new URLSearchParams(window.location.search);
  const attribution: Attribution = {
    entry_referrer: document.referrer || "",
    entry_landing: window.location.pathname,
    first_visit_at: new Date().toISOString(),
    utm_source: params.get("utm_source") ?? undefined,
    utm_medium: params.get("utm_medium") ?? undefined,
    utm_campaign: params.get("utm_campaign") ?? undefined,
    ai_source: detectAiSource(document.referrer),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
    localStorage.setItem(EXPIRES_KEY, String(Date.now() + TTL_MS));
  } catch {
    // localStorage unavailable (private mode, quota) — return ephemeral.
  }
  return attribution;
}

export function getSession(): SessionInfo {
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as SessionInfo;
    } catch {
      // fallthrough
    }
  }
  const fresh: SessionInfo = {
    session_started_at: new Date().toISOString(),
    pages_viewed: 0,
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(fresh));
  return fresh;
}

export function recordPageView(): void {
  if (typeof window === "undefined") return;
  const s = getSession();
  s.pages_viewed += 1;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
}

export function submissionProps(): Record<string, string | number> {
  const attr = readAttribution();
  const session = typeof window !== "undefined" ? getSession() : null;
  return {
    entry_referrer: attr?.entry_referrer ?? "",
    entry_landing: attr?.entry_landing ?? "",
    first_visit_at: attr?.first_visit_at ?? "",
    ai_source: attr?.ai_source ?? "",
    utm_source: attr?.utm_source ?? "",
    utm_medium: attr?.utm_medium ?? "",
    utm_campaign: attr?.utm_campaign ?? "",
    current_page:
      typeof window !== "undefined" ? window.location.pathname : "",
    pages_viewed: session?.pages_viewed ?? 1,
  };
}
