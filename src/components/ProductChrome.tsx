import Image from "next/image";

const C = {
  bg: "#0a0a0a",
  surface2: "#161616",
  fg: "#f5f5f5",
  fgMid: "rgba(245,245,245,0.66)",
  fgLow: "rgba(245,245,245,0.42)",
  line: "rgba(255,255,255,0.10)",
  lineSoft: "rgba(255,255,255,0.06)",
};

/**
 * Spaarke app chrome bar — built in HTML/CSS so it stays sharp at any zoom.
 * Uses explicit dark colors so it renders dark regardless of the parent
 * section's tone (works inside both light and dark slabs).
 */
export function ProductChrome() {
  return (
    <div
      className="flex items-center gap-2.5 border-b px-3 py-2 sm:gap-3 sm:px-4 sm:py-2.5"
      style={{ backgroundColor: C.bg, borderColor: C.line }}
      aria-hidden="true"
    >
      {/* 9-dot waffle */}
      <div className="grid grid-cols-3 gap-[2px] p-1 sm:gap-[3px] sm:p-1.5">
        {Array.from({ length: 9 }).map((_, i) => (
          <span
            key={i}
            className="block h-[3px] w-[3px] rounded-[1px] sm:h-[4px] sm:w-[4px]"
            style={{ backgroundColor: C.fgMid }}
          />
        ))}
      </div>

      {/* Spaarke wordmark */}
      <Image
        src="/brand/logos/spaarke-logo-white.svg"
        alt="Spaarke"
        width={90}
        height={26}
        className="h-4 w-auto sm:h-5 md:h-[22px]"
      />

      {/* App name */}
      <div
        className="flex h-4 items-center border-l pl-2 sm:h-5 sm:pl-3"
        style={{ borderColor: C.lineSoft }}
      >
        <span
          className="text-[10px] leading-none sm:text-[11px]"
          style={{ color: C.fgMid }}
        >
          Corporate Counsel
        </span>
      </div>

      {/* Search bar */}
      <div
        className="ml-2 hidden min-w-0 flex-1 items-center gap-1.5 rounded border px-2 py-1 sm:ml-4 sm:flex sm:max-w-sm md:max-w-md"
        style={{ backgroundColor: C.surface2, borderColor: C.line }}
      >
        <svg
          className="h-3 w-3 flex-shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FF4D8B"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
        </svg>
        <span
          className="truncate text-[10px] leading-none sm:text-[11px]"
          style={{ color: C.fgLow }}
        >
          Search
        </span>
      </div>

      {/* Right cluster */}
      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        {/* + */}
        <div
          className="flex h-5 w-5 items-center justify-center rounded text-[14px] font-medium leading-none sm:h-6 sm:w-6"
          style={{ color: "#3B82F6" }}
        >
          +
        </div>
        {/* Bell */}
        <svg
          className="h-3.5 w-3.5 sm:h-4 sm:w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke={C.fg}
          strokeWidth="1.6"
        >
          <path
            d="M6 8a6 6 0 1112 0c0 7 3 8 3 8H3s3-1 3-8z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M10 21a2 2 0 004 0" strokeLinecap="round" />
        </svg>
        {/* Gear */}
        <svg
          className="h-3.5 w-3.5 sm:h-4 sm:w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke={C.fg}
          strokeWidth="1.6"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" />
        </svg>

        {/* Copilot pill */}
        <div
          className="flex h-5 items-center gap-1 rounded border px-1.5 sm:h-6 sm:px-2 sm:gap-1.5"
          style={{
            borderColor: "rgba(123,91,255,0.45)",
            background:
              "linear-gradient(135deg, rgba(54,189,247,0.12) 0%, rgba(123,91,255,0.12) 50%, rgba(255,77,203,0.12) 100%)",
          }}
        >
          <div
            className="h-2.5 w-2.5 rounded-[2px] sm:h-3 sm:w-3"
            style={{
              background:
                "conic-gradient(from 180deg, #36BDF7 0%, #7B5BFF 30%, #FF4DCB 60%, #FF8A1F 100%)",
            }}
          />
          <span
            className="text-[10px] font-medium leading-none sm:text-[11px]"
            style={{ color: C.fg }}
          >
            Copilot
          </span>
          <svg
            className="h-2 w-2 sm:h-2.5 sm:w-2.5"
            viewBox="0 0 12 12"
            fill={C.fgMid}
          >
            <path d="M6 8L2 4h8z" />
          </svg>
        </div>

        {/* Profile circle — gradient ring */}
        <div
          className="h-4 w-4 flex-shrink-0 rounded-full sm:h-5 sm:w-5"
          style={{
            background:
              "linear-gradient(135deg, #36BDF7 0%, #7B5BFF 50%, #FF4DCB 100%)",
          }}
        />
      </div>
    </div>
  );
}
