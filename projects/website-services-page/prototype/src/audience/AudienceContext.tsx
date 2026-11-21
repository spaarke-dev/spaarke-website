import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Audience = 'firm' | 'corporate';
export type ByAudience<T> = Record<Audience, T>;

const STORAGE_KEY = 'spaarke.audience';

function isAudience(v: unknown): v is Audience {
  return v === 'firm' || v === 'corporate';
}

/** URL param wins, then remembered choice, then the default (firm). */
export function readInitialAudience(): Audience {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('audience');
    if (isAudience(fromUrl)) return fromUrl;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isAudience(stored)) return stored;
  } catch {
    /* storage or URL access can fail; fall through to the default */
  }
  return 'firm';
}

interface AudienceValue {
  audience: Audience;
  setAudience: (a: Audience) => void;
}

const AudienceContext = createContext<AudienceValue | null>(null);

export function AudienceProvider({ children }: { children: ReactNode }) {
  const [audience, setAudienceState] = useState<Audience>(readInitialAudience);

  const setAudience = useCallback((a: Audience) => {
    setAudienceState(a);
    try {
      window.localStorage.setItem(STORAGE_KEY, a);
    } catch {
      /* ignore */
    }
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('audience', a);
      window.history.replaceState(null, '', url);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.audience = audience;
  }, [audience]);

  const value = useMemo(() => ({ audience, setAudience }), [audience, setAudience]);
  return <AudienceContext.Provider value={value}>{children}</AudienceContext.Provider>;
}

export function useAudience(): AudienceValue {
  const ctx = useContext(AudienceContext);
  if (!ctx) throw new Error('useAudience must be used inside <AudienceProvider>');
  return ctx;
}
