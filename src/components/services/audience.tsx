"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * Site-wide audience state: Law Firm or Corporate (design.md section 2; the
 * switch moved into the site header on 2026-11-23 so visitors can set it for
 * the whole site).
 *
 * SiteAudienceProvider wraps every page (root layout). On mount it applies
 * the `?audience=` URL parameter if there is one, else the remembered choice,
 * else keeps the default (law firm). Pages with audience versions (today,
 * /services) wrap their content in AudienceProvider, which renders the
 * server-read URL parameter on the first paint and otherwise follows the
 * site choice.
 */

import { isAudience, type Audience } from "./audience-types";
export { isAudience, type Audience, type ByAudience } from "./audience-types";

const STORAGE_KEY = "spaarke.audience";

type AudienceValue = {
  audience: Audience;
  setAudience: (a: Audience) => void;
};

const AudienceContext = createContext<AudienceValue | null>(null);

export function SiteAudienceProvider({ children }: { children: ReactNode }) {
  const [audience, setAudienceState] = useState<Audience>("firm");

  useEffect(() => {
    try {
      const fromUrl = new URL(window.location.href).searchParams.get("audience");
      const stored = isAudience(fromUrl) ? fromUrl : window.localStorage.getItem(STORAGE_KEY);
      // Applying the URL or remembered choice after mount is the only way to
      // honor it without a hydration mismatch on static pages.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (isAudience(stored)) setAudienceState(stored);
    } catch {
      /* storage can be blocked; keep the default */
    }
  }, []);

  const setAudience = useCallback((a: Audience) => {
    setAudienceState(a);
    try {
      window.localStorage.setItem(STORAGE_KEY, a);
    } catch {
      /* ignore */
    }
    try {
      // Keep a shareable URL on pages that vary by audience, and keep an
      // existing parameter accurate anywhere; leave other URLs clean.
      const url = new URL(window.location.href);
      if (url.pathname.startsWith("/services") || url.searchParams.has("audience")) {
        url.searchParams.set("audience", a);
        window.history.replaceState(window.history.state, "", url);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(() => ({ audience, setAudience }), [audience, setAudience]);
  return <AudienceContext.Provider value={value}>{children}</AudienceContext.Provider>;
}

/**
 * For a page with audience versions. `initial` is the audience the server
 * rendered (from `?audience=`, else law firm). Until mount the page shows
 * that when it came from the URL; from then on it shows the site choice.
 */
export function AudienceProvider({
  initial,
  fromUrl,
  children,
}: {
  initial: Audience;
  /** True when the server found a valid `?audience=` parameter. */
  fromUrl: boolean;
  children: ReactNode;
}) {
  const site = useContext(AudienceContext);
  if (!site) throw new Error("AudienceProvider must be used inside <SiteAudienceProvider>");
  const { audience: siteAudience, setAudience } = site;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // A parameter on a link followed inside the site (no full page load)
    // still sets the site choice.
    if (fromUrl && siteAudience !== initial) setAudience(initial);
    setMounted(true);
    // Only on mount: later changes come from the switch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const audience = !mounted && fromUrl ? initial : siteAudience;
  const value = useMemo(() => ({ audience, setAudience }), [audience, setAudience]);
  return <AudienceContext.Provider value={value}>{children}</AudienceContext.Provider>;
}

/** The audience, or null outside the providers. */
export function useAudienceMaybe(): Audience | null {
  return useContext(AudienceContext)?.audience ?? null;
}

export function useAudience(): AudienceValue {
  const ctx = useContext(AudienceContext);
  if (!ctx) throw new Error("useAudience must be used inside <AudienceProvider>");
  return ctx;
}

const OPTIONS: { value: Audience; label: string }[] = [
  { value: "firm", label: "Law Firm" },
  { value: "corporate", label: "Corporate" },
];

/**
 * The Law Firm | Corporate switch. A radiogroup with arrow-key support, so
 * keyboard users move between the two options as they would in any radio set.
 */
export function AudienceSwitch({
  className,
  size = "md",
  label = "View this page as",
}: {
  className?: string;
  /** "sm" is the compact header version. */
  size?: "sm" | "md";
  label?: string;
}) {
  const { audience, setAudience } = useAudience();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
    e.preventDefault();
    const next = (index + 1) % OPTIONS.length;
    setAudience(OPTIONS[next].value);
    refs.current[next]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={[
        "border-line-strong inline-flex rounded-full border p-1",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {OPTIONS.map((o, i) => {
        const active = audience === o.value;
        return (
          <button
            key={o.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => setAudience(o.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={`font-body rounded-full ${size === "sm" ? "px-3.5 py-1" : "px-4 py-1.5"} whitespace-nowrap text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#82A5EB] ${
              active ? "bg-[#5078DC] text-white" : "text-fg-mid hover:text-fg"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Cross-fades its children whenever the audience changes (about 250 ms).
 * Keyed on the audience so React remounts the subtree and the CSS animation
 * replays; `motion-safe` makes the swap instant under reduced motion.
 */
export function Flip({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "span" | "p";
}) {
  const { audience } = useAudience();
  return (
    <Tag
      key={audience}
      className={["motion-safe:animate-[services-fade_250ms_ease-out]", className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Tag>
  );
}

/**
 * True once the element has scrolled into view (and stays true), so build-in
 * animations run once. Under reduced motion it starts true: final state, no build.
 */
export function useInView<T extends Element>(threshold = 0.25) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, inView, setInView };
}
