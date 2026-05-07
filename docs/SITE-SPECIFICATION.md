# Spaarke Website — Site Specification

> Marketing + content site for Spaarke (Legal Operations Intelligence).
> Live at **https://www.spaarke.com**, hosted on Azure Static Web Apps,
> deployed automatically from `main`.

---

## 1. Overview

The Spaarke website is a server-rendered marketing and content site built on
Next.js (App Router). It serves the public-facing experience for the Spaarke
platform: messaging pages (home, platform, why), informational pages (about,
contact, privacy, terms), an MDX-driven insights/blog library, and a small
set of API routes for capturing leads and contact submissions.

**Primary goals**

- Communicate the Spaarke product vision and platform capabilities.
- Capture early-access requests and demo registrations.
- Publish thought-leadership content (the "Why Spaarke" insights library).
- Surface the brand consistently across light and dark sections, with
  high typographic and motion polish.
- Optimize for organic search and AI-assisted discovery (LLM crawlers,
  AI search results, sitelinks).

---

## 2. Technology Stack

### Runtime / framework

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js 16.1.6** (App Router, Turbopack dev) | Mix of static + SSR + API routes |
| UI library | **React 19.2.3** | Server Components by default; `"use client"` opt-in |
| Language | **TypeScript 5.9.3** | Strict; `tsc --noEmit` runs in CI |
| Styling | **Tailwind CSS v4** + `@tailwindcss/postcss` | `@theme inline` token system in CSS |
| Typography plugin | `@tailwindcss/typography` 0.5 | For MDX prose pages |

### Content + data

| Concern | Choice |
|---|---|
| Blog / insights | **MDX** files in `content/blog/`, parsed with `gray-matter` + `next-mdx-remote/rsc` |
| MDX TOC | `rehype-slug` for heading IDs |
| Data persistence (signups) | **Azure Table Storage** via `@azure/data-tables` |

### Auth / security / forms

| Concern | Choice |
|---|---|
| CAPTCHA | **Google reCAPTCHA v2 / v3** via `react-google-recaptcha` (server-verified) |
| Email delivery | **SendGrid** via `@sendgrid/mail` |
| Rate limiting | In-process IP-hash bucket (`src/lib/rate-limit.ts`) |
| IP hashing | SHA-256 + per-deploy salt (`src/lib/ip-hash.ts`) — never stores raw IPs |

### Observability

| Concern | Choice |
|---|---|
| Logging / telemetry | **Azure Application Insights** (`applicationinsights` package) |
| Required Next config | `serverExternalPackages: ["applicationinsights"]` (Turbopack incompatibility otherwise) |

### Iconography + assets

- **`@fluentui/react-icons`** for general UI icons (with
  `experimental.optimizePackageImports` in `next.config.ts` to keep the
  bundle small).
- Custom Spaarke brand SVG icons in `/public/brand/icons/`.
- Microsoft logo PNG/SVG bundle in `/public/brand/logos/`.
- Architecture diagrams in `/public/brand/diagrams/`.
- Hero / animation PNGs in `/public/brand/platform-hero/` and
  `/public/brand/hero/`.

### Build / dev scripts

```jsonc
{
  "dev":       "next dev",        // Turbopack; defaults to :3000
  "build":     "next build",      // Static + SSR + sitemap
  "start":     "next start",      // Production server
  "lint":      "eslint",
  "typecheck": "tsc --noEmit"
}
```

---

## 3. Architecture

### Routing (App Router)

| Route | Type | Purpose |
|---|---|---|
| `/` | Static | Home — primary marketing landing |
| `/platform` | Static | Product overview with isometric scroller hero |
| `/why-spaarke` | Static | Insights library index |
| `/why-spaarke/[slug]` | SSG | Individual MDX blog posts |
| `/why-spaarke/rss.xml` | Dynamic | RSS feed of posts |
| `/library/[slug]` | SSG | Legacy library posts (subset of `/why-spaarke`) |
| `/about` | Static | Company / team |
| `/contact` | Dynamic | Contact form (server-rendered for CSRF freshness) |
| `/access-request` | Dynamic | Full early-access form |
| `/demo` | Dynamic | Demo request form |
| `/signin` | Static | Placeholder sign-in landing |
| `/privacy`, `/terms` | Static | Legal pages |
| `/api/contact` | Route Handler | POST contact form |
| `/api/early-release` | Route Handler | POST quick early-access (name + email) |
| `/api/registration/demo-request` | Route Handler | POST demo request (full form) |
| `/sitemap.xml` | Generated | Built from `src/app/sitemap.ts` |
| `/robots.txt` | Generated | Built from `src/app/robots.ts` |
| `/v2-tokens-check` | Static | Internal design-token verification page |

### Redirects

`next.config.ts` permanently redirects `/blog` → `/insights` and
`/blog/:slug*` → `/insights/:slug*` to preserve old links after a
section rename.

### Layout structure

```
<RootLayout>                        ← src/app/layout.tsx
  <ThemeProvider>                   ← class-based light/dark
    <Skip-to-content link>          ← a11y
    <NotificationBar />             ← top promo bar
    <SiteHeader />                  ← sticky nav
    <main id="main-content">
      {page content}                ← per-route
    </main>
    <SiteFooter />
  </ThemeProvider>
</RootLayout>
```

---

## 4. Design System & Standards

### Token model

All design tokens live in **`src/app/globals.css`**, expressed as CSS
custom properties and exposed to Tailwind via the `@theme inline { … }`
directive. There is one canonical palette per concern; tokens that flip
with theme tone are scoped to `[data-tone="light"]`.

#### v2 tokens (current system)

```
--v2-bg          page background          → utility: bg-bg
--v2-surface     elevated surface         → utility: bg-surface
--v2-surface-2   nested / hover surface   → utility: bg-surface-2
--v2-fg          primary text             → utility: text-fg
--v2-fg-mid      secondary text           → utility: text-fg-mid
--v2-fg-low      tertiary / caption       → utility: text-fg-low
--v2-line        hairline border          → utility: border-line
--v2-line-strong stronger border          → utility: border-line-strong
```

**Default values** (dark mode is the design baseline):
- `--v2-bg: #0a0a0a`, `--v2-surface: #111`, `--v2-surface-2: #161616`
- `--v2-fg: #f5f5f5`, `--v2-fg-mid: rgba(245,245,245,0.66)`,
  `--v2-fg-low: rgba(245,245,245,0.55)`
- `--v2-line: rgba(255,255,255,0.10)`, `--v2-line-strong: rgba(255,255,255,0.18)`

**Light overrides** (active inside `[data-tone="light"]` subtrees):
- `--v2-bg: #f6f6f4`, `--v2-surface: #ffffff`, `--v2-surface-2: #f0f0ee`
- `--v2-fg: #0a0a0a`, `--v2-fg-mid: rgba(10,10,10,0.62)`,
  `--v2-fg-low: rgba(10,10,10,0.60)`
- `--v2-line: rgba(10,10,10,0.10)`, `--v2-line-strong: rgba(10,10,10,0.18)`

> ⚠️ There is **no `[data-tone="dark"]` reset rule**. Setting
> `data-tone="dark"` on a child of a light slab does NOT restore the dark
> tokens — variables continue to inherit from the nearest ancestor.
> When forcing dark inside a light section (e.g. a "product mockup"
> container), use **explicit hex colors** (`#0a0a0a`, `#111`, `#fff`),
> not the tokens.

#### Brand palette

```
--color-spaarke-blue:       #000BFF   ← brand violet-blue (use sparingly)
--color-spaarke-cyan:       #00F7FF
--color-spaarke-green:      #1AFF00
--color-spaarke-lime:       #8CFF00
--color-spaarke-yellow-green: #DBFF00
--color-spaarke-yellow:     #FFD200
--color-spaarke-orange:     #FF9400
--color-spaarke-red:        #FF4600
--color-spaarke-deep-red:   #FF0000
--color-hero-red:           #FC0000

--color-cta-blue:           #4060DC   ← matches the hero glow palette
```

#### Working blue palette (used in fades, glows, diagrams)

```
#000BFF  Brand blue — high saturation, focal accents only
#3F5FD9  CTA blue (hover)
#5078DC  CTA blue (rest)             ← all primary buttons
#82A5EB  Soft glow blue              ← text-button hover
#b3c4dc  Light blue-gray             ← mid stop in fade gradients
#d2e1ff  Very light blue
#ebf2ff  Very light blue-white       ← brightest stop in fades
#f0f5ff  Pale blue wash
#1a1f2e  Dark blue                   ← bridges blue → black
```

These nine colors appear together in the hero footlight glow, the
ExistingSystems gradient transition, the MicrosoftNative section
background, the Closing section, the Platform Pillars gradient, and
the architecture diagrams.

#### Fluid spacing tokens

```
--spacing-shell-x:  clamp(24px, 6vw, 120px)    ← Shell horizontal padding
--spacing-section-y: clamp(80px, 12vh, 160px)  ← default Slab vertical padding
```

#### Type stack

| Variable | Family | Use |
|---|---|---|
| `--font-display` | Inter Tight | Display headings (`Heading` primitive) |
| `--font-body` | Inter | Body, lede |
| `--font-mono-display` | JetBrains Mono | Eyebrows, captions |
| `--font-sans` | Geist Sans | v1 components (legacy) |
| `--font-mono` | Geist Mono | v1 components (legacy) |

All loaded via `next/font/google` (self-hosted at build time).

### Primitives (`src/components/primitives/`)

| Primitive | Purpose | Notes |
|---|---|---|
| `Heading` | Display H1/H2/H3 | Fluid `clamp()` sizing per level |
| `Lede` | Section sub-paragraph | Fluid 18–25px |
| `Eyebrow` | Mono uppercase caption | 11px, 0.16em tracking |
| `Shell` | Page-width container | `mx-auto max-w-[1440px] px-[var(--spacing-shell-x)]` |
| `Slab` | Section background slab | Sets `data-tone` and standard vertical padding |
| `Button` | Primary / outline / text variants | Primary always uses inline `backgroundColor: #5078DC` for cross-route reliability |
| `PageHeader` | Eyebrow + H1 + lede block | Standard header for content pages |

### Layout rhythm

- Page width capped at **1440px** (`Shell`'s `max-w-[1440px]`).
- Horizontal padding scales **24 → 120 px** across viewports.
- Section vertical rhythm uses **`clamp()`** in the 80–160 px range.
- Sections use `<Slab tone="…">` to flip the v2 token palette.

### Responsive breakpoints (Tailwind defaults)

| Prefix | Min width |
|---|---|
| `sm:` | 640 px |
| `md:` | 768 px |
| `lg:` | 1024 px |
| `xl:` | 1280 px |
| `2xl:` | 1536 px |

### Typography rules

- **H1**: `clamp(48px, 7.5vw, 104px)`, leading 0.98, tracking -0.035em
- **H2**: `clamp(34px, 4.5vw, 64px)`, leading 1.05, tracking -0.025em
- **H3**: `clamp(20px, 1.6vw, 30px)`, leading 1.2, tracking -0.015em
- **Lede**: `clamp(18px, 1.4vw, 25px)`, leading 1.5
- All display type uses `font-feature-settings` defaults (no manual ligature overrides).

### Motion

- All animations gated by `prefers-reduced-motion` where they could
  cause discomfort (iso-scroller, hover scale on buttons, etc).
- Long animations (parallax tile scrolling) are pure CSS with `will-change`
  hints — no JS frame loops.

### Theme toggling

`ThemeProvider` (`src/components/ThemeProvider.tsx`) wraps the app and
toggles a `.dark` class on `<html>`. A small inline script in
`<head>` reads `localStorage.theme` (or `prefers-color-scheme`) before
hydration to avoid a flash. **Note**: the v1 `.dark` class is mostly
superseded by the v2 `data-tone` slab system on new pages; both
coexist while older pages migrate.

---

## 5. Page-by-page Composition

### Home (`/`)

1. **Hero** — H1 "Legal Operations / Intelligence.", subhead, two-line
   "kicker" with strong/muted color split, Watch demo + Get access CTAs,
   full-bleed product screenshot with light-blue footlight glow.
2. **GapStats** — "Demand is rising. / Resources are not." + four stats
   with sources (Axiom, LegalBillReview).
3. **ExistingSystems** — Gradient bg (`#0a0a0a → blue palette → #f6f6f4`).
   Three expandable cards aligned via **CSS subgrid**; expand uses fluid
   `grid-template-rows: 0fr → 1fr` plus delayed slide-up.
4. **LOIDiagram** — "Spaarke is built to work / how you work." Centered
   dark "product mockup" with eight labeled icon tiles (Email, Requests,
   Matters, Projects, Metrics, Tasks, Counsel, Documents).
5. **MicrosoftNative** — Light-blue ambient bg. 1/3 + 2/3 layout: title
   left ("Built natively on Microsoft. / Designed for Legal IQ."),
   tagline + Microsoft hub-and-spoke diagram stacked right.
6. **Closing** — Solid `#000000`. Headline "See all sides of every
   matter." + tagline "Unify your systems. Activate your AI. / Work
   with full context." + Get access (primary) / Why Spaarke (text+arrow).

### Platform (`/platform`)

1. **Hero** — `min-height: 92vh`, cream bg, vertically centered content.
   Backdrop is the **`IsometricScroller`** (three rows of tilted product
   screenshots scrolling on parallax tracks, anchored top-right). Headline
   "One platform. / All sides. / Every matter." + "All your legal
   work—connected." Inline `[Name] [Work email] [Get access]` form on one
   row, `Why Spaarke` text-link below.
2. **Pillars** — Solid dark section. Title "The Legal IQ system / of
   record" + tagline "A single system where legal work, data, and
   decisions come together." over the platform-architecture SVG framed
   in `#111` rounded container with hairline rim + drop shadow.
3. **Capabilities** — Title "Your ultimate system of truth" + tagline
   "Everything your legal team needs—built into one system" over five
   stacked capability sections. Each row: capability name + description
   + italic tagline; left = active feature's screenshot in a hairline
   frame; right = clickable feature list (selecting swaps the screenshot).
   Soft radial blue glow fades in per row via IntersectionObserver. Rows
   scroll naturally — no sticky-stack pinning (see §11 *History*).
4. **SpaarkeAI** — Solid dark section (`#0a0a0a`). Title "Legal AI built
   into the system / —not bolted on" + tagline introducing generative,
   agentic, autonomous capabilities. Below: `spaarke-ai-architecture.svg`
   (dark-mode native) inlined into the page DOM via `InlineSvg` so the
   embedded Microsoft logos resolve. Hidden below `md:` with a prose
   substitute (the diagram is dense reference content).
5. **DeploymentModels** — Light-blue ambient bg (matches MicrosoftNative).
   Title "Your data. / Your content. / Full control." with copy on the
   right. Below: centered "One Platform. Two deployment models." subtitle
   + drag-to-reveal `ArchitectureCompareSlider` that wipes between
   Spaarke-hosted and Customer-hosted architecture SVGs. Slider hidden
   below `md:` with two-card prose substitute.
6. **PlatformClosing** — Solid `#000000`. Word-only Spaarke logo as
   headline + two-line tagline ("A single system for legal work, data,
   and decisions." / "Not another tool. A new way to run legal."), each
   line `whitespace-nowrap` so they don't wrap on desktop. Get access
   (primary, → `/access-request`) + Contact us (text+arrow, → `/contact`)
   CTAs.

### Why Spaarke (`/why-spaarke`)

Library index — auto-rotating featured-article hero + filterable post
list (by org, function, topic, theme tags).

### Why Spaarke posts (`/why-spaarke/[slug]`)

MDX-rendered article with sidebar (TOC, related posts), structured
metadata, JSON-LD Article schema, RSS feed entry.

---

## 6. Key Components Inventory

### Section components (`src/components/sections/`)

`Hero`, `HeroCTAs`, `GapStats`, `ExistingSystems`, `LOIDiagram`,
`MicrosoftNative`, `Pillars`, `Capabilities` (with `Foundation` export
— still defined but no longer rendered on `/platform`), `CapabilityModule`,
`DeploymentModels`, `Closing`, `WhySpaarkeHero`, `WhySpaarkeLibrary`. The
`/platform` page also defines two inline section components — `SpaarkeAI`
and `PlatformClosing` — directly in `src/app/platform/page.tsx`.

### Shared / utility components (`src/components/`)

| Component | Role |
|---|---|
| `SiteHeader` | Sticky top nav with mobile drawer |
| `SiteFooter` | Multi-column footer with platform deep-links |
| `NotificationBar` | Dismissible top promo bar |
| `IsometricScroller` | 3D-tilted parallax tile scroller |
| `InlineSvg` | Server component that reads an SVG from `/public` at render time and inlines its markup via `dangerouslySetInnerHTML`. Required for diagrams whose `<image href>` references must resolve in document context (see §11 *Diagram image strategy*) |
| `ArchitectureCompareSlider` | Drag-to-reveal client component that wipes between two SVG layers; the parent server component reads each SVG and passes content as a `topSvg` / `bottomSvg` string prop |
| `ProductChrome` | Shared "browser-window-style" mockup chrome |
| `WatchDemoModal` | Demo video modal |
| `GetAccessModal` | Quick email-capture modal (used by `/platform`) |
| `PlatformHeroCTAs` | Client form: inline `Name + Work email + Get access`, posts to `/api/early-release` with invisible reCAPTCHA |
| `DemoRequestForm` | Full demo registration form |
| `ContactForm` | Contact-page form |
| `EarlyReleaseForm` | Quick name+email signup form |
| `ArticleCard`, `PostCard`, `ArticleSidebar`, `BlogFilteredList`, `LibrarySection` | Insights library UI |
| `FormField`, `InlineAlert` | Form building blocks |
| `TagPills` | Tag chip group for filtering |
| `ThemeProvider`, `ThemeToggle` | Theme handling |
| `SpaarkeLogoAnimation` | Logo motion intro |

### Content (`src/content/`)

Strongly-typed data modules consumed by section components:

```
src/content/
├── footer.ts
├── nav.ts
├── notification-bar.ts
└── home/
    ├── hero.ts
    ├── gap.ts
    ├── existing-systems.ts
    ├── loi-diagram.ts
    ├── microsoft-native.ts
    ├── pillars.ts
    ├── capabilities.ts
    └── closing.ts
```

Each module exports a typed object with `as const` tuples for layout
guarantees (e.g., `[Stat, Stat, Stat, Stat]`).

---

## 7. SEO Optimization

The SEO layer is engineered for both classical search (Google, Bing)
and **AI-assisted discovery** (LLM crawlers, AI search results).

### Metadata

- Site title template: **`%s | Spaarke`** (from `RootLayout`).
- Default site title: **`Spaarke | Legal Operations Intelligence`**.
- `metadataBase` set from `process.env.SITE_URL` so all relative OG
  URLs resolve against the canonical origin.
- Per-page `metadata` exported from each `page.tsx` (Next App Router).

### Structured data (JSON-LD)

Site-wide (in `RootLayout`):

- **`Organization`** — name, URL, description, optional `sameAs` social
  profiles.
- **`WebSite`** — enables sitelinks search box in Google results.

Per-blog-post (in `src/lib/seo.ts`):

- **`Article`** schema with:
  - `headline`, `description`, `abstract`
  - `datePublished`, `dateModified`
  - `author` + `publisher` (both `Organization` typed)
  - `mainEntityOfPage` URL
  - `image`, `keywords`, `articleSection`
  - **`about`** — entity references generated from each post's
    `topic` + `theme` tags (helps AI understand subject matter).
  - **`speakable`** — `SpeakableSpecification` listing CSS selectors
    that AI assistants should prefer for text-to-speech / summary
    extraction (`article h1`, `[data-summary]`, etc).

### Open Graph + Twitter

- Per-post OG metadata with `published_time`, `modified_time`,
  `authors`, `tags`, hero image.
- Twitter `summary_large_image` cards.
- `article:section` and `article:tag` `<meta>` tags for AI crawler
  signals.

### Sitemap (`src/app/sitemap.ts`)

- Static pages enumerated with explicit `priority` weights:
  - `/` → 1.0 (weekly)
  - `/platform`, `/why-spaarke` → 0.9 (monthly)
  - everything else → 0.5
- All blog posts appended at 0.7 with `lastModified` from frontmatter.

### Robots (`src/app/robots.ts`)

- Single rule: `User-agent: *, Allow: /`.
- Sitemap declared at the canonical origin.

### Canonicals

- Each blog post's `Metadata.alternates.canonical` is set to the
  absolute post URL.
- Other pages inherit the `metadataBase` for stable canonical resolution.

### RSS

- `/why-spaarke/rss.xml` (dynamic) emits the post feed.
- `RootLayout.metadata.alternates.types["application/rss+xml"]` declares
  the feed so feed readers can auto-discover.

### Performance signals (also feed SEO)

- Static-prerendered home and platform pages (no SSR per request).
- Images use `<Image>` with explicit dimensions (CLS prevention).
- Lazy-loading + `decoding="async"` on heavy below-fold images
  (architecture diagrams, mockups).
- Hero footlight glow (heavy 36px blur) hidden `<sm` to protect mobile
  performance.

---

## 8. Accessibility

- **Skip link** as first focusable element in `<body>` (jumps to
  `#main-content`).
- All interactive elements have visible focus rings
  (`focus-visible:ring-spaarke-blue`).
- All decorative SVGs / overlays use `aria-hidden="true"` and
  `pointer-events-none`.
- All meaningful images have `alt` text; the architecture diagrams
  carry full descriptive `aria-label`s.
- `prefers-reduced-motion` disables the iso-scroller animation.
- Modals (`WatchDemoModal`, `GetAccessModal`) implement:
  - `role="dialog"`, `aria-modal="true"`, `aria-label`
  - Esc-to-close, backdrop-click close
  - Focus moved into the dialog on open, restored on close
  - Body scroll locked while open
- Form fields use proper `<label>` + `id` association.
- Color choices verified for **WCAG AA** contrast on body text against
  the relevant tone tokens (e.g., `--v2-fg-low` is documented as
  4.5:1 over its background).

---

## 9. Forms & APIs

### `POST /api/early-release`

Quick signup (used by `GetAccessModal`).

| Field | Type | Required |
|---|---|---|
| `name` | string ≤ 100 | ✅ |
| `email` | RFC-ish email, 3–254 chars | ✅ |
| `captchaToken` | reCAPTCHA token | ✅ when `RECAPTCHA_SECRET_KEY` set |

**Pipeline**:
1. Rate-limit by hashed IP (`checkRateLimit`).
2. Validate inputs.
3. Verify reCAPTCHA via Google's `siteverify` endpoint.
4. Persist row to Azure Table Storage table `EarlyReleaseSignups`.
5. Send notification email via SendGrid.
6. Track event in App Insights.

### `POST /api/registration/demo-request`

Full demo registration form (`DemoRequestForm`). Captures
firstName / lastName / workEmail / organization / useCase / consent.
**Unlike the other two forms, this is a thin proxy** that validates +
CAPTCHA-checks server-side, then forwards the payload to **Sprk.Bff.Api**
in the main Spaarke codebase (`BFF_API_URL` env var). The BFF owns
the full lifecycle: Dataverse persistence, duplicate detection, admin
notification, applicant acknowledgement, manual approval workflow,
9-step automated provisioning (Entra user, license assignment,
Power Platform team, SharePoint Embedded permissions, welcome email),
and daily expiration worker. See the integration doc:
[`docs/demo-request-flow.md`](demo-request-flow.md).

### `POST /api/contact`

Contact form (`ContactForm`). Same validation + email pattern.

### Shared utilities (`src/lib/`)

- `email.ts` — SendGrid wrappers, with subject + template per form.
- `storage.ts` — Azure Table Storage helpers.
- `rate-limit.ts` — In-memory IP-bucket limiter.
- `ip-hash.ts` — SHA-256 hash with per-deploy salt.
- `logger.ts` — App Insights wrappers (`trackEvent`, `trackException`).
- `contact.ts` — Contact-form-specific validation and types.

---

## 10. Content Management (MDX blog)

### Source location

`content/blog/YYYY-MM-DD-slug.mdx` — date-prefixed file names sort
chronologically; slug is derived from the filename.

### Frontmatter shape (per post)

```yaml
title:        string                    # required
description:  string                    # required (used as fallback for OG)
summary:      string                    # short abstract for cards + JSON-LD
author:       string                    # display name
date:         YYYY-MM-DD                # published date (ISO)
posted:       YYYY-MM-DD                # last-modified (ISO, optional)
draft:        boolean                   # default false
heroImage:    string                    # public URL, e.g. /articles/<slug>/hero.jpg
heroPosition: string                    # CSS object-position override
tags:
  organization: [string]                # who: corporate-counsel, law-firm, …
  function:     [string]                # what role: matter-mgmt, billing, …
  topic:        [string]                # subject
  theme:        [string]                # editorial theme
```

### Parser (`src/lib/blog.ts`)

- Reads files at build time.
- `getAllPosts()` filters out drafts and sorts by date desc.
- `flattenTags()` merges all four tag categories into a single
  comma-separated list for keyword fields.

### Render

- Index: `/why-spaarke` (`WhySpaarkeLibrary` renders `BlogFilteredList`
  with `TagPills` filter UI).
- Post page: `/why-spaarke/[slug]` (`PostHeader`, `ArticleSidebar`,
  MDX body via `next-mdx-remote/rsc`, with `rehype-slug` for heading
  IDs feeding the sidebar TOC).

### Hero image workflow

Article hero images live at `/public/articles/<slug>/hero.jpg`.
**Replacement rule**: when updating an already-deployed article's hero,
**version the filename** (`hero.jpg` → `hero-v2.jpg`) and update the
`heroImage` frontmatter — Next's `<Image>` optimizer caches by source
URL, so reusing the same path serves the stale image from every cache
layer (browser, Azure SWA edge, local Turbopack `.next/dev/cache/images/`).
Documented in `templates/README.md`.

---

## 11. Special Components & Animations

### `IsometricScroller` (`src/components/IsometricScroller.tsx`)

Animated decorative backdrop used on the Platform hero.

- 3 rows of tilted product screenshots scrolling horizontally.
- Two rows scroll left at 60s + 75s, third scrolls right at 75s
  (parallax).
- Rendered with a 3D `perspective(1400px) rotateX(38deg) rotateZ(18deg)`
  transform.
- CSS-only `@keyframes` — no JS frame loop.
- `prefers-reduced-motion` stops the animation entirely.
- Two themes (`"dark"` / `"light"`) and three anchor positions
  (`"center"`, `"top"`, `"top-right"`).

### Capability rows (natural scroll)

Each capability is a regular non-sticky section that scrolls naturally.
Inside each row: capability name + description + italic tagline up top;
50/50 grid below with a fixed-aspect screenshot frame on the left and a
clickable feature list on the right (selecting a feature swaps the
screenshot via React state — no scroll-driven changes). A radial blue
spotlight (`#82A5EB / #5078DC`) fades in per row via IntersectionObserver
(`rootMargin: "-120px 0px -40% 0px"`) as the row enters the reading band.

> **History:** through 2026-05 we used a `position: sticky; top: 380` /
> `top: 100` "sticky-stack" pattern where each row pinned and the next
> slid over it. It looked great at the design viewport but failed on
> shorter screens (when `viewport.height < module.height + 380px` the
> bottom of each row sat below the fold and was covered before the user
> could read it). The screenshot column also had its own `md:sticky`,
> compounding the issue. Replaced with natural scroll on commit `ae0717b`.

### CSS subgrid card alignment

`ExistingSystems` cards align five internal rows (title, summary,
expand region, spacer, button) across all three cards via
`md:grid-rows-subgrid` on each card and explicit
`md:grid-rows-[auto_auto_auto_1fr_auto]` on the parent.

### Fluid expand animation

The `Read more` panels in `ExistingSystems` cards animate
`grid-template-rows: 0fr → 1fr` (browser-native height interpolation,
no JS measurement) with the inner detail block fading in + sliding up
from `translate-y-3` on a 150ms delay.

### Diagram image strategy (slim SVGs + inline rendering)

Every architecture diagram in `/public/brand/diagrams/` is a
hand-authored SVG that combines vector shapes/text with embedded raster
logos (Microsoft product icons, the spaarke wordmark, etc.). Two rules
must hold for diagrams to render correctly *and* to ship through Azure
SWA:

**1. SVGs must NOT carry inline base64 image data.**
SVGs with several embedded `data:image/png;base64,...` URIs in 60-65k-
character single lines (the typical product of design-tool exports)
caused the SWA Functions deploy step to fail consistently with
`Failed to deploy the Azure Functions` (no Azure-side detail). Bisected
in 2026-05 against the pair of `architecture-spaarke-hosted.svg` /
`architecture-customer-hosted.svg` files. Every SVG that ships now
references its raster assets as separate files.

**Tooling**: `scripts/slim-svgs.mjs` walks the in-use diagram SVGs,
hashes every `data:image/...` URI, writes the binary to
`/public/brand/diagrams/_extracted/img-<sha1-12>.<ext>`, and rewrites
the SVG to `<image href="/brand/diagrams/_extracted/...">`. Net effect
on the 5 in-use diagrams: **5.44 MB → 75 KB** of SVG markup, with 25
unique extracted assets (~2 MB total) cached and lazy-loaded
independently by the browser. **Run the script after any new diagram
is added that contains embedded data URIs.**

**2. Slim SVGs must be inlined into the page DOM, not loaded as `<img>`
or `<object>`.**
When an SVG is rendered as `<img src>`, browsers sandbox it and block
external resource loads, so `<image href="/brand/diagrams/_extracted/...">`
references inside it never load. `<object data>` loads the SVG as a
document but produces inconsistent sizing across browsers (default
300×150 box, no intrinsic dimensions from the SVG).

**Rendering pattern**: server components use `<InlineSvg src="..."
ariaLabel="...">`, which reads the file at render time via
`fs.readFileSync` and inlines via `dangerouslySetInnerHTML`. The SVG
markup becomes part of the page DOM and the browser fetches its
referenced `<image>` assets like any other URL. For client components
(currently only `ArchitectureCompareSlider`), the parent server component
reads the SVG and passes content as a string prop.

**Mobile guard**: every dense reference diagram uses `hidden md:block`
plus a prose substitute below `md:`. Tiny labels in a complex SVG don't
read on phones; swapping for natural-language summaries on narrow
viewports is the established pattern.

**Active diagrams** (all dark-mode native, slimmed, inlined):
- `platform-arch-v3-dark.svg` — Pillars architecture (home + platform)
- `microsoft-connect-v2-light.svg` — MicrosoftNative hub-and-spoke (home)
- `spaarke-ai-architecture.svg` — SpaarkeAI section (platform)
- `architecture-spaarke-hosted.svg` / `architecture-customer-hosted.svg`
  — DeploymentModels compare slider; both must share byte-identical
  coordinates so the wipe boundary lands on matching elements

**Filter conventions** (kept on `platform-arch-v3-dark.svg`):
- `#logo-depth` — `feDropShadow dy=6 stdDeviation=8 opacity=0.55`
  applied to the Microsoft logo tiles.
- `#copilot-depth` — `feDropShadow dy=10 stdDeviation=14 opacity=0.45`
  applied to the bottom Copilot pill for stronger emphasis.

The Copilot badge SVG (`microsoft-365-copilot-badge.svg`) bakes in the
black "M365" chip; a chip-less variant
(`microsoft-365-copilot-ribbon.svg`) is also published for cases where
the chip is unwanted.

---

## 12. Deployment & Hosting

- **Host**: Azure Static Web Apps (**Standard** SKU). Resource:
  `swa-spaarke-website` in resource group `rg-spaarke-website` (East US 2).
  Default hostname `ambitious-bay-0fb5bb10f.1.azurestaticapps.net`,
  custom domains `spaarke.com` + `www.spaarke.com`.
- **Workflow**: `.github/workflows/azure-static-web-apps-ambitious-bay-0fb5bb10f.yml`
  triggers on push to `main`. Build and deploy job typically completes
  in 4–7 minutes.
- **Environment variables** (set via `az staticwebapp appsettings set`):
  - `SITE_URL`
  - `RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY`
  - `STORAGE_ACCOUNT_CONNECTION` (Azure Tables)
  - `SENDGRID_API_KEY`, sender / recipient addresses
  - `APPLICATIONINSIGHTS_CONNECTION_STRING`
- **Build output**: `output_location: ".next"` in the SWA workflow.

> **SKU history**: Originally provisioned on Free. Upgraded to **Standard**
> on 2026-05-05 while diagnosing a deploy regression. The SKU upgrade
> alone did **not** fix the deploys — the actual cause was the embedded-
> base64 SVGs documented in §11. Standard was retained because it lifts
> the Functions package size limit (Free ≈100 MB compressed → Standard
> 1.5 GB) and gives us headroom as the SSR bundle grows. Cost ~ $9/mo
> per app at the time of writing.

### Provisioning

`infra/provision.sh` (referenced in commit history) provisions the
Azure resources end-to-end. Documented in
`memory/MEMORY.md` for repeatability.

### Deploy regression playbook

If a `Failed to deploy the Azure Functions` error appears with a
successful build, work through these in order. The two known-causes
are documented separately because they manifest with the same generic
error message but have different root causes and fixes.

**Cause 1 (most common): Functions package > 100 MB.**

Azure SWA bundles `/public/` + `.next/standalone/` into the Functions
zip. The hard limit is **104,857,600 bytes (100 MB)**, and Next.js's
`node_modules/@next/swc-*` native binary alone is ~120 MB. Without
stripping it pre-package, the Functions zip is over budget and any
`/public/` addition tips it over. Symptom: deploy poll says
`Status: Failed` at almost exactly **15 seconds** post-upload.

**Fix** (already applied in
`.github/workflows/azure-static-web-apps-...yml`):

```yaml
api_build_command: 'rm -rf ./node_modules/@next/swc-* && rm -rf ./.next/cache'
```

Strips both before the zip is built. **Do not remove this line** — it
is a permanent requirement for this site, not a one-time fix. See
[Azure/static-web-apps#1034](https://github.com/Azure/static-web-apps/issues/1034).

If a future deploy fails with "Failed to deploy the Azure Functions"
at the 15-second mark, the most likely cause is that someone removed
the `api_build_command` line or the build started shipping a new
~100 MB native binary that needs adding to the strip list.

**Cause 2 (older, more rare): SVG with embedded base64 data URIs.**

SVGs with several `data:image/png;base64,...` URIs in 60-65k-character
single lines (the typical product of design-tool exports) cause the
deploy to fail before it even uploads the zip. Symptom: failure during
the build phase, not the polling phase, with a different error log
pointing at SVG processing. Bisected in 2026-05 against the diagram
SVGs.

**Fix**: `node scripts/slim-svgs.mjs` walks diagram SVGs, hashes every
`data:image/...` URI, writes the binary to
`/public/brand/diagrams/_extracted/img-<sha1-12>.<ext>`, and rewrites
the SVG to `<image href="...">`. **Run the script after any new
diagram is added that contains embedded data URIs.** See §11 above.

**General tools**:
1. Compare the latest Api Artifact zip duration in the workflow log
   against a known-green run. Equal duration → not a size issue.
2. Confirm Azure-side: `az staticwebapp environment list -n
   swa-spaarke-website -g rg-spaarke-website -o table`. The
   `default` build will show `status: Failed`.
3. SWA CLI direct deploy (`npx @azure/static-web-apps-cli deploy …`)
   is **not** a useful diagnostic for Functions failures because it
   skips the Oryx + function-handler-build path entirely.

---

## 13. Analytics & Observability

- **Application Insights** captures:
  - Page view events (auto)
  - Custom events: `early_release.success`, `early_release.rate_limited`,
    `early_release.captcha_failed`, plus equivalents for the other
    forms.
  - Server exceptions (`trackException` from each route handler).
- Email is hashed in event payloads to avoid storing raw PII in
  telemetry (`email.replace(/@.*/, "@***")`).

---

## 14. Browser & Device Support

- **Modern evergreen browsers** (Chrome / Edge / Safari / Firefox latest
  two majors).
- **Required features used**:
  - CSS Grid + `grid-template-rows: subgrid` (Chrome 117+, Firefox 71+,
    Safari 16+).
  - CSS Grid `1fr → 0fr` row-template animation (Chrome 109+,
    Firefox 116+, Safari 17.4+).
  - CSS `clamp()`, `min()`, `max()`.
  - CSS custom properties (`--var`) and `@theme inline` (Tailwind v4).
- Mobile / responsive validated at 375 / 640 / 768 / 1024 / 1440 /
  1920 px viewports.
- Prefers-reduced-motion respected for the iso-scroller and other
  long-running animations.

---

## 15. Memory / Documentation

A persistent project memory lives at:

```
~/.claude/projects/c--code-files-spaarke-website/memory/
```

Contains:

- `MEMORY.md` — index of project memory pointers.
- Notes on Tailwind v4 quirks, Next 16 / Turbopack quirks
  (e.g. the `applicationinsights` + Turbopack incompatibility),
  Azure CLI on Git Bash, the design-framework decision (Tailwind for
  marketing site, Fluent for in-app UI, Fluent icons as the bridge).

Per-page editorial / design briefs and handoffs live under:

```
projects/                              ← internal planning + design briefs
resources/                             ← raw asset stage (gitignored)
templates/                             ← article templates + workflow docs
docs/                                  ← public documentation (this file)
```

---

## 16. Open Items / Known Gaps

- `[data-tone="dark"]` reset rule not declared in `globals.css` —
  forced-dark elements inside light slabs use explicit hex colors.
- Tailwind v4 JIT compilation of arbitrary-value classes (e.g.
  `bg-[#5078DC]`) can be inconsistent across routes during dev; the
  `Button` primary variant works around this with an inline-style
  fallback.
- Per-route reCAPTCHA wiring on `GetAccessModal` is currently a stub
  (sends an empty token); the API tolerates this when
  `RECAPTCHA_SECRET_KEY` is unset. Wire reCAPTCHA fully before public
  launch.
- v1 components (`HeroSection`, `FeatureGrid`, `Container`, etc.) and
  v2 components coexist while pages migrate; eventual cleanup of
  unused v1 code is pending.
- `Foundation` (`src/components/sections/Capabilities.tsx`) is exported
  but no longer rendered after `/platform` was reorganized to use
  `PlatformClosing`. Safe to delete or repurpose once we're confident
  it isn't coming back.
- New SVGs added to `/public/brand/diagrams/` must be (a) free of
  embedded base64 data URIs (run `scripts/slim-svgs.mjs` if they
  contain any) and (b) rendered via `InlineSvg` rather than `<img>` /
  `<object>`. The slim script accepts a hard-coded `TARGETS` list — add
  any new diagram filename there before running.
