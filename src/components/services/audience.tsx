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
 * Page-wide audience state for /services (design.md section 2).
 *
 * Order of precedence: the `?audience=` URL parameter (read on the server, so
 * the first render is already right), then the remembered choice, then the
 * default (law firm). The remembered choice is applied after mount only when
 * the URL carries no parameter, which keeps server and client markup equal.
 */

import { isAudience, type Audience } from "./audience-types";
export { isAudience, type Audience, type ByAudience } from "./audience-types";

const STORAGE_KEY = "spaarke.audience";

type AudienceValue = {
  audience: Audience;
  setAudience: (a: Audience) => void;
};

const AudienceContext = createContext<AudienceValue | null>(null);

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
  const [audience, setAudienceState] = useState<Audience>(initial);

  useEffect(() => {
    if (fromUrl) return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      // A remembered choice from an earlier visit. Applying it after mount is
      // the only way to honor it without a hydration mismatch.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (isAudience(stored) && stored !== initial) setAudienceState(stored);
    } catch {
      /* storage can be blocked; keep the default */
    }
  }, [fromUrl, initial]);

  const setAudience = useCallback((a: Audience) => {
    setAudienceState(a);
    try {
      window.localStorage.setItem(STORAGE_KEY, a);
    } catch {
      /* ignore */
    }
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("audience", a);
      window.history.replaceState(window.history.state, "", url);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(() => ({ audience, setAudience }), [audience, setAudience]);
  return <AudienceContext.Provider value={value}>{children}</AudienceContext.Provider>;
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
export function AudienceSwitch({ className }: { className?: string }) {
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
      aria-label="View this page as"
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
            className={`font-body rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#82A5EB] ${
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
